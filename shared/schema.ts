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

export const insertThumbnailSchema = createInsertSchema(thumbnails).pick({
  originalImageData: true,
  fileName: true,
  fileSize: true,
});

export const insertTitleOptimizationSchema = createInsertSchema(titleOptimizations).pick({
  originalTitle: true,
  thumbnailId: true,
});

export type InsertThumbnail = z.infer<typeof insertThumbnailSchema>;
export type Thumbnail = typeof thumbnails.$inferSelect;
export type InsertTitleOptimization = z.infer<typeof insertTitleOptimizationSchema>;
export type TitleOptimization = typeof titleOptimizations.$inferSelect;
