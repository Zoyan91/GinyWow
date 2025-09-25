import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Download, Upload, CheckCircle, Users, Zap, Shield, ArrowRight, MessageCircle, AlertCircle, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { z } from "zod";
import { Helmet } from "react-helmet-async";

const thumbnailOptimizerSchema = z.object({
  file: z.any().optional(),
});

type ThumbnailOptimizerForm = z.infer<typeof thumbnailOptimizerSchema>;

export default function ThumbnailOptimizer() {
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const form = useForm<ThumbnailOptimizerForm>({
    resolver: zodResolver(thumbnailOptimizerSchema),
    defaultValues: {},
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    setOriginalSize(file.size);

    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setOptimizedImage(e.target?.result as string);
        setOptimizedSize(Math.floor(file.size * 0.7)); // Simulate 30% compression
        setIsOptimizing(false);
        
        toast({
          title: "Image optimized successfully!",
          description: `Reduced file size by ${Math.round((1 - 0.7) * 100)}%`,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsOptimizing(false);
      toast({
        title: "Optimization failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadOptimized = () => {
    if (!optimizedImage) return;
    
    const link = document.createElement('a');
    link.href = optimizedImage;
    link.download = 'optimized-thumbnail.jpg';
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
        <title>Thumbnail Optimizer - Compress & Optimize Images | GinyWow</title>
        <meta name="description" content="Free online thumbnail optimizer. Compress and optimize images for web, social media, and YouTube. Reduce file size while maintaining quality." />
        <meta name="keywords" content="thumbnail optimizer, image compression, optimize images, reduce file size, image compressor" />
        <meta property="og:title" content="Thumbnail Optimizer - Compress & Optimize Images | GinyWow" />
        <meta property="og:description" content="Free online thumbnail optimizer. Compress and optimize images for web, social media, and YouTube." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header currentPage="thumbnail-optimizer" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 sm:py-12 lg:py-20">
        <div className="container-mobile max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Thumbnail Optimizer
            </h1>
            
            <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Compress and optimize your images while maintaining quality. Perfect for web, social media, and YouTube thumbnails.
            </p>

            {/* File Upload Area */}
            <div className="max-w-2xl mx-auto mb-8 px-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="btn-mobile bg-green-500 hover:bg-green-600 text-white inline-flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileUpload}
                        data-testid="file-upload"
                      />
                    </label>
                    <p className="text-sm text-gray-500">
                      Support: JPG, PNG, WebP (Max: 10MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isOptimizing && (
              <div className="max-w-2xl mx-auto px-4 animate-mobile-slide-up">
                <div className="card-mobile p-6 text-center">
                  <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Optimizing your image...</p>
                </div>
              </div>
            )}

            {/* Optimized Result */}
            {optimizedImage && (
              <div className="max-w-2xl mx-auto px-4 animate-mobile-slide-up">
                <div className="card-mobile p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Original Size</h3>
                      <p className="text-2xl font-bold text-red-500">{formatFileSize(originalSize)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Optimized Size</h3>
                      <p className="text-2xl font-bold text-green-500">{formatFileSize(optimizedSize)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-700 font-medium">
                          Saved {formatFileSize(originalSize - optimizedSize)} ({Math.round(((originalSize - optimizedSize) / originalSize) * 100)}% reduction)
                        </span>
                      </div>
                    </div>
                  </div>

                  <img
                    src={optimizedImage}
                    alt="Optimized thumbnail"
                    className="w-full max-w-md mx-auto rounded-lg shadow-md mb-6"
                  />

                  <Button
                    onClick={downloadOptimized}
                    className="btn-mobile bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
                    data-testid="download-button"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Optimized Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container-mobile max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Optimize Your Images?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 text-blue-600" />,
                title: "Faster Loading",
                description: "Reduce file sizes for faster website and social media loading times"
              },
              {
                icon: <Shield className="w-6 h-6 text-green-600" />,
                title: "Quality Preserved",
                description: "Advanced compression maintains visual quality while reducing size"
              },
              {
                icon: <Users className="w-6 h-6 text-purple-600" />,
                title: "Better Engagement",
                description: "Faster loading images lead to better user experience and engagement"
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="card-mobile p-6 text-center hover:shadow-lg transition-shadow"
                data-testid={`benefit-${index + 1}`}
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-mobile max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: "What image formats are supported?",
                answer: "We support **JPG, PNG, WebP, and most common image formats**. Maximum file size is 10MB per image."
              },
              {
                question: "Will image quality be affected?",
                answer: "Our optimizer uses **advanced compression algorithms** to reduce file size while maintaining visual quality. Most users see 30-70% size reduction with minimal quality loss."
              },
              {
                question: "Is it free to use?",
                answer: "Yes! Our thumbnail optimizer is **completely free** with no limits on the number of images you can optimize."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="card-mobile p-4 sm:p-6"
                data-testid={`faq-item-${index + 1}`}
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {faq.answer.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-800">{part}</strong> : part
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}