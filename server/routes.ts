import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertThumbnailSchema, insertTitleOptimizationSchema, insertNewsletterSubscriptionSchema, insertShortUrlSchema } from "@shared/schema";
import { analyzeThumbnail, optimizeTitles, enhanceThumbnailImage } from "./openai";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Upload and analyze thumbnail
  app.post('/api/thumbnails/upload', upload.single('thumbnail'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const base64Image = req.file.buffer.toString('base64');
      
      // Validate input
      const thumbnailData = insertThumbnailSchema.parse({
        originalImageData: base64Image,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      });

      // Create thumbnail record
      const thumbnail = await storage.createThumbnail(thumbnailData);

      // Analyze with AI
      const analysis = await analyzeThumbnail(base64Image);

      // Generate enhanced image
      const enhancementResult = await enhanceThumbnailImage(base64Image, analysis.enhancementSuggestions);

      // Update thumbnail with analysis results
      const updatedThumbnail = await storage.updateThumbnail(thumbnail.id, {
        enhancedImageData: enhancementResult.enhancedImage,
        enhancementMetrics: {
          contrast: analysis.enhancementSuggestions.contrast,
          saturation: analysis.enhancementSuggestions.saturation,
          clarity: analysis.enhancementSuggestions.clarity,
          ctrImprovement: analysis.ctrImprovement,
        },
      });

      res.json({
        thumbnail: updatedThumbnail,
        analysis: {
          description: analysis.description,
          recommendations: analysis.recommendations,
          ctrImprovement: analysis.ctrImprovement,
        },
      });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      res.status(500).json({ error: 'Failed to process thumbnail' });
    }
  });

  // Get thumbnail by ID
  app.get('/api/thumbnails/:id', async (req, res) => {
    try {
      const thumbnail = await storage.getThumbnail(req.params.id);
      if (!thumbnail) {
        return res.status(404).json({ error: 'Thumbnail not found' });
      }
      res.json(thumbnail);
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
      res.status(500).json({ error: 'Failed to fetch thumbnail' });
    }
  });

  // Optimize titles
  app.post('/api/titles/optimize', async (req, res) => {
    try {
      const { originalTitle, thumbnailId } = insertTitleOptimizationSchema.parse(req.body);

      // Get thumbnail context if provided
      let thumbnailContext;
      if (thumbnailId) {
        const thumbnail = await storage.getThumbnail(thumbnailId);
        if (thumbnail) {
          // Analyze thumbnail for context
          const analysis = await analyzeThumbnail(thumbnail.originalImageData);
          thumbnailContext = analysis.description;
        }
      }

      // Generate optimized titles
      const suggestions = await optimizeTitles(originalTitle, thumbnailContext);

      // Create title optimization record
      const optimization = await storage.createTitleOptimization({
        originalTitle,
        thumbnailId,
      });

      // Update with suggestions
      const updatedOptimization = await storage.updateTitleOptimization(optimization.id, {
        optimizedTitles: suggestions,
      });

      res.json({
        optimization: updatedOptimization,
        suggestions,
      });
    } catch (error) {
      console.error('Error optimizing titles:', error);
      res.status(500).json({ error: 'Failed to optimize titles' });
    }
  });

  // Get title optimizations for a thumbnail
  app.get('/api/thumbnails/:thumbnailId/titles', async (req, res) => {
    try {
      const optimizations = await storage.getTitleOptimizationsByThumbnail(req.params.thumbnailId);
      res.json(optimizations);
    } catch (error) {
      console.error('Error fetching title optimizations:', error);
      res.status(500).json({ error: 'Failed to fetch title optimizations' });
    }
  });

  // Combined optimize endpoint (thumbnail + title)
  app.post('/api/optimize', upload.single('thumbnail'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No thumbnail file provided' });
      }

      const { title } = req.body;
      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      const base64Image = req.file.buffer.toString('base64');
      
      // Create thumbnail record
      const thumbnailData = insertThumbnailSchema.parse({
        originalImageData: base64Image,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      });
      const thumbnail = await storage.createThumbnail(thumbnailData);

      // Analyze thumbnail with AI
      const analysis = await analyzeThumbnail(base64Image);

      // Generate enhanced thumbnail image
      const enhancementResult = await enhanceThumbnailImage(base64Image, analysis.enhancementSuggestions);

      // Update thumbnail with enhanced version
      await storage.updateThumbnail(thumbnail.id, {
        enhancedImageData: enhancementResult.enhancedImage,
        enhancementMetrics: {
          contrast: analysis.enhancementSuggestions.contrast,
          saturation: analysis.enhancementSuggestions.saturation,
          clarity: analysis.enhancementSuggestions.clarity,
          ctrImprovement: analysis.ctrImprovement,
        },
      });

      // Generate title suggestions
      const titleSuggestions = await optimizeTitles(title.trim(), analysis.description);

      // Create title optimization record
      const optimization = await storage.createTitleOptimization({
        originalTitle: title.trim(),
        thumbnailId: thumbnail.id,
      });

      // Update with suggestions
      await storage.updateTitleOptimization(optimization.id, {
        optimizedTitles: titleSuggestions,
      });

      // Calculate a simple CTR score based on title length and thumbnail analysis
      const ctrScore = Math.min(95, Math.max(15, 
        (title.trim().length > 10 && title.trim().length < 60 ? 30 : 10) +
        (analysis.ctrImprovement || 30) +
        (titleSuggestions && titleSuggestions.length > 0 ? 15 : 0)
      ));

      res.json({
        ctrScore: Math.round(ctrScore),
        ctrFeedback: ctrScore > 70 ? 'Excellent! Your thumbnail and title have strong click potential.' :
                     ctrScore > 50 ? 'Good combination! Consider implementing the suggested improvements.' :
                     'This combination needs improvement. Follow our suggestions to boost performance.',
        titleSuggestions: titleSuggestions || [],
        thumbnailAnalysis: analysis.description,
        recommendations: analysis.recommendations,
        thumbnailId: thumbnail.id,
        optimizationId: optimization.id,
        // Add before/after thumbnail comparison
        thumbnailComparison: {
          before: `data:image/jpeg;base64,${base64Image}`,
          after: `data:image/jpeg;base64,${enhancementResult.enhancedImage}`,
          enhancementMetrics: {
            contrast: analysis.enhancementSuggestions.contrast,
            saturation: analysis.enhancementSuggestions.saturation,
            clarity: analysis.enhancementSuggestions.clarity,
          }
        },
        // Add enhancement status and message
        enhancementStatus: {
          success: enhancementResult.success,
          message: enhancementResult.message
        }
      });
    } catch (error) {
      console.error('Error during optimization:', error);
      res.status(500).json({ error: 'Failed to optimize thumbnail and title' });
    }
  });

  // Newsletter subscription endpoint
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      // Validate the email input
      const subscriptionData = insertNewsletterSubscriptionSchema.parse(req.body);
      
      // Try to create the subscription
      const subscription = await storage.createNewsletterSubscription(subscriptionData);
      
      res.json({
        success: true,
        message: 'Successfully subscribed to newsletter! Thank you for joining us.',
        subscription: {
          id: subscription.id,
          email: subscription.email,
          subscriptionDate: subscription.subscriptionDate,
        }
      });
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      
      if (error.message === 'Email already subscribed') {
        return res.status(409).json({ 
          success: false,
          error: 'This email is already subscribed to our newsletter.',
          code: 'ALREADY_SUBSCRIBED'
        });
      }
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false,
          error: 'Please enter a valid email address.',
          code: 'INVALID_EMAIL'
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Failed to subscribe to newsletter. Please try again.',
        code: 'SUBSCRIPTION_FAILED'
      });
    }
  });

  // Generate short URL for any social media or website links
  app.post('/api/short-url', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ 
          success: false,
          error: 'Please provide a valid URL' 
        });
      }

      // Basic URL validation
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ 
          success: false,
          error: 'Please provide a valid URL' 
        });
      }

      // Parse URL for any platform
      const parseUrl = (url: string) => {
        try {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname.toLowerCase();
          
          // YouTube
          if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
            if (hostname === 'youtu.be') {
              return { platform: 'youtube', type: 'video', id: urlObj.pathname.slice(1), path: `/watch?v=${urlObj.pathname.slice(1)}` };
            } else if (urlObj.pathname === '/watch') {
              return { platform: 'youtube', type: 'video', id: urlObj.searchParams.get('v'), path: urlObj.pathname + urlObj.search };
            } else if (urlObj.pathname.startsWith('/shorts/')) {
              return { platform: 'youtube', type: 'shorts', id: urlObj.pathname.split('/shorts/')[1], path: urlObj.pathname };
            } else {
              return { platform: 'youtube', type: 'general', id: null, path: urlObj.pathname + urlObj.search };
            }
          }
          
          // Instagram
          if (hostname.includes('instagram.com')) {
            if (urlObj.pathname.startsWith('/p/') || urlObj.pathname.startsWith('/reel/')) {
              return { platform: 'instagram', type: 'post', id: urlObj.pathname.split('/')[2], path: urlObj.pathname };
            } else {
              return { platform: 'instagram', type: 'general', id: null, path: urlObj.pathname };
            }
          }
          
          // TikTok
          if (hostname.includes('tiktok.com')) {
            if (urlObj.pathname.includes('/video/')) {
              return { platform: 'tiktok', type: 'video', id: urlObj.pathname.split('/video/')[1], path: urlObj.pathname };
            } else {
              return { platform: 'tiktok', type: 'general', id: null, path: urlObj.pathname };
            }
          }
          
          // Twitter/X
          if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
            return { platform: 'twitter', type: 'general', id: null, path: urlObj.pathname };
          }
          
          // Facebook
          if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
            return { platform: 'facebook', type: 'general', id: null, path: urlObj.pathname };
          }
          
          // LinkedIn
          if (hostname.includes('linkedin.com')) {
            return { platform: 'linkedin', type: 'general', id: null, path: urlObj.pathname };
          }
          
          // Default for any other website
          return { platform: 'web', type: 'general', id: null, path: urlObj.pathname };
        } catch {
          return null;
        }
      };

      const generateDeepLinks = (parsed: any, originalUrl: string) => {
        const encodedUrl = encodeURIComponent(originalUrl);
        
        let iosLink = '';
        let androidLink = '';
        
        switch (parsed.platform) {
          case 'youtube':
            if (parsed.type === 'video') {
              iosLink = `youtube://watch?v=${parsed.id}`;
              androidLink = `intent://www.youtube.com/watch?v=${parsed.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
            } else if (parsed.type === 'shorts') {
              iosLink = `youtube://shorts/${parsed.id}`;
              androidLink = `intent://www.youtube.com/shorts/${parsed.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
            } else {
              iosLink = `youtube://${originalUrl}`;
              androidLink = `intent://${originalUrl.replace('https://', '')}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
            }
            break;
            
          case 'instagram':
            iosLink = `instagram://media?id=${parsed.id || ''}`;
            androidLink = `intent://${originalUrl.replace('https://', '')}#Intent;scheme=https;package=com.instagram.android;S.browser_fallback_url=${encodedUrl};end`;
            break;
            
          case 'tiktok':
            iosLink = `snssdk1233://aweme/detail/${parsed.id || ''}`;
            androidLink = `intent://${originalUrl.replace('https://', '')}#Intent;scheme=https;package=com.zhiliaoapp.musically;S.browser_fallback_url=${encodedUrl};end`;
            break;
            
          case 'twitter':
            iosLink = `twitter://${originalUrl.replace('https://twitter.com', '').replace('https://x.com', '')}`;
            androidLink = `intent://${originalUrl.replace('https://', '')}#Intent;scheme=https;package=com.twitter.android;S.browser_fallback_url=${encodedUrl};end`;
            break;
            
          case 'facebook':
            iosLink = `fb://${originalUrl.replace('https://facebook.com', '').replace('https://www.facebook.com', '')}`;
            androidLink = `intent://${originalUrl.replace('https://', '')}#Intent;scheme=https;package=com.facebook.katana;S.browser_fallback_url=${encodedUrl};end`;
            break;
            
          case 'linkedin':
            iosLink = `linkedin://${originalUrl.replace('https://linkedin.com', '').replace('https://www.linkedin.com', '')}`;
            androidLink = `intent://${originalUrl.replace('https://', '')}#Intent;scheme=https;package=com.linkedin.android;S.browser_fallback_url=${encodedUrl};end`;
            break;
            
          default:
            // For general websites, just use the original URL
            iosLink = originalUrl;
            androidLink = originalUrl;
            break;
        }
        
        return { iosLink, androidLink, webLink: originalUrl };
      };

      const parsed = parseUrl(url);
      
      if (!parsed) {
        return res.status(400).json({ 
          success: false,
          error: 'Could not parse the URL. Please check the format.' 
        });
      }

      const { iosLink, androidLink, webLink } = generateDeepLinks(parsed, url);
      
      // Generate unique short code with collision checking
      let shortCode = '';
      let attempts = 0;
      const maxAttempts = 10;
      
      do {
        shortCode = Math.random().toString(36).substring(2, 8);
        const existing = await storage.getShortUrl(shortCode);
        if (!existing) break;
        attempts++;
      } while (attempts < maxAttempts);
      
      if (attempts >= maxAttempts) {
        return res.status(500).json({ 
          success: false,
          error: 'Unable to generate unique short code. Please try again.' 
        });
      }
      
      // Validate and create short URL
      const shortUrlData = insertShortUrlSchema.parse({
        shortCode,
        originalUrl: url,
        iosDeepLink: iosLink,
        androidDeepLink: androidLink,
        urlType: `${parsed.platform}_${parsed.type}`,
      });

      const shortUrl = await storage.createShortUrl(shortUrlData);
      
      const baseUrl = req.headers.host?.includes('localhost') 
        ? `http://localhost:5000` 
        : `https://ginywow.com`;
      
      // Generate platform-specific prefix
      const getPlatformPrefix = (platform: string) => {
        switch (platform) {
          case 'youtube': return 'yt';
          case 'instagram': return 'ig';
          case 'tiktok': return 'tt';
          case 'twitter': return 'tw';
          case 'facebook': return 'fb';
          case 'linkedin': return 'li';
          default: return 'web';
        }
      };
      
      const platformPrefix = getPlatformPrefix(parsed.platform);
      
      res.json({
        success: true,
        shortUrl: `${baseUrl}/${platformPrefix}/${shortCode}`,
        originalUrl: url,
        platform: parsed.platform,
        type: parsed.type
      });
    } catch (error: any) {
      console.error('Error generating short URL:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid URL data provided' 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate short URL. Please try again.' 
      });
    }
  });

  // Redirect short URLs for all platforms
  app.get('/:platform(yt|ig|tt|tw|fb|li|web)/:shortCode', async (req, res) => {
    try {
      const { shortCode } = req.params;
      const shortUrl = await storage.getShortUrl(shortCode);
      
      if (!shortUrl) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Link Not Found - GinyWow</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f9f9f9; }
              .container { max-width: 500px; margin: 0 auto; }
              h1 { color: #333; }
              p { color: #666; margin: 20px 0; }
              .btn { background: #ff4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
              .btn:hover { background: #cc0000; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Link Not Found</h1>
              <p>The short link you're looking for doesn't exist or has expired.</p>
              <a href="/" class="btn">Go to GinyWow</a>
            </div>
          </body>
          </html>
        `);
      }

      // Increment click count
      await storage.incrementClickCount(shortCode);

      // Detect user agent
      const userAgent = req.headers['user-agent'] || '';
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);

      let redirectUrl = shortUrl.originalUrl;
      
      if (isIOS) {
        redirectUrl = shortUrl.iosDeepLink;
      } else if (isAndroid) {
        redirectUrl = shortUrl.androidDeepLink;
      }

      // Send HTML with immediate redirect and fallback
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Opening YouTube App...</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f9f9f9; 
            }
            .loading { 
              color: #666; 
              font-size: 18px; 
              margin-bottom: 20px; 
            }
            .spinner {
              border: 4px solid #f3f3f3;
              border-top: 4px solid #ff4444;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .fallback {
              margin-top: 30px;
              padding: 20px;
              background: white;
              border-radius: 8px;
              border: 1px solid #ddd;
            }
            .btn {
              background: #ff4444;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin: 10px;
            }
            .btn:hover { background: #cc0000; }
          </style>
        </head>
        <body>
          <div class="loading">Opening YouTube App...</div>
          <div class="spinner"></div>
          
          <div class="fallback">
            <p>If the app didn't open, try these links:</p>
            ${isIOS ? `<a href="${shortUrl.iosDeepLink}" class="btn">Open in iOS App</a>` : ''}
            ${isAndroid ? `<a href="${shortUrl.androidDeepLink}" class="btn">Open in Android App</a>` : ''}
            <a href="${shortUrl.originalUrl}" class="btn">Open in Browser</a>
          </div>

          <script>
            // Immediate redirect attempt
            window.location.href = "${redirectUrl}";
            
            // Fallback after 3 seconds
            setTimeout(function() {
              if (document.visibilityState === 'visible') {
                window.location.href = "${shortUrl.originalUrl}";
              }
            }, 3000);
          </script>
        </body>
        </html>
      `);
    } catch (error) {
      console.error('Error redirecting short URL:', error);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error - GinyWow</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f9f9f9; }
            .container { max-width: 500px; margin: 0 auto; }
            h1 { color: #333; }
            p { color: #666; margin: 20px 0; }
            .btn { background: #ff4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            .btn:hover { background: #cc0000; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Something went wrong</h1>
            <p>There was an error processing your request.</p>
            <a href="/" class="btn">Go to GinyWow</a>
          </div>
        </body>
        </html>
      `);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
