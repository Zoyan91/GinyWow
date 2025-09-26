import { Link } from "wouter";
import { SiFacebook, SiX, SiLinkedin, SiYoutube, SiPinterest } from 'react-icons/si';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [menusOpen, setMenusOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  return (
    <footer className="bg-white backdrop-blur-sm border-t border-gray-100 py-8 sm:py-12 relative z-10 mt-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-8">
          {/* Menus */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Menus</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact">
                  <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm">
                    Contact Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm">
                    Blog
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm">
                    Privacy Policy
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Tools</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm">
                    URL Opener
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/thumbnail-downloader">
                  <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm">
                    Thumbnail Downloader
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/format-converter">
                  <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm">
                    Converter
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Follow Us</h4>
            <div className="flex flex-wrap gap-4">
              <a href="https://facebook.com/ginywow" target="_blank" rel="noopener noreferrer">
                <span className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 block" aria-label="Facebook">
                  <SiFacebook className="w-5 h-5" />
                </span>
              </a>
              <a href="https://x.com/ginywow" target="_blank" rel="noopener noreferrer">
                <span className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-50 block" aria-label="X (Twitter)">
                  <SiX className="w-5 h-5" />
                </span>
              </a>
              <a href="https://linkedin.com/company/ginywow" target="_blank" rel="noopener noreferrer">
                <span className="text-gray-400 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50 block" aria-label="LinkedIn">
                  <SiLinkedin className="w-5 h-5" />
                </span>
              </a>
              <a href="https://youtube.com/@ginywow" target="_blank" rel="noopener noreferrer">
                <span className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 block" aria-label="YouTube">
                  <SiYoutube className="w-5 h-5" />
                </span>
              </a>
              <a href="https://pinterest.com/ginywow" target="_blank" rel="noopener noreferrer">
                <span className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 block" aria-label="Pinterest">
                  <SiPinterest className="w-5 h-5" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="md:hidden space-y-4 mb-8">
          {/* Menus */}
          <Collapsible open={menusOpen} onOpenChange={setMenusOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 text-base">Menus</h4>
              <ChevronDown className={`h-4 w-4 transition-transform ${menusOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-3 p-4">
                <li>
                  <Link href="/contact">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm block py-2">
                      Contact Us
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/blog">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm block py-2">
                      Blog
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm block py-2">
                      About Us
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm block py-2">
                      Privacy Policy
                    </span>
                  </Link>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* Tools */}
          <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 text-base">Tools</h4>
              <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-3 p-4">
                <li>
                  <Link href="/">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm block py-2">
                      URL Opener
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/thumbnail-downloader">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm block py-2">
                      Thumbnail Downloader
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/format-converter">
                    <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm block py-2">
                      Converter
                    </span>
                  </Link>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          {/* Social Media */}
          <Collapsible open={socialOpen} onOpenChange={setSocialOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 text-base">Follow Us</h4>
              <ChevronDown className={`h-4 w-4 transition-transform ${socialOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="flex flex-wrap gap-4 p-4">
                <a href="https://facebook.com/ginywow" target="_blank" rel="noopener noreferrer">
                  <span className="text-gray-400 hover:text-blue-600 transition-colors p-3 rounded-lg hover:bg-blue-50 flex items-center space-x-2 cursor-pointer" aria-label="Facebook">
                    <SiFacebook className="w-5 h-5" />
                    <span className="text-sm">Facebook</span>
                  </span>
                </a>
                <a href="https://x.com/ginywow" target="_blank" rel="noopener noreferrer">
                  <span className="text-gray-400 hover:text-gray-900 transition-colors p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-2 cursor-pointer" aria-label="X (Twitter)">
                    <SiX className="w-5 h-5" />
                    <span className="text-sm">X</span>
                  </span>
                </a>
                <a href="https://linkedin.com/company/ginywow" target="_blank" rel="noopener noreferrer">
                  <span className="text-gray-400 hover:text-blue-700 transition-colors p-3 rounded-lg hover:bg-blue-50 flex items-center space-x-2 cursor-pointer" aria-label="LinkedIn">
                    <SiLinkedin className="w-5 h-5" />
                    <span className="text-sm">LinkedIn</span>
                  </span>
                </a>
                <a href="https://youtube.com/@ginywow" target="_blank" rel="noopener noreferrer">
                  <span className="text-gray-400 hover:text-red-600 transition-colors p-3 rounded-lg hover:bg-red-50 flex items-center space-x-2 cursor-pointer" aria-label="YouTube">
                    <SiYoutube className="w-5 h-5" />
                    <span className="text-sm">YouTube</span>
                  </span>
                </a>
                <a href="https://pinterest.com/ginywow" target="_blank" rel="noopener noreferrer">
                  <span className="text-gray-400 hover:text-red-500 transition-colors p-3 rounded-lg hover:bg-red-50 flex items-center space-x-2 cursor-pointer" aria-label="Pinterest">
                    <SiPinterest className="w-5 h-5" />
                    <span className="text-sm">Pinterest</span>
                  </span>
                </a>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center order-1 sm:order-2">
              <Link href="/">
                <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-lg font-bold text-gray-900">Giny</span>
                  <span className="text-lg font-bold text-blue-600">Wow</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center order-2 sm:order-1">
              <p className="text-sm text-gray-600 text-center sm:text-left">© 2025 GinyWow.com | All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}