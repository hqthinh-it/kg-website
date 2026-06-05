import { supabase } from './supabaseClient';
import {
  Product,
  Blog,
  Banner,
  PromotionCampaign,
  Category,
  QuoteRequest,
  CompanyContact,
  PromotionPopup,
  WebSEOConfig,
  WordingConfig
} from './types';

// Helper to check if supabase is active and responsive
export const hasSupabaseConnection = (): boolean => {
  return supabase !== null;
};

// SQL commands to easily copy/paste into Supabase Dashboard
export const SUPABASE_SETUP_SQL = `-- -----------------------------------------------------
-- GAS SẠCH PGS - SUPABASE SETUP SCHEMA SCRIPT
-- Copy và dán toàn bộ đoạn mã này vào "Supabase -> SQL Editor" rồi nhấn RUN
-- -----------------------------------------------------

-- 1. Bảng Thiết lập Cấu hình (Settings)
CREATE TABLE IF NOT EXISTS pgs_settings (
  key text PRIMARY KEY,
  val jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- 2. Bảng Sản phẩm (Products)
CREATE TABLE IF NOT EXISTS pgs_products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  image text,
  images jsonb DEFAULT '[]'::jsonb,
  description text,
  original_price numeric DEFAULT 0,
  sale_price numeric DEFAULT 0,
  is_hot boolean DEFAULT false,
  is_sale boolean DEFAULT false,
  is_new boolean DEFAULT false,
  specs jsonb DEFAULT '{}'::jsonb,
  in_stock boolean DEFAULT true,
  slug text,
  updated_at timestamptz DEFAULT now()
);

-- 3. Bảng Bài viết cẩm nang (Blogs)
CREATE TABLE IF NOT EXISTS pgs_blogs (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  category_name text NOT NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  author text,
  date text,
  slug text,
  summary text,
  content text,
  image text,
  images jsonb DEFAULT '[]'::jsonb,
  youtube_id text,
  meta_title text,
  meta_description text,
  faqs jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- 4. Bảng Banner quảng cáo (Banners)
CREATE TABLE IF NOT EXISTS pgs_banners (
  id text PRIMARY KEY,
  title text,
  subtitle text,
  image text,
  link text,
  is_active boolean DEFAULT true,
  type text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- 5. Bảng Chiến dịch khuyến mãi (Campaigns)
CREATE TABLE IF NOT EXISTS pgs_campaigns (
  id text PRIMARY KEY,
  title text,
  discount_wording text,
  end_date text,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- 6. Bảng Danh mục (Categories)
CREATE TABLE IF NOT EXISTS pgs_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- 7. Bảng Yêu cầu báo giá / tư vấn (Quotes)
CREATE TABLE IF NOT EXISTS pgs_quotes (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  product_name text,
  message text,
  date text,
  status text DEFAULT 'pending',
  updated_at timestamptz DEFAULT now()
);

-- Vô hiệu hóa RLS (Row Level Security) tạm thời để cho phép đọc ghi trực tiếp từ Client app
-- Sau này, bạn hoàn toàn có thể thiết lập Policy cho bảo mật nâng cao.
ALTER TABLE pgs_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE pgs_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE pgs_blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE pgs_banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE pgs_campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE pgs_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE pgs_quotes DISABLE ROW LEVEL SECURITY;
`;

// Map fields from Database casing to Typescript Models & back (handling price, active logic)
function mapProductDbToModel(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    image: row.image || '',
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || '',
    originalPrice: Number(row.original_price ?? row.originalPrice ?? 0),
    salePrice: Number(row.sale_price ?? row.salePrice ?? 0),
    isHot: !!row.is_hot,
    isSale: !!row.is_sale,
    isNew: !!row.is_new,
    specs: row.specs || {},
    inStock: row.in_stock !== undefined ? !!row.in_stock : !!row.inStock,
    slug: row.slug || ''
  };
}

function mapProductModelToDb(p: Product): any {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    image: p.image,
    images: p.images,
    description: p.description,
    original_price: p.originalPrice,
    sale_price: p.salePrice,
    is_hot: p.isHot,
    is_sale: p.isSale,
    is_new: p.isNew,
    specs: p.specs,
    in_stock: p.inStock,
    slug: p.slug
  };
}

