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

// Preload secondary pages
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Blog = lazy(() => import("@/pages/blog"));
const Privacy = lazy(() => import("@/pages/privacy"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Preload critical pages on app start for instant navigation
setTimeout(() => {
  import("@/pages/home");
  import("@/pages/thumbnail-downloader");
  import("@/pages/format-converter");
}, 100);

// Invisible loading component for instant navigation
function PageLoader() {
  return null; // No visible loading state for instant feel
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
