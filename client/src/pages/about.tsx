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
            About Us
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 text-responsive-sm leading-relaxed mb-6">
              <strong>GinyWow</strong> is a free online platform that provides smart and easy-to-use tools for digital creators, influencers, and businesses. Our goal is to make online growth and engagement simpler with powerful tools that actually solve real problems.
            </p>
            
            <p className="text-gray-700 text-responsive-sm leading-relaxed mb-6">
              Our main tool, the <strong>GinyWow App Opener</strong>, helps redirect social media visitors directly into apps like <strong>YouTube, Instagram, Facebook, and Twitter</strong> instead of opening links in a browser. This creates a smoother experience for your audience and leads to <strong>faster conversions, more followers, and higher engagement</strong>.
            </p>
            
            <p className="text-gray-700 text-responsive-sm leading-relaxed">
              At <strong>GinyWow</strong>, we believe in giving creators simple, reliable, and effective tools — all in one place.
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