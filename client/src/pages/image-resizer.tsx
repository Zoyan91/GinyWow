import { useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, Download, Maximize2, MinusSquare, 
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

// SEO metadata for Image Resizer
const imageResizerSEO = {
  title: "Free Image Resizer Online - Resize Images for Any Purpose | GinyWow",
  description: "Resize images online for free. Perfect for social media, web, print. Maintain quality while reducing file size. Fast, secure, no signup required.",
  keywords: "image resizer, resize images online, image resize tool, photo resizer, resize pictures, image dimensions",
  canonical: "/image-resizer",
  ogTitle: "Free Image Resizer - Resize Images Online",
  ogDescription: "Professional image resizer tool. Resize images for social media, web, print. High-quality results, fast processing, completely free.",
  robots: "index, follow",
  author: "GinyWow",
};

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/" },
  { name: "Image Resizer", url: "/image-resizer" }
];

const faqs = [
  {
    question: "Is the image resizer completely free to use?",
    answer: "Yes! Our image resizer is 100% free with no hidden costs, registration requirements, or usage limits. Resize as many images as you need."
  },
  {
    question: "What image formats are supported for resizing?",
    answer: "We support all popular formats including PNG, JPEG, WebP, GIF, BMP, and more. Upload in any format and get the same format back, resized to your specifications."
  },
  {
    question: "Will resizing affect image quality?",
    answer: "We use advanced algorithms to maintain image quality while resizing. You can choose between different quality settings to balance file size and visual quality."
  },
  {
    question: "What's the maximum file size I can upload?",
    answer: "You can upload images up to 20MB in size. This supports high-resolution photos and professional images."
  }
];

interface ResizeImageResponse {
  success: boolean;
  originalDimensions: { width: number; height: number };
  newDimensions: { width: number; height: number };
  originalSize: number;
  newSize: number;
  sizeChange: string;
  processedImage: string;
  downloadName: string;
}

export default function ImageResizerPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [targetWidth, setTargetWidth] = useState<string>("");
  const [targetHeight, setTargetHeight] = useState<string>("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [resizeResults, setResizeResults] = useState<ResizeImageResponse | null>(null);
  const { toast } = useToast();

  // Generate structured data for SEO (memoized)
  const structuredData = useMemo(() => [
    generateWebApplicationSchema("https://ginywow.replit.app/image-resizer"),
    generateBreadcrumbSchema(breadcrumbs),
    generateFAQSchema(faqs),
    generateHowToSchema(
      "How to Resize Images Online",
      "Step-by-step guide to resize images using our free online tool",
      [
        { name: "Upload Your Image", text: "Click the upload area or drag and drop your image file. Supports files up to 20MB in size." },
        { name: "Set Dimensions", text: "Enter your desired width and height in pixels. Choose whether to maintain aspect ratio." },
        { name: "Resize Image", text: "Click the resize button and wait for processing to complete." },
        { name: "Download Result", text: "Download your resized image with the new dimensions." }
      ]
    )
  ], []);

  const resizeImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('width', targetWidth);
      formData.append('height', targetHeight);
      formData.append('maintainAspectRatio', maintainAspectRatio.toString());

      const response = await fetch('/api/resize-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to resize image');
      }

      return response.json();
    },
    onSuccess: (data: ResizeImageResponse) => {
      setProcessedImage(data.processedImage);
      setResizeResults(data);
      toast({
        title: "Success!",
        description: `Image resized successfully! ${data.sizeChange}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resize image. Please try again.",
        variant: "destructive"
      });
    }
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff', '.ico', '.heic', '.svg']
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
        setResizeResults(null);

        // Get original dimensions
        const img = new Image();
        img.onload = () => {
          if (!targetWidth && !targetHeight) {
            setTargetWidth(img.width.toString());
            setTargetHeight(img.height.toString());
          }
        };
        img.src = URL.createObjectURL(file);
      }
    }
  });

  const handleResize = () => {
    if (!originalFile) {
      toast({
        title: "No Image",
        description: "Please upload an image first.",
        variant: "destructive"
      });
      return;
    }

    if (!targetWidth && !targetHeight) {
      toast({
        title: "Missing Dimensions",
        description: "Please specify at least width or height.",
        variant: "destructive"
      });
      return;
    }

    resizeImageMutation.mutate(originalFile);
  };

  const downloadImage = () => {
    if (!processedImage || !resizeResults) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = resizeResults.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "Your resized image has been downloaded!",
    });
  };

  const resetAll = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setOriginalFile(null);
    setFileName("");
    setTargetWidth("");
    setTargetHeight("");
    setMaintainAspectRatio(true);
    setResizeResults(null);
  };

  return (
    <>
      <SEOHead seoData={imageResizerSEO} structuredData={structuredData} />
      
      <div className="min-h-screen bg-white">
        <Header currentPage="Image Resizer" />
        
        {/* Floating Gradient Shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl animate-float-1"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-xl animate-float-2"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-xl animate-float-3"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-200 rounded-full opacity-20 blur-xl animate-float-4"></div>
          <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-200 rounded-full opacity-20 blur-xl animate-float-5"></div>
          <div className="absolute top-60 right-1/3 w-20 h-20 bg-indigo-200 rounded-full opacity-20 blur-xl animate-float-6"></div>
        </div>
        
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
                <Maximize2 className="w-4 h-4 mr-2" />
                Image Resizer
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Free Image Resizer Online
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
                Resize images for any purpose - social media, web, print. Maintain quality while adjusting dimensions. 
                Fast, secure, and completely free.
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

                {/* Resize Controls */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <MinusSquare className="w-5 h-5 mr-2 text-green-600" />
                      Resize Settings
                    </CardTitle>
                    <CardDescription>
                      Set your desired image dimensions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width (pixels)</Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="Width"
                          value={targetWidth}
                          onChange={(e) => setTargetWidth(e.target.value)}
                          data-testid="width-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (pixels)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Height"
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(e.target.value)}
                          data-testid="height-input"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="aspectRatio"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="aspectRatio" className="text-sm">
                        Maintain aspect ratio
                      </Label>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleResize}
                        disabled={!originalFile || resizeImageMutation.isPending}
                        className="flex-1"
                        data-testid="resize-button"
                      >
                        {resizeImageMutation.isPending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Resizing...
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-4 h-4 mr-2" />
                            Resize Image
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

                    {resizeImageMutation.isPending && (
                      <Progress value={75} className="w-full" />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              {processedImage && resizeResults && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Resized Image
                    </CardTitle>
                    <CardDescription>
                      Your image has been successfully resized
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={processedImage}
                          alt="Resized"
                          className="max-w-full h-auto rounded-lg border"
                          style={{ maxHeight: "400px" }}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-700">Original Size</p>
                            <p className="text-gray-600">
                              {resizeResults.originalDimensions.width} × {resizeResults.originalDimensions.height}
                            </p>
                            <p className="text-gray-500">
                              {(resizeResults.originalSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="font-medium text-green-700">New Size</p>
                            <p className="text-green-600">
                              {resizeResults.newDimensions.width} × {resizeResults.newDimensions.height}
                            </p>
                            <p className="text-green-500">
                              {(resizeResults.newSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Size Change:</strong> {resizeResults.sizeChange}
                          </AlertDescription>
                        </Alert>

                        <Button
                          onClick={downloadImage}
                          className="w-full"
                          size="lg"
                          data-testid="download-button"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Resized Image
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