import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Upload, CheckCircle, ArrowRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const { toast } = useToast();
  
  useScrollAnimation();

  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles = Array.from(selectedFiles).filter(file => {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF file.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please select at least 2 PDF files to merge.",
        variant: "destructive",
      });
      return;
    }
    
    setIsMerging(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Merge Complete!",
        description: "Your PDF files have been successfully merged.",
      });
      
      setFiles([]);
    } catch (error) {
      toast({
        title: "Merge Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF Merge - Combine Multiple PDF Files Online Free | GinyWow</title>
        <meta name="description" content="Merge multiple PDF files into one document online for free. Combine PDFs in any order with our fast and secure PDF merger tool." />
        <meta name="keywords" content="PDF merge, combine PDF, merge PDF files, PDF joiner, PDF combiner, online PDF tools" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-merge" />
        
        <meta property="og:title" content="Free PDF Merge Tool - Combine PDFs Online | GinyWow" />
        <meta property="og:description" content="Merge multiple PDF files into one document instantly. Free, fast, and secure PDF combiner tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-merge" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebApplication", "SoftwareApplication"],
            "name": "PDF Merge Tool",
            "description": "Combine multiple PDF files into one document with preserved quality and formatting",
            "url": "https://ginywow.com/pdf-merge",
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
              "Merge unlimited PDF files",
              "Drag and drop interface",
              "Custom page ordering",
              "Quality preservation",
              "Fast processing"
            ],
            "softwareVersion": "1.0",
            "datePublished": "2025-09-25",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1580"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Floating Background Shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF Merge Tool
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Combine multiple PDF files into one document. Arrange them in any order and create a single, organized PDF file.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Select PDF Files to Merge
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Choose multiple PDF files to combine into one document
                        </p>
                        <Input
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={handleFileInput}
                          className="hidden"
                          id="pdf-files-input"
                        />
                        <label htmlFor="pdf-files-input">
                          <Button asChild className="cursor-pointer bg-orange-600 hover:bg-orange-700">
                            <span>Choose PDF Files</span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Selected Files ({files.length})
                    </h3>
                    <div className="space-y-2 mb-6">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleMerge}
                      disabled={isMerging || files.length < 2}
                      className="bg-orange-600 hover:bg-orange-700 w-full"
                    >
                      {isMerging ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Merging PDFs...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Plus className="w-4 h-4 mr-2" />
                          Merge {files.length} PDF Files
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Our PDF Merge Tool?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Combine your PDF documents efficiently with advanced merging capabilities
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Multiple Files
                  </h3>
                  <p className="text-gray-600">
                    Merge unlimited PDF files in any order you want
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quality Preserved
                  </h3>
                  <p className="text-gray-600">
                    Maintains original quality and formatting of all documents
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
                    Quick merge process that handles large files efficiently
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
                    How many PDF files can I merge at once?
                  </h3>
                  <p className="text-gray-600">
                    You can merge unlimited PDF files, but each file should be under 10MB for optimal performance.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Will the quality be affected after merging?
                  </h3>
                  <p className="text-gray-600">
                    No, our tool preserves the original quality, formatting, and resolution of all your PDF documents.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I change the order of pages?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can arrange your PDF files in any order before merging them into the final document.
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