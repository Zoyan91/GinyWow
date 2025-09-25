import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, Search, ChevronDown } from "lucide-react";
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

  // TinyWow-style navigation categories
  const toolCategories = [
    {
      label: "URL Tools",
      items: [
        { href: "/", label: "App Opener", description: "Convert social media links to app-opening URLs" }
      ]
    },
    {
      label: "Media Tools", 
      items: [
        { href: "/thumbnail-downloader", label: "Thumbnail Downloader", description: "Download high-quality thumbnails" },
        { href: "/format-converter", label: "Format Converter", description: "Convert images between formats" }
      ]
    }
  ];

  const allNavItems = [
    { href: "/", label: "URL Opener", testId: "nav-url-opener" },
    { href: "/thumbnail-downloader", label: "Download Thumbnail", testId: "nav-thumbnail-downloader" },
    { href: "/format-converter", label: "Format Converter", testId: "nav-format-converter" },
    { href: "/contact", label: "Contact Us", testId: "nav-contact" },
    { href: "/blog", label: "Blog", testId: "nav-blog" },
  ];

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 relative z-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 cursor-pointer hover:opacity-80 transition-opacity" data-testid="logo">
                <span className="text-gray-900">Giny</span><span className="text-blue-600">Wow</span>
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation - TinyWow Style */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Tool Categories with Dropdowns */}
            {toolCategories.map((category) => (
              <DropdownMenu key={category.label}>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 transition-colors">
                  <span>{category.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-2">
                  {category.items.map((item) => (
                    <Link href={item.href} key={item.href}>
                      <DropdownMenuItem 
                        className="cursor-pointer p-3 focus:bg-blue-50 focus:text-blue-700"
                        onMouseEnter={() => preloadPage(item.href)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-sm text-gray-500">{item.description}</span>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
            
            {/* Direct Links */}
            <Link href="/contact">
              <button 
                className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2 transition-colors"
                data-testid="nav-contact"
                onMouseEnter={() => preloadPage("/contact")}
              >
                Contact
              </button>
            </Link>
            
            <Link href="/blog">
              <button 
                className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2 transition-colors"
                data-testid="nav-blog"
                onMouseEnter={() => preloadPage("/blog")}
              >
                Blog
              </button>
            </Link>
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