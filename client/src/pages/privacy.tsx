import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { SiFacebook, SiX, SiLinkedin, SiYoutube, SiPinterest } from 'react-icons/si';

export default function Privacy() {
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
                <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Blog
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Privacy Policy Content */}
      <main className="bg-background/50 backdrop-blur-sm container mx-auto px-4 sm:px-6 py-8 max-w-4xl relative z-10">
        <motion.div 
          className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl shadow-blue-500/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6">
            <p className="text-gray-700 text-base leading-relaxed">
              This Privacy Policy describes how <strong>GinyWow</strong> collects, uses, and protects your personal information when you use our Service. It also informs you of your privacy rights and how data protection laws apply to you.
            </p>
            
            <p className="text-gray-700 text-base leading-relaxed">
              By accessing or using GinyWow, you agree to the collection and use of information in accordance with this policy.
            </p>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Interpretation & Definitions</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interpretation</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Words with capitalized first letters have special meanings defined below. These definitions apply whether the terms appear in singular or plural.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Definitions</h3>
                <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
                  <li><strong>Account</strong>: A unique account created for you to access parts of our Service.</li>
                  <li><strong>Company</strong>, <strong>We</strong>, <strong>Us</strong>, <strong>Our</strong>: Refers to <strong>GinyWow</strong>.</li>
                  <li><strong>Cookies</strong>: Small files placed on your device by a website, storing browsing history and preferences.</li>
                  <li><strong>Country</strong>: Uttar Pradesh, India.</li>
                  <li><strong>Device</strong>: Any device capable of accessing our Service (computer, smartphone, tablet, etc.).</li>
                  <li><strong>Personal Data</strong>: Any information that identifies or can identify an individual.</li>
                  <li><strong>Service</strong>: The GinyWow Website and associated tools.</li>
                  <li><strong>Service Provider</strong>: Third parties who assist GinyWow in providing or maintaining the Service.</li>
                  <li><strong>Usage Data</strong>: Data automatically collected when you use the Service (e.g. pages visited, time spent).</li>
                  <li><strong>Website</strong>: GinyWow, accessible at <a href="https://ginywow.com" className="text-blue-600 hover:text-blue-700 transition-colors">https://ginywow.com</a></li>
                  <li><strong>You</strong>: The individual or entity using or accessing our Service.</li>
                </ul>
              </div>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Collecting & Using Your Personal Data</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Types of Data Collected</h3>
                <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
                  <li><strong>Personal Data</strong>: We may ask you for certain identifiable information, such as your email address, when you register or contact us.</li>
                  <li><strong>Usage Data</strong>: Collected automatically when you access the Service. This can include IP address, browser type, pages visited, time & date of visit, and other diagnostic information.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Use of Cookies & Tracking Technologies</h3>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  We use cookies and similar tools (tags, scripts) to track user activity, store settings, preferences, and to improve our Service. These include:
                </p>
                <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                  <li><strong>Necessary / Essential Cookies</strong>: Required for core functionality.</li>
                  <li><strong>Persistent Cookies</strong>: Remember preferences or settings across sessions.</li>
                  <li><strong>Session Cookies</strong>: Temporary, deleted when browser is closed.</li>
                </ul>
              </div>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">How We Use Your Data</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-3">We may use your data to:</p>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>Provide, maintain, and improve the Service.</li>
                <li>Manage your Account and registration.</li>
                <li>Send you updates, newsletters, or other information about features or tools.</li>
                <li>Analyse usage trends to improve content, design, and performance.</li>
                <li>Fulfill legal obligations or respond to lawful requests from authorities.</li>
              </ul>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We keep your personal data only as long as needed for the purposes stated above. Usage Data may be stored for shorter or longer periods depending on business needs, legal requirements, or security needs.
              </p>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Transfer & Disclosure of Your Data</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-3">
                We may transfer your data to locations outside your country if needed. If we do so, we ensure adequate protections are in place.
              </p>
              <p className="text-gray-700 text-base leading-relaxed mb-3">We may share your information with:</p>
              <ul className="space-y-2 text-gray-700 text-base leading-relaxed">
                <li>Service Providers assisting us in operating the Service.</li>
                <li>Business partners for promotions or new features.</li>
                <li>Legal entities when required by law or to protect rights or safety.</li>
              </ul>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Security of Your Data</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We take reasonable measures to protect your data. But no system is completely secure — we cannot guarantee absolute protection.
              </p>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Our Service is not intended for children under 13. We do not knowingly collect data from anyone under 13. If you believe we have, please contact us so we can remove that information.
              </p>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Links to Other Sites</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Our Service may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies before providing any personal information.
              </p>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We may update this Privacy Policy occasionally. Whenever we do, we will update the "Last updated" date. We recommend you check this page periodically for changes.
              </p>
            </section>

            <hr className="border-gray-200 my-8" />

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                If you have any questions about this Privacy Policy, you can contact us at:<br />
                <strong>Email:</strong> <a href="mailto:info@ginywow.com" className="text-blue-600 hover:text-blue-700 transition-colors" data-testid="email-link">info@ginywow.com</a>
              </p>
            </section>
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
            <div className="flex items-center mb-4 md:mb-0">
              <p className="text-sm text-gray-600">© 2025 GinyWow.com | All rights reserved</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-lg font-bold text-gray-900">Giny</span>
                  <span className="text-lg font-bold text-blue-600">Wow</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}