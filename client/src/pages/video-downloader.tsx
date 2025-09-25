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

      <div className="min-h-screen bg-gray-50">

        <Header currentPage="video-downloader" />
        
        <main className="relative z-10">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-20 sm:py-32 max-w-4xl">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-16 leading-tight">
                Download Videos in
                <span className="text-blue-600"> HD Quality</span>
              </h1>
            </div>

            {/* Video Downloader Form */}
            <div className="max-w-2xl mx-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Paste YouTube URL Here"
                            className="h-16 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl px-6 bg-gray-50 focus:bg-white transition-colors"
                            data-testid="input-video-url"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="h-16 px-8 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-2xl text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
                    data-testid="button-download-video"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
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

          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}