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

  const downloadQRCode = () => {
    if (!generatedQR) return;
    
    const link = document.createElement('a');
    link.href = generatedQR;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "QR code has been downloaded successfully.",
    });
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
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            GinyWow QR Code Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create custom QR codes instantly for URLs, text, email, phone numbers, WiFi passwords, and more. Download high-quality QR codes for free.
          </p>
        </div>

        {/* Main Tool Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  QR Code Settings
                </CardTitle>
                <CardDescription>
                  Choose the type and enter your content to generate a QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="qr-type">QR Code Type</Label>
                  <Select value={qrCodeType} onValueChange={handleTypeChange}>
                    <SelectTrigger data-testid="qr-type-select">
                      <SelectValue placeholder="Select QR code type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Plain Text</SelectItem>
                      <SelectItem value="url">Website URL</SelectItem>
                      <SelectItem value="email">Email Address</SelectItem>
                      <SelectItem value="phone">Phone Number</SelectItem>
                      <SelectItem value="sms">SMS Message</SelectItem>
                      <SelectItem value="wifi">WiFi Password</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="qr-content">Content</Label>
                  {qrCodeType === "sms" || qrCodeType === "wifi" ? (
                    <Textarea
                      id="qr-content"
                      placeholder={getPlaceholderText()}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[100px]"
                      data-testid="qr-content-textarea"
                    />
                  ) : (
                    <Input
                      id="qr-content"
                      placeholder={getPlaceholderText()}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      data-testid="qr-content-input"
                    />
                  )}
                </div>

                <Button
                  onClick={generateQRCode}
                  disabled={isGenerating || !inputText.trim()}
                  className="w-full"
                  data-testid="generate-qr-button"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
                <CardDescription>
                  Your generated QR code will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedQR ? (
                  <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                      <img
                        src={generatedQR}
                        alt="Generated QR Code"
                        className="w-64 h-64 mx-auto"
                        data-testid="generated-qr-image"
                      />
                    </div>
                    <Button
                      onClick={downloadQRCode}
                      className="w-full"
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
              </CardContent>
            </Card>
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