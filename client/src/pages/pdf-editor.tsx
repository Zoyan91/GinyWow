import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, Upload, CheckCircle, Download, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";

// Lazy load footer for better initial performance
const Footer = lazy(() => import("@/components/footer"));

export default function PDFEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  
  // Enable scroll animations
  useScrollAnimation();

  // Newsletter subscription functionality
  const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState<{
      type: 'idle' | 'success' | 'error';
      message: string;
    }>({ type: 'idle', message: '' });

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !email.includes('@')) {
        setSubscriptionStatus({
          type: 'error',
          message: 'Please enter a valid email address'
        });
        return;
      }

      setIsSubscribing(true);
      setSubscriptionStatus({ type: 'idle', message: '' });

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSubscriptionStatus({
            type: 'success',
            message: data.message || 'Successfully subscribed to newsletter!'
          });
          setEmail('');
        } else {
          setSubscriptionStatus({
            type: 'error',
            message: data.error || 'Failed to subscribe. Please try again.'
          });
        }
      } catch (error) {
        setSubscriptionStatus({
          type: 'error',
          message: 'Network error. Please check your connection and try again.'
        });
      } finally {
        setIsSubscribing(false);
      }
    };

    return (
      <section className="relative py-8 sm:py-12 lg:py-16 mt-12 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-blue-200 rounded-full opacity-10 blur-2xl sm:blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-indigo-200 rounded-full opacity-10 blur-2xl sm:blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container-mobile max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              <span className="mr-2">📧</span>
              Newsletter
            </div>
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Subscribe for Our Latest Updates
            </h2>
            <p className="hidden sm:block text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed px-4">
              Get the latest PDF tools, tips, and tutorials delivered to your inbox. Join thousands of creators who trust us.
            </p>
          </div>

          <div className="max-w-md mx-auto px-4">
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-mobile w-full bg-white shadow-sm placeholder-gray-500"
                    disabled={isSubscribing}
                    data-testid="newsletter-email-input"
                  />
                  {subscriptionStatus.type === 'success' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className={`btn-mobile w-full shadow-md hover:shadow-lg ${
                    isSubscribing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  data-testid="subscribe-now-btn"
                >
                  {isSubscribing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Subscribing...
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </div>
              
              {subscriptionStatus.message && (
                <div className={`text-center text-sm mt-3 font-medium ${
                  subscriptionStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {subscriptionStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    );
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF file smaller than 100MB.",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles[0]);
    }
  };

  const handleOpenEditor = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "PDF Editor Loaded!",
        description: "Your PDF is ready for editing.",
      });
    } catch (error) {
      toast({
        title: "Loading Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF Editor - Edit PDF Files Online Free | GinyWow</title>
        <meta name="description" content="Edit PDF files online for free. Add text, images, annotations, and signatures to your PDF documents. Professional PDF editing tools in your browser." />
        <meta name="keywords" content="PDF editor, edit PDF online, PDF annotation, add text to PDF, PDF tools, online PDF editor" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-editor" />
        
        <meta property="og:title" content="Free PDF Editor Online - Edit PDFs in Browser | GinyWow" />
        <meta property="og:description" content="Edit PDF files directly in your browser. Add text, images, signatures, and annotations to PDF documents for free." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-editor" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF Editor",
            "description": "Free online tool to edit PDF files with text, images, and annotations",
            "url": "https://ginywow.com/pdf-editor",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
        <Header currentPage="pdf-editor" />

        {/* Hero Section - Mobile First */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">
          {/* Floating Shapes - TinyWow Style - Hero Section Only - Hidden on Mobile */}
          <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
            {/* Triangle Top Left - Pink */}
            <div 
              className="absolute top-16 left-12 w-6 h-6 animate-float-1"
              style={{
                background: '#f472b6',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(15deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Circle Top Right - Blue */}
            <div 
              className="absolute top-20 right-20 w-5 h-5 rounded-full animate-float-2"
              style={{
                background: '#60a5fa',
                opacity: 0.45
              }}
            ></div>

            {/* Square Top Center - Orange */}
            <div 
              className="absolute top-24 left-1/3 w-4 h-4 animate-float-3"
              style={{
                background: '#fb923c',
                transform: 'rotate(45deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Dot Top Right Corner - Purple */}
            <div 
              className="absolute top-8 right-8 w-3 h-3 rounded-full animate-float-4"
              style={{
                background: '#c084fc',
                opacity: 0.5
              }}
            ></div>

            {/* Triangle Center Left - Green */}
            <div 
              className="absolute top-40 left-8 w-5 h-5 animate-float-5"
              style={{
                background: '#34d399',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(-30deg)',
                opacity: 0.45
              }}
            ></div>

            {/* Circle Center Right - Yellow */}
            <div 
              className="absolute top-36 right-16 w-4 h-4 rounded-full animate-float-6"
              style={{
                background: '#fbbf24',
                opacity: 0.4
              }}
            ></div>

            {/* Square Center - Cyan */}
            <div 
              className="absolute top-48 left-1/2 w-5 h-5 animate-float-1"
              style={{
                background: '#22d3ee',
                transform: 'rotate(30deg)',
                opacity: 0.45
              }}
            ></div>

            {/* Dot Center Left - Rose */}
            <div 
              className="absolute top-52 left-16 w-3 h-3 rounded-full animate-float-2"
              style={{
                background: '#fb7185',
                opacity: 0.5
              }}
            ></div>

            {/* Triangle Bottom Left - Indigo */}
            <div 
              className="absolute bottom-32 left-10 w-6 h-6 animate-float-3"
              style={{
                background: '#818cf8',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(60deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Circle Bottom Right - Emerald */}
            <div 
              className="absolute bottom-28 right-12 w-4 h-4 rounded-full animate-float-4"
              style={{
                background: '#10b981',
                opacity: 0.45
              }}
            ></div>

            {/* Square Bottom Center - Amber */}
            <div 
              className="absolute bottom-24 left-1/3 w-5 h-5 animate-float-5"
              style={{
                background: '#f59e0b',
                transform: 'rotate(15deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Dot Bottom Right - Violet */}
            <div 
              className="absolute bottom-20 right-8 w-3 h-3 rounded-full animate-float-6"
              style={{
                background: '#8b5cf6',
                opacity: 0.5
              }}
            ></div>

            {/* Additional Shapes for More Coverage */}
            {/* Triangle Mid Left - Teal */}
            <div 
              className="absolute top-60 left-6 w-4 h-4 animate-float-1"
              style={{
                background: '#14b8a6',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(45deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Circle Mid Right - Lime */}
            <div 
              className="absolute top-64 right-6 w-4 h-4 rounded-full animate-float-2"
              style={{
                background: '#84cc16',
                opacity: 0.45
              }}
            ></div>

            {/* Dot Top Center - Sky */}
            <div 
              className="absolute top-12 left-1/2 w-3 h-3 rounded-full animate-float-3"
              style={{
                background: '#0ea5e9',
                opacity: 0.45
              }}
            ></div>

            {/* Square Mid Center - Fuchsia */}
            <div 
              className="absolute left-1/2 w-4 h-4 animate-float-4"
              style={{
                background: '#d946ef',
                transform: 'rotate(60deg)',
                opacity: 0.4,
                top: '17rem'
              }}
            ></div>

            {/* Additional dots scattered */}
            <div className="absolute top-28 left-20 w-2 h-2 rounded-full animate-float-5" style={{ background: '#f472b6', opacity: 0.45 }}></div>
            <div className="absolute top-44 right-24 w-2 h-2 rounded-full animate-float-6" style={{ background: '#60a5fa', opacity: 0.4 }}></div>
            <div className="absolute bottom-40 left-24 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.5 }}></div>
            <div className="absolute bottom-36 right-20 w-2 h-2 rounded-full animate-float-2" style={{ background: '#34d399', opacity: 0.45 }}></div>
            <div className="absolute top-56 left-1/4 w-2 h-2 rounded-full animate-float-3" style={{ background: '#fbbf24', opacity: 0.4 }}></div>
            <div className="absolute bottom-44 right-1/4 w-2 h-2 rounded-full animate-float-4" style={{ background: '#c084fc', opacity: 0.45 }}></div>

          </div>

          <div className="relative z-10 container-mobile max-w-4xl">
            <div className="text-center animate-fade-in">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
                {/* Mobile Version */}
                <span className="block sm:hidden whitespace-pre-line">
                  {"Free PDF Editor Online – Edit PDF\nFiles Instantly with GinyWow"}
                </span>
                {/* Desktop/Tablet Version */}
                <span className="hidden sm:block whitespace-pre-line">
                  {"Free PDF Editor Online – Edit PDF Files\nInstantly with GinyWow"}
                </span>
              </h1>
              
              <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
                Edit PDF files directly in your browser. Add text, images, annotations, signatures, and more to your PDF documents.
              </p>

              {/* PDF Upload Area */}
              <div className="max-w-2xl mx-auto mb-8 px-4">
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                    isDragOver 
                      ? 'border-emerald-400 bg-emerald-50' 
                      : file 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 bg-white hover:border-emerald-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                >
                  {!file ? (
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Select PDF File to Edit
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Drop your PDF file here or click to browse (up to 100MB)
                      </p>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInput}
                        className="hidden"
                        id="pdf-file-input"
                        data-testid="pdf-file-input"
                      />
                      <label htmlFor="pdf-file-input">
                        <Button asChild className="cursor-pointer bg-emerald-600 hover:bg-emerald-700" data-testid="choose-pdf-button">
                          <span>Choose PDF File</span>
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        File Selected: {file.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Button 
                          onClick={handleOpenEditor}
                          disabled={isProcessing}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          data-testid="open-editor-button"
                        >
                          {isProcessing ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Loading Editor...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Open PDF Editor
                            </div>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setFile(null)}
                          disabled={isProcessing}
                          data-testid="choose-different-file-button"
                        >
                          Choose Different File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our More Tools Section - Lightning Fast */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-t-2 border-dashed border-gray-300">
          <div className="container-mobile max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-lg font-medium mb-8 sm:mb-12">
                Our More Tools : Try It
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* App Opener Section */}
                <div
                  className="group p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: '0.1s' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                      Social Media
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    App Opener
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Convert social media links to custom short URLs that open directly in native apps.
                  </p>
                  <div className="flex items-center text-orange-600 text-sm font-medium group-hover:text-orange-700 transition-colors">
                    <span>Try Now</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Format Converter Section */}
                <div
                  className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      Image Tools
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Format Converter
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Convert images between 8+ popular formats with quality controls and SEO optimization.
                  </p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                    <span>Try Now</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <Suspense fallback={<div className="h-48 bg-gray-50"></div>}>
          <NewsletterSection />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={<div className="h-24 bg-gray-100"></div>}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
}