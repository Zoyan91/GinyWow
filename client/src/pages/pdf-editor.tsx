import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, Upload, CheckCircle, Download, ArrowRight, Type, Image as ImageIcon, Save, Undo, Redo, Trash2, Move } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Lazy load footer for better initial performance
const Footer = lazy(() => import("@/components/footer"));

export default function PDFEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editMode, setEditMode] = useState<'text' | 'image' | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);
  const [textElements, setTextElements] = useState<Record<number, Array<{id: string, text: string, x: number, y: number, size: number}>>>({});
  const [imageElements, setImageElements] = useState<Record<number, Array<{id: string, src: string, x: number, y: number, width: number, height: number}>>>({});
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [pdfPages, setPdfPages] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Enable scroll animations
  useScrollAnimation();

  // Set up PDF.js worker
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }, []);

  // Newsletter subscription functionality
  const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState<{
      type: 'idle' | 'success' | 'error';
      message: string;
    }>({ type: 'idle', message: '' });

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !email.includes('@')) {
        setSubscriptionStatus({
          type: 'error',
          message: 'Please enter a valid email address'
        });
        return;
      }

      setIsSubscribing(true);
      setSubscriptionStatus({ type: 'idle', message: '' });

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSubscriptionStatus({
            type: 'success',
            message: data.message || 'Successfully subscribed to newsletter!'
          });
          setEmail('');
        } else {
          setSubscriptionStatus({
            type: 'error',
            message: data.error || 'Failed to subscribe. Please try again.'
          });
        }
      } catch (error) {
        setSubscriptionStatus({
          type: 'error',
          message: 'Network error. Please check your connection and try again.'
        });
      } finally {
        setIsSubscribing(false);
      }
    };

    return (
      <section className="relative py-8 sm:py-12 lg:py-16 mt-12 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-blue-200 rounded-full opacity-10 blur-2xl sm:blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-indigo-200 rounded-full opacity-10 blur-2xl sm:blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container-mobile max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              <span className="mr-2">📧</span>
              Newsletter
            </div>
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Subscribe for Our Latest Updates
            </h2>
            <p className="hidden sm:block text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed px-4">
              Get the latest PDF tools, tips, and tutorials delivered to your inbox. Join thousands of creators who trust us.
            </p>
          </div>

          <div className="max-w-md mx-auto px-4">
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-mobile w-full bg-white shadow-sm placeholder-gray-500"
                    disabled={isSubscribing}
                    data-testid="newsletter-email-input"
                  />
                  {subscriptionStatus.type === 'success' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className={`btn-mobile w-full shadow-md hover:shadow-lg ${
                    isSubscribing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  data-testid="subscribe-now-btn"
                >
                  {isSubscribing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Subscribing...
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </div>
              
              {subscriptionStatus.message && (
                <div className={`text-center text-sm mt-3 font-medium ${
                  subscriptionStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {subscriptionStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    );
  };

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

  // Load PDF for editing
  const handleOpenEditor = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDocument = await PDFDocument.load(arrayBuffer);
      
      setPdfDoc(pdfDocument);
      setTotalPages(pdfDocument.getPageCount());
      setCurrentPage(0);
      setShowEditor(true);
      
      // Render first page
      setTimeout(() => renderPage(pdfDocument, 0), 100);
      
      toast({
        title: "PDF Editor Loaded!",
        description: "Your PDF is ready for editing. Click to add text or images.",
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: "Loading Failed",
        description: "Please try again with a valid PDF file.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Render PDF page to canvas
  const renderPage = async (doc: PDFDocument, pageIndex: number) => {
    if (!canvasRef.current || !file) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Load PDF with PDF.js for actual rendering
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      // Get the specific page
      const page = await pdfDocument.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: 1.2 });
      
      // Set canvas size to match PDF page
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Render the PDF page
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        canvas: canvas
      };
      
      // Render PDF content first
      await page.render(renderContext).promise;
      
      // Then render editing overlays on top
      setTimeout(() => renderEditingOverlays(), 100);
      
    } catch (error) {
      console.error('Error rendering PDF page:', error);
      
      // Fallback rendering with better error display
      canvas.width = 600;
      canvas.height = 800;
      canvas.style.width = '600px';
      canvas.style.height = '800px';
      
      ctx.fillStyle = '#f9f9f9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#333';
      ctx.font = '18px Arial';
      ctx.fillText('PDF Rendering Error', 50, 50);
      ctx.font = '14px Arial';
      ctx.fillText(`Page ${pageIndex + 1} of ${doc.getPageCount()}`, 50, 80);
      ctx.fillText('Please try uploading the PDF again', 50, 110);
      
      // Still render overlays in fallback mode
      renderEditingOverlays();
    }
  };

  // Render editing overlays (text and images) for current page only
  const renderEditingOverlays = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get elements for current page only
    const pageTextElements = textElements[currentPage] || [];
    const pageImageElements = imageElements[currentPage] || [];

    // Render text elements for current page
    pageTextElements.forEach(element => {
      ctx.fillStyle = selectedElement === element.id ? 'rgba(0, 0, 255, 0.8)' : 'black';
      ctx.font = `${element.size}px Arial`;
      ctx.fillText(element.text, element.x, element.y);
      
      // Draw selection box if selected
      if (selectedElement === element.id) {
        const textMetrics = ctx.measureText(element.text);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(element.x - 2, element.y - element.size - 2, textMetrics.width + 4, element.size + 4);
      }
    });

    // Render image elements for current page
    pageImageElements.forEach(element => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, element.x, element.y, element.width, element.height);
        
        // Draw selection box if selected
        if (selectedElement === element.id) {
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 2;
          ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);
        }
      };
      img.src = element.src;
    });
  };

  // Add text element to current page
  const addTextToPDF = async () => {
    if (!textInput.trim()) return;
    
    try {
      const newTextElement = {
        id: `text-${Date.now()}`,
        text: textInput,
        x: textPosition.x,
        y: textPosition.y,
        size: 16
      };
      
      setTextElements(prev => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newTextElement]
      }));
      setTextInput('');
      setIsTextInputVisible(false);
      setEditMode(null);
      setSelectedElement(newTextElement.id);
      
      // Re-render page with new text
      if (pdfDoc) renderPage(pdfDoc, currentPage);
      
      toast({
        title: "Text Added!",
        description: "Text has been added to the PDF. Click to select and edit.",
      });
      
    } catch (error) {
      console.error('Error adding text:', error);
      toast({
        title: "Error",
        description: "Failed to add text to PDF.",
        variant: "destructive",
      });
    }
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    
    if (selectedElement.startsWith('text-')) {
      setTextElements(prev => ({
        ...prev,
        [currentPage]: (prev[currentPage] || []).filter(el => el.id !== selectedElement)
      }));
    } else if (selectedElement.startsWith('image-')) {
      setImageElements(prev => ({
        ...prev,
        [currentPage]: (prev[currentPage] || []).filter(el => el.id !== selectedElement)
      }));
    }
    
    setSelectedElement(null);
    if (pdfDoc) renderPage(pdfDoc, currentPage);
    
    toast({
      title: "Element Deleted!",
      description: "Selected element has been removed.",
    });
  };

  // Handle canvas click for text editing and element selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on existing elements
    let clickedElement = null;
    
    // Check text elements for current page
    const pageTextElements = textElements[currentPage] || [];
    pageTextElements.forEach(element => {
      if (x >= element.x - 10 && x <= element.x + 100 && 
          y >= element.y - element.size && y <= element.y + 10) {
        clickedElement = element.id;
      }
    });
    
    // Check image elements for current page
    const pageImageElements = imageElements[currentPage] || [];
    pageImageElements.forEach(element => {
      if (x >= element.x && x <= element.x + element.width &&
          y >= element.y && y <= element.y + element.height) {
        clickedElement = element.id;
      }
    });
    
    if (clickedElement) {
      setSelectedElement(clickedElement);
      setEditMode(null);
      if (pdfDoc) renderPage(pdfDoc, currentPage);
    } else if (editMode === 'text') {
      setTextPosition({ x, y });
      setIsTextInputVisible(true);
      setSelectedElement(null);
    } else {
      setSelectedElement(null);
      if (pdfDoc) renderPage(pdfDoc, currentPage);
    }
  };

  // Add image element to current page
  const addImageToPDF = async (imageFile: File) => {
    try {
      // Create image URL for preview
      const imageUrl = URL.createObjectURL(imageFile);
      
      const newImageElement = {
        id: `image-${Date.now()}`,
        src: imageUrl,
        x: 100,
        y: 100,
        width: 150,
        height: 100
      };
      
      setImageElements(prev => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), newImageElement]
      }));
      setSelectedElement(newImageElement.id);
      setEditMode(null);
      
      // Re-render page with new image
      if (pdfDoc) renderPage(pdfDoc, currentPage);
      
      toast({
        title: "Image Added!",
        description: "Image has been added to the PDF. Click to select and move.",
      });
      
    } catch (error) {
      console.error('Error adding image:', error);
      toast({
        title: "Error",
        description: "Failed to add image to PDF.",
        variant: "destructive",
      });
    }
  };

  // Save PDF with all editing changes applied
  const savePDF = async () => {
    if (!pdfDoc || !file) return;
    
    try {
      // Create a fresh copy of the PDF to apply changes
      const originalArrayBuffer = await file.arrayBuffer();
      const workingDoc = await PDFDocument.load(originalArrayBuffer);
      const pages = workingDoc.getPages();
      
      // Apply elements to ALL pages, not just current page
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const page = pages[pageIndex];
        const pageTextElements = textElements[pageIndex] || [];
        const pageImageElements = imageElements[pageIndex] || [];
        
        // Apply text elements for this page
        pageTextElements.forEach(element => {
          page.drawText(element.text, {
            x: element.x,
            y: page.getHeight() - element.y, // PDF coordinates are from bottom-left
            size: element.size,
            color: rgb(0, 0, 0),
          });
        });
        
        // Apply image elements for this page
        for (const element of pageImageElements) {
          try {
            // Convert image URL back to blob
            const response = await fetch(element.src);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            
            let image;
            if (blob.type === 'image/png') {
              image = await workingDoc.embedPng(arrayBuffer);
            } else if (blob.type === 'image/jpeg') {
              image = await workingDoc.embedJpg(arrayBuffer);
            }
            
            if (image) {
              page.drawImage(image, {
                x: element.x,
                y: page.getHeight() - element.y - element.height,
                width: element.width,
                height: element.height,
              });
            }
          } catch (imgError) {
            console.error('Error processing image:', imgError);
          }
        }
      }
      
      // Save the modified PDF
      const pdfBytes = await workingDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file?.name || 'document.pdf'}`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "PDF Saved!",
        description: "Your edited PDF has been downloaded with all changes applied.",
      });
      
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: "Error",
        description: "Failed to save PDF. Please try again.",
        variant: "destructive",
      });
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

      <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
        <Header currentPage="pdf-editor" />

        {/* Hero Section - Mobile First */}
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">
          {/* Floating Shapes - TinyWow Style - Hero Section Only - Hidden on Mobile */}
          <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
            {/* Triangle Top Left - Pink */}
            <div 
              className="absolute top-16 left-12 w-6 h-6 animate-float-1"
              style={{
                background: '#f472b6',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(15deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Circle Top Right - Blue */}
            <div 
              className="absolute top-20 right-20 w-5 h-5 rounded-full animate-float-2"
              style={{
                background: '#60a5fa',
                opacity: 0.45
              }}
            ></div>

            {/* Square Top Center - Orange */}
            <div 
              className="absolute top-24 left-1/3 w-4 h-4 animate-float-3"
              style={{
                background: '#fb923c',
                transform: 'rotate(45deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Dot Top Right Corner - Purple */}
            <div 
              className="absolute top-8 right-8 w-3 h-3 rounded-full animate-float-4"
              style={{
                background: '#c084fc',
                opacity: 0.5
              }}
            ></div>

            {/* Triangle Center Left - Green */}
            <div 
              className="absolute top-40 left-8 w-5 h-5 animate-float-5"
              style={{
                background: '#34d399',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(-30deg)',
                opacity: 0.45
              }}
            ></div>

            {/* Circle Center Right - Yellow */}
            <div 
              className="absolute top-36 right-16 w-4 h-4 rounded-full animate-float-6"
              style={{
                background: '#fbbf24',
                opacity: 0.4
              }}
            ></div>

            {/* Square Center - Cyan */}
            <div 
              className="absolute top-48 left-1/2 w-5 h-5 animate-float-1"
              style={{
                background: '#22d3ee',
                transform: 'rotate(30deg)',
                opacity: 0.45
              }}
            ></div>

            {/* Dot Center Left - Rose */}
            <div 
              className="absolute top-52 left-16 w-3 h-3 rounded-full animate-float-2"
              style={{
                background: '#fb7185',
                opacity: 0.5
              }}
            ></div>

            {/* Triangle Bottom Left - Indigo */}
            <div 
              className="absolute bottom-32 left-10 w-6 h-6 animate-float-3"
              style={{
                background: '#818cf8',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(60deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Circle Bottom Right - Emerald */}
            <div 
              className="absolute bottom-28 right-12 w-4 h-4 rounded-full animate-float-4"
              style={{
                background: '#10b981',
                opacity: 0.45
              }}
            ></div>

            {/* Square Bottom Center - Amber */}
            <div 
              className="absolute bottom-24 left-1/3 w-5 h-5 animate-float-5"
              style={{
                background: '#f59e0b',
                transform: 'rotate(15deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Dot Bottom Right - Violet */}
            <div 
              className="absolute bottom-20 right-8 w-3 h-3 rounded-full animate-float-6"
              style={{
                background: '#8b5cf6',
                opacity: 0.5
              }}
            ></div>

            {/* Additional Shapes for More Coverage */}
            {/* Triangle Mid Left - Teal */}
            <div 
              className="absolute top-60 left-6 w-4 h-4 animate-float-1"
              style={{
                background: '#14b8a6',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'rotate(45deg)',
                opacity: 0.4
              }}
            ></div>

            {/* Circle Mid Right - Lime */}
            <div 
              className="absolute top-64 right-6 w-4 h-4 rounded-full animate-float-2"
              style={{
                background: '#84cc16',
                opacity: 0.45
              }}
            ></div>

            {/* Dot Top Center - Sky */}
            <div 
              className="absolute top-12 left-1/2 w-3 h-3 rounded-full animate-float-3"
              style={{
                background: '#0ea5e9',
                opacity: 0.45
              }}
            ></div>

            {/* Square Mid Center - Fuchsia */}
            <div 
              className="absolute left-1/2 w-4 h-4 animate-float-4"
              style={{
                background: '#d946ef',
                transform: 'rotate(60deg)',
                opacity: 0.4,
                top: '17rem'
              }}
            ></div>

            {/* Additional dots scattered */}
            <div className="absolute top-28 left-20 w-2 h-2 rounded-full animate-float-5" style={{ background: '#f472b6', opacity: 0.45 }}></div>
            <div className="absolute top-44 right-24 w-2 h-2 rounded-full animate-float-6" style={{ background: '#60a5fa', opacity: 0.4 }}></div>
            <div className="absolute bottom-40 left-24 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.5 }}></div>
            <div className="absolute bottom-36 right-20 w-2 h-2 rounded-full animate-float-2" style={{ background: '#34d399', opacity: 0.45 }}></div>
            <div className="absolute top-56 left-1/4 w-2 h-2 rounded-full animate-float-3" style={{ background: '#fbbf24', opacity: 0.4 }}></div>
            <div className="absolute bottom-44 right-1/4 w-2 h-2 rounded-full animate-float-4" style={{ background: '#c084fc', opacity: 0.45 }}></div>

          </div>

          <div className="relative z-10 container-mobile max-w-4xl">
            <div className="text-center animate-fade-in">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
                {/* Mobile Version */}
                <span className="block sm:hidden whitespace-pre-line">
                  {"Free PDF Editor Online – Edit PDF\nFiles Instantly with GinyWow"}
                </span>
                {/* Desktop/Tablet Version */}
                <span className="hidden sm:block whitespace-pre-line">
                  {"Free PDF Editor Online – Edit PDF Files\nInstantly with GinyWow"}
                </span>
              </h1>
              
              <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
                Edit PDF files directly in your browser. Add text, images, annotations, signatures, and more to your PDF documents.
              </p>

              {/* PDF Upload Area */}
              <div className="max-w-2xl mx-auto mb-8 px-4">
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                    isDragOver 
                      ? 'border-emerald-400 bg-emerald-50' 
                      : file 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 bg-white hover:border-emerald-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                >
                  {!file ? (
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Select PDF File to Edit
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Drop your PDF file here or click to browse (up to 100MB)
                      </p>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInput}
                        className="hidden"
                        id="pdf-file-input"
                        data-testid="pdf-file-input"
                      />
                      <label htmlFor="pdf-file-input">
                        <Button asChild className="cursor-pointer bg-emerald-600 hover:bg-emerald-700" data-testid="choose-pdf-button">
                          <span>Choose PDF File</span>
                        </Button>
                      </label>
                    </div>
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
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <Button 
                          onClick={handleOpenEditor}
                          disabled={isProcessing}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          data-testid="open-editor-button"
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
                          data-testid="choose-different-file-button"
                        >
                          Choose Different File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Editor Interface */}
        {showEditor && pdfDoc && (
          <section className="py-8 bg-gray-50">
            <div className="container-mobile max-w-6xl">
              {/* Editor Toolbar */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">PDF Editor</h3>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={editMode === 'text' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditMode(editMode === 'text' ? null : 'text')}
                      data-testid="text-tool-button"
                    >
                      <Type className="w-4 h-4 mr-2" />
                      Add Text
                    </Button>
                    
                    <label htmlFor="image-upload">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="cursor-pointer"
                        data-testid="image-tool-button"
                      >
                        <span>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Add Image
                        </span>
                      </Button>
                    </label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) addImageToPDF(file);
                      }}
                      data-testid="image-file-input"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-600">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 0}
                      onClick={() => {
                        if (currentPage > 0) {
                          setCurrentPage(currentPage - 1);
                          renderPage(pdfDoc, currentPage - 1);
                        }
                      }}
                      data-testid="prev-page-button"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => {
                        if (currentPage < totalPages - 1) {
                          setCurrentPage(currentPage + 1);
                          renderPage(pdfDoc, currentPage + 1);
                        }
                      }}
                      data-testid="next-page-button"
                    >
                      Next
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={savePDF}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      data-testid="save-pdf-button"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save PDF
                    </Button>
                  </div>
                </div>
              </div>

              {/* PDF Canvas Container */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="relative">
                  {editMode === 'text' && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">
                        Text Mode Active: Click anywhere on the PDF to add text
                      </p>
                    </div>
                  )}
                  
                  <div className="relative inline-block border border-gray-200 bg-white">
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className={`max-w-full h-auto ${editMode === 'text' ? 'cursor-crosshair' : 'cursor-default'}`}
                      style={{ maxHeight: '600px' }}
                      data-testid="pdf-canvas"
                    />
                    
                    {/* Text Input Overlay */}
                    {isTextInputVisible && (
                      <div
                        className="absolute bg-white border border-gray-300 rounded p-2 shadow-lg z-10"
                        style={{
                          left: textPosition.x,
                          top: textPosition.y,
                          transform: 'translate(-50%, -100%)'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Enter text..."
                            className="text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addTextToPDF();
                              } else if (e.key === 'Escape') {
                                setIsTextInputVisible(false);
                                setTextInput('');
                              }
                            }}
                            data-testid="text-input-overlay"
                          />
                          <Button
                            size="sm"
                            onClick={addTextToPDF}
                            disabled={!textInput.trim()}
                            data-testid="add-text-button"
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsTextInputVisible(false);
                              setTextInput('');
                            }}
                            data-testid="cancel-text-button"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Editor Instructions */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">How to use the PDF Editor:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click "Add Text" button, then click anywhere on the PDF to add text</li>
                  <li>• Click "Add Image" to upload and insert images into your PDF</li>
                  <li>• Use Previous/Next buttons to navigate between pages</li>
                  <li>• Click "Save PDF" to download your edited document</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* PDF Editor Information Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container-mobile max-w-4xl">
            <div className="prose prose-lg max-w-none">
              
              {/* What is GinyWow PDF Editor */}
              <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  What is GinyWow PDF Editor?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  GinyWow PDF Editor is a free, online tool that lets you <strong>edit PDF files quickly and easily</strong>. You can modify text, images, and other content in your PDFs without downloading any software. It's designed for students, professionals, and anyone who needs to make changes to PDF documents online.
                </p>
              </div>

              {/* Why Use GinyWow PDF Editor */}
              <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Why Use GinyWow PDF Editor?
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    <span><strong>Free & Online:</strong> Edit PDFs without paying or installing software.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    <span><strong>Simple Interface:</strong> Easy to use for beginners and professionals alike.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    <span><strong>Edit Content Directly:</strong> Change text, images, or formatting inside your PDF.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    <span><strong>Secure:</strong> Your files are processed safely and not stored permanently.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    <span><strong>Instant Editing:</strong> Make changes quickly and download your edited PDF immediately.</span>
                  </li>
                </ul>
              </div>

              {/* How to Edit PDFs */}
              <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  How to Edit PDFs with GinyWow
                </h2>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">1</span>
                    <span>Upload your PDF file to GinyWow PDF Editor.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">2</span>
                    <span>Edit the text, images, or content as needed.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">3</span>
                    <span>Preview the changes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">4</span>
                    <span>Download your edited PDF instantly.</span>
                  </li>
                </ol>
              </div>

              {/* Who Can Benefit */}
              <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Who Can Benefit from GinyWow PDF Editor?
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    <span><strong>Students:</strong> Correct mistakes, update assignments, or modify notes.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    <span><strong>Professionals:</strong> Edit reports, contracts, or presentations easily.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
                    <span><strong>Everyone:</strong> Save time by editing PDF files online anytime, anywhere.</span>
                  </li>
                </ul>
              </div>

              {/* Why Choose GinyWow */}
              <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Why Choose GinyWow PDF Editor?
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  GinyWow PDF Editor makes PDF editing simple, fast, and reliable. No software installation, no complicated processes—just upload your PDF, make changes, and download. Perfect for anyone who wants a hassle-free PDF editing experience.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <Suspense fallback={<div className="h-48 bg-gray-50"></div>}>
          <NewsletterSection />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={<div className="h-24 bg-gray-100"></div>}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
}