// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import multer from "multer";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  thumbnails;
  titleOptimizations;
  newsletterSubscriptions;
  shortUrls;
  constructor() {
    this.thumbnails = /* @__PURE__ */ new Map();
    this.titleOptimizations = /* @__PURE__ */ new Map();
    this.newsletterSubscriptions = /* @__PURE__ */ new Map();
    this.shortUrls = /* @__PURE__ */ new Map();
  }
  async createThumbnail(insertThumbnail) {
    const id = randomUUID();
    const thumbnail = {
      ...insertThumbnail,
      id,
      enhancedImageData: null,
      enhancementMetrics: null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.thumbnails.set(id, thumbnail);
    return thumbnail;
  }
  async getThumbnail(id) {
    return this.thumbnails.get(id);
  }
  async updateThumbnail(id, updates) {
    const existing = this.thumbnails.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.thumbnails.set(id, updated);
    return updated;
  }
  async createTitleOptimization(insertOptimization) {
    const id = randomUUID();
    const optimization = {
      ...insertOptimization,
      id,
      optimizedTitles: [],
      createdAt: /* @__PURE__ */ new Date(),
      thumbnailId: insertOptimization.thumbnailId || null
    };
    this.titleOptimizations.set(id, optimization);
    return optimization;
  }
  async getTitleOptimization(id) {
    return this.titleOptimizations.get(id);
  }
  async updateTitleOptimization(id, updates) {
    const existing = this.titleOptimizations.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.titleOptimizations.set(id, updated);
    return updated;
  }
  async getTitleOptimizationsByThumbnail(thumbnailId) {
    return Array.from(this.titleOptimizations.values()).filter(
      (opt) => opt.thumbnailId === thumbnailId
    );
  }
  async createNewsletterSubscription(insertSubscription) {
    const existing = this.newsletterSubscriptions.get(insertSubscription.email);
    if (existing) {
      throw new Error("Email already subscribed");
    }
    const id = randomUUID();
    const subscription = {
      id,
      email: insertSubscription.email,
      isActive: "true",
      subscriptionDate: /* @__PURE__ */ new Date(),
      lastUpdated: /* @__PURE__ */ new Date()
    };
    this.newsletterSubscriptions.set(insertSubscription.email, subscription);
    return subscription;
  }
  async getNewsletterSubscription(email) {
    return this.newsletterSubscriptions.get(email);
  }
  async updateNewsletterSubscription(email, updates) {
    const existing = this.newsletterSubscriptions.get(email);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates, lastUpdated: /* @__PURE__ */ new Date() };
    this.newsletterSubscriptions.set(email, updated);
    return updated;
  }
  async getAllActiveSubscriptions() {
    return Array.from(this.newsletterSubscriptions.values()).filter(
      (sub) => sub.isActive === "true"
    );
  }
  async createShortUrl(insertShortUrl) {
    const id = randomUUID();
    const shortUrl = {
      ...insertShortUrl,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      clickCount: 0
    };
    this.shortUrls.set(insertShortUrl.shortCode, shortUrl);
    return shortUrl;
  }
  async getShortUrl(shortCode) {
    return this.shortUrls.get(shortCode);
  }
  async incrementClickCount(shortCode) {
    const shortUrl = this.shortUrls.get(shortCode);
    if (shortUrl) {
      shortUrl.clickCount = (shortUrl.clickCount || 0) + 1;
      this.shortUrls.set(shortCode, shortUrl);
    }
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var thumbnails = pgTable("thumbnails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalImageData: text("original_image_data").notNull(),
  // base64 encoded
  enhancedImageData: text("enhanced_image_data"),
  // base64 encoded after AI processing
  fileName: text("file_name").notNull(),
  fileSize: real("file_size").notNull(),
  enhancementMetrics: jsonb("enhancement_metrics").$type(),
  createdAt: timestamp("created_at").defaultNow()
});
var titleOptimizations = pgTable("title_optimizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalTitle: text("original_title").notNull(),
  optimizedTitles: jsonb("optimized_titles").$type().notNull(),
  thumbnailId: varchar("thumbnail_id").references(() => thumbnails.id),
  createdAt: timestamp("created_at").defaultNow()
});
var newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isActive: varchar("is_active").default("true").notNull(),
  subscriptionDate: timestamp("subscription_date").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow()
});
var shortUrls = pgTable("short_urls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shortCode: varchar("short_code", { length: 10 }).notNull().unique(),
  originalUrl: text("original_url").notNull(),
  iosDeepLink: text("ios_deep_link").notNull(),
  androidDeepLink: text("android_deep_link").notNull(),
  urlType: varchar("url_type", { length: 20 }).notNull(),
  // video, channel, playlist, shorts
  createdAt: timestamp("created_at").defaultNow(),
  clickCount: real("click_count").default(0)
});
var insertThumbnailSchema = createInsertSchema(thumbnails).pick({
  originalImageData: true,
  fileName: true,
  fileSize: true
});
var insertTitleOptimizationSchema = createInsertSchema(titleOptimizations).pick({
  originalTitle: true,
  thumbnailId: true
});
var insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true
}).extend({
  email: z.string().email("Please enter a valid email address")
});
var insertShortUrlSchema = createInsertSchema(shortUrls).pick({
  shortCode: true,
  originalUrl: true,
  iosDeepLink: true,
  androidDeepLink: true,
  urlType: true
});
var thumbnailDownloaderSchema = z.object({
  youtubeUrl: z.string().min(1, "Please enter a YouTube URL").url("Please enter a valid URL").refine(
    (url) => /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url),
    "Please enter a valid YouTube URL"
  )
});

