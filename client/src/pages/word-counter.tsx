import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Copy, RotateCcw } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";

export default function WordCounter() {
  const [text, setText] = useState("");
  const { toast } = useToast();

  const getStats = () => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const readingTime = Math.ceil(words / 200);

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime };
  };

  const stats = getStats();

  const handleClear = () => {
    setText("");
  };

  const handleCopyStats = () => {
    const statsText = `Words: ${stats.words}
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading time: ${stats.readingTime} min`;

    navigator.clipboard.writeText(statsText).then(() => {
      toast({
        title: "Statistics Copied",
        description: "Word count statistics copied to clipboard."
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
    <>
      <Helmet>
        <title>Word Counter - Count Words, Characters & More | GinyWow</title>
        <meta name="description" content="Free word counter tool to count words, characters, sentences, paragraphs and reading time. Perfect for writers, students, and content creators." />
      </Helmet>
      
      <Header currentPage="Word Counter" />
      
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Word Counter
            </h1>
            <p className="text-gray-600">
              Count words, characters, sentences, and reading time instantly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Enter Your Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here..."
                  className="min-h-[200px] resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCopyStats} className="flex-1" disabled={!text}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Stats
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Text Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-800">{stats.words}</div>
                    <div className="text-blue-600 text-sm">Words</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-800">{stats.characters}</div>
                    <div className="text-green-600 text-sm">Characters</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-800">{stats.charactersNoSpaces}</div>
                    <div className="text-purple-600 text-sm">No Spaces</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-800">{stats.sentences}</div>
                    <div className="text-orange-600 text-sm">Sentences</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-800">{stats.paragraphs}</div>
                    <div className="text-red-600 text-sm">Paragraphs</div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-800">{stats.readingTime}</div>
                    <div className="text-indigo-600 text-sm">Min Read</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}