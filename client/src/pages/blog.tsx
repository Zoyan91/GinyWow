import { Helmet } from 'react-helmet-async';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog - Latest Tips and Tutorials | GinyWow</title>
        <meta name="description" content="GinyWow blog section - coming soon with valuable content about online tools, social media optimization, and digital productivity tips." />
        <meta name="keywords" content="blog, online tools, social media tips, digital productivity, coming soon" />
        <meta property="og:title" content="Blog - GinyWow" />
        <meta property="og:description" content="GinyWow blog section - coming soon with valuable content about online tools, social media optimization, and digital productivity tips." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.replit.app/blog" />
      </Helmet>

      <Header currentPage="blog" />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container-mobile max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6" data-testid="blog-title">
              GinyWow Blog
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed" data-testid="blog-description">
              Latest tips, tutorials, and insights about online tools and digital productivity
            </p>
          </div>
        </section>

        {/* Empty content area ready for blog posts */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container-mobile max-w-4xl">
            <div className="text-center py-16" data-testid="blog-content-area">
              <p className="text-gray-600">
                Blog posts will appear here.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}