/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Blog,
  Banner,
  CompanyContact,
  PromotionPopup,
  QuoteRequest,
  WebSEOConfig,
  WordingConfig,
  PromotionCampaign,
  Category
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BLOGS,
  INITIAL_BANNERS,
  INITIAL_PROMO_CAMPAIGNS,
  INITIAL_CONTACT,
  INITIAL_POPUP,
  INITIAL_SEO,
  INITIAL_WORDING,
  INITIAL_QUOTES
} from '../initialData';
import { isSupabaseConfigured } from '../supabaseClient';
import {
  fetchProductsFromDb,
  upsertProductToDb,
  deleteProductFromDb,
  fetchBlogsFromDb,
  upsertBlogToDb,
  deleteBlogFromDb,
  fetchBannersFromDb,
  upsertBannerToDb,
  deleteBannerFromDb,
  fetchCampaignsFromDb,
  upsertCampaignToDb,
  fetchCategoriesFromDb,
  upsertCategoryToDb,
  deleteCategoryFromDb,
  fetchQuotesFromDb,
  upsertQuoteToDb,
  deleteQuoteFromDb,
  fetchSettingFromDb,
  saveSettingToDb
} from '../supabaseConfigHelper';

interface AppContextType {
  // Navigation & Router
  currentView: 'home' | 'products' | 'blogs' | 'blog-detail' | 'admin';
  currentViewId: string; // SKU for product, slug for blog
  navigateTo: (view: 'home' | 'products' | 'blogs' | 'blog-detail' | 'admin', id?: string) => void;

  // State arrays
  products: Product[];
  blogs: Blog[];
  banners: Banner[];
  campaigns: PromotionCampaign[];
  contact: CompanyContact;
  popup: PromotionPopup;
  seo: WebSEOConfig;
  wordings: WordingConfig;
  quotes: QuoteRequest[];
  categories: Category[];

  // Mutators
  addProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  addBlog: (blog: Blog) => void;
  editBlog: (blog: Blog) => void;
  deleteBlog: (id: string) => void;

  addBanner: (banner: Banner) => void;
  editBanner: (banner: Banner) => void;
  deleteBanner: (id: string) => void;

  addCategory: (category: Category) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  updateContact: (contact: CompanyContact) => void;
  updatePopup: (popup: PromotionPopup) => void;
  updateSEO: (seo: WebSEOConfig) => void;
  updateWording: (wordings: WordingConfig) => void;

  addQuoteRequest: (quote: Omit<QuoteRequest, 'id' | 'date' | 'status'>) => void;
  markQuoteRequestProcessed: (id: string) => void;
  deleteQuoteRequest: (id: string) => void;

  // Filter Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  
  // Custom toast notifications for action confirmation
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Supabase Online DB Integration metrics
  isSupabaseEnabled: boolean;
  isSupabaseReady: boolean;
  supabaseStatusMsg: string;
  triggerSyncLocalToSupabase: () => Promise<boolean>;
  isLoadingFromSupabase: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation Routing States
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'blogs' | 'blog-detail' | 'admin'>('home');
  const [currentViewId, setCurrentViewId] = useState<string>('');

  // Main Data States loaded from localStorage or INITIAL_DATA
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([]);
  const [contact, setContact] = useState<CompanyContact>(INITIAL_CONTACT);
  const [popup, setPopup] = useState<PromotionPopup>(INITIAL_POPUP);
  const [seo, setSeo] = useState<WebSEOConfig>(INITIAL_SEO);
  const [wordings, setWordings] = useState<WordingConfig>(INITIAL_WORDING);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Search & Categories filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const DEFAULT_CATEGORIES: Category[] = [
    { id: 'binh-gas', name: 'Bình Gas' },
    { id: 'bep-gas', name: 'Bếp Gas' },
    { id: 'binh-oxy', name: 'Bình Oxy' },
    { id: 'van-gas', name: 'Van Gas' },
    { id: 'day-gas', name: 'Dây Dẫn Gas' },
    { id: 'phu-kien', name: 'Phụ Kiện Khác' }
  ];

