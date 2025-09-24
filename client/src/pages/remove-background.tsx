import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Download, Loader2, ArrowLeft, Check, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ProcessResult {
  success: boolean;
  processedImage?: string;
  downloadName?: string;
  error?: string;
}

export default function RemoveBackgroundPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const { toast } = useToast();

  const removeBackgroundMutation = useMutation({
    mutationFn: async (file: File): Promise<ProcessResult> => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiRequest('POST', '/api/remove-background', formData);
      
      return await response.json();
    },
    onSuccess: (result) => {
      if (result.success && result.processedImage) {
        setProcessedImage(result.processedImage);
        toast({
          title: "Success!",
          description: "Background removed successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove background",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove background. Please try again.",
        variant: "destructive",
      });
      console.error("Background removal error:", error);
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleRemoveBackground = () => {
    if (originalFile) {
      removeBackgroundMutation.mutate(originalFile);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `no-bg-${fileName.replace(/\.[^/.]+$/, '.png')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleStartOver = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setFileName("");
    setOriginalFile(null);
  };

  return (

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <Header currentPage="Remove Background" />
        
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/image" className="hover:text-blue-600">Image Tools</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Remove Background</span>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-testid="page-title">
              Remove Background
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-testid="page-description">
              Remove image backgrounds instantly with AI. Perfect for product photos, portraits, and graphics.
            </p>
          </div>

          {/* Main Tool Interface */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900">AI Background Remover</CardTitle>
                <p className="text-gray-600">Upload an image to automatically remove its background</p>
              </CardHeader>
              <CardContent className="p-6">
                {!originalImage ? (
                  /* Upload Area */
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive 
                        ? "border-red-400 bg-red-50" 
                        : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                    }`}
                    data-testid="upload-area"
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {isDragActive ? "Drop your image here" : "Upload an image"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      or drag and drop your image file
                    </p>
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3">
                      Choose Image
                    </Button>
                    <p className="text-sm text-gray-400 mt-4">
                      Supports JPG, PNG, WebP, BMP up to 10MB
                    </p>
                  </div>
                ) : (
                  /* Processing Area */
                  <div className="space-y-6">
                    {/* Before/After Images */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Original Image */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 text-center">Original</h3>
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={originalImage} 
                            alt="Original" 
                            className="w-full h-64 object-contain"
                            data-testid="original-image"
                          />
                        </div>
                      </div>

                      {/* Processed Image */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 text-center">Background Removed</h3>
                        <div className="relative bg-transparent bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px] rounded-lg overflow-hidden h-64 flex items-center justify-center">
                          {removeBackgroundMutation.isPending ? (
                            <div className="flex flex-col items-center gap-3">
                              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                              <p className="text-sm text-gray-600">Removing background...</p>
                            </div>
                          ) : processedImage ? (
                            <img 
                              src={processedImage} 
                              alt="Background removed" 
                              className="max-w-full max-h-full object-contain"
                              data-testid="processed-image"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <Trash2 className="w-12 h-12 mx-auto mb-2" />
                              <p>Click "Remove Background" to start</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {!processedImage && !removeBackgroundMutation.isPending && (
                        <Button 
                          onClick={handleRemoveBackground}
                          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 flex items-center gap-2"
                          data-testid="remove-bg-button"
                        >
                          <Trash2 className="w-5 h-5" />
                          Remove Background
                        </Button>
                      )}
                      
                      {processedImage && (
                        <Button 
                          onClick={handleDownload}
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 flex items-center gap-2"
                          data-testid="download-button"
                        >
                          <Download className="w-5 h-5" />
                          Download PNG
                        </Button>
                      )}
                      
                      <Button 
                        onClick={handleStartOver}
                        variant="outline"
                        className="px-8 py-3 flex items-center gap-2"
                        data-testid="start-over-button"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Section */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-900">Clear Subject:</strong> Images with clear subjects work best
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-900">Good Lighting:</strong> Well-lit images give better results
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-900">High Resolution:</strong> Higher quality images work better
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-900">Simple Backgrounds:</strong> Avoid complex patterns
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
}