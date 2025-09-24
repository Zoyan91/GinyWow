import { useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, Download, Zap, FileImage, CheckCircle, ArrowRight, 
  Image as ImageIcon, Smartphone, Globe, Shield, Users, Star,
  RotateCcw, Info, Clock, HardDrive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { TrustBadges, StatsSection } from "@/components/trust-badges";
import { 
  formatConverterSEO, 
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  formatConverterBreadcrumbs,
  formatConverterFAQs,
  formatConverterHowToSteps
} from "@/lib/seo";

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
  const [conversionStep, setConversionStep] = useState<number>(1);
  const { toast } = useToast();

  // Generate structured data for SEO (memoized)
  const structuredData = useMemo(() => [
    generateWebApplicationSchema("https://ginywow.replit.app/format-converter"),
    generateBreadcrumbSchema(formatConverterBreadcrumbs),
    generateFAQSchema(formatConverterFAQs),
    generateHowToSchema(
      "How to Convert Image Formats Online",
      "Step-by-step guide to convert images between different formats using our free online tool",
      formatConverterHowToSteps
    )
  ], []);

  // Inject structured data directly into DOM (fallback for helmet issues)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Structured Data Generated:', structuredData);
      
      // Remove existing JSON-LD scripts to avoid duplicates
      const existingScripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
      existingScripts.forEach(script => script.remove());
      
      // Inject each structured data as script tags
      structuredData.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.setAttribute('data-schema-index', index.toString());
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
      
      // Debug verification
      setTimeout(() => {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        console.log('JSON-LD Scripts in DOM:', scripts.length);
        scripts.forEach((script, index) => {
          console.log(`Script ${index}:`, script.getAttribute('data-schema-index'), 'exists');
        });
      }, 500);
    }
    
    // Cleanup function to remove scripts when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        const scripts = document.querySelectorAll('script[data-seo-jsonld="true"]');
        scripts.forEach(script => script.remove());
      }
    };
  }, [structuredData]);

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
      setConversionStep(4);
      toast({
        title: "🎉 Image Converted Successfully!",
        description: `Converted to ${targetFormat.toUpperCase()} format. Size changed by ${data.sizeChange}`,
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Conversion Failed",
        description: error.message,
        variant: "destructive",
      });
      setConversionStep(1);
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      setOriginalFile(file);
      setConversionStep(2);
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
      setConversionStep(3);
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
      
      toast({
        title: "📥 Download Started",
        description: "Your converted image is being downloaded.",
      });
    }
  };

  const handleStartOver = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setFileName("");
    setOriginalFile(null);
    setConversionResults(null);
    setConversionStep(1);
  };

  const formatOptions = [
    { value: "png", label: "PNG", description: "High quality with transparency support", icon: "🖼️" },
    { value: "jpeg", label: "JPEG", description: "Compressed format, smaller file size", icon: "📷" },
    { value: "webp", label: "WebP", description: "Modern format with better compression", icon: "🚀" },
    { value: "gif", label: "GIF", description: "Animated images and simple graphics", icon: "🎞️" },
    { value: "bmp", label: "BMP", description: "Uncompressed bitmap format", icon: "🎨" },
    { value: "tiff", label: "TIFF", description: "Professional photography format", icon: "📸" },
    { value: "avif", label: "AVIF", description: "Next-generation format for web", icon: "⚡" },
    { value: "ico", label: "ICO", description: "Icon format for websites", icon: "💎" },
  ];

  const supportedFormats = [
    "PNG", "JPEG", "JPG", "WebP", "GIF", "BMP", "TIFF", "AVIF", "ICO", "HEIC", "SVG", "PDF"
  ];

  const conversionProgress = [
    { step: 1, title: "Upload Image", description: "Select your image file", icon: Upload, active: conversionStep >= 1 },
    { step: 2, title: "Choose Format", description: "Select output format", icon: FileImage, active: conversionStep >= 2 },
    { step: 3, title: "Converting", description: "Processing your image", icon: Zap, active: conversionStep >= 3 },
    { step: 4, title: "Download", description: "Get your converted file", icon: Download, active: conversionStep >= 4 },
  ];

  return (
    <>
      {/* SEO Head with comprehensive meta tags and structured data */}
      <SEOHead seoData={formatConverterSEO} structuredData={structuredData} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <Header currentPage="/format-converter" />
        
        {/* Hero Section - Professional Split Layout */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Hero Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <FileImage className="h-8 w-8" />
                    </div>
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2">
                      #1 Image Converter
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" data-testid="page-title">
                    Free Image Format Converter Online
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl" data-testid="hero-description">
                    Convert images between <strong className="text-white">12+ popular formats</strong> instantly. 
                    High-quality conversion with adjustable settings. No signup required, completely free forever.
                  </p>
                  
                  {/* USP Bullets */}
                  <div className="grid md:grid-cols-2 gap-4 py-6">
                    {[
                      { icon: CheckCircle, text: "12+ Format Support" },
                      { icon: Zap, text: "Instant Conversion" },
                      { icon: Shield, text: "100% Secure & Private" },
                      { icon: Globe, text: "No Installation Needed" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-blue-100">
                        <item.icon className="h-5 w-5 text-green-400" />
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
                      onClick={() => document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' })}
                      data-testid="button-start-converting"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Start Converting Now
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
                      data-testid="button-learn-more"
                    >
                      <Info className="mr-2 h-5 w-5" />
                      Learn More
                    </Button>
                  </div>
                </div>
                
                {/* Trust Signals */}
                <TrustBadges />
              </div>
              
              {/* Right Column - Quick Converter Preview */}
              <div className="lg:order-last">
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-gray-900 text-xl">Try It Now - Quick Convert</CardTitle>
                    <CardDescription>Supported formats: PNG, JPEG, WebP, GIF & 8+ more</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {supportedFormats.slice(0, 8).map((format) => (
                        <Badge key={format} variant="secondary" className="text-xs px-2 py-1 justify-center">
                          {format}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-center space-y-4">
                      <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Upload to start converting</p>
                      </div>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' })}
                        data-testid="button-open-full-converter"
                      >
                        Open Full Converter Below
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator Bar */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {conversionProgress.map((step, index) => (
                <div key={step.step} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    step.active ? 'bg-blue-100 text-blue-700' : 'text-gray-400'
                  }`}>
                    <div className={`p-1 rounded-full ${step.active ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">{step.description}</div>
                    </div>
                  </div>
                  {index < conversionProgress.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-300 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Converter Section */}
        <div id="converter-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Converter Interface */}
            <div className="lg:col-span-2">
              <Card className="h-full shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    Convert Image Format
                  </CardTitle>
                  <CardDescription className="text-base">
                    Upload your image and convert it to any format with custom quality settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  
                  {/* Upload Area or Preview */}
                  {!originalImage ? (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                        isDragActive 
                          ? 'border-blue-400 bg-blue-50 scale-105' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                      data-testid="upload-area"
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-6">
                        <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                          <Upload className="h-12 w-12 text-blue-600" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {isDragActive ? "Drop your image here" : "Upload Image to Convert"}
                          </h3>
                          <p className="text-gray-600 text-lg max-w-md">
                            Drag & drop your image file or click to browse. 
                            Supports PNG, JPEG, WebP, GIF and 8+ more formats.
                          </p>
                          <p className="text-sm text-gray-500">
                            Maximum file size: 20MB
                          </p>
                        </div>
                        <Button size="lg" className="px-8 py-3 text-lg font-semibold" data-testid="button-choose-file">
                          <Upload className="mr-2 h-5 w-5" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Image Preview */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Original Image
                          </h4>
                          <div className="relative bg-gray-50 rounded-lg p-4 border">
                            <img
                              src={originalImage}
                              alt="Original"
                              className="max-w-full h-auto max-h-64 mx-auto rounded"
                              data-testid="original-image"
                            />
                            <div className="mt-3 text-sm text-gray-600 text-center">
                              <p className="font-medium">{fileName}</p>
                              {conversionResults && (
                                <p>Size: {(conversionResults.originalSize / 1024).toFixed(1)} KB</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {processedImage && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              Converted Image
                            </h4>
                            <div className="relative bg-gray-50 rounded-lg p-4 border border-green-200">
                              <img
                                src={processedImage}
                                alt="Converted"
                                className="max-w-full h-auto max-h-64 mx-auto rounded"
                                data-testid="converted-image"
                              />
                              <div className="mt-3 text-sm text-gray-600 text-center">
                                <p className="font-medium text-green-700">
                                  {conversionResults?.downloadName}
                                </p>
                                {conversionResults && (
                                  <p>Size: {(conversionResults.newSize / 1024).toFixed(1)} KB</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Conversion Results */}
                      {conversionResults && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <AlertDescription className="text-green-800">
                            <strong>Conversion Successful!</strong> {conversionResults.sizeChange} • 
                            Format: {conversionResults.originalFormat.toUpperCase()} → {conversionResults.newFormat.toUpperCase()}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  {/* Format Selection & Settings */}
                  {originalImage && (
                    <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-900">Output Format</label>
                          <Select value={targetFormat} onValueChange={setTargetFormat} data-testid="format-select">
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Choose format" />
                            </SelectTrigger>
                            <SelectContent>
                              {formatOptions.map((format) => (
                                <SelectItem key={format.value} value={format.value}>
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg">{format.icon}</span>
                                    <div>
                                      <div className="font-medium">{format.label}</div>
                                      <div className="text-xs text-gray-500">{format.description}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-900">
                            Quality: {quality[0]}%
                          </label>
                          <div className="px-3">
                            <Slider
                              value={quality}
                              onValueChange={setQuality}
                              max={100}
                              min={10}
                              step={5}
                              className="py-4"
                              data-testid="quality-slider"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Smaller file</span>
                              <span>Best quality</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        {!processedImage ? (
                          <Button
                            onClick={handleConvert}
                            disabled={convertImageMutation.isPending}
                            size="lg"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                            data-testid="button-convert"
                          >
                            {convertImageMutation.isPending ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Converting...
                              </>
                            ) : (
                              <>
                                <Zap className="mr-2 h-5 w-5" />
                                Convert Image
                              </>
                            )}
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={handleDownload}
                              size="lg"
                              className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6"
                              data-testid="button-download"
                            >
                              <Download className="mr-2 h-5 w-5" />
                              Download Converted Image
                            </Button>
                            <Button
                              onClick={handleStartOver}
                              variant="outline"
                              size="lg"
                              className="sm:w-auto text-lg py-6"
                              data-testid="button-start-over"
                            >
                              <RotateCcw className="mr-2 h-5 w-5" />
                              Start Over
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Processing Indicator */}
                  {convertImageMutation.isPending && (
                    <div className="space-y-4 p-6 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="font-semibold text-blue-900">Converting your image...</span>
                      </div>
                      <Progress value={66} className="h-2" />
                      <p className="text-sm text-blue-700">
                        Processing with high-quality algorithms. This usually takes a few seconds.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Info & Features */}
            <div className="space-y-6">
              
              {/* Format Support Card */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-purple-600" />
                    Supported Formats
                  </CardTitle>
                  <CardDescription>Convert between any of these formats</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-2">
                    {supportedFormats.map((format) => (
                      <Badge key={format} variant="secondary" className="text-xs justify-center py-2 hover:bg-blue-100 transition-colors">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips Card */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { icon: HardDrive, text: "Use WebP for web images - 30% smaller file size" },
                    { icon: Clock, text: "JPEG is perfect for photos with rich colors" },
                    { icon: Shield, text: "PNG preserves transparency for logos" },
                    { icon: Zap, text: "Higher quality = larger file size" },
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <tip.icon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Security Info */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="p-4 bg-white rounded-full w-fit mx-auto">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-900">100% Secure & Private</h3>
                    <p className="text-sm text-gray-600">
                      Your images are processed locally and automatically deleted after conversion. 
                      We never store or access your files.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <StatsSection />

        {/* Content Sections */}
        <div className="bg-white py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* What is Section */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
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
                      <p className="text-gray-600">Professional image processing with customizable quality settings.</p>
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
                      <p className="text-gray-600">Works perfectly on all devices - desktop, tablet, and mobile.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <Globe className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
                      <p className="text-gray-600">Your images are processed securely and never stored on our servers.</p>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {formatConverterHowToSteps.map((step, index) => (
                  <div key={index} className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.name}</h3>
                    <p className="text-gray-600 text-sm">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="mb-16" />

            {/* Benefits Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Benefits of Using Our Image Format Converter
              </h2>
              <div className="space-y-4">
                {[
                  "Save storage space by converting images to WebP format (30% smaller than JPEG)",
                  "Ensure platform compatibility by converting HEIC photos to JPG or PNG",
                  "Convert multiple images to PDF format for easy document sharing",
                  "Optimize images for web by converting to modern formats like AVIF and WebP",
                  "Perfect for content creators, designers, students, and business professionals"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="mb-16" />

            {/* FAQ Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {formatConverterFAQs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">👉</span>
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed pl-6">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Convert Your Images?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust GinyWow for their image conversion needs. 
              Start converting now - it's free, fast, and secure!
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
              onClick={() => document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Upload className="mr-2 h-5 w-5" />
              Start Converting Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}