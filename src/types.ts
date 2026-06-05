/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string; // 'binh-gas' | 'bep-gas' | 'binh-oxy' | 'van-gas' | 'day-gas' | 'phu-kien'
  image: string;
  images: string[]; // Support multiple images
  description: string;
  originalPrice: number;
  salePrice: number;
  isHot: boolean;
  isSale: boolean;
  isNew: boolean;
  specs: { [key: string]: string };
  inStock: boolean;
  slug: string;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface Blog {
  id: string;
  title: string;
  category: string; // 'an-toan' | 'huong-dan' | 'khuyen-mai' | 'tin-tuc' | 'oxy'
  categoryName: string;
  tags: string[];
  author: string;
  date: string;
  slug: string;
  summary: string;
  content: string; // Structured/Rich-text simulation compatible
  image: string;
  images: string[]; // For gallery
  youtubeId?: string; // For video embeds
  metaTitle: string;
  metaDescription: string;
  faqs: BlogFAQ[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  type: 'hero' | 'promotion' | 'small';
}

export interface PromotionCampaign {
  id: string;
  title: string;
  discountWording: string;
  endDate: string;
  isActive: boolean;
}

export interface CompanyContact {
  companyName: string;
  representative: string;
  mst: string; // Tax registration
  hotline: string;
  phoneSales: string;
  phoneTechnical: string;
  email: string;
  addressMain: string;
  addressBranch: string[];
  zaloLink: string;
  fbMessengerLink: string;
  mapsEmbedUrl: string;
}

export interface PromotionPopup {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  linkText: string;
  linkUrl: string;
  isActive: boolean;
}

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  productName: string;
  message: string;
  date: string;
  status: 'pending' | 'processed';
}

export interface WebSEOConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
}

export interface WordingConfig {
  heroTitle: string;
  heroSub: string;
  aboutTitle: string;
  aboutLead: string;
  aboutText: string;
  whyChooseUsTitle: string;
  certificateTitle: string;
}

export interface Category {
  id: string;
  name: string;
}

