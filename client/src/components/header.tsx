import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search functionality
  const searchableItems = [
    {
      id: "youtube-optimizer",
      title: "YouTube Optimizer",
      description: "Enhance thumbnails and optimize titles",
      category: "YouTube Tools",
      path: "/"
    },
    {
      id: "app-opener",
      title: "App Opener",
      description: "Generate smart app-opening links",
      category: "Tools",
      path: "/app-opener"
    },
    {
      id: "contact",
      title: "Contact Us",
      description: "Get in touch with our team",
      category: "Pages",
      path: "/contact"
    },
    {
      id: "blog",
      title: "Blog",
      description: "Latest tips and tutorials",
      category: "Pages", 
      path: "/blog"
    },
    {
      id: "about",
      title: "About",
      description: "Learn more about GinyWow",
      category: "Pages",
      path: "/about"
    }
  ];

  const searchResults = searchableItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchItemClick = (item: any) => {
    if (item.path) {
      window.location.href = item.path;
    }
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { href: "/", label: "YouTube Optimizer", testId: "nav-youtube-optimizer" },
    { href: "/app-opener", label: "App Opener", testId: "nav-app-opener" },
    { href: "/contact", label: "Contact Us", testId: "nav-contact" },
    { href: "/blog", label: "Blog", testId: "nav-blog" },
    { href: "/about", label: "About", testId: "nav-about" },
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
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <button 
                  className={`flex items-center transition-colors font-medium text-sm xl:text-base px-3 py-2 rounded-md ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  data-testid={item.testId}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>
          
          {/* Desktop Search and Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Input
                type="text"
                placeholder="Search tools..."
                className="pl-10 pr-4 py-2 w-48 xl:w-64 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                data-testid="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-96 overflow-y-auto mt-2"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <button
                          key={item.id}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50 transition-colors"
                          onMouseDown={() => handleSearchItemClick(item)}
                          data-testid={`search-result-${item.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">
                                {item.description}
                              </p>
                              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center" data-testid="no-results-message">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Sign In */}
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium hidden lg:flex"
              data-testid="sign-in"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-3 py-2 font-medium"
              data-testid="mobile-sign-in"
            >
              Sign In
            </Button>
            
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
                  {/* Mobile Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search tools..."
                        className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg text-base"
                        data-testid="mobile-search-input"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    
                    {/* Mobile Search Results */}
                    {searchQuery.trim().length > 0 && (
                      <div className="mt-3 space-y-2">
                        {searchResults.length > 0 ? (
                          searchResults.map((item) => (
                            <button
                              key={item.id}
                              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                              onClick={() => {
                                handleSearchItemClick(item);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {item.description}
                              </p>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-gray-500 text-center">
                            No results found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                      <Link href={item.href} key={item.href}>
                        <button 
                          className={`w-full text-left p-4 rounded-lg font-medium text-base transition-colors ${
                            isActive(item.href)
                              ? "text-blue-600 bg-blue-50 border border-blue-200"
                              : "text-gray-700 hover:bg-gray-50 border border-transparent"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
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
          <div className="hidden md:flex lg:hidden items-center space-x-3">
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
                <nav className="space-y-3 mt-6">
                  {navItems.map((item) => (
                    <Link href={item.href} key={item.href}>
                      <button 
                        className={`w-full text-left p-3 rounded-lg font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
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