import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog - Latest Tips and Tutorials | GinyWow</title>
        <meta name="description" content="Read the latest blog posts about online tools, social media tips, video downloading, and digital productivity on GinyWow blog." />
        <meta name="keywords" content="blog, online tools, social media tips, video download tutorials, digital productivity" />
        <meta property="og:title" content="Blog - Latest Tips and Tutorials | GinyWow" />
        <meta property="og:description" content="Read the latest blog posts about online tools, social media tips, video downloading, and digital productivity on GinyWow blog." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.replit.app/blog" />
      </Helmet>

      <Header currentPage="blog" />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container-mobile max-w-4xl text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              GinyWow Blog
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
              Latest tips, tutorials, and insights about online tools and digital productivity
            </p>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container-mobile max-w-4xl text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Blog Coming Soon!
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're working hard to bring you valuable content about online tools, social media optimization, video downloading tips, and digital productivity hacks.
              </p>
              <p className="text-gray-600 mb-8">
                Stay tuned for helpful tutorials and guides that will help you make the most of our tools and boost your online presence.
              </p>
              <Link href="/">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                  Explore Our Tools
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Topics We'll Cover */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container-mobile max-w-5xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
                Topics We'll Cover
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
                  title: "URL Optimization Tips",
                  description: "Learn how to create perfect social media links that boost engagement"
                },
                {
                  icon: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                  title: "Thumbnail Design",
                  description: "Best practices for creating eye-catching thumbnails that drive clicks"
                },
                {
                  icon: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
                  title: "Video Download Guides",
                  description: "Step-by-step tutorials for downloading videos from any platform"
                },
                {
                  icon: <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
                  title: "Format Conversion",
                  description: "Master image format conversion for optimal web performance"
                },
                {
                  icon: <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                  title: "Productivity Hacks",
                  description: "Time-saving tips and workflows for content creators"
                },
                {
                  icon: <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                  title: "Social Media Trends",
                  description: "Stay updated with the latest social media platform features"
                }
              ].map((topic, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {topic.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}