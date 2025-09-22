import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import ThumbnailComparison from "@/components/thumbnail-comparison";
import TitleOptimizer from "@/components/title-optimizer";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import type { Thumbnail, TitleOptimization } from "@shared/schema";

export default function Home() {
  const [currentThumbnail, setCurrentThumbnail] = useState<Thumbnail | null>(null);
  const [currentOptimization, setCurrentOptimization] = useState<TitleOptimization | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900" data-testid="logo">ThumbnailAI</h1>
            </div>
            
            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-pdf">
                PDF
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-app-opener">
                App Opener
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-image-converter">
                Image Converter
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium" data-testid="nav-write">
                Write
              </button>
            </div>
            
            {/* Search and Sign In */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="header-search"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              <Button 
                variant="outline" 
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
                data-testid="sign-in-button"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16 py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Free Tools to Make{" "}
            <span className="text-blue-600">
              Content Creation
            </span>
            {" "}Simple
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Optimize your YouTube thumbnails and titles for better clicks, views, and engagement.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search tools..."
                className="w-full pl-12 pr-16 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                data-testid="hero-search"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                data-testid="hero-search-button"
              >
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ImageUpload onThumbnailUploaded={setCurrentThumbnail} />
        </motion.div>

        {/* Thumbnail Comparison Section */}
        {currentThumbnail && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ThumbnailComparison thumbnail={currentThumbnail} />
          </motion.div>
        )}

        {/* Title Optimization Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TitleOptimizer 
            thumbnailId={currentThumbnail?.id} 
            onOptimizationComplete={setCurrentOptimization}
          />
        </motion.div>

        {/* Analytics Dashboard */}
        {(currentThumbnail || currentOptimization) && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AnalyticsDashboard 
              thumbnail={currentThumbnail} 
              optimization={currentOptimization} 
            />
          </motion.div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-xl font-bold text-gray-900">ThumbnailAI</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Supercharge your YouTube content with AI-powered thumbnail enhancement and title optimization.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
              <a href="#" className="hover:text-gray-900 transition-colors">API</a>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                © 2024 ThumbnailAI. All rights reserved. • Built with ❤️ for content creators
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
