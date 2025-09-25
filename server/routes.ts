import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import sharp from "sharp";
import { storage } from "./storage";
import { insertThumbnailSchema, insertTitleOptimizationSchema, insertNewsletterSubscriptionSchema, insertShortUrlSchema, videoMetadataSchema, pdfUploadSchema, pdfMergeSchema, pdfSplitSchema, insertPdfFileSchema } from "@shared/schema";
import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import pdfParse from "pdf-parse";
import * as mammoth from "mammoth";
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

// Configure multer for PDF tools with higher size limit
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for PDF tools
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Office document files are allowed'));
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



  // Universal Video Metadata API Endpoint - All Platforms
  app.post('/api/video-metadata', async (req, res) => {
    try {
      const { videoUrl } = videoMetadataSchema.parse(req.body);
      
      // Basic URL validation for any platform
      if (!videoUrl || !videoUrl.startsWith('http')) {
        return res.status(400).json({ 
          success: false,
          error: 'Please provide a valid video URL from any platform' 
        });
      }

      // Detect platform and handle accordingly
      const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

      if (isYouTube) {
        // Handle YouTube with ytdl-core
        try {
          const info = await ytdl.getInfo(videoUrl);
          const videoDetails = info.videoDetails;
          
          // Extract available formats - SSYouTube Style with High Quality Support
          // Include both combined and video-only formats for 4K/8K support
          const videoWithAudioFormats = info.formats.filter(format => format.hasVideo && format.hasAudio);
          const videoOnlyFormats = info.formats.filter(format => format.hasVideo && !format.hasAudio);
          const audioFormats = info.formats.filter(format => format.hasAudio && !format.hasVideo);
          
          // Combine all video formats (priority to combined, fallback to video-only for high quality)
          const allVideoFormats = [...videoWithAudioFormats];
          
          // Add high-quality video-only formats (4K, 8K) that don't have combined versions
          videoOnlyFormats.forEach(format => {
            const height = format.height || 0;
            const hasHighQualityCombined = videoWithAudioFormats.some(combined => 
              (combined.height || 0) >= height && height > 720
            );
            
            // Include video-only if it's high quality and no combined version exists
            if (height >= 1080 && !hasHighQualityCombined) {
              allVideoFormats.push(format);
            }
          });
          
          // Create comprehensive format list like SSYouTube
          const availableFormats: any[] = [];
          
          // Video Formats - MP4, WEBM with all qualities including 4K/8K
          const processedQualities = new Set();
          
          allVideoFormats.forEach(format => {
            const height = format.height || 0;
            const qualityLabel = format.qualityLabel;
            const container = format.container;
            
            if (!height && !qualityLabel) return;
            
            // Determine quality based on height or label
            let quality = 'Unknown';
            let qualityGroup = 'SD';
            
            if (height >= 4320 || qualityLabel?.includes('8K')) {
              quality = '8K (4320p)';
              qualityGroup = '8K';
            } else if (height >= 2160 || qualityLabel?.includes('4K') || qualityLabel?.includes('2160')) {
              quality = '4K (2160p)';
              qualityGroup = '4K';
            } else if (height >= 1440 || qualityLabel?.includes('1440')) {
              quality = '2K (1440p)';
              qualityGroup = '2K';
            } else if (height >= 1080 || qualityLabel?.includes('1080')) {
              quality = 'Full HD (1080p)';
              qualityGroup = 'Full HD';
            } else if (height >= 720 || qualityLabel?.includes('720')) {
              quality = 'HD (720p)';
              qualityGroup = 'HD';
            } else if (height >= 480 || qualityLabel?.includes('480')) {
              quality = 'SD (480p)';
              qualityGroup = 'SD';
            } else if (height >= 360 || qualityLabel?.includes('360')) {
              quality = 'SD (360p)';
              qualityGroup = 'SD';
            } else if (height >= 240 || qualityLabel?.includes('240')) {
              quality = 'SD (240p)';
              qualityGroup = 'SD';
            } else if (height >= 144 || qualityLabel?.includes('144')) {
              quality = 'SD (144p)';
              qualityGroup = 'SD';
            }
            
            // Calculate file size
            let fileSize = 'N/A';
            if (format.contentLength) {
              const sizeInMB = parseInt(format.contentLength) / (1024 * 1024);
              fileSize = sizeInMB > 1000 ? 
                `${(sizeInMB / 1024).toFixed(1)} GB` : 
                `${sizeInMB.toFixed(1)} MB`;
            }
            
            // Create format key for uniqueness  
            const videoFormat = container?.toUpperCase() || 'MP4';
            const formatKey = `${quality}-${videoFormat}`;
            
            if (!processedQualities.has(formatKey)) {
              processedQualities.add(formatKey);
              
              availableFormats.push({
                quality: quality,
                qualityGroup: qualityGroup,
                format: videoFormat,
                codec: format.videoCodec || format.codecs || 'H.264',
                bitrate: format.bitrate ? `${Math.round(format.bitrate / 1000)}k` : undefined,
                fps: format.fps || 30,
                fileSize: fileSize,
                downloadUrl: format.url || videoUrl,
                type: 'video',
                height: height,
                hasAudio: format.hasAudio || false,
                note: !format.hasAudio && height >= 1080 ? 'Video only (high quality)' : undefined
              });
              
              // Only add real formats that have actual stream URLs
              // Remove synthetic 3GP generation until proper transcoding is implemented
            }
          });
          
          // Audio Formats - Extract real audio formats from ytdl
          const processedAudioFormats = new Set();
          audioFormats.forEach(format => {
            const abr = format.abr || format.audioBitrate || 128;
            const container = format.container;
            const audioCodec = format.audioCodec || format.codecs;
            
            // Determine format type and quality label
            let formatType = 'M4A';
            let codec = 'AAC';
            let quality = `${abr}kbps Audio`;
            
            if (container === 'webm' || audioCodec?.includes('opus')) {
              formatType = 'WEBM';
              codec = 'Opus';
            } else if (container === 'mp4' || audioCodec?.includes('aac')) {
              formatType = 'M4A';
              codec = 'AAC';
            }
            
            // Calculate file size for audio
            let fileSize = 'N/A';
            if (format.contentLength) {
              const sizeInMB = parseInt(format.contentLength) / (1024 * 1024);
              fileSize = `${sizeInMB.toFixed(1)} MB`;
            }
            
            const formatKey = `${abr}-${formatType}`;
            if (!processedAudioFormats.has(formatKey)) {
              processedAudioFormats.add(formatKey);
              
              availableFormats.push({
                quality: `${formatType} Audio (${abr}kbps)`,
                qualityGroup: 'Audio',
                format: formatType,
                codec: codec,
                bitrate: `${abr}k`,
                fileSize: fileSize,
                downloadUrl: format.url || videoUrl,
                type: 'audio'
              });
            }
          });
          
          // Add fallback audio formats if none were extracted
          if (processedAudioFormats.size === 0) {
            const fallbackAudioFormats = [
              { quality: 'M4A Audio (256kbps)', format: 'M4A', codec: 'AAC', bitrate: '256k' },
              { quality: 'WEBM Audio (128kbps)', format: 'WEBM', codec: 'Opus', bitrate: '128k' }
            ];
            
            fallbackAudioFormats.forEach(audioOption => {
              availableFormats.push({
                quality: audioOption.quality,
                qualityGroup: 'Audio',
                format: audioOption.format,
                codec: audioOption.codec,
                bitrate: audioOption.bitrate,
                fileSize: 'N/A',
                downloadUrl: format.url || videoUrl,
                type: 'audio'
              });
            });
          }
          
          // Sort formats: Video first (highest quality first), then audio
          availableFormats.sort((a, b) => {
            // Videos first, audio last
            if (a.type === 'video' && b.type === 'audio') return -1;
            if (a.type === 'audio' && b.type === 'video') return 1;
            
            // Within videos, sort by height/quality
            if (a.type === 'video' && b.type === 'video') {
              return (b.height || 0) - (a.height || 0);
            }
            
            // Within audio, maintain order
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
          console.error('YouTube YTDL Error:', ytdlError);
          
          // Fallback to basic metadata if ytdl fails
          const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
          const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
          
          const fallbackFormats = [
            { quality: '1080p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: '720p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: '480p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: 'Audio', format: 'MP3', codec: 'mp3', bitrate: '128kbps', downloadUrl: videoUrl, fileSize: 'N/A' }
          ];

          const metadata = {
            title: 'YouTube Video',
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
      } else {
        // Handle other platforms (Instagram, TikTok, Facebook, etc.)
        try {
          // Try to download yt-dlp binary if needed
          try {
            await YTDlpWrap.downloadFromGithub('./yt-dlp');
          } catch (downloadError) {
            console.log('yt-dlp binary already exists or download failed, continuing...');
          }
          
          const ytDlpInstance = new YTDlpWrap('./yt-dlp');
          
          // Get video info for other platforms
          const videoInfo = await ytDlpInstance.getVideoInfo(videoUrl);
          
          // Create platform-specific formats
          const availableFormats = [
            { quality: '1080p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: '720p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: '480p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: 'Audio', format: 'MP3', codec: 'mp3', bitrate: '128kbps', downloadUrl: videoUrl, fileSize: 'N/A' }
          ];

          // Determine platform name
          let platformName = 'unknown';
          if (videoUrl.includes('instagram.com')) platformName = 'instagram';
          else if (videoUrl.includes('tiktok.com')) platformName = 'tiktok';
          else if (videoUrl.includes('facebook.com')) platformName = 'facebook';
          else if (videoUrl.includes('vimeo.com')) platformName = 'vimeo';
          else if (videoUrl.includes('twitter.com') || videoUrl.includes('x.com')) platformName = 'twitter';
          else if (videoUrl.includes('dailymotion.com')) platformName = 'dailymotion';

          // Return metadata for other platforms
          const metadata = {
            title: videoInfo.title || `${platformName.charAt(0).toUpperCase() + platformName.slice(1)} Video`,
            duration: videoInfo.duration || '0:00',
            thumbnail: videoInfo.thumbnail || 'https://via.placeholder.com/480x360.png?text=' + platformName.charAt(0).toUpperCase() + platformName.slice(1) + '+Video',
            platform: platformName,
            videoId: videoUrl, // Use full URL as ID for non-YouTube
            availableFormats: availableFormats
          };

          res.json({ success: true, metadata });

        } catch (ytdlpError) {
          console.error('yt-dlp error for other platform:', ytdlpError);
          
          // Determine platform name for better UX
          let platformName = 'Video Platform';
          if (videoUrl.includes('instagram.com')) platformName = 'Instagram';
          else if (videoUrl.includes('tiktok.com')) platformName = 'TikTok';
          else if (videoUrl.includes('facebook.com')) platformName = 'Facebook';
          else if (videoUrl.includes('vimeo.com')) platformName = 'Vimeo';
          else if (videoUrl.includes('twitter.com') || videoUrl.includes('x.com')) platformName = 'Twitter';
          else if (videoUrl.includes('dailymotion.com')) platformName = 'Dailymotion';
          
          // Fallback for other platforms
          const fallbackFormats = [
            { quality: '1080p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: '720p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: '480p', format: 'MP4', codec: 'avc1', downloadUrl: videoUrl, fileSize: 'N/A' },
            { quality: 'Audio', format: 'MP3', codec: 'mp3', bitrate: '128kbps', downloadUrl: videoUrl, fileSize: 'N/A' }
          ];

          const metadata = {
            title: `${platformName} Video`,
            duration: '0:00',
            thumbnail: 'https://via.placeholder.com/480x360.png?text=' + platformName.replace(' ', '+') + '+Video',
            platform: platformName.toLowerCase().replace(' ', ''),
            videoId: videoUrl,
            availableFormats: fallbackFormats
          };

          res.json({
            success: true,
            metadata
          });
        }
      }

    } catch (error: any) {
      console.error('Error extracting video metadata:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          success: false,
          error: 'Please provide a valid video URL from any platform' 
        });
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Failed to extract video metadata. Please try again with a different URL.' 
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

  // PDF to Word Conversion
  app.post('/api/pdf/convert-to-word', pdfUpload.single('pdf'), async (req, res) => {
    try {
      if (!req.file || req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Please upload a valid PDF file' });
      }

      const base64Data = req.file.buffer.toString('base64');
      
      // Store PDF file in memory
      const pdfFile = await storage.createPdfFile({
        originalFileName: req.file.originalname,
        fileSize: req.file.size,
        fileData: base64Data,
        conversionType: 'pdf-to-word'
      });

      // Extract actual text content from PDF
      try {
        // Extract text from PDF using pdf-parse
        const pdfData = await pdfParse(req.file.buffer);
        const extractedText = pdfData.text.trim();
        
        // Create paragraphs from extracted text
        const paragraphs = [];
        
        // Add title
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({
              text: `Converted from PDF: ${req.file.originalname}`,
              bold: true,
              size: 24
            })
          ]
        }));
        
        // Add a blank line
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
        
        if (extractedText && extractedText.length > 0) {
          // Split text into paragraphs (by double newlines or single newlines if no double found)
          const textParagraphs = extractedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
          
          if (textParagraphs.length === 0) {
            // If no double newlines found, split by single newlines
            const singleLineParagraphs = extractedText.split('\n').filter(p => p.trim().length > 0);
            singleLineParagraphs.forEach(textPara => {
              paragraphs.push(new Paragraph({
                children: [
                  new TextRun({
                    text: textPara.trim(),
                    size: 20
                  })
                ]
              }));
            });
          } else {
            textParagraphs.forEach(textPara => {
              // Clean up the paragraph text
              const cleanText = textPara.trim().replace(/\s+/g, ' ');
              paragraphs.push(new Paragraph({
                children: [
                  new TextRun({
                    text: cleanText,
                    size: 20
                  })
                ]
              }));
            });
          }
        } else {
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({
                text: "No text content could be extracted from this PDF. The PDF may contain only images or be password protected.",
                size: 18,
                italics: true,
                color: "FF0000"
              })
            ]
          }));
        }
        
        // Create Word document with extracted content
        const doc = new Document({
          sections: [{
            properties: {},
            children: paragraphs
          }]
        });

        const buffer = await Packer.toBuffer(doc);
        const outputBase64 = buffer.toString('base64');
        const outputFileName = req.file.originalname.replace('.pdf', '.docx');

        // Update PDF file with conversion result
        await storage.updatePdfFile(pdfFile.id, {
          status: 'completed',
          outputData: outputBase64,
          outputFileName: outputFileName
        });

        res.json({
          success: true,
          message: 'PDF converted to Word successfully',
          fileId: pdfFile.id,
          originalFileName: req.file.originalname,
          convertedFileName: outputFileName,
          downloadUrl: `/api/pdf/download/${pdfFile.id}`
        });

      } catch (conversionError) {
        console.error('PDF conversion error:', conversionError);
        await storage.updatePdfFile(pdfFile.id, { status: 'failed' });
        res.status(500).json({ error: 'Failed to convert PDF to Word' });
      }

    } catch (error) {
      console.error('Error in PDF to Word conversion:', error);
      res.status(500).json({ error: 'Failed to process PDF file' });
    }
  });

  // PDF Merge
  app.post('/api/pdf/merge', pdfUpload.array('pdfs', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
        return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge' });
      }

      const files = req.files as Express.Multer.File[];
      
      // Validate all files are PDFs
      for (const file of files) {
        if (file.mimetype !== 'application/pdf') {
          return res.status(400).json({ error: 'All files must be PDF format' });
        }
      }

      // Create merged PDF
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const pdfDoc = await PDFDocument.load(file.buffer);
        const pageIndices = pdfDoc.getPageIndices();
        
        const pages = await mergedPdf.copyPages(pdfDoc, pageIndices);
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const outputBase64 = Buffer.from(mergedPdfBytes).toString('base64');
      const outputFileName = `merged_${Date.now()}.pdf`;

      // Store merged PDF
      const pdfFile = await storage.createPdfFile({
        originalFileName: files.map(f => f.originalname).join(', '),
        fileSize: mergedPdfBytes.length,
        fileData: outputBase64,
        conversionType: 'pdf-merge'
      });

      await storage.updatePdfFile(pdfFile.id, {
        status: 'completed',
        outputData: outputBase64,
        outputFileName: outputFileName
      });

      res.json({
        success: true,
        message: `Successfully merged ${files.length} PDF files`,
        fileId: pdfFile.id,
        originalFileCount: files.length,
        mergedFileName: outputFileName,
        downloadUrl: `/api/pdf/download/${pdfFile.id}`
      });

    } catch (error) {
      console.error('Error in PDF merge:', error);
      res.status(500).json({ error: 'Failed to merge PDF files' });
    }
  });

  // PDF Download endpoint
  app.get('/api/pdf/download/:fileId', async (req, res) => {
    try {
      const pdfFile = await storage.getPdfFile(req.params.fileId);
      
      if (!pdfFile || !pdfFile.outputData) {
        return res.status(404).json({ error: 'File not found or not ready for download' });
      }

      const fileBuffer = Buffer.from(pdfFile.outputData, 'base64');
      const fileName = pdfFile.outputFileName || 'converted_file.pdf';
      
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length
      });

      res.send(fileBuffer);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
