export enum Marketplace {
  ALL = "All Marketplaces",
  AMAZON = "Amazon",
  EBAY = "eBay",
  TIKTOK = "TikTok Shop",
  DARAZ = "Daraz",
  SHOPIFY = "Shopify"
}

export enum Market {
  USA = "USA",
  UK = "UK",
  Canada = "Canada",
  UAE = "UAE"
}

export interface Product {
  id: string;
  name: string;
  asin?: string; // Optional for non-Amazon
  sku?: string;
  link: string;
  price: number;
  estimatedCost: number;
  profit: number;
  profitMargin: number;
  competition: "Low" | "Medium" | "High";
  demand: "Low" | "Medium" | "High";
  market: Market;
  marketplace: Marketplace;
  reviews?: number;
  rating?: number;
  monthlySales?: number;
  image?: string;
  suggestions?: string[];
  opportunityScore?: number;
  explanation?: string;
  recommendation?: string;
}

export interface SourcingOption {
  id: string;
  supplierName: string;
  location: string;
  platform: string;
  price: number;
  moq: number;
  email: string;
  link: string;
  shippingTime: string;
  rating: number;
  sellingPrice: number;
  platformFees: number;
  estimatedProfit: number;
  roi: number;
  address?: string;
  phone?: string;
  images?: string[];
  suggestions?: string[];
}

export interface ProductListing {
  title: string;
  bulletPoints?: string[]; // Optional depending on marketplace
  description: string;
  tags?: string[]; // Marketplace tags/keywords
  backendSearchTerms?: string;
  keywords: string[];
  improvements: string[];
  platformSpecifics?: any; // For marketplace-specific data
}

export interface SupplierEmail {
  subject: string;
  body: string;
}

export type Module = 
  | "Product Hunting"
  | "Product Sourcing"
  | "Sourcing Finder"
  | "Listing Generator"
  | "Supplier Email Generator"
  | "Contact Dashboard"
  | "Profit Calculator"
  | "Export Data"
  | "Voice Control"
  | "Trend Detector"
  | "Market Gap Detector"
  | "Competition Analyzer"
  | "Auto Research Mode"
  | "AI Product Success Score"
  | "AI Launch Strategy"
  | "AI Niche Finder"
  | "AI Image Analyzer"
  | "AI Title Optimizer"
  | "AI Keyword Finder"
  | "AI Fake Review Detector"
  | "AI Demand Heatmap"
  | "AI Improvement Generator"
  | "AI Sales Forecast"
  | "History";
