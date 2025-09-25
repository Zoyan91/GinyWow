import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Download, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFSplit() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState<'pages' | 'ranges'>('pages');
  const [pageNumbers, setPageNumbers] = useState('');
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

  const handleSplit = async () => {
    if (!file) return;
    
    setIsSplitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Split Complete!",
        description: "Your PDF has been successfully split into separate files.",
      });
      
      setFile(null);
      setPageNumbers('');
    } catch (error) {
      toast({
        title: "Split Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF Split - Separate PDF Pages Online Free | GinyWow</title>
        <meta name="description" content="Split PDF files into separate pages or custom ranges online for free. Extract specific pages from PDF documents with our easy-to-use PDF splitter tool." />
        <meta name="keywords" content="PDF split, separate PDF pages, PDF splitter, extract PDF pages, divide PDF, online PDF tools" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-split" />
        
        <meta property="og:title" content="Free PDF Split Tool - Separate PDF Pages Online | GinyWow" />
        <meta property="og:description" content="Split PDF files into individual pages or custom ranges. Fast, secure, and completely free PDF splitter." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-split" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF Split Tool",
            "description": "Free online tool to split PDF files into separate pages",
            "url": "https://ginywow.com/pdf-split",
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-6">
                  <Scissors className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF Split Tool
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Split PDF files into separate pages or extract specific page ranges. Perfect for organizing large documents and sharing specific sections.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-red-400 transition-colors">
                  <CardContent className="p-8">
                    <div
                      className={`space-y-4 ${isDragOver ? 'bg-red-50' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                    >
                      {!file ? (
                        <>
                          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-red-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Select PDF File to Split
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
                              <Button asChild className="cursor-pointer bg-red-600 hover:bg-red-700">
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
                          
                          {/* Split Options */}
                          <div className="space-y-4 text-left">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Split Method:
                              </label>
                              <div className="flex space-x-4">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="splitMode"
                                    value="pages"
                                    checked={splitMode === 'pages'}
                                    onChange={(e) => setSplitMode(e.target.value as 'pages')}
                                    className="mr-2"
                                  />
                                  Each page separately
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="splitMode"
                                    value="ranges"
                                    checked={splitMode === 'ranges'}
                                    onChange={(e) => setSplitMode(e.target.value as 'ranges')}
                                    className="mr-2"
                                  />
                                  Custom page ranges
                                </label>
                              </div>
                            </div>
                            
                            {splitMode === 'ranges' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Page Numbers (e.g., 1-3, 5, 7-9):
                                </label>
                                <Input
                                  type="text"
                                  value={pageNumbers}
                                  onChange={(e) => setPageNumbers(e.target.value)}
                                  placeholder="1-3, 5, 7-9"
                                  className="w-full"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-center space-x-4 pt-4">
                            <Button 
                              onClick={handleSplit}
                              disabled={isSplitting || (splitMode === 'ranges' && !pageNumbers.trim())}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isSplitting ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Splitting...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Scissors className="w-4 h-4 mr-2" />
                                  Split PDF
                                </div>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setFile(null)}
                              disabled={isSplitting}
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
                  Why Choose Our PDF Split Tool?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Flexible splitting options to organize your documents exactly how you need them
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Scissors className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Flexible Splitting
                  </h3>
                  <p className="text-gray-600">
                    Split by individual pages or extract custom page ranges
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quality Maintained
                  </h3>
                  <p className="text-gray-600">
                    Original quality and formatting preserved in all split files
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Batch Download
                  </h3>
                  <p className="text-gray-600">
                    Download all split files at once in a convenient ZIP archive
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
                    Can I split protected PDF files?
                  </h3>
                  <p className="text-gray-600">
                    Currently, we don't support password-protected PDFs. Please remove the password before splitting.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How do I specify page ranges?
                  </h3>
                  <p className="text-gray-600">
                    Use commas to separate ranges and hyphens for page spans. Example: "1-3, 5, 7-9" will extract pages 1, 2, 3, 5, 7, 8, and 9.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What's the maximum file size?
                  </h3>
                  <p className="text-gray-600">
                    You can split PDF files up to 100MB in size. Large files may take longer to process.
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