function mapBlogDbToModel(row: any): Blog {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    categoryName: row.category_name ?? row.categoryName ?? '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    author: row.author || '',
    date: row.date || '',
    slug: row.slug || '',
    summary: row.summary || '',
    content: row.content || '',
    image: row.image || '',
    images: Array.isArray(row.images) ? row.images : [],
    youtubeId: row.youtube_id ?? row.youtubeId ?? '',
    metaTitle: row.meta_title ?? row.metaTitle ?? '',
    metaDescription: row.meta_description ?? row.metaDescription ?? '',
    faqs: Array.isArray(row.faqs) ? row.faqs : []
  };
}

function mapBlogModelToDb(b: Blog): any {
  return {
    id: b.id,
    title: b.title,
    category: b.category,
    category_name: b.categoryName,
    tags: b.tags,
    author: b.author,
    date: b.date,
    slug: b.slug,
    summary: b.summary,
    content: b.content,
    image: b.image,
    images: b.images,
    youtube_id: b.youtubeId,
    meta_title: b.metaTitle,
    meta_description: b.metaDescription,
    faqs: b.faqs
  };
}

function mapBannerDbToModel(row: any): Banner {
  return {
    id: row.id,
    title: row.title || '',
    subtitle: row.subtitle || '',
    image: row.image || '',
    link: row.link || '',
    isActive: row.is_active !== undefined ? !!row.is_active : !!row.isActive,
    type: row.type || 'hero'
  };
}

function mapBannerModelToDb(b: Banner): any {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    image: b.image,
    link: b.link,
    is_active: b.isActive,
    type: b.type
  };
}

function mapCampaignDbToModel(row: any): PromotionCampaign {
  return {
    id: row.id,
    title: row.title || '',
    discountWording: row.discount_wording ?? row.discountWording ?? '',
    endDate: row.end_date ?? row.endDate ?? '',
    isActive: row.is_active !== undefined ? !!row.is_active : !!row.isActive
  };
}

function mapCampaignModelToDb(c: PromotionCampaign): any {
  return {
    id: c.id,
    title: c.title,
    discount_wording: c.discountWording,
    end_date: c.endDate,
    is_active: c.isActive
  };
}

function mapQuoteDbToModel(row: any): QuoteRequest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || '',
    productName: row.product_name ?? row.productName ?? '',
    message: row.message || '',
    date: row.date || '',
    status: (row.status || 'pending') as 'pending' | 'processed'
  };
}

function mapQuoteModelToDb(q: QuoteRequest): any {
  return {
    id: q.id,
    name: q.name,
    phone: q.phone,
    email: q.email,
    product_name: q.productName,
    message: q.message,
    date: q.date,
    status: q.status
  };
}

// -----------------------------------------------------------------
// REMOTE API METHODS
// -----------------------------------------------------------------

export async function fetchProductsFromDb(): Promise<Product[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('pgs_products').select('*');
    if (error) {
      console.warn('Supabase fetchProducts error (Falling back to local):', error.message);
      return null;
    }
    return (data || []).map(mapProductDbToModel);
  } catch (err: any) {
    console.warn('Supabase fetchProducts exception (Falling back to local):', err);
    return null;
  }
}

export async function upsertProductToDb(p: Product): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbRow = mapProductModelToDb(p);
    const { error } = await supabase.from('pgs_products').upsert(dbRow);
    return !error;
  } catch (err) {
    console.error('Supabase upsertProductToDb exception:', err);
    return false;
  }
}

export async function deleteProductFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('pgs_products').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Supabase deleteProductFromDb exception:', err);
    return false;
  }
}

// Blogs
export async function fetchBlogsFromDb(): Promise<Blog[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('pgs_blogs').select('*');
    if (error) {
      console.warn('Supabase fetchBlogs error (Falling back to local):', error.message);
      return null;
    }
    return (data || []).map(mapBlogDbToModel);
  } catch (err) {
    console.warn('Supabase fetchBlogs exception:', err);
    return null;
  }
}

