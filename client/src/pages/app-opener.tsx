import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ExternalLink, ArrowRight, Smartphone, Users, BarChart3, CheckCircle } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiYoutube, SiPinterest } from 'react-icons/si';
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AppOpener() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const parseYouTubeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname === '/watch') {
          return { type: 'video', id: urlObj.searchParams.get('v'), path: urlObj.pathname + urlObj.search };
        } else if (urlObj.pathname.startsWith('/playlist')) {
          return { type: 'playlist', id: urlObj.searchParams.get('list'), path: urlObj.pathname + urlObj.search };
        } else if (urlObj.pathname.startsWith('/channel/')) {
          const channelId = urlObj.pathname.split('/channel/')[1];
          return { type: 'channel', id: channelId, path: urlObj.pathname, isUcid: channelId.startsWith('UC') };
        } else if (urlObj.pathname.startsWith('/c/')) {
          const customName = urlObj.pathname.split('/c/')[1];
          return { type: 'channel', id: customName, path: urlObj.pathname, isUcid: false };
        } else if (urlObj.pathname.startsWith('/@')) {
          const handle = urlObj.pathname.split('/@')[1];
          return { type: 'channel', id: handle, path: urlObj.pathname, isUcid: false };
        } else if (urlObj.pathname.startsWith('/shorts/')) {
          return { type: 'shorts', id: urlObj.pathname.split('/shorts/')[1], path: urlObj.pathname };
        }
      } else if (urlObj.hostname === 'youtu.be') {
        return { type: 'video', id: urlObj.pathname.slice(1), path: `/watch?v=${urlObj.pathname.slice(1)}` };
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const generateDeepLinks = (parsed: any, originalUrl: string) => {
    const encodedUrl = encodeURIComponent(originalUrl);
    
    let iosLink = '';
    let androidLink = '';
    
    if (parsed.type === 'video') {
      iosLink = `youtube://watch?v=${parsed.id}`;
      androidLink = `intent://www.youtube.com/watch?v=${parsed.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
    } else if (parsed.type === 'playlist') {
      iosLink = `youtube://playlist?list=${parsed.id}`;
      androidLink = `intent://www.youtube.com/playlist?list=${parsed.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
    } else if (parsed.type === 'channel') {
      if (parsed.isUcid) {
        // UCID format - use channel path
        iosLink = `youtube://www.youtube.com/channel/${parsed.id}`;
        androidLink = `intent://www.youtube.com/channel/${parsed.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
      } else {
        // Handle or custom name - preserve original path
        iosLink = `youtube://www.youtube.com${parsed.path}`;
        androidLink = `intent://www.youtube.com${parsed.path}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
      }
    } else if (parsed.type === 'shorts') {
      iosLink = `youtube://shorts/${parsed.id}`;
      androidLink = `intent://www.youtube.com/shorts/${parsed.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
    }
    
    return { iosLink, androidLink, webLink: originalUrl };
  };

  const handleGenerate = async () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive"
      });
      return;
    }

    if (!youtubeUrl.includes("youtube.com") && !youtubeUrl.includes("youtu.be")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Parse YouTube URL and generate proper deep links
    const parsed = parseYouTubeUrl(youtubeUrl);
    
    if (!parsed || !parsed.id) {
      toast({
        title: "Invalid URL",
        description: "Could not parse YouTube URL. Please check the format.",
        variant: "destructive"
      });
      setIsGenerating(false);
      return;
    }
    
    const { iosLink, androidLink, webLink } = generateDeepLinks(parsed, youtubeUrl);
    
    // Store all links for display
    setGeneratedLink(JSON.stringify({
      ios: iosLink,
      android: androidLink, 
      web: webLink,
      type: parsed.type
    }));
    setIsGenerating(false);
    
    toast({
      title: "Success!",
      description: "Your app opener link has been generated with platform-specific deep links",
    });
  };

  const copyToClipboard = (link: string, platform: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: `${platform} link copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              Giny<span className="text-blue-600">Wow</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              YouTube Optimizer
            </Link>
            <Link href="/app-opener" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              App Opener
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Contact Us
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Blog
            </Link>
          </nav>

          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              App Opener Link Generator
              <span className="block text-blue-600 mt-2">Link Directly Open in YouTube App</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We help you gain more followers on socials by enabling users to open a 
              link directly in an app instead of an in-app browser.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-blue-100 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Generate Your App Opener Link</CardTitle>
                <CardDescription className="text-gray-600">
                  Convert your YouTube link to open directly in the YouTube app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://youtube.com/channel/your-channel"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full"
                    data-testid="youtube-url-input"
                  />
                </div>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  data-testid="generate-link-button"
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Generate App Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                {generatedLink && (() => {
                  const links = JSON.parse(generatedLink);
                  return (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <label className="block text-sm font-medium text-green-800 mb-4">
                        Your App Opener Links ({links.type})
                      </label>
                      
                      <div className="space-y-3">
                        {/* iOS Link */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">iOS App Link</label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={links.ios}
                              readOnly
                              className="flex-1 bg-white border-green-300 text-sm"
                              data-testid="ios-link"
                            />
                            <Button
                              onClick={() => copyToClipboard(links.ios, "iOS")}
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              data-testid="copy-ios-button"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Android Link */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Android App Link</label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={links.android}
                              readOnly
                              className="flex-1 bg-white border-green-300 text-sm"
                              data-testid="android-link"
                            />
                            <Button
                              onClick={() => copyToClipboard(links.android, "Android")}
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              data-testid="copy-android-button"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Web Link */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Web Fallback Link</label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={links.web}
                              readOnly
                              className="flex-1 bg-white border-green-300 text-sm"
                              data-testid="web-link"
                            />
                            <Button
                              onClick={() => copyToClipboard(links.web, "Web")}
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              data-testid="copy-web-button"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xs text-blue-800">
                          <strong>How to use:</strong> Copy the iOS link for iPhone/iPad users, Android link for Android users, 
                          or the web link as a universal fallback that works in any browser.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What is App Opener Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              What is an App opener link generator?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">
                App Opener, AKA Link Opener, YouTube Opener, Instagram Link Opener and so on, is a directly to app redirection tool which help to social media influencers, affiliate marketer and businesses to convert their social media visitor in to YouTube subscriber.
              </p>
              <p className="text-lg leading-relaxed">
                App opener link generator helps social media influencers to generate custom links for social media profiles including YouTube, Facebook page, Instagram, Twitter etc. You all know that if we take the link of a YouTube channel on Instagram or Facebook profile. So whenever a user clicks on it, the link gets opened in their browser, due to which there is a lot of problem. So for this we have created an App opener link generator. With which any creators can send their users to the App directly from any social media profile link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How does the App Opener link generator work?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Open GinyWow website
              </h3>
              <p className="text-gray-600">
                Visit our app opener tool page in your browser
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SiYoutube className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Paste your YouTube URL
              </h3>
              <p className="text-gray-600">
                Enter your YouTube channel or video URL
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Click Generate
              </h3>
              <p className="text-gray-600">
                Hit the generate button to create your app link
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get your app link
              </h3>
              <p className="text-gray-600">
                Copy and share your direct app opening link
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why App Opener?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We help you gain more followers on socials by enabling users to open a link directly in an app instead of an in-app browser.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">App Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate smart app link for YouTube videos to improve engagement and user experience.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Free Forever</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  App Opener is a free tool for everyone, Create direct open in app link.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Link Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track video links with App opener smart analytics and engagement metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">20K+</div>
              <div className="text-blue-100">Links Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Creators</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">400K+</div>
              <div className="text-blue-100">Clicks</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
              Is it FREE?
            </h2>
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-600 mb-4">
                Yes, App opener is 100% free to all.
              </p>
              <p className="text-lg text-gray-600">
                We help you gain more followers on socials by enabling users to open a link directly in an app instead of an in-app browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">
                  Giny<span className="text-blue-400">Wow</span>
                </span>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                We offer PDF, video, image and other online tools to make your life easier. Free tools for content creation, file conversion, and productivity enhancement.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">YouTube Optimizer</Link></li>
                <li><Link href="/app-opener" className="text-gray-400 hover:text-white transition-colors">App Opener</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SiFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SiX className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SiLinkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SiYoutube className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SiPinterest className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <span className="text-lg font-bold">
                  Giny<span className="text-blue-400">Wow</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm text-center md:text-right">
                © 2024 GinyWow. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}