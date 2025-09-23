import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Download, Link as LinkIcon, CheckCircle, Users, Zap, Shield, ArrowRight, MessageCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { thumbnailDownloaderSchema, type ThumbnailDownloaderForm } from "@shared/schema";

export default function ThumbnailDownloader() {
  const [thumbnailData, setThumbnailData] = useState<{
    videoTitle: string;
    thumbnails: Array<{
      url: string;
      size: string;
      width: number;
      height: number;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ThumbnailDownloaderForm>({
    resolver: zodResolver(thumbnailDownloaderSchema),
    defaultValues: {
      youtubeUrl: "",
    },
  });

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const generateThumbnailUrls = (videoId: string) => {
    const baseUrl = "https://img.youtube.com/vi/";
    return [
      {
        url: `${baseUrl}${videoId}/maxresdefault.jpg`,
        size: "Max Quality (1920x1080)",
        width: 1920,
        height: 1080,
      },
      {
        url: `${baseUrl}${videoId}/hqdefault.jpg`, 
        size: "High Quality (480x360)",
        width: 480,
        height: 360,
      },
      {
        url: `${baseUrl}${videoId}/mqdefault.jpg`,
        size: "Medium Quality (320x180)",
        width: 320,
        height: 180,
      },
      {
        url: `${baseUrl}${videoId}/default.jpg`,
        size: "Default (120x90)",
        width: 120,
        height: 90,
      },
    ];
  };

  const handleExtractThumbnails = async (values: ThumbnailDownloaderForm) => {
    const videoId = extractVideoId(values.youtubeUrl);
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate thumbnail URLs
      const thumbnails = generateThumbnailUrls(videoId);
      
      // Set dummy video title for now - in real app you'd fetch from YouTube API
      setThumbnailData({
        videoTitle: "YouTube Video Thumbnails",
        thumbnails: thumbnails,
      });

      toast({
        title: "Success!",
        description: "Thumbnails extracted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to extract thumbnails. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadThumbnail = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Downloaded!",
        description: "Thumbnail downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download thumbnail. Please try right-clicking and saving the image.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="thumbnail-downloader" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20">
        <div className="container-mobile max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              {/* Mobile Version */}
              <span className="block sm:hidden whitespace-pre-line">
                {"YouTube Thumbnail Downloader\nDownload HD Thumbnails Instantly"}
              </span>
              {/* Desktop/Tablet Version */}
              <span className="hidden sm:block whitespace-pre-line">
                {"YouTube Thumbnail Downloader\nDownload HD Thumbnails Instantly"}
              </span>
            </h1>
            
            <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Extract and download high-quality thumbnails from any YouTube video. Get all available sizes from HD to standard quality.
            </p>

            {/* URL Input and Extract Button */}
            <div className="max-w-2xl mx-auto mb-8 px-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleExtractThumbnails)} className="space-y-4">
                  {/* Mobile Layout - Separate Elements */}
                  <div className="flex flex-col gap-4 sm:hidden">
                    <FormField
                      control={form.control}
                      name="youtubeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="Paste YouTube URL Here"
                              className="input-mobile text-center"
                              data-testid="url-input-mobile"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={`btn-mobile w-auto px-8 bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white shadow-lg ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                      }`}
                      data-testid="extract-button-mobile"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Extracting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />
                          <span>Extract Thumbnails</span>
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Desktop Layout - Integrated Design */}
                  <div className="hidden sm:block">
                    <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden max-w-xl mx-auto">
                      <FormField
                        control={form.control}
                        name="youtubeUrl"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="Paste YouTube URL Here"
                                className="flex-1 border-0 bg-transparent px-6 py-4 text-base focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none placeholder-gray-500"
                                data-testid="url-input-desktop"
                                style={{ outline: 'none', boxShadow: 'none' }}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-center mt-2" />
                          </FormItem>
                        )}
                      />
                      <div className="flex">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white px-6 py-4 font-semibold transition-colors ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                          data-testid="extract-button"
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              <span>Extracting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Download className="w-4 h-4 mr-2" />
                              <span>Extract Thumbnails</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            {/* Thumbnail Results */}
            {thumbnailData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto px-4"
              >
                <div className="card-mobile p-4 sm:p-6 mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 text-center">
                    {thumbnailData.videoTitle}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {thumbnailData.thumbnails.map((thumbnail, index) => (
                      <div 
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-gray-100">
                          <img 
                            src={thumbnail.url}
                            alt={`Thumbnail ${thumbnail.size}`}
                            className="w-full h-full object-cover"
                            data-testid={`thumbnail-${index}`}
                          />
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-3">{thumbnail.size}</p>
                          <Button
                            onClick={() => downloadThumbnail(
                              thumbnail.url, 
                              `thumbnail_${thumbnail.width}x${thumbnail.height}.jpg`
                            )}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            data-testid={`download-btn-${index}`}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download ({thumbnail.width}×{thumbnail.height})
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="container-mobile max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            {/* What is a YouTube Thumbnail Downloader */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                What is a YouTube Thumbnail Downloader?
              </h3>
              <p className="text-responsive-sm text-gray-600 leading-relaxed mb-4">
                A <strong>YouTube Thumbnail Downloader</strong> is a free online tool that allows you to download any video's thumbnail in different resolutions like <strong>HD, HQ, and 4K</strong>. Many creators, marketers, and students need thumbnails for presentations, reference, or research. That's why we built the <strong>GinyWow YouTube Thumbnail Downloader</strong> — a simple and reliable tool to get thumbnails instantly.
              </p>
            </motion.div>

            <hr className="border-gray-300 mb-12" />

            {/* Why Use GinyWow YouTube Thumbnail Downloader */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Why Use GinyWow YouTube Thumbnail Downloader?
              </h3>
              <ul className="space-y-3 text-responsive-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Free & Instant</strong> – Paste the video link and get the thumbnail in seconds.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Multiple Qualities</strong> – Download in default, HQ, or HD as per your needs.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>No Watermark</strong> – 100% clean and high-quality thumbnails.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Mobile Friendly</strong> – Works smoothly on any device.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Safe & Secure</strong> – No logins, no hidden charges, just simple downloads.</span>
                </li>
              </ul>
            </motion.div>

            <hr className="border-gray-300 mb-12" />

            {/* How Does GinyWow Thumbnail Downloader Work */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                How Does GinyWow Thumbnail Downloader Work?
              </h3>
              <ol className="space-y-3 text-responsive-sm text-gray-600">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <span>Copy the URL of any YouTube video.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  <span>Paste it into the GinyWow Thumbnail Downloader input box.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  <span>Click on the <strong>Download Thumbnail</strong> button.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                  <span>Choose from available thumbnail sizes and download with one click.</span>
                </li>
              </ol>
              <p className="text-responsive-sm text-gray-600 mt-4 font-medium">
                That's it! Simple, fast, and reliable.
              </p>
            </motion.div>

            <hr className="border-gray-300 mb-12" />

            {/* Benefits of Using GinyWow Thumbnail Downloader */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Benefits of Using GinyWow Thumbnail Downloader
              </h3>
              <ul className="space-y-3 text-responsive-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Perfect for <strong>students, designers, creators, and marketers</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Use thumbnails for inspiration, research, or educational purposes.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Works instantly without waiting or registrations.</span>
                </li>
              </ul>
            </motion.div>

            <hr className="border-gray-300 mb-12" />

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions (FAQ)
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    1. Is GinyWow YouTube Thumbnail Downloader free?
                  </h4>
                  <p className="text-responsive-sm text-gray-600">
                    Yes, it's completely free and always will be.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    2. Do I need to install any software?
                  </h4>
                  <p className="text-responsive-sm text-gray-600">
                    No, this tool works online directly in your browser.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    3. Can I download thumbnails in HD quality?
                  </h4>
                  <p className="text-responsive-sm text-gray-600">
                    Yes, you can download YouTube thumbnails in HQ and HD quality easily.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    4. Does it work on mobile?
                  </h4>
                  <p className="text-responsive-sm text-gray-600">
                    Yes! GinyWow Thumbnail Downloader is fully responsive and works on all devices.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}