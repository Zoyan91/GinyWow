// SEO utilities and constants for comprehensive optimization
export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  author?: string;
  robots?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

// Default SEO configuration
export const defaultSEO: SEOData = {
  title: "GinyWow - Convert Social Media Visitors into Subscribers",
  description: "Transform your social media presence with GinyWow's powerful tools: App Opener for smart redirects, Thumbnail Downloader, and Image converter. Free online tools for content creators.",
  keywords: "social media tools, app opener, thumbnail downloader, image converter, content creator tools, social media optimization",
  ogType: "website",
  twitterCard: "summary_large_image",
  robots: "index, follow",
  author: "GinyWow",
};

// Home page SEO
export const homeSEO: SEOData = {
  title: "GinyWow - Convert Social Media Visitors into Subscribers | Free Tools for Content Creators",
  description: "Transform your social media presence with GinyWow's suite of free tools: App Opener for smart redirects, YouTube Thumbnail Downloader, Image Tools (Converter, Resizer, Compressor), and 7+ Utility Tools. Boost engagement and convert visitors into loyal subscribers instantly.",
  keywords: "social media tools, app opener, link opener, thumbnail downloader, image converter, image resizer, image compressor, utility tools, word counter, qr generator, password generator, unit converter, age calculator, mortgage calculator, content creator tools, social media optimization, visitor conversion, subscriber growth",
  canonical: "/",
  ogTitle: "GinyWow - Convert Social Media Visitors into Subscribers",
  ogDescription: "Free suite of powerful tools for content creators: App Opener, Thumbnail Downloader, Image Tools, and 7+ Utilities. Transform visitors into subscribers instantly.",
  ogImage: "/og-home.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "GinyWow - Free Tools for Content Creators",
  twitterDescription: "Convert social media visitors into subscribers with our free tools: App Opener, Thumbnail Downloader, Image Tools & more.",
  robots: "index, follow",
  author: "GinyWow",
};

// Mortgage Calculator SEO
export const mortgageCalculatorSEO: SEOData = {
  title: "Free Mortgage Calculator - Calculate Home Loan EMI & Interest | GinyWow",
  description: "Calculate your home loan EMI, total interest, and monthly payments with our free mortgage calculator. Get accurate loan calculations instantly with detailed breakdown. No signup required.",
  keywords: "mortgage calculator, home loan calculator, EMI calculator, loan calculator, interest calculator, mortgage calculator free, home loan EMI, mortgage payment calculator",
  canonical: "/mortgage-calculator",
  ogTitle: "Free Mortgage Calculator - Calculate Home Loan EMI",
  ogDescription: "Calculate your mortgage payments instantly. Free tool with detailed EMI breakdown, total interest calculation, and loan analysis.",
  ogImage: "/og-mortgage-calculator.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Free Mortgage Calculator - Home Loan EMI Calculator",
  twitterDescription: "Calculate home loan EMI and interest payments instantly. Free mortgage calculator with detailed breakdown.",
  robots: "index, follow",
  author: "GinyWow",
};

// Image Resizer SEO
export const imageResizerSEO: SEOData = {
  title: "Free Image Resizer Online - Resize Photos & Pictures | GinyWow",
  description: "Resize images for any purpose with our free online tool. Maintain quality while resizing photos for social media, web, or print. Support for JPG, PNG, WebP & more. No signup required.",
  keywords: "image resizer, resize image online, photo resizer, picture resizer, image resize tool, resize photos online, image dimensions, photo size reducer",
  canonical: "/image-resizer",
  ogTitle: "Free Image Resizer - Resize Photos Online",
  ogDescription: "Resize images for any purpose with quality control. Free online tool supporting all major formats. Fast, secure, no signup required.",
  ogImage: "/og-image-resizer.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Free Image Resizer - Resize Photos Online",
  twitterDescription: "Resize images for any purpose with our free online tool. Maintain quality while resizing photos instantly.",
  robots: "index, follow",
  author: "GinyWow",
};

