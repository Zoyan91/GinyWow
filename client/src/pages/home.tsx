import { useState, useEffect, useRef } from "react";
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
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            YouTube Thumbnail & Title Optimizer
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Optimize your thumbnails and titles for maximum click-through rate
          </p>
        </div>
      </section>

      {/* Main Tool Section - Opener.one Style */}
      <main className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-6 max-w-xl">
          
          {/* Tool Input Area */}
          <div className="space-y-6">
            
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
            <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200"
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
            </div>
          )}
        </div>
      </main>

      {/* About Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              What is a YouTube Thumbnail & Title Optimizer?
            </h2>
            <div className="text-gray-600 max-w-4xl mx-auto space-y-4">
              <p>
                YouTube Thumbnail & Title Optimizer is a smart online tool which helps YouTubers, social media influencers, affiliate marketers and businesses to create <strong>SEO-friendly titles</strong> and <strong>engaging thumbnails</strong> that convert viewers into subscribers.
              </p>
              <p>
                YouTube Thumbnail & Title Optimizer helps creators to generate custom <strong>5 best titles</strong> for their videos and optimize thumbnails to make them more attractive. You all know that if we don't use a proper title and thumbnail on YouTube videos, then users mostly skip the video because it doesn't look clickable or appealing. So for this we have created a <strong>YouTube Thumbnail & Title Optimizer Tool</strong>. With this tool, any creator can generate <strong>natural, human-friendly titles</strong> and get <strong>optimized thumbnails</strong> that directly increase video clicks and audience growth.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">CTR Analysis</h4>
              <p className="text-gray-500 text-sm">Predict click-through rates</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">AI Suggestions</h4>
              <p className="text-gray-500 text-sm">Improve titles automatically</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Enhancement</h4>
              <p className="text-gray-500 text-sm">Optimize image quality</p>
            </div>
          </div>

        </div>

        {/* How to Use Section */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            Simple steps
          </h3>
          
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
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
            FAQ
          </h3>
          
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
        </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-8">
            Get the latest tips on YouTube optimization and new tool updates directly in your inbox.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                data-testid="newsletter-email-input"
              />
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                data-testid="newsletter-subscribe-btn"
              >
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-white">Giny</span><span className="text-blue-400">Wow</span>
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Free tools to make content creation simple and efficient for creators worldwide.
              </p>
              <p className="text-gray-500 text-sm italic">
                We'll keep coming soon!
              </p>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    YouTube Optimizer
                  </a>
                </li>
                <li>
                  <span className="text-gray-500">PDF Tools (Coming Soon)</span>
                </li>
                <li>
                  <span className="text-gray-500">Image Tools (Coming Soon)</span>
                </li>
                <li>
                  <span className="text-gray-500">Video Tools (Coming Soon)</span>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Help Center</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">API Documentation</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Tutorials</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Contact</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="my-8 border-gray-800" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 GinyWow. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
