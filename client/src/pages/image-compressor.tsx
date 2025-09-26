import { useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, Download, Minimize2, Zap, 
  CheckCircle, RotateCcw, Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Separator } from "@/components/ui/separator";
import { 
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema
} from "@/lib/seo";

// SEO metadata for Image Compressor
const imageCompressorSEO = {
  title: "Free Image Compressor Online - Reduce Image Size Without Quality Loss | GinyWow",
  description: "Compress images online for free. Reduce file size while maintaining quality. Perfect for web optimization, email, storage. Fast, secure, no signup required.",
  keywords: "image compressor, compress images online, reduce image size, image optimization, photo compressor, image file size reducer",
  canonical: "/image-compressor",
  ogTitle: "Free Image Compressor - Reduce Image Size Online",
  ogDescription: "Professional image compressor tool. Reduce file size while maintaining quality. Perfect for web, email, storage optimization. Completely free.",
  robots: "index, follow",
  author: "GinyWow",
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/" },
  { name: "Image Compressor", url: "/image-compressor" }
];

const faqs = [
  {
    question: "Is the image compressor completely free to use?",
    answer: "Yes! Our image compressor is 100% free with no hidden costs, registration requirements, or usage limits. Compress as many images as you need."
  },
  {
    question: "What image formats are supported for compression?",
    answer: "We support all popular formats including PNG, JPEG, WebP, GIF, BMP, and more. The compressor maintains the original format while reducing file size."
  },
  {
    question: "How much can I reduce the file size?",
    answer: "Depending on the image and settings, you can typically reduce file sizes by 50-90% while maintaining good visual quality. Results vary by image content and compression level."
  },
  {
    question: "Will compression affect image quality?",
    answer: "We use smart algorithms to minimize quality loss. You can control the compression level to balance file size reduction with image quality according to your needs."
  }
];

interface CompressImageResponse {
  success: boolean;
  originalSize: number;
  compressedSize: number;
  compressionRatio: string;
  sizeReduction: string;
  processedImage: string;
  downloadName: string;
}

