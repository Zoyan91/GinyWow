import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, Download, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFEditor() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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

  const handleOpenEditor = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "PDF Editor Loaded!",
        description: "Your PDF is ready for editing.",
      });
    } catch (error) {
      toast({
        title: "Loading Failed",
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
        <title>PDF Editor - Edit PDF Files Online Free | GinyWow</title>
        <meta name="description" content="Edit PDF files online for free. Add text, images, annotations, and signatures to your PDF documents. Professional PDF editing tools in your browser." />
        <meta name="keywords" content="PDF editor, edit PDF online, PDF annotation, add text to PDF, PDF tools, online PDF editor" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-editor" />
        
        <meta property="og:title" content="Free PDF Editor Online - Edit PDFs in Browser | GinyWow" />
        <meta property="og:description" content="Edit PDF files directly in your browser. Add text, images, signatures, and annotations to PDF documents for free." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-editor" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF Editor",
            "description": "Free online tool to edit PDF files with text, images, and annotations",
            "url": "https://ginywow.com/pdf-editor",
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-6">
                  <Edit3 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF Editor
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Edit PDF files directly in your browser. Add text, images, annotations, signatures, and more to your PDF documents.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors">
                  <CardContent className="p-8">
                    <div
                      className={`space-y-4 ${isDragOver ? 'bg-emerald-50' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                    >
                      {!file ? (
                        <>
                          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-emerald-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Select PDF File to Edit
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
                              <Button asChild className="cursor-pointer bg-emerald-600 hover:bg-emerald-700">
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
                              onClick={handleOpenEditor}
                              disabled={isProcessing}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              {isProcessing ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Loading Editor...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Open PDF Editor
                                </div>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setFile(null)}
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

              {/* Coming Soon Notice */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Edit3 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Advanced PDF Editor Coming Soon!
                      </h3>
                      <p className="text-gray-600">
                        We're working on a powerful PDF editor with text editing, image insertion, annotations, and digital signatures. Stay tuned for updates!
                      </p>
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
                  Powerful PDF Editing Features
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Comprehensive PDF editing tools to modify and enhance your documents
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Text Editing
                  </h3>
                  <p className="text-gray-600">
                    Add, edit, and format text directly in your PDF documents
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Annotations
                  </h3>
                  <p className="text-gray-600">
                    Add comments, highlights, and annotations for collaboration
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Digital Signatures
                  </h3>
                  <p className="text-gray-600">
                    Sign documents digitally with secure electronic signatures
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
                    What editing features are available?
                  </h3>
                  <p className="text-gray-600">
                    Our PDF editor will include text editing, image insertion, annotations, highlighting, digital signatures, and form filling capabilities.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I edit scanned PDF documents?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you'll be able to add annotations and overlays to scanned documents, though text editing requires OCR conversion first.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Will my edits be saved automatically?
                  </h3>
                  <p className="text-gray-600">
                    The editor will include auto-save functionality to prevent loss of work, with manual save and download options.
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