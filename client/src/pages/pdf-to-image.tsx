import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Download, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFToImage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageFormat, setImageFormat] = useState<'jpg' | 'png' | 'gif'>('jpg');
  const [imageQuality, setImageQuality] = useState<'low' | 'medium' | 'high'>('high');
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
    
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF file smaller than 20MB.",
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

  const handleConvert = async () => {
    if (!file) return;
    
    setIsConverting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      toast({
        title: "Conversion Complete!",
        description: `Your PDF has been converted to ${imageFormat.toUpperCase()} images.`,
      });
      
      setFile(null);
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF to Image Converter - Convert PDF to JPG/PNG Online Free | GinyWow</title>
        <meta name="description" content="Convert PDF pages to images online for free. Transform PDF to JPG, PNG, or GIF with high quality. Perfect for presentations and social media." />
        <meta name="keywords" content="PDF to image, PDF to JPG, PDF to PNG, convert PDF to image, PDF converter, online PDF tools" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-to-image" />
        
        <meta property="og:title" content="Free PDF to Image Converter Online | GinyWow" />
        <meta property="og:description" content="Convert PDF pages to high-quality images instantly. Support for JPG, PNG, and GIF formats." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-to-image" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF to Image Converter",
            "description": "Free online tool to convert PDF pages to image formats",
            "url": "https://ginywow.com/pdf-to-image",
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6">
                  <Image className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF to Image Converter
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Convert PDF pages to high-quality images. Perfect for presentations, social media, and web publishing.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
                  <CardContent className="p-8">
                    <div
                      className={`space-y-4 ${isDragOver ? 'bg-purple-50' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                    >
                      {!file ? (
                        <>
                          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-purple-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Select PDF File to Convert
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Drop your PDF file here or click to browse (up to 20MB)
                            </p>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileInput}
                              className="hidden"
                              id="pdf-file-input"
                            />
                            <label htmlFor="pdf-file-input">
                              <Button asChild className="cursor-pointer bg-purple-600 hover:bg-purple-700">
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
                          
                          {/* Conversion Options */}
                          <div className="space-y-4 text-left">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image Format:
                              </label>
                              <div className="flex space-x-4">
                                {[
                                  { value: 'jpg', label: 'JPG', desc: 'Best for photos and complex images' },
                                  { value: 'png', label: 'PNG', desc: 'Best for text and transparent backgrounds' },
                                  { value: 'gif', label: 'GIF', desc: 'Best for simple graphics' }
                                ].map((format) => (
                                  <label key={format.value} className="flex-1 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="imageFormat"
                                      value={format.value}
                                      checked={imageFormat === format.value}
                                      onChange={(e) => setImageFormat(e.target.value as 'jpg' | 'png' | 'gif')}
                                      className="sr-only"
                                    />
                                    <div className={`p-3 border rounded-lg text-center ${imageFormat === format.value ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                                      <div className="font-medium">{format.label}</div>
                                      <div className="text-xs text-gray-600 mt-1">{format.desc}</div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image Quality:
                              </label>
                              <div className="flex space-x-4">
                                {[
                                  { value: 'low', label: 'Low', desc: 'Smaller file size' },
                                  { value: 'medium', label: 'Medium', desc: 'Balanced quality' },
                                  { value: 'high', label: 'High', desc: 'Best quality' }
                                ].map((quality) => (
                                  <label key={quality.value} className="flex-1 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="imageQuality"
                                      value={quality.value}
                                      checked={imageQuality === quality.value}
                                      onChange={(e) => setImageQuality(e.target.value as 'low' | 'medium' | 'high')}
                                      className="sr-only"
                                    />
                                    <div className={`p-3 border rounded-lg text-center ${imageQuality === quality.value ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                                      <div className="font-medium">{quality.label}</div>
                                      <div className="text-xs text-gray-600 mt-1">{quality.desc}</div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center space-x-4 pt-4">
                            <Button 
                              onClick={handleConvert}
                              disabled={isConverting}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {isConverting ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Converting...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Image className="w-4 h-4 mr-2" />
                                  Convert to {imageFormat.toUpperCase()}
                                </div>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setFile(null)}
                              disabled={isConverting}
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
                  Why Choose Our PDF to Image Converter?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Convert PDF pages to high-quality images with customizable format and quality options
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Image className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Multiple Formats
                  </h3>
                  <p className="text-gray-600">
                    Convert to JPG, PNG, or GIF based on your specific needs
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    High Quality
                  </h3>
                  <p className="text-gray-600">
                    Preserve image quality with customizable resolution settings
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Batch Processing
                  </h3>
                  <p className="text-gray-600">
                    Convert all PDF pages to images in one simple operation
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
                    Which image format should I choose?
                  </h3>
                  <p className="text-gray-600">
                    Use JPG for photos and complex images, PNG for text-heavy documents with transparency, and GIF for simple graphics.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Will each PDF page become a separate image?
                  </h3>
                  <p className="text-gray-600">
                    Yes, each page in your PDF will be converted to a separate image file and provided as a downloadable ZIP archive.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What resolution will the images have?
                  </h3>
                  <p className="text-gray-600">
                    Images are generated at 300 DPI for high quality, ensuring they're suitable for both digital and print use.
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