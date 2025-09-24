import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2, RefreshCw } from "lucide-react";

export default function ImagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header currentPage="Image" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <ImageIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-testid="page-title">
            Image Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" data-testid="page-description">
            Professional image editing tools to transform your images. Remove backgrounds instantly and convert between formats effortlessly.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Remove Background Tool */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Remove Background</CardTitle>
                  <CardDescription className="text-gray-600">AI-powered background removal</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Remove image backgrounds instantly with professional AI technology. Perfect for product photos, portraits, and graphics.
              </p>
              <ul className="text-sm text-gray-500 mb-6 space-y-2">
                <li>✓ Instant AI-powered removal</li>
                <li>✓ High-quality results</li>
                <li>✓ Transparent PNG output</li>
                <li>✓ No manual selection needed</li>
              </ul>
              <Link href="/remove-background">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3" data-testid="remove-bg-button">
                  Remove Background
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Image Format Converter */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Format Converter</CardTitle>
                  <CardDescription className="text-gray-600">Convert between image formats</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Convert images between all popular formats. Support for JPG, PNG, WebP, GIF, BMP, TIFF, and more formats.
              </p>
              <ul className="text-sm text-gray-500 mb-6 space-y-2">
                <li>✓ 10+ supported formats</li>
                <li>✓ Batch conversion ready</li>
                <li>✓ Quality optimization</li>
                <li>✓ Lossless conversion options</li>
              </ul>
              <Link href="/image-converter">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3" data-testid="converter-button">
                  Convert Images
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Our Image Tools?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-600">Professional-grade image processing with maximum quality retention.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-gray-600">Lightning-fast image processing with instant results and downloads.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">Simple drag-and-drop interface with one-click processing.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}