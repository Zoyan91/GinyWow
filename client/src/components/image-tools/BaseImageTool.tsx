import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, AlertCircle } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface BaseImageToolProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  onProcess: (file: File, options: any) => Promise<ProcessResult>;
  processButtonText?: string;
  className?: string;
}

export interface ProcessResult {
  success: boolean;
  processedImage?: string;
  downloadName?: string;
  error?: string;
  metadata?: any;
}

export default function BaseImageTool({
  title,
  description,
  children,
  onProcess,
  processButtonText = "Process Image",
  className = ""
}: BaseImageToolProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [toolOptions, setToolOptions] = useState<any>({});

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedFile(file);
    setSelectedPreview(preview);
    setResult(null);
  }, []);

  const handleImageRemove = useCallback(() => {
    setSelectedFile(null);
    setSelectedPreview("");
    setResult(null);
  }, []);

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const processResult = await onProcess(selectedFile, toolOptions);
      setResult(processResult);
    } catch (error) {
      console.error('Processing error:', error);
      setResult({
        success: false,
        error: 'An error occurred while processing the image. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result?.processedImage) return;

    const link = document.createElement('a');
    link.href = result.processedImage;
    link.download = result.downloadName || 'processed_image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedPreview("");
    setResult(null);
    setToolOptions({});
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${className}`}>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <ImageUpload
            onImageSelect={handleImageSelect}
            onImageRemove={handleImageRemove}
            selectedImage={selectedPreview}
          />
        </div>

        {/* Tool Options */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Options</h2>
          <Card>
            <CardContent className="p-4">
              {children ? (
                <div className="space-y-4">
                  {children}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No additional options for this tool
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Process Button */}
      {selectedFile && (
        <div className="text-center">
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            size="lg"
            className="px-8"
            data-testid="process-image-button"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              processButtonText
            )}
          </Button>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          {result.success && result.processedImage ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">✅ Processing Complete</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Original */}
                  <div>
                    <h3 className="font-semibold mb-2">Original</h3>
                    <img
                      src={selectedPreview}
                      alt="Original"
                      className="w-full rounded-lg border"
                      data-testid="original-image"
                    />
                  </div>
                  
                  {/* Processed */}
                  <div>
                    <h3 className="font-semibold mb-2">Processed</h3>
                    <img
                      src={result.processedImage}
                      alt="Processed"
                      className="w-full rounded-lg border"
                      data-testid="processed-image"
                    />
                  </div>
                </div>

                {/* Metadata */}
                {result.metadata && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Processing Details</h4>
                    <div className="text-sm text-gray-600">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span>{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    data-testid="download-result-button"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Result
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    size="lg"
                    data-testid="process-another-button"
                  >
                    Process Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Processing Failed</span>
                </div>
                <p className="text-red-600 mt-2" data-testid="error-message">
                  {result.error || 'An unknown error occurred.'}
                </p>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="mt-4"
                  data-testid="try-again-button"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}