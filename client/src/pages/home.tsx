import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Clipboard, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to generate a link",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Show success toast
      toast({
        title: "Link Generated!",
        description: "Your app opener link has been created successfully"
      });
      
      // Create the generated link with ginywow.com domain
      const baseUrl = window.location.origin;
      const encodedUrl = encodeURIComponent(youtubeUrl);
      const newGeneratedLink = `${baseUrl}/open?url=${encodedUrl}`;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGeneratedLink(newGeneratedLink);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setYoutubeUrl(text);
      
      toast({
        title: "Pasted!",
        description: "URL pasted from clipboard"
      });
    } catch (error) {
      toast({
        title: "Paste failed",
        description: "Please paste the URL manually",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedLink);
        toast({
          title: "Copied!",
          description: "Link copied to clipboard"
        });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = generatedLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast({
            title: "Copied!",
            description: "Link copied to clipboard"
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
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="home" />

      {/* Floating Shapes - Exact TinyWow Style from Image */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ height: '140vh' }}>
        
        {/* TinyWow Style Shapes - Exact Color Match */}
        
        {/* Very Small Dots - Top Area - Orange & Pink Theme */}
        <div className="absolute top-4 left-12 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.4 }}></div>
        <div className="absolute top-8 right-24 w-2 h-2 rounded-full animate-float-2" style={{ background: '#ec4899', opacity: 0.3 }}></div>
        <div className="absolute top-16 left-1/4 w-2 h-2 rounded-full animate-float-3" style={{ background: '#3b82f6', opacity: 0.4 }}></div>
        <div className="absolute top-24 right-1/3 w-2 h-2 rounded-full animate-float-4" style={{ background: '#8b5cf6', opacity: 0.3 }}></div>
        
        {/* Small Triangles - TinyWow Orange Style */}
        <div className="absolute top-6 left-20 w-3 h-3 animate-float-1" style={{ background: '#fb923c', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.4 }}></div>
        <div className="absolute top-32 right-16 w-4 h-4 animate-float-2" style={{ background: '#f97316', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.35 }}></div>
        <div className="absolute top-48 left-8 w-3 h-3 animate-float-3" style={{ background: '#fb923c', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.4 }}></div>
        
        {/* Small Circles - TinyWow Colors Only */}
        <div className="absolute top-12 right-12 w-3 h-3 rounded-full animate-float-4" style={{ background: '#ec4899', opacity: 0.4 }}></div>
        <div className="absolute top-28 left-16 w-4 h-4 rounded-full animate-float-1" style={{ background: '#3b82f6', opacity: 0.35 }}></div>
        <div className="absolute top-44 right-20 w-3 h-3 rounded-full animate-float-2" style={{ background: '#8b5cf6', opacity: 0.4 }}></div>
        <div className="absolute top-60 left-1/3 w-4 h-4 rounded-full animate-float-3" style={{ background: '#9333ea', opacity: 0.35 }}></div>
        
        {/* Small Squares/Diamonds - Purple & Pink */}
        <div className="absolute top-20 left-1/2 w-3 h-3 animate-float-4" style={{ background: '#8b5cf6', transform: 'rotate(45deg)', opacity: 0.4 }}></div>
        <div className="absolute top-36 right-8 w-4 h-4 animate-float-1" style={{ background: '#f472b6', transform: 'rotate(45deg)', opacity: 0.35 }}></div>
        <div className="absolute top-52 left-12 w-3 h-3 animate-float-2" style={{ background: '#f472b6', transform: 'rotate(45deg)', opacity: 0.4 }}></div>
        
        {/* Mid Section Shapes - Exact TinyWow Palette */}
        <div className="absolute left-4 w-2 h-2 rounded-full animate-float-3" style={{ background: '#fb923c', opacity: 0.4, top: '20rem' }}></div>
        <div className="absolute right-6 w-3 h-3 animate-float-4" style={{ background: '#fb923c', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.35, top: '22rem' }}></div>
        <div className="absolute left-1/4 w-4 h-4 rounded-full animate-float-1" style={{ background: '#3b82f6', opacity: 0.4, top: '24rem' }}></div>
        <div className="absolute right-1/4 w-3 h-3 animate-float-2" style={{ background: '#ec4899', transform: 'rotate(45deg)', opacity: 0.4, top: '26rem' }}></div>
        <div className="absolute left-1/2 w-2 h-2 rounded-full animate-float-3" style={{ background: '#8b5cf6', opacity: 0.35, top: '28rem' }}></div>
        
        {/* Lower Section - Tools Area - TinyWow Colors */}
        <div className="absolute left-8 w-3 h-3 rounded-full animate-float-4" style={{ background: '#9333ea', opacity: 0.4, top: '30rem' }}></div>
        <div className="absolute right-12 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.35, top: '32rem' }}></div>
        <div className="absolute left-1/3 w-4 h-4 animate-float-2" style={{ background: '#fb923c', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.4, top: '34rem' }}></div>
        <div className="absolute right-1/3 w-3 h-3 animate-float-3" style={{ background: '#8b5cf6', transform: 'rotate(45deg)', opacity: 0.35, top: '36rem' }}></div>
        <div className="absolute left-16 w-2 h-2 rounded-full animate-float-4" style={{ background: '#ec4899', opacity: 0.4, top: '38rem' }}></div>
        
        {/* What Is Section - Orange/Blue/Purple/Pink Only */}
        <div className="absolute right-8 w-3 h-3 rounded-full animate-float-1" style={{ background: '#3b82f6', opacity: 0.4, top: '40rem' }}></div>
        <div className="absolute left-20 w-4 h-4 animate-float-2" style={{ background: '#3b82f6', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.35, top: '42rem' }}></div>
        <div className="absolute right-16 w-2 h-2 rounded-full animate-float-3" style={{ background: '#f472b6', opacity: 0.4, top: '44rem' }}></div>
        <div className="absolute left-1/4 w-3 h-3 animate-float-4" style={{ background: '#fb923c', transform: 'rotate(45deg)', opacity: 0.35, top: '46rem' }}></div>
        <div className="absolute right-1/4 w-4 h-4 rounded-full animate-float-1" style={{ background: '#8b5cf6', opacity: 0.4, top: '48rem' }}></div>
        
        {/* Additional Tiny Dots - TinyWow Theme Only */}
        <div className="absolute top-64 left-4 w-2 h-2 rounded-full animate-float-2" style={{ background: '#9333ea', opacity: 0.3 }}></div>
        <div className="absolute top-68 right-4 w-2 h-2 rounded-full animate-float-3" style={{ background: '#fb923c', opacity: 0.4 }}></div>
        <div className="absolute bottom-32 left-8 w-2 h-2 rounded-full animate-float-4" style={{ background: '#ec4899', opacity: 0.35 }}></div>
        <div className="absolute bottom-24 right-12 w-2 h-2 rounded-full animate-float-1" style={{ background: '#8b5cf6', opacity: 0.4 }}></div>
        <div className="absolute bottom-16 left-1/3 w-2 h-2 rounded-full animate-float-2" style={{ background: '#3b82f6', opacity: 0.35 }}></div>
        <div className="absolute bottom-8 right-1/3 w-2 h-2 rounded-full animate-float-3" style={{ background: '#f472b6', opacity: 0.4 }}></div>
        
        {/* Corner Scattered Shapes - Orange & Blue */}
        <div className="absolute top-72 left-1/2 w-3 h-3 animate-float-4" style={{ background: '#fb923c', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', opacity: 0.35 }}></div>
        <div className="absolute top-76 right-1/2 w-2 h-2 rounded-full animate-float-1" style={{ background: '#3b82f6', opacity: 0.4 }}></div>
        
        {/* Very Subtle Background Dots - TinyWow Palette */}
        <div className="absolute top-84 left-12 w-1.5 h-1.5 rounded-full animate-float-2" style={{ background: '#fb923c', opacity: 0.25 }}></div>
        <div className="absolute top-88 right-20 w-1.5 h-1.5 rounded-full animate-float-3" style={{ background: '#ec4899', opacity: 0.25 }}></div>
        <div className="absolute top-92 left-1/4 w-1.5 h-1.5 rounded-full animate-float-4" style={{ background: '#8b5cf6', opacity: 0.25 }}></div>
        <div className="absolute top-96 right-1/4 w-1.5 h-1.5 rounded-full animate-float-1" style={{ background: '#9333ea', opacity: 0.25 }}></div>

      </div>

      {/* Hero Section - Mobile First */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">
        <div className="relative z-10 container-mobile max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              {/* Mobile Version */}
              <span className="block sm:hidden whitespace-pre-line">
                {"App Opener Link Generator Link \nDirectly Open in YouTube App"}
              </span>
              {/* Desktop/Tablet Version */}
              <span className="hidden sm:block whitespace-pre-line">
                {"App Opener Link Generator Link Directly\nOpen in YouTube App"}
              </span>
            </h1>
            
            <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              We help you gain more followers on socials by enabling users to open a link directly in an app instead of an in-app browser.
            </p>

            {/* URL Input and Generate Button */}
            <div className="max-w-2xl mx-auto mb-8 px-4">
              {/* Mobile Layout - Separate Elements */}
              <div className="flex flex-col gap-4 sm:hidden">
                <Input
                  type="url"
                  placeholder="Paste Your URL Here"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="input-mobile text-center"
                  data-testid="url-input-mobile"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`btn-mobile w-auto px-8 bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white shadow-lg ${
                    isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  data-testid="generate-button-mobile"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Clipboard className="w-4 h-4 mr-2" />
                      <span>Generate</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Desktop Layout - Integrated Design */}
              <div className="hidden sm:block">
                <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden max-w-xl mx-auto">
                  <Input
                    type="url"
                    placeholder="Paste Your URL Here"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="flex-1 border-0 bg-transparent px-6 py-4 text-base focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none placeholder-gray-500"
                    data-testid="url-input-desktop"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  <div className="flex">
                    <button
                      onClick={pasteFromClipboard}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-4 transition-colors flex items-center justify-center"
                      data-testid="paste-button"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className={`bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-4 font-semibold transition-colors ${
                        isGenerating ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      data-testid="generate-text-button"
                    >
                      {isGenerating ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Link Result */}
            {generatedLink && (
              <div className="max-w-2xl mx-auto px-4 animate-mobile-slide-up">
                <div className="card-mobile p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="flex-1 bg-gray-50 border-gray-300 text-gray-700 cursor-text text-center sm:text-left"
                      data-testid="generated-link"
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="btn-mobile-sm bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
                      data-testid="copy-button"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Our More Tools Section - Lightning Fast */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-t-2 border-dashed border-gray-300">
        <div className="container-mobile max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-2">
              Our More Tools : Try It
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Thumbnail Downloader Card */}
            <div>
              <Card className="group h-full overflow-hidden border border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <div className="p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Free Tool
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                    Thumbnail Downloader
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-6 flex-grow">
                    Download high-quality thumbnails from YouTube, Instagram, TikTok, and other social media platforms instantly.
                  </p>
                  
                  <a 
                    href="/thumbnail-downloader"
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg group-hover:scale-105"
                    data-testid="link-thumbnail-downloader"
                  >
                    <span>Try Thumbnail Downloader</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </Card>
            </div>

            {/* Format Converter Card */}
            <div>
              <Card className="group h-full overflow-hidden border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <div className="p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Free Tool
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                    Format Converter
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-6 flex-grow">
                    Convert images between 8+ popular formats including PNG, JPEG, WebP, GIF, BMP, TIFF, AVIF, and ICO with quality controls.
                  </p>
                  
                  <a 
                    href="/format-converter"
                    className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg group-hover:scale-105"
                    data-testid="link-format-converter"
                  >
                    <span>Try Format Converter</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What is GinyWow App Opener Section */}
      <section className="pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="container-mobile max-w-4xl">
          <div className="animate-on-scroll">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
                What is GinyWow App Opener?
              </h2>
            </div>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-responsive-sm leading-relaxed mb-4 sm:mb-6">
                <strong>GinyWow App Opener</strong>, also known as Link Opener, Social Media Opener, and Universal Link Opener, is a direct-to-app redirection tool that helps social media influencers, affiliate marketers, and businesses convert their visitors into <strong>app users</strong> and loyal followers across all platforms.
              </p>
              
              <p className="text-responsive-sm leading-relaxed">
                The <strong>GinyWow App Opener link generator</strong> allows creators to generate custom links for social media profiles including <strong>YouTube, Instagram, TikTok, Facebook, Twitter, LinkedIn</strong>, and many others. Normally, when you share social media links across platforms, users end up browsing within in-app browsers which provide a poor user experience and low engagement rates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}