import { Link } from 'wouter';
import { SiFacebook, SiX, SiLinkedin, SiYoutube, SiPinterest } from 'react-icons/si';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Blog() {
  return (
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="blog" />

      {/* Empty Content Area */}
      <main className="bg-background/50 backdrop-blur-sm container mx-auto px-4 sm:px-6 py-8 max-w-6xl relative z-10">
        
      </main>

      <Footer />
    </div>
  );
}