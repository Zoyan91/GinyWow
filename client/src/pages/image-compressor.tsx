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
        title: "🎉 Image Compressed Successfully!",
        description: `Image compressed successfully! Reduced by ${data.sizeReduction}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Compression Failed",
        description: error.message || "Failed to compress image. Please try again.",
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
        setCompressionResults(null);
      };
      reader.readAsDataURL(file);
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

  const handleDownload = () => {
    if (!processedImage || !compressionResults) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = compressionResults.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "📥 Download Started",
      description: "Your compressed image is being downloaded.",
    });
  };

  const handleStartOver = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setOriginalFile(null);
    setFileName("");
    setCompressionLevel("medium");
    setQuality([75]);
    setCompressionResults(null);
  };

  const compressionOptions = [
    { value: "low", label: "Low Compression", description: "Best quality, larger file size" },
    { value: "medium", label: "Medium Compression", description: "Balanced quality and file size" },
    { value: "high", label: "High Compression", description: "Good quality, smaller file size" },
    { value: "maximum", label: "Maximum Compression", description: "Smallest file size" },
  ];

  return (
    <>
      {/* SEO Head with comprehensive meta tags and structured data */}
      <SEOHead seoData={imageCompressorSEO} structuredData={structuredData} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header currentPage="Image Compressor" />
        
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

          {/* Simple Compressor Section - Moved Up */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight" data-testid="page-title">
                <span className="block sm:inline">Free Image Compressor Online</span> <span className="block sm:inline">– Reduce Image File Size Instantly with GinyWow</span>
              </h1>
              <p className="text-gray-600 mb-6 text-sm md:text-base" data-testid="hero-description">
                Compress images online for free with GinyWow Image Compressor. Reduce file size without losing quality. Works with JPG, PNG, WebP, and more.
              </p>
            </div>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                  <Minimize2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Compress Image
                </CardTitle>
                <CardDescription>
                  Upload your image and compress it to reduce file size while maintaining quality
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
                          {isDragActive ? "Drop your image here" : "Upload Image to Compress"}
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
                            {compressionResults && (
                              <p>Size: {(compressionResults.originalSize / 1024).toFixed(1)} KB</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {processedImage && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Compressed Image
                          </h4>
                          <div className="relative bg-gray-50 rounded-lg p-4 border border-green-200">
                            <img
                              src={processedImage}
                              alt="Compressed"
                              className="max-w-full h-auto max-h-64 mx-auto rounded"
                              data-testid="compressed-image"
                            />
                            <div className="mt-3 text-sm text-gray-600 text-center">
                              <p className="font-medium text-green-700">
                                {compressionResults?.downloadName}
                              </p>
                              {compressionResults && (
                                <p>Size: {(compressionResults.compressedSize / 1024).toFixed(1)} KB</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Compression Results */}
                    {compressionResults && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>Compression Successful!</strong> Reduced by {compressionResults.sizeReduction} • 
                          Compression Ratio: {compressionResults.compressionRatio}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Compression Settings */}
                {originalImage && (
                  <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900">Compression Level</label>
                        <Select value={compressionLevel} onValueChange={setCompressionLevel} data-testid="compression-select">
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Choose compression level" />
                          </SelectTrigger>
                          <SelectContent>
                            {compressionOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-gray-500">{option.description}</div>
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
                          onClick={handleCompress}
                          disabled={compressImageMutation.isPending}
                          size="lg"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                          data-testid="button-compress"
                        >
                          {compressImageMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Compressing...
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 h-5 w-5" />
                              Compress Image
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
                            Download Compressed Image
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
                {compressImageMutation.isPending && (
                  <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="font-semibold text-blue-900">Compressing your image...</span>
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

        {/* GinyWow Image Compressor Information Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">What is GinyWow Image Compressor?</h4>
              <p className="text-gray-600 mb-8 leading-relaxed">
                GinyWow Image Compressor is a free online tool that helps you <strong>reduce image file size instantly</strong> without losing quality. Whether you want to upload faster, save storage, or optimize your website performance, this tool gives you the best results in seconds.
              </p>

              <h4 className="text-2xl font-bold text-gray-900 mb-4">Why Use GinyWow Image Compressor?</h4>
              <ul className="text-gray-600 mb-8 space-y-2 leading-relaxed">
                <li><strong>Free & Easy-to-Use:</strong> No software installation required.</li>
                <li><strong>High-Quality Compression:</strong> Reduce file size while keeping images sharp.</li>
                <li><strong>Supports Multiple Formats:</strong> Works with JPG, PNG, WebP, and more.</li>
                <li><strong>Faster Websites:</strong> Smaller images load quickly and improve SEO ranking.</li>
                <li><strong>Secure Processing:</strong> Your files are safe and never stored permanently.</li>
              </ul>

              <h4 className="text-2xl font-bold text-gray-900 mb-4">How to Compress Images with GinyWow</h4>
              <ol className="text-gray-600 mb-8 space-y-2 leading-relaxed list-decimal list-inside">
                <li>Upload your image file to GinyWow Image Compressor.</li>
                <li>Select your preferred compression level.</li>
                <li>Preview the optimized image.</li>
                <li>Download your compressed image instantly.</li>
              </ol>

              <h4 className="text-2xl font-bold text-gray-900 mb-4">Who Can Benefit from GinyWow Image Compressor?</h4>
              <ul className="text-gray-600 mb-8 space-y-2 leading-relaxed">
                <li><strong>Students:</strong> Share lightweight images in projects and assignments.</li>
                <li><strong>Bloggers & Creators:</strong> Optimize photos for blogs and social media.</li>
                <li><strong>Businesses:</strong> Save storage and bandwidth when sending or storing images.</li>
                <li><strong>Web Developers:</strong> Speed up websites with optimized visuals.</li>
              </ul>

              <h4 className="text-2xl font-bold text-gray-900 mb-4">Why Choose GinyWow Image Compressor?</h4>
              <p className="text-gray-600 leading-relaxed">
                With GinyWow Image Compressor, you get <strong>fast, reliable, and free image optimization</strong>. No compromise on quality—just smaller, web-ready images for any use.
              </p>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}