import { useState } from "react";
import { motion } from "framer-motion";
import ImageUpload from "@/components/image-upload";
import ThumbnailComparison from "@/components/thumbnail-comparison";
import TitleOptimizer from "@/components/title-optimizer";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import type { Thumbnail, TitleOptimization } from "@shared/schema";

export default function Home() {
  const [currentThumbnail, setCurrentThumbnail] = useState<Thumbnail | null>(null);
  const [currentOptimization, setCurrentOptimization] = useState<TitleOptimization | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fab fa-youtube text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ThumbnailAI</h1>
                <p className="text-sm text-muted-foreground">Optimize & Enhance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
                <i className="fas fa-question-circle mr-2"></i>Help
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                <i className="fas fa-star mr-2"></i>Pro
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Transform Your YouTube{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Thumbnails & Titles
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Upload your thumbnail and let our AI enhance it for maximum click-through rates. 
            Get optimized titles that rank higher and attract more viewers.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <i className="fas fa-check text-accent mr-2"></i>AI-Powered Enhancement
            </div>
            <div className="flex items-center">
              <i className="fas fa-check text-accent mr-2"></i>SEO Optimized Titles
            </div>
            <div className="flex items-center">
              <i className="fas fa-check text-accent mr-2"></i>Instant Results
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
      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fab fa-youtube text-white"></i>
              </div>
              <span className="text-xl font-bold">ThumbnailAI</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Supercharge your YouTube content with AI-powered thumbnail enhancement and title optimization.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">API</a>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                © 2024 ThumbnailAI. All rights reserved. • Built with ❤️ for content creators
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
