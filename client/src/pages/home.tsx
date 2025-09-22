import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, ChevronDown } from "lucide-react";
import type { Thumbnail, TitleOptimization } from "@shared/schema";

export default function Home() {
  const [title, setTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50">
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
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Free Tools to Make{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Content Creation</span> Simple
            </h1>
            <p className="text-gray-600 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              🚀 Optimize your YouTube thumbnails and titles for better clicks, views, and engagement.
            </p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-lg mx-auto flex gap-3 bg-white p-2 rounded-2xl shadow-lg border border-gray-100"
            >
              <input
                type="text"
                placeholder="Search tools..."
                className="flex-1 px-6 py-4 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
                data-testid="hero-search-input"
              />
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                data-testid="hero-search-btn"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-2xl">
        
        {/* YouTube Thumbnail & Title Optimizer Tool */}
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          data-testid="optimizer-tool"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 pointer-events-none"></div>
          
          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              YouTube Thumbnail & Title Optimizer
            </h1>
            <p className="text-gray-600 text-lg">
              ✨ Upload your thumbnail and enter your title to get optimization suggestions.
            </p>
          </div>

          {/* Thumbnail Upload Section */}
          <div className="mb-8 relative z-10">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              📸 Thumbnail
            </label>
            <input 
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
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : uploadError 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              data-testid="thumbnail-upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className={`mb-2 ${
                  uploadError ? 'text-red-600' : uploadedFile ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {uploadError || (uploadedFile ? uploadedFile.name : "Drop your thumbnail here or click to browse")}
                </p>
                <p className="text-sm text-gray-500 mb-4">Supports: JPG, PNG, WebP (Max 5MB)</p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 shadow-lg transform hover:scale-105 transition-all duration-300"
                  data-testid="upload-thumbnail-btn"
                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  📸 Upload Thumbnail
                </Button>
              </div>
            </div>
          </div>

          {/* YouTube Title Section */}
          <div className="mb-8 relative z-10">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              📝 YouTube Title
            </label>
            <Input 
              type="text"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50/50 transition-all duration-300"
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
              className={`px-12 py-4 rounded-2xl font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 ${
                uploadedFile && title.trim() 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!uploadedFile || !title.trim()}
              data-testid="optimize-now-btn"
            >
              🚀 Optimize Now
            </Button>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100/50 shadow-xl"
        >
          <div className="mb-10">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                What is YouTube Thumbnail & Title Optimizer?
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg max-w-4xl mx-auto">
                🎯 Our YouTube Thumbnail & Title Optimizer is a powerful, free tool designed to help content creators maximize their video's click-through rate (CTR) and overall engagement. By analyzing your thumbnail and title combination, our tool provides data-driven suggestions to improve visibility, attract more viewers, and boost your YouTube channel's performance.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-10">
              ⭐ Why Use Our Optimizer?
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    📈 Increase Click-Through-Rate (CTR)
                  </h4>
                  <p className="text-gray-600">
                    Optimize your thumbnails and titles to attract more clicks and improve your video's performance in YouTube's algorithm.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    🧠 AI-based Title Suggestions
                  </h4>
                  <p className="text-gray-600">
                    Get intelligent recommendations for title improvements based on successful YouTube content patterns and trending keywords.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    🖼️ Thumbnail Preview for Better Design
                  </h4>
                  <p className="text-gray-600">
                    Visualize how your thumbnail will appear across different devices and screen sizes before publishing your video.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    💰 Free & Easy to Use
                  </h4>
                  <p className="text-gray-600">
                    No registration required. Simply upload your thumbnail, enter your title, and get instant optimization suggestions at no cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How to Use Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-12 border border-gray-100 shadow-xl"
        >
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-12">
            🚀 How to Use the Tool?
          </h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Upload your thumbnail
                </h3>
                <p className="text-gray-600">
                  Click the upload area or drag and drop your YouTube thumbnail image. We support JPG, PNG, and WebP formats up to 5MB.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Enter your video title
                </h3>
                <p className="text-gray-600">
                  Type your current or planned YouTube video title in the text field. Our tool will analyze it for optimization opportunities.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Click Optimize Now and get results
                </h3>
                <p className="text-gray-600">
                  Get instant feedback on your thumbnail and title combination with actionable suggestions to improve your video's performance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg p-8 border border-gray-200">
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
        </div>

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
