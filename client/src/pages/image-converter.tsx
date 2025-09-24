import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RefreshCw, Upload, Download, Loader2, ArrowLeft, Check, Info } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ProcessResult {
  success: boolean;
  processedImage?: string;
  downloadName?: string;
  originalFormat?: string;
  newFormat?: string;
  error?: string;
}

export default function ImageConverterPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [quality, setQuality] = useState<number[]>([85]);
  const { toast } = useToast();

  const formatOptions = [
    { value: "png", label: "PNG", description: "Lossless compression, supports transparency" },
    { value: "jpeg", label: "JPEG", description: "Best for photos with smaller file sizes" },
    { value: "jpg", label: "JPG", description: "Same as JPEG format" },
    { value: "webp", label: "WebP", description: "Modern format with excellent compression" },
    { value: "bmp", label: "BMP", description: "Uncompressed bitmap format" },
    { value: "tiff", label: "TIFF", description: "High-quality format for professional use" },
    { value: "gif", label: "GIF", description: "Animation support, limited colors" },
    { value: "ico", label: "ICO", description: "Windows icon format" },
    { value: "avif", label: "AVIF", description: "Next-generation image format" },
  ];

  const convertImageMutation = useMutation({
    mutationFn: async (file: File): Promise<ProcessResult> => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('format', targetFormat);
      formData.append('quality', quality[0].toString());
      
      const response = await apiRequest('POST', '/api/convert-image', formData);
      
      return await response.json();
    },
    onSuccess: (result) => {
      if (result.success && result.processedImage) {
        setProcessedImage(result.processedImage);
        toast({
          title: "Success!",
          description: `Image converted to ${targetFormat.toUpperCase()}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to convert image",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to convert image. Please try again.",
        variant: "destructive",
      });
      console.error("Image conversion error:", error);
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
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff', '.gif', '.ico', '.avif']
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleConvert = () => {
    if (originalFile) {
      convertImageMutation.mutate(originalFile);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `converted-${fileName.replace(/\.[^/.]+$/, `.${targetFormat}`)}`;
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

  const selectedFormat = formatOptions.find(f => f.value === targetFormat);
  const showQualitySlider = ['jpeg', 'jpg', 'webp', 'avif'].includes(targetFormat);

  return (

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Header currentPage="Image Converter" />
        
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/image" className="hover:text-blue-600">Image Tools</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Image Converter</span>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <RefreshCw className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-testid="page-title">
              Image Format Converter
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-testid="page-description">
              Convert images between all popular formats. Support for PNG, JPG, WebP, GIF, BMP, TIFF, AVIF and more.
            </p>
          </div>

          {/* Main Tool Interface */}
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-xl border-2 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900">Image Format Converter</CardTitle>
                <p className="text-gray-600">Convert your images to any format with high quality</p>
              </CardHeader>
              <CardContent className="p-6">
                {!originalImage ? (
                  /* Upload Area */
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive 
                        ? "border-green-400 bg-green-50" 
                        : "border-gray-300 hover:border-green-400 hover:bg-green-50"
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
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                      Choose Image
                    </Button>
                    <p className="text-sm text-gray-400 mt-4">
                      Supports all major formats up to 20MB
                    </p>
                  </div>
                ) : (
                  /* Processing Area */
                  <div className="space-y-6">
                    {/* Conversion Options */}
                    <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-900">
                          Target Format
                        </label>
                        <Select value={targetFormat} onValueChange={setTargetFormat}>
                          <SelectTrigger className="w-full" data-testid="format-selector">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            {formatOptions.map((format) => (
                              <SelectItem key={format.value} value={format.value}>
                                <div>
                                  <div className="font-medium">{format.label}</div>
                                  <div className="text-xs text-gray-500">{format.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedFormat && (
                          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                              <strong>{selectedFormat.label}:</strong> {selectedFormat.description}
                            </div>
                          </div>
                        )}
                      </div>

                      {showQualitySlider && (
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-900">
                            Quality: {quality[0]}%
                          </label>
                          <Slider
                            value={quality}
                            onValueChange={setQuality}
                            max={100}
                            min={10}
                            step={5}
                            className="w-full"
                            data-testid="quality-slider"
                          />
                          <p className="text-xs text-gray-500">
                            Higher quality = larger file size
                          </p>
                        </div>
                      )}
                    </div>

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
                        <p className="text-sm text-gray-500 text-center">{fileName}</p>
                      </div>

                      {/* Processed Image */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 text-center">Converted ({targetFormat.toUpperCase()})</h3>
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
                          {convertImageMutation.isPending ? (
                            <div className="flex flex-col items-center gap-3">
                              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                              <p className="text-sm text-gray-600">Converting to {targetFormat.toUpperCase()}...</p>
                            </div>
                          ) : processedImage ? (
                            <img 
                              src={processedImage} 
                              alt="Converted" 
                              className="max-w-full max-h-full object-contain"
                              data-testid="converted-image"
                            />
                          ) : (
                            <div className="text-center text-gray-400">
                              <RefreshCw className="w-12 h-12 mx-auto mb-2" />
                              <p>Click "Convert" to start</p>
                            </div>
                          )}
                        </div>
                        {processedImage && (
                          <p className="text-sm text-gray-500 text-center">
                            Ready to download as {targetFormat.toUpperCase()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {!processedImage && !convertImageMutation.isPending && (
                        <Button 
                          onClick={handleConvert}
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 flex items-center gap-2"
                          data-testid="convert-button"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Convert to {targetFormat.toUpperCase()}
                        </Button>
                      )}
                      
                      {processedImage && (
                        <Button 
                          onClick={handleDownload}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 flex items-center gap-2"
                          data-testid="download-button"
                        >
                          <Download className="w-5 h-5" />
                          Download {targetFormat.toUpperCase()}
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

            {/* Format Support Info */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {formatOptions.map((format) => (
                    <div key={format.value} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-blue-900">{format.label}:</strong>
                        <p className="text-sm text-blue-700">{format.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8 bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Which format should I choose?</h4>
                    <p className="text-gray-600 text-sm">PNG for images with transparency, JPG for photos, WebP for modern browsers with best compression.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Will I lose image quality?</h4>
                    <p className="text-gray-600 text-sm">PNG and BMP are lossless. JPG, WebP, and AVIF allow quality adjustment. Higher quality means larger files.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What's the maximum file size?</h4>
                    <p className="text-gray-600 text-sm">You can upload files up to 20MB. Larger files may take longer to process.</p>
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