import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  Upload, 
  Image as ImageIcon,
  Scissors,
  RotateCw,
  FlipHorizontal,
  Type,
  Circle,
  Disc,
  Palette,
  Grid3x3,
  Eraser,
  Download,
  FileImage,
  Maximize,
  Minimize,
  ScanText,
  FileType,
  Sparkles,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResizeTool from "@/components/image-tools/ResizeTool";
import CompressTool from "@/components/image-tools/CompressTool";
import ConvertTool from "@/components/image-tools/ConvertTool";

export default function ImageTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = "Free Online Image Tools – GinyWow";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Use free image tools like background removal, format conversion, resizing, OCR, and more. Fast, secure, no login required.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Use free image tools like background removal, format conversion, resizing, OCR, and more. Fast, secure, no login required.';
      document.head.appendChild(meta);
    }
  }, []);

  // Tool categories and their respective tools
  const toolCategories = [
    {
      category: "Basic Editing",
      tools: [
        {
          id: "resize",
          name: "Resize Image",
          description: "Change image dimensions while maintaining quality",
          icon: Maximize,
          color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
        },
        {
          id: "crop",
          name: "Crop Image", 
          description: "Cut out specific parts of your image",
          icon: Scissors,
          color: "bg-green-50 border-green-200 hover:bg-green-100"
        },
        {
          id: "rotate",
          name: "Rotate & Flip",
          description: "Rotate or flip your images in any direction",
          icon: RotateCw,
          color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
        },
        {
          id: "compress",
          name: "Compress Image",
          description: "Reduce file size while maintaining quality",
          icon: Minimize,
          color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
        }
      ]
    },
    {
      category: "Format & Convert",
      tools: [
        {
          id: "convert",
          name: "Convert Formats",
          description: "Convert between PNG, JPG, WebP, SVG, GIF, HEIC, PDF",
          icon: FileType,
          color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
        },
        {
          id: "remove-bg",
          name: "Remove Background",
          description: "Remove background from images automatically",
          icon: Eraser,
          color: "bg-red-50 border-red-200 hover:bg-red-100"
        }
      ]
    },
    {
      category: "Advanced Effects",
      tools: [
        {
          id: "upscale",
          name: "Upscale Image",
          description: "Increase image resolution using AI",
          icon: Sparkles,
          color: "bg-pink-50 border-pink-200 hover:bg-pink-100"
        },
        {
          id: "blur",
          name: "Blur & Effects",
          description: "Apply blur, sharpen, or pixelate effects",
          icon: Disc,
          color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100"
        },
        {
          id: "colorize",
          name: "Colorize & Background",
          description: "Change colors or replace backgrounds",
          icon: Palette,
          color: "bg-teal-50 border-teal-200 hover:bg-teal-100"
        }
      ]
    },
    {
      category: "Text & Shapes",
      tools: [
        {
          id: "add-text",
          name: "Add Text",
          description: "Add custom text overlays to your images",
          icon: Type,
          color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
        },
        {
          id: "ocr",
          name: "Image to Text (OCR)",
          description: "Extract text from images automatically",
          icon: ScanText,
          color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
        },
        {
          id: "circular",
          name: "Make Circular",
          description: "Create round or circular images",
          icon: Circle,
          color: "bg-violet-50 border-violet-200 hover:bg-violet-100"
        }
      ]
    },
    {
      category: "Creative Tools",
      tools: [
        {
          id: "collage",
          name: "Collage Maker",
          description: "Combine multiple images into a collage",
          icon: Grid3x3,
          color: "bg-rose-50 border-rose-200 hover:bg-rose-100"
        },
        {
          id: "remove-watermark",
          name: "Remove Watermark",
          description: "Remove watermarks and unwanted objects",
          icon: Layers,
          color: "bg-gray-50 border-gray-200 hover:bg-gray-100"
        }
      ]
    }
  ];

  const allTools = toolCategories.flatMap(cat => cat.tools);

  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      <Header currentPage="Image Tools" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Image Tools
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional image editing tools at your fingertips. Edit, convert, and enhance your images for free - no registration required.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`${tool.color} border-2 transition-all duration-200 cursor-pointer h-full`}
                        onClick={() => setSelectedTool(tool.id)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <tool.icon className="h-8 w-8 text-gray-700" />
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {tool.name}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm text-gray-600 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full" variant="outline" data-testid={`tool-${tool.id}`}>
                        Open Tool
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {toolCategories.map((category, index) => (
            <TabsContent 
              key={category.category.toLowerCase().replace(/\s+/g, '-')} 
              value={["basic", "format", "advanced", "text", "creative"][index]}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.tools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className={`${tool.color} border-2 transition-all duration-200 cursor-pointer h-full`}
                          onClick={() => setSelectedTool(tool.id)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <tool.icon className="h-8 w-8 text-gray-700" />
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {tool.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm text-gray-600 leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button className="w-full" variant="outline" data-testid={`tool-${tool.id}`}>
                          Open Tool
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* SEO Content Sections */}
        <div className="mt-16 space-y-12">
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Why Choose GinyWow Image Tools?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">100% Free</h3>
                <p className="text-gray-600">All tools are completely free to use with no hidden costs or limitations.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No Registration</h3>
                <p className="text-gray-600">Start using our tools immediately without creating an account or signing up.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast & Secure</h3>
                <p className="text-gray-600">Lightning-fast processing with secure handling. Your images are never stored permanently.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Mobile Friendly</h3>
                <p className="text-gray-600">All tools work perfectly on desktop, tablet, and mobile devices.</p>
              </div>
            </div>
          </motion.section>

          {/* How It Works */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-semibold text-lg mb-2">Upload Your Image</h3>
                <p className="text-gray-600">Select and upload your image from your device. We support all common formats.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-semibold text-lg mb-2">Choose Your Tool</h3>
                <p className="text-gray-600">Select from our comprehensive collection of image editing and processing tools.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-semibold text-lg mb-2">Download Result</h3>
                <p className="text-gray-600">Get your processed image instantly and download it to your device.</p>
              </div>
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">Are all image tools completely free?</h3>
                <p className="text-gray-600 mb-6">Yes, all our image tools are 100% free to use with no limitations, watermarks, or hidden costs.</p>
                
                <h3 className="font-semibold text-lg mb-3">Do I need to create an account?</h3>
                <p className="text-gray-600 mb-6">No registration required! You can use all tools immediately without creating an account.</p>
                
                <h3 className="font-semibold text-lg mb-3">What file formats are supported?</h3>
                <p className="text-gray-600">We support all major formats: PNG, JPG, WebP, SVG, GIF, HEIC, and PDF conversions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Are my images stored on your servers?</h3>
                <p className="text-gray-600 mb-6">No, your images are processed securely and deleted immediately after processing. We don't store any files.</p>
                
                <h3 className="font-semibold text-lg mb-3">Is there a file size limit?</h3>
                <p className="text-gray-600 mb-6">Yes, we support files up to 20MB to ensure fast processing and optimal performance.</p>
                
                <h3 className="font-semibold text-lg mb-3">Can I use these tools for commercial purposes?</h3>
                <p className="text-gray-600">Absolutely! All processed images can be used for both personal and commercial projects.</p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Tool Editor Modal */}
        {selectedTool && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              // Close modal when clicking on backdrop
              if (e.target === e.currentTarget) {
                setSelectedTool(null);
              }
            }}
          >
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-auto relative">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {allTools.find(t => t.id === selectedTool)?.name}
                </h2>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Close button clicked');
                    setSelectedTool(null);
                  }}
                  data-testid="close-tool-modal"
                  type="button"
                >
                  Close
                </Button>
              </div>
              <div className="p-4">
                {selectedTool === 'resize' && <ResizeTool />}
                {selectedTool === 'compress' && <CompressTool />}
                {selectedTool === 'convert' && <ConvertTool />}
                {!['resize', 'compress', 'convert'].includes(selectedTool) && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      {allTools.find(t => t.id === selectedTool)?.name} tool is coming soon!
                    </p>
                    <p className="text-sm text-gray-500">
                      This tool is currently under development and will be available soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}