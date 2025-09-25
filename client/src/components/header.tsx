import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Menu, Search } from "lucide-react";
import { Link, useLocation } from "wouter";

// Preload pages on hover for instant navigation
const preloadPage = (path: string) => {
  if (path === "/") return;
  if (path === "/thumbnail-downloader") {
    import("@/pages/thumbnail-downloader");
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
  const [, setLocation] = useLocation();


  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // TinyWow-style navigation items
  const navItems = [
    { href: "/", label: "App Opener", testId: "nav-app-opener" },
    { href: "/thumbnail-downloader", label: "Thumbnail Downloader", testId: "nav-thumbnail-downloader" },
    { href: "/format-converter", label: "Format Converter", testId: "nav-converter" },
  ];

  const allNavItems = navItems;

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = e.currentTarget.value.toLowerCase().trim();
      if (!searchTerm) return;
      
      // Simple search logic - redirect to matching pages
      if (searchTerm.includes('app') || searchTerm.includes('opener')) {
        setLocation('/');
      } else if (searchTerm.includes('thumbnail') || searchTerm.includes('download')) {
        setLocation('/thumbnail-downloader');
      } else if (searchTerm.includes('format') || searchTerm.includes('convert')) {
        setLocation('/format-converter');
      }
      
      // Clear the input after search
      e.currentTarget.value = '';
    }
  };

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
          </nav>
          
          {/* Right Actions - TinyWow Style */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 h-9 w-64 text-sm"
                data-testid="search-input"
                onKeyPress={handleSearchKeyPress}
              />
            </div>
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
                    {/* Navigation Items */}
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
                  {/* Navigation Items */}
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
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}