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
        <title>Free Word Counter Tool - Count Words, Characters & Reading Time | GinyWow</title>
        <meta name="description" content="Free online word counter tool by GinyWow. Count words, characters, sentences, paragraphs and estimate reading time instantly. Perfect for writers, students and content creators." />
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
              Word Counter Tool
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Count words, characters, paragraphs, and reading time instantly. Professional text analysis for writers and content creators.
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
          {/* What is GinyWow Word Counter */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GinyWow Word Counter?</h2>
            <p className="text-gray-700 leading-relaxed">
              GinyWow Word Counter is a free, powerful online tool that provides instant text analysis and statistics. 
              Whether you're a student working on essays, a writer crafting articles, or a professional creating content, 
              our word counter helps you track your writing progress with real-time word, character, sentence, and paragraph counts.
            </p>
          </section>

          {/* Why Use GinyWow Word Counter */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use GinyWow Word Counter?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-Time Counting</h3>
                    <p className="text-gray-600 text-sm">Instant updates as you type or paste text</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multiple Metrics</h3>
                    <p className="text-gray-600 text-sm">Words, characters, sentences, paragraphs, and reading time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reading Time Estimation</h3>
                    <p className="text-gray-600 text-sm">Calculate how long it takes to read your content</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Free & No Registration</h3>
                    <p className="text-gray-600 text-sm">Use without signing up or paying fees</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Export Statistics</h3>
                    <p className="text-gray-600 text-sm">Copy detailed statistics to clipboard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Privacy Focused</h3>
                    <p className="text-gray-600 text-sm">Your text is processed locally and never stored</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use GinyWow Word Counter</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">1</Badge>
                <p className="text-gray-700">Type or paste your text into the text area</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">2</Badge>
                <p className="text-gray-700">Watch real-time statistics update automatically</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">3</Badge>
                <p className="text-gray-700">View detailed metrics including reading time estimation</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs">4</Badge>
                <p className="text-gray-700">Copy statistics or clear text as needed</p>
              </div>
            </div>
          </section>

          {/* Who Can Benefit */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who Can Benefit from GinyWow Word Counter?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Students</h3>
                <p className="text-gray-600 text-sm">Track essay and assignment word requirements</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Content Writers</h3>
                <p className="text-gray-600 text-sm">Meet article length and SEO requirements</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bloggers</h3>
                <p className="text-gray-600 text-sm">Optimize blog post length and reading time</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Copy className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professionals</h3>
                <p className="text-gray-600 text-sm">Create reports and documents within limits</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}