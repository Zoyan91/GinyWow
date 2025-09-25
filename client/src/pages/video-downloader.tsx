import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Download, Video, CheckCircle, Users, Zap, Shield, ArrowRight, MessageCircle, AlertCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { z } from "zod";
import { Helmet } from "react-helmet-async";

// Video downloader schema
const videoDownloaderSchema = z.object({
  videoUrl: z.string().min(1, "Video URL is required").url("Please enter a valid URL"),
});

type VideoDownloaderForm = z.infer<typeof videoDownloaderSchema>;

export default function VideoDownloader() {
  const [videoData, setVideoData] = useState<{
    title: string;
    duration: string;
    thumbnail: string;
    formats: Array<{
      quality: string;
      format: string;
      size: string;
      downloadUrl: string;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<VideoDownloaderForm>({
    resolver: zodResolver(videoDownloaderSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  const onSubmit = async (data: VideoDownloaderForm) => {
    setIsLoading(true);
    
    try {
      // Demo implementation - in real app this would call a backend service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock video data
      setVideoData({
        title: "Sample Video Title",
        duration: "5:32",
        thumbnail: "https://via.placeholder.com/320x180/2563eb/ffffff?text=Video",
        formats: [
          {
            quality: "1080p",
            format: "MP4",
            size: "125 MB",
            downloadUrl: "#"
          },
          {
            quality: "720p", 
            format: "MP4",
            size: "78 MB",
            downloadUrl: "#"
          },
          {
            quality: "480p",
            format: "MP4", 
            size: "45 MB",
            downloadUrl: "#"
          },
          {
            quality: "Audio Only",
            format: "MP3",
            size: "8 MB",
            downloadUrl: "#"
          }
        ]
      });

      toast({
        title: "Video processed successfully!",
        description: "Choose your preferred format and quality to download.",
      });
    } catch (error) {
      toast({
        title: "Error processing video",
        description: "Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: any) => {
    toast({
      title: "Download started",
      description: `Downloading ${format.quality} ${format.format}...`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Video Downloader - Download Videos in HD Quality | GinyWow</title>
        <meta name="description" content="Free video downloader tool to download videos from YouTube, Facebook, Instagram, and more platforms in HD quality. Fast, secure, and easy to use." />
        <meta property="og:title" content="Video Downloader - Download Videos in HD Quality | GinyWow" />
        <meta property="og:description" content="Free video downloader tool to download videos from YouTube, Facebook, Instagram, and more platforms in HD quality. Fast, secure, and easy to use." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Floating Gradient Shapes - Hidden on Mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {/* Triangle 1 */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-500/20 transform rotate-45 animate-float-1"></div>
          
          {/* Circle 1 */}
          <div className="absolute top-32 right-20 w-12 h-12 bg-gradient-to-br from-pink-400/25 to-red-500/25 rounded-full animate-float-2"></div>
          
          {/* Square 1 */}
          <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-gradient-to-br from-green-400/20 to-blue-500/20 transform rotate-12 animate-float-3"></div>
          
          {/* Triangle 2 */}
          <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-yellow-400/15 to-orange-500/15 transform rotate-45 animate-float-4"></div>
          
          {/* Circle 2 */}
          <div className="absolute bottom-20 left-1/3 w-14 h-14 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full animate-float-5"></div>
          
          {/* Dot pattern */}
          <div className="absolute top-1/2 right-10 w-6 h-6 bg-gradient-to-br from-indigo-400/25 to-blue-500/25 rounded-full animate-float-6"></div>
        </div>

        <Header currentPage="video-downloader" />
        
        <main className="relative z-10">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
                <Video className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium text-sm">Video Downloader</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Download Videos in
                <span className="text-blue-600"> HD Quality</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Download videos from YouTube, Facebook, Instagram, and more platforms. Fast, secure, and completely free.
              </p>
            </div>

            {/* Video Downloader Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Video className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                              {...field}
                              placeholder="Paste video URL here (YouTube, Facebook, Instagram, etc.)"
                              className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                              data-testid="input-video-url"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl"
                    data-testid="button-download-video"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Video...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Download Video
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Results Section */}
            {videoData && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="downloads-heading">Available Downloads</h2>
                
                {/* Video Info */}
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8 p-4 bg-gray-50 rounded-xl" data-testid="video-info-card">
                  <img 
                    src={videoData.thumbnail} 
                    alt="Video thumbnail" 
                    className="w-full sm:w-48 h-32 object-cover rounded-lg"
                    data-testid="video-thumbnail"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid="video-title">{videoData.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center" data-testid="video-duration">
                        <Play className="w-4 h-4 mr-1" />
                        {videoData.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Download Options */}
                <div className="grid gap-4">
                  {videoData.formats.map((format, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors" data-testid={`format-option-${index}`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          {format.format === 'MP3' ? (
                            <Video className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Video className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900" data-testid={`format-quality-${index}`}>{format.quality}</div>
                          <div className="text-sm text-gray-600" data-testid={`format-details-${index}`}>{format.format} • {format.size}</div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleDownload(format)}
                        className="bg-blue-600 hover:bg-blue-700"
                        data-testid={`button-download-${format.quality.toLowerCase().replace(' ', '-')}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12">
              <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Download videos in seconds with our optimized processing engine.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Secure</h3>
                <p className="text-gray-600">Your privacy is protected. We don't store any downloaded content.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Platforms</h3>
                <p className="text-gray-600">Support for YouTube, Facebook, Instagram, and many more platforms.</p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-testid="faq-heading">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0" data-testid="faq-formats">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="faq-formats-question">What video formats are supported?</h3>
                  <p className="text-gray-600" data-testid="faq-formats-answer">We support MP4, AVI, MOV, and MP3 audio extraction. You can choose from multiple quality options including 1080p, 720p, and 480p.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0" data-testid="faq-platforms">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="faq-platforms-question">Which platforms are supported?</h3>
                  <p className="text-gray-600" data-testid="faq-platforms-answer">Our video downloader works with YouTube, Facebook, Instagram, Twitter, TikTok, and many other popular video sharing platforms.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0" data-testid="faq-free">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="faq-free-question">Is it free to use?</h3>
                  <p className="text-gray-600" data-testid="faq-free-answer">Yes! Our video downloader is completely free to use with no hidden fees or registration required.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0" data-testid="faq-safety">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="faq-safety-question">Is my data safe?</h3>
                  <p className="text-gray-600" data-testid="faq-safety-answer">Absolutely. We don't store any downloaded videos or personal information. All processing is done securely and your privacy is protected.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}