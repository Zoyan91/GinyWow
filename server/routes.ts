import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import sharp from "sharp";
import { storage } from "./storage";
import { insertThumbnailSchema, insertTitleOptimizationSchema, insertNewsletterSubscriptionSchema, insertShortUrlSchema, videoMetadataSchema } from "@shared/schema";
import { analyzeThumbnail, optimizeTitles, enhanceThumbnailImage } from "./openai";
import ytdl from "@distube/ytdl-core";
import YTDlpWrap from 'yt-dlp-wrap';

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

// Configure multer for image tools with higher size limit
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for image tools
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



  // Extract Video Metadata API Endpoint  
  app.post('/api/video-metadata', async (req, res) => {
    try {
      const { videoUrl } = videoMetadataSchema.parse(req.body);
      
      // Validate YouTube URL
      if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ 
          success: false,
          error: 'Please provide a valid YouTube URL' 
        });
      }

      try {
        // Get video info with formats
        const info = await ytdl.getInfo(videoUrl);
        const videoDetails = info.videoDetails;
        
        // Extract available formats
        const availableFormats = info.formats
          .filter(format => format.hasVideo || format.hasAudio)
          .map(format => {
            const quality = format.qualityLabel || 
                           (format.hasAudio && !format.hasVideo ? 'Audio' : 'Unknown');
            const container = format.container || 'mp4';
            const codec = format.codecs || 'unknown';
            const fps = format.fps || undefined;
            
            // Calculate approximate file size if available
            let fileSize = undefined;
            if (format.contentLength) {
              const sizeInMB = parseInt(format.contentLength) / (1024 * 1024);
              fileSize = sizeInMB > 1000 ? 
                `${(sizeInMB / 1024).toFixed(1)} GB` : 
                `${sizeInMB.toFixed(1)} MB`;
            }

            return {
              quality: quality,
              format: container.toUpperCase(),
              codec: codec,
              bitrate: format.audioBitrate ? `${format.audioBitrate}kbps` : undefined,
              fps: fps,
              fileSize: fileSize,
              downloadUrl: format.url
            };
          })
          .filter((format, index, self) => 
            // Remove duplicates based on quality + format combination
            index === self.findIndex(f => f.quality === format.quality && f.format === format.format)
          )
          .sort((a, b) => {
            // Sort by quality (higher first)
            const qualityOrder = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
            const aIndex = qualityOrder.findIndex(q => a.quality.includes(q));
            const bIndex = qualityOrder.findIndex(q => b.quality.includes(q));
            
            if (aIndex !== -1 && bIndex !== -1) {
              return aIndex - bIndex;
            }
            
            // Audio formats at the end
            if (a.quality.includes('Audio') && !b.quality.includes('Audio')) return 1;
            if (b.quality.includes('Audio') && !a.quality.includes('Audio')) return -1;
            
            return 0;
          });

        // Format duration from seconds to MM:SS
        const formatDuration = (seconds: string) => {
          const secs = parseInt(seconds);
          const minutes = Math.floor(secs / 60);
          const remainingSeconds = secs % 60;
          return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        };

        const metadata = {
          title: videoDetails.title || 'Untitled Video',
          duration: formatDuration(videoDetails.lengthSeconds || '0'),
          thumbnail: videoDetails.thumbnails?.[videoDetails.thumbnails.length - 1]?.url || 
                    `https://img.youtube.com/vi/${videoDetails.videoId}/maxresdefault.jpg`,
          platform: 'youtube',
          videoId: videoDetails.videoId,
          availableFormats: availableFormats
        };

        res.json({
          success: true,
          metadata
        });

      } catch (ytdlError: any) {
        console.error('YTDL Error:', ytdlError);
        
        // Fallback to basic metadata if ytdl fails
        const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
        
        const fallbackFormats = [
          { quality: '1080p', format: 'MP4', codec: 'avc1', downloadUrl: '#', fileSize: 'N/A' },
          { quality: '720p', format: 'MP4', codec: 'avc1', downloadUrl: '#', fileSize: 'N/A' },
          { quality: '480p', format: 'MP4', codec: 'avc1', downloadUrl: '#', fileSize: 'N/A' },
          { quality: 'Audio', format: 'MP3', codec: 'mp3', bitrate: '128kbps', downloadUrl: '#', fileSize: 'N/A' }
        ];

        const metadata = {
          title: 'Video Not Available - Demo Mode',
          duration: '0:00',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          platform: 'youtube',
          videoId: videoId,
          availableFormats: fallbackFormats
        };

        res.json({
          success: true,
          metadata
        });
      }

    } catch (error: any) {
      console.error('Error extracting video metadata:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false,
          error: 'Please provide a valid video URL' 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Failed to extract video metadata. Please try again.' 
      });
    }
  });

  // Universal Video Download Endpoint - All Platforms
  app.post('/api/video-download', async (req, res) => {
    try {
      const { videoUrl, quality } = req.body;
      
      if (!videoUrl || !quality) {
        return res.status(400).json({ error: 'Missing video URL or quality' });
      }

      // Detect platform and use appropriate downloader
      const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
      
      // Sanitize filename function
      const sanitizeFilename = (name: string) => {
        return name
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '_')
          .substring(0, 50);
      };

      if (isYouTube) {
        // Use ytdl-core for YouTube (faster and more reliable)
        const info = await ytdl.getInfo(videoUrl);
        
        // Find matching format intelligently
        let selectedFormat = null;
        
        // First try to find exact match
        selectedFormat = info.formats.find(f => f.qualityLabel === quality);
        
        // If not found, try partial match
        if (!selectedFormat) {
          const qualityNumber = quality.match(/\d+/)?.[0];
          if (qualityNumber) {
            selectedFormat = info.formats.find(f => 
              f.qualityLabel && f.qualityLabel.includes(qualityNumber + 'p')
            );
          }
        }
        
        // If still not found, try by height
        if (!selectedFormat) {
          const qualityNumber = parseInt(quality.match(/\d+/)?.[0] || '0');
          if (qualityNumber > 0) {
            selectedFormat = info.formats.find(f => f.height === qualityNumber);
          }
        }
        
        // If still not found, use highest quality available
        if (!selectedFormat) {
          selectedFormat = info.formats
            .filter(f => f.hasVideo && f.hasAudio)
            .sort((a, b) => (b.height || 0) - (a.height || 0))[0];
        }
        
        if (!selectedFormat) {
          return res.status(404).json({ error: 'No suitable format found' });
        }

        const title = sanitizeFilename(info.videoDetails.title);
        const filename = `${title}-${quality}.${selectedFormat.container || 'mp4'}`;

        // Set proper headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', selectedFormat.mimeType || 'video/mp4');
        
        // Stream directly from ytdl-core
        const videoStream = ytdl(videoUrl, { format: selectedFormat });
        videoStream.pipe(res);
        
        videoStream.on('error', (error) => {
          console.error('YouTube video stream error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Download failed' });
          }
        });

      } else {
        // Use yt-dlp-wrap for all other platforms (Instagram, TikTok, Facebook, Vimeo, etc.)
        try {
          // Try to download the binary first
          try {
            await YTDlpWrap.downloadFromGithub('./yt-dlp');
          } catch (downloadError) {
            console.log('yt-dlp binary already exists or download failed, continuing...');
          }
          
          // Initialize with binary path
          const ytDlpInstance = new YTDlpWrap('./yt-dlp');
          
          // Get video info first to extract title
          const videoInfo = await ytDlpInstance.getVideoInfo(videoUrl);
          const title = sanitizeFilename(videoInfo.title || 'video');
          
          // Determine best format based on quality request
          let formatSelector = 'best';
          if (quality.includes('720')) formatSelector = 'best[height<=720]';
          else if (quality.includes('480')) formatSelector = 'best[height<=480]';
          else if (quality.includes('1080')) formatSelector = 'best[height<=1080]';
          else if (quality === 'audio') formatSelector = 'bestaudio';
          
          // Set headers for download
          res.setHeader('Content-Disposition', `attachment; filename="${title}-${quality}.mp4"`);
          res.setHeader('Content-Type', 'video/mp4');
          
          // Execute yt-dlp with streaming to stdout
          const ytdlpProcess = ytDlpInstance.exec([
            videoUrl,
            '-f', formatSelector,
            '-o', '-',  // Output to stdout for streaming
            '--no-warnings',
            '--no-check-certificates'
          ]);
          
          // Handle the streaming properly
          ytdlpProcess.on('ytDlpEvent', (eventType, eventData) => {
            if (eventType === 'data') {
              res.write(eventData);
            }
          });
          
          ytdlpProcess.on('close', (code) => {
            if (code === 0) {
              res.end();
            } else {
              console.error(`yt-dlp process exited with code ${code}`);
              if (!res.headersSent) {
                res.status(500).json({ error: 'Download failed' });
              }
            }
          });
          
          ytdlpProcess.on('error', (error) => {
            console.error('yt-dlp process error:', error);
            if (!res.headersSent) {
              res.status(500).json({ error: 'Download failed from this platform' });
            }
          });
          
        } catch (ytdlpError) {
          console.error('yt-dlp setup error:', ytdlpError);
          res.status(500).json({ 
            error: 'This platform is not yet supported. We support YouTube fully, with other platforms coming soon.'
          });
        }
      }

    } catch (error) {
      console.error('Video download error:', error);
      res.status(500).json({ error: 'Failed to download video' });
    }
  });

  // Convert Image Format API Endpoint
  app.post('/api/convert-image', imageUpload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const { format, quality = 85 } = req.body;
      const { default: sharp } = await import('sharp');
      
      if (!format) {
        return res.status(400).json({ error: 'Target format is required' });
      }

      let processedBuffer;
      let mimeType;
      let extension;

      // Get original metadata for reference
      const originalMetadata = await sharp(req.file.buffer).metadata();

      const qualityValue = parseInt(quality);

      switch (format.toLowerCase()) {
        case 'png':
          processedBuffer = await sharp(req.file.buffer)
            .png({ 
              compressionLevel: Math.min(9, Math.max(0, Math.floor((100 - qualityValue) / 10))),
              progressive: true
            })
            .toBuffer();
          mimeType = 'image/png';
          extension = 'png';
          break;

        case 'jpeg':
        case 'jpg':
          processedBuffer = await sharp(req.file.buffer)
            .jpeg({ quality: qualityValue, progressive: true })
            .toBuffer();
          mimeType = 'image/jpeg';
          extension = 'jpg';
          break;

        case 'webp':
          processedBuffer = await sharp(req.file.buffer)
            .webp({ quality: qualityValue, effort: 6 })
            .toBuffer();
          mimeType = 'image/webp';
          extension = 'webp';
          break;

        case 'bmp':
          // Convert to proper BMP format using Sharp's raw output and manual BMP header
          const rawImageData = await sharp(req.file.buffer)
            .raw()
            .toBuffer({ resolveWithObject: true });
          
          // Create BMP file manually with proper row padding
          const { data, info } = rawImageData;
          const bmpHeaderSize = 54;
          
          // Calculate row stride with padding (must be multiple of 4 bytes)
          const rowBytes = info.width * 3; // 3 bytes per pixel (RGB)
          const rowStride = Math.ceil(rowBytes / 4) * 4; // Align to 4-byte boundary
          const paddingBytes = rowStride - rowBytes;
          
          const imageSize = rowStride * info.height;
          const fileSize = bmpHeaderSize + imageSize;
          
          // Create BMP buffer
          const bmpBuffer = Buffer.alloc(fileSize);
          
          // BMP File Header
          bmpBuffer.write('BM', 0); // Signature
          bmpBuffer.writeUInt32LE(fileSize, 2); // File size
          bmpBuffer.writeUInt32LE(0, 6); // Reserved
          bmpBuffer.writeUInt32LE(bmpHeaderSize, 10); // Data offset
          
          // BMP Info Header
          bmpBuffer.writeUInt32LE(40, 14); // Info header size
          bmpBuffer.writeUInt32LE(info.width, 18); // Width
          bmpBuffer.writeUInt32LE(info.height, 22); // Height
          bmpBuffer.writeUInt16LE(1, 26); // Planes
          bmpBuffer.writeUInt16LE(24, 28); // Bits per pixel
          bmpBuffer.writeUInt32LE(0, 30); // Compression
          bmpBuffer.writeUInt32LE(imageSize, 34); // Image size
          bmpBuffer.writeUInt32LE(2835, 38); // X pixels per meter
          bmpBuffer.writeUInt32LE(2835, 42); // Y pixels per meter
          bmpBuffer.writeUInt32LE(0, 46); // Colors used
          bmpBuffer.writeUInt32LE(0, 50); // Important colors
          
          // Convert RGBA to BGR and flip vertically (BMP is bottom-up) with proper row padding
          let dstOffset = bmpHeaderSize;
          for (let y = 0; y < info.height; y++) {
            const srcRowStart = (info.height - 1 - y) * info.width * info.channels;
            
            // Copy pixel data for this row
            for (let x = 0; x < info.width; x++) {
              const srcIndex = srcRowStart + (x * info.channels);
              
              bmpBuffer[dstOffset] = data[srcIndex + 2]; // B
              bmpBuffer[dstOffset + 1] = data[srcIndex + 1]; // G  
              bmpBuffer[dstOffset + 2] = data[srcIndex]; // R
              dstOffset += 3;
            }
            
            // Add row padding (fill with zeros)
            for (let p = 0; p < paddingBytes; p++) {
              bmpBuffer[dstOffset] = 0;
              dstOffset++;
            }
          }
          
          processedBuffer = bmpBuffer;
          mimeType = 'image/bmp';
          extension = 'bmp';
          break;

        case 'tiff':
        case 'tif':
          processedBuffer = await sharp(req.file.buffer)
            .tiff({ quality: qualityValue, compression: 'lzw' })
            .toBuffer();
          mimeType = 'image/tiff';
          extension = 'tiff';
          break;

        case 'gif':
          processedBuffer = await sharp(req.file.buffer)
            .gif({ progressive: true })
            .toBuffer();
          mimeType = 'image/gif';
          extension = 'gif';
          break;

        case 'avif':
          processedBuffer = await sharp(req.file.buffer)
            .avif({ quality: qualityValue, effort: 6 })
            .toBuffer();
          mimeType = 'image/avif';
          extension = 'avif';
          break;

        case 'ico':
          // Convert to ICO format with proper sizing
          processedBuffer = await sharp(req.file.buffer)
            .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();
          
          // Create ICO file format manually
          const icoHeaderSize = 6;
          const iconDirSize = 16;
          const pngData = processedBuffer;
          const icoFileSize = icoHeaderSize + iconDirSize + pngData.length;
          
          const icoBuffer = Buffer.alloc(icoFileSize);
          
          // ICO Header
          icoBuffer.writeUInt16LE(0, 0); // Reserved
          icoBuffer.writeUInt16LE(1, 2); // Type (1 = ICO)
          icoBuffer.writeUInt16LE(1, 4); // Number of images
          
          // Icon Directory Entry
          icoBuffer.writeUInt8(0, 6); // Width (0 = 256)
          icoBuffer.writeUInt8(0, 7); // Height (0 = 256)
          icoBuffer.writeUInt8(0, 8); // Color count
          icoBuffer.writeUInt8(0, 9); // Reserved
          icoBuffer.writeUInt16LE(1, 10); // Planes
          icoBuffer.writeUInt16LE(32, 12); // Bits per pixel
          icoBuffer.writeUInt32LE(pngData.length, 14); // Size of image data
          icoBuffer.writeUInt32LE(icoHeaderSize + iconDirSize, 18); // Offset to image data
          
          // Copy PNG data
          pngData.copy(icoBuffer, icoHeaderSize + iconDirSize);
          
          processedBuffer = icoBuffer;
          mimeType = 'image/x-icon';
          extension = 'ico';
          break;


        default:
          return res.status(400).json({ error: `Unsupported format: ${format}` });
      }

      const base64Result = processedBuffer.toString('base64');
      const fileName = req.file.originalname.replace(/\.[^/.]+$/, `.${extension}`);

      // Calculate file size reduction/increase
      const originalSize = req.file.size;
      const newSize = processedBuffer.length;
      const sizeChange = ((newSize - originalSize) / originalSize * 100).toFixed(1);

      res.json({
        success: true,
        originalFormat: req.file.mimetype,
        newFormat: mimeType,
        originalSize: originalSize,
        newSize: newSize,
        sizeChange: `${sizeChange}%`,
        processedImage: `data:${mimeType};base64,${base64Result}`,
        downloadName: fileName
      });

    } catch (error) {
      console.error('Error converting image:', error);
      res.status(500).json({ error: 'Failed to convert image format' });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
