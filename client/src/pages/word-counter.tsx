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
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            GinyWow Word Counter Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Count words, characters, sentences, and paragraphs instantly. Perfect for essays, articles, and content creation with real-time reading time estimation.
          </p>
        </div>

        {/* Main Tool Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Text Input Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Enter Your Text
                </CardTitle>
                <CardDescription>
                  Type or paste your text below to get instant word count statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start typing or paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[300px] text-base leading-relaxed"
                  data-testid="word-counter-textarea"
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    disabled={!text}
                    data-testid="clear-text-button"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear Text
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopyStats}
                    disabled={!text}
                    data-testid="copy-stats-button"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Statistics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Text Statistics</CardTitle>
                <CardDescription>
                  Real-time analysis of your text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Words</span>
                  <Badge variant="secondary" className="text-lg font-bold" data-testid="word-count">
                    {currentStats.words}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Characters</span>
                  <Badge variant="outline" data-testid="character-count">
                    {currentStats.characters}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Characters (no spaces)</span>
                  <Badge variant="outline" data-testid="character-no-spaces-count">
                    {currentStats.charactersNoSpaces}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Sentences</span>
                  <Badge variant="outline" data-testid="sentence-count">
                    {currentStats.sentences}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Paragraphs</span>
                  <Badge variant="outline" data-testid="paragraph-count">
                    {currentStats.paragraphs}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Reading Time
                  </span>
                  <Badge variant="default" data-testid="reading-time">
                    {currentStats.readingTime} min
                  </Badge>
                </div>
              </CardContent>
            </Card>
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