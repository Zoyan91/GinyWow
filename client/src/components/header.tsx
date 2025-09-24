import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, useLocation } from "wouter";

// Preload pages on hover for instant navigation
const preloadPage = (path: string) => {
  if (path === "/") return;
  if (path === "/thumbnail-downloader") {
    import("@/pages/thumbnail-downloader");
  } else if (path === "/format-converter") {
    import("@/pages/format-converter");
  } else if (path === "/contact") {
    import("@/pages/contact");
  } else if (path === "/video-downloader") {
    import("@/pages/video-downloader");
  } else if (path === "/about") {
    import("@/pages/about");
  }
};

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const allNavItems = [
    { href: "/", label: "URL Opener", testId: "nav-url-opener" },
    { href: "/thumbnail-downloader", label: "Download Thumbnail", testId: "nav-thumbnail-downloader" },
    { href: "/format-converter", label: "Format Converter", testId: "nav-format-converter" },
    { href: "/video-downloader", label: "Video Downloader", testId: "nav-video-downloader" },
    { href: "/contact", label: "Contact Us", testId: "nav-contact" },
  ];

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 relative z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 cursor-pointer hover:opacity-80 transition-opacity" data-testid="logo">
                <span className="text-gray-900">Giny</span><span className="text-blue-600">Wow</span>
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {/* All Navigation Items */}
            {allNavItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <button 
                  className={`flex items-center transition-colors font-medium text-sm xl:text-base px-3 py-2 rounded-md ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  data-testid={item.testId}
                  onMouseEnter={() => preloadPage(item.href)}
                  onFocus={() => preloadPage(item.href)}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>
          
          {/* Empty right section */}
          <div className="hidden lg:flex items-center">
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100"
                  data-testid="mobile-menu-button"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <div className="flex flex-col h-full">
                  <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Navigate between different sections of the website</SheetDescription>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 space-y-2 mt-6">
                    {/* All Navigation Items */}
                    {allNavItems.map((item) => (
                      <Link href={item.href} key={item.href}>
                        <button 
                          className={`w-full text-left p-4 rounded-lg font-medium text-base transition-colors ${
                            isActive(item.href)
                              ? "text-blue-600 bg-blue-50 border border-blue-200"
                              : "text-gray-700 hover:bg-gray-50 border border-transparent"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          onTouchStart={() => preloadPage(item.href)}
                          onFocus={() => preloadPage(item.href)}
                          data-testid={`mobile-${item.testId}`}
                        >
                          {item.label}
                        </button>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Tablet Menu (md breakpoint) */}
          <div className="hidden md:flex lg:hidden items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100"
                  data-testid="tablet-menu-button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetTitle className="sr-only">Tablet Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Navigate between different sections of the website</SheetDescription>
                <nav className="space-y-3 mt-6">
                  {/* All Navigation Items */}
                  {allNavItems.map((item) => (
                    <Link href={item.href} key={item.href}>
                      <button 
                        className={`w-full text-left p-3 rounded-lg font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        onTouchStart={() => preloadPage(item.href)}
                        onFocus={() => preloadPage(item.href)}
                      >
                        {item.label}
                      </button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}