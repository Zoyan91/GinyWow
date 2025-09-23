import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function About() {
  return (
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="about" />

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