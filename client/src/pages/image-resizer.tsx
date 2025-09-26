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
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <SEOHead seoData={imageResizerSEO} structuredData={structuredData} />
      
      <Header currentPage="Image Resizer" />

      {/* Hero Section - Mobile First */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">
        {/* Floating Shapes - TinyWow Style - Hero Section Only - Hidden on Mobile */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
          {/* Triangle Top Left - Pink */}
          <div 
            className="absolute top-16 left-12 w-6 h-6 animate-float-1"
            style={{
              background: '#f472b6',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(15deg)',
              opacity: 0.4
            }}
          ></div>

          {/* Circle Top Right - Blue */}
          <div 
            className="absolute top-20 right-20 w-5 h-5 rounded-full animate-float-2"
            style={{
              background: '#60a5fa',
              opacity: 0.45
            }}
          ></div>

          {/* Square Top Center - Orange */}
          <div 
            className="absolute top-24 left-1/3 w-4 h-4 animate-float-3"
            style={{
              background: '#fb923c',
              transform: 'rotate(45deg)',
              opacity: 0.4
            }}
          ></div>

          {/* Dot Top Right Corner - Purple */}
          <div 
            className="absolute top-8 right-8 w-3 h-3 rounded-full animate-float-4"
            style={{
              background: '#c084fc',
              opacity: 0.5
            }}
          ></div>

          {/* Triangle Center Left - Green */}
          <div 
            className="absolute top-40 left-8 w-5 h-5 animate-float-5"
            style={{
              background: '#34d399',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(-30deg)',
              opacity: 0.45
            }}
          ></div>

          {/* Circle Center Right - Yellow */}
          <div 
            className="absolute top-36 right-16 w-4 h-4 rounded-full animate-float-6"
            style={{
              background: '#fbbf24',
              opacity: 0.4
            }}
          ></div>

          {/* Square Center - Cyan */}
          <div 
            className="absolute top-48 left-1/2 w-5 h-5 animate-float-1"
            style={{
              background: '#22d3ee',
              transform: 'rotate(30deg)',
              opacity: 0.45
            }}
          ></div>

          {/* Dot Center Left - Rose */}
          <div 
            className="absolute top-52 left-16 w-3 h-3 rounded-full animate-float-2"
            style={{
              background: '#fb7185',
              opacity: 0.5
            }}
          ></div>

          {/* Triangle Bottom Left - Indigo */}
          <div 
            className="absolute bottom-32 left-10 w-6 h-6 animate-float-3"
            style={{
              background: '#818cf8',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(60deg)',
              opacity: 0.4
            }}
          ></div>

          {/* Circle Bottom Right - Emerald */}
          <div 
            className="absolute bottom-28 right-12 w-4 h-4 rounded-full animate-float-4"
            style={{
              background: '#10b981',
              opacity: 0.45
            }}
          ></div>

          {/* Square Bottom Center - Amber */}
          <div 
            className="absolute bottom-24 left-1/3 w-5 h-5 animate-float-5"
            style={{
              background: '#f59e0b',
              transform: 'rotate(15deg)',
              opacity: 0.4
            }}
          ></div>

          {/* Dot Bottom Right - Violet */}
          <div 
            className="absolute bottom-20 right-8 w-3 h-3 rounded-full animate-float-6"
            style={{
              background: '#8b5cf6',
              opacity: 0.5
            }}
          ></div>

          {/* Additional Shapes for More Coverage */}
          {/* Triangle Mid Left - Teal */}
          <div 
            className="absolute top-60 left-6 w-4 h-4 animate-float-1"
            style={{
              background: '#14b8a6',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(45deg)',
              opacity: 0.4
            }}
          ></div>

          {/* Circle Mid Right - Lime */}
          <div 
            className="absolute top-64 right-6 w-4 h-4 rounded-full animate-float-2"
            style={{
              background: '#84cc16',
              opacity: 0.45
            }}
          ></div>

          {/* Dot Top Center - Sky */}
          <div 
            className="absolute top-12 left-1/2 w-3 h-3 rounded-full animate-float-3"
            style={{
              background: '#0ea5e9',
              opacity: 0.45
            }}
          ></div>

          {/* Square Mid Center - Fuchsia */}
          <div 
            className="absolute left-1/2 w-4 h-4 animate-float-4"
            style={{
              background: '#d946ef',
              transform: 'rotate(60deg)',
              opacity: 0.4,
              top: '17rem'
            }}
          ></div>

          {/* Additional dots scattered */}
          <div className="absolute top-28 left-20 w-2 h-2 rounded-full animate-float-5" style={{ background: '#f472b6', opacity: 0.45 }}></div>
          <div className="absolute top-44 right-24 w-2 h-2 rounded-full animate-float-6" style={{ background: '#60a5fa', opacity: 0.4 }}></div>
          <div className="absolute bottom-40 left-24 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.5 }}></div>
          <div className="absolute bottom-36 right-20 w-2 h-2 rounded-full animate-float-2" style={{ background: '#34d399', opacity: 0.45 }}></div>
          <div className="absolute top-56 left-1/4 w-2 h-2 rounded-full animate-float-3" style={{ background: '#fbbf24', opacity: 0.4 }}></div>
          <div className="absolute bottom-44 right-1/4 w-2 h-2 rounded-full animate-float-4" style={{ background: '#c084fc', opacity: 0.45 }}></div>

        </div>

        <div className="relative z-10 container-mobile max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              {/* Mobile Version */}
              <span className="block sm:hidden whitespace-pre-line">
                {"Free Image Resizer Online\nResize Images Instantly"}
              </span>
              {/* Desktop/Tablet Version */}
              <span className="hidden sm:block whitespace-pre-line">
                {"Free Image Resizer Online\nResize Images Instantly"}
              </span>
            </h1>
            
            <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Resize images for any purpose - social media, web, print. Maintain quality while adjusting dimensions. Fast, secure, and completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t-2 border-dashed border-gray-300">
        <div className="container-mobile max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-purple-500 text-white px-6 py-2 rounded-full text-lg font-medium mb-8 sm:mb-12">
              Resize Tool
            </div>
          </div>
          
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

            {/* Settings and Controls */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Maximize2 className="w-5 h-5 mr-2 text-purple-600" />
                  Resize Settings
                </CardTitle>
                <CardDescription>
                  Set your desired image dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width (px)</Label>
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
                    <Label htmlFor="height">Height (px)</Label>
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
                    id="aspect-ratio"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="aspect-ratio" className="text-sm">
                    Maintain aspect ratio
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleResize}
                    disabled={!originalFile || resizeImageMutation.isPending}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
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
                    onClick={resetAll}
                    variant="outline"
                    className="px-4"
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
            <div className="mt-8 grid lg:grid-cols-2 gap-8">
              {/* Processed Image */}
              <Card>
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
                  <img
                    src={processedImage}
                    alt="Resized"
                    className="max-w-full h-auto rounded-lg border mb-4"
                    style={{ maxHeight: "300px" }}
                  />
                  
                  <Button
                    onClick={downloadImage}
                    className="w-full bg-green-600 hover:bg-green-700"
                    data-testid="download-button"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resized Image
                  </Button>
                </CardContent>
              </Card>

              {/* Resize Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Resize Summary</CardTitle>
                  <CardDescription>
                    Details about your image resize
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Size:</span>
                    <Badge variant="outline">{(resizeResults.originalSize / 1024).toFixed(1)} KB</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Size:</span>
                    <Badge variant="outline">{(resizeResults.newSize / 1024).toFixed(1)} KB</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Dimensions:</span>
                    <Badge variant="outline">
                      {resizeResults.originalDimensions.width} × {resizeResults.originalDimensions.height}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Dimensions:</span>
                    <Badge variant="outline">
                      {resizeResults.newDimensions.width} × {resizeResults.newDimensions.height}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Size Change:</span>
                    <Badge variant={resizeResults.sizeChange.includes('reduced') ? 'default' : 'secondary'}>
                      {resizeResults.sizeChange}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      <Separator className="my-12" />

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container-mobile max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-8">
              Frequently Asked Questions
            </h2>
          </div>
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
        
      <Footer />
    </div>
  );
}