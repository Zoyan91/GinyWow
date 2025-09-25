import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, CheckCircle, Users, Zap, Shield, Image, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

interface OptimizationSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  quality: number;
  cropRatio: string;
  outputFormat: string;
}

interface OptimizationResult {
  success: boolean;
  originalImage: string;
  optimizedImage: string;
  originalSize: number;
  optimizedSize: number;
  sizeReduction: number;
  originalDimensions: { width: number; height: number };
  optimizedDimensions: { width: number; height: number };
  downloadName: string;
}

export default function ThumbnailOptimizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationSettings] = useState<OptimizationSettings>({
    brightness: 15,     // 15% brighter (default)
    contrast: 10,       // 10% more contrast
    saturation: 25,     // 25% more vibrant
    sharpness: 1.2,     // Sharpness multiplier
    quality: 92,        // JPEG quality
    cropRatio: '16:9',  // Default YouTube ratio
    outputFormat: 'jpeg' // Output format
  });
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
    
    // Automatically optimize after file selection
    setTimeout(() => {
      optimizeThumbnail();
    }, 100);
  };

  const optimizeThumbnail = async () => {
    if (!selectedFile) return;
    
    setIsOptimizing(true);
    
    try {
      const formData = new FormData();
      formData.append('thumbnail', selectedFile);
      formData.append('settings', JSON.stringify(optimizationSettings));
      
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
        title: "Thumbnail automatically optimized!",
        description: `Enhanced brightness, contrast, and vibrancy. ${result.sizeReduction > 0 ? `File size reduced by ${result.sizeReduction}%` : 'Perfect for YouTube thumbnails'}`,
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
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Helmet>
        <title>GinyWow - Thumbnail Optimizer</title>
        <meta name="description" content="Free online thumbnail optimizer. Enhance brightness, contrast, and vibrancy for better CTR. Perfect for YouTube thumbnails and social media." />
        <meta name="keywords" content="thumbnail optimizer, image enhancement, YouTube thumbnails, CTR optimization" />
        <meta property="og:title" content="GinyWow - Thumbnail Optimizer" />
        <meta property="og:description" content="Free online thumbnail optimizer. Enhance brightness, contrast, and vibrancy for better CTR." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header currentPage="thumbnail-optimizer" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {/* Mobile Version */}
              <span className="block sm:hidden whitespace-pre-line">
                {"Free YouTube Thumbnail Optimizer\nEnhance & Download Thumbnails Online"}
              </span>
              {/* Desktop/Tablet Version */}
              <span className="hidden sm:block whitespace-pre-line">
                {"Free YouTube Thumbnail Optimizer\nEnhance & Download Thumbnails Online"}
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Boost your video views with GinyWow Thumbnail Optimizer. Free online tool to enhance brightness, contrast, and sharpness of your YouTube thumbnails. Upload, preview before & after, and download optimized thumbnails instantly.
            </p>

            {/* File Upload Section */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors bg-white">
                {!previewImage ? (
                  <div className="text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Thumbnail
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
                      <p className="text-sm text-gray-500">
                        Support: JPG, PNG (Max: 5MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md mb-4"
                    />
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>File:</strong> {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
                      </p>
                      
                      <div className="space-y-4">
                        {isOptimizing && (
                          <div className="text-center py-4">
                            <div className="flex items-center justify-center gap-3 text-blue-600">
                              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="font-medium">Automatically optimizing your thumbnail...</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-center">
                          <label htmlFor="file-upload-replace" className="cursor-pointer">
                            <span className="inline-flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Different Image
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
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section - Before/After */}
            {optimizationResult && (
              <div className="max-w-5xl mx-auto animate-fade-in">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Results</h2>
                  
                  {/* Desktop: Side-by-side, Mobile: Stacked */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    {/* Original Thumbnail */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Thumbnail</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <img
                          src={optimizationResult.originalImage}
                          alt="Original thumbnail"
                          className="w-full max-w-sm mx-auto rounded-lg shadow-md mb-4"
                        />
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Size:</strong> {formatFileSize(optimizationResult.originalSize)}</p>
                          <p><strong>Dimensions:</strong> {optimizationResult.originalDimensions.width} × {optimizationResult.originalDimensions.height}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Optimized Thumbnail */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimized Thumbnail</h3>
                      <div className="bg-green-50 rounded-lg p-4">
                        <img
                          src={optimizationResult.optimizedImage}
                          alt="Optimized thumbnail"
                          className="w-full max-w-sm mx-auto rounded-lg shadow-md mb-4"
                        />
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Size:</strong> {formatFileSize(optimizationResult.optimizedSize)}</p>
                          <p><strong>Dimensions:</strong> {optimizationResult.optimizedDimensions.width} × {optimizationResult.optimizedDimensions.height}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Improvement Stats */}
                  {optimizationResult.sizeReduction > 0 && (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-700 font-medium">
                          File size reduced by {optimizationResult.sizeReduction}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Download Button */}
                  <div className="text-center">
                    <Button
                      onClick={downloadOptimized}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 font-medium text-lg"
                      data-testid="download-button"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Optimized Thumbnail
                    </Button>
                  </div>
                  
                  {/* CTR Tips */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                      <strong>Tips:</strong> Use bold text, bright colors, and centered subject for best CTR
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Optimize Your Thumbnails?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-blue-600" />,
                title: "Higher CTR",
                description: "Enhanced brightness and contrast make thumbnails more eye-catching and clickable"
              },
              {
                icon: <Shield className="w-8 h-8 text-green-600" />,
                title: "Perfect Dimensions",
                description: "Auto-center crop to optimal 16:9 ratio for YouTube and social media platforms"
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: "Professional Quality",
                description: "Enhanced sharpness and vibrancy create professional-looking thumbnails"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                data-testid={`benefit-${index + 1}`}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          
          {/* What is a YouTube Thumbnail Optimizer */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What is a YouTube Thumbnail Optimizer?</h2>
            <div className="prose prose-lg text-gray-700 leading-relaxed">
              <p>
                A <strong>YouTube Thumbnail Optimizer</strong> is a free online tool that improves the quality of your video thumbnails by enhancing brightness, contrast, sharpness, and colors. Creators and marketers know that thumbnails decide whether viewers click or scroll — that's why we built the <strong>GinyWow Thumbnail Optimizer</strong>, a simple and effective way to make your thumbnails stand out.
              </p>
            </div>
          </div>

          {/* Why Use GinyWow Thumbnail Optimizer */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Use GinyWow Thumbnail Optimizer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Free & Instant", description: "Upload your thumbnail and optimize it in seconds." },
                { title: "Before & After Preview", description: "See the difference side by side." },
                { title: "One-Click Download", description: "Save your optimized thumbnail instantly." },
                { title: "Mobile Friendly", description: "Works smoothly on all devices." },
                { title: "No Watermark", description: "100% clean, high-quality thumbnails." }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How Does GinyWow Thumbnail Optimizer Work */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Does GinyWow Thumbnail Optimizer Work?</h2>
            <div className="space-y-4">
              {[
                "Upload your thumbnail image (JPG/PNG).",
                "Click on the Optimize Now button.",
                "Instantly view the Before and After preview.",
                "Download the enhanced thumbnail with one click."
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 mt-1">{step}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-6 text-lg font-medium text-gray-800">
              That's it! Fast, free, and reliable.
            </p>
          </div>

          {/* Benefits of Using GinyWow Thumbnail Optimizer */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Using GinyWow Thumbnail Optimizer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Boost CTR & Views", description: "Attractive thumbnails increase clicks." },
                { title: "Professional Quality", description: "Stand out without expensive software." },
                { title: "Easy for Everyone", description: "No design skills needed." },
                { title: "Works Instantly", description: "Optimize thumbnails in just seconds." }
              ].map((benefit, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions (FAQ)</h2>
            <div className="space-y-6">
              {[
                {
                  question: "Is GinyWow Thumbnail Optimizer free?",
                  answer: "Yes, it's 100% free and always will be."
                },
                {
                  question: "Do I need to install any software?",
                  answer: "No, it works online directly in your browser."
                },
                {
                  question: "Can I see a preview before downloading?",
                  answer: "Yes, you get a side-by-side preview of original and optimized thumbnails."
                },
                {
                  question: "Does it work for YouTube Shorts thumbnails?",
                  answer: "Absolutely! It works for any YouTube thumbnail size."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {index + 1}. {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}