import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Download, Video, Play, CheckCircle, Users, Zap, Shield, ArrowRight, MessageCircle, AlertCircle, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { videoMetadataSchema, type VideoMetadata } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";

type VideoDownloaderForm = z.infer<typeof videoMetadataSchema>;

export default function VideoDownloader() {
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<VideoDownloaderForm>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  const onSubmit = async (data: VideoDownloaderForm) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/video-metadata', data);
      const jsonResponse = await response.json();

      if (!jsonResponse.success) {
        throw new Error(jsonResponse.error || 'Failed to extract video metadata');
      }

      setVideoData(jsonResponse.metadata);

      toast({
        title: "Video processed successfully!",
        description: "Video preview is now available.",
      });
    } catch (error: any) {
      toast({
        title: "Error processing video",
        description: error.message || "Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: string, type: string) => {
    toast({
      title: "Download feature coming soon", 
      description: `${format} ${type} download functionality will be available soon.`,
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

      <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
        <Header currentPage="video-downloader" />

        {/* Hero Section */}
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

          <div className="relative z-10 container-mobile max-w-4xl">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
                {/* Mobile Version */}
                <span className="block sm:hidden whitespace-pre-line">
                  {"Video Downloader\nDownload Videos in HD Quality"}
                </span>
                {/* Desktop/Tablet Version */}
                <span className="hidden sm:block whitespace-pre-line">
                  {"Video Downloader\nDownload Videos in HD Quality"}
                </span>
              </h1>
              
              <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
                Download videos from YouTube, Facebook, Instagram, and more platforms. Fast, secure, and completely free.
              </p>

              {/* URL Input and Download Button */}
              <div className="max-w-2xl mx-auto mb-8 px-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Mobile Layout - Separate Elements */}
                    <div className="flex flex-col gap-4 sm:hidden">
                      <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="Paste YouTube URL Here"
                                className="input-mobile text-center focus:ring-2 focus:ring-gray-300 focus:border-gray-300 video-downloader-input"
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
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2" />
                            <span>Download Video</span>
                          </div>
                        )}
                      </Button>
                    </div>

                    {/* Desktop Layout - Integrated Design */}
                    <div className="hidden sm:block">
                      <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden max-w-xl mx-auto">
                        <FormField
                          control={form.control}
                          name="videoUrl"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="url"
                                  placeholder="Paste YouTube URL Here"
                                  className="flex-1 border-0 bg-transparent px-6 py-4 text-base focus:ring-2 focus:ring-gray-300 focus:ring-inset placeholder-gray-500 video-downloader-input"
                                  data-testid="url-input-desktop"
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
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Download className="w-4 h-4 mr-2" />
                                <span>Download Video</span>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>

              {/* Video Results */}
              {videoData && (
                <div className="max-w-4xl mx-auto px-4">
                  <div className="card-mobile p-4 sm:p-6 mb-8">
                    
                    {/* Video Preview */}
                    <div className="text-center mb-8" data-testid="video-info-card">
                      <div className="inline-block">
                        <img 
                          src={videoData.thumbnail} 
                          alt="Video thumbnail" 
                          className="w-full max-w-md h-48 object-cover rounded-lg shadow-lg"
                          data-testid="video-thumbnail"
                        />
                      </div>
                      
                      {/* Video Title */}
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid="video-title">{videoData.title}</h3>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center" data-testid="video-duration">
                            <Play className="w-4 h-4 mr-1" />
                            {videoData.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quality Format Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* 1080p MP4 */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <div className="mb-3 flex items-center justify-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Video className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 mb-1" data-testid="format-quality-1080p">1080p</p>
                          <p className="text-sm text-gray-600 mb-3" data-testid="format-details-1080p">MP4 • Full HD</p>
                          <Button
                            onClick={() => handleDownload('1080p', 'MP4')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            data-testid="download-btn-1080p"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {/* 720p MP4 */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <div className="mb-3 flex items-center justify-center">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                              <Video className="w-6 h-6 text-green-600" />
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 mb-1" data-testid="format-quality-720p">720p</p>
                          <p className="text-sm text-gray-600 mb-3" data-testid="format-details-720p">MP4 • HD</p>
                          <Button
                            onClick={() => handleDownload('720p', 'MP4')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                            data-testid="download-btn-720p"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {/* 480p MP4 */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <div className="mb-3 flex items-center justify-center">
                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                              <Video className="w-6 h-6 text-yellow-600" />
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 mb-1" data-testid="format-quality-480p">480p</p>
                          <p className="text-sm text-gray-600 mb-3" data-testid="format-details-480p">MP4 • SD</p>
                          <Button
                            onClick={() => handleDownload('480p', 'MP4')}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                            data-testid="download-btn-480p"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {/* Audio MP3 */}
                      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="text-center">
                          <div className="mb-3 flex items-center justify-center">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                              <Volume2 className="w-6 h-6 text-purple-600" />
                            </div>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 mb-1" data-testid="format-quality-audio">Audio</p>
                          <p className="text-sm text-gray-600 mb-3" data-testid="format-details-audio">MP3 • 320kbps</p>
                          <Button
                            onClick={() => handleDownload('Audio', 'MP3')}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                            data-testid="download-btn-audio"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-500">Video download feature coming soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-white">
          <div className="container-mobile max-w-4xl">
            <div className="prose prose-lg max-w-none">
              
              {/* What is a Video Downloader */}
              <div className="mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  What is a Video Downloader?
                </h3>
                <p className="text-responsive-sm text-gray-600 leading-relaxed mb-4">
                  A <strong>Video Downloader</strong> is a free online tool that allows you to download videos from various platforms in different resolutions like <strong>HD, FHD, and 4K</strong>. Many creators, marketers, and students need videos for presentations, reference, or offline viewing. That's why we built the <strong>GinyWow Video Downloader</strong> — a simple and reliable tool to get videos instantly.
                </p>
              </div>

              <hr className="border-gray-300 mb-12" />

              {/* Why Use GinyWow Video Downloader */}
              <div className="mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Why Use GinyWow Video Downloader?
                </h3>
                <ul className="space-y-3 text-responsive-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span><strong>Free & Instant</strong> – Paste the video link and get the download in seconds.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span><strong>Multiple Qualities</strong> – Download in 480p, 720p, 1080p, or audio-only as per your needs.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span><strong>No Watermark</strong> – 100% clean and high-quality video downloads.</span>
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
              </div>

              <hr className="border-gray-300 mb-12" />

              {/* How Does GinyWow Video Downloader Work */}
              <div className="mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  How Does GinyWow Video Downloader Work?
                </h3>
                <ol className="space-y-3 text-responsive-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <span>Copy the URL of any video from YouTube, Facebook, Instagram, etc.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <span>Paste it into the GinyWow Video Downloader input box.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <span>Click on the <strong>Download Video</strong> button.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    <span>Choose from available video qualities and formats and download with one click.</span>
                  </li>
                </ol>
                <p className="text-responsive-sm text-gray-600 mt-4 font-medium">
                  That's it! Simple, fast, and reliable.
                </p>
              </div>

              <hr className="border-gray-300 mb-12" />

              {/* Benefits of Using GinyWow Video Downloader */}
              <div className="mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Benefits of Using GinyWow Video Downloader
                </h3>
                <ul className="space-y-3 text-responsive-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Perfect for <strong>students, designers, creators, and marketers</strong>.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Use videos for inspiration, research, or offline viewing purposes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Works instantly without waiting or registrations.</span>
                  </li>
                </ul>
              </div>

              <hr className="border-gray-300 mb-12" />

              {/* FAQ Section */}
              <div className="mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions (FAQ)
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      1. Is GinyWow Video Downloader free?
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
                      3. Can I download videos in HD quality?
                    </h4>
                    <p className="text-responsive-sm text-gray-600">
                      Yes, you can download videos in 720p, 1080p, and even higher resolutions easily.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      4. Does it work on mobile?
                    </h4>
                    <p className="text-responsive-sm text-gray-600">
                      Yes! GinyWow Video Downloader is fully responsive and works on all devices.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}