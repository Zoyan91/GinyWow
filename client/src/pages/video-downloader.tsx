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

  const handleDownload = async (format: any) => {
    if (format.downloadUrl === '#') {
      toast({
        title: "Download feature coming soon", 
        description: `${format.quality} ${format.format} download functionality will be available soon.`,
      });
      return;
    }

    try {
      toast({
        title: "Starting download...", 
        description: "Downloading video through secure server proxy.",
      });

      // Create form data for POST request
      const formData = new FormData();
      formData.append('videoUrl', `https://www.youtube.com/watch?v=${videoData?.videoId}`);
      formData.append('quality', format.quality);

      // Make request to server proxy endpoint - support all platforms
      const response = await fetch('/api/video-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: videoData?.videoId?.startsWith('http') 
            ? videoData.videoId 
            : `https://www.youtube.com/watch?v=${videoData?.videoId}`,
          quality: format.quality
        })
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Get filename from Content-Disposition header or create one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `video-${format.quality}.mp4`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob from response and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download completed!", 
        description: `${format.quality} ${format.format} video downloaded successfully.`,
        duration: 5000,
      });

    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download failed", 
        description: error.message || "Could not download video. Please try again.",
        variant: "destructive",
      });
    }
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
                  {"Universal Video Downloader\n1000+ Platforms Supported"}
                </span>
                {/* Desktop/Tablet Version */}
                <span className="hidden sm:block whitespace-pre-line">
                  {"Universal Video Downloader\n1000+ Platforms Supported"}
                </span>
              </h1>
              
              <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
                Download videos from YouTube, Instagram, TikTok, Facebook, Vimeo, Twitter and 1000+ platforms in HD quality. Fast, secure, and completely free.
              </p>
              
              {/* Platform Support Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
                <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">YouTube</span>
                <span className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full">Instagram</span>
                <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full">TikTok</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Facebook</span>
                <span className="bg-cyan-100 text-cyan-800 text-xs px-3 py-1 rounded-full">Vimeo</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Twitter</span>
                <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">Dailymotion</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">+1000 More</span>
              </div>

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
                      
                      {/* Video Title - Only show on desktop */}
                      <div className="mt-4 hidden md:block">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid="video-title">{videoData.title}</h3>
                      </div>
                    </div>
                    
                    {/* SSYouTube Style Quality Format Options */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                        📥 Choose Quality & Download
                      </h4>
                      
                      {videoData.availableFormats && videoData.availableFormats.length > 0 ? (
                        videoData.availableFormats.map((format, index) => {
                          // SSYouTube Style Enhanced Color Themes
                          let colorScheme = "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
                          let badgeColor = "bg-gray-500";
                          let gradientBg = "bg-gradient-to-r from-gray-100 to-gray-200";
                          
                          if (format.quality.includes('8K')) {
                            colorScheme = "text-purple-900 dark:text-purple-100";
                            badgeColor = "bg-gradient-to-r from-purple-600 to-pink-600";
                            gradientBg = "bg-gradient-to-r from-purple-50 via-pink-50 to-purple-100 dark:from-purple-900 dark:via-pink-900 dark:to-purple-800";
                          } else if (format.quality.includes('4K')) {
                            colorScheme = "text-red-900 dark:text-red-100";
                            badgeColor = "bg-gradient-to-r from-red-600 to-purple-600";
                            gradientBg = "bg-gradient-to-r from-red-50 via-purple-50 to-red-100 dark:from-red-900 dark:via-purple-900 dark:to-red-800";
                          } else if (format.quality.includes('2K') || format.quality.includes('1440')) {
                            colorScheme = "text-indigo-900 dark:text-indigo-100";
                            badgeColor = "bg-gradient-to-r from-indigo-600 to-blue-600";
                            gradientBg = "bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100 dark:from-indigo-900 dark:via-blue-900 dark:to-indigo-800";
                          } else if (format.quality.includes('1080') || format.quality.includes('Full HD')) {
                            colorScheme = "text-blue-900 dark:text-blue-100";
                            badgeColor = "bg-gradient-to-r from-blue-600 to-cyan-600";
                            gradientBg = "bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-900 dark:via-cyan-900 dark:to-blue-800";
                          } else if (format.quality.includes('720') || format.quality.includes('HD')) {
                            colorScheme = "text-green-900 dark:text-green-100";
                            badgeColor = "bg-gradient-to-r from-green-600 to-emerald-600";
                            gradientBg = "bg-gradient-to-r from-green-50 via-emerald-50 to-green-100 dark:from-green-900 dark:via-emerald-900 dark:to-green-800";
                          } else if (format.quality.includes('480') || format.quality.includes('360') || format.quality.includes('240') || format.quality.includes('144')) {
                            colorScheme = "text-yellow-900 dark:text-yellow-100";
                            badgeColor = "bg-gradient-to-r from-yellow-600 to-orange-600";
                            gradientBg = "bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-100 dark:from-yellow-900 dark:via-orange-900 dark:to-yellow-800";
                          } else if (format.type === 'audio' || format.quality.includes('Audio')) {
                            colorScheme = "text-pink-900 dark:text-pink-100";
                            badgeColor = "bg-gradient-to-r from-pink-600 to-rose-600";
                            gradientBg = "bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100 dark:from-pink-900 dark:via-rose-900 dark:to-pink-800";
                          }

                          return (
                            <div key={index} className={`${gradientBg} rounded-xl border-2 border-white dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}>
                              <div className="p-5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 flex-1">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 ${badgeColor} rounded-xl flex items-center justify-center shadow-lg`}>
                                      {format.type === 'audio' || format.quality.includes('Audio') ? (
                                        <Volume2 className="w-7 h-7 text-white" />
                                      ) : (
                                        <Video className="w-7 h-7 text-white" />
                                      )}
                                    </div>
                                    
                                    {/* Quality Info */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className={`text-lg font-bold ${colorScheme}`}>
                                          {format.quality}
                                        </h3>
                                        <span className={`text-xs px-3 py-1 ${badgeColor} text-white rounded-full font-bold shadow-md`}>
                                          {format.format}
                                        </span>
                                        {(format.quality.includes('4K') || format.quality.includes('8K')) && (
                                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold shadow-md animate-pulse">
                                            ULTRA HD
                                          </span>
                                        )}
                                      </div>
                                      
                                      {/* Technical Details */}
                                      <div className={`text-sm ${colorScheme} opacity-80 grid grid-cols-2 md:grid-cols-4 gap-2`}>
                                        <span><strong>Codec:</strong> {format.codec}</span>
                                        {format.bitrate && <span><strong>Bitrate:</strong> {format.bitrate}</span>}
                                        {format.fps && <span><strong>FPS:</strong> {format.fps}</span>}
                                        {format.fileSize && format.fileSize !== 'N/A' && (
                                          <span><strong>Size:</strong> {format.fileSize}</span>
                                        )}
                                      </div>
                                      
                                      {/* Video-only note for high quality formats */}
                                      {format.note && (
                                        <div className="mt-2">
                                          <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
                                            ⚠️ {format.note}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Download Button */}
                                  <Button
                                    onClick={() => handleDownload(format)}
                                    className={`${badgeColor} hover:opacity-90 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                                    data-testid={`download-${format.quality.replace(/\s+/g, '-').toLowerCase()}`}
                                  >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <p className="text-gray-500 text-lg">⚠️ No formats available for this video.</p>
                          <p className="text-gray-400 text-sm mt-2">Please try a different video URL.</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center mt-8">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl p-6">
                        <h5 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                          🚀 SSYouTube Style Features Active!
                        </h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                          ✅ High Quality Downloads (720p to 8K) • Multiple Formats (MP4, MP3, WEBM, M4A) • Fast & Secure
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Works with YouTube, Instagram, TikTok, Facebook, Vimeo + 1000 platforms
                        </p>
                      </div>
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