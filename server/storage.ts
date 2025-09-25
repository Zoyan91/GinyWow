import { type Thumbnail, type InsertThumbnail, type TitleOptimization, type InsertTitleOptimization, type NewsletterSubscription, type InsertNewsletterSubscription, type ShortUrl, type InsertShortUrl, type PdfFile, type InsertPdfFile } from "@shared/schema";
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
  
  // Newsletter subscription operations
  createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;
  getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined>;
  updateNewsletterSubscription(email: string, updates: Partial<NewsletterSubscription>): Promise<NewsletterSubscription | undefined>;
  getAllActiveSubscriptions(): Promise<NewsletterSubscription[]>;
  
  // Short URL operations
  createShortUrl(shortUrl: InsertShortUrl): Promise<ShortUrl>;
  getShortUrl(shortCode: string): Promise<ShortUrl | undefined>;
  incrementClickCount(shortCode: string): Promise<void>;
  
  // PDF operations
  createPdfFile(pdfFile: InsertPdfFile): Promise<PdfFile>;
  getPdfFile(id: string): Promise<PdfFile | undefined>;
  updatePdfFile(id: string, updates: Partial<PdfFile>): Promise<PdfFile | undefined>;
}

export class MemStorage implements IStorage {
  private thumbnails: Map<string, Thumbnail>;
  private titleOptimizations: Map<string, TitleOptimization>;
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;
  private shortUrls: Map<string, ShortUrl>;
  private pdfFiles: Map<string, PdfFile>;

  constructor() {
    this.thumbnails = new Map();
    this.titleOptimizations = new Map();
    this.newsletterSubscriptions = new Map();
    this.shortUrls = new Map();
    this.pdfFiles = new Map();
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

  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check if email already exists
    const existing = this.newsletterSubscriptions.get(insertSubscription.email);
    if (existing) {
      throw new Error('Email already subscribed');
    }

    const id = randomUUID();
    const subscription: NewsletterSubscription = {
      id,
      email: insertSubscription.email,
      isActive: "true",
      subscriptionDate: new Date(),
      lastUpdated: new Date(),
    };
    
    this.newsletterSubscriptions.set(insertSubscription.email, subscription);
    return subscription;
  }

  async getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined> {
    return this.newsletterSubscriptions.get(email);
  }

  async updateNewsletterSubscription(email: string, updates: Partial<NewsletterSubscription>): Promise<NewsletterSubscription | undefined> {
    const existing = this.newsletterSubscriptions.get(email);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastUpdated: new Date() };
    this.newsletterSubscriptions.set(email, updated);
    return updated;
  }

  async getAllActiveSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values()).filter(
      sub => sub.isActive === "true"
    );
  }

  async createShortUrl(insertShortUrl: InsertShortUrl): Promise<ShortUrl> {
    const id = randomUUID();
    const shortUrl: ShortUrl = {
      ...insertShortUrl,
      id,
      createdAt: new Date(),
      clickCount: 0,
    };
    this.shortUrls.set(insertShortUrl.shortCode, shortUrl);
    return shortUrl;
  }

  async getShortUrl(shortCode: string): Promise<ShortUrl | undefined> {
    return this.shortUrls.get(shortCode);
  }

  async incrementClickCount(shortCode: string): Promise<void> {
    const shortUrl = this.shortUrls.get(shortCode);
    if (shortUrl) {
      shortUrl.clickCount = (shortUrl.clickCount || 0) + 1;
      this.shortUrls.set(shortCode, shortUrl);
    }
  }

  // PDF file operations
  async createPdfFile(insertPdfFile: InsertPdfFile): Promise<PdfFile> {
    const id = randomUUID();
    const pdfFile: PdfFile = {
      ...insertPdfFile,
      id,
      status: "processing",
      outputData: null,
      outputFileName: null,
      createdAt: new Date(),
    };
    this.pdfFiles.set(id, pdfFile);
    return pdfFile;
  }

  async getPdfFile(id: string): Promise<PdfFile | undefined> {
    return this.pdfFiles.get(id);
  }

  async updatePdfFile(id: string, updates: Partial<PdfFile>): Promise<PdfFile | undefined> {
    const existing = this.pdfFiles.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.pdfFiles.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
