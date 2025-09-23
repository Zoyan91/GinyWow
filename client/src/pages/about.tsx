import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function About() {
  return (
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="about" />

      {/* About Content */}
      <main className="bg-background/50 backdrop-blur-sm container-mobile py-8 max-w-4xl relative z-10">
        <motion.div 
          className="card-mobile p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl shadow-blue-500/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-responsive-xl font-bold text-gray-900 mb-6 sm:mb-8">
            About GinyWow
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 text-responsive-sm leading-relaxed mb-6">
              GinyWow is a free online platform that provides smart and easy-to-use tools for digital creators and businesses. Our goal is to make content creation and online growth simpler. With tools like the <strong>YouTube Thumbnail & Title Optimizer</strong>, creators can generate SEO-friendly, clickable titles and engaging thumbnails to increase video views. We also offer an <strong>App Opener tool</strong> that helps redirect social media visitors directly into apps like YouTube, Instagram, or Facebook instead of opening links in a browser, making conversions faster and more effective.
            </p>
            
            <p className="text-gray-700 text-responsive-sm leading-relaxed">
              At GinyWow, we believe in giving creators simple, powerful, and reliable tools — all in one place.
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="mt-8 sm:mt-10">
            <Link href="/">
              <button className="btn-mobile bg-blue-600 hover:bg-blue-700 text-white" data-testid="back-to-home">
                ← Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}