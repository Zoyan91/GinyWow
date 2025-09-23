import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function About() {
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
            
            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  YouTube Optimizer
                </button>
              </Link>
              
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                App Opener
              </button>
              
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Contact Us
              </button>
              
              <Link href="/blog">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Blog
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* About Content */}
      <main className="bg-background/50 backdrop-blur-sm container mx-auto px-4 sm:px-6 py-8 max-w-4xl relative z-10">
        <motion.div 
          className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl shadow-blue-500/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            About GinyWow
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
              GinyWow is a free online platform that provides smart and easy-to-use tools for digital creators and businesses. Our goal is to make content creation and online growth simpler. With tools like the <strong>YouTube Thumbnail & Title Optimizer</strong>, creators can generate SEO-friendly, clickable titles and engaging thumbnails to increase video views. We also offer an <strong>App Opener tool</strong> that helps redirect social media visitors directly into apps like YouTube, Instagram, or Facebook instead of opening links in a browser, making conversions faster and more effective.
            </p>
            
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              At GinyWow, we believe in giving creators simple, powerful, and reliable tools — all in one place.
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="mt-8 sm:mt-10">
            <Link href="/">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors" data-testid="back-to-home">
                ← Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-100 py-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Link href="/">
                <h3 className="text-xl font-bold mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-gray-900">Giny</span><span className="text-blue-600">Wow</span>
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-4">
                GinyWow is a free online tool platform built to help creators grow faster. Our <strong>YouTube Thumbnail & Title Optimizer</strong> generates SEO-friendly, clickable titles and engaging thumbnails to boost video views. We also provide an <strong>App Opener tool</strong> that allows creators to send their audience directly into apps like YouTube, Instagram, or Facebook instead of opening links in a browser — making conversions easier and more effective.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">YouTube Optimizer</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-gray-900">Thumbnail & Title Optimizer</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">App Opener</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">YouTube App Opener</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About Us</Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link>
              <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">Blog</Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link>
            </div>
            <p className="text-sm text-gray-600">© 2025 GinyWow.com | All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}