  // Supabase connection metrics state
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [isLoadingFromSupabase, setIsLoadingFromSupabase] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState('Đang khởi tạo...');
  const isSupabaseEnabled = isSupabaseConfigured();

  // On Mount: Load data from Supabase/Local Storage
  useEffect(() => {
    const loadData = async () => {
      // 1. Load from localStorage FIRST so UI is instantly responsive with cached or placeholder data
      const localProducts = localStorage.getItem('pgs_products');
      const localBlogs = localStorage.getItem('pgs_blogs');
      const localBanners = localStorage.getItem('pgs_banners');
      const localCampaigns = localStorage.getItem('pgs_campaigns');
      const localContact = localStorage.getItem('pgs_contact');
      const localPopup = localStorage.getItem('pgs_popup');
      const localSeo = localStorage.getItem('pgs_seo');
      const localWordings = localStorage.getItem('pgs_wordings');
      const localQuotes = localStorage.getItem('pgs_quotes');
      const localCategories = localStorage.getItem('pgs_categories');

      if (localProducts) setProducts(JSON.parse(localProducts));
      else { setProducts(INITIAL_PRODUCTS); localStorage.setItem('pgs_products', JSON.stringify(INITIAL_PRODUCTS)); }

      if (localBlogs) setBlogs(JSON.parse(localBlogs));
      else { setBlogs(INITIAL_BLOGS); localStorage.setItem('pgs_blogs', JSON.stringify(INITIAL_BLOGS)); }

      if (localBanners) setBanners(JSON.parse(localBanners));
      else { setBanners(INITIAL_BANNERS); localStorage.setItem('pgs_banners', JSON.stringify(INITIAL_BANNERS)); }

      if (localCampaigns) setCampaigns(JSON.parse(localCampaigns));
      else { setCampaigns(INITIAL_PROMO_CAMPAIGNS); localStorage.setItem('pgs_campaigns', JSON.stringify(INITIAL_PROMO_CAMPAIGNS)); }

      if (localContact) setContact(JSON.parse(localContact));
      else { setContact(INITIAL_CONTACT); localStorage.setItem('pgs_contact', JSON.stringify(INITIAL_CONTACT)); }

      if (localPopup) setPopup(JSON.parse(localPopup));
      else { setPopup(INITIAL_POPUP); localStorage.setItem('pgs_popup', JSON.stringify(INITIAL_POPUP)); }

      if (localSeo) setSeo(JSON.parse(localSeo));
      else { setSeo(INITIAL_SEO); localStorage.setItem('pgs_seo', JSON.stringify(INITIAL_SEO)); }

      if (localWordings) setWordings(JSON.parse(localWordings));
      else { setWordings(INITIAL_WORDING); localStorage.setItem('pgs_wordings', JSON.stringify(INITIAL_WORDING)); }

      if (localQuotes) setQuotes(JSON.parse(localQuotes));
      else { setQuotes(INITIAL_QUOTES); localStorage.setItem('pgs_quotes', JSON.stringify(INITIAL_QUOTES)); }

      if (localCategories) setCategories(JSON.parse(localCategories));
      else { setCategories(DEFAULT_CATEGORIES); localStorage.setItem('pgs_categories', JSON.stringify(DEFAULT_CATEGORIES)); }

      // 2. Fetch from Supabase online if configured
      if (isSupabaseEnabled) {
        setIsLoadingFromSupabase(true);
        setSupabaseStatusMsg('Đang lấy dữ liệu từ Supabase...');
        try {
          // Attempt to load settings first to see if tables exist
          const dbContact = await fetchSettingFromDb<CompanyContact>('contact');
          if (dbContact === null) {
            // Verify if products can be loaded as fallback verification
            const dbProductsTest = await fetchProductsFromDb();
            if (dbProductsTest === null) {
              setSupabaseStatusMsg('Kết nối Supabase ổn định nhưng các bảng trống/chưa tạo. Hãy dán SQL Schema trong Quản trị.');
              setIsSupabaseReady(false);
              setIsLoadingFromSupabase(false);
              return;
            }
          }

          setIsSupabaseReady(true);
          setSupabaseStatusMsg('Đang hoạt động (Đồng bộ trực tuyến)');

          const [
            dbProducts,
            dbBlogs,
            dbBanners,
            dbCampaigns,
            dbCategories,
            dbQuotes,
            dbContactFetched,
            dbPopupFetched,
            dbSeoFetched,
            dbWordingsFetched
          ] = await Promise.all([
            fetchProductsFromDb(),
            fetchBlogsFromDb(),
            fetchBannersFromDb(),
            fetchCampaignsFromDb(),
            fetchCategoriesFromDb(),
            fetchQuotesFromDb(),
            fetchSettingFromDb<CompanyContact>('contact'),
            fetchSettingFromDb<PromotionPopup>('popup'),
            fetchSettingFromDb<WebSEOConfig>('seo'),
            fetchSettingFromDb<WordingConfig>('wordings')
          ]);

          if (dbProducts) { setProducts(dbProducts); localStorage.setItem('pgs_products', JSON.stringify(dbProducts)); }
          if (dbBlogs) { setBlogs(dbBlogs); localStorage.setItem('pgs_blogs', JSON.stringify(dbBlogs)); }
          if (dbBanners) { setBanners(dbBanners); localStorage.setItem('pgs_banners', JSON.stringify(dbBanners)); }
          if (dbCampaigns) { setCampaigns(dbCampaigns); localStorage.setItem('pgs_campaigns', JSON.stringify(dbCampaigns)); }
          if (dbCategories) { setCategories(dbCategories); localStorage.setItem('pgs_categories', JSON.stringify(dbCategories)); }
          if (dbQuotes) { setQuotes(dbQuotes); localStorage.setItem('pgs_quotes', JSON.stringify(dbQuotes)); }
          if (dbContactFetched) { setContact(dbContactFetched); localStorage.setItem('pgs_contact', JSON.stringify(dbContactFetched)); }
          if (dbPopupFetched) { setPopup(dbPopupFetched); localStorage.setItem('pgs_popup', JSON.stringify(dbPopupFetched)); }
          if (dbSeoFetched) { setSeo(dbSeoFetched); localStorage.setItem('pgs_seo', JSON.stringify(dbSeoFetched)); }
          if (dbWordingsFetched) { setWordings(dbWordingsFetched); localStorage.setItem('pgs_wordings', JSON.stringify(dbWordingsFetched)); }

          // showToast('Tải dữ liệu từ Supabase thành công!', 'success');
        } catch (err: any) {
          setIsSupabaseReady(false);
          setSupabaseStatusMsg('Lỗi đồng bộ: ' + (err.message || 'Không kết nối được'));
          console.warn('Supabase sync warning:', err);
        } finally {
          setIsLoadingFromSupabase(false);
        }
      } else {
        setSupabaseStatusMsg('Chưa cấu hình Supabase (Đang chạy offline từ LocalStorage)');
      }
    };

    loadData();
  }, [isSupabaseEnabled]);