export async function upsertBlogToDb(b: Blog): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbRow = mapBlogModelToDb(b);
    const { error } = await supabase.from('pgs_blogs').upsert(dbRow);
    return !error;
  } catch (err) {
    console.error('Supabase upsertBlogToDb exception:', err);
    return false;
  }
}

export async function deleteBlogFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('pgs_blogs').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Supabase deleteBlogFromDb exception:', err);
    return false;
  }
}

// Banners
export async function fetchBannersFromDb(): Promise<Banner[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('pgs_banners').select('*');
    if (error) {
      console.warn('Supabase fetchBanners error:', error.message);
      return null;
    }
    return (data || []).map(mapBannerDbToModel);
  } catch (err) {
    console.warn('Supabase fetchBanners exception:', err);
    return null;
  }
}

export async function upsertBannerToDb(b: Banner): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbRow = mapBannerModelToDb(b);
    const { error } = await supabase.from('pgs_banners').upsert(dbRow);
    return !error;
  } catch (err) {
    console.error('Supabase upsertBanner exception:', err);
    return false;
  }
}

export async function deleteBannerFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('pgs_banners').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Supabase deleteBanner exception:', err);
    return false;
  }
}

// Campaigns
export async function fetchCampaignsFromDb(): Promise<PromotionCampaign[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('pgs_campaigns').select('*');
    if (error) {
      console.warn('Supabase fetchCampaigns error:', error.message);
      return null;
    }
    return (data || []).map(mapCampaignDbToModel);
  } catch (err) {
    console.warn('Supabase fetchCampaigns exception:', err);
    return null;
  }
}

export async function upsertCampaignToDb(c: PromotionCampaign): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbRow = mapCampaignModelToDb(c);
    const { error } = await supabase.from('pgs_campaigns').upsert(dbRow);
    return !error;
  } catch (err) {
    console.error('Supabase upsertCampaign exception:', err);
    return false;
  }
}

// Categories
export async function fetchCategoriesFromDb(): Promise<Category[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('pgs_categories').select('*');
    if (error) {
      console.warn('Supabase fetchCategories error:', error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchCategories exception:', err);
    return null;
  }
}

export async function upsertCategoryToDb(c: Category): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('pgs_categories').upsert(c);
    return !error;
  } catch (err) {
    console.error('Supabase upsertCategory exception:', err);
    return false;
  }
}

export async function deleteCategoryFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('pgs_categories').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Supabase deleteCategory exception:', err);
    return false;
  }
}

// Quotes
export async function fetchQuotesFromDb(): Promise<QuoteRequest[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('pgs_quotes').select('*');
    if (error) {
      console.warn('Supabase fetchQuotes error:', error.message);
      return null;
    }
    return (data || []).map(mapQuoteDbToModel);
  } catch (err) {
    console.warn('Supabase fetchQuotes exception:', err);
    return null;
  }
}

export async function upsertQuoteToDb(q: QuoteRequest): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbRow = mapQuoteModelToDb(q);
    const { error } = await supabase.from('pgs_quotes').upsert(dbRow);
    return !error;
  } catch (err) {
    console.error('Supabase upsertQuote exception:', err);
    return false;
  }
}

export async function deleteQuoteFromDb(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('pgs_quotes').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Supabase deleteQuote exception:', err);
    return false;
  }
}

// Config Objects (key-value in settings table)
export async function fetchSettingFromDb<T>(key: string): Promise<T | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pgs_settings')
      .select('val')
      .eq('key', key)
      .maybeSingle();
    
    if (error) {
      console.warn(`Supabase fetchSetting error for [${key}]:`, error.message);
      return null;
    }
    return data ? (data.val as T) : null;
  } catch (err) {
    console.warn(`Supabase fetchSetting exception for [${key}]:`, err);
    return null;
  }
}

export async function saveSettingToDb(key: string, val: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('pgs_settings')
      .upsert({ key, val, updated_at: new Date().toISOString() });
    return !error;
  } catch (err) {
    console.error(`Supabase saveSettingToDb exception for [${key}]:`, err);
    return false;
  }
}
