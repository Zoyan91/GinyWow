import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "wouter";

// Preload critical pages for instant navigation
const Home = lazy(() => import("@/pages/home"));
const ThumbnailDownloader = lazy(() => import("@/pages/thumbnail-downloader"));
const FormatConverterPage = lazy(() => import("@/pages/format-converter"));

// PDF Tools Pages
const PDFToWord = lazy(() => import("@/pages/pdf-to-word"));
const PDFToExcel = lazy(() => import("@/pages/pdf-to-excel"));
const PDFMerge = lazy(() => import("@/pages/pdf-merge"));
const PDFSplit = lazy(() => import("@/pages/pdf-split"));
const PDFCompress = lazy(() => import("@/pages/pdf-compress"));
const PDFToImage = lazy(() => import("@/pages/pdf-to-image"));
const WordToPDF = lazy(() => import("@/pages/word-to-pdf"));
const PDFUnlock = lazy(() => import("@/pages/pdf-unlock"));
const PDFWatermark = lazy(() => import("@/pages/pdf-watermark"));

// Preload secondary pages
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Blog = lazy(() => import("@/pages/blog"));
const Privacy = lazy(() => import("@/pages/privacy"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Removed aggressive preloading for faster initial load (sub-2-second target)
// Pages now load on-demand for optimal initial performance

// Fast skeleton loader for instant visual feedback
function PageLoader() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="h-16 bg-gray-50 animate-pulse border-b border-gray-200" />
      
      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse mx-auto w-2/3" />
          <div className="h-4 bg-gray-100 rounded animate-pulse mx-auto w-1/2" />
        </div>
        <div className="h-64 bg-gray-50 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

// Scroll to top component for instant navigation
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Instantly scroll to top when route changes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/blog" component={Blog} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/thumbnail-downloader" component={ThumbnailDownloader} />
          <Route path="/format-converter" component={FormatConverterPage} />
          
          {/* PDF Tools Routes */}
          <Route path="/pdf-to-word" component={PDFToWord} />
          <Route path="/pdf-to-excel" component={PDFToExcel} />
          <Route path="/pdf-merge" component={PDFMerge} />
          <Route path="/pdf-split" component={PDFSplit} />
          <Route path="/pdf-compress" component={PDFCompress} />
          <Route path="/pdf-to-image" component={PDFToImage} />
          <Route path="/word-to-pdf" component={WordToPDF} />
          <Route path="/pdf-unlock" component={PDFUnlock} />
          <Route path="/pdf-watermark" component={PDFWatermark} />
          
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
