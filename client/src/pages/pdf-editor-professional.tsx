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
  Italic, Palette, Trash2, Move, Edit3, CheckCircle, ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/header';

// Professional PDF Editor Types
type Tool = 'select' | 'text' | 'image' | 'highlight' | 'underline' | 'strikethrough' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'signature' | 'whiteout';

interface PDFElement {
  id: string;
  type: Tool;
  x: number;
  y: number;
  width?: number;
  height?: number;
  page: number;
  
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  
  // Image properties
  src?: string;
  
  // Shape properties
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  
  // Line/Arrow properties
  endX?: number;
  endY?: number;
}

interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ProfessionalPDFEditor() {
  const { toast } = useToast();
  
  // PDF Document State
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.2);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // Tool and Editing State
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [elements, setElements] = useState<PDFElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingTextValue, setEditingTextValue] = useState('');
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Text Tool State
  const [textSettings, setTextSettings] = useState({
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000000',
    bold: false,
    italic: false
  });
  
  // Shape Tool State
  const [shapeSettings, setShapeSettings] = useState({
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2
  });
  
  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

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
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDocument = await loadingTask.promise;
      
      setPdfDoc(pdfDocument);
      setTotalPages(pdfDocument.numPages);
      setCurrentPage(0);
      setElements([]);
      setSelectedElement(null);

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

  // Render PDF page
  const renderPage = async (doc: any, pageIndex: number) => {
    if (!canvasRef.current || !doc) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const page = await doc.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: zoom });
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      
      setCanvasSize({ width: viewport.width, height: viewport.height });
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        canvas: canvas
      };
      
      await page.render(renderContext).promise;
      
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  // Get element bounds for hit testing
  const getElementBounds = (element: PDFElement): ElementBounds => {
    switch (element.type) {
      case 'text':
        // Estimate text bounds - in real implementation, measure text
        const textWidth = (element.text?.length || 0) * (element.fontSize || 16) * 0.6;
        return {
          x: element.x,
          y: element.y - (element.fontSize || 16),
          width: textWidth,
          height: element.fontSize || 16
        };
      default:
        return {
          x: element.x,
          y: element.y,
          width: element.width || 100,
          height: element.height || 50
        };
    }
  };

  // Check if point is in element
  const isPointInElement = (x: number, y: number, element: PDFElement): boolean => {
    const bounds = getElementBounds(element);
    return x >= bounds.x && x <= bounds.x + bounds.width &&
           y >= bounds.y && y <= bounds.y + bounds.height;
  };

  // Handle canvas interaction
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Check if clicking on existing element
    const pageElements = elements.filter(el => el.page === currentPage);
    let clickedElement = null;
    
    for (const element of pageElements.reverse()) {
      if (isPointInElement(x, y, element)) {
        clickedElement = element.id;
        break;
      }
    }
    
    if (clickedElement) {
      setSelectedElement(clickedElement);
      if (activeTool === 'select') {
        // Start dragging
        setIsDragging(true);
        setDragStart({ x, y });
        const element = elements.find(el => el.id === clickedElement)!;
        setDragOffset({ x: x - element.x, y: y - element.y });
      }
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
    } else if (activeTool === 'underline') {
      addAnnotationElement('underline', x, y);
    } else if (activeTool === 'strikethrough') {
      addAnnotationElement('strikethrough', x, y);
    }
  };

  // Handle mouse move for dragging
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Update element position
    setElements(prev => prev.map(el => 
      el.id === selectedElement 
        ? { ...el, x: x - dragOffset.x, y: y - dragOffset.y }
        : el
    ));
  };

  // Handle mouse up
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  // Add text element
  const addTextElement = (x: number, y: number) => {
    const newElement: PDFElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x,
      y,
      page: currentPage,
      text: 'Click to edit text',
      fontSize: textSettings.fontSize,
      fontFamily: textSettings.fontFamily,
      color: textSettings.color,
      bold: textSettings.bold,
      italic: textSettings.italic
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    
    // Start editing immediately
    setIsEditingText(true);
    setEditingTextValue(newElement.text || '');
    setTimeout(() => textInputRef.current?.focus(), 0);
  };

  // Add shape element
  const addShapeElement = (type: 'rectangle' | 'circle', x: number, y: number) => {
    const newElement: PDFElement = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      width: 100,
      height: 80,
      page: currentPage,
      strokeColor: shapeSettings.strokeColor,
      fillColor: shapeSettings.fillColor,
      strokeWidth: shapeSettings.strokeWidth
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  // Add annotation element
  const addAnnotationElement = (type: 'highlight' | 'underline' | 'strikethrough', x: number, y: number) => {
    const newElement: PDFElement = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      width: 120,
      height: type === 'highlight' ? 20 : 3,
      page: currentPage,
      color: type === 'highlight' ? '#FFFF00' : '#FF0000'
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  // Update text content
  const updateTextContent = () => {
    if (!selectedElement || !isEditingText) return;
    
    setElements(prev => prev.map(el => 
      el.id === selectedElement 
        ? { ...el, text: editingTextValue }
        : el
    ));
    
    setIsEditingText(false);
    setEditingTextValue('');
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    
    setElements(prev => prev.filter(el => el.id !== selectedElement));
    setSelectedElement(null);
    
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

  // Zoom functions
  const zoomIn = () => {
    const newZoom = Math.min(3, zoom + 0.2);
    setZoom(newZoom);
    if (pdfDoc) renderPage(pdfDoc, currentPage);
  };

  const zoomOut = () => {
    const newZoom = Math.max(0.5, zoom - 0.2);
    setZoom(newZoom);
    if (pdfDoc) renderPage(pdfDoc, currentPage);
  };

  // Save PDF with changes
  const savePDF = async () => {
    if (!file) {
      toast({
        title: "No PDF loaded",
        description: "Please upload a PDF first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workingDoc = await PDFDocument.load(arrayBuffer);
      const pages = workingDoc.getPages();

      // Apply elements to all pages
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const page = pages[pageIndex];
        const pageElements = elements.filter(el => el.page === pageIndex);

        for (const element of pageElements) {
          switch (element.type) {
            case 'text':
              page.drawText(element.text || '', {
                x: element.x,
                y: page.getHeight() - element.y,
                size: element.fontSize || 16,
                color: rgb(
                  parseInt(element.color?.slice(1, 3) || '00', 16) / 255,
                  parseInt(element.color?.slice(3, 5) || '00', 16) / 255,
                  parseInt(element.color?.slice(5, 7) || '00', 16) / 255
                ),
              });
              break;
            case 'rectangle':
              page.drawRectangle({
                x: element.x,
                y: page.getHeight() - element.y - (element.height || 0),
                width: element.width || 100,
                height: element.height || 80,
                borderColor: rgb(0, 0, 0),
                borderWidth: element.strokeWidth || 2,
              });
              break;
            // Add more element types as needed
          }
        }
      }

      const pdfBytes = await workingDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file.name}`;
      link.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Saved!",
        description: "Your edited PDF has been downloaded.",
      });

    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: "Error",
        description: "Failed to save PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get page elements
  const getCurrentPageElements = () => {
    return elements.filter(el => el.page === currentPage);
  };

  // File drop handlers
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
        <title>Professional PDF Editor Online – Edit PDFs Like Sejda with GinyWow</title>
        <meta
          name="description"
          content="Professional PDF editor with advanced tools. Add text, annotations, shapes, and signatures to your PDFs. Full-featured online PDF editing similar to Sejda."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {!file ? (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Professional PDF Editor
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Edit PDF files with professional tools. Add text, annotations, shapes, and more.
              </p>
            </div>

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
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col h-screen">
            {/* Professional Toolbar */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                {/* Tool Groups */}
                <div className="flex items-center space-x-6">
                  {/* Selection Tools */}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={activeTool === 'select' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('select')}
                      className="flex items-center gap-1"
                    >
                      <MousePointer className="h-4 w-4" />
                      Select
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* Text Tools */}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={activeTool === 'text' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('text')}
                      className="flex items-center gap-1"
                    >
                      <Type className="h-4 w-4" />
                      Text
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* Annotation Tools */}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={activeTool === 'highlight' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('highlight')}
                      className="flex items-center gap-1"
                    >
                      <Highlighter className="h-4 w-4" />
                      Highlight
                    </Button>
                    <Button
                      variant={activeTool === 'underline' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('underline')}
                      className="flex items-center gap-1"
                    >
                      <Underline className="h-4 w-4" />
                      Underline
                    </Button>
                    <Button
                      variant={activeTool === 'strikethrough' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('strikethrough')}
                      className="flex items-center gap-1"
                    >
                      <Strikethrough className="h-4 w-4" />
                      Strike
                    </Button>
                  </div>

                  <Separator orientation="vertical" className="h-6" />

                  {/* Shape Tools */}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={activeTool === 'rectangle' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('rectangle')}
                      className="flex items-center gap-1"
                    >
                      <Square className="h-4 w-4" />
                      Rectangle
                    </Button>
                    <Button
                      variant={activeTool === 'circle' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTool('circle')}
                      className="flex items-center gap-1"
                    >
                      <Circle className="h-4 w-4" />
                      Circle
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {selectedElement && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteSelectedElement}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={savePDF}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Saving...' : 'Download PDF'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex">
              {/* Properties Panel */}
              {(activeTool === 'text' || selectedElement) && (
                <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                  <h3 className="font-semibold text-lg mb-4">Properties</h3>
                  
                  {activeTool === 'text' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Font Size</Label>
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
                        <Label>Font Family</Label>
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
                        <Label>Color</Label>
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
                </div>
              )}

              {/* PDF Viewer */}
              <div className="flex-1 flex flex-col bg-gray-100">
                {/* Page Controls */}
                <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium">
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
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={zoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button variant="outline" size="sm" onClick={zoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="flex justify-center">
                    <div className="relative bg-white shadow-lg">
                      <canvas
                        ref={canvasRef}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        className="block"
                        style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
                      />
                      
                      {/* Overlay for elements */}
                      <div
                        ref={overlayRef}
                        className="absolute inset-0 pointer-events-none"
                        style={{ 
                          width: canvasSize.width, 
                          height: canvasSize.height 
                        }}
                      >
                        {getCurrentPageElements().map(element => (
                          <div
                            key={element.id}
                            className={`absolute pointer-events-auto ${
                              selectedElement === element.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            style={{
                              left: element.x,
                              top: element.y,
                              width: element.width || 'auto',
                              height: element.height || 'auto',
                              color: element.color,
                              fontSize: element.fontSize,
                              fontFamily: element.fontFamily,
                              fontWeight: element.bold ? 'bold' : 'normal',
                              fontStyle: element.italic ? 'italic' : 'normal',
                              backgroundColor: element.type === 'highlight' ? element.color : 'transparent',
                              borderBottom: element.type === 'underline' ? `2px solid ${element.color}` : 'none',
                              textDecoration: element.type === 'strikethrough' ? 'line-through' : 'none',
                              border: element.type === 'rectangle' ? `${element.strokeWidth}px solid ${element.strokeColor}` : 'none',
                              borderRadius: element.type === 'circle' ? '50%' : '0',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement(element.id);
                              if (element.type === 'text' && activeTool === 'select') {
                                setIsEditingText(true);
                                setEditingTextValue(element.text || '');
                                setTimeout(() => textInputRef.current?.focus(), 0);
                              }
                            }}
                          >
                            {element.type === 'text' && (
                              isEditingText && selectedElement === element.id ? (
                                <input
                                  ref={textInputRef}
                                  value={editingTextValue}
                                  onChange={(e) => setEditingTextValue(e.target.value)}
                                  onBlur={updateTextContent}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      updateTextContent();
                                    }
                                    if (e.key === 'Escape') {
                                      setIsEditingText(false);
                                      setEditingTextValue('');
                                    }
                                  }}
                                  className="bg-transparent border-none outline-none"
                                  style={{
                                    fontSize: element.fontSize,
                                    fontFamily: element.fontFamily,
                                    fontWeight: element.bold ? 'bold' : 'normal',
                                    fontStyle: element.italic ? 'italic' : 'normal',
                                    color: element.color,
                                  }}
                                />
                              ) : (
                                element.text
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}