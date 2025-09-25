import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Upload, Download, Save, MousePointer, Type, Image as ImageIcon, 
  Square, Circle, Minus, ArrowRight, Highlighter, Underline, 
  Strikethrough, PenTool, RotateCw, ZoomIn, ZoomOut, Bold, 
  Italic, Palette, Trash2, Move 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/header';

// PDF Editor Tool Types
type Tool = 'select' | 'text' | 'image' | 'highlight' | 'underline' | 'strikethrough' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'signature';

type PDFElement = {
  id: string;
  type: 'text' | 'image' | 'highlight' | 'underline' | 'strikethrough' | 'rectangle' | 'circle' | 'line' | 'arrow';
  x: number;
  y: number;
  width?: number;
  height?: number;
  page: number;
  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  // Image specific
  src?: string;
  // Shape specific
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
};

export default function PDFEditorNew() {
  const { toast } = useToast();
  
  // PDF Document State
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.2);
  
  // Tool and Editing State
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [elements, setElements] = useState<PDFElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Text Tool State
  const [textSettings, setTextSettings] = useState({
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000000',
    bold: false,
    italic: false
  });
  
  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up PDF.js worker
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }, []);

  // Handle file upload
  const handleFileUpload = async (uploadedFile: File) => {
    if (!uploadedFile.type.includes('pdf')) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setFile(uploadedFile);

    try {
      // Load PDF with PDF.js for rendering
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      setPdfDoc(pdfDocument);
      setTotalPages(pdfDocument.numPages);
      setCurrentPage(0);

      // Render first page
      await renderPage(pdfDocument, 0);

      toast({
        title: "PDF Loaded Successfully!",
        description: `Loaded PDF with ${pdfDocument.numPages} pages. Ready for editing.`,
      });

    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to load PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Render PDF page to canvas
  const renderPage = async (doc: any, pageIndex: number) => {
    if (!canvasRef.current || !doc) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const page = await doc.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: zoom });
      
      // Set canvas size
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
      
      await page.render(renderContext).promise;
      
      // Render elements for current page
      renderElements();
      
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  // Render elements overlay
  const renderElements = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get elements for current page
    const pageElements = elements.filter(el => el.page === currentPage);
    
    pageElements.forEach(element => {
      ctx.save();
      
      switch (element.type) {
        case 'text':
          ctx.fillStyle = element.color || '#000000';
          ctx.font = `${element.bold ? 'bold ' : ''}${element.italic ? 'italic ' : ''}${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
          ctx.fillText(element.text || '', element.x, element.y);
          
          // Draw selection box if selected
          if (selectedElement === element.id) {
            const textMetrics = ctx.measureText(element.text || '');
            ctx.strokeStyle = '#0066CC';
            ctx.lineWidth = 2;
            ctx.strokeRect(element.x - 2, element.y - (element.fontSize || 16) - 2, textMetrics.width + 4, (element.fontSize || 16) + 4);
          }
          break;
          
        case 'highlight':
          ctx.fillStyle = element.color || '#FFFF00';
          ctx.globalAlpha = 0.3;
          ctx.fillRect(element.x, element.y, element.width || 100, element.height || 20);
          break;
          
        case 'rectangle':
          ctx.strokeStyle = element.strokeColor || '#000000';
          ctx.lineWidth = element.strokeWidth || 2;
          if (element.fillColor && element.fillColor !== 'transparent') {
            ctx.fillStyle = element.fillColor;
            ctx.fillRect(element.x, element.y, element.width || 100, element.height || 100);
          }
          ctx.strokeRect(element.x, element.y, element.width || 100, element.height || 100);
          break;
          
        case 'circle':
          ctx.strokeStyle = element.strokeColor || '#000000';
          ctx.lineWidth = element.strokeWidth || 2;
          ctx.beginPath();
          ctx.ellipse(element.x + (element.width || 50) / 2, element.y + (element.height || 50) / 2, 
                     (element.width || 50) / 2, (element.height || 50) / 2, 0, 0, 2 * Math.PI);
          if (element.fillColor && element.fillColor !== 'transparent') {
            ctx.fillStyle = element.fillColor;
            ctx.fill();
          }
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    });
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Check if clicking on existing element
    const pageElements = elements.filter(el => el.page === currentPage);
    let clickedElement = null;
    
    for (const element of pageElements.reverse()) { // Check from top to bottom
      if (isPointInElement(x, y, element)) {
        clickedElement = element.id;
        break;
      }
    }
    
    if (clickedElement) {
      setSelectedElement(clickedElement);
      return;
    }
    
    // Add new element based on active tool
    if (activeTool === 'text') {
      addTextElement(x, y);
    } else if (activeTool === 'rectangle') {
      addShapeElement('rectangle', x, y);
    } else if (activeTool === 'circle') {
      addShapeElement('circle', x, y);
    } else if (activeTool === 'highlight') {
      addAnnotationElement('highlight', x, y);
    }
  };

  // Check if point is in element
  const isPointInElement = (x: number, y: number, element: PDFElement): boolean => {
    switch (element.type) {
      case 'text':
        // Simple bounding box for text
        return x >= element.x - 10 && x <= element.x + 100 && 
               y >= element.y - (element.fontSize || 16) && y <= element.y + 10;
      default:
        return x >= element.x && x <= element.x + (element.width || 100) &&
               y >= element.y && y <= element.y + (element.height || 100);
    }
  };

  // Add text element
  const addTextElement = (x: number, y: number) => {
    const newElement: PDFElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x,
      y,
      page: currentPage,
      text: 'Sample Text',
      fontSize: textSettings.fontSize,
      fontFamily: textSettings.fontFamily,
      color: textSettings.color,
      bold: textSettings.bold,
      italic: textSettings.italic
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    renderElements();
  };

  // Add shape element
  const addShapeElement = (type: 'rectangle' | 'circle', x: number, y: number) => {
    const newElement: PDFElement = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      width: 100,
      height: 100,
      page: currentPage,
      strokeColor: '#000000',
      fillColor: 'transparent',
      strokeWidth: 2
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    renderElements();
  };

  // Add annotation element
  const addAnnotationElement = (type: 'highlight' | 'underline' | 'strikethrough', x: number, y: number) => {
    const newElement: PDFElement = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      width: 100,
      height: 20,
      page: currentPage,
      color: type === 'highlight' ? '#FFFF00' : '#FF0000'
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    renderElements();
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    
    setElements(prev => prev.filter(el => el.id !== selectedElement));
    setSelectedElement(null);
    renderElements();
    
    toast({
      title: "Element Deleted",
      description: "Selected element has been removed.",
    });
  };

  // Navigate pages
  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages && pdfDoc) {
      setCurrentPage(pageIndex);
      setSelectedElement(null);
      renderPage(pdfDoc, pageIndex);
    }
  };

  // File drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.includes('pdf')) {
      handleFileUpload(droppedFile);
    }
  };

  return (
    <>
      <Helmet>
        <title>Free PDF Editor Online – Edit PDF Files Instantly with GinyWow</title>
        <meta
          name="description"
          content="Edit PDF files online for free with GinyWow PDF Editor. Add text, images, annotations, shapes, and signatures to your PDFs. Professional PDF editing tools similar to Sejda."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        {/* Floating Gradient Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-20 animate-float-delay-1"></div>
          <div className="absolute bottom-40 left-20 w-28 h-28 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-float-delay-2"></div>
          <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-float-delay-3"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Free PDF Editor Online
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Edit PDF files instantly with professional tools. Add text, images, annotations, shapes, and signatures to your PDFs.
            </p>
          </div>

          {!file ? (
            // Upload Section
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload your PDF file
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your PDF file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      Choose PDF File
                    </label>
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum file size: 100MB
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            // PDF Editor Interface
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Tools Panel */}
              <Card className="lg:col-span-1">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-4">Tools</h3>
                  
                  {/* Tool Selection */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button
                      variant={activeTool === 'select' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTool('select')}
                      className="flex items-center gap-2"
                    >
                      <MousePointer className="h-4 w-4" />
                      Select
                    </Button>
                    <Button
                      variant={activeTool === 'text' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTool('text')}
                      className="flex items-center gap-2"
                    >
                      <Type className="h-4 w-4" />
                      Text
                    </Button>
                    <Button
                      variant={activeTool === 'highlight' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTool('highlight')}
                      className="flex items-center gap-2"
                    >
                      <Highlighter className="h-4 w-4" />
                      Highlight
                    </Button>
                    <Button
                      variant={activeTool === 'rectangle' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTool('rectangle')}
                      className="flex items-center gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Rectangle
                    </Button>
                    <Button
                      variant={activeTool === 'circle' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTool('circle')}
                      className="flex items-center gap-2"
                    >
                      <Circle className="h-4 w-4" />
                      Circle
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  {/* Text Settings */}
                  {activeTool === 'text' && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Text Settings</h4>
                      
                      <div>
                        <Label htmlFor="font-size">Font Size</Label>
                        <Slider
                          value={[textSettings.fontSize]}
                          onValueChange={(value) => setTextSettings(prev => ({ ...prev, fontSize: value[0] }))}
                          max={72}
                          min={8}
                          step={1}
                          className="mt-2"
                        />
                        <span className="text-sm text-gray-500">{textSettings.fontSize}px</span>
                      </div>

                      <div>
                        <Label htmlFor="font-family">Font Family</Label>
                        <Select
                          value={textSettings.fontFamily}
                          onValueChange={(value) => setTextSettings(prev => ({ ...prev, fontFamily: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Courier">Courier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="text-color">Text Color</Label>
                        <input
                          type="color"
                          value={textSettings.color}
                          onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                          className="w-full h-10 rounded border mt-1"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={textSettings.bold ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTextSettings(prev => ({ ...prev, bold: !prev.bold }))}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={textSettings.italic ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTextSettings(prev => ({ ...prev, italic: !prev.italic }))}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  {/* Actions */}
                  <div className="space-y-2">
                    {selectedElement && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteSelectedElement}
                        className="w-full flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      className="w-full flex items-center gap-2"
                      onClick={() => {
                        toast({
                          title: "Save Feature",
                          description: "Save functionality will be implemented next.",
                        });
                      }}
                    >
                      <Save className="h-4 w-4" />
                      Save PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PDF Viewer */}
              <Card className="lg:col-span-3">
                <CardContent className="p-4">
                  {/* Page Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage + 1} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setZoom(prev => Math.max(0.5, prev - 0.1));
                          if (pdfDoc) renderPage(pdfDoc, currentPage);
                        }}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">{Math.round(zoom * 100)}%</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setZoom(prev => Math.min(3, prev + 0.1));
                          if (pdfDoc) renderPage(pdfDoc, currentPage);
                        }}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Canvas Container */}
                  <div 
                    ref={containerRef}
                    className="border rounded-lg overflow-auto bg-white shadow-inner"
                    style={{ maxHeight: '70vh' }}
                  >
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="cursor-crosshair block mx-auto"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}