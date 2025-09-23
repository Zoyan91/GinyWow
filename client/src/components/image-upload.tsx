import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Thumbnail } from "@shared/schema";

interface ImageUploadProps {
  onThumbnailUploaded: (thumbnail: Thumbnail) => void;
}

export default function ImageUpload({ onThumbnailUploaded }: ImageUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('thumbnail', file);
      
      const response = await apiRequest('POST', '/api/thumbnails/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      onThumbnailUploaded(data.thumbnail);
      toast({
        title: "Image uploaded successfully!",
        description: "AI analysis complete. Check out your enhanced image below.",
      });
      setUploadProgress(0);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Simulate upload progress
      setUploadProgress(20);
      setTimeout(() => setUploadProgress(60), 500);
      setTimeout(() => setUploadProgress(90), 1000);
      
      uploadMutation.mutate(file);
    }
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <Card className="card-mobile" data-testid="image-upload-card">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <h3 className="text-responsive-lg font-semibold mb-4 sm:mb-6 flex items-center">
          <i className="fas fa-upload text-primary mr-2 sm:mr-3"></i>
          Upload Your Image
        </h3>
        
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center cursor-pointer transition-all duration-300
            min-h-[200px] sm:min-h-[240px] flex items-center justify-center
            ${isDragActive 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98]'
            }
            ${uploadMutation.isPending ? 'pointer-events-none opacity-70' : ''}
          `}
          data-testid="upload-dropzone"
        >
          <input {...getInputProps()} data-testid="file-input" />
          
          {uploadMutation.isPending ? (
            <div className="space-y-3 sm:space-y-4 w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <motion.i
                  className="fas fa-cloud-upload-alt text-xl sm:text-2xl lg:text-3xl text-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-medium">Processing your image...</h4>
                <p className="text-sm text-muted-foreground">AI is analyzing and enhancing your image</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 w-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center"
              >
                <i className="fas fa-cloud-upload-alt text-xl sm:text-2xl lg:text-3xl text-muted-foreground"></i>
              </motion.div>
              
              <div>
                <h4 className="text-base sm:text-lg lg:text-xl font-medium mb-2">
                  {isDragActive ? "Drop your image here" : "Drag & drop your image here"}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">or tap to browse files</p>
                
                <Button 
                  type="button" 
                  className="btn-mobile bg-primary hover:bg-primary/90"
                  data-testid="browse-files-button"
                >
                  <i className="fas fa-folder-open mr-2"></i>
                  Choose File
                </Button>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground">
                Supports JPG, PNG, WebP • Max 10MB
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
