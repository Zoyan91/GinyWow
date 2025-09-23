import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin, SiYoutube, SiPinterest } from 'react-icons/si';
import { Link, useLocation } from "wouter";
import type { Thumbnail, TitleOptimization } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  
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
        console.error('Newsletter subscription error:', error);
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
        {/* Background decoration - simplified */}
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
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Subscribe Now</span>
                      <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </Button>
              </div>
              
              {/* Status messages */}
              {subscriptionStatus.type !== 'idle' && (
                <div className={`p-4 rounded-lg text-sm font-medium ${
                  subscriptionStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center">
                    {subscriptionStatus.type === 'success' ? (
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {subscriptionStatus.message}
                  </div>
                </div>
              )}
            </form>
            
            <div className="hidden sm:block mt-6 text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    path?: string;
    action?: () => void;
  }>>([]);

  // Search data - available tools and pages
  const searchableItems = [
    {
      id: "thumbnail-optimizer",
      title: "YouTube Thumbnail Optimizer",
      description: "Optimize your YouTube thumbnails with AI-powered suggestions",
      category: "YouTube Tools",
      action: () => {
        document.getElementById('thumbnail-upload')?.scrollIntoView({ behavior: 'smooth' });
        setSearchQuery("");
        setIsSearchFocused(false);
      }
    },
    {
      id: "title-optimizer", 
      title: "YouTube Title Optimizer",
      description: "Get AI-powered title suggestions for better CTR",
      category: "YouTube Tools",
      action: () => {
        document.getElementById('title-input')?.scrollIntoView({ behavior: 'smooth' });
        setSearchQuery("");
        setIsSearchFocused(false);
      }
    },
    {
      id: "contact",
      title: "Contact Us",
      description: "Get in touch with our team",
      category: "Pages",
      path: "/contact"
    },
    {
      id: "about",
      title: "About GinyWow",
      description: "Learn more about our online tools platform",
      category: "Pages",
      path: "/about"
    },
    {
      id: "blog",
      title: "Blog",
      description: "Read our latest articles and tips",
      category: "Pages",
      path: "/blog"
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      description: "Our privacy policy and data handling practices",
      category: "Pages", 
      path: "/privacy"
    }
  ];

  // Search functionality
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      const filtered = searchableItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchItemClick = (item: {
    id: string;
    title: string;
    description: string;
    category: string;
    path?: string;
    action?: () => void;
  }) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      setLocation(item.path);
    }
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleFileUpload = (file: File) => {
    setUploadError("");
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    
    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB.");
      return;
    }
    
    // Clean up previous preview URL
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    
    // Create new preview URL
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    setUploadedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleOptimize = async () => {
    if (!uploadedFile || !title.trim()) return;
    
    setIsOptimizing(true);
    setOptimizationResult(null);
    
    try {
      const formData = new FormData();
      formData.append('thumbnail', uploadedFile);
      formData.append('title', title.trim());
      
      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to optimize');
      }
      
      const result = await response.json();
      setOptimizationResult(result);
    } catch (error) {
      console.error('Optimization error:', error);
      setOptimizationResult({
        error: 'Failed to optimize. Please try again.'
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

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
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-youtube-optimizer">
                YouTube Optimizer
              </button>
              
              <Link href="/app-opener">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-app-opener">
                  App Opener
                </button>
              </Link>
              
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
                  <button className="block text-gray-600 hover:text-gray-900 py-3 text-base font-medium" data-testid="mobile-nav-youtube-optimizer">
                    YouTube Optimizer
                  </button>
                  <Link href="/app-opener">
                    <button className="block text-gray-600 hover:text-gray-900 py-3 text-base font-medium" data-testid="mobile-nav-app-opener">
                      App Opener
                    </button>
                  </Link>
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

      {/* Hero Section */}
      <section className="bg-background/50 backdrop-blur-sm py-8 sm:py-12 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
              <span className="block sm:inline">Enhance Your YouTube Thumbnails</span>
              <span className="block sm:inline">&nbsp;& Titles in Seconds</span>
            </h1>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-6 sm:px-4">
              {/* Mobile - Original Text */}
              <span className="block sm:hidden">
                <span className="block mb-3 text-center">Professional AI enhancement that improves every detail while preserving your original design.</span>
                <span className="block text-center">Make your thumbnails more eye-catching and boost your CTR instantly.</span>
              </span>
              
              {/* Desktop - Original */}
              <span className="hidden sm:block">
                <span className="inline">Professional AI enhancement that improves every detail while preserving your original design.</span>
                <span className="inline"> Make your thumbnails more eye-catching and boost your CTR instantly.</span>
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-background/50 backdrop-blur-sm container mx-auto px-4 sm:px-6 py-4 max-w-4xl relative z-10">
        
        {/* YouTube Thumbnail & Title Optimizer Tool */}
        <motion.div 
          className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl shadow-blue-500/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          data-testid="optimizer-tool"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 px-2">
              YouTube Thumbnail & Title Optimizer
            </h1>
            <p className="text-gray-600 text-sm sm:text-base px-4">
              Upload your thumbnail and enter your title to get optimization suggestions.
            </p>
          </div>

          {/* Thumbnail Upload Section */}
          <div className="mb-6">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3 px-1">
              Thumbnail
            </label>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/jpeg,image/png,image/webp" 
              className="hidden" 
              id="thumbnail-upload" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div 
              className={`border-2 border-dashed rounded-lg ${thumbnailPreview ? 'p-2 sm:p-3' : 'p-6 sm:p-8'} text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : uploadError 
                  ? 'border-red-300 bg-red-50' 
                  : thumbnailPreview
                  ? 'border-green-300'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              data-testid="thumbnail-upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {thumbnailPreview ? (
                <div className="relative w-full aspect-video rounded-md bg-white overflow-hidden">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="absolute inset-0 w-full h-full object-contain object-center"
                    data-testid="thumbnail-preview"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className={`mb-3 text-sm sm:text-base px-2 ${
                    uploadError ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {uploadError || "Drop your thumbnail here or click to browse"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-5 px-2">Supports: JPG, PNG, WebP (Max 5MB)</p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base font-medium min-h-[44px]"
                    data-testid="upload-thumbnail-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Thumbnail
                  </Button>
                </div>
              )}
            </div>
            
            {/* Change Thumbnail Button - Outside Border */}
            {thumbnailPreview && (
              <div className="text-center mt-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto"
                  data-testid="change-thumbnail-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Change Thumbnail
                </Button>
              </div>
            )}
          </div>

          {/* YouTube Title Section */}
          <div className="mb-6 sm:mb-8" id="title-input">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3 px-1">
              YouTube Title
            </label>
            <Input 
              type="text"
              className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[44px]"
              placeholder="Enter your YouTube title here..."
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="youtube-title-input"
            />
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-xs sm:text-sm text-gray-500" data-testid="character-count">{title.length}/100 characters</span>
            </div>
          </div>

          {/* Optimize Button */}
          <div className="text-center">
            <Button 
              className={`px-8 py-4 sm:px-12 sm:py-4 rounded-lg font-medium transition-colors text-base sm:text-lg min-h-[52px] w-full sm:w-auto ${
                uploadedFile && title.trim() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-400 text-white cursor-not-allowed'
              }`}
              disabled={!uploadedFile || !title.trim() || isOptimizing}
              onClick={handleOptimize}
              data-testid="optimize-now-btn"
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Now'}
            </Button>
          </div>

          {/* Results Section */}
          {optimizationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 sm:mt-8 bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200"
              data-testid="optimization-results"
            >
              {optimizationResult.error ? (
                <div className="text-red-600 text-center">
                  <svg className="w-8 h-8 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="font-medium">{optimizationResult.error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Professional Before/After Thumbnail Comparison */}
                  {optimizationResult.thumbnailComparison && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-xl">
                      <div className="text-center mb-6 sm:mb-8">
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-2">Thumbnail Comparison</h4>
                        <p className="text-sm sm:text-base text-gray-600 px-4">See the enhancement applied to your thumbnail</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Before Image */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                            Before
                          </div>
                          <div className="relative w-full aspect-video rounded-xl bg-gray-100 overflow-hidden border-2 border-gray-300 shadow-lg">
                            <img 
                              src={optimizationResult.thumbnailComparison.before} 
                              alt="Original thumbnail" 
                              className="absolute inset-0 w-full h-full object-contain object-center"
                              data-testid="before-thumbnail"
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-3 font-medium">Your uploaded thumbnail</p>
                        </div>

                        {/* After Image - AI Enhanced */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                            After
                          </div>
                          <div className="relative w-full aspect-video rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden border-2 border-green-500 shadow-xl shadow-green-500/20">
                            <img 
                              src={optimizationResult.thumbnailComparison.after} 
                              alt="AI-Enhanced thumbnail with professional quality improvements" 
                              className="absolute inset-0 w-full h-full object-contain object-center filter drop-shadow-lg"
                              data-testid="after-thumbnail"
                            />
                          </div>
                          <div className="mt-4 sm:mt-6">
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = optimizationResult.thumbnailComparison.after;
                                link.download = 'enhanced-thumbnail.jpg';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="px-6 py-3 sm:px-8 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg text-sm sm:text-base min-h-[44px]"
                              data-testid="download-enhanced-thumbnail"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 8h8a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                              </svg>
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  )}

                  {/* Title Suggestions */}
                  {optimizationResult.titleSuggestions && optimizationResult.titleSuggestions.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                      <div className="p-4 sm:p-6 border-b border-gray-100">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 px-1">Title Suggestions</h3>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1 px-1">Use the copy button to copy any title</p>
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          {optimizationResult.titleSuggestions.map((suggestion: any, index: number) => (
                            <div 
                              key={index} 
                              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 gap-3 sm:gap-0"
                            >
                              <div className="flex-1 sm:mr-3">
                                <p className="text-gray-800 font-medium leading-relaxed text-sm sm:text-base">{suggestion.title}</p>
                              </div>
                              <button
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(suggestion.title);
                                    setCopiedIndex(index);
                                    setTimeout(() => setCopiedIndex(null), 2000);
                                  } catch (err) {
                                    // Fallback for browsers that don't support clipboard API
                                    const textArea = document.createElement('textarea');
                                    textArea.value = suggestion.title;
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textArea);
                                    setCopiedIndex(index);
                                    setTimeout(() => setCopiedIndex(null), 2000);
                                  }
                                }}
                                className="flex-shrink-0 flex items-center gap-2 px-4 py-3 sm:px-3 sm:py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md border border-blue-200 hover:border-blue-300 transition-all duration-200 text-sm font-medium min-h-[44px] sm:min-h-auto w-full sm:w-auto justify-center sm:justify-start"
                                data-testid={`copy-title-${index}`}
                              >
                                {copiedIndex === index ? (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Thumbnail Analysis */}
                  {optimizationResult.thumbnailAnalysis && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Thumbnail Analysis</h4>
                      <p className="text-gray-600 text-sm">{optimizationResult.thumbnailAnalysis}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* What is YouTube Thumbnail & Title Optimizer Section */}
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
                  YouTube Thumbnail & Title Optimizer
                </h2>
              </div>
              
              <div className="prose prose-lg mx-auto text-gray-600">
                <p className="text-lg leading-relaxed mb-6">
                  <strong>GinyWow YouTube Thumbnail & Title Optimizer</strong> is a smart tool designed for creators who want to grow their YouTube channel faster. It helps YouTubers, digital marketers, and businesses create <strong>eye-catching thumbnails</strong> and <strong>click-worthy titles</strong> that attract more viewers and boost video performance.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Normally, creators struggle with low CTR (Click Through Rate) because their thumbnails don't stand out, or their titles aren't appealing enough. That's why we built this tool – to give every creator a simple way to make their videos more engaging and clickable.
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
                  Why Use GinyWow YouTube Thumbnail & Title Optimizer?
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Higher Click-Through Rate</h3>
                      <p className="text-gray-600">Attractive titles and thumbnails that encourage users to click</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">SEO-Friendly Titles</h3>
                      <p className="text-gray-600">Generate titles that rank better on YouTube search and Google</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Human-Friendly Suggestions</h3>
                      <p className="text-gray-600">Get natural, engaging, and audience-focused titles</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Boost Engagement</h3>
                      <p className="text-gray-600">Thumbnails and titles optimized for maximum visibility</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Perfect for All Creators</h3>
                      <p className="text-gray-600">Whether you're a vlogger, educator, gamer, or business channel</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-blue-50" data-testid="benefits-section">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="prose prose-lg mx-auto text-gray-700">
                  <p className="text-lg leading-relaxed">
                    With <strong>GinyWow YouTube Thumbnail & Title Optimizer</strong>, you don't waste time guessing what works. Instead, you get professional, engaging, and SEO-optimized suggestions that <strong>increase clicks, views, and subscribers</strong>. Perfect for creators who want to grow their channel faster and businesses looking to boost brand awareness on YouTube.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white" data-testid="how-it-works-section">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                  How Does GinyWow YouTube Thumbnail & Title Optimizer Work?
                </h2>
                <p className="text-lg text-gray-600">Using the tool is quick and simple:</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Upload & Enter</h3>
                      <p className="text-gray-600">Upload your <strong>thumbnail</strong> and enter your <strong>video title or idea</strong></p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Get AI Suggestions</h3>
                      <p className="text-gray-600">Get <strong>5 AI-powered optimized title suggestions</strong></p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Enhance Design</h3>
                      <p className="text-gray-600">Instantly improve your <strong>thumbnail design</strong> with better enhancements</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Use Results</h3>
                      <p className="text-gray-600">Use the optimized results on your YouTube video</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-lg text-gray-600">
                  With just a few clicks, your video becomes more appealing, rankable, and ready to attract more views.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50" data-testid="faq-section">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                  Frequently Asked Questions
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Is GinyWow YouTube Thumbnail & Title Optimizer free to use?</h3>
                  <p className="text-gray-600">Yes! You can generate unlimited thumbnail and title suggestions for free.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">⭐ What makes GinyWow different from other tools?</h3>
                  <p className="text-gray-600">Unlike generic generators, <strong>GinyWow</strong> creates <strong>SEO-optimized, human-friendly, and clickable results</strong> that truly engage your audience.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Can I use this tool for any type of channel?</h3>
                  <p className="text-gray-600">Absolutely! Whether you're making content in <strong>tech, finance, gaming, lifestyle, or education</strong>, this tool works for all creators.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🎨 Do I need any design or SEO knowledge to use this tool?</h3>
                  <p className="text-gray-600">No! The tool is made for everyone. Just upload your thumbnail, enter your title, and get optimized results instantly.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📈 How does this help in channel growth?</h3>
                  <p className="text-gray-600">Better thumbnails and titles mean <strong>higher CTR, more watch time, and more subscribers</strong>, which leads to faster YouTube channel growth.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


      </main>

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
