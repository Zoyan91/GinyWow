import { type Thumbnail, type InsertThumbnail, type TitleOptimization, type InsertTitleOptimization } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Thumbnail operations
  createThumbnail(thumbnail: InsertThumbnail): Promise<Thumbnail>;
  getThumbnail(id: string): Promise<Thumbnail | undefined>;
  updateThumbnail(id: string, updates: Partial<Thumbnail>): Promise<Thumbnail | undefined>;
  
  // Title optimization operations
  createTitleOptimization(optimization: InsertTitleOptimization): Promise<TitleOptimization>;
  getTitleOptimization(id: string): Promise<TitleOptimization | undefined>;
  updateTitleOptimization(id: string, updates: Partial<TitleOptimization>): Promise<TitleOptimization | undefined>;
  getTitleOptimizationsByThumbnail(thumbnailId: string): Promise<TitleOptimization[]>;
}

export class MemStorage implements IStorage {
  private thumbnails: Map<string, Thumbnail>;
  private titleOptimizations: Map<string, TitleOptimization>;

  constructor() {
    this.thumbnails = new Map();
    this.titleOptimizations = new Map();
  }

  async createThumbnail(insertThumbnail: InsertThumbnail): Promise<Thumbnail> {
    const id = randomUUID();
    const thumbnail: Thumbnail = {
      ...insertThumbnail,
      id,
      enhancedImageData: null,
      enhancementMetrics: null,
      createdAt: new Date(),
    };
    this.thumbnails.set(id, thumbnail);
    return thumbnail;
  }

  async getThumbnail(id: string): Promise<Thumbnail | undefined> {
    return this.thumbnails.get(id);
  }

  async updateThumbnail(id: string, updates: Partial<Thumbnail>): Promise<Thumbnail | undefined> {
    const existing = this.thumbnails.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.thumbnails.set(id, updated);
    return updated;
  }

  async createTitleOptimization(insertOptimization: InsertTitleOptimization): Promise<TitleOptimization> {
    const id = randomUUID();
    const optimization: TitleOptimization = {
      ...insertOptimization,
      id,
      optimizedTitles: [],
      createdAt: new Date(),
      thumbnailId: insertOptimization.thumbnailId || null,
    };
    this.titleOptimizations.set(id, optimization);
    return optimization;
  }

  async getTitleOptimization(id: string): Promise<TitleOptimization | undefined> {
    return this.titleOptimizations.get(id);
  }

  async updateTitleOptimization(id: string, updates: Partial<TitleOptimization>): Promise<TitleOptimization | undefined> {
    const existing = this.titleOptimizations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.titleOptimizations.set(id, updated);
    return updated;
  }

  async getTitleOptimizationsByThumbnail(thumbnailId: string): Promise<TitleOptimization[]> {
    return Array.from(this.titleOptimizations.values()).filter(
      opt => opt.thumbnailId === thumbnailId
    );
  }
}

export const storage = new MemStorage();
