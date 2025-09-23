import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { Link } from "wouter";
import type { Thumbnail, TitleOptimization } from "@shared/schema";

export default function Home() {
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
              
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-app-opener">
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
                  className="pl-10 pr-4 py-2 w-64 border-gray-300 rounded-lg"
                  data-testid="search-input"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                </div>

                <div className="border-b border-gray-100 pb-3">
                  <button className="block text-gray-600 hover:text-gray-900 py-3 text-base font-medium" data-testid="mobile-nav-app-opener">
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
          <div className="mb-6 sm:mb-8">
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

        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 sm:mt-12 bg-gray-50 rounded-lg p-4 sm:p-8"
        >
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold sm:font-bold text-gray-900 mb-4 px-2 leading-tight">
                What is YouTube Thumbnail & Title Optimizer?
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-sm sm:text-base px-4 sm:px-2">
                <span className="block sm:inline">Our YouTube Thumbnail & Title Optimizer is a powerful, free tool designed to help content creators maximize their video's click-through rate (CTR) and overall engagement.</span>
                <span className="block sm:inline mt-3 sm:mt-0"> By analyzing your thumbnail and title combination, our tool provides data-driven suggestions to improve visibility, attract more viewers, and boost your YouTube channel's performance.</span>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-center text-gray-900 mb-6 sm:mb-8 px-2">
              Why Use Our Optimizer?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    📈 Increase CTR
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Get more clicks and better YouTube ranking
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    🤖 AI Title Ideas
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Smart title suggestions based on trending patterns
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    🖼️ Preview Design
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    See how thumbnails look on different devices
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    🎆 Free & Easy
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    No signup needed - instant optimization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How to Use Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-12 bg-white rounded-lg border border-gray-200 p-4 sm:p-8"
        >
          <h2 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8 px-2">
            How to Use the Tool?
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  📤 Upload Thumbnail
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Drag & drop your image (JPG, PNG, WebP)
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  ✏️ Add Your Title
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Type your video title for analysis
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  🚀 Get Results
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Click Optimize & get instant suggestions
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 sm:mt-12 bg-gray-50 rounded-lg p-4 sm:p-8"
        >
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 px-2">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            {/* FAQ 1 */}
            <div className="border-b border-gray-100 pb-4 sm:pb-6">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                ❓ Is it really free?
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Yes! Upload, analyze and get suggestions at no cost.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-gray-100 pb-4 sm:pb-6">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                🖼️ What formats supported?
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                JPG, PNG, WebP files up to 5MB
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="border-b border-gray-100 pb-4 sm:pb-6">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                🤖 How does AI work?
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                AI analyzes trending patterns and keywords for better titles
              </p>
            </div>

            {/* FAQ 4 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                🔒 Is my data private?
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Yes! Nothing is stored - your content stays private
              </p>
            </div>
          </div>
        </motion.div>

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
                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.965 1.404-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 23.998 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <p className="text-sm text-gray-600">© 2025 GinyWow.com | All rights reserved</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-lg font-bold text-gray-900">Giny</span>
                  <span className="text-lg font-bold text-blue-600">Wow</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
