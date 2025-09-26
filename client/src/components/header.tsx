import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Menu, Search, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";

// Preload pages on hover for instant navigation
const preloadPage = (path: string) => {
  if (path === "/") return;
  if (path === "/thumbnail-downloader") {
    import("@/pages/thumbnail-downloader");
  } else if (path === "/format-converter") {
    import("@/pages/format-converter");
  } else if (path === "/image-resizer") {
    import("@/pages/image-resizer");
  } else if (path === "/image-compressor") {
    import("@/pages/image-compressor");
  } else if (path === "/word-counter") {
    import("@/pages/word-counter");
  } else if (path === "/qr-code-generator") {
    import("@/pages/qr-code-generator");
  } else if (path === "/password-generator") {
    import("@/pages/password-generator");
  } else if (path === "/case-converter") {
    import("@/pages/case-converter");
  } else if (path === "/unit-converter") {
    import("@/pages/unit-converter");
  } else if (path === "/age-calculator") {
    import("@/pages/age-calculator");
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
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [isUtilityDropdownOpen, setIsUtilityDropdownOpen] = useState(false);
  const [, setLocation] = useLocation();


  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const isImageToolActive = () => {
    return location.startsWith("/format-converter") || 
           location.startsWith("/image-resizer") || 
           location.startsWith("/image-compressor");
  };

  const isUtilityToolActive = () => {
    return location.startsWith("/word-counter") || 
           location.startsWith("/qr-code-generator") || 
           location.startsWith("/password-generator") ||
           location.startsWith("/case-converter") ||
           location.startsWith("/unit-converter") ||
           location.startsWith("/age-calculator");
  };

  // TinyWow-style navigation items
  const navItems = [
    { href: "/", label: "App Opener", testId: "nav-app-opener" },
    { href: "/thumbnail-downloader", label: "Thumbnail Downloader", testId: "nav-thumbnail-downloader" },
  ];

  // Image tools dropdown items
  const imageTools = [
    { href: "/format-converter", label: "Format Converter", testId: "nav-format-converter" },
    { href: "/image-resizer", label: "Image Resizer", testId: "nav-image-resizer" },
    { href: "/image-compressor", label: "Image Compressor", testId: "nav-image-compressor" },
  ];

  // Utility tools dropdown items
  const utilityTools = [
    { href: "/word-counter", label: "Word Counter", testId: "nav-word-counter" },
    { href: "/qr-code-generator", label: "QR Code Generator", testId: "nav-qr-code-generator" },
    { href: "/password-generator", label: "Password Generator", testId: "nav-password-generator" },
    { href: "/case-converter", label: "Case Converter", testId: "nav-case-converter" },
    { href: "/unit-converter", label: "Unit Converter", testId: "nav-unit-converter" },
    { href: "/age-calculator", label: "Age Calculator", testId: "nav-age-calculator" },
  ];



  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = e.currentTarget.value.toLowerCase().trim();
      if (!searchTerm) return;
      
      // Simple search logic - redirect to matching pages
      if (searchTerm.includes('app') || searchTerm.includes('opener')) {
        setLocation('/');
      } else if (searchTerm.includes('thumbnail')) {
        setLocation('/thumbnail-downloader');
      } else if (searchTerm.includes('format') || searchTerm.includes('convert')) {
        setLocation('/format-converter');
      } else if (searchTerm.includes('resize')) {
        setLocation('/image-resizer');
      } else if (searchTerm.includes('compress')) {
        setLocation('/image-compressor');
      } else if (searchTerm.includes('image')) {
        setLocation('/format-converter');
      } else if (searchTerm.includes('word') || searchTerm.includes('count')) {
        setLocation('/word-counter');
      } else if (searchTerm.includes('qr') || searchTerm.includes('code')) {
        setLocation('/qr-code-generator');
      } else if (searchTerm.includes('password') || searchTerm.includes('generator')) {
        setLocation('/password-generator');
      } else if (searchTerm.includes('case') || searchTerm.includes('text')) {
        setLocation('/case-converter');
      } else if (searchTerm.includes('unit') || searchTerm.includes('convert')) {
        setLocation('/unit-converter');
      } else if (searchTerm.includes('age') || searchTerm.includes('calculator')) {
        setLocation('/age-calculator');
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
            
            {/* Image Tools Dropdown */}
            <div className="relative">
              <button 
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg flex items-center ${
                  isImageToolActive()
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                data-testid="nav-image-dropdown"
                onClick={() => setIsImageDropdownOpen(!isImageDropdownOpen)}
                onBlur={(e) => {
                  // Close dropdown when clicking outside
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setTimeout(() => setIsImageDropdownOpen(false), 150);
                  }
                }}
              >
                Image
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isImageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isImageDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {imageTools.map((tool) => (
                    <Link href={tool.href} key={tool.href}>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                        onMouseEnter={() => preloadPage(tool.href)}
                        onClick={() => setIsImageDropdownOpen(false)}
                        data-testid={tool.testId}
                      >
                        {tool.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Utility Tools Dropdown */}
            <div className="relative">
              <button 
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg flex items-center ${
                  isUtilityToolActive()
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                data-testid="nav-utility-dropdown"
                onClick={() => setIsUtilityDropdownOpen(!isUtilityDropdownOpen)}
                onBlur={(e) => {
                  // Close dropdown when clicking outside
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setTimeout(() => setIsUtilityDropdownOpen(false), 150);
                  }
                }}
              >
                Utility
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isUtilityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isUtilityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {utilityTools.map((tool) => (
                    <Link href={tool.href} key={tool.href}>
                      <div 
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                        onMouseEnter={() => preloadPage(tool.href)}
                        onClick={() => setIsUtilityDropdownOpen(false)}
                        data-testid={tool.testId}
                      >
                        {tool.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
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

                    {/* Image Tools Collapsible */}
                    <Collapsible>
                      <CollapsibleTrigger className="w-full text-left p-4 rounded-lg font-medium text-base transition-colors text-gray-700 hover:bg-gray-50 border border-transparent flex items-center justify-between">
                        Image Tools
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 mt-2 space-y-2">
                        {imageTools.map((tool) => (
                          <Link href={tool.href} key={tool.href}>
                            <button 
                              className="w-full text-left p-3 rounded-lg font-medium text-sm transition-colors text-gray-600 hover:bg-gray-50 border border-transparent"
                              onClick={() => setIsMobileMenuOpen(false)}
                              onTouchStart={() => preloadPage(tool.href)}
                              data-testid={`mobile-${tool.testId}`}
                            >
                              {tool.label}
                            </button>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Utility Tools Collapsible */}
                    <Collapsible>
                      <CollapsibleTrigger className="w-full text-left p-4 rounded-lg font-medium text-base transition-colors text-gray-700 hover:bg-gray-50 border border-transparent flex items-center justify-between">
                        Utility Tools
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-4 mt-2 space-y-2">
                        {utilityTools.map((tool) => (
                          <Link href={tool.href} key={tool.href}>
                            <button 
                              className="w-full text-left p-3 rounded-lg font-medium text-sm transition-colors text-gray-600 hover:bg-gray-50 border border-transparent"
                              onClick={() => setIsMobileMenuOpen(false)}
                              onTouchStart={() => preloadPage(tool.href)}
                              data-testid={`mobile-${tool.testId}`}
                            >
                              {tool.label}
                            </button>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
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

                  {/* Image Tools Collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger className="w-full text-left p-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                      Image Tools
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 mt-2 space-y-2">
                      {imageTools.map((tool) => (
                        <Link href={tool.href} key={tool.href}>
                          <button 
                            className="w-full text-left p-2 rounded-lg font-medium text-sm transition-colors text-gray-600 hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                            onTouchStart={() => preloadPage(tool.href)}
                            data-testid={`tablet-${tool.testId}`}
                          >
                            {tool.label}
                          </button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Utility Tools Collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger className="w-full text-left p-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                      Utility Tools
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 mt-2 space-y-2">
                      {utilityTools.map((tool) => (
                        <Link href={tool.href} key={tool.href}>
                          <button 
                            className="w-full text-left p-2 rounded-lg font-medium text-sm transition-colors text-gray-600 hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                            onTouchStart={() => preloadPage(tool.href)}
                            data-testid={`tablet-${tool.testId}`}
                          >
                            {tool.label}
                          </button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}