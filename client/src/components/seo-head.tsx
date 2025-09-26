import { Helmet } from 'react-helmet-async';
import { SEOData } from '@/lib/seo';

interface SEOHeadProps {
  seoData: SEOData;
  structuredData?: any[];
}

export function SEOHead({ seoData, structuredData = [] }: SEOHeadProps) {
  const {
    title,
    description,
    keywords,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    author,
    robots,
  } = seoData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      {robots && <meta name="robots" content={robots} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={`https://ginywow.replit.app${canonical}`} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogType && <meta property="og:type" content={ogType} />}
      <meta property="og:site_name" content="GinyWow" />
      
      {/* Twitter Card Meta Tags */}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="application-name" content="GinyWow" />
      <meta name="apple-mobile-web-app-title" content="GinyWow" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && structuredData.length > 0 && structuredData.map((schema, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
      
      {/* Performance Optimizations - Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Critical performance optimizations for instant loading */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Preload critical JavaScript modules for faster execution */}
      <link rel="modulepreload" href="/src/main.tsx" />
      <link rel="modulepreload" href="/src/pages/home.tsx" />
      
      {/* Critical API endpoint prefetch for instant responses */}
      <link rel="prefetch" href="/api/short-url" />
      <link rel="prefetch" href="/api/convert-image" />
      <link rel="prefetch" href="/api/resize-image" />
      <link rel="prefetch" href="/api/compress-image" />
      
      {/* Critical image preloading */}
      <link rel="preload" href="/hero-bg.jpg" as="image" />
      <link rel="preload" href="/tool-icons.webp" as="image" />
      
      {/* Optimize loading strategies */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
    </Helmet>
  );
}