  // Command to sync/upload all current local values onto Supabase DB
  const triggerSyncLocalToSupabase = async (): Promise<boolean> => {
    if (!isSupabaseEnabled) {
      showToast('Cần điền biến môi trường Supabase trước!', 'error');
      return false;
    }
    
    setIsLoadingFromSupabase(true);
    setSupabaseStatusMsg('Đang khởi tạo đồng bộ thủ công...');
    
    try {
      // 1. Settings
      await saveSettingToDb('contact', contact);
      await saveSettingToDb('popup', popup);
      await saveSettingToDb('seo', seo);
      await saveSettingToDb('wordings', wordings);

      // 2. Arrays
      await Promise.all([
        ...products.map(p => upsertProductToDb(p)),
        ...blogs.map(b => upsertBlogToDb(b)),
        ...banners.map(b => upsertBannerToDb(b)),
        ...campaigns.map(c => upsertCampaignToDb(c)),
        ...categories.map(c => upsertCategoryToDb(c)),
        ...quotes.map(q => upsertQuoteToDb(q))
      ]);

      setIsSupabaseReady(true);
      setSupabaseStatusMsg('Đang hoạt động (Đồng bộ trực tuyến)');
      showToast('Đồng bộ dữ liệu cục bộ lên Supabase hoàn tất!', 'success');
      return true;
    } catch (err: any) {
      setSupabaseStatusMsg('Đồng bộ thất bại: ' + (err.message || 'Lỗi cơ sở dữ liệu'));
      showToast('Không thể đồng bộ. Hãy chắc chắn bạn đã chạy SQL schema script.', 'error');
      return false;
    } finally {
      setIsLoadingFromSupabase(false);
    }
  };

