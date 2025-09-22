import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertThumbnailSchema, insertTitleOptimizationSchema } from "@shared/schema";
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
      const enhancedImageData = await enhanceThumbnailImage(base64Image, analysis.enhancementSuggestions);

      // Update thumbnail with analysis results
      const updatedThumbnail = await storage.updateThumbnail(thumbnail.id, {
        enhancedImageData,
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

  const httpServer = createServer(app);
  return httpServer;
}