// Image Compressor SEO  
export const imageCompressorSEO: SEOData = {
  title: "Free Image Compressor - Reduce File Size Without Quality Loss | GinyWow",
  description: "Compress images to reduce file size without losing quality. Free online tool supporting JPG, PNG, WebP compression. Perfect for web optimization and faster loading. No signup required.",
  keywords: "image compressor, compress image online, reduce image size, image optimization, photo compressor, compress photos online, image file size reducer",
  canonical: "/image-compressor", 
  ogTitle: "Free Image Compressor - Reduce File Size",
  ogDescription: "Compress images without quality loss. Free online tool with multiple compression levels. Perfect for web optimization.",
  ogImage: "/og-image-compressor.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Free Image Compressor - Reduce Image Size",
  twitterDescription: "Compress images to reduce file size without losing quality. Free online tool with instant results.",
  robots: "index, follow",
  author: "GinyWow",
};

// Image tool specific SEO
export const formatConverterSEO: SEOData = {
  title: "Free Image Tool Online - Convert JPG, PNG, WebP & More | GinyWow",
  description: "Convert images between 12+ formats instantly. Free online tool supporting PNG, JPEG, WebP, GIF, HEIC, PDF conversion with quality controls. Fast, secure, no signup required.",
  keywords: "image converter, convert images online, jpg to png, png to webp, heic to jpg, image converter free, online image converter, format conversion tool",
  canonical: "/format-converter",
  ogTitle: "Free Image Tool - Convert Any Image Format Online",
  ogDescription: "Professional image tool supporting 12+ formats. Convert PNG, JPEG, WebP, GIF, HEIC & more. High-quality results, fast conversion, completely free.",
  ogImage: "/og-format-converter.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Free Image Tool - Convert Images Online",
  twitterDescription: "Convert images between 12+ formats instantly. PNG, JPEG, WebP, GIF, HEIC & more. Free tool with quality controls.",
  robots: "index, follow",
  author: "GinyWow",
};

// Generate structured data for WebApplication
export const generateWebApplicationSchema = (url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "GinyWow Image Tool",
  "description": "Free online image tool supporting 12+ popular formats with quality controls",
  "url": url,
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "featureList": [
    "Convert between 12+ image formats",
    "High-quality image processing",
    "No registration required",
    "Secure file processing",
    "Mobile-responsive interface",
    "Instant download"
  ],
  "screenshot": "/screenshot-format-converter.jpg",
  "softwareVersion": "1.0",
  "author": {
    "@type": "Organization",
    "name": "GinyWow"
  }
});

// Generate breadcrumb structured data
export const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://ginywow.replit.app${item.url}`
  }))
});

// Generate FAQ structured data
export const generateFAQSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Generate HowTo structured data
export const generateHowToSchema = (name: string, description: string, steps: HowToStep[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": name,
  "description": description,
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    "image": step.image
  }))
});

// Converter specific data
export const formatConverterBreadcrumbs: BreadcrumbItem[] = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/" },
  { name: "Image", url: "/format-converter" }
];

export const formatConverterFAQs: FAQItem[] = [
  {
    question: "Is the image tool completely free to use?",
    answer: "Yes! Our image tool is 100% free with no hidden costs, registration requirements, or usage limits. Convert as many images as you need."
  },
  {
    question: "What image formats are supported for conversion?",
    answer: "We support 12+ popular formats including PNG, JPEG, WebP, GIF, BMP, TIFF, AVIF, ICO, HEIC, SVG, and PDF. You can convert between any of these formats."
  },
  {
    question: "Do I need to install any software or create an account?",
    answer: "No installation or account creation required. Our image tool works entirely in your browser - just upload, convert, and download."
  },
  {
    question: "Is my uploaded image secure and private?",
    answer: "Absolutely. Your images are processed securely and are not stored on our servers. Files are automatically deleted after conversion for your privacy."
  }
];

export const formatConverterHowToSteps: HowToStep[] = [
  {
    name: "Upload Your Image",
    text: "Click the upload area or drag and drop your image file. Supports files up to 20MB in size."
  },
  {
    name: "Choose Output Format", 
    text: "Select your desired output format from our list of 12+ supported formats including PNG, JPEG, WebP, and more."
  },
  {
    name: "Adjust Quality Settings",
    text: "Fine-tune the quality settings to balance file size and image quality according to your needs."
  },
  {
    name: "Convert and Download",
    text: "Click convert and instantly download your converted image file with the new format."
  }
];

