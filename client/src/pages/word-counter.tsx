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
      <section className="relative bg-blue-50 py-8 sm:py-12 lg:py-20 overflow-hidden">

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
              <div className="bg-blue-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Enter Your Text
                </h2>
                <p className="text-blue-100 mt-2">
                  Type or paste your text below for instant analysis
                </p>
              </div>
              <div className="p-6">
                <div className="relative">
                  <Textarea
                    placeholder="Start typing or paste your text here to see the magic happen..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[400px] text-base leading-relaxed border-2 border-gray-200 focus:border-blue-400 rounded-xl resize-none transition-all duration-300"
                    data-testid="word-counter-textarea"
                  />
                  {text && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-blue-600 text-white">
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
              <div className="bg-blue-600 p-6">
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
                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-4xl font-bold text-blue-600 mb-2" data-testid="word-count">
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
                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
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

          {/* FAQ Section */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Is the Word Counter tool completely free to use?
                </h3>
                <p className="text-gray-700">
                  Yes, our Word Counter tool is 100% free with no hidden charges, registration requirements, or usage limits. You can count words, characters, sentences, and paragraphs as many times as you need.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Does the tool store or save my text content?
                </h3>
                <p className="text-gray-700">
                  No, we prioritize your privacy. All text analysis happens locally in your browser, and your content is never stored, saved, or transmitted to our servers. Your text remains completely private.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: How accurate is the word count compared to Microsoft Word?
                </h3>
                <p className="text-gray-700">
                  Our word counter uses the same counting algorithm as most professional tools. It counts words separated by spaces and treats hyphenated words as single words, providing results consistent with Microsoft Word and Google Docs.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: What's the maximum text length I can analyze?
                </h3>
                <p className="text-gray-700">
                  There's no strict limit on text length. Our tool can handle everything from short social media posts to long academic papers, novels, and research documents efficiently without performance issues.
                </p>
              </div>

              <div className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: How is reading time calculated?
                </h3>
                <p className="text-gray-700">
                  Reading time is calculated based on an average reading speed of 200 words per minute, which is the standard for adult readers. This helps you estimate how long it will take readers to consume your content.
                </p>
              </div>

            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}