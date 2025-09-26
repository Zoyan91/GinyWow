import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Clipboard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import Header from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { 
  homeSEO, 
  generateHomePageSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  homeBreadcrumbs,
  homeFAQs
} from "@/lib/seo";

// Direct import for faster loading
import Footer from "@/components/footer";

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  // Removed performance monitoring for faster loading

  // Generate structured data for SEO (memoized for performance)
  const structuredData = useMemo(() => [
    generateHomePageSchema(),
    generateOrganizationSchema(),
    generateBreadcrumbSchema(homeBreadcrumbs),
    generateFAQSchema(homeFAQs)
  ], []);

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
      <section className="relative py-8 sm:py-12 lg:py-16 mt-12 bg-blue-50 overflow-hidden">
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
    if (!youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(youtubeUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest('POST', '/api/short-url', { url: youtubeUrl });
      const result = await response.json();

      if (result.success) {
        setGeneratedLink(result.shortUrl);
        toast({
          title: "Success!",
          description: `Your ${result.platform || 'app opener'} link has been generated successfully!`,
        });
      } else {
        throw new Error(result.error || 'Failed to generate link');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pasteFromClipboard = async () => {
    console.log("Paste button clicked!");
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard) {
        console.log("Clipboard API not available");
        toast({
          title: "Paste not supported",
          description: "Clipboard API not available in this browser",
          variant: "destructive"
        });
        return;
      }

      // Check secure context
      if (!window.isSecureContext) {
        console.log("Not in secure context");
        toast({
          title: "Paste not supported", 
          description: "Clipboard access requires HTTPS",
          variant: "destructive"
        });
        return;
      }

      console.log("Attempting to read clipboard...");
      const text = await navigator.clipboard.readText();
      console.log("Clipboard content:", text);
      
      if (text && text.trim()) {
        console.log("Setting URL:", text.trim());
        setYoutubeUrl(text.trim());
        toast({
          title: "Pasted!",
          description: "Link pasted from clipboard",
        });
      } else {
        console.log("Clipboard empty");
        toast({
          title: "Clipboard empty",
          description: "No content found in clipboard",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Paste error:", error);
      const errorMessage = error instanceof Error ? error.message : "Please paste the link manually";
      toast({
        title: "Paste failed",
        description: `Error: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(generatedLink);
        toast({
          title: "Copied!",
          description: "Link copied to clipboard",
        });
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = generatedLink;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
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
      {/* SEO Head with comprehensive optimization */}
      <SEOHead seoData={homeSEO} structuredData={structuredData} />
      
      <Header currentPage="home" />

      {/* Hero Section - Lightning Fast */}
      <section className="relative bg-blue-50 py-8 sm:py-12 lg:py-20 overflow-hidden">
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

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center">
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
                  className={`btn-mobile w-auto px-8 bg-red-600 hover:bg-red-700 text-white shadow-lg ${
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
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-4 transition-colors flex items-center justify-center"
                      data-testid="paste-button"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className={`bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 font-semibold transition-colors ${
                        isGenerating ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      data-testid="generate-text-button"
                    >
                      {isGenerating ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Link Result */}
            {generatedLink && (
              <div className="max-w-2xl mx-auto px-4 animate-mobile-slide-up">
                <div className="card-mobile p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="flex-1 bg-gray-50 border-gray-300 text-gray-700 cursor-text text-center sm:text-left"
                      data-testid="generated-link"
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="btn-mobile-sm bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                      data-testid="copy-button"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our More Tools Section - Modern & Vibrant */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-50">
        <div className="container-mobile max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg mb-12 hover:shadow-xl transition-shadow duration-300">
              Our More Tools : Try It
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* Format Converter - Simple Blue */}
              <Link href="/format-converter">
                <div
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
                  data-testid="format-converter-card"
                >
                  {/* Background Simple Overlay */}
                  <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative text-center space-y-5">
                    <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                        Format Converter
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Convert images between 12+ formats instantly
                      </p>
                    </div>
                  </div>
                </div>
              </Link>



              {/* Mortgage Calculator - Simple Green */}
              <Link href="/mortgage-calculator">
                <div
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
                  data-testid="mortgage-calculator-card"
                >
                  {/* Background Simple Overlay */}
                  <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative text-center space-y-5">
                    <div className="w-20 h-20 mx-auto bg-green-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                        Mortgage Calculator
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Calculate home loan EMI and interest payments
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Age Calculator - Simple Orange (Desktop Only) */}
              <Link href="/age-calculator">
                <div
                  className="hidden lg:block group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
                  data-testid="age-calculator-card"
                >
                  {/* Background Simple Overlay */}
                  <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative text-center space-y-5">
                    <div className="w-20 h-20 mx-auto bg-orange-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                        Age Calculator
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Calculate your exact age in years, months, and days
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Word Counter - Simple Purple (Desktop Only) */}
              <Link href="/word-counter">
                <div
                  className="hidden lg:block group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
                  data-testid="word-counter-card"
                >
                  {/* Background Simple Overlay */}
                  <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative text-center space-y-5">
                    <div className="w-20 h-20 mx-auto bg-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                        Word Counter
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Count words, characters, and paragraphs instantly
                      </p>
                    </div>
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
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
                What is GinyWow App Opener?
              </h2>
            </div>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-responsive-sm leading-relaxed mb-4 sm:mb-6">
                <strong>GinyWow App Opener</strong>, also known as Link Opener, Social Media Opener, and Universal Link Opener, is a direct-to-app redirection tool that helps social media influencers, affiliate marketers, and businesses convert their visitors into <strong>app users</strong> and loyal followers across all platforms.
              </p>
              
              <p className="text-responsive-sm leading-relaxed">
                The <strong>GinyWow App Opener link generator</strong> allows creators to generate custom links for social media profiles including <strong>YouTube, Instagram, TikTok, Facebook, Twitter, LinkedIn</strong>, and many others. Normally, when you share social media links across platforms, users end up browsing within in-app browsers which provide a poor user experience and low engagement rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Section - Mobile Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container-mobile max-w-5xl">
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-8">
                Why Use GinyWow App Opener?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                  title: "Better User Experience",
                  description: "Open links directly in native apps for smoother navigation",
                  color: "blue"
                },
                {
                  icon: <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                  title: "Higher Engagement",
                  description: "Native app experience leads to better user retention",
                  color: "green"
                },
                {
                  icon: <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                  title: "Universal Compatibility",
                  description: "Works with all major social media platforms and websites",
                  color: "purple"
                },
                {
                  icon: <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
                  title: "Increased Followers",
                  description: "Better experience converts more visitors to followers",
                  color: "orange"
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="card-mobile p-4 sm:p-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${benefit.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Mobile Steps */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-mobile max-w-4xl">
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-8">
                How to Use GinyWow App Opener?
              </h2>
              <p className="text-responsive-sm text-gray-600">Simple 3-step process:</p>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  number: 1,
                  title: "Paste Your URL",
                  description: "Copy and paste any social media or website URL into the input field",
                  bgColor: "bg-blue-600"
                },
                {
                  number: 2,
                  title: "Generate Link",
                  description: "Click 'Generate' to create your smart app-opening link",
                  bgColor: "bg-green-600"
                },
                {
                  number: 3,
                  title: "Share & Engage",
                  description: "Share your new link and watch users open it directly in apps",
                  bgColor: "bg-purple-600"
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="card-mobile p-4 sm:p-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${step.bgColor} text-white rounded-full flex items-center justify-center text-sm sm:text-base font-bold flex-shrink-0`}>
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container-mobile max-w-4xl">
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-8">
                Frequently Asked Questions (FAQ)
              </h2>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  question: "Is the App Opener tool free to use?",
                  answer: "Yes! Our App Opener tool is completely free. You can generate unlimited app opener links without any hidden charges."
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
                  className="card-mobile p-4 sm:p-6"
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
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}