import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Clipboard, Search, Menu, X, CheckCircle, Users, Zap, Shield, ArrowRight, MessageCircle } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiYoutube, SiPinterest } from 'react-icons/si';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function AppOpener() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { toast } = useToast();

  // Search functionality
  const searchableItems = [
    {
      id: "youtube-optimizer",
      title: "YouTube Optimizer",
      description: "Enhance thumbnails and optimize titles",
      category: "YouTube Tools",
      path: "/"
    },
    {
      id: "contact",
      title: "Contact Us",
      description: "Get in touch with our team",
      category: "Pages",
      path: "/contact"
    },
    {
      id: "blog",
      title: "Blog",
      description: "Latest tips and tutorials",
      category: "Pages", 
      path: "/blog"
    }
  ];

  const searchResults = searchableItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchItemClick = (item: any) => {
    if (item.path) {
      window.location.href = item.path;
    }
    setSearchQuery("");
    setIsSearchFocused(false);
  };

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
      <section className="relative py-12 sm:py-16 lg:py-20 mt-16 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-10 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full opacity-10 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
              <span className="mr-2">📧</span>
              Newsletter
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Subscribe for Our Latest Updates
            </h2>
            <p className="hidden sm:block text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get the latest tools, tips, and tutorials delivered to your inbox. Join thousands of creators who trust us.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm placeholder-gray-500"
                    disabled={isSubscribing}
                    data-testid="newsletter-email-input"
                  />
                  {subscriptionStatus.type === 'success' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[48px] w-full sm:w-auto ${
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
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 cursor-pointer hover:opacity-80 transition-opacity" data-testid="logo">
                  <span className="text-gray-900">Giny</span><span className="text-blue-600">Wow</span>
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-youtube-optimizer">
                  YouTube Optimizer
                </button>
              </Link>
              
              <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium" data-testid="nav-app-opener">
                App Opener
              </button>
              
              <Link href="/contact">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-contact">
                  Contact Us
                </button>
              </Link>
              
              <Link href="/blog">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-blog">
                  Blog
                </button>
              </Link>
            </div>
            
            {/* Desktop Search and Sign In */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden lg:block">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  className="pl-10 pr-4 py-2 w-64 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  data-testid="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                
                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-96 overflow-y-auto mt-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <button
                          key={item.id}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
                          onMouseDown={() => handleSearchItemClick(item)}
                          data-testid={`search-result-${item.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">
                                {item.description}
                              </p>
                              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center" data-testid="no-results-message">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sign In */}
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                data-testid="sign-in"
              >
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button and Sign In */}
            <div className="flex md:hidden items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-3 py-1"
                data-testid="mobile-sign-in"
              >
                Sign In
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="mobile-menu-button"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
            data-testid="mobile-menu"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg text-base"
                  data-testid="mobile-search-input"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-3">
                <div className="border-b border-gray-100 pb-3">
                  <Link href="/">
                    <button className="block text-gray-600 hover:text-gray-900 py-3 text-base font-medium" data-testid="mobile-nav-youtube-optimizer">
                      YouTube Optimizer
                    </button>
                  </Link>
                  <button className="block text-blue-600 hover:text-blue-700 py-3 text-base font-medium" data-testid="mobile-nav-app-opener">
                    App Opener
                  </button>
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <Link href="/contact">
                    <button className="block text-gray-600 hover:text-gray-900 py-3 text-base font-medium" data-testid="mobile-nav-contact">
                      Contact Us
                    </button>
                  </Link>
                </div>

                <div className="pb-3">
                  <Link href="/blog">
                    <button className="block text-gray-600 hover:text-gray-900 py-3 text-base font-medium" data-testid="mobile-nav-blog">
                      Blog
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              App Opener Link Generator - Open Links Directly in Apps
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
              Convert any social media or website link into smart links that open directly in mobile apps instead of browsers.
            </p>

            {/* URL Input and Generate Button */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="url"
                  placeholder="https://instagram.com/p/..., https://tiktok.com/..., https://youtube.com/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 h-14 px-6 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-orange-400"
                  data-testid="url-input"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="h-14 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-70"
                  data-testid="generate-button"
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Clipboard className="w-5 h-5" />
                      <span>Generate</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Link Result */}
            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl mx-auto"
              >
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="flex-1 h-12 bg-gray-50 border-gray-300 text-gray-700 cursor-text"
                      data-testid="generated-link"
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                      data-testid="copy-button"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* What is GinyWow App Opener Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What is GinyWow App Opener?
              </h2>
            </div>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                <strong>GinyWow App Opener</strong>, also known as Link Opener, Social Media Opener, and Universal Link Opener, is a direct-to-app redirection tool that helps social media influencers, affiliate marketers, and businesses convert their visitors into <strong>app users</strong> and loyal followers across all platforms.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                The <strong>GinyWow App Opener link generator</strong> allows creators to generate custom links for social media profiles including <strong>YouTube, Instagram, TikTok, Facebook, Twitter, LinkedIn</strong>, and many others. Normally, when you share social media links across platforms, they open in a browser instead of the native app, which creates a poor user experience.
              </p>
              
              <p className="text-lg leading-relaxed">
                To solve this problem, we created <strong>GinyWow App Opener</strong>. With this tool, any creator can redirect their users directly to the app from any social media profile link — ensuring higher engagement and better conversions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Use Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Why Use GinyWow App Opener?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Better Conversions</h3>
                    <p className="text-gray-600">Visitors directly land on the app, which means more followers, subscribers, and engagement.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Improved User Experience</h3>
                    <p className="text-gray-600">No unnecessary browser redirects, just smooth app opening.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Creator-Friendly</h3>
                    <p className="text-gray-600">Perfect for YouTubers, Instagram influencers, and digital marketers.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">All-in-One Tool</h3>
                    <p className="text-gray-600">Works for multiple apps like YouTube, Instagram, Twitter, Facebook, and more.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                How Does GinyWow App Opener Work?
              </h2>
              <p className="text-lg text-gray-600 mb-8">Using the tool is simple:</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <div className="prose prose-lg">
                  <p className="text-lg text-gray-600 m-0">Copy your profile or channel link.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div className="prose prose-lg">
                  <p className="text-lg text-gray-600 m-0">Paste it into the <strong>GinyWow App Opener generator</strong>.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div className="prose prose-lg">
                  <p className="text-lg text-gray-600 m-0">Get your customized app opener link.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  4
                </div>
                <div className="prose prose-lg">
                  <p className="text-lg text-gray-600 m-0">Share it on your social media profiles.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-lg text-gray-600">
                Now, whenever someone clicks your link, instead of a browser, the app will open directly.
              </p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Benefits for Creators & Businesses
              </h2>
            </div>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg leading-relaxed">
                With the <strong>GinyWow App Opener tool</strong>, you don't lose traffic due to browser redirects. It's easier for your audience to subscribe, follow, or interact with your content directly inside the app, which increases your growth and reach.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions (FAQ)
              </h2>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Is GinyWow App Opener free to use?</h3>
                <p className="text-lg text-gray-600">Yes! <strong>GinyWow App Opener</strong> is completely free. You can generate unlimited app opener links without any hidden charges.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Which apps are supported by GinyWow App Opener?</h3>
                <p className="text-lg text-gray-600">Currently, our tool supports popular apps like <strong>YouTube, Instagram, TikTok, Facebook, Twitter, LinkedIn</strong>, and many other websites. We are continuously adding support for more platforms.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Why should I use GinyWow App Opener instead of a normal link?</h3>
                <p className="text-lg text-gray-600">A normal link usually opens in a browser, which lowers engagement. With <strong>GinyWow App Opener</strong>, your audience will directly land inside the app, making it easier for them to <strong>subscribe, follow, or engage</strong> with your content.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">4. Do I need to sign up to use GinyWow App Opener?</h3>
                <p className="text-lg text-gray-600">No sign-up is required. Just paste your link, generate the opener link, and share it anywhere. Simple and fast!</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5. Can businesses also use GinyWow App Opener?</h3>
                <p className="text-lg text-gray-600">Absolutely! Whether you're a <strong>YouTuber, influencer, digital marketer, or business owner</strong>, this tool helps you drive better conversions and improve customer experience.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-100 py-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Menus */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Menus</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            {/* YouTube Tools */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">YouTube Tools</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Thumbnail & Title Optimizer</Link></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">YouTube App Opener</a></li>
              </ul>
            </div>
            
            {/* Contact Us */}
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Contact us</h4>
              <div className="mb-4">
                <a 
                  href="mailto:info@ginywow.com" 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  data-testid="footer-email"
                >
                  info@ginywow.com
                </a>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex space-x-3 mt-4">
                <a 
                  href="#" 
                  className="w-9 h-9 bg-gray-100 hover:bg-[#1877F2] rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Facebook"
                  data-testid="icon-facebook"
                >
                  <SiFacebook className="w-4 h-4 text-gray-600 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 bg-gray-100 hover:bg-[#1DA1F2] rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Twitter"
                  data-testid="icon-twitter"
                >
                  <SiX className="w-4 h-4 text-gray-600 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 bg-gray-100 hover:bg-[#0A66C2] rounded-full flex items-center justify-center transition-colors group"
                  aria-label="LinkedIn"
                  data-testid="icon-linkedin"
                >
                  <SiLinkedin className="w-4 h-4 text-gray-600 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 bg-gray-100 hover:bg-[#FF0000] rounded-full flex items-center justify-center transition-colors group"
                  aria-label="YouTube"
                  data-testid="icon-youtube"
                >
                  <SiYoutube className="w-4 h-4 text-gray-600 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 bg-gray-100 hover:bg-[#E60023] rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Pinterest"
                  data-testid="icon-pinterest"
                >
                  <SiPinterest className="w-4 h-4 text-gray-600 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 order-1 md:order-2 mb-4 md:mb-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-lg font-bold text-gray-900">Giny</span>
                  <span className="text-lg font-bold text-blue-600">Wow</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center order-2 md:order-1">
              <p className="text-sm text-gray-600">© 2025 GinyWow.com | All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}