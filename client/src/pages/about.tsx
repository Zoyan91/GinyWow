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
          <h1 className="text-responsive-xl font-bold text-gray-900 mb-6 sm:mb-8">
            About Us
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 text-responsive-sm leading-relaxed mb-6">
              <strong>GinyWow</strong> is a free online platform that provides smart and easy-to-use tools for digital creators, students, professionals, and businesses.
            </p>
            
            <p className="text-gray-700 text-responsive-sm leading-relaxed mb-6">
              Our main tool, the <strong>App Opener</strong>, helps redirect social media visitors directly into apps like YouTube, Instagram, Facebook, and Twitter instead of opening links in a browser. We also offer other useful tools like Image Converter, QR Code Generator, Password Generator, and more.
            </p>
            
            <p className="text-gray-700 text-responsive-sm leading-relaxed mb-6">
              All our tools are completely free to use, with no hidden charges. We believe in providing simple, reliable, and effective tools that make your daily digital tasks easier.
            </p>
            
            <p className="text-gray-700 text-responsive-sm leading-relaxed">
              At <strong>GinyWow</strong>, we aim to give users everything they need in one place.
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
        </div>
      </main>

      <Footer />
    </div>
  );
}