export default function ImageCompressorPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<string>("medium");
  const [quality, setQuality] = useState<number[]>([75]);
  const [compressionResults, setCompressionResults] = useState<CompressImageResponse | null>(null);
  const { toast } = useToast();

  // Generate structured data for SEO (memoized)
  const structuredData = useMemo(() => [
    generateWebApplicationSchema("https://ginywow.replit.app/image-compressor"),
    generateBreadcrumbSchema(breadcrumbs),
    generateFAQSchema(faqs),
    generateHowToSchema(
      "How to Compress Images Online",
      "Step-by-step guide to compress images using our free online tool",
      [
        { name: "Upload Your Image", text: "Click the upload area or drag and drop your image file. Supports files up to 20MB in size." },
        { name: "Choose Compression Level", text: "Select your desired compression level from low to maximum based on your quality vs size needs." },
        { name: "Adjust Quality", text: "Fine-tune the quality slider to get the perfect balance between file size and image quality." },
        { name: "Compress and Download", text: "Click compress and download your optimized image with reduced file size." }
      ]
    )
  ], []);

  const compressImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('compressionLevel', compressionLevel);
      formData.append('quality', quality[0].toString());

      const response = await fetch('/api/compress-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compress image');
      }

      return response.json();
    },
    onSuccess: (data: CompressImageResponse) => {
      setProcessedImage(data.processedImage);
      setCompressionResults(data);
      toast({
        title: "Success!",
        description: `Image compressed successfully! Reduced by ${data.sizeReduction}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to compress image. Please try again.",
        variant: "destructive"
      });
    }
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff', '.ico', '.heic']
    },
    multiple: false,
    maxSize: 20 * 1024 * 1024, // 20MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0];
        toast({
          title: "Upload Error",
          description: error.code === 'file-too-large' 
            ? "File is too large. Maximum size is 20MB." 
            : "Invalid file type. Please upload an image.",
          variant: "destructive"
        });
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setOriginalFile(file);
        setFileName(file.name);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setOriginalImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Reset previous results
        setProcessedImage(null);
        setCompressionResults(null);
      }
    }
  });

  const handleCompress = () => {
    if (!originalFile) {
      toast({
        title: "No Image",
        description: "Please upload an image first.",
        variant: "destructive"
      });
      return;
    }

    compressImageMutation.mutate(originalFile);
  };

  const downloadImage = () => {
    if (!processedImage || !compressionResults) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = compressionResults.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "Your compressed image has been downloaded!",
    });
  };

  const resetAll = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setOriginalFile(null);
    setFileName("");
    setCompressionLevel("medium");
    setQuality([75]);
    setCompressionResults(null);
  };

  // Update quality slider based on compression level
  useEffect(() => {
    switch (compressionLevel) {
      case "low":
        setQuality([90]);
        break;
      case "medium":
        setQuality([75]);
        break;
      case "high":
        setQuality([60]);
        break;
      case "maximum":
        setQuality([40]);
        break;
      default:
        setQuality([75]);
    }
  }, [compressionLevel]);

  return (
    <>
      <SEOHead seoData={imageCompressorSEO} structuredData={structuredData} />
      
      <div className="min-h-screen bg-white">
        <Header currentPage="Image Compressor" />
        
        {/* Floating Gradient Shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-xl animate-float-1"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl animate-float-2"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-xl animate-float-3"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-200 rounded-full opacity-20 blur-xl animate-float-4"></div>
          <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-200 rounded-full opacity-20 blur-xl animate-float-5"></div>
          <div className="absolute top-60 right-1/3 w-20 h-20 bg-indigo-200 rounded-full opacity-20 blur-xl animate-float-6"></div>
        </div>
        
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
                <Minimize2 className="w-4 h-4 mr-2" />
                Image Compressor
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Free Image Compressor Online
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
                Reduce image file sizes without losing quality. Perfect for web optimization, faster loading, 
                and saving storage space. Fast, secure, and completely free.
              </p>
            </div>
          </section>

          {/* Main Tool Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Upload Section */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Upload className="w-5 h-5 mr-2 text-blue-600" />
                      Upload Image
                    </CardTitle>
                    <CardDescription>
                      Drag and drop your image or click to browse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                      data-testid="image-upload-dropzone"
                    >
                      <input {...getInputProps()} />
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        {isDragActive
                          ? "Drop your image here..."
                          : "Drag & drop an image here, or click to select"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PNG, JPEG, WebP, GIF, BMP (Max: 20MB)
                      </p>
                    </div>

                    {originalImage && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Original Image: {fileName}
                        </p>
                        <img
                          src={originalImage}
                          alt="Original"
                          className="max-w-full h-auto rounded-lg border"
                          style={{ maxHeight: "300px" }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Compression Controls */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Zap className="w-5 h-5 mr-2 text-green-600" />
                      Compression Settings
                    </CardTitle>
                    <CardDescription>
                      Choose your compression level and quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Compression Level
                      </label>
                      <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                        <SelectTrigger data-testid="compression-level-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Compression (High Quality)</SelectItem>
                          <SelectItem value="medium">Medium Compression (Balanced)</SelectItem>
                          <SelectItem value="high">High Compression (Small Size)</SelectItem>
                          <SelectItem value="maximum">Maximum Compression (Smallest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
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
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Smallest Size</span>
                        <span>Best Quality</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleCompress}
                        disabled={!originalFile || compressImageMutation.isPending}
                        className="flex-1"
                        data-testid="compress-button"
                      >
                        {compressImageMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Compressing...
                          </>
                        ) : (
                          <>
                            <Minimize2 className="w-4 h-4 mr-2" />
                            Compress Image
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={resetAll}
                        data-testid="reset-button"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>

                    {compressImageMutation.isPending && (
                      <Progress value={60} className="w-full" />
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Badge variant="outline" className="justify-center py-2">
                        <Zap className="w-3 h-3 mr-1" />
                        Fast Processing
                      </Badge>
                      <Badge variant="outline" className="justify-center py-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Quality Preserved
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              {processedImage && compressionResults && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Compressed Image
                    </CardTitle>
                    <CardDescription>
                      Your image has been successfully compressed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={processedImage}
                          alt="Compressed"
                          className="max-w-full h-auto rounded-lg border"
                          style={{ maxHeight: "400px" }}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-700">Original Size</p>
                            <p className="text-gray-600">
                              {(compressionResults.originalSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="font-medium text-green-700">Compressed Size</p>
                            <p className="text-green-600">
                              {(compressionResults.compressedSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Size Reduction:</strong> {compressionResults.sizeReduction} 
                            <br />
                            <strong>Compression Ratio:</strong> {compressionResults.compressionRatio}
                          </AlertDescription>
                        </Alert>

                        <Button
                          onClick={downloadImage}
                          className="w-full"
                          size="lg"
                          data-testid="download-button"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Compressed Image
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <Separator className="my-12" />

          {/* FAQ Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Frequently Asked Questions
              </h2>
              <div className="grid gap-6">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
        
        <Footer />
      </div>
    </>
  );
}