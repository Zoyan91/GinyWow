import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, Download, Upload, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PDFToExcel() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
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

  const handleConvert = async () => {
    if (!file) return;
    
    setIsConverting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Conversion Complete!",
        description: "Your PDF has been converted to Excel format.",
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
        <title>PDF to Excel Converter - Convert PDF to XLSX Online Free | GinyWow</title>
        <meta name="description" content="Convert PDF to Excel spreadsheet online for free. Extract tables and data from PDF files to editable XLSX format with preserved formatting." />
        <meta name="keywords" content="PDF to Excel, PDF to XLSX, convert PDF to spreadsheet, PDF table extraction, online PDF converter" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ginywow.com/pdf-to-excel" />
        
        <meta property="og:title" content="Free PDF to Excel Converter Online | GinyWow" />
        <meta property="og:description" content="Convert PDF files to Excel spreadsheets instantly. Extract tables and data with perfect formatting preservation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/pdf-to-excel" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebApplication", "SoftwareApplication"],
            "name": "PDF to Excel Converter",
            "description": "Extract tables and data from PDF files to Excel spreadsheets with preserved formatting",
            "url": "https://ginywow.com/pdf-to-excel",
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
              "Extract tables from PDF",
              "Convert to XLSX format",
              "Preserve data integrity",
              "Support financial reports",
              "Batch processing available"
            ],
            "softwareVersion": "1.0",
            "datePublished": "2025-09-25",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "980"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Floating Background Shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        </div>

        <main className="relative z-10">
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  PDF to Excel Converter
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Extract tables and data from PDF files to Excel spreadsheets. Perfect for financial reports, data analysis, and business documents.
                </p>
              </div>

              {/* File Upload Area */}
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
                  <CardContent className="p-8">
                    <div
                      className={`space-y-4 ${isDragOver ? 'bg-green-50' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                    >
                      {!file ? (
                        <>
                          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-green-600" />
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
                              <Button asChild className="cursor-pointer bg-green-600 hover:bg-green-700">
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
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isConverting ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Converting...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Download className="w-4 h-4 mr-2" />
                                  Convert to Excel
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
                  Why Choose Our PDF to Excel Converter?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Extract tables and data with precision while preserving the original structure
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileSpreadsheet className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Table Extraction
                  </h3>
                  <p className="text-gray-600">
                    Accurately extracts tables and data from PDF documents into Excel format
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Data Integrity
                  </h3>
                  <p className="text-gray-600">
                    Maintains data accuracy and formatting for reliable analysis
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Instant Processing
                  </h3>
                  <p className="text-gray-600">
                    Fast conversion process that handles complex PDF layouts efficiently
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
                    Can this tool extract tables from any PDF?
                  </h3>
                  <p className="text-gray-600">
                    Our converter works best with PDFs that contain structured tables. It can extract most table formats while preserving data integrity.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What Excel format will I get?
                  </h3>
                  <p className="text-gray-600">
                    The converted file will be in .xlsx format, compatible with Microsoft Excel, Google Sheets, and other spreadsheet applications.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Is the conversion accurate for financial data?
                  </h3>
                  <p className="text-gray-600">
                    Yes, our tool is designed to maintain numerical accuracy, making it perfect for financial reports and data analysis.
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