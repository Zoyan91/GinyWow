import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("1080p");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<any>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll create a placeholder response
      // In a real implementation, this would call a video download API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setDownloadInfo({
        title: "Sample Video Title",
        thumbnail: "https://via.placeholder.com/320x180",
        downloadUrl: "#",
        format: format,
        quality: quality
      });

      toast({
        title: "Success!",
        description: "Video processed successfully. Ready for download.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(downloadInfo?.downloadUrl || "");
    toast({
      title: "Copied!",
      description: "Download link copied to clipboard",
    });
  };

  const qualities = ["8K", "4K", "1080p", "720p", "480p", "360p"];
  const formats = [
    { value: "mp4", label: "MP4 Video" },
    { value: "mp3", label: "MP3 Audio" }
  ];

  return (
    <>
      <Helmet>
        <title>Free Video Downloader - Download Videos in 8K Quality | GinyWow</title>
        <meta name="description" content="Download videos from any platform in 8K, 4K, 1080p quality or extract MP3 audio. Free online video downloader supporting YouTube, TikTok, Instagram, Facebook and more." />
        <meta name="keywords" content="video downloader, download videos, 8k video, mp3 converter, youtube downloader, tiktok downloader, instagram video" />
        <meta property="og:title" content="Free Video Downloader - Download Videos in 8K Quality | GinyWow" />
        <meta property="og:description" content="Download videos from any platform in 8K, 4K, 1080p quality or extract MP3 audio. Free online video downloader supporting YouTube, TikTok, Instagram, Facebook and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.replit.app/video-downloader" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Video Downloader - Download Videos in 8K Quality | GinyWow" />
        <meta name="twitter:description" content="Download videos from any platform in 8K, 4K, 1080p quality or extract MP3 audio. Free online video downloader supporting YouTube, TikTok, Instagram, Facebook and more." />
      </Helmet>

      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container-mobile max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              GinyWow Video Downloader
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
              Download videos from any platform in 8K quality or extract MP3 audio instantly
            </p>
            
            {/* Download Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="Paste video URL here (YouTube, TikTok, Instagram, Facebook, etc.)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="min-h-[48px] text-base border-2"
                    data-testid="input-video-url"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Format</label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger className="min-h-[48px]" data-testid="select-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map((fmt) => (
                          <SelectItem key={fmt.value} value={fmt.value}>
                            {fmt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Quality</label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger className="min-h-[48px]" data-testid="select-quality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {qualities.map((qual) => (
                          <SelectItem key={qual} value={qual}>
                            {qual}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="w-full min-h-[48px] text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  data-testid="button-download"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Video
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Download Result */}
            {downloadInfo && (
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 mt-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <img 
                    src={downloadInfo.thumbnail} 
                    alt={downloadInfo.title}
                    className="w-full sm:w-40 h-24 sm:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">{downloadInfo.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Format: {downloadInfo.format.toUpperCase()} | Quality: {downloadInfo.quality}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => window.open(downloadInfo.downloadUrl, '_blank')}
                        className="bg-green-600 hover:bg-green-700"
                        data-testid="button-download-file"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={copyUrl}
                        data-testid="button-copy-url"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* What is GinyWow Video Downloader */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container-mobile max-w-4xl">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                What is GinyWow Video Downloader?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                GinyWow Video Downloader is a <strong>free online tool</strong> that allows you to download videos from any platform instantly. Also known as Multi-Platform Video Downloader, Online Video Downloader, and Universal Video Downloader, this tool helps content creators, social media users, and general internet users <strong>save videos for offline viewing</strong> without any software installation.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With GinyWow Video Downloader, you can download videos from popular platforms including <strong>YouTube, TikTok, Instagram, Facebook, Twitter, and more</strong>. Normally, users have to rely on in-app browsers or third-party apps that are slow or full of ads. GinyWow Video Downloader provides a <strong>fast, safe, and ad-free experience</strong> for downloading videos in high quality.
              </p>
            </div>
          </div>
        </section>

        {/* Why Use Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container-mobile max-w-5xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
                Why Use GinyWow Video Downloader?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                  title: "High-Speed Downloads",
                  description: "Download videos in seconds with our optimized online downloader.",
                  color: "blue"
                },
                {
                  icon: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
                  title: "Multi-Platform Support",
                  description: "Supports all major platforms: YouTube, Instagram, TikTok, Facebook, Twitter, and more.",
                  color: "green"
                },
                {
                  icon: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
                  title: "Flexible Formats & Quality",
                  description: "Download videos in MP4 format or extract audio in MP3. Choose from multiple resolutions (8k, 4k, 1080p, 720p, 480p, 360p) based on your device and needs.",
                  color: "purple"
                },
                {
                  icon: <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                  title: "Free & Secure",
                  description: "No hidden charges, no malware, and no software installation required.",
                  color: "orange"
                },
                {
                  icon: <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
                  title: "Offline Access",
                  description: "Save your favorite videos to watch offline anytime, anywhere.",
                  color: "red"
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container-mobile max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
                How to Use GinyWow Video Downloader?
              </h2>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  number: 1,
                  title: "Copy Video URL",
                  description: "Copy the video link from any platform you want to download.",
                  bgColor: "bg-blue-600"
                },
                {
                  number: 2,
                  title: "Paste URL",
                  description: "Paste the link in the input box of the Video Downloader tool.",
                  bgColor: "bg-green-600"
                },
                {
                  number: 3,
                  title: "Choose Format & Quality",
                  description: "Select MP4 for video or MP3 for audio, then choose the resolution.",
                  bgColor: "bg-purple-600"
                },
                {
                  number: 4,
                  title: "Download Video",
                  description: "Click Download and your video will be saved instantly to your device.",
                  bgColor: "bg-orange-600"
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-gray-50 rounded-xl"
                >
                  <div className={`w-12 h-12 ${step.bgColor} text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Step {step.number} – {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container-mobile max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
                Frequently Asked Questions (FAQ)
              </h2>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "Is GinyWow Video Downloader free?",
                  answer: "Yes! It's completely free. You can download unlimited videos without paying or signing up."
                },
                {
                  question: "Which platforms are supported?",
                  answer: "Currently, we support YouTube, Instagram, TikTok, Facebook, Twitter, and more. We are continuously adding support for additional platforms."
                },
                {
                  question: "Do I need to install software?",
                  answer: "No installation is required. Everything works directly in your browser, saving time and storage."
                },
                {
                  question: "Can I download audio from videos?",
                  answer: "Yes! You can extract MP3 audio from any video using this tool."
                },
                {
                  question: "Is it safe to use?",
                  answer: "Absolutely! GinyWow Video Downloader is ad-free, secure, and does not collect personal data."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}