// Home page structured data
export const generateHomePageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "GinyWow",
  "description": "Free suite of tools for content creators to convert social media visitors into subscribers",
  "url": "https://ginywow.replit.app",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "featureList": [
    "App Opener - Convert social media links to smart redirects",
    "YouTube Thumbnail Downloader - Download high-quality thumbnails",
    "Image Converter - Convert between 12+ formats",
    "Image Resizer - Resize photos with quality control",
    "Image Compressor - Reduce file size without quality loss",
    "Word Counter - Count words, characters, and reading time",
    "QR Code Generator - Create custom QR codes",
    "Password Generator - Generate secure passwords",
    "Unit Converter - Convert between measurement units",
    "Age Calculator - Calculate age and life statistics",
    "Mortgage Calculator - Calculate home loan EMI and interest"
  ],
  "author": {
    "@type": "Organization",
    "name": "GinyWow",
    "url": "https://ginywow.replit.app"
  },
  "publisher": {
    "@type": "Organization",
    "name": "GinyWow"
  }
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GinyWow",
  "url": "https://ginywow.replit.app",
  "description": "Free tools platform for content creators and social media optimization",
  "foundingDate": "2025",
  "knowsAbout": [
    "Social Media Tools",
    "Content Creation",
    "Image Processing",
    "Utility Tools",
    "Web Applications"
  ],
  "sameAs": []
});

// Home page breadcrumbs
export const homeBreadcrumbs: BreadcrumbItem[] = [
  { name: "Home", url: "/" }
];

// Home page FAQs
export const homeFAQs: FAQItem[] = [
  {
    question: "What is GinyWow and what tools does it offer?",
    answer: "GinyWow is a comprehensive suite of free online tools designed for content creators. We offer App Opener for smart social media redirects, YouTube Thumbnail Downloader, Image Tools (Converter, Resizer, Compressor), and 7+ Utility Tools including Word Counter, QR Generator, Password Generator, and more."
  },
  {
    question: "Are all GinyWow tools completely free to use?",
    answer: "Yes! All our tools are 100% free with no hidden costs, registration requirements, or usage limits. You can use any tool as many times as you need without any restrictions."
  },
  {
    question: "Do I need to create an account to use GinyWow tools?",
    answer: "No account creation required! All our tools work directly in your browser. Simply visit the tool you need, use it instantly, and download your results. It's that simple."
  },
  {
    question: "How does the App Opener help convert visitors to subscribers?",
    answer: "The App Opener creates smart links that automatically redirect users to native apps instead of keeping them in in-app browsers. This provides a better user experience, leading to higher engagement and more followers/subscribers across social media platforms."
  },
  {
    question: "Are my files and data secure when using GinyWow tools?",
    answer: "Absolutely! Your privacy and security are our top priorities. All file processing happens securely, and we don't store your files on our servers. Your data is automatically deleted after processing to ensure complete privacy."
  }
];

// Mortgage Calculator specific data
export const mortgageCalculatorBreadcrumbs: BreadcrumbItem[] = [
  { name: "Home", url: "/" },
  { name: "Utility Tools", url: "/" },
  { name: "Mortgage Calculator", url: "/mortgage-calculator" }
];

export const mortgageCalculatorFAQs: FAQItem[] = [
  {
    question: "How accurate is the mortgage calculator?",
    answer: "Our mortgage calculator uses standard financial formulas to provide highly accurate EMI calculations. However, actual loan terms may vary based on your lender's specific policies and your credit profile."
  },
  {
    question: "What information do I need to calculate my mortgage?",
    answer: "You need three basic pieces of information: the loan amount (principal), annual interest rate, and loan tenure (in years). Our calculator will instantly compute your monthly EMI and total interest."
  },
  {
    question: "Can I use this calculator for different types of loans?",
    answer: "Yes! While designed for mortgages, this calculator works for any type of installment loan including personal loans, car loans, and business loans with fixed interest rates."
  },
  {
    question: "Is my financial information stored when using the calculator?",
    answer: "No, we don't store any of your financial information. All calculations are performed locally in your browser, ensuring complete privacy and security of your data."
  }
];