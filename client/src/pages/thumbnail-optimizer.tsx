import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Zap, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

interface OptimizationResult {
  success: boolean;
  originalImage: string;
  optimizedImage: string;
  originalSize: number;
  optimizedSize: number;
  sizeReduction: number;
  downloadName: string;
}

export default function ThumbnailOptimizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (jpg/png only)
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG and PNG files are supported.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear previous results
    setOptimizationResult(null);
  };

  const optimizeThumbnail = async () => {
    if (!selectedFile) return;
    
    setIsOptimizing(true);
    
    try {
      const formData = new FormData();
      formData.append('thumbnail', selectedFile);
      
      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Optimization failed');
      }
      
      const result: OptimizationResult = await response.json();
      setOptimizationResult(result);
      
      toast({
        title: "Thumbnail optimized successfully!",
        description: "Enhanced brightness, contrast, and sharpness applied.",
      });
      
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const downloadOptimized = () => {
    if (!optimizationResult) return;
    
    const link = document.createElement('a');
    link.href = optimizationResult.optimizedImage;
    link.download = optimizationResult.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>GinyWow – Thumbnail Optimizer</title>
        <meta name="description" content="Free online thumbnail optimizer. Enhance brightness, contrast, and sharpness for better CTR. Perfect for YouTube thumbnails." />
      </Helmet>
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            GinyWow – Thumbnail Optimizer
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Upload Your Thumbnail
            </h2>
            <p className="text-gray-600">
              Upload a thumbnail image to enhance brightness, contrast, and sharpness
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
              {!previewImage ? (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileSelect}
                      data-testid="file-upload"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG (Max: 5MB)
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full max-h-48 mx-auto rounded-lg shadow-sm mb-4"
                  />
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={optimizeThumbnail}
                      disabled={isOptimizing}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 font-medium w-full"
                      data-testid="optimize-button"
                    >
                      {isOptimizing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Optimize Now
                        </>
                      )}
                    </Button>
                    
                    <label htmlFor="file-upload-replace" className="cursor-pointer block">
                      <span className="inline-flex items-center justify-center px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Different
                      </span>
                      <input
                        id="file-upload-replace"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section - Side by Side */}
        {optimizationResult && (
          <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Before & After Comparison
            </h2>
            
            {/* Desktop: Side-by-side, Mobile: Stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Original Thumbnail */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Original Thumbnail</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <img
                    src={optimizationResult.originalImage}
                    alt="Original thumbnail"
                    className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
              
              {/* Optimized Thumbnail */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Optimized Thumbnail</h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <img
                    src={optimizationResult.optimizedImage}
                    alt="Optimized thumbnail"
                    className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Download Button */}
            <div className="text-center mb-6">
              <Button
                onClick={downloadOptimized}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 font-medium text-lg"
                data-testid="download-button"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Optimized Thumbnail
              </Button>
            </div>
            
            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 text-center text-sm">
                <strong>Tips:</strong> Use bold text, bright colors, and centered subject for best CTR
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            Optimized by GinyWow
          </p>
        </div>
      </footer>
    </div>
  );
}