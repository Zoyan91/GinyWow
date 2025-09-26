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
  Upload, Download, Maximize2, CheckCircle, 
  RotateCcw, Image as ImageIcon
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
        title: "🎉 Image Resized Successfully!",
        description: `Image resized successfully! ${data.sizeChange}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Resize Failed",
        description: error.message || "Failed to resize image. Please try again.",
        variant: "destructive"
      });
    }
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
        setResizeResults(null);
      };
      reader.readAsDataURL(file);

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
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff', '.ico', '.heic', '.svg']
    },
    multiple: false,
    maxSize: 20 * 1024 * 1024, // 20MB
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

  const handleDownload = () => {
    if (!processedImage || !resizeResults) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = resizeResults.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "📥 Download Started",
      description: "Your resized image is being downloaded.",
    });
  };

  const handleStartOver = () => {
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
      {/* SEO Head with comprehensive meta tags and structured data */}
      <SEOHead seoData={imageResizerSEO} structuredData={structuredData} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header currentPage="Image Resizer" />
        
        {/* Hero Section with Floating Shapes */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">
          {/* Floating Shapes - TinyWow Style - Hidden on Mobile */}
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

            {/* Additional shapes for more coverage */}
            <div className="absolute top-60 left-6 w-4 h-4 animate-float-1" style={{ background: '#14b8a6', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', transform: 'rotate(45deg)', opacity: 0.4 }}></div>
            <div className="absolute top-64 right-6 w-4 h-4 rounded-full animate-float-2" style={{ background: '#84cc16', opacity: 0.45 }}></div>
            <div className="absolute top-12 left-1/2 w-3 h-3 rounded-full animate-float-3" style={{ background: '#0ea5e9', opacity: 0.45 }}></div>
            <div className="absolute left-1/2 w-4 h-4 animate-float-4" style={{ background: '#d946ef', transform: 'rotate(60deg)', opacity: 0.4, top: '17rem' }}></div>
            
            {/* Additional dots scattered */}
            <div className="absolute top-28 left-20 w-2 h-2 rounded-full animate-float-5" style={{ background: '#f472b6', opacity: 0.45 }}></div>
            <div className="absolute top-44 right-24 w-2 h-2 rounded-full animate-float-6" style={{ background: '#60a5fa', opacity: 0.4 }}></div>
            <div className="absolute bottom-40 left-24 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.5 }}></div>
            <div className="absolute bottom-36 right-20 w-2 h-2 rounded-full animate-float-2" style={{ background: '#34d399', opacity: 0.45 }}></div>
            <div className="absolute top-56 left-1/4 w-2 h-2 rounded-full animate-float-3" style={{ background: '#fbbf24', opacity: 0.4 }}></div>
            <div className="absolute bottom-44 right-1/4 w-2 h-2 rounded-full animate-float-4" style={{ background: '#c084fc', opacity: 0.45 }}></div>
          </div>

          {/* Simple Resizer Section - Moved Up */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight" data-testid="page-title">
                <span className="block sm:inline">Free Image Resizer Online</span> <span className="block sm:inline">– Resize Images to Any Dimensions with GinyWow</span>
              </h1>
              <p className="text-gray-600 mb-6 text-sm md:text-base" data-testid="hero-description">
                Resize images online for free with GinyWow Image Resizer. Adjust width, height, and dimensions instantly for web, social media, or personal use.
              </p>
            </div>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <Maximize2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Resize Image
                </CardTitle>
                <CardDescription>
                  Upload your image and resize it to your desired dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Upload Area or Preview */}
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
                          {isDragActive ? "Drop your image here" : "Upload Image to Resize"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Drag & drop your image file or click to browse
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          Supports PNG, JPEG, WebP, GIF and more • Max 20MB
                        </p>
                      </div>
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
                            {resizeResults && (
                              <>
                                <p>Size: {(resizeResults.originalSize / 1024).toFixed(1)} KB</p>
                                <p>Dimensions: {resizeResults.originalDimensions.width} × {resizeResults.originalDimensions.height}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {processedImage && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Resized Image
                          </h4>
                          <div className="relative bg-gray-50 rounded-lg p-4 border border-green-200">
                            <img
                              src={processedImage}
                              alt="Resized"
                              className="max-w-full h-auto max-h-64 mx-auto rounded"
                              data-testid="resized-image"
                            />
                            <div className="mt-3 text-sm text-gray-600 text-center">
                              <p className="font-medium text-green-700">
                                {resizeResults?.downloadName}
                              </p>
                              {resizeResults && (
                                <>
                                  <p>Size: {(resizeResults.newSize / 1024).toFixed(1)} KB</p>
                                  <p>Dimensions: {resizeResults.newDimensions.width} × {resizeResults.newDimensions.height}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Resize Results */}
                    {resizeResults && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>Resize Successful!</strong> {resizeResults.sizeChange} • 
                          New Dimensions: {resizeResults.newDimensions.width} × {resizeResults.newDimensions.height}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Resize Settings */}
                {originalImage && (
                  <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="width" className="text-sm font-semibold text-gray-900">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="Width"
                          value={targetWidth}
                          onChange={(e) => setTargetWidth(e.target.value)}
                          data-testid="width-input"
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="height" className="text-sm font-semibold text-gray-900">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="Height"
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(e.target.value)}
                          data-testid="height-input"
                          className="bg-white"
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      {!processedImage ? (
                        <Button
                          onClick={handleResize}
                          disabled={resizeImageMutation.isPending}
                          size="lg"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                          data-testid="button-resize"
                        >
                          {resizeImageMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Resizing...
                            </>
                          ) : (
                            <>
                              <Maximize2 className="mr-2 h-5 w-5" />
                              Resize Image
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
                            Download Resized Image
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
                {resizeImageMutation.isPending && (
                  <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="font-semibold text-blue-900">Resizing your image...</span>
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
        </section>

        <Separator className="my-12" />

        {/* GinyWow Image Resizer Information Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">What is GinyWow Image Resizer?</h4>
              <p className="text-gray-600 mb-8 leading-relaxed">
                GinyWow Image Resizer is a free online tool that lets you <strong>change the dimensions of images instantly</strong>. Whether you need to make images smaller for websites or resize them for social media platforms, this tool gives you the perfect fit in seconds.
              </p>

              <h4 className="text-2xl font-bold text-gray-900 mb-4">Why Use GinyWow Image Resizer?</h4>
              <ul className="text-gray-600 mb-8 space-y-2 leading-relaxed">
                <li><strong>Free & Online:</strong> No downloads or payments needed.</li>
                <li><strong>Custom Dimensions:</strong> Enter your desired width and height easily.</li>
                <li><strong>Multi-Format Support:</strong> Works with JPG, PNG, WebP, and other formats.</li>
                <li><strong>Social Media Ready:</strong> Get the perfect size for Instagram, Facebook, YouTube, and more.</li>
                <li><strong>Quality Maintained:</strong> Resize images without blurring or distortion.</li>
              </ul>

              <h4 className="text-2xl font-bold text-gray-900 mb-4">How to Resize Images with GinyWow</h4>
              <ol className="text-gray-600 mb-8 space-y-2 leading-relaxed list-decimal list-inside">
                <li>Upload your image to GinyWow Image Resizer.</li>
                <li>Enter custom width and height or select a preset ratio.</li>
                <li>Preview the resized image.</li>
                <li>Download instantly in your preferred format.</li>
              </ol>

              <h4 className="text-2xl font-bold text-gray-900 mb-4">Who Can Benefit from GinyWow Image Resizer?</h4>
              <ul className="text-gray-600 mb-8 space-y-2 leading-relaxed">
                <li><strong>Students:</strong> Adjust image sizes for projects and presentations.</li>
                <li><strong>Social Media Creators:</strong> Get perfectly sized images for posts, thumbnails, or covers.</li>
                <li><strong>Web Designers:</strong> Create responsive visuals for websites.</li>
                <li><strong>Businesses:</strong> Standardize images for branding and marketing.</li>
              </ul>

              <h4 className="text-2xl font-bold text-gray-900 mb-4">Why Choose GinyWow Image Resizer?</h4>
              <p className="text-gray-600 leading-relaxed">
                With GinyWow Image Resizer, you can resize images quickly, easily, and for free. Perfect dimensions, no hassle—just upload, adjust, and download.
              </p>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}