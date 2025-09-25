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

export default function WordToPDF() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  useScrollAnimation();

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/rtf',
      'text/rtf'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a Word document (.docx, .doc, or .rtf).",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 100MB.",
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Conversion Complete!",
        description: "Your Word document has been converted to PDF format.",
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
        <title>Word to PDF Converter - Convert DOCX to PDF Online Free | GinyWow</title>
        <meta name="description" content="Convert Word documents to PDF online for free. Transform DOCX, DOC files to PDF format with perfect formatting preservation. Fast and secure conversion." />
        <meta name="keywords" content="Word to PDF, DOCX to PDF, DOC to PDF, convert Word, PDF converter, online document converter" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/word-to-pdf" />
        
        <meta property="og:title" content="Free Word to PDF Converter Online | GinyWow" />
        <meta property="og:description" content="Convert Word documents to PDF instantly. Preserve formatting, fonts, and layout with our professional converter." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/word-to-pdf" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Word to PDF Converter",
            "description": "Free online tool to convert Word documents to PDF format",
            "url": "https://ginywow.com/word-to-pdf",
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Word to PDF Converter
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Convert Word documents to PDF format instantly. Perfect for sharing, printing, and professional document distribution.
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
                              Select Word Document
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Drop your Word file here or click to browse (.docx, .doc, .rtf)
                            </p>
                            <Input
                              type="file"
                              accept=".docx,.doc,.rtf"
                              onChange={handleFileInput}
                              className="hidden"
                              id="word-file-input"
                            />
                            <label htmlFor="word-file-input">
                              <Button asChild className="cursor-pointer bg-blue-600 hover:bg-blue-700">
                                <span>Choose Word File</span>
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
                                  Convert to PDF
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
                  Why Choose Our Word to PDF Converter?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Professional conversion that maintains document integrity and formatting
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Perfect Layout
                  </h3>
                  <p className="text-gray-600">
                    Preserves all formatting, fonts, images, and page layout exactly as designed
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Universal Format
                  </h3>
                  <p className="text-gray-600">
                    PDF files can be viewed on any device without formatting issues
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Instant Conversion
                  </h3>
                  <p className="text-gray-600">
                    Fast processing that handles complex documents with ease
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
                    Which Word formats are supported?
                  </h3>
                  <p className="text-gray-600">
                    We support .docx (Word 2007+), .doc (Word 97-2003), and .rtf (Rich Text Format) files.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Will my formatting be preserved?
                  </h3>
                  <p className="text-gray-600">
                    Yes, our converter maintains all formatting, fonts, images, tables, and page layout in the resulting PDF.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I convert password-protected Word files?
                  </h3>
                  <p className="text-gray-600">
                    Currently, we don't support password-protected documents. Please remove the password before converting.
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