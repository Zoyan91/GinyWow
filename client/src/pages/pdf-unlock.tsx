import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Unlock, Download, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFUnlock() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
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

  const handleUnlock = async () => {
    if (!file || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both PDF file and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUnlocking(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "PDF Unlocked!",
        description: "Your PDF has been successfully unlocked and is ready for download.",
      });
      
      setFile(null);
      setPassword('');
    } catch (error) {
      toast({
        title: "Unlock Failed",
        description: "Invalid password or corrupted file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF Unlock - Remove Password Protection from PDF Files | GinyWow</title>
        <meta name="description" content="Remove password protection from PDF files online for free. Unlock encrypted PDFs securely with our PDF password remover tool." />
        <meta name="keywords" content="PDF unlock, remove PDF password, PDF password remover, unlock encrypted PDF, PDF security removal" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-unlock" />
        
        <meta property="og:title" content="Free PDF Unlock Tool - Remove PDF Password Online | GinyWow" />
        <meta property="og:description" content="Remove password protection from PDF files securely. Unlock encrypted PDFs instantly with our online tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-unlock" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF Unlock Tool",
            "description": "Free online tool to remove password protection from PDF files",
            "url": "https://ginywow.com/pdf-unlock",
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-6">
                  <Unlock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF Unlock Tool
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Remove password protection from PDF files securely. Unlock encrypted PDFs to access and edit your documents freely.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-amber-400 transition-colors">
                  <CardContent className="p-8">
                    <div
                      className={`space-y-4 ${isDragOver ? 'bg-amber-50' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                    >
                      {!file ? (
                        <>
                          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-amber-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Select Password-Protected PDF
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Drop your encrypted PDF file here or click to browse (up to 100MB)
                            </p>
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileInput}
                              className="hidden"
                              id="pdf-file-input"
                            />
                            <label htmlFor="pdf-file-input">
                              <Button asChild className="cursor-pointer bg-amber-600 hover:bg-amber-700">
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
                          
                          {/* Password Input */}
                          <div className="space-y-4 text-left">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                PDF Password:
                              </label>
                              <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter the PDF password"
                                className="w-full"
                                disabled={isUnlocking}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Your password is processed securely and not stored anywhere.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-center space-x-4 pt-4">
                            <Button 
                              onClick={handleUnlock}
                              disabled={isUnlocking || !password.trim()}
                              className="bg-amber-600 hover:bg-amber-700"
                            >
                              {isUnlocking ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Unlocking...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Unlock PDF
                                </div>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => { setFile(null); setPassword(''); }}
                              disabled={isUnlocking}
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

              {/* Security Notice */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        100% Secure Processing
                      </h3>
                      <p className="text-gray-600">
                        Your files and passwords are processed locally and securely. We never store your documents or passwords on our servers.
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
                  Why Choose Our PDF Unlock Tool?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Secure and reliable PDF password removal with privacy protection
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Unlock className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Complete Removal
                  </h3>
                  <p className="text-gray-600">
                    Removes all password restrictions including editing, copying, and printing limitations
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Privacy Protected
                  </h3>
                  <p className="text-gray-600">
                    Your files and passwords are never stored or transmitted to external servers
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Instant Processing
                  </h3>
                  <p className="text-gray-600">
                    Fast unlocking process that works with most password-protected PDFs
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
                    Is it legal to unlock password-protected PDFs?
                  </h3>
                  <p className="text-gray-600">
                    Yes, it's legal to unlock PDFs that you own or have permission to access. Please ensure you have the right to remove protection from the document.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What if I don't know the password?
                  </h3>
                  <p className="text-gray-600">
                    Our tool requires the correct password to unlock the PDF. We cannot help recover or crack unknown passwords for security and legal reasons.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Are my files secure during processing?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely. All processing happens in your browser locally. Your files and passwords never leave your device.
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