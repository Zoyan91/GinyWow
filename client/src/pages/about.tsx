import { Link } from 'wouter';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function About() {
  return (
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="about" />

      {/* About Content */}
      <main className="bg-background/50 backdrop-blur-sm container-mobile py-8 max-w-4xl relative z-10">
        <div 
          className="card-mobile p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl shadow-blue-500/10"
        >
          <h1 className="text-responsive-xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
            🌍 About Us – GinyWow
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 text-responsive-sm leading-relaxed mb-8">
              Welcome to <strong>GinyWow</strong> – your all-in-one platform for smart, free, and easy-to-use online tools.
              Our mission is simple: to provide creators, students, professionals, and businesses with <strong>fast, reliable, and secure tools</strong> that make daily digital tasks easier.
            </p>

            {/* What We Offer Section */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🚀 What We Offer
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                At GinyWow, we bring together a wide range of <strong>powerful online utilities</strong> designed to save your time and boost productivity:
              </p>

              <div className="space-y-3 text-gray-700">
                <div>• <strong>App Opener (Hero Tool)</strong> – Instantly open apps and social media links directly, perfect for creators and marketers.</div>
                <div>• <strong>YouTube Thumbnail Downloader</strong> – Download any video's thumbnail in HD, HQ, or 4K resolution with one click.</div>
                <div>• <strong>Image Tools</strong> – Convert between multiple image formats, resize images without losing quality, and optimize visuals for web or social use.</div>
                
                <div className="ml-4">
                  <div className="font-semibold text-gray-800 mb-2">Utility Tools:</div>
                  <div className="space-y-2 ml-4">
                    <div>📑 <strong>Word Counter</strong> – Count words, characters, and paragraphs for essays, SEO, or content writing.</div>
                    <div>🔳 <strong>QR Code Generator</strong> – Create scannable QR codes for websites, products, or social media.</div>
                    <div>🔐 <strong>Strong Password Generator</strong> – Generate secure and random passwords to protect your accounts.</div>
                    <div>👶 <strong>Age Calculator</strong> – Quickly calculate exact age in years, months, and days.</div>
                    <div>🏡 <strong>Mortgage Calculator</strong> – Plan home loans and monthly payments with accurate calculations.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose GinyWow Section */}
            <div className="bg-green-50 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🌟 Why Choose GinyWow?
              </h2>
              
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg">✅</span>
                  <div><strong>Completely Free</strong> – All our tools are free to use, with no hidden charges.</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg">✅</span>
                  <div><strong>User-Friendly Design</strong> – Clean, simple, and fast interface for everyone.</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg">✅</span>
                  <div><strong>Worldwide Reach</strong> – Trusted by users in the <strong>USA, UK, Canada, Australia, India, and beyond</strong>.</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg">✅</span>
                  <div><strong>Safe & Secure</strong> – Your data stays private. We don't save or share any personal information.</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-lg">✅</span>
                  <div><strong>One Platform – Multiple Solutions</strong> – No need to download apps, everything works online.</div>
                </div>
              </div>
            </div>

            {/* Our Vision Section */}
            <div className="bg-purple-50 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                🎯 Our Vision
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                We believe the internet should be simple, useful, and accessible to everyone. That's why we are constantly adding <strong>new tools and features</strong> to help users in content creation, productivity, education, and business.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Whether you're a <strong>student writing assignments, a YouTuber optimizing content, a business professional handling documents, or someone planning a home loan</strong>, GinyWow is here to make your tasks easier.
              </p>
            </div>

            {/* Final Note Section */}
            <div className="bg-orange-50 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📌 Final Note
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                GinyWow is more than just a collection of tools – it's a <strong>smart digital companion</strong> for your everyday needs.
                Join thousands of users worldwide who trust GinyWow for their productivity and online tasks.
              </p>

              <p className="text-lg font-semibold text-blue-700">
                👉 <strong>Explore GinyWow today – simple tools, smarter solutions.</strong>
              </p>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-8 sm:mt-10">
            <Link href="/">
              <button className="btn-mobile bg-blue-600 hover:bg-blue-700 text-white" data-testid="back-to-home">
                ← Back to Home
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}