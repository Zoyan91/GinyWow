import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

export default function AppOpener() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive"
      });
      return;
    }

    try {
      const urlObj = new URL(youtubeUrl);
      const isValidDomain = urlObj.hostname === 'youtu.be' || 
                           urlObj.hostname === 'youtube.com' || 
                           urlObj.hostname === 'www.youtube.com' ||
                           urlObj.hostname === 'm.youtube.com';
      
      if (!isValidDomain) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid YouTube URL",
          variant: "destructive"
        });
        return;
      }
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest('POST', '/api/short-url', { url: youtubeUrl });
      const result = await response.json();

      if (result.success) {
        setGeneratedLink(result.shortUrl);
        toast({
          title: "Success!",
          description: "Your app opener link has been generated",
        });
      } else {
        throw new Error(result.error || 'Failed to generate link');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(generatedLink);
        toast({
          title: "Copied!",
          description: "Link copied to clipboard",
        });
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = generatedLink;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast({
            title: "Copied!",
            description: "Link copied to clipboard",
          });
        } catch (err) {
          toast({
            title: "Copy failed",
            description: "Please copy the link manually",
            variant: "destructive"
          });
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            App Opener Link Generator Link Directly Open in YouTube App
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
            We help you gain more followers on socials by enabling users to open a link directly in an app instead of an in-app browser.
          </p>

          {/* URL Input and Generate Button */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="url"
                placeholder="Paste Your URL Here"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="flex-1 h-14 px-6 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-orange-400"
                data-testid="youtube-url-input"
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-70"
                data-testid="generate-button"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clipboard className="w-5 h-5" />
                    <span>Generate</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Generated Link Result */}
          {generatedLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="flex-1 h-12 bg-gray-50 border-gray-300 text-gray-700 cursor-text"
                    data-testid="generated-link"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                    data-testid="copy-button"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}