  // Update HTML Document Head for dynamic client-side SEO
  useEffect(() => {
    if (seo) {
      let pageTitle = seo.metaTitle;
      let pageDesc = seo.metaDescription;

      if (currentView === 'products') {
        if (currentViewId) {
          const prod = products.find(p => p.id === currentViewId || p.slug === currentViewId);
          if (prod) {
            pageTitle = `${prod.name} | Gas, Bếp Gas Chính Hãng`;
            pageDesc = prod.description;
          }
        } else {
          pageTitle = `Danh Mục Sản Phẩm Gas & Thiết Bị Nhà Bếp | ${seo.metaTitle}`;
        }
      } else if (currentView === 'blogs') {
        if (currentViewId) {
          const blog = blogs.find(b => b.id === currentViewId || b.slug === currentViewId);
          if (blog) {
            pageTitle = `${blog.metaTitle || blog.title} | Kiến Thức PGS`;
            pageDesc = blog.metaDescription || blog.summary;
          }
        } else {
          pageTitle = `Cẩm Nang An Toàn, Tin Khuyến Mãi Gas | ${seo.metaTitle}`;
        }
      } else if (currentView === 'admin') {
        pageTitle = `Hệ Thống Quản Trị Website CMS | PGS Premium`;
      }

      document.title = pageTitle;
      const metaMetaDescription = document.querySelector('meta[name="description"]');
      if (metaMetaDescription) {
        metaMetaDescription.setAttribute('content', pageDesc);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = pageDesc;
        document.head.appendChild(meta);
      }

      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', seo.metaKeywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = seo.metaKeywords;
        document.head.appendChild(meta);
      }
    }
  }, [currentView, currentViewId, seo, products, blogs]);

  // Handle route transition with window scroll to top
  const navigateTo = (view: 'home' | 'products' | 'blogs' | 'blog-detail' | 'admin', id: string = '') => {
    setCurrentView(view);
    setCurrentViewId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clean up 'phantruongan-admin' URL parameters, hash, or path when leaving the admin panel
    if (view !== 'admin') {
      try {
        let changed = false;
        let p = window.location.pathname;
        let s = window.location.search;
        let h = window.location.hash;

        if (p.toLowerCase().includes('phantruongan-admin')) {
          p = p.replace(/phantruongan-admin/gi, '').replace(/\/\/+/g, '/');
          if (!p || p === '') p = '/';
          changed = true;
        }
        
        if (s.toLowerCase().includes('phantruongan-admin')) {
          const params = new URLSearchParams(s);
          params.delete('phantruongan-admin');
          const keysToDelete: string[] = [];
          params.forEach((val, key) => {
            if (key.toLowerCase().includes('phantruongan-admin') || val.toLowerCase().includes('phantruongan-admin')) {
              keysToDelete.push(key);
            }
          });
          keysToDelete.forEach(k => params.delete(k));
          const pString = params.toString();
          s = pString ? '?' + pString : '';
          changed = true;
        }

        if (h.toLowerCase().includes('phantruongan-admin')) {
          h = h.replace(/phantruongan-admin/gi, '').replace(/#+/g, '#');
          if (h === '#') h = '';
          changed = true;
        }

        if (changed) {
          const newUrl = p + s + h;
          window.history.pushState({ pgsRouteCleaned: true }, '', newUrl);
        }
      } catch (err) {
        console.error('Error auto-cleaning admin URL suffix:', err);
      }
    }
  };

  // Detect URL pathname, hash, or search query containing 'phantruongan-admin' to auto-navigate to Admin
  useEffect(() => {
    const handleAdminRouteCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const query = window.location.search;
      if (
        path.toLowerCase().includes('phantruongan-admin') ||
        hash.toLowerCase().includes('phantruongan-admin') ||
        query.toLowerCase().includes('phantruongan-admin')
      ) {
        navigateTo('admin');
      }
    };

    handleAdminRouteCheck();
    window.addEventListener('hashchange', handleAdminRouteCheck);
    window.addEventListener('popstate', handleAdminRouteCheck);
    return () => {
      window.removeEventListener('hashchange', handleAdminRouteCheck);
      window.removeEventListener('popstate', handleAdminRouteCheck);
    };
  }, []);

  // Helper local persistence wrapper
  const saveStateAndStore = (key: string, data: any, stateSetter: Function) => {
    stateSetter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Mutator actions which support offline storage first, and online background syncing
  const addProduct = async (product: Product) => {
    const updated = [product, ...products];
    saveStateAndStore('pgs_products', updated, setProducts);
    showToast(`Đã thêm sản phẩm "${product.name}" thành công!`);
    if (isSupabaseReady) {
      await upsertProductToDb(product);
    }
  };

  const editProduct = async (product: Product) => {
    const updated = products.map(p => (p.id === product.id ? product : p));
    saveStateAndStore('pgs_products', updated, setProducts);
    showToast(`Đã cập nhật sản phẩm "${product.name}"!`);
    if (isSupabaseReady) {
      await upsertProductToDb(product);
    }
  };

  const deleteProduct = async (id: string) => {
    const item = products.find(p => p.id === id);
    const updated = products.filter(p => p.id !== id);
    saveStateAndStore('pgs_products', updated, setProducts);
    showToast(`Đã xóa sản phẩm "${item?.name}" thành công!`, 'info');
    if (isSupabaseReady) {
      await deleteProductFromDb(id);
    }
  };

  const addBlog = async (blog: Blog) => {
    const updated = [blog, ...blogs];
    saveStateAndStore('pgs_blogs', updated, setBlogs);
    showToast(`Đã xuất bản bài viết "${blog.title}"!`);
    if (isSupabaseReady) {
      await upsertBlogToDb(blog);
    }
  };

  const editBlog = async (blog: Blog) => {
    const updated = blogs.map(b => (b.id === blog.id ? blog : b));
    saveStateAndStore('pgs_blogs', updated, setBlogs);
    showToast(`Đã cập nhật bài viết "${blog.title}"!`);
    if (isSupabaseReady) {
      await upsertBlogToDb(blog);
    }
  };

  const deleteBlog = async (id: string) => {
    const item = blogs.find(b => b.id === id);
    const updated = blogs.filter(b => b.id !== id);
    saveStateAndStore('pgs_blogs', updated, setBlogs);
    showToast(`Đã xóa bài viết "${item?.title}"!`, 'info');
    if (isSupabaseReady) {
      await deleteBlogFromDb(id);
    }
  };

  const addBanner = async (banner: Banner) => {
    const updated = [...banners, banner];
    saveStateAndStore('pgs_banners', updated, setBanners);
    showToast('Đã thêm banner quảng cáo mới!');
    if (isSupabaseReady) {
      await upsertBannerToDb(banner);
    }
  };

  const editBanner = async (banner: Banner) => {
    const updated = banners.map(b => (b.id === banner.id ? banner : b));
    saveStateAndStore('pgs_banners', updated, setBanners);
    showToast('Đã cập nhật banner thành công!');
    if (isSupabaseReady) {
      await upsertBannerToDb(banner);
    }
  };

  const deleteBanner = async (id: string) => {
    const updated = banners.filter(b => b.id !== id);
    saveStateAndStore('pgs_banners', updated, setBanners);
    showToast('Đã gỡ bỏ banner!', 'info');
    if (isSupabaseReady) {
      await deleteBannerFromDb(id);
    }
  };

  const updateContact = async (newContact: CompanyContact) => {
    saveStateAndStore('pgs_contact', newContact, setContact);
    showToast('Đã lưu thông tin liên hệ doanh nghiệp của công ty!');
    if (isSupabaseReady) {
      await saveSettingToDb('contact', newContact);
    }
  };

  const updatePopup = async (newPopup: PromotionPopup) => {
    saveStateAndStore('pgs_popup', newPopup, setPopup);
    showToast(`Đã cập nhật trạng thái Popup Khuyến mãi (${newPopup.isActive ? 'BẬT' : 'TẮT'})!`);
    if (isSupabaseReady) {
      await saveSettingToDb('popup', newPopup);
    }
  };

  const updateSEO = async (newSeo: WebSEOConfig) => {
    saveStateAndStore('pgs_seo', newSeo, setSeo);
    showToast('Cấu hình thẻ SEO toàn trang thái thành công!');
    if (isSupabaseReady) {
      await saveSettingToDb('seo', newSeo);
    }
  };

  const updateWording = async (newWordings: WordingConfig) => {
    saveStateAndStore('pgs_wordings', newWordings, setWordings);
    showToast('Đã lưu điều chỉnh wording tiêu đề trên website!');
    if (isSupabaseReady) {
      await saveSettingToDb('wordings', newWordings);
    }
  };

  const addQuoteRequest = async (quoteData: Omit<QuoteRequest, 'id' | 'date' | 'status'>) => {
    const newQuote: QuoteRequest = {
      ...quoteData,
      id: 'quote_' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };
    const updated = [newQuote, ...quotes];
    saveStateAndStore('pgs_quotes', updated, setQuotes);
    showToast('Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ lại trong vòng 15 phút.', 'success');
    if (isSupabaseReady) {
      await upsertQuoteToDb(newQuote);
    }
  };

  const markQuoteRequestProcessed = async (id: string) => {
    const updated = quotes.map(q => (q.id === id ? { ...q, status: 'processed' as const } : q));
    saveStateAndStore('pgs_quotes', updated, setQuotes);
    showToast('Đã ghi nhận xử lý liên hệ của khách hàng!');
    const found = updated.find(q => q.id === id);
    if (isSupabaseReady && found) {
      await upsertQuoteToDb(found);
    }
  };

  const deleteQuoteRequest = async (id: string) => {
    const updated = quotes.filter(q => q.id !== id);
    saveStateAndStore('pgs_quotes', updated, setQuotes);
    showToast('Đã xóa yêu cầu liên hệ!', 'info');
    if (isSupabaseReady) {
      await deleteQuoteFromDb(id);
    }
  };

  const addCategory = async (cat: Category) => {
    const updated = [...categories, cat];
    saveStateAndStore('pgs_categories', updated, setCategories);
    showToast(`Đã thêm danh mục "${cat.name}" thành công!`);
    if (isSupabaseReady) {
      await upsertCategoryToDb(cat);
    }
  };

  const editCategory = async (cat: Category) => {
    const updated = categories.map(c => (c.id === cat.id ? cat : c));
    saveStateAndStore('pgs_categories', updated, setCategories);
    showToast(`Đã cập nhật danh mục "${cat.name}"!`);
    if (isSupabaseReady) {
      await upsertCategoryToDb(cat);
    }
  };

  const deleteCategory = async (id: string) => {
    const item = categories.find(c => c.id === id);
    const updated = categories.filter(c => c.id !== id);
    saveStateAndStore('pgs_categories', updated, setCategories);
    showToast(`Đã xóa danh mục "${item?.name}" thành công!`, 'info');
    if (isSupabaseReady) {
      await deleteCategoryFromDb(id);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        currentViewId,
        navigateTo,
        products,
        blogs,
        banners,
        campaigns,
        contact,
        popup,
        seo,
        wordings,
        quotes,
        categories,
        addProduct,
        editProduct,
        deleteProduct,
        addBlog,
        editBlog,
        deleteBlog,
        addBanner,
        editBanner,
        deleteBanner,
        addCategory,
        editCategory,
        deleteCategory,
        updateContact,
        updatePopup,
        updateSEO,
        updateWording,
        addQuoteRequest,
        markQuoteRequestProcessed,
        deleteQuoteRequest,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toast,
        showToast,
        isSupabaseEnabled,
        isSupabaseReady,
        supabaseStatusMsg,
        triggerSyncLocalToSupabase,
        isLoadingFromSupabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
