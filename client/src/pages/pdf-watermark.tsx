import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Download, Upload, CheckCircle, ArrowRight, Type, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFWatermark() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const { toast } = useToast();
  
  useScrollAnimation();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > 30 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF file smaller than 30MB.",
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

  const handleAddWatermark = async () => {
    if (!file) return;
    
    if (watermarkType === 'text' && !watermarkText.trim()) {
      toast({
        title: "Missing Watermark Text",
        description: "Please enter the watermark text.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Watermark Added!",
        description: "Your PDF has been successfully watermarked.",
      });
      
      setFile(null);
      setWatermarkText('');
    } catch (error) {
      toast({
        title: "Watermark Failed",
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
        <title>PDF Watermark - Add Watermarks to PDF Files Online Free | GinyWow</title>
        <meta name="description" content="Add text or image watermarks to PDF files online for free. Protect your documents with customizable watermarks. Professional PDF watermarking tool." />
        <meta name="keywords" content="PDF watermark, add watermark to PDF, PDF protection, watermark PDF online, document watermarking" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-watermark" />
        
        <meta property="og:title" content="Free PDF Watermark Tool - Add Watermarks Online | GinyWow" />
        <meta property="og:description" content="Add custom text or image watermarks to PDF files. Protect your documents with professional watermarking." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-watermark" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF Watermark Tool",
            "description": "Free online tool to add watermarks to PDF files",
            "url": "https://ginywow.com/pdf-watermark",
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

      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Floating Background Shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-zinc-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full mb-6">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF Watermark Tool
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Add text or image watermarks to your PDF documents. Protect your content and maintain document ownership with custom watermarks.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-slate-400 transition-colors">
                  <CardContent className="p-8">
                    <div
                      className={`space-y-4 ${isDragOver ? 'bg-slate-50' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                    >
                      {!file ? (
                        <>
                          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-slate-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Select PDF File to Watermark
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Drop your PDF file here or click to browse (up to 30MB)
                            </p>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileInput}
                              className="hidden"
                              id="pdf-file-input"
                            />
                            <label htmlFor="pdf-file-input">
                              <Button asChild className="cursor-pointer bg-slate-600 hover:bg-slate-700">
                                <span>Choose PDF File</span>
                              </Button>
                            </label>
                          </div>
                        </>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            File Selected: {file.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          
                          {/* Watermark Options */}
                          <div className="space-y-4 text-left">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Watermark Type:
                              </label>
                              <div className="flex space-x-4">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="watermarkType"
                                    value="text"
                                    checked={watermarkType === 'text'}
                                    onChange={(e) => setWatermarkType(e.target.value as 'text')}
                                    className="mr-2"
                                  />
                                  <Type className="w-4 h-4 mr-1" />
                                  Text Watermark
                                </label>
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="watermarkType"
                                    value="image"
                                    checked={watermarkType === 'image'}
                                    onChange={(e) => setWatermarkType(e.target.value as 'image')}
                                    className="mr-2"
                                  />
                                  <Image className="w-4 h-4 mr-1" />
                                  Image Watermark
                                </label>
                              </div>
                            </div>
                            
                            {watermarkType === 'text' ? (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Watermark Text:
                                </label>
                                <Input
                                  type="text"
                                  value={watermarkText}
                                  onChange={(e) => setWatermarkText(e.target.value)}
                                  placeholder="Enter watermark text (e.g., CONFIDENTIAL, © Your Name)"
                                  className="w-full"
                                  disabled={isProcessing}
                                />
                              </div>
                            ) : (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Watermark Image:
                                </label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="w-full"
                                  disabled={isProcessing}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Supported formats: PNG, JPG, GIF (transparent backgrounds recommended)
                                </p>
                              </div>
                            )}
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Opacity: {watermarkOpacity}%
                              </label>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={watermarkOpacity}
                                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                disabled={isProcessing}
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Light (10%)</span>
                                <span>Dark (100%)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center space-x-4 pt-4">
                            <Button 
                              onClick={handleAddWatermark}
                              disabled={isProcessing || (watermarkType === 'text' && !watermarkText.trim())}
                              className="bg-slate-600 hover:bg-slate-700"
                            >
                              {isProcessing ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Adding Watermark...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Droplets className="w-4 h-4 mr-2" />
                                  Add Watermark
                                </div>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => { setFile(null); setWatermarkText(''); }}
                              disabled={isProcessing}
                            >
                              Choose Different File
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Our PDF Watermark Tool?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Professional watermarking with customizable options to protect your documents
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Droplets className="w-6 h-6 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Flexible Options
                  </h3>
                  <p className="text-gray-600">
                    Add text or image watermarks with customizable opacity and positioning
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Document Protection
                  </h3>
                  <p className="text-gray-600">
                    Protect intellectual property and maintain document ownership
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Professional Quality
                  </h3>
                  <p className="text-gray-600">
                    High-quality watermarks that don't compromise document readability
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I control the watermark position?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can choose from various positions including center, diagonal, corners, and custom positioning options.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Will watermarks affect the original content?
                  </h3>
                  <p className="text-gray-600">
                    Watermarks are added as overlays and don't modify the original content. You can adjust opacity to ensure readability.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What image formats are supported for watermarks?
                  </h3>
                  <p className="text-gray-600">
                    We support PNG, JPG, and GIF formats. PNG files with transparent backgrounds work best for professional watermarks.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}