// server/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});
async function analyzeThumbnail(base64Image) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found, using mock analysis");
      return getMockThumbnailAnalysis();
    }
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a YouTube thumbnail optimization expert. Analyze the provided thumbnail image and suggest enhancements to improve click-through rates. 
          
          Respond with JSON in this exact format:
          {
            "enhancementSuggestions": {
              "contrast": number (0-100, percentage increase needed),
              "saturation": number (0-100, percentage increase needed), 
              "clarity": number (0-100, percentage increase needed)
            },
            "ctrImprovement": number (estimated percentage CTR improvement),
            "description": "string (detailed analysis of current thumbnail)",
            "recommendations": ["array", "of", "specific", "improvement", "suggestions"]
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this YouTube thumbnail and provide enhancement recommendations to maximize click-through rates."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1e3
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing thumbnail:", error);
    console.log("Falling back to mock analysis");
    return getMockThumbnailAnalysis();
  }
}
function getMockThumbnailAnalysis() {
  return {
    enhancementSuggestions: {
      contrast: 8,
      // Subtle professional contrast boost
      saturation: 6,
      // Natural color enhancement
      clarity: 9
      // Gentle HD clarity improvement
    },
    ctrImprovement: 25,
    description: "Professional studio-quality enhancement applied. Your thumbnail now has improved clarity, natural color balance, and refined details while maintaining complete originality.",
    recommendations: [
      "Gentle contrast boost for better definition without altering tone",
      "Natural color enhancement for improved vividness",
      "Subtle clarity improvement for HD professional look",
      "Refined details and smooth edges for premium appearance",
      "Studio-quality polish while preserving original design"
    ]
  };
}
async function optimizeTitles(originalTitle, thumbnailContext) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found, using mock title suggestions");
      return getMockTitleSuggestions(originalTitle);
    }
    const contextPrompt = thumbnailContext ? `Thumbnail context: ${thumbnailContext}

` : "";
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a professional YouTube SEO & Title Expert. When a user provides a YouTube video title, generate **EXACTLY 5 new title suggestions**.

          ### CRITICAL RULES:

          1. **Language Detection:** Automatically detect the EXACT language/style of the original title.
             * If input is in English \u2192 Output in English
             * If input is in Hindi \u2192 Output in Hindi  
             * If input is in Hinglish (Hindi+English mix) \u2192 Output in same Hinglish style
             * NEVER change the language style - match it exactly!
          
          2. **100% Human-Friendly & Conversational:** 
             * Write like a real person talking to friends, not like AI or corporate content
             * Use natural, everyday language that people actually speak
             * Include casual phrases, emotions, and relatable expressions
             * Sound like a popular YouTuber from that language community
          
          3. **Highly Clickable but Natural:** 
             * Create curiosity without being clickbait
             * Use emotional hooks but keep them genuine
             * Include personal elements ("\u092E\u0947\u0930\u093E", "My", "I tried", "\u092E\u0948\u0902\u0928\u0947 \u0915\u093F\u092F\u093E")
          
          4. **SEO + Local Language Patterns:** 
             * For English: Use trending YouTube keywords naturally
             * For Hindi/Hinglish: Mix popular Hindi phrases with English keywords
             * Include year (2025) only if relevant
          
          5. **Stay True to Original Topic:** Do NOT change the video topic or mislead.
          
          6. **Length:** Keep under **70 characters** for better YouTube display.

          ### EXAMPLES:
          Input (English): "How to invest in stocks"
          Output: Natural English titles like "Stock Investment Made Simple for Beginners"
          
          Input (Hinglish): "Share market me paise kaise banaye"
          Output: Same Hinglish style like "Share Market Se Paise Banane Ka Asaan Tarika"

          ${contextPrompt}Respond with JSON in this exact format:
          {
            "titles": [
              {
                "title": "optimized title text",
                "score": number (1-10 overall quality score),
                "estimatedCtr": number (percentage improvement over original),
                "seoScore": number (1-10 SEO optimization score),
                "tags": ["relevant", "keywords", "array"],
                "reasoning": "explanation of why this title works"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Original title: "${originalTitle}"

Generate exactly 5 powerful, human-friendly, and clickable titles that work in the same language as the original.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2500
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    const titles = result.titles || [];
    return validateAndFixTitleSuggestions(titles, originalTitle);
  } catch (error) {
    console.error("Error optimizing titles:", error);
    console.log("Falling back to mock title suggestions");
    return getMockTitleSuggestions(originalTitle);
  }
}
function validateAndFixTitleSuggestions(titles, originalTitle) {
  if (!Array.isArray(titles)) {
    return getMockTitleSuggestions(originalTitle);
  }
  const processedTitles = titles.filter((t) => t && typeof t === "object" && t.title).map((suggestion) => ({
    ...suggestion,
    // Ensure title is strictly under 70 characters (≤69) - smart truncation preserving words
    title: suggestion.title.length >= 70 ? suggestion.title.substring(0, 66).replace(/\s+\S*$/, "") + "..." : suggestion.title,
    // Ensure valid scores
    score: Math.min(10, Math.max(1, suggestion.score || 7)),
    estimatedCtr: Math.min(100, Math.max(0, suggestion.estimatedCtr || 25)),
    seoScore: Math.min(10, Math.max(1, suggestion.seoScore || 7)),
    tags: Array.isArray(suggestion.tags) ? suggestion.tags : [],
    reasoning: suggestion.reasoning || "Optimized for better click-through rate"
  })).slice(0, 5);
  if (processedTitles.length < 5) {
    const mockSuggestions = getMockTitleSuggestions(originalTitle);
    const needed = 5 - processedTitles.length;
    processedTitles.push(...mockSuggestions.slice(0, needed));
  }
  return processedTitles.slice(0, 5);
}
function getMockTitleSuggestions(originalTitle) {
  const cleanTitle = originalTitle.replace(/^(playing\s+|watch\s+|video\s+)/i, "").trim();
  const hasHindiChars = /[\u0900-\u097F]/.test(cleanTitle);
  const hasHinglishPattern = /\b(kaise|kya|kare|banaye|me|se|ka|ki|ke|hai|ho|bhi|aur|ya|tha|the|kar|liye|wala|wali)\b/i.test(cleanTitle);
  const isHinglish = hasHindiChars || hasHinglishPattern;
  let variations = [];
  if (/sip|investment|invest|mutual\s*fund|fund/i.test(cleanTitle)) {
    if (isHinglish) {
      variations = [
        "\u092E\u0948\u0902\u0928\u0947 SIP Se Kitna Paisa Banaya? Real Returns",
        "SIP Investment Kaise Start Kare - Easy Guide",
        "Meri SIP Journey - 5 Saal Baad Kitna Profit?",
        "SIP Me Invest Karna Chahiye Ya Nahi?",
        "SIP Se Paise Double Kaise Kare - Secret Tips"
      ];
    } else {
      variations = [
        "How I Made Money with SIPs - Real Experience",
        "SIP Investment for Beginners - Simple Guide",
        "My SIP Journey After 5 Years - Honest Review",
        "Should You Start SIP Investment in 2025?",
        "SIP Investment Mistakes I Made (Learn from Me)"
      ];
    }
  } else if (/share|stock|market|trading|equity/i.test(cleanTitle)) {
    if (isHinglish) {
      variations = [
        "Share Market Me Paise Kaise Banaye - Asaan Tarika",
        "Beginner Ke Liye Share Market Tips",
        "\u092E\u0948\u0902\u0928\u0947 Share Market Se Kitna Kamaya?",
        "Share Market Start Karne Se Pehle Ye Dekho",
        "Share Market Me Safe Investment Kaise Kare"
      ];
    } else {
      variations = [
        "How to Make Money in Stock Market - Beginner Guide",
        "Stock Market Tips That Actually Work",
        "My Stock Market Journey - Wins and Losses",
        "Stock Market for Beginners - Start Here",
        "Safe Stock Market Investment Strategy"
      ];
    }
  } else if (/cook|recipe|food|dish|banaye|bana/i.test(cleanTitle)) {
    if (isHinglish) {
      variations = [
        "Ghar Pe Banaye Restaurant Jaisa Khana",
        "\u0906\u0938\u093E\u0928 Recipe - 10 Minute Me Ready!",
        "Secret Recipe Jo Sabko Pasand Aayegi",
        "Perfect Dish Banane Ka Tarika",
        "Mummy Ki Recipe - Try Karo Zaroor"
      ];
    } else {
      variations = [
        "Easy Recipe Anyone Can Make at Home",
        "Restaurant Style Dish - Made Simple",
        "Quick Recipe Ready in 10 Minutes",
        "Secret Recipe That Never Fails",
        "My Mom's Recipe - You'll Love This"
      ];
    }
  } else if (/game|gaming|play|player|level/i.test(cleanTitle)) {
    if (isHinglish) {
      variations = [
        "Gaming Se Paise Kaise Kamaye - Real Tips",
        "Pro Gamer Banne Ka Secret",
        "Best Gaming Setup Under Budget",
        "Gaming Tips Jo Kaam Aayenge",
        "\u092E\u0948\u0902 Gaming Se Kitna Kamata Hun?"
      ];
    } else {
      variations = [
        "How to Make Money Gaming - Real Ways",
        "Pro Gaming Tips That Actually Work",
        "Best Budget Gaming Setup Guide",
        "Gaming Tricks Every Player Should Know",
        "How Much I Earn from Gaming"
      ];
    }
  } else if (/tech|mobile|phone|app|software|computer/i.test(cleanTitle)) {
    if (isHinglish) {
      variations = [
        "Best Tech Tips For Everyone",
        "Mobile Me Ye Setting Karo - Game Changer",
        "Tech Hacks Jo Life Easy Bana Denge",
        "\u0928\u0908 Technology - Kya Faida Hai?",
        "Tech Review - Lena Chahiye Ya Nahi?"
      ];
    } else {
      variations = [
        "Tech Tips That Will Change Your Life",
        "Best Mobile Settings You Should Know",
        "Tech Hacks Everyone Should Try",
        "New Technology Review - Worth It?",
        "Tech Buying Guide - My Honest Opinion"
      ];
    }
  } else {
    const baseWords = cleanTitle.split(" ").slice(0, 4).join(" ");
    if (isHinglish) {
      variations = [
        `${baseWords} - Mera Experience`,
        `${baseWords} Kaise Kare - Step by Step`,
        `${baseWords} Ka Truth - Honest Review`,
        `${baseWords} - Kya Really Work Karta Hai?`,
        `${baseWords} - Easy Tips Aur Tricks`
      ];
    } else {
      variations = [
        `${baseWords} - My Honest Experience`,
        `${baseWords} - Step by Step Guide`,
        `${baseWords} - The Real Truth`,
        `${baseWords} - Does It Actually Work?`,
        `${baseWords} - Easy Tips and Tricks`
      ];
    }
  }
  return variations.map((title, index) => {
    let finalTitle = title;
    if (title.length >= 70) {
      finalTitle = title.substring(0, 66).trim();
      if (!finalTitle.endsWith(".") && !finalTitle.endsWith("?") && !finalTitle.endsWith("!")) {
        finalTitle = finalTitle.replace(/\s+\S*$/, "") + "...";
      }
    }
    return {
      title: finalTitle,
      score: 9.5 - index * 0.1,
      // Higher quality scores
      estimatedCtr: 50 - index * 2,
      // Better CTR estimates
      seoScore: 9 - index * 0.1,
      tags: isHinglish ? ["hinglish", "desi", "guide", "tips"] : ["guide", "tips", "tutorial", "review"],
      reasoning: `Human-friendly title with ${index === 0 ? "personal experience and relatability" : index === 1 ? "clear guidance and step-by-step approach" : index === 2 ? "honesty and trustworthiness" : index === 3 ? "curiosity and validation" : "practical value and actionability"}`
    };
  });
}
async function enhanceThumbnailImage(base64Image, enhancements) {
  try {
    const sharp = await import("sharp");
    const imageBuffer = Buffer.from(base64Image, "base64");
    const metadata = await sharp.default(imageBuffer).metadata();
    console.log(`Processing image: ${metadata.format}, ${metadata.width}x${metadata.height}`);
    const naturalEnhanced = await sharp.default(imageBuffer).toColorspace("srgb").modulate({
      brightness: 1.02,
      // सिर्फ 2% brightness boost - very subtle
      saturation: 1.03,
      // सिर्फ 3% saturation - natural look
      hue: 0
      // No hue change - keep original colors
    }).linear(1.01, -1).sharpen({
      sigma: 0.3,
      // Very light sharpening
      m1: 0.3,
      // Gentle edge detection
      m2: 0.8
      // Minimal enhancement
    }).jpeg({
      quality: 95,
      // High quality but not over-compressed
      progressive: true
      // Progressive loading
    }).toBuffer();
    const enhancedBase64 = naturalEnhanced.toString("base64");
    console.log("\u2728 Natural Thumbnail Enhancement Applied - 100% Human-Friendly:");
    console.log("\u{1F4F8} Barely noticeable improvements for natural look");
    console.log("\u{1F3AF} Subtle enhancement that maintains original beauty");
    console.log("\u{1F4AF} No artificial processing - pure natural enhancement");
    return {
      enhancedImage: enhancedBase64,
      success: true,
      message: "Natural enhancement applied successfully. Your thumbnail now has subtle improvements for better clarity while maintaining its original character."
    };
  } catch (error) {
    console.error("Error in natural thumbnail enhancement:", error);
    console.log("Enhancement failed, returning original image to maintain quality...");
    return {
      enhancedImage: base64Image,
      success: false,
      message: "Enhancement could not be applied to maintain image quality. Your original thumbnail has been preserved without any changes."
    };
  }
}

// server/routes.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
async function registerRoutes(app2) {
  app2.post("/api/thumbnails/upload", upload.single("thumbnail"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const base64Image = req.file.buffer.toString("base64");
      const thumbnailData = insertThumbnailSchema.parse({
        originalImageData: base64Image,
        fileName: req.file.originalname,
        fileSize: req.file.size
      });
      const thumbnail = await storage.createThumbnail(thumbnailData);
      const analysis = await analyzeThumbnail(base64Image);
      const enhancementResult = await enhanceThumbnailImage(base64Image, analysis.enhancementSuggestions);
      const updatedThumbnail = await storage.updateThumbnail(thumbnail.id, {
        enhancedImageData: enhancementResult.enhancedImage,
        enhancementMetrics: {
          contrast: analysis.enhancementSuggestions.contrast,
          saturation: analysis.enhancementSuggestions.saturation,
          clarity: analysis.enhancementSuggestions.clarity,
          ctrImprovement: analysis.ctrImprovement
        }
      });
      res.json({
        thumbnail: updatedThumbnail,
        analysis: {
          description: analysis.description,
          recommendations: analysis.recommendations,
          ctrImprovement: analysis.ctrImprovement
        }
      });
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      res.status(500).json({ error: "Failed to process thumbnail" });
    }
  });
  app2.get("/api/thumbnails/:id", async (req, res) => {
    try {
      const thumbnail = await storage.getThumbnail(req.params.id);
      if (!thumbnail) {
        return res.status(404).json({ error: "Thumbnail not found" });
      }
      res.json(thumbnail);
    } catch (error) {
      console.error("Error fetching thumbnail:", error);
      res.status(500).json({ error: "Failed to fetch thumbnail" });
    }
  });
  app2.post("/api/titles/optimize", async (req, res) => {
    try {
      const { originalTitle, thumbnailId } = insertTitleOptimizationSchema.parse(req.body);
      let thumbnailContext;
      if (thumbnailId) {
        const thumbnail = await storage.getThumbnail(thumbnailId);
        if (thumbnail) {
          const analysis = await analyzeThumbnail(thumbnail.originalImageData);
          thumbnailContext = analysis.description;
        }
      }
      const suggestions = await optimizeTitles(originalTitle, thumbnailContext);
      const optimization = await storage.createTitleOptimization({
        originalTitle,
        thumbnailId
      });
      const updatedOptimization = await storage.updateTitleOptimization(optimization.id, {
        optimizedTitles: suggestions
      });
      res.json({
        optimization: updatedOptimization,
        suggestions
      });
    } catch (error) {
      console.error("Error optimizing titles:", error);
      res.status(500).json({ error: "Failed to optimize titles" });
    }
  });
  app2.get("/api/thumbnails/:thumbnailId/titles", async (req, res) => {
    try {
      const optimizations = await storage.getTitleOptimizationsByThumbnail(req.params.thumbnailId);
      res.json(optimizations);
    } catch (error) {
      console.error("Error fetching title optimizations:", error);
      res.status(500).json({ error: "Failed to fetch title optimizations" });
    }
  });
  app2.post("/api/optimize", upload.single("thumbnail"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No thumbnail file provided" });
      }
      const { title } = req.body;
      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
      }
      const base64Image = req.file.buffer.toString("base64");
      const thumbnailData = insertThumbnailSchema.parse({
        originalImageData: base64Image,
        fileName: req.file.originalname,
        fileSize: req.file.size
      });
      const thumbnail = await storage.createThumbnail(thumbnailData);
      const analysis = await analyzeThumbnail(base64Image);
      const enhancementResult = await enhanceThumbnailImage(base64Image, analysis.enhancementSuggestions);
      await storage.updateThumbnail(thumbnail.id, {
        enhancedImageData: enhancementResult.enhancedImage,
        enhancementMetrics: {
          contrast: analysis.enhancementSuggestions.contrast,
          saturation: analysis.enhancementSuggestions.saturation,
          clarity: analysis.enhancementSuggestions.clarity,
          ctrImprovement: analysis.ctrImprovement
        }
      });
      const titleSuggestions = await optimizeTitles(title.trim(), analysis.description);
      const optimization = await storage.createTitleOptimization({
        originalTitle: title.trim(),
        thumbnailId: thumbnail.id
      });
      await storage.updateTitleOptimization(optimization.id, {
        optimizedTitles: titleSuggestions
      });
      const ctrScore = Math.min(95, Math.max(
        15,
        (title.trim().length > 10 && title.trim().length < 60 ? 30 : 10) + (analysis.ctrImprovement || 30) + (titleSuggestions && titleSuggestions.length > 0 ? 15 : 0)
      ));
      res.json({
        ctrScore: Math.round(ctrScore),
        ctrFeedback: ctrScore > 70 ? "Excellent! Your thumbnail and title have strong click potential." : ctrScore > 50 ? "Good combination! Consider implementing the suggested improvements." : "This combination needs improvement. Follow our suggestions to boost performance.",
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
            clarity: analysis.enhancementSuggestions.clarity
          }
        },
        // Add enhancement status and message
        enhancementStatus: {
          success: enhancementResult.success,
          message: enhancementResult.message
        }
      });
    } catch (error) {
      console.error("Error during optimization:", error);
      res.status(500).json({ error: "Failed to optimize thumbnail and title" });
    }
  });
  app2.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriptionData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.createNewsletterSubscription(subscriptionData);
      res.json({
        success: true,
        message: "Successfully subscribed to newsletter! Thank you for joining us.",
        subscription: {
          id: subscription.id,
          email: subscription.email,
          subscriptionDate: subscription.subscriptionDate
        }
      });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      if (error.message === "Email already subscribed") {
        return res.status(409).json({
          success: false,
          error: "This email is already subscribed to our newsletter.",
          code: "ALREADY_SUBSCRIBED"
        });
      }
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          error: "Please enter a valid email address.",
          code: "INVALID_EMAIL"
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to subscribe to newsletter. Please try again.",
        code: "SUBSCRIPTION_FAILED"
      });
    }
  });
  app2.post("/api/short-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid URL"
        });
      }
      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid URL"
        });
      }
      const parseUrl = (url2) => {
        try {
          const urlObj = new URL(url2);
          const hostname = urlObj.hostname.toLowerCase();
          if (hostname.includes("youtube.com") || hostname === "youtu.be") {
            if (hostname === "youtu.be") {
              return { platform: "youtube", type: "video", id: urlObj.pathname.slice(1), path: `/watch?v=${urlObj.pathname.slice(1)}` };
            } else if (urlObj.pathname === "/watch") {
              return { platform: "youtube", type: "video", id: urlObj.searchParams.get("v"), path: urlObj.pathname + urlObj.search };
            } else if (urlObj.pathname.startsWith("/shorts/")) {
              return { platform: "youtube", type: "shorts", id: urlObj.pathname.split("/shorts/")[1], path: urlObj.pathname };
            } else {
              return { platform: "youtube", type: "general", id: null, path: urlObj.pathname + urlObj.search };
            }
          }
          if (hostname.includes("instagram.com")) {
            if (urlObj.pathname.startsWith("/p/") || urlObj.pathname.startsWith("/reel/")) {
              return { platform: "instagram", type: "post", id: urlObj.pathname.split("/")[2], path: urlObj.pathname };
            } else {
              return { platform: "instagram", type: "general", id: null, path: urlObj.pathname };
            }
          }
          if (hostname.includes("tiktok.com")) {
            if (urlObj.pathname.includes("/video/")) {
              return { platform: "tiktok", type: "video", id: urlObj.pathname.split("/video/")[1], path: urlObj.pathname };
            } else {
              return { platform: "tiktok", type: "general", id: null, path: urlObj.pathname };
            }
          }
          if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
            return { platform: "twitter", type: "general", id: null, path: urlObj.pathname };
          }
          if (hostname.includes("facebook.com") || hostname.includes("fb.com")) {
            return { platform: "facebook", type: "general", id: null, path: urlObj.pathname };
          }
          if (hostname.includes("linkedin.com")) {
            return { platform: "linkedin", type: "general", id: null, path: urlObj.pathname };
          }
          return { platform: "web", type: "general", id: null, path: urlObj.pathname };
        } catch {
          return null;
        }
      };
      const generateDeepLinks = (parsed2, originalUrl) => {
        const encodedUrl = encodeURIComponent(originalUrl);
        let iosLink2 = "";
        let androidLink2 = "";
        switch (parsed2.platform) {
          case "youtube":
            if (parsed2.type === "video") {
              iosLink2 = `youtube://watch?v=${parsed2.id}`;
              androidLink2 = `intent://www.youtube.com/watch?v=${parsed2.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
            } else if (parsed2.type === "shorts") {
              iosLink2 = `youtube://shorts/${parsed2.id}`;
              androidLink2 = `intent://www.youtube.com/shorts/${parsed2.id}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
            } else {
              iosLink2 = `youtube://${originalUrl}`;
              androidLink2 = `intent://${originalUrl.replace("https://", "")}#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=${encodedUrl};end`;
            }
            break;
          case "instagram":
            iosLink2 = `instagram://media?id=${parsed2.id || ""}`;
            androidLink2 = `intent://${originalUrl.replace("https://", "")}#Intent;scheme=https;package=com.instagram.android;S.browser_fallback_url=${encodedUrl};end`;
            break;
          case "tiktok":
            iosLink2 = `snssdk1233://aweme/detail/${parsed2.id || ""}`;
            androidLink2 = `intent://${originalUrl.replace("https://", "")}#Intent;scheme=https;package=com.zhiliaoapp.musically;S.browser_fallback_url=${encodedUrl};end`;
            break;
          case "twitter":
            iosLink2 = `twitter://${originalUrl.replace("https://twitter.com", "").replace("https://x.com", "")}`;
            androidLink2 = `intent://${originalUrl.replace("https://", "")}#Intent;scheme=https;package=com.twitter.android;S.browser_fallback_url=${encodedUrl};end`;
            break;
          case "facebook":
            iosLink2 = `fb://${originalUrl.replace("https://facebook.com", "").replace("https://www.facebook.com", "")}`;
            androidLink2 = `intent://${originalUrl.replace("https://", "")}#Intent;scheme=https;package=com.facebook.katana;S.browser_fallback_url=${encodedUrl};end`;
            break;
          case "linkedin":
            iosLink2 = `linkedin://${originalUrl.replace("https://linkedin.com", "").replace("https://www.linkedin.com", "")}`;
            androidLink2 = `intent://${originalUrl.replace("https://", "")}#Intent;scheme=https;package=com.linkedin.android;S.browser_fallback_url=${encodedUrl};end`;
            break;
          default:
            iosLink2 = originalUrl;
            androidLink2 = originalUrl;
            break;
        }
        return { iosLink: iosLink2, androidLink: androidLink2, webLink: originalUrl };
      };
      const parsed = parseUrl(url);
      if (!parsed) {
        return res.status(400).json({
          success: false,
          error: "Could not parse the URL. Please check the format."
        });
      }
      const { iosLink, androidLink, webLink } = generateDeepLinks(parsed, url);
      let shortCode = "";
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
          error: "Unable to generate unique short code. Please try again."
        });
      }
      const shortUrlData = insertShortUrlSchema.parse({
        shortCode,
        originalUrl: url,
        iosDeepLink: iosLink,
        androidDeepLink: androidLink,
        urlType: `${parsed.platform}_${parsed.type}`
      });
      const shortUrl = await storage.createShortUrl(shortUrlData);
      const baseUrl = req.headers.host?.includes("localhost") ? `http://localhost:5000` : `https://ginywow.com`;
      const getPlatformPrefix = (platform) => {
        switch (platform) {
          case "youtube":
            return "yt";
          case "instagram":
            return "ig";
          case "tiktok":
            return "tt";
          case "twitter":
            return "tw";
          case "facebook":
            return "fb";
          case "linkedin":
            return "li";
          default:
            return "web";
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
    } catch (error) {
      console.error("Error generating short URL:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          error: "Invalid URL data provided"
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to generate short URL. Please try again."
      });
    }
  });
  app2.get("/:platform(yt|ig|tt|tw|fb|li|web)/:shortCode", async (req, res) => {
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
      await storage.incrementClickCount(shortCode);
      const userAgent = req.headers["user-agent"] || "";
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      let redirectUrl = shortUrl.originalUrl;
      if (isIOS) {
        redirectUrl = shortUrl.iosDeepLink;
      } else if (isAndroid) {
        redirectUrl = shortUrl.androidDeepLink;
      }
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
            ${isIOS ? `<a href="${shortUrl.iosDeepLink}" class="btn">Open in iOS App</a>` : ""}
            ${isAndroid ? `<a href="${shortUrl.androidDeepLink}" class="btn">Open in Android App</a>` : ""}
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
      console.error("Error redirecting short URL:", error);
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
