import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, Zap, FileImage, CheckCircle, ArrowRight, Image as ImageIcon, Smartphone, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { apiRequest } from "@/lib/queryClient";

interface ConvertImageResponse {
  success: boolean;
  originalFormat: string;
  newFormat: string;
  originalSize: number;
  newSize: number;
  sizeChange: string;
  processedImage: string;
  downloadName: string;
}

export default function FormatConverterPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("png");
  const [quality, setQuality] = useState<number[]>([85]);
  const [conversionResults, setConversionResults] = useState<ConvertImageResponse | null>(null);
  const { toast } = useToast();

  const convertImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('format', targetFormat);
      formData.append('quality', quality[0].toString());

      const response = await fetch('/api/convert-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to convert image');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to convert image');
      }

      return data as ConvertImageResponse;
    },
    onSuccess: (data) => {
      setProcessedImage(data.processedImage);
      setConversionResults(data);
      toast({
        title: "Image Converted Successfully!",
        description: `Converted to ${targetFormat.toUpperCase()} format. Size changed by ${data.sizeChange}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Conversion Failed",
        description: error.message,
        variant: "destructive",
      });
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
        setConversionResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff', '.avif', '.heic', '.svg']
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
    if (processedImage && conversionResults) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = conversionResults.downloadName;
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
    setConversionResults(null);
  };

  const formatOptions = [
    { value: "png", label: "PNG", description: "High quality with transparency support" },
    { value: "jpeg", label: "JPEG", description: "Compressed format, smaller file size" },
    { value: "webp", label: "WebP", description: "Modern format with better compression" },
    { value: "gif", label: "GIF", description: "Animated images and simple graphics" },
    { value: "bmp", label: "BMP", description: "Uncompressed bitmap format" },
    { value: "tiff", label: "TIFF", description: "Professional photography format" },
    { value: "avif", label: "AVIF", description: "Next-generation format for web" },
    { value: "ico", label: "ICO", description: "Icon format for websites" },
  ];

  const supportedFormats = [
    "PNG", "JPEG", "JPG", "WebP", "GIF", "BMP", "TIFF", "AVIF", "ICO", "HEIC", "SVG", "PDF"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="/format-converter" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-2xl">
                <FileImage className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" data-testid="page-title">
              Free Image Format Converter Online
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed" data-testid="hero-description">
              Convert your images to any format instantly. Support for 12+ popular formats including PNG, JPEG, WebP, GIF, and more. High-quality conversion with adjustable compression settings.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {supportedFormats.slice(0, 8).map((format) => (
                <Badge key={format} variant="secondary" className="text-sm px-3 py-1">
                  {format}
                </Badge>
              ))}
              <Badge variant="outline" className="text-sm px-3 py-1">
                +4 More
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-blue-600" />
                  Convert Image Format
                </CardTitle>
                <CardDescription>
                  Upload your image and convert it to any format with custom quality settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Upload Area */}
                {!originalImage ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    data-testid="upload-area"
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          {isDragActive ? "Drop your image here" : "Upload Image to Convert"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Drag & drop or click to select • Max 20MB
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Supports: PNG, JPEG, WebP, GIF, BMP, TIFF, AVIF, ICO, HEIC, SVG
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Format Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Convert to Format
                        </label>
                        <Select value={targetFormat} onValueChange={setTargetFormat} data-testid="format-select">
                          <SelectTrigger>
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
                      </div>
                      
                      {/* Quality Slider */}
                      {['jpeg', 'webp', 'avif', 'tiff'].includes(targetFormat) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quality: {quality[0]}%
                          </label>
                          <div className="px-2">
                            <Slider
                              value={quality}
                              onValueChange={setQuality}
                              max={100}
                              min={10}
                              step={5}
                              className="w-full"
                              data-testid="quality-slider"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Original Image Preview */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Original Image</h3>
                      <div className="relative bg-gray-100 rounded-lg p-4 border">
                        <img
                          src={originalImage}
                          alt="Original"
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                          data-testid="original-image"
                        />
                        <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 text-xs font-medium text-gray-600 shadow-sm">
                          {fileName}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleConvert}
                        disabled={convertImageMutation.isPending}
                        className="flex-1"
                        data-testid="convert-button"
                      >
                        {convertImageMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Converting...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Convert Image
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleStartOver}
                        variant="outline"
                        data-testid="start-over-button"
                      >
                        Start Over
                      </Button>
                    </div>

                    {/* Conversion Progress */}
                    {convertImageMutation.isPending && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Converting to {targetFormat.toUpperCase()}...</span>
                          <span>Processing</span>
                        </div>
                        <Progress value={60} className="w-full" />
                      </div>
                    )}

                    {/* Converted Image Result */}
                    {processedImage && conversionResults && (
                      <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h3 className="font-medium text-gray-900">Conversion Complete!</h3>
                        </div>
                        
                        <div className="bg-gray-100 rounded-lg p-4 border">
                          <img
                            src={processedImage}
                            alt="Converted"
                            className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm mb-4"
                            data-testid="converted-image"
                          />
                          
                          {/* Conversion Stats */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Original:</span>
                              <div className="font-medium">{conversionResults.originalFormat}</div>
                              <div className="text-gray-500">{(conversionResults.originalSize / 1024).toFixed(1)} KB</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Converted:</span>
                              <div className="font-medium">{conversionResults.newFormat}</div>
                              <div className="text-gray-500">{(conversionResults.newSize / 1024).toFixed(1)} KB</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-gray-600">Size Change:</span>
                              <span className={`ml-1 font-medium ${
                                conversionResults.sizeChange.startsWith('-') ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                {conversionResults.sizeChange}
                              </span>
                            </div>
                            <Button 
                              onClick={handleDownload} 
                              size="sm"
                              data-testid="download-button"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Choose Our Converter?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">12+ Formats Supported</h4>
                    <p className="text-sm text-gray-600">Convert between all popular image formats</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Lightning Fast</h4>
                    <p className="text-sm text-gray-600">Instant conversion with high-quality results</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Mobile Friendly</h4>
                    <p className="text-sm text-gray-600">Works perfectly on all devices</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">No Registration</h4>
                    <p className="text-sm text-gray-600">Start converting immediately, no signup required</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported Formats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supported Formats</CardTitle>
                <CardDescription>Convert between any of these formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supportedFormats.map((format) => (
                    <Badge key={format} variant="outline" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* What is Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What is an Image Format Converter?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              An <strong>Image Format Converter</strong> is a free online tool that allows you to quickly convert images from one format to another, such as <strong>JPG, PNG, WebP, GIF, SVG, HEIC, and PDF</strong>. Whether you're a content creator, student, designer, or business owner, this tool makes it simple to switch between different image file types without losing quality.
            </p>
          </div>

          <Separator className="mb-16" />
          
          {/* Why Use Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Why Use GinyWow Image Format Converter?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Supports Multiple Formats</h3>
                    <p className="text-gray-600">Convert between popular formats like <strong>JPG ⇆ PNG ⇆ WebP ⇆ GIF ⇆ SVG ⇆ HEIC ⇆ PDF</strong>.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast & Free</h3>
                    <p className="text-gray-600">No login required, just upload your file and convert instantly.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ImageIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">High-Quality Results</h3>
                    <p className="text-gray-600">Keep your images sharp and clear after conversion.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Smartphone className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile-Friendly</h3>
                    <p className="text-gray-600">Works smoothly on any device, whether desktop or mobile.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Globe className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
                    <p className="text-gray-600">Your files are processed instantly and deleted automatically after conversion.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="mb-16" />

          {/* How to Use Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How to Use the Converter?
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Upload</h3>
                <p className="text-gray-600 text-sm">Upload your image file</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileImage className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Choose Format</h3>
                <p className="text-gray-600 text-sm">Choose the format you want to convert it to</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Convert</h3>
                <p className="text-gray-600 text-sm">Click the Convert button</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Download</h3>
                <p className="text-gray-600 text-sm">Download your converted file instantly</p>
              </div>
            </div>
            <p className="text-center text-lg text-gray-600 mt-8">
              It's that simple — no signup, no software installation needed!
            </p>
          </div>

          <Separator className="mb-16" />

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Benefits of Using GinyWow Image Converter
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-600 leading-relaxed">Save storage space with <strong>compressed formats like WebP</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-600 leading-relaxed">Share images across platforms that only accept specific formats.</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-600 leading-relaxed">Convert <strong>HEIC images</strong> (from iPhones) into <strong>JPG or PNG</strong> for wider compatibility.</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-600 leading-relaxed">Quickly generate <strong>PDFs from images</strong> for documents or presentations.</p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <p className="text-gray-600 leading-relaxed">Perfect for students, designers, marketers, and casual users alike.</p>
              </div>
            </div>
          </div>

          <Separator className="mb-16" />

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👉</span>
                  Is the Image Format Converter free?
                </h3>
                <p className="text-gray-600 leading-relaxed pl-8">
                  Yes, GinyWow Image Converter is 100% free with unlimited conversions.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👉</span>
                  Which formats are supported?
                </h3>
                <p className="text-gray-600 leading-relaxed pl-8">
                  You can convert <strong>JPG, PNG, WebP, GIF, SVG, HEIC, and PDF</strong> files.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👉</span>
                  Do I need to install software or sign up?
                </h3>
                <p className="text-gray-600 leading-relaxed pl-8">
                  No installation or registration is required. Just upload, convert, and download.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👉</span>
                  Are my files safe?
                </h3>
                <p className="text-gray-600 leading-relaxed pl-8">
                  Yes, all files are automatically deleted after conversion. We don't store or share your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}