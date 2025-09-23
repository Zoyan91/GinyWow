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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Mobile navigation state
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

  // Newsletter subscription handler
  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      setSubscriptionMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail.trim())) {
      setSubscriptionMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionMessage({ 
          type: 'success', 
          text: 'Successfully subscribed! Welcome email sent to your inbox.' 
        });
        setNewsletterEmail(''); // Clear the input
      } else {
        setSubscriptionMessage({ 
          type: 'error', 
          text: data.error || 'Subscription failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Clear subscription message after 5 seconds
  useEffect(() => {
    if (subscriptionMessage) {
      const timer = setTimeout(() => {
        setSubscriptionMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [subscriptionMessage]);

  // Handle mobile menu keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header - Opener.one Style */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <h1 className="text-2xl font-bold text-gray-900 cursor-pointer hover:opacity-80 transition-opacity" data-testid="logo">
              <span className="text-gray-900">Giny</span><span className="text-blue-600">Wow</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Tools</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">About</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Contact</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
          <div className="p-6 space-y-6">
            <nav className="space-y-4">
              <a href="#" className="block text-lg font-medium text-gray-900 hover:text-blue-600">Tools</a>
              <a href="#" className="block text-lg font-medium text-gray-900 hover:text-blue-600">About</a>
              <a href="#" className="block text-lg font-medium text-gray-900 hover:text-blue-600">Contact</a>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section - Opener.one Style */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            YouTube Thumbnail & Title Optimizer
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            We help you get more views and subscribers by optimizing your thumbnails and titles with AI-powered enhancement.
          </p>
        </div>
      </section>

      {/* Main Tool Section - Opener.one Style */}
      <main className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-2xl">
          
          {/* Tool Input Area */}
          <div className="space-y-8 text-center">
            
            {/* Upload Area */}
            <div className="space-y-4">
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
              
              {thumbnailPreview ? (
                <div className="space-y-4">
                  <div className="relative w-full max-w-sm mx-auto aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="absolute inset-0 w-full h-full object-contain object-center"
                      data-testid="thumbnail-preview"
                    />
                  </div>
                  <button 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    data-testid="change-thumbnail-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change thumbnail
                  </button>
                </div>
              ) : (
                <div 
                  className={`w-full max-w-lg mx-auto p-12 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50' 
                      : uploadError 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-blue-400 bg-gray-50'
                  }`}
                  data-testid="thumbnail-upload-area"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium text-lg">Upload Your Thumbnail</p>
                      <p className="text-gray-500">JPG, PNG, WebP (Max 5MB)</p>
                    </div>
                  </div>
                </div>
              )}
              
              {uploadError && (
                <p className="text-red-600 text-sm">{uploadError}</p>
              )}
            </div>

            {/* Title Input */}
            <div className="space-y-4">
              <Input 
                type="text"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center"
                placeholder="Paste your YouTube title here..."
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="youtube-title-input"
              />
              <p className="text-sm text-gray-500" data-testid="character-count">{title.length}/100 characters</p>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <Button 
                className={`px-16 py-4 text-xl font-semibold rounded-lg transition-all ${
                  uploadedFile && title.trim() 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!uploadedFile || !title.trim() || isOptimizing}
                onClick={handleOptimize}
                data-testid="optimize-now-btn"
              >
                {isOptimizing ? 'Optimizing...' : 'Generate'}
              </Button>
            </div>
        </div>

        {/* Results Section */}
        {optimizationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200"
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
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-xl">
                      <div className="text-center mb-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Thumbnail Comparison</h4>
                        <p className="text-gray-600">See the enhancement applied to your thumbnail</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                          <div className="mt-4">
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = optimizationResult.thumbnailComparison.after;
                                link.download = 'enhanced-thumbnail.jpg';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
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
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Title Suggestions</h3>
                        <p className="text-gray-500 text-sm mt-1">Use the copy button to copy any title</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {optimizationResult.titleSuggestions.map((suggestion: any, index: number) => (
                            <div 
                              key={index} 
                              className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                            >
                              <div className="flex-1 mr-3">
                                <p className="text-gray-800 font-medium leading-relaxed">{suggestion.title}</p>
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
                                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md border border-blue-200 hover:border-blue-300 transition-all duration-200 text-sm font-medium"
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
        </div>
      </main>

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg p-8"
          >
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What is YouTube Thumbnail & Title Optimizer?
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Our YouTube Thumbnail & Title Optimizer is a powerful, free tool designed to help content creators maximize their video's click-through rate (CTR) and overall engagement. By analyzing your thumbnail and title combination, our tool provides data-driven suggestions to improve visibility, attract more viewers, and boost your YouTube channel's performance.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
              Why Use Our Optimizer?
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Increase Click-Through-Rate (CTR)
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Optimize your thumbnails and titles to attract more clicks and improve your video's performance in YouTube's algorithm.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    AI-based Title Suggestions
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Get intelligent recommendations for title improvements based on successful YouTube content patterns and trending keywords.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Thumbnail Preview for Better Design
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Visualize how your thumbnail will appear across different devices and screen sizes before publishing your video.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Free & Easy to Use
                  </h4>
                  <p className="text-gray-600 text-sm">
                    No registration required. Simply upload your thumbnail, enter your title, and get instant optimization suggestions at no cost.
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
          className="mt-12 bg-white rounded-lg border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How to Use the Tool?
          </h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Upload your thumbnail
                </h3>
                <p className="text-gray-600 text-sm">
                  Click the upload area or drag and drop your YouTube thumbnail image. We support JPG, PNG, and WebP formats up to 5MB.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Enter your video title
                </h3>
                <p className="text-gray-600 text-sm">
                  Type your current or planned YouTube video title in the text field. Our tool will analyze it for optimization opportunities.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Click Optimize Now and get results
                </h3>
                <p className="text-gray-600 text-sm">
                  Get instant feedback on your thumbnail and title combination with actionable suggestions to improve your video's performance.
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
          className="mt-12 bg-gray-50 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Is the YouTube Thumbnail & Title Optimizer really free?
              </h3>
              <p className="text-gray-600">
                Yes, our optimizer is completely free to use. You can upload thumbnails, analyze titles, and receive optimization suggestions without any cost or registration requirements.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                What file formats do you support for thumbnails?
              </h3>
              <p className="text-gray-600">
                We support JPG, PNG, and WebP image formats. The maximum file size is 5MB, which covers most YouTube thumbnail requirements.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                How does the AI-based title suggestion work?
              </h3>
              <p className="text-gray-600">
                Our AI analyzes successful YouTube video patterns, trending keywords, and engagement metrics to provide data-driven suggestions for improving your titles and increasing click-through rates.
              </p>
            </div>

            {/* FAQ 4 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Do you store my uploaded thumbnails or titles?
              </h3>
              <p className="text-gray-600">
                No, we prioritize your privacy. Uploaded thumbnails and titles are processed in real-time and are not stored on our servers. Your content remains completely private and secure.
              </p>
            </div>
          </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section - Simple & Modern Style */}
      <section className="bg-gray-50 py-20 mt-16 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0" aria-hidden="true">
          {/* Dotted pattern */}
          <div className="absolute top-16 left-16 w-20 h-16 opacity-20" style={{
            background: 'radial-gradient(circle, #666 1px, transparent 1px)',
            backgroundSize: '8px 8px'
          }}></div>
          
          {/* Leaf illustrations */}
          <svg className="absolute top-20 left-8 w-16 h-20 text-blue-400 opacity-60" viewBox="0 0 100 120" fill="currentColor">
            <path d="M20 60c0-20 10-40 30-40s30 20 30 40-10 40-30 40-30-20-30-40z" />
            <path d="M35 45c0-10 5-20 15-20s15 10 15 20-5 20-15 20-15-10-15-20z" fill="#8B5CF6" />
          </svg>
          
          <svg className="absolute bottom-24 left-12 w-12 h-16 text-purple-300 opacity-50" viewBox="0 0 60 80" fill="currentColor">
            <path d="M10 40c0-15 8-30 20-30s20 15 20 30-8 30-20 30-20-15-20-30z" />
          </svg>
          
          <svg className="absolute top-32 right-16 w-14 h-18 text-orange-300 opacity-40" viewBox="0 0 70 90" fill="currentColor">
            <path d="M15 45c0-18 9-35 20-35s20 17 20 35-9 35-20 35-20-17-20-35z" />
          </svg>
          
          <svg className="absolute bottom-16 right-8 w-18 h-22 text-pink-300 opacity-50" viewBox="0 0 90 110" fill="currentColor">
            <path d="M18 55c0-22 11-42 27-42s27 20 27 42-11 42-27 42-27-20-27-42z" />
            <path d="M35 40c0-12 6-22 17-22s17 10 17 22-6 22-17 22-17-10-17-22z" fill="#F472B6" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="mb-8">
            <span className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium">
              Newsletter
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight max-w-2xl mx-auto">
            Subscribe for Our Latest Update
          </h2>
          
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleNewsletterSubscribe}>
              <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address for newsletter subscription
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-6 py-4 text-base bg-transparent border-0 outline-none placeholder-gray-500 min-h-[44px]"
                  data-testid="newsletter-email-input"
                  disabled={isSubscribing}
                />
                <Button 
                  type="submit"
                  disabled={isSubscribing}
                  className={`px-8 py-4 text-base font-medium rounded-xl transition-all duration-200 min-h-[44px] ${
                    isSubscribing 
                      ? 'bg-orange-400 cursor-not-allowed text-white' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                  data-testid="subscribe-now-btn"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                </Button>
              </div>
              
              {/* Subscription message */}
              <div aria-live="polite" aria-atomic="true">
                {subscriptionMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                      subscriptionMessage.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                    data-testid="subscription-message"
                    role="alert"
                  >
                    {subscriptionMessage.text}
                  </motion.div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-100 py-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/">
                <h3 className="text-xl font-bold mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-gray-900">Giny</span><span className="text-blue-600">Wow</span>
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-4">
                Free tools to make content creation simple and efficient for creators worldwide.
              </p>
              <p className="text-gray-500 text-sm italic">
                We'll keep coming soon!
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">PDF Tools</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">PDF Converter</a></li>
                <li><a href="#" className="hover:text-gray-900">PDF Merger</a></li>
                <li><a href="#" className="hover:text-gray-900">PDF Splitter</a></li>
                <li><a href="#" className="hover:text-gray-900">PDF Compressor</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Write</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Essay Writer</a></li>
                <li><a href="#" className="hover:text-gray-900">Paragraph Writer</a></li>
                <li><a href="#" className="hover:text-gray-900">Article Writer</a></li>
                <li><a href="#" className="hover:text-gray-900">Grammar Fixer</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Image Converter</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">JPG to PNG</a></li>
                <li><a href="#" className="hover:text-gray-900">PNG to JPG</a></li>
                <li><a href="#" className="hover:text-gray-900">WebP to JPG</a></li>
                <li><a href="#" className="hover:text-gray-900">GIF to PNG</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
            </div>
            <p className="text-sm text-gray-600">© 2024 GinyWow.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
