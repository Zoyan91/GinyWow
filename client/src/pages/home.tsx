import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900" data-testid="logo">
                <span className="text-gray-900">Giny</span><span className="text-blue-600">Wow</span>
              </h1>
            </div>
            
            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-pdf">
                  PDF <ChevronDown className="ml-1 w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit PDF</DropdownMenuItem>
                  <DropdownMenuItem>PDF to Word</DropdownMenuItem>
                  <DropdownMenuItem>Merge PDF</DropdownMenuItem>
                  <DropdownMenuItem>Split PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-app-opener">
                App Opener <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-image-converter">
                  Image Converter <ChevronDown className="ml-1 w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Remove Background</DropdownMenuItem>
                  <DropdownMenuItem>Resize Image</DropdownMenuItem>
                  <DropdownMenuItem>Compress Image</DropdownMenuItem>
                  <DropdownMenuItem>Image to Text</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-write">
                  Write <ChevronDown className="ml-1 w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Essay Writer</DropdownMenuItem>
                  <DropdownMenuItem>Paragraph Writer</DropdownMenuItem>
                  <DropdownMenuItem>Grammar Fixer</DropdownMenuItem>
                  <DropdownMenuItem>Content Improver</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
            </div>
            
            {/* Search and Sign In */}
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 pb-12">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="animate-pulse">✨</span>
              AI-Powered Thumbnail Enhancement
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Transform Your YouTube Thumbnails<br/>
              <span className="text-blue-600">Into Click Magnets</span>
            </h1>
            <p className="text-gray-700 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional AI enhancement that improves every detail while preserving your original design. 
              Make your thumbnails more eye-catching and boost your CTR instantly.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Preserves Originality
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Professional Enhancement
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Instant Results
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-background container mx-auto px-6 py-0 max-w-4xl">
        
        {/* YouTube Thumbnail & Title Optimizer Tool */}
        <motion.div 
          className="bg-white rounded-2xl border border-gray-200 p-10 shadow-xl shadow-blue-500/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          data-testid="optimizer-tool"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
              <span>🚀</span>
              AI Enhancement Tool
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              YouTube Thumbnail & Title Optimizer
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Upload your thumbnail and enter your title to get professional AI enhancement 
              that preserves your original design while making it more eye-catching.
            </p>
          </div>

          {/* Thumbnail Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className={`border-2 border-dashed rounded-lg ${thumbnailPreview ? 'p-2' : 'p-8'} text-center transition-colors ${
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
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className={`mb-2 ${
                    uploadError ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {uploadError || "Drop your thumbnail here or click to browse"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">Supports: JPG, PNG, WebP (Max 5MB)</p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Title
            </label>
            <Input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your YouTube title here..."
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="youtube-title-input"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500" data-testid="character-count">{title.length}/100 characters</span>
            </div>
          </div>

          {/* Optimize Button */}
          <div className="text-center">
            <Button 
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
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
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimization Results</h3>
                  </div>

                  {/* Professional Before/After Thumbnail Comparison */}
                  {optimizationResult.thumbnailComparison && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-xl">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
                          <span>✨</span>
                          AI Enhancement Results
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Thumbnail Comparison</h4>
                        <p className="text-gray-600">See the professional enhancement applied to your thumbnail</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Before Image */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            📸 Original
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
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            ✨ AI Enhanced
                          </div>
                          <div className="relative w-full aspect-video rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden border-2 border-green-500 shadow-xl shadow-green-500/20">
                            <img 
                              src={optimizationResult.thumbnailComparison.after} 
                              alt="AI-Enhanced thumbnail with professional quality improvements" 
                              className="absolute inset-0 w-full h-full object-contain object-center filter drop-shadow-lg"
                              data-testid="after-thumbnail"
                            />
                            {/* Enhancement Quality Badge */}
                            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                              ENHANCED
                            </div>
                          </div>
                          <div className="mt-4 space-y-3">
                            <p className="text-sm text-green-600 font-semibold">
                              🎯 Professional Quality Enhancement Applied
                            </p>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = optimizationResult.thumbnailComparison.after;
                                link.download = 'enhanced-thumbnail.jpg';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                              data-testid="download-enhanced-thumbnail"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-6 8h8a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                              </svg>
                              Download Enhanced Thumbnail
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Professional Enhancement Metrics */}
                      {optimizationResult.thumbnailComparison.enhancementMetrics && (
                        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                          <div className="text-center mb-6">
                            <h5 className="text-lg font-bold text-gray-900 mb-2">Enhancement Breakdown</h5>
                            <p className="text-gray-600 text-sm">Detailed improvements applied to your thumbnail</p>
                          </div>
                          <div className="grid grid-cols-3 gap-6">
                            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                              <div className="text-2xl font-black text-blue-600 mb-2">+{optimizationResult.thumbnailComparison.enhancementMetrics.contrast}%</div>
                              <div className="text-sm font-semibold text-blue-800 mb-1">CONTRAST</div>
                              <div className="text-xs text-blue-600">Better definition</div>
                            </div>
                            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                              <div className="text-2xl font-black text-purple-600 mb-2">+{optimizationResult.thumbnailComparison.enhancementMetrics.saturation}%</div>
                              <div className="text-sm font-semibold text-purple-800 mb-1">SATURATION</div>
                              <div className="text-xs text-purple-600">Vibrant colors</div>
                            </div>
                            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                              <div className="text-2xl font-black text-green-600 mb-2">+{optimizationResult.thumbnailComparison.enhancementMetrics.clarity}%</div>
                              <div className="text-sm font-semibold text-green-800 mb-1">CLARITY</div>
                              <div className="text-xs text-green-600">Sharp details</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Here are our suggestions to improve your thumbnail and title</p>
                  </div>
                  
                  {/* CTR Score */}
                  {optimizationResult.ctrScore && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Predicted CTR Score</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-blue-600">{optimizationResult.ctrScore}%</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">{optimizationResult.ctrFeedback || 'Your thumbnail and title combination has good potential for attracting clicks.'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Title Suggestions */}
                  {optimizationResult.titleSuggestions && optimizationResult.titleSuggestions.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Improved Title Suggestions</h4>
                      <div className="space-y-3">
                        {optimizationResult.titleSuggestions.map((suggestion: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800 font-medium mb-2">{suggestion.title}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span>Score: {suggestion.score}/10</span>
                              <span>CTR: +{suggestion.estimatedCtr}%</span>
                              <span>SEO: {suggestion.seoScore}/10</span>
                            </div>
                            <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
                            {suggestion.tags && suggestion.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {suggestion.tags.map((tag: string, tagIndex: number) => (
                                  <span key={tagIndex} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
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
          className="mt-12 bg-gray-50 rounded-lg p-8"
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

      </main>

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-16 mt-16">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-4">
            <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Newsletter
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Subscribe for Our Latest Update
          </h2>
          <div className="max-w-md mx-auto flex gap-2 mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              data-testid="newsletter-email-input"
            />
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
              data-testid="subscribe-now-btn"
            >
              Subscribe Now
            </Button>
          </div>
          <p className="text-gray-500 text-sm">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">GinyWow</h3>
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
