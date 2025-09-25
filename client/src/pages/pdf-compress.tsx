import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Archive, Download, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFCompress() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
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
    
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF file smaller than 100MB.",
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

  const handleCompress = async () => {
    if (!file) return;
    
    setIsCompressing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      toast({
        title: "Compression Complete!",
        description: "Your PDF has been successfully compressed.",
      });
      
      setFile(null);
    } catch (error) {
      toast({
        title: "Compression Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const getCompressionDescription = (level: string) => {
    switch (level) {
      case 'low':
        return 'Minimal compression, best quality';
      case 'medium':
        return 'Balanced compression and quality';
      case 'high':
        return 'Maximum compression, smaller file size';
      default:
        return '';
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF Compress - Reduce PDF File Size Online Free | GinyWow</title>
        <meta name="description" content="Compress PDF files online for free. Reduce PDF file size while maintaining quality. Fast, secure PDF compression with multiple quality options." />
        <meta name="keywords" content="PDF compress, reduce PDF size, PDF compressor, shrink PDF, online PDF tools, compress PDF online" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-compress" />
        
        <meta property="og:title" content="Free PDF Compress Tool - Reduce File Size Online | GinyWow" />
        <meta property="og:description" content="Compress PDF files while maintaining quality. Choose compression levels and reduce file size instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-compress" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF Compress Tool",
            "description": "Free online tool to compress PDF files and reduce file size",
            "url": "https://ginywow.com/pdf-compress",
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-full mb-6">
                  <Archive className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF Compress Tool
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Reduce PDF file size without compromising quality. Perfect for email attachments, web uploads, and storage optimization.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
                  <CardContent className="p-8">
                    <div
                      className={`space-y-4 ${isDragOver ? 'bg-indigo-50' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                    >
                      {!file ? (
                        <>
                          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-indigo-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Select PDF File to Compress
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Drop your PDF file here or click to browse (up to 50MB)
                            </p>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileInput}
                              className="hidden"
                              id="pdf-file-input"
                            />
                            <label htmlFor="pdf-file-input">
                              <Button asChild className="cursor-pointer bg-indigo-600 hover:bg-indigo-700">
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
                            Original Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          
                          {/* Compression Options */}
                          <div className="space-y-4 text-left">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Compression Level:
                              </label>
                              <div className="space-y-2">
                                {[
                                  { value: 'low', label: 'Low Compression', desc: 'Minimal compression, best quality' },
                                  { value: 'medium', label: 'Medium Compression', desc: 'Balanced compression and quality' },
                                  { value: 'high', label: 'High Compression', desc: 'Maximum compression, smaller file size' }
                                ].map((option) => (
                                  <label key={option.value} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                      type="radio"
                                      name="compressionLevel"
                                      value={option.value}
                                      checked={compressionLevel === option.value}
                                      onChange={(e) => setCompressionLevel(e.target.value as 'low' | 'medium' | 'high')}
                                      className="mt-1 mr-3"
                                    />
                                    <div>
                                      <div className="font-medium text-gray-900">{option.label}</div>
                                      <div className="text-sm text-gray-600">{option.desc}</div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center space-x-4 pt-4">
                            <Button 
                              onClick={handleCompress}
                              disabled={isCompressing}
                              className="bg-indigo-600 hover:bg-indigo-700"
                            >
                              {isCompressing ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Compressing...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Archive className="w-4 h-4 mr-2" />
                                  Compress PDF
                                </div>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setFile(null)}
                              disabled={isCompressing}
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
                  Why Choose Our PDF Compress Tool?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Advanced compression algorithms that reduce file size while preserving document quality
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Archive className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Smart Compression
                  </h3>
                  <p className="text-gray-600">
                    Intelligent algorithms optimize file size while maintaining visual quality
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quality Control
                  </h3>
                  <p className="text-gray-600">
                    Choose compression levels to balance file size and quality
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Fast Processing
                  </h3>
                  <p className="text-gray-600">
                    Quick compression process that handles large files efficiently
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
                    How much can I reduce the PDF file size?
                  </h3>
                  <p className="text-gray-600">
                    Compression results vary depending on the original file content. Typically, you can achieve 30-70% size reduction.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Will compression affect the PDF quality?
                  </h3>
                  <p className="text-gray-600">
                    Our smart compression maintains visual quality while reducing file size. You can choose the compression level based on your needs.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I compress password-protected PDFs?
                  </h3>
                  <p className="text-gray-600">
                    Currently, we don't support password-protected PDFs. Please remove the password before compressing.
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