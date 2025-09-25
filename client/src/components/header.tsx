import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Search, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";

// Preload pages on hover for instant navigation
const preloadPage = (path: string) => {
  if (path === "/") return;
  if (path === "/thumbnail-downloader") {
    import("@/pages/thumbnail-downloader");
  } else if (path === "/thumbnail-optimizer") {
    import("@/pages/thumbnail-optimizer");
  } else if (path === "/format-converter") {
    import("@/pages/format-converter");
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
  const [isThumbnailDropdownOpen, setIsThumbnailDropdownOpen] = useState(false);


  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // TinyWow-style navigation items
  const navItems = [
    { href: "/", label: "App Opener", testId: "nav-app-opener" },
    { href: "/format-converter", label: "Format Converter", testId: "nav-converter" },
  ];

  // Thumbnail dropdown items
  const thumbnailDropdownItems = [
    { href: "/thumbnail-downloader", label: "Thumbnail Downloader", testId: "nav-thumbnail-downloader" },
    { href: "/thumbnail-optimizer", label: "Thumbnail Optimizer", testId: "nav-thumbnail-optimizer" },
  ];

  const allNavItems = navItems;

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 relative z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {/* G Icon - TinyWow Style */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-full flex items-center justify-center" data-testid="logo-icon">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              {/* Text Logo */}
              <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors" data-testid="logo-text">
                Giny<span className="text-blue-600">Wow</span>
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation - TinyWow Style */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <button 
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  data-testid={item.testId}
                  onMouseEnter={() => preloadPage(item.href)}
                  onFocus={() => preloadPage(item.href)}
                >
                  {item.label}
                </button>
              </Link>
            ))}
            
            {/* Thumbnail Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsThumbnailDropdownOpen(true)}
              onMouseLeave={() => setIsThumbnailDropdownOpen(false)}
            >
              <button 
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg flex items-center space-x-1 ${
                  thumbnailDropdownItems.some(item => isActive(item.href))
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                data-testid="nav-thumbnail-dropdown"
              >
                <span>Thumbnail</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isThumbnailDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isThumbnailDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {thumbnailDropdownItems.map((item) => (
                    <Link href={item.href} key={item.href}>
                      <button 
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          isActive(item.href)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700"
                        }`}
                        data-testid={item.testId}
                        onMouseEnter={() => preloadPage(item.href)}
                        onFocus={() => preloadPage(item.href)}
                      >
                        {item.label}
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          
          {/* Right Actions - TinyWow Style */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" data-testid="search-button">
              <Search className="h-4 w-4" />
            </Button>
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
                    {/* Regular Navigation Items */}
                    {navItems.map((item) => (
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
                    
                    {/* Thumbnail Category */}
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-500 px-4 py-2">
                        Thumbnail
                      </div>
                      {thumbnailDropdownItems.map((item) => (
                        <Link href={item.href} key={item.href}>
                          <button 
                            className={`w-full text-left p-4 pl-8 rounded-lg font-medium text-base transition-colors ${
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
                    </div>
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
                  {/* Regular Navigation Items */}
                  {navItems.map((item) => (
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
                        data-testid={`tablet-${item.testId}`}
                      >
                        {item.label}
                      </button>
                    </Link>
                  ))}
                  
                  {/* Thumbnail Category */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-500 px-3 py-1">
                      Thumbnail
                    </div>
                    {thumbnailDropdownItems.map((item) => (
                      <Link href={item.href} key={item.href}>
                        <button 
                          className={`w-full text-left p-3 pl-6 rounded-lg font-medium transition-colors ${
                            isActive(item.href)
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          onTouchStart={() => preloadPage(item.href)}
                          onFocus={() => preloadPage(item.href)}
                          data-testid={`tablet-${item.testId}`}
                        >
                          {item.label}
                        </button>
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}