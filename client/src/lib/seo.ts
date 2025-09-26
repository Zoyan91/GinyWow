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
  description: "Transform your social media presence with GinyWow's powerful tools: App Opener for smart redirects, Thumbnail Downloader, and Converter. Free online tools for content creators.",
  keywords: "social media tools, app opener, thumbnail downloader, converter, content creator tools, social media optimization",
  ogType: "website",
  twitterCard: "summary_large_image",
  robots: "index, follow",
  author: "GinyWow",
};

// Converter specific SEO
export const formatConverterSEO: SEOData = {
  title: "Free Image Converter Online - Convert JPG, PNG, WebP & More | GinyWow",
  description: "Convert images between 12+ formats instantly. Free online tool supporting PNG, JPEG, WebP, GIF, HEIC, PDF conversion with quality controls. Fast, secure, no signup required.",
  keywords: "image converter, convert images online, jpg to png, png to webp, heic to jpg, image converter free, online image converter, format conversion tool",
  canonical: "/format-converter",
  ogTitle: "Free Image Converter - Convert Any Image Format Online",
  ogDescription: "Professional image converter supporting 12+ formats. Convert PNG, JPEG, WebP, GIF, HEIC & more. High-quality results, fast conversion, completely free.",
  ogImage: "/og-format-converter.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "Free Image Converter - Convert Images Online",
  twitterDescription: "Convert images between 12+ formats instantly. PNG, JPEG, WebP, GIF, HEIC & more. Free tool with quality controls.",
  robots: "index, follow",
  author: "GinyWow",
};

// Generate structured data for WebApplication
export const generateWebApplicationSchema = (url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "GinyWow Image Converter",
  "description": "Free online image converter supporting 12+ popular formats with quality controls",
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
  { name: "Converter", url: "/format-converter" }
];

export const formatConverterFAQs: FAQItem[] = [
  {
    question: "Is the image converter completely free to use?",
    answer: "Yes! Our image converter is 100% free with no hidden costs, registration requirements, or usage limits. Convert as many images as you need."
  },
  {
    question: "What image formats are supported for conversion?",
    answer: "We support 12+ popular formats including PNG, JPEG, WebP, GIF, BMP, TIFF, AVIF, ICO, HEIC, SVG, and PDF. You can convert between any of these formats."
  },
  {
    question: "Do I need to install any software or create an account?",
    answer: "No installation or account creation required. Our converter works entirely in your browser - just upload, convert, and download."
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