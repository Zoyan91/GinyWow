import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, QrCode, Link as LinkIcon, Smartphone, Wifi } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function QRCodeGenerator() {
  const [inputText, setInputText] = useState("");
  const [qrCodeType, setQrCodeType] = useState("text");
  const [generatedQR, setGeneratedQR] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // QR Code generation using QR Server API
  const generateQRCode = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text or URL to generate QR code.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Using QR Server API for generating QR codes
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(inputText)}`;
      setGeneratedQR(qrUrl);
      
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = async () => {
    if (!generatedQR) return;
    
    try {
      // Show downloading toast
      toast({
        title: "Downloading...",
        description: "Preparing your QR code for download.",
      });

      // Fetch the image from external API
      const response = await fetch(generatedQR);
      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }
      
      // Convert to blob
      const blob = await response.blob();
      
      // Create blob URL and download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);
      
      toast({
        title: "QR Code Downloaded",
        description: "QR code has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTypeChange = (type: string) => {
    setQrCodeType(type);
    setInputText("");
    setGeneratedQR("");
  };

  const getPlaceholderText = () => {
    switch (qrCodeType) {
      case "url":
        return "https://example.com";
      case "email":
        return "user@example.com";
      case "phone":
        return "+1234567890";
      case "sms":
        return "Hello! This is a text message.";
      case "wifi":
        return "WIFI:T:WPA;S:NetworkName;P:Password;;";
      case "text":
      default:
        return "Enter your text here...";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free QR Code Generator - Create Custom QR Codes Online | GinyWow</title>
        <meta name="description" content="Generate free QR codes instantly with GinyWow. Create QR codes for URLs, text, email, phone numbers, WiFi, and more. Download high-quality QR codes for free." />
        <meta name="keywords" content="QR code generator, free QR code, QR code maker, barcode generator, QR scanner, custom QR code, GinyWow" />
        <link rel="canonical" href="https://ginywow.com/qr-code-generator" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Free QR Code Generator - Create Custom QR Codes Online | GinyWow" />
        <meta property="og:description" content="Generate free QR codes instantly with GinyWow. Create QR codes for URLs, text, email, phone numbers, WiFi, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/qr-code-generator" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free QR Code Generator - Create Custom QR Codes Online | GinyWow" />
        <meta name="twitter:description" content="Generate free QR codes instantly with GinyWow. Create QR codes for URLs, text, email, phone numbers, WiFi, and more." />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GinyWow QR Code Generator",
            "description": "Free online QR code generator for creating custom QR codes for various purposes",
            "url": "https://ginywow.com/qr-code-generator",
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

      <Header currentPage="qr-code-generator" />
      
      {/* Hero Section - Mobile First - Matching Home Page */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              QR Code Generator Tool
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Professional QR code generator for URLs, text, email, WiFi, and more. Create, customize, and download high-quality QR codes instantly.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Main Tool Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-orange-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  QR Code Settings
                </h2>
                <p className="text-orange-100 mt-2">
                  Choose type and content for your custom QR code
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <Label htmlFor="qr-type" className="text-base font-semibold text-gray-700 mb-3 block">QR Code Type</Label>
                  <Select value={qrCodeType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-orange-400 rounded-xl" data-testid="qr-type-select">
                      <SelectValue placeholder="Select QR code type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">📝 Plain Text</SelectItem>
                      <SelectItem value="url">🌐 Website URL</SelectItem>
                      <SelectItem value="email">✉️ Email Address</SelectItem>
                      <SelectItem value="phone">📞 Phone Number</SelectItem>
                      <SelectItem value="sms">💬 SMS Message</SelectItem>
                      <SelectItem value="wifi">📶 WiFi Password</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="qr-content" className="text-base font-semibold text-gray-700 mb-3 block">Content</Label>
                  {qrCodeType === "sms" || qrCodeType === "wifi" ? (
                    <Textarea
                      id="qr-content"
                      placeholder={getPlaceholderText()}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[120px] border-2 border-gray-200 focus:border-orange-400 rounded-xl resize-none transition-all duration-300"
                      data-testid="qr-content-textarea"
                    />
                  ) : (
                    <Input
                      id="qr-content"
                      placeholder={getPlaceholderText()}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-orange-400 rounded-xl transition-all duration-300"
                      data-testid="qr-content-input"
                    />
                  )}
                </div>

                <Button
                  onClick={generateQRCode}
                  disabled={isGenerating || !inputText.trim()}
                  className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  data-testid="generate-qr-button"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 mr-3" />
                      Generate QR Code ✨
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-orange-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  QR Code Preview
                </h2>
                <p className="text-orange-100 mt-2">
                  Your beautiful QR code will appear here
                </p>
              </div>
              <div className="p-6">
                {generatedQR ? (
                  <div className="text-center space-y-6">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-dashed border-orange-300 inline-block shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50"></div>
                      <img
                        src={generatedQR}
                        alt="Generated QR Code"
                        className="w-64 h-64 mx-auto relative z-10 drop-shadow-lg"
                        data-testid="generated-qr-image"
                      />
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">QR Code Generated Successfully!</span>
                      </div>
                    </div>
                    <Button
                      onClick={downloadQRCode}
                      className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                      data-testid="download-qr-button"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <QrCode className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Enter content and click "Generate QR Code" to see your QR code here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-8">
          {/* What is GinyWow QR Code Generator */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GinyWow QR Code Generator?</h2>
            <p className="text-gray-700 leading-relaxed">
              GinyWow QR Code Generator is a free, easy-to-use online tool that creates high-quality QR codes for various purposes. 
              Whether you need to share URLs, contact information, WiFi passwords, or any text content, our generator creates 
              scannable QR codes that work with all standard QR code readers and smartphone cameras.
            </p>
          </section>

          {/* Why Use GinyWow QR Code Generator */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use GinyWow QR Code Generator?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multiple QR Types</h3>
                    <p className="text-gray-600 text-sm">Support for URLs, text, email, phone, SMS, and WiFi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">High Quality</h3>
                    <p className="text-gray-600 text-sm">300x300 pixel resolution for clear scanning</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Generation</h3>
                    <p className="text-gray-600 text-sm">Create QR codes in seconds</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Free Download</h3>
                    <p className="text-gray-600 text-sm">Download PNG files without watermarks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Universal Compatibility</h3>
                    <p className="text-gray-600 text-sm">Works with all QR code scanners and smartphones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">No Registration</h3>
                    <p className="text-gray-600 text-sm">Use immediately without signing up</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Create QR Codes with GinyWow</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Select the type of QR code you want to create</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700">Enter your content (URL, text, email, etc.)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">Click "Generate QR Code" to create your QR code</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-gray-700">Download your QR code as a PNG file</p>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular QR Code Use Cases</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Website Links</h3>
                <p className="text-gray-600 text-sm">Share website URLs quickly and easily</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wifi className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">WiFi Access</h3>
                <p className="text-gray-600 text-sm">Share WiFi passwords with guests</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Info</h3>
                <p className="text-gray-600 text-sm">Share phone numbers and email addresses</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}