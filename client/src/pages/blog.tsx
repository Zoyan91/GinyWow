import { Helmet } from 'react-helmet-async';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog | GinyWow</title>
        <meta name="description" content="GinyWow blog - coming soon." />
      </Helmet>

      <Header currentPage="blog" />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center" data-testid="blog-title">
            Blog
          </h1>
          <div className="text-center" data-testid="blog-content-area">
            <p className="text-gray-600">
              Coming soon.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}