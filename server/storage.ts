import { type Thumbnail, type InsertThumbnail, type TitleOptimization, type InsertTitleOptimization, type Newsletter, type InsertNewsletter } from "@shared/schema";
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
  
  // Newsletter operations
  createNewsletterSubscription(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscription(email: string): Promise<Newsletter | undefined>;
  updateNewsletterSubscription(email: string, updates: Partial<Newsletter>): Promise<Newsletter | undefined>;
  getAllActiveSubscribers(): Promise<Newsletter[]>;
  unsubscribeNewsletter(email: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private thumbnails: Map<string, Thumbnail>;
  private titleOptimizations: Map<string, TitleOptimization>;
  private newsletters: Map<string, Newsletter>; // Key is email address

  constructor() {
    this.thumbnails = new Map();
    this.titleOptimizations = new Map();
    this.newsletters = new Map();
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

  // Newsletter operations
  async createNewsletterSubscription(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = randomUUID();
    const newsletter: Newsletter = {
      ...insertNewsletter,
      id,
      isActive: "true",
      subscribedAt: new Date(),
      unsubscribedAt: null,
      source: insertNewsletter.source || "website",
    };
    this.newsletters.set(insertNewsletter.email, newsletter);
    return newsletter;
  }

  async getNewsletterSubscription(email: string): Promise<Newsletter | undefined> {
    return this.newsletters.get(email);
  }

  async updateNewsletterSubscription(email: string, updates: Partial<Newsletter>): Promise<Newsletter | undefined> {
    const existing = this.newsletters.get(email);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.newsletters.set(email, updated);
    return updated;
  }

  async getAllActiveSubscribers(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values()).filter(
      newsletter => newsletter.isActive === "true"
    );
  }

  async unsubscribeNewsletter(email: string): Promise<boolean> {
    const existing = this.newsletters.get(email);
    if (!existing) return false;
    
    const updated = { 
      ...existing, 
      isActive: "false", 
      unsubscribedAt: new Date() 
    };
    this.newsletters.set(email, updated);
    return true;
  }
}

export const storage = new MemStorage();
