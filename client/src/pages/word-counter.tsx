import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, FileText, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function WordCounter() {
  const [text, setText] = useState("");
  const { toast } = useToast();

  // Calculate text statistics
  const stats = useCallback(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime
    };
  }, [text]);

  const currentStats = stats();

  const handleClear = () => {
    setText("");
    toast({
      title: "Text Cleared",
      description: "The text area has been cleared successfully.",
    });
  };

  const handleCopyStats = () => {
    const statsText = `Word Count Statistics:
Words: ${currentStats.words}
Characters: ${currentStats.characters}
Characters (no spaces): ${currentStats.charactersNoSpaces}
Sentences: ${currentStats.sentences}
Paragraphs: ${currentStats.paragraphs}
Estimated reading time: ${currentStats.readingTime} minute(s)`;

    navigator.clipboard.writeText(statsText).then(() => {
      toast({
        title: "Statistics Copied",
        description: "Word count statistics copied to clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy statistics. Please try again.",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Online Word Counter – Count Words, Characters & Sentences Instantly | GinyWow</title>
        <meta name="description" content="Use our free Word Counter Tool to count words, characters, sentences, and paragraphs online. Perfect for writers, students, bloggers, and SEO professionals. No signup required." />
        <meta name="keywords" content="word counter, character counter, text analyzer, reading time calculator, writing tool, GinyWow" />
        <link rel="canonical" href="https://ginywow.com/word-counter" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Free Word Counter Tool - Count Words, Characters & Reading Time | GinyWow" />
        <meta property="og:description" content="Free online word counter tool by GinyWow. Count words, characters, sentences, paragraphs and estimate reading time instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/word-counter" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Word Counter Tool - Count Words, Characters & Reading Time | GinyWow" />
        <meta name="twitter:description" content="Free online word counter tool by GinyWow. Count words, characters, sentences, paragraphs and estimate reading time instantly." />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GinyWow Word Counter",
            "description": "Free online word counter tool to count words, characters, sentences, paragraphs and estimate reading time",
            "url": "https://ginywow.com/word-counter",
            "applicationCategory": "Utility",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <Header currentPage="word-counter" />
      
      {/* Hero Section - Mobile First - Matching Home Page */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">
        {/* Floating Shapes - Home Page Style - Hidden on Mobile */}
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

          {/* Additional dots scattered */}
          <div className="absolute top-28 left-20 w-2 h-2 rounded-full animate-float-5" style={{ background: '#f472b6', opacity: 0.45 }}></div>
          <div className="absolute top-44 right-24 w-2 h-2 rounded-full animate-float-6" style={{ background: '#60a5fa', opacity: 0.4 }}></div>
          <div className="absolute bottom-40 left-24 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.5 }}></div>
          <div className="absolute bottom-36 right-20 w-2 h-2 rounded-full animate-float-2" style={{ background: '#34d399', opacity: 0.45 }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              Free Online Word Counter – Count Words, Characters & Sentences Instantly
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Use our free Word Counter Tool to count words, characters, sentences, and paragraphs online. Perfect for writers, students, bloggers, and SEO professionals.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Main Tool Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Text Input Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Enter Your Text
                </h2>
                <p className="text-cyan-100 mt-2">
                  Type or paste your text below for instant analysis
                </p>
              </div>
              <div className="p-6">
                <div className="relative">
                  <Textarea
                    placeholder="Start typing or paste your text here to see the magic happen..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[400px] text-base leading-relaxed border-2 border-gray-200 focus:border-cyan-400 rounded-xl resize-none transition-all duration-300"
                    data-testid="word-counter-textarea"
                  />
                  {text && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white">
                        {currentStats.words} words
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    disabled={!text}
                    className="flex-1 border-2 border-gray-300 hover:border-red-400 hover:text-red-600 transition-all duration-300"
                    data-testid="clear-text-button"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear Text
                  </Button>
                  <Button
                    onClick={handleCopyStats}
                    disabled={!text}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="copy-stats-button"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Statistics
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-6">
            {/* Live Statistics Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  Live Statistics
                </h2>
                <p className="text-teal-100 mt-2">Real-time text analysis</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Words - Primary Stat */}
                <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-200">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2" data-testid="word-count">
                    {currentStats.words.toLocaleString()}
                  </div>
                  <div className="text-gray-600 font-medium flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Words
                  </div>
                </div>
                
                {/* Other Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                    <div className="text-2xl font-bold text-gray-900 mb-1" data-testid="character-count">
                      {currentStats.characters.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Characters</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                    <div className="text-2xl font-bold text-gray-900 mb-1" data-testid="character-no-spaces-count">
                      {currentStats.charactersNoSpaces.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">No Spaces</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                    <div className="text-2xl font-bold text-gray-900 mb-1" data-testid="sentence-count">
                      {currentStats.sentences.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Sentences</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300">
                    <div className="text-2xl font-bold text-gray-900 mb-1" data-testid="paragraph-count">
                      {currentStats.paragraphs.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Paragraphs</div>
                  </div>
                </div>
                
                {/* Reading Time - Special */}
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-600 font-medium">Reading Time</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-700" data-testid="reading-time">
                    {currentStats.readingTime} min
                  </div>
                  <div className="text-xs text-orange-600 mt-1">@ 200 words/min</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-8">
          {/* What is a Word Counter Tool */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is a Word Counter Tool?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>Word Counter Tool</strong> is a free online utility that instantly counts the number of words, characters, sentences, and paragraphs in your text. Whether you are a <strong>student writing an essay</strong>, a <strong>blogger creating content</strong>, or a <strong>marketer optimizing SEO</strong>, this tool helps you stay accurate and within limits.
            </p>
          </section>

          {/* Why Use the GinyWow Word Counter */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use the GinyWow Word Counter?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">Instant Results</strong>
                  <span className="text-gray-700"> – Paste or type text to see word count immediately.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">Character & Sentence Count</strong>
                  <span className="text-gray-700"> – Track more than just words.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">SEO Friendly</strong>
                  <span className="text-gray-700"> – Ensure your content meets search engine requirements.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">Free & Easy</strong>
                  <span className="text-gray-700"> – 100% free, no login or signup required.</span>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use the Word Counter */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Word Counter?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">1</Badge>
                <p className="text-gray-700">Copy and paste your text into the input box.</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">2</Badge>
                <p className="text-gray-700">Instantly see <strong>word count, character count, sentence count, and paragraph count</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">3</Badge>
                <p className="text-gray-700">Use results to optimize essays, blog posts, or social media captions.</p>
              </div>
            </div>
          </section>

          {/* Who Can Use This Tool */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Can Use This Tool?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📚</span>
                  <div>
                    <strong className="text-gray-900">Students</strong>
                    <span className="text-gray-700"> – Check essay or assignment length.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">✍️</span>
                  <div>
                    <strong className="text-gray-900">Writers & Bloggers</strong>
                    <span className="text-gray-700"> – Track content size for blogs & articles.</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📈</span>
                  <div>
                    <strong className="text-gray-900">SEO Professionals</strong>
                    <span className="text-gray-700"> – Optimize word count for Google ranking.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">💬</span>
                  <div>
                    <strong className="text-gray-900">Social Media Users</strong>
                    <span className="text-gray-700"> – Ensure posts fit within Twitter, Instagram, or LinkedIn limits.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Global Use Cases */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Global Use Cases</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our <strong>Word Counter Tool</strong> is popular worldwide:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-blue-800 mb-2">🇺🇸 USA & UK</h4>
                <p className="text-gray-600 text-sm">Students use it for essays and reports.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-blue-800 mb-2">🇮🇳 India & Asia</h4>
                <p className="text-gray-600 text-sm">Bloggers use it to optimize SEO content.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-blue-800 mb-2">🌍 Europe & Canada</h4>
                <p className="text-gray-600 text-sm">Writers and marketers use it for precise word tracking.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}