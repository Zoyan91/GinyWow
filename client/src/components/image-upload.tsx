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
        title: "Thumbnail uploaded successfully!",
        description: "AI analysis complete. Check out your enhanced thumbnail below.",
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
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="image-upload-card">
      <CardContent className="p-8">
        <h3 className="text-2xl font-semibold mb-6 flex items-center">
          <i className="fas fa-upload text-primary mr-3"></i>
          Upload Your Thumbnail
        </h3>
        
        <motion.div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }
          `}
          whileHover={{ scale: isDragActive ? 1.05 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="upload-dropzone"
        >
          <input {...getInputProps()} data-testid="file-input" />
          
          {uploadMutation.isPending ? (
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <motion.i
                  className="fas fa-cloud-upload-alt text-3xl text-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">Processing your thumbnail...</h4>
                <p className="text-muted-foreground">AI is analyzing and enhancing your image</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center"
              >
                <i className="fas fa-cloud-upload-alt text-3xl text-muted-foreground"></i>
              </motion.div>
              
              <div>
                <h4 className="text-xl font-medium mb-2">
                  {isDragActive ? "Drop your thumbnail here" : "Drag & drop your thumbnail here"}
                </h4>
                <p className="text-muted-foreground mb-4">or click to browse files</p>
                
                <Button 
                  type="button" 
                  className="px-8 py-3 bg-primary hover:bg-primary/90"
                  data-testid="browse-files-button"
                >
                  <i className="fas fa-folder-open mr-2"></i>
                  Choose File
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WebP • Max 10MB
              </p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}
