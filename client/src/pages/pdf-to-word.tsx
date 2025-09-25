import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFToWord() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Enable scroll animations
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
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a PDF file smaller than 10MB.",
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
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('pdf', file);
      
      // Make API call to convert PDF to Word
      const response = await fetch('/api/pdf/convert-to-word', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Download the converted file
        const downloadResponse = await fetch(result.downloadUrl);
        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = result.convertedFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          window.URL.revokeObjectURL(downloadUrl);
          
          toast({
            title: "Conversion Complete!",
            description: `Your PDF has been converted to Word format (${result.convertedFileName}) and downloaded.`,
          });
          
          // Reset form
          setFile(null);
        } else {
          throw new Error('Failed to download converted file');
        }
      } else {
        throw new Error(result.message || 'Conversion failed');
      }
    } catch (error) {
      console.error('PDF conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF to Word Converter - Free Online PDF to DOCX Converter | GinyWow</title>
        <meta name="description" content="Convert PDF to Word documents online for free. Fast, secure, and accurate PDF to DOCX conversion with preserved formatting. No software download required." />
        <meta name="keywords" content="PDF to Word, PDF to DOCX, convert PDF, Word converter, online PDF converter, free PDF tools" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-to-word" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Free PDF to Word Converter Online | GinyWow" />
        <meta property="og:description" content="Convert PDF files to editable Word documents instantly. Preserve formatting, tables, and images with our advanced PDF to DOCX converter." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-to-word" />
        <meta property="og:site_name" content="GinyWow" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF to Word Converter - Free Online Tool" />
        <meta name="twitter:description" content="Convert PDF to Word documents with perfect formatting preservation. Fast, secure, and completely free online converter." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebApplication", "SoftwareApplication"],
            "name": "PDF to Word Converter",
            "description": "Free online tool to convert PDF files to editable Word documents with perfect formatting preservation",
            "url": "https://ginywow.com/pdf-to-word",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "browserRequirements": "Requires JavaScript",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "creator": {
              "@type": "Organization",
              "name": "GinyWow",
              "url": "https://ginywow.com"
            },
            "featureList": [
              "Convert PDF to DOCX format",
              "Preserve original formatting",
              "Support for tables and images",
              "Fast online conversion",
              "No software installation required"
            ],
            "screenshot": "https://ginywow.com/images/pdf-to-word-converter.jpg",
            "softwareVersion": "1.0",
            "datePublished": "2025-09-25",
            "author": {
              "@type": "Organization",
              "name": "GinyWow"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1250"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Floating Background Shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        </div>

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF to Word Converter
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Convert your PDF files to editable Word documents instantly. Preserve formatting, tables, and images with our advanced online converter.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                  <CardContent className="p-8">
                    <div
                      className={`space-y-4 ${isDragOver ? 'bg-blue-50' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                    >
                      {!file ? (
                        <>
                          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Select PDF File
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Drop your PDF file here or click to browse
                            </p>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileInput}
                              className="hidden"
                              id="pdf-file-input"
                            />
                            <label htmlFor="pdf-file-input">
                              <Button asChild className="cursor-pointer">
                                <span>Choose PDF File</span>
                              </Button>
                            </label>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            File Selected: {file.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <div className="flex justify-center space-x-4">
                            <Button 
                              onClick={handleConvert}
                              disabled={isConverting}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isConverting ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Converting...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Download className="w-4 h-4 mr-2" />
                                  Convert to Word
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
                  Why Choose Our PDF to Word Converter?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Advanced technology that preserves your document's original formatting and layout
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Perfect Formatting
                  </h3>
                  <p className="text-gray-600">
                    Maintains original layout, fonts, tables, and images exactly as in your PDF
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Editable Content
                  </h3>
                  <p className="text-gray-600">
                    Convert to fully editable Word documents that you can modify and share
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-600">
                    Convert your PDF files in seconds with our optimized conversion engine
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
                    Is the PDF to Word conversion free?
                  </h3>
                  <p className="text-gray-600">
                    Yes, our PDF to Word converter is completely free to use with no hidden charges or subscriptions required.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What file formats are supported?
                  </h3>
                  <p className="text-gray-600">
                    We convert PDF files to Microsoft Word format (.docx) which is compatible with all modern word processors.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Is my data secure during conversion?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely. All files are processed securely and automatically deleted after conversion. We never store or share your documents.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What's the maximum file size limit?
                  </h3>
                  <p className="text-gray-600">
                    You can convert PDF files up to 10MB in size. For larger files, please contact our support team.
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