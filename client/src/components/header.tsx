import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";

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

  const appOpenerItems = [
    { href: "/", label: "URL Opener", testId: "nav-url-opener" },
    { href: "/thumbnail-downloader", label: "Thumbnail Downloader", testId: "nav-thumbnail-downloader" },
  ];

  const navItems = [
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
            {/* App Opener Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`flex items-center transition-colors font-medium text-sm xl:text-base px-3 py-2 rounded-md ${
                    isActive("/") || isActive("/thumbnail-downloader")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  data-testid="nav-app-opener-dropdown"
                >
                  App Opener
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {appOpenerItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="w-full px-2 py-2 cursor-pointer" data-testid={item.testId}>
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Regular Navigation Items */}
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
          
          {/* Desktop Sign In */}
          <div className="hidden lg:flex items-center">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
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

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 space-y-2 mt-6">
                    {/* App Opener Section */}
                    <div className="border border-gray-200 rounded-lg p-2">
                      <div className="text-sm font-medium text-gray-900 px-2 py-1 mb-2">App Opener</div>
                      {appOpenerItems.map((item) => (
                        <Link href={item.href} key={item.href}>
                          <button 
                            className={`w-full text-left p-3 rounded-lg font-medium text-base transition-colors ${
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
                    </div>

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
                  {/* App Opener Section */}
                  <div className="border border-gray-200 rounded-lg p-2">
                    <div className="text-sm font-medium text-gray-900 px-2 py-1 mb-2">App Opener</div>
                    {appOpenerItems.map((item) => (
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
                  </div>

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