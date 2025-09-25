import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Clipboard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import Header from "@/components/header";

// Lazy load footer for better initial performance
const Footer = lazy(() => import("@/components/footer"));

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  // Enable scroll animations
  useScrollAnimation();

  // Newsletter subscription functionality
  const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState<{
      type: 'idle' | 'success' | 'error';
      message: string;
    }>({ type: 'idle', message: '' });

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !email.includes('@')) {
        setSubscriptionStatus({
          type: 'error',
          message: 'Please enter a valid email address'
        });
        return;
      }

      setIsSubscribing(true);
      setSubscriptionStatus({ type: 'idle', message: '' });

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSubscriptionStatus({
            type: 'success',
            message: data.message || 'Successfully subscribed to newsletter!'
          });
          setEmail('');
        } else {
          setSubscriptionStatus({
            type: 'error',
            message: data.error || 'Failed to subscribe. Please try again.'
          });
        }
      } catch (error) {
        setSubscriptionStatus({
          type: 'error',
          message: 'Network error. Please check your connection and try again.'
        });
      } finally {
        setIsSubscribing(false);
      }
    };

    return (
      <section className="relative py-8 sm:py-12 lg:py-16 mt-12 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-blue-200 rounded-full opacity-10 blur-2xl sm:blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-indigo-200 rounded-full opacity-10 blur-2xl sm:blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container-mobile max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              <span className="mr-2">📧</span>
              Newsletter
            </div>
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Subscribe for Our Latest Updates
            </h2>
            <p className="hidden sm:block text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed px-4">
              Get the latest tools, tips, and tutorials delivered to your inbox. Join thousands of creators who trust us.
            </p>
          </div>

          <div className="max-w-md mx-auto px-4">
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-mobile w-full bg-white shadow-sm placeholder-gray-500"
                    disabled={isSubscribing}
                    data-testid="newsletter-email-input"
                  />
                  {subscriptionStatus.type === 'success' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className={`btn-mobile w-full shadow-md hover:shadow-lg ${
                    isSubscribing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  data-testid="subscribe-now-btn"
                >
                  {isSubscribing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Subscribing...
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </div>
              
              {subscriptionStatus.message && (
                <div className={`text-center text-sm mt-3 font-medium ${
                  subscriptionStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {subscriptionStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    );
  };

  const handleGenerate = async () => {
    if (!youtubeUrl) {
      toast({
        title: "URL required",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest({
        url: '/api/generate-link',
        method: 'POST',
        body: { youtubeUrl }
      });

      if (response && response.success) {
        setGeneratedLink(response.generatedLink);
        toast({
          title: "Success!",
          description: "App opener link generated successfully",
        });
      } else {
        toast({
          title: "Generation failed",
          description: response?.error || "Failed to generate link. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: "An error occurred while generating the link",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setYoutubeUrl(text);
          toast({
            title: "Pasted!",
            description: "URL pasted from clipboard",
          });
        }
      }
    } catch (error) {
      // Clipboard API might not be available in some browsers
      toast({
        title: "Paste failed",
        description: "Please paste the URL manually",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied!",
          description: "Link copied to clipboard",
        });
        return;
      }
      
      // Fallback for browsers that don't support the Clipboard API
      if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast({
            title: "Copied!",
            description: "Link copied to clipboard",
          });
        } catch (err) {
          toast({
            title: "Copy failed",
            description: "Please copy the link manually",
            variant: "destructive"
          });
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="home" />

      {/* Hero Section - Mobile First */}
      <section className="pt-8 sm:pt-12 lg:pt-20 pb-8 sm:pb-12 lg:pb-16 bg-white">
        <div className="container-mobile max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              {/* Mobile Version */}
              <span className="block sm:hidden whitespace-pre-line">
                {"App Opener Link Generator Link \nDirectly Open in YouTube App"}
              </span>
              {/* Desktop/Tablet Version */}
              <span className="hidden sm:block whitespace-pre-line">
                {"App Opener Link Generator Link Directly\nOpen in YouTube App"}
              </span>
            </h1>
            
            <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              We help you gain more followers on socials by enabling users to open a link directly in an app instead of an in-app browser.
            </p>

            {/* URL Input and Generate Button */}
            <div className="max-w-2xl mx-auto mb-8 px-4">
              {/* Mobile Layout - Separate Elements */}
              <div className="flex flex-col gap-4 sm:hidden">
                <Input
                  type="url"
                  placeholder="Paste Your URL Here"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="input-mobile text-center"
                  data-testid="url-input-mobile"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`btn-mobile w-auto px-8 bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white shadow-lg ${
                    isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  data-testid="generate-button-mobile"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Clipboard className="w-4 h-4 mr-2" />
                      <span>Generate</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Desktop Layout - Integrated Design */}
              <div className="hidden sm:block">
                <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden max-w-xl mx-auto">
                  <Input
                    type="url"
                    placeholder="Paste Your URL Here"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="flex-1 border-0 bg-transparent px-6 py-4 text-base focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none placeholder-gray-500"
                    data-testid="url-input-desktop"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  <div className="flex">
                    <button
                      onClick={pasteFromClipboard}
                      disabled={isGenerating}
                      className="p-3 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Paste from clipboard"
                      data-testid="paste-button"
                    >
                      <Clipboard className="w-5 h-5" />
                    </button>
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className={`m-1 px-6 bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white ${
                        isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                      }`}
                      data-testid="generate-button-desktop"
                    >
                      {isGenerating ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Generating...
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Link Display */}
            {generatedLink && (
              <div className="max-w-2xl mx-auto px-4 animate-fade-in">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Your App Opener Link is Ready!</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm sm:text-base text-gray-700 font-mono break-all flex-1">
                        {generatedLink}
                      </p>
                      <Button
                        onClick={() => copyToClipboard(generatedLink)}
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 text-green-600 border-green-200 hover:bg-green-50"
                        data-testid="copy-generated-link"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our More Tools Section - Lightning Fast */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t-2 border-dashed border-gray-300">
        <div className="container-mobile max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-lg font-medium mb-8 sm:mb-12">
              Our More Tools : Try It
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Thumbnail Downloader Section */}
              <Link href="/thumbnail-downloader">
                <div
                  className="card-mobile p-6 sm:p-8 hover:shadow-lg cursor-pointer"
                  data-testid="thumbnail-downloader-card"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Thumbnail Downloader
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">
                      Extract and download high-quality thumbnails
                    </p>
                  </div>
                </div>
              </Link>

              {/* Format Converter Section */}
              <Link href="/format-converter">
                <div
                  className="card-mobile p-6 sm:p-8 hover:shadow-lg cursor-pointer"
                  data-testid="format-converter-card"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Format Converter
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">
                      Convert images to any format instantly, free online.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is Section - Mobile Optimized */}
      <section className="pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="container-mobile max-w-4xl">
          <div className="animate-on-scroll">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
                What is GinyWow App Opener?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  GinyWow App Opener is a <strong className="text-gray-800">free online tool</strong> that converts regular web links into special app-opening links. When someone clicks your link, it will open directly in their mobile app (like YouTube, Instagram, etc.) instead of opening in a browser.
                </p>
                
                <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm sm:text-base text-blue-800 font-medium">
                    <strong>Why does this matter?</strong> When users stay within the app, they're more likely to subscribe, follow, or engage with your content rather than just viewing it in a browser.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">Higher engagement and conversion rates</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">Better user experience with seamless app navigation</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700">Increased followers and social media growth</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 sm:p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      App Opener Magic
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Transform any social media link into an app-opening powerhouse that drives real engagement and growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Section - Mobile Benefits */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container-mobile max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Use GinyWow App Opener?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Discover the powerful benefits that make app opener links essential for content creators and businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: "📱",
                title: "Native App Experience",
                description: "Users stay within their favorite apps instead of being redirected to browsers, creating a smoother experience."
              },
              {
                icon: "📈",
                title: "Higher Engagement",
                description: "App users are more likely to subscribe, follow, like, and share your content compared to browser visitors."
              },
              {
                icon: "⚡",
                title: "Faster Loading",
                description: "Apps load content faster than browsers, reducing bounce rates and keeping users engaged longer."
              },
              {
                icon: "🎯",
                title: "Better Conversions",
                description: "Whether it's gaining followers or driving sales, app opener links consistently outperform regular links."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="card-mobile p-6 sm:p-8 text-center animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`why-use-card-${index + 1}`}
              >
                <div className="text-3xl sm:text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Mobile Steps */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-mobile max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Generate app opener links in just 3 simple steps. No sign-up required!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Paste Your Link",
                description: "Copy any YouTube, Instagram, Facebook, or other social media link and paste it into our tool.",
                icon: "📋"
              },
              {
                step: "02", 
                title: "Generate App Link",
                description: "Click the Generate button and our tool instantly creates an optimized app opener version of your link.",
                icon: "⚙️"
              },
              {
                step: "03",
                title: "Share & Get Results",
                description: "Use your new app opener link anywhere to drive higher engagement and get more followers.",
                icon: "🚀"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="text-center animate-on-scroll"
                style={{ animationDelay: `${index * 0.2}s` }}
                data-testid={`how-it-works-step-${index + 1}`}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container-mobile max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Got questions? We've got answers. Here are the most common questions about our App Opener tool.
            </p>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: "What is an App Opener link?",
                answer: "An App Opener link is a special type of link that **opens directly in a mobile app** instead of a web browser. When someone clicks your App Opener link, it launches the respective app (like YouTube, Instagram, etc.) and takes them directly to your content."
              },
              {
                question: "Which apps are supported by the App Opener?",
                answer: "Currently, our tool supports popular apps like **YouTube, Instagram, Facebook, and Twitter**. We are working to add support for even more apps very soon."
              },
              {
                question: "Why should I use App Opener instead of a normal link?",
                answer: "A normal link usually opens in a browser, which lowers engagement. With App Opener, your audience will directly land inside the app, making it easier for them to **subscribe, follow, or engage** with your content."
              },
              {
                question: "Do I need to sign up to use this tool?",
                answer: "No sign-up is required. Just paste your link, generate the App Opener link, and share it anywhere. Simple and fast!"
              },
              {
                question: "Can businesses also use the App Opener?",
                answer: "Absolutely! Whether you're a **YouTuber, influencer, digital marketer, or business owner**, this tool helps you drive better conversions and improve customer experience."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="card-mobile p-4 sm:p-6 animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
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

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <Suspense fallback={<div className="h-20 bg-gray-100"></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}