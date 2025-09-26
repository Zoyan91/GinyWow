import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const thumbnails = pgTable("thumbnails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalImageData: text("original_image_data").notNull(), // base64 encoded
  enhancedImageData: text("enhanced_image_data"), // base64 encoded after AI processing
  fileName: text("file_name").notNull(),
  fileSize: real("file_size").notNull(),
  enhancementMetrics: jsonb("enhancement_metrics").$type<{
    contrast: number;
    saturation: number;
    clarity: number;
    ctrImprovement: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const titleOptimizations = pgTable("title_optimizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalTitle: text("original_title").notNull(),
  optimizedTitles: jsonb("optimized_titles").$type<Array<{
    title: string;
    score: number;
    estimatedCtr: number;
    seoScore: number;
    tags: string[];
    reasoning: string;
  }>>().notNull(),
  thumbnailId: varchar("thumbnail_id").references(() => thumbnails.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isActive: varchar("is_active").default("true").notNull(),
  subscriptionDate: timestamp("subscription_date").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const shortUrls = pgTable("short_urls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shortCode: varchar("short_code", { length: 10 }).notNull().unique(),
  originalUrl: text("original_url").notNull(),
  iosDeepLink: text("ios_deep_link").notNull(),
  androidDeepLink: text("android_deep_link").notNull(),
  urlType: varchar("url_type", { length: 20 }).notNull(), // video, channel, playlist, shorts
  createdAt: timestamp("created_at").defaultNow(),
  clickCount: real("click_count").default(0),
});

export const insertThumbnailSchema = createInsertSchema(thumbnails).pick({
  originalImageData: true,
  fileName: true,
  fileSize: true,
});

export const insertTitleOptimizationSchema = createInsertSchema(titleOptimizations).pick({
  originalTitle: true,
  thumbnailId: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export const insertShortUrlSchema = createInsertSchema(shortUrls).pick({
  shortCode: true,
  originalUrl: true,
  iosDeepLink: true,
  androidDeepLink: true,
  urlType: true,
});

export const thumbnailDownloaderSchema = z.object({
  youtubeUrl: z.string()
    .min(1, "Please enter a YouTube URL")
    .url("Please enter a valid URL")
    .refine(
      (url) => /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url),
      "Please enter a valid YouTube URL"
    ),
});


export type InsertThumbnail = z.infer<typeof insertThumbnailSchema>;
export type Thumbnail = typeof thumbnails.$inferSelect;
export type InsertTitleOptimization = z.infer<typeof insertTitleOptimizationSchema>;
export type TitleOptimization = typeof titleOptimizations.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertShortUrl = z.infer<typeof insertShortUrlSchema>;
export type ShortUrl = typeof shortUrls.$inferSelect;
// PDF Processing Tables
export const pdfFiles = pgTable("pdf_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalFileName: text("original_file_name").notNull(),
  fileSize: real("file_size").notNull(),
  fileData: text("file_data").notNull(), // base64 encoded PDF data
  conversionType: varchar("conversion_type", { length: 50 }).notNull(), // pdf-to-word, pdf-merge, etc.
  status: varchar("status", { length: 20 }).default("processing").notNull(), // processing, completed, failed
  outputData: text("output_data"), // base64 encoded output file
  outputFileName: text("output_file_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// PDF Processing Schemas
export const pdfUploadSchema = z.object({
  conversionType: z.enum(["pdf-to-word", "pdf-to-excel", "pdf-merge", "pdf-split", "pdf-compress", "pdf-to-image", "word-to-pdf", "pdf-editor", "pdf-unlock", "pdf-watermark"]),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().positive("File size must be positive"),
  fileData: z.string().min(1, "File data is required"), // base64 data
});

export const pdfMergeSchema = z.object({
  files: z.array(z.object({
    fileName: z.string(),
    fileData: z.string(),
    fileSize: z.number()
  })).min(2, "At least 2 files required for merging"),
});

export const pdfSplitSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileData: z.string().min(1, "File data is required"),
  fileSize: z.number().positive("File size must be positive"),
  pages: z.string().min(1, "Page range is required"), // "1-5" or "1,3,5"
});

export const insertPdfFileSchema = createInsertSchema(pdfFiles).pick({
  originalFileName: true,
  fileSize: true,
  fileData: true,
  conversionType: true,
});

export type ThumbnailDownloaderForm = z.infer<typeof thumbnailDownloaderSchema>;
export type PdfUpload = z.infer<typeof pdfUploadSchema>;
export type PdfMerge = z.infer<typeof pdfMergeSchema>;
export type PdfSplit = z.infer<typeof pdfSplitSchema>;
export type InsertPdfFile = z.infer<typeof insertPdfFileSchema>;
export type PdfFile = typeof pdfFiles.$inferSelect;
