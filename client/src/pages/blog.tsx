import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Calendar, Clock, Tag } from 'lucide-react';

export default function Blog() {
  // Placeholder for future blog articles
  const blogArticles: Array<{
    id: number;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    slug: string;
  }> = [
    // When you add articles, they'll appear here in this format:
    // {
    //   id: 1,
    //   title: "How to Create Eye-Catching YouTube Thumbnails",
    //   excerpt: "Learn the best practices for creating thumbnails that boost your click-through rates...",
    //   date: "2025-01-15",
    //   readTime: "5 min read",
    //   category: "YouTube Tips",
    //   slug: "eye-catching-youtube-thumbnails"
    // }
  ];

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
              
              <Link href="/contact">
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Contact Us
                </button>
              </Link>
              
              <Link href="/blog">
                <button className="flex items-center text-blue-600 font-medium">
                  Blog
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <main className="bg-background/50 backdrop-blur-sm container mx-auto px-4 sm:px-6 py-8 max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Latest tips, tutorials and insights about YouTube optimization, content creation, and digital marketing tools.
          </p>
        </motion.div>

        {/* Blog Articles */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {blogArticles.length === 0 ? (
            /* Empty State - No Articles Yet */
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-xl shadow-blue-500/10 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Tag className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  We're working on amazing blog articles about YouTube optimization, thumbnail creation, content strategy, and digital marketing tips. Stay tuned for valuable insights and tutorials!
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <p>📝 YouTube Thumbnail Best Practices</p>
                  <p>🎯 Title Optimization Strategies</p>
                  <p>📊 Content Analytics & Performance</p>
                  <p>🚀 Channel Growth Tips & Tricks</p>
                </div>
              </div>
            </div>
          ) : (
            /* Article List - Will show when articles are added */
            <div className="space-y-8">
              {blogArticles.map((article) => (
                <motion.article
                  key={article.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl shadow-blue-500/10 hover:shadow-2xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        <a href={`/blog/${article.slug}`} data-testid={`article-title-${article.id}`}>
                          {article.title}
                        </a>
                      </h2>
                      <p className="text-gray-600 text-base leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>{article.category}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a 
                      href={`/blog/${article.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      data-testid={`article-read-more-${article.id}`}
                    >
                      Read More →
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors" data-testid="back-to-home">
              ← Back to Home
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-100 py-12 relative z-10 mt-16">
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