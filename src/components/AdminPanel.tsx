/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Blog, Banner, CompanyContact, PromotionPopup, WebSEOConfig, QuoteRequest, WordingConfig } from '../types';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle,
  Eye, 
  Users, 
  BookOpen, 
  Layout, 
  Tag, 
  Sliders, 
  Globe2,
  Lock,
  Unlock,
  Building,
  Save,
  Clock,
  Database
} from 'lucide-react';
import { SUPABASE_SETUP_SQL } from '../supabaseConfigHelper';

export const AdminPanel: React.FC = () => {
  const {
    products,
    blogs,
    banners,
    contact,
    popup,
    seo,
    quotes,
    wordings,
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
    markQuoteRequestProcessed,
    deleteQuoteRequest,
    isSupabaseEnabled,
    isSupabaseReady,
    supabaseStatusMsg,
    triggerSyncLocalToSupabase,
    isLoadingFromSupabase
  } = useApp();

  // Connection copied and notification states
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Basic admin credential simulator
  const [isLocked, setIsLocked] = useState(true); // Must be locked by default now for production security
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active sub tab inside CMS (includes online Supabase database dashboard)
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'blogs' | 'banners' | 'seo-contact' | 'quotes' | 'categories' | 'supabase'>('products');

  // Edit/Add states Product
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '', name: '', category: 'binh-gas', description: '', originalPrice: 0, salePrice: 0,
    isHot: false, isSale: false, isNew: true, inStock: true, image: '', specs: {}, slug: ''
  });
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Edit/Add states Blog
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({
    id: '', title: '', category: 'an-toan', categoryName: 'Mẹo sử dụng gas an toàn', tags: [],
    author: 'Phó Giám Đốc Kỹ Thuật', date: '', slug: '', summary: '', content: '', image: '',
    metaTitle: '', metaDescription: '', faqs: []
  });
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newBlogTag, setNewBlogTag] = useState('');

  // Live webpage wording edit
  const [wordingsForm, setWordingsForm] = useState<WordingConfig>(wordings);

  // Live Contact state
  const [contactForm, setContactForm] = useState<CompanyContact>(contact);

  // Live SEO config state
  const [seoForm, setSeoForm] = useState<WebSEOConfig>(seo);

  // Live Popup configuration state
  const [popupForm, setPopupForm] = useState<PromotionPopup>(popup);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'kG06062002@truong@n') {
      setIsLocked(false);
      setAuthError('');
    } else {
      setAuthError('Tên đăng nhập hoặc mật khẩu quản trị không đúng!');
    }
  };

  // Local device file uploader to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Edit/Add states Category
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState<{ id: string; name: string }>({ id: '', name: '' });
  const [isNewCategory, setIsNewCategory] = useState(false);

  // Global delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Non-tech Blog image helper states & reference
  const blogContentRef = useRef<HTMLTextAreaElement>(null);
  const [blogImagesList, setBlogImagesList] = useState<{ id: string; base64: string; isHidden: boolean }[]>([]);
  const [altTextForNewImage, setAltTextForNewImage] = useState('');

  // Slide Banner management states
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    id: '', title: '', subtitle: '', image: '', link: '#', isActive: true, type: 'hero'
  });
  const [isNewBanner, setIsNewBanner] = useState(false);

  const handleOpenAddBanner = () => {
    setBannerForm({
      id: 'banner_' + Date.now(),
      title: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
      link: '#',
      isActive: true,
      type: 'hero'
    });
    setIsNewBanner(true);
    setIsEditingBanner(true);
  };

  const handleOpenEditBanner = (b: Banner) => {
    setBannerForm({ ...b });
    setIsNewBanner(false);
    setIsEditingBanner(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.image) {
      alert('Vui lòng chọn hoặc tải lên hình ảnh cho slide banner!');
      return;
    }
    const bannerData = {
      id: bannerForm.id || 'banner_' + Date.now(),
      title: bannerForm.title || '',
      subtitle: bannerForm.subtitle || '',
      image: bannerForm.image,
      link: bannerForm.link || '#',
      isActive: bannerForm.isActive !== undefined ? bannerForm.isActive : true,
      type: bannerForm.type || 'hero'
    } as Banner;

    if (isNewBanner) {
      addBanner(bannerData);
    } else {
      editBanner(bannerData);
    }
    setIsEditingBanner(false);
  };

  // Helper method to insert image at cursor position
  const handleInsertImageAtCursor = (imgIdOrBase64: string, altText: string) => {
    const textarea = blogContentRef.current;
    const alt = altText.trim() || 'Hình ảnh cẩm nang GAS KIỆT GẠO';
    const markdownText = `\n![${alt}](${imgIdOrBase64})\n`;
    if (textarea) {
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const currentContent = blogForm.content || '';
      const newContent = currentContent.substring(0, startPos) + markdownText + currentContent.substring(endPos);
      setBlogForm(prev => ({ ...prev, content: newContent }));
      
      // Keep textarea focus and reset selection cursor
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = startPos + markdownText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 100);
    } else {
      setBlogForm(prev => ({
        ...prev,
        content: (prev.content || '') + markdownText
      }));
    }
  };

  // PRODUCT METRICS HANDLERS
  const handleOpenAddProduct = () => {
    setProductForm({
      id: 'prod_' + Date.now(),
      name: '',
      category: 'binh-gas',
      description: '',
      originalPrice: 400000,
      salePrice: 380000,
      isHot: false,
      isSale: false,
      isNew: true,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
      images: ['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600'],
      specs: { 'Trọng lượng': '12kg', 'Thương hiệu': 'Siam Gas' },
      slug: ''
    });
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setProductForm({ ...p });
    setIsEditingProduct(true);
  };

  const handleAddSpecItem = () => {
    if (newSpecKey && newSpecVal) {
      const updatedSpecs = { ...productForm.specs, [newSpecKey]: newSpecVal };
      setProductForm({ ...productForm, specs: updatedSpecs });
      setNewSpecKey('');
      setNewSpecVal('');
    }
  };

  const handleRemoveSpecItem = (keyToRemove: string) => {
    const updated = { ...productForm.specs };
    delete updated[keyToRemove];
    setProductForm({ ...productForm, specs: updated });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) {
      alert('Tên sản phẩm bắt buộc phải có!');
      return;
    }
    const cleanSlug = productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productData: Product = {
      ...(productForm as Product),
      slug: cleanSlug,
      images: productForm.images || [productForm.image || '']
    };

    const exists = products.some(p => p.id === productData.id);
    if (exists) {
      editProduct(productData);
    } else {
      addProduct(productData);
    }
    setIsEditingProduct(false);
  };

  // BLOG METRICS HANDLERS
  const handleOpenAddBlog = () => {
    setBlogForm({
      id: 'blog_' + Date.now(),
      title: '',
      category: 'an-toan',
      categoryName: 'Mẹo sử dụng gas an toàn',
      tags: ['An toàn gas'],
      author: 'Đại diện GAS KIỆT GẠO',
      date: new Date().toISOString().split('T')[0],
      slug: '',
      summary: '',
      content: '## Tiêu đề H2\nNội dung văn bản ở đây...\n\n- Danh sách mục 1\n- Danh sách mục 2',
      image: 'https://images.unsplash.com/photo-1584281729155-d141b6131c9e?auto=format&fit=crop&q=80&w=800',
      images: ['https://images.unsplash.com/photo-1584281729155-d141b6131c9e?auto=format&fit=crop&q=80&w=800'],
      metaTitle: '',
      metaDescription: '',
      faqs: []
    });
    setBlogImagesList([]);
    setIsEditingBlog(true);
  };

  const handleOpenEditBlog = (b: Blog) => {
    let currentContent = b.content || '';
    const parsedImages: { id: string; base64: string; isHidden: boolean }[] = [];
    
    // 1. Load any existing structured images from b.images
    if (b.images && Array.isArray(b.images)) {
      b.images.forEach((img) => {
        if (img.includes('|||')) {
          const [id, base64] = img.split('|||');
          parsedImages.push({ id, base64, isHidden: false });
        }
      });
    }

    // 2. Scan content markdown for long image URLs/base64 and extract them into clean IDs
    let indexCount = 1;
    const cleanedContent = currentContent.replace(/!\[(.*?)\]\((.+?)\)/g, (fullMatch, altText, url) => {
      // Check if it's already a matched ID in our list
      const alreadyHave = parsedImages.find(p => p.id === url);
      if (alreadyHave) {
        return fullMatch;
      }
      
      // Extract if it is base64 or a very long custom string
      if (url.startsWith('data:image/') || url.length > 200) {
        const newId = 'img_' + Date.now() + '_' + indexCount++;
        parsedImages.push({ id: newId, base64: url, isHidden: false });
        return `![${altText}](${newId})`;
      }
      
      return fullMatch;
    });

    setBlogForm({
      ...b,
      content: cleanedContent
    });
    setBlogImagesList(parsedImages);
    setIsEditingBlog(true);
  };

  const handleAddBlogTag = () => {
    if (newBlogTag && !blogForm.tags?.includes(newBlogTag)) {
      setBlogForm({ ...blogForm, tags: [...(blogForm.tags || []), newBlogTag] });
      setNewBlogTag('');
    }
  };

  const handleRemoveBlogTag = (tagToRemove: string) => {
    setBlogForm({ ...blogForm, tags: (blogForm.tags || []).filter(t => t !== tagToRemove) });
  };

  const handleAddBlogFaq = () => {
    if (newFaqQ && newFaqA) {
      const updatedFaqs = [...(blogForm.faqs || []), { question: newFaqQ, answer: newFaqA }];
      setBlogForm({ ...blogForm, faqs: updatedFaqs });
      setNewFaqQ('');
      setNewFaqA('');
    }
  };

  const handleRemoveBlogFaq = (idxToRemove: number) => {
    const updated = (blogForm.faqs || []).filter((_, idx) => idx !== idxToRemove);
    setBlogForm({ ...blogForm, faqs: updated });
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title) {
      alert('Tiêu đề bài viết không được để trống!');
      return;
    }
    const cleanSlug = blogForm.slug || blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const categoryNameObj = categories_vietnameses[blogForm.category as string] || 'Kiến thức chung';

    const blogData: Blog = {
      ...(blogForm as Blog),
      slug: cleanSlug,
      categoryName: categoryNameObj,
      metaTitle: blogForm.metaTitle || blogForm.title,
      metaDescription: blogForm.metaDescription || blogForm.summary || '',
      images: blogImagesList.map(img => `${img.id}|||${img.base64}`)
    };

    const exists = blogs.some(b => b.id === blogData.id);
    if (exists) {
      editBlog(blogData);
    } else {
      addBlog(blogData);
    }
    setIsEditingBlog(false);
  };

  const categories_vietnameses: { [key: string]: string } = {
    'an-toan': 'Mẹo Sử Dụng Gas An Toàn',
    'huong-dan': 'Hướng Dẫn Chọn Bếp Gas',
    'khuyen-mai': 'Tin Khuyến Mãi & Hưởng Ứng',
    'tin-tuc': 'Tin Tức Doanh Nghiệp',
    'oxy': 'Kiến Thức Bình Oxy Y Tế'
  };

  // Wordings, Contact, SEO saves
  const handleSaveWordingsAndSeo = () => {
    updateWording(wordingsForm);
    updateContact(contactForm);
    updateSEO(seoForm);
    updatePopup(popupForm);
  };

  if (isLocked) {
    return (
      <div className="max-w-md mx-auto my-20 bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-[#800000] mx-auto animate-bounce">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Yêu cầu đăng nhập CMS</h2>
            <p className="text-xs text-gray-400">Hệ thống quản trị chỉ dành riêng cho quản lý kho GAS KIỆT GẠO.</p>
          </div>
        </div>

        {authError && (
          <div className="bg-red-50 text-red-700 text-xs py-2 px-3 rounded border border-red-100 font-semibold text-center leading-relaxed">
            {authError}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 text-xs px-3.5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#800000] text-gray-800 font-medium"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 text-xs px-3.5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#800000] text-gray-800 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#800000] hover:bg-[#990000] transition-colors text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#800000]/10 mt-2"
          >
            <Unlock className="w-4 h-4" />
            <span>ĐĂNG NHẬP HỆ THỐNG</span>
          </button>
        </form>

        <p className="text-[10px] text-gray-400 font-light text-center font-mono">
          * Độc quyền bảo an bởi cơ cấu mã hóa dữ liệu GAS KIỆT GẠO.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100/90 shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row items-stretch my-8 max-w-7xl mx-auto">
      
      {/* 1. Left Nav Sidebar CMS */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#800000]" />
            <h3 className="font-extrabold text-[#2B2B2B] text-sm uppercase tracking-wider">Hệ Thống CMS</h3>
          </div>

          <div className="flex flex-col gap-1.5 text-xs font-bold">
            <button
              onClick={() => { setActiveSubTab('products'); setIsEditingProduct(false); }}
              className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'products' ? 'bg-[#800000] text-white shadow shadow-[#800000]/25' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Quản lý sản phẩm ({products.length})</span>
            </button>

            <button
              onClick={() => { setActiveSubTab('blogs'); setIsEditingBlog(false); }}
              className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'blogs' ? 'bg-[#800000] text-white shadow shadow-[#800000]/25' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Quản lý bài viết ({blogs.length})</span>
            </button>

            <button
              onClick={() => { setActiveSubTab('categories'); setIsEditingCategory(false); }}
              className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'categories' ? 'bg-[#800000] text-white shadow shadow-[#800000]/25' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Quản lý danh mục ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('banners')}
              className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'banners' ? 'bg-[#800000] text-white shadow shadow-[#800000]/25' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Quản lý Landing Layout</span>
            </button>

            <button
              onClick={() => setActiveSubTab('seo-contact')}
              className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'seo-contact' ? 'bg-[#800000] text-white shadow shadow-[#800000]/25' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>Cấu hình SEO & Cửa hàng</span>
            </button>

            <button
              onClick={() => setActiveSubTab('quotes')}
              className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'quotes' ? 'bg-[#800000] text-white shadow shadow-[#800000]/25' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="flex-1 flex justify-between items-center">
                <span>Khách hàng liên hệ</span>
                {quotes.filter(q => q.status === 'pending').length > 0 && (
                  <span className="bg-[#D4B483] text-gray-900 rounded-full w-4.5 h-4.5 text-[9px] font-black flex items-center justify-center animate-pulse">
                    {quotes.filter(q => q.status === 'pending').length}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('supabase')}
              className={`w-full text-left px-3.5 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'supabase' ? 'bg-[#800000] text-white shadow shadow-[#800000]/25' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Cơ sở dữ liệu Supabase</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-semibold">Bảo an: KÍCH HOẠT</span>
          <button onClick={() => setIsLocked(true)} className="text-[#800000] hover:underline">
            Đăng xuất
          </button>
        </div>
      </div>

      {/* 2. Right Sub-Tab Actions Dashboard */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[750px] no-scrollbar">
        
        {/* TAB 1: PRODUCTS MANAGER CMS */}
        {activeSubTab === 'products' && (
          <div className="space-y-8">
            {isEditingProduct ? (
              // Add/Edit Product Form Layout
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                    <Edit3 className="w-4.5 h-4.5 text-[#800000]" />
                    <span>Lập thông tin sản phẩm thiết bị</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsEditingProduct(false)}
                    className="p-1 px-3 text-xs bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Bỏ qua
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Tên thiết bị (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="vd: Bình Gas Siam đỏ 12kg"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Danh mục thiết bị</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Giá Niêm Yết (Gốc) (*)</label>
                    <input
                      type="number"
                      required
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Giá Khuyến Mãi (Nếu có)</label>
                    <input
                      type="number"
                      value={productForm.salePrice}
                      onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Đường dẫn ảnh sản phẩm (URL)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none"
                    />
                    <div className="mt-1 flex flex-col gap-1 bg-yellow-50/40 p-1.5 rounded border border-yellow-100">
                      <span className="text-[10px] text-zinc-600 font-bold uppercase block">Hoặc tải lên từ thiết bị</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => setProductForm(prev => ({ ...prev, image: base64, images: prev.images && prev.images.length > 0 ? prev.images : [base64] })))}
                        className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#800000]/10 file:text-[#800000] hover:file:bg-[#800000]/20 cursor-pointer w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 mr-auto mt-7">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      />
                      <span>CÒN HÀNG TRONG KHO</span>
                    </label>
                  </div>
                </div>

                {/* Interactive Product Album Manager for non-tech users */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200/50 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className="text-xs font-bold text-[#800000] uppercase tracking-wide block font-sans">🖼️ Album hình ảnh chi tiết sản phẩm ({productForm.images?.length || 0} ảnh)</span>
                      <p className="text-[10px] text-gray-500 font-medium">Bổ sung các ảnh chi tiết góc chụp khác hiển thị ở slideshow trang chi tiết tin tức sản phẩm.</p>
                    </div>
                  </div>

                  {productForm.images && productForm.images.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 p-2 bg-white rounded-lg border border-gray-150">
                      {productForm.images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded border border-gray-100 bg-zinc-50 overflow-hidden group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (productForm.images || []).filter((_, i) => i !== idx);
                              setProductForm(prev => ({ ...prev, images: updated }));
                            }}
                            className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shadow cursor-pointer"
                            title="Xóa hình ảnh này khỏi album"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 flex flex-col gap-1.5 bg-zinc-100/40 p-2.5 rounded border border-dashed border-gray-200">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase block">Chọn tải thêm một hoặc nhiều ảnh vào album:</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          Array.from(files).forEach((file: File) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                const base64 = reader.result;
                                setProductForm(prev => {
                                  const currentImages = prev.images || [];
                                  if (!currentImages.includes(base64)) {
                                    return {
                                      ...prev,
                                      images: [...currentImages, base64]
                                    };
                                  }
                                  return prev;
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }
                      }}
                      className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#800000]/15 file:text-[#800000] hover:file:bg-[#800000]/25 cursor-pointer w-full"
                    />
                  </div>
                </div>

                {/* Badge settings checkbox */}
                <div className="space-y-1.5 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
                  <span className="text-xs font-bold text-gray-600 block mb-2">Trạng thái huy hiệu nổi bật (Badge)</span>
                  <div className="flex gap-6">
                    <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isHot}
                        onChange={(e) => setProductForm({ ...productForm, isHot: e.target.checked })}
                      />
                      <span>HOT 🔥</span>
                    </label>
                    
                    <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isSale}
                        onChange={(e) => setProductForm({ ...productForm, isSale: e.target.checked })}
                      />
                      <span>SALE %</span>
                    </label>

                    <label className="inline-flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isNew}
                        onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                      />
                      <span>NEW ⭐</span>
                    </label>
                  </div>
                </div>

                {/* Simple description textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Mô tả ngắn sản phẩm</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Mô tả công năng bếp gas, loại lửa, độ mỏng gọn..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 resize-none focus:outline-none"
                  ></textarea>
                </div>

                {/* Specs block dynamic builder */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
                  <div>
                    <span className="text-xs font-bold text-[#2B2B2B] block">Bộ thông số kỹ thuật sản phẩm</span>
                    <p className="text-[10.5px] text-gray-500 mt-1 font-medium bg-[#800000]/5 text-[#800000] p-2 rounded-lg border border-[#800000]/10 leading-relaxed">
                      💡 <strong>Chú thích:</strong> Hãy nhập cặp thông tin tương ứng dưới dạng <strong>"Thông số" : "Giá trị"</strong> (ví dụ: Thông số là "Đánh lửa", Giá trị là "Magneto" hoặc Thông số là "Trọng lượng", Giá trị là "12kg") rồi nhấn "Thêm" để cập nhật thuộc tính kỹ thuật.
                    </p>
                  </div>
                  
                  {/* Current spec key values */}
                  {productForm.specs && Object.keys(productForm.specs).length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pb-2">
                      {Object.entries(productForm.specs).map(([key, val]) => (
                        <div key={key} className="bg-white p-2 text-xs rounded border border-gray-200 flex justify-between items-center">
                          <span className="font-bold text-gray-700">{key}: <span className="font-light text-gray-500">{val}</span></span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecItem(key)}
                            className="text-red-600 hover:text-red-800 text-[10px]"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add action row */}
                  <div className="flex flex-col sm:flex-row gap-2 items-end">
                    <div className="flex-1 w-full space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Thông số (Khóa)</span>
                      <input
                        type="text"
                        placeholder="vd: Xuất xứ"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        className="bg-white text-xs px-2.5 py-1.5 rounded border border-gray-200 w-full focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 w-full space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Giá trị (Thông số)</span>
                      <input
                        type="text"
                        placeholder="vd: Nhật Bản"
                        value={newSpecVal}
                        onChange={(e) => setNewSpecVal(e.target.value)}
                        className="bg-white text-xs px-2.5 py-1.5 rounded border border-gray-200 w-full focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSpecItem}
                      className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs px-4 py-2.5 rounded hover:bg-zinc-800 w-full sm:w-auto shrink-0 transition-colors"
                    >
                      Thành viên (Thêm Thông số)
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#800000] text-white font-bold text-xs px-6 py-3 rounded-lg flex items-center gap-1 hover:bg-[#a31d1d] shadow shadow-[#800000]/15 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>LƯU SẢN PHẨM REALTIME</span>
                  </button>
                </div>

              </form>
            ) : (
              // Main Product catalog grid summary list with quick add/edit triggers
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base">Tổng Kho Sản Phẩm</h4>
                    <p className="text-xs text-gray-400">Điều chỉnh giá, thay hình ảnh và bật tắt badge khuyến mãi realtime.</p>
                  </div>
                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-[#800000] text-[#D4B483] font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1 shadow hover:bg-opacity-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm thiết bị mới</span>
                  </button>
                </div>

                <div className="border border-gray-100/80 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-150">
                      <tr>
                        <th className="px-4 py-3">Ảnh</th>
                        <th className="px-4 py-3">Tên</th>
                        <th className="px-4 py-3">Danh Mục</th>
                        <th className="px-4 py-3">Giá Niêm yết/Sale</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 shrink-0">
                            <img
                              src={p.image}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-md border border-gray-200"
                            />
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 max-w-[200px] truncate">
                            {p.name}
                            <div className="flex gap-1.5 pt-1">
                              {p.isHot && <span className="bg-[#800000] text-white text-[8px] font-black px-1.5 py-0.2 rounded-sm shadow">HOT</span>}
                              {p.isSale && <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-sm shadow">%</span>}
                              {p.isNew && <span className="bg-[#D4B483] text-gray-900 text-[8px] font-black px-1.5 py-0.2 rounded-sm shadow">NEW</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-gray-500">
                            {p.category}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-gray-400 font-light line-through mr-1 text-[11px] block">{p.originalPrice.toLocaleString('vi-VN')}đ</span>
                            <span className="text-[#800000] font-bold text-xs">{p.salePrice.toLocaleString('vi-VN')}đ</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${p.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {p.inStock ? 'Còn Hàng' : 'Tạm Hết'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2 text-[11px] font-bold">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="text-gray-600 hover:text-[#800000] p-1.5 rounded bg-gray-50 hover:bg-gray-100"
                              >
                                Sửa
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirm({
                                    isOpen: true,
                                    title: 'Xác nhận xóa sản phẩm',
                                    message: `Bạn có chắc chắn muốn xóa sản phẩm số hiệu "${p.id}" mang tên "${p.name}" này vĩnh viễn khỏi danh sách bày bán?`,
                                    onConfirm: () => {
                                      deleteProduct(p.id);
                                      setDeleteConfirm(null);
                                    }
                                  });
                                }}
                                className="text-red-600 hover:text-red-800 p-1.5 rounded bg-red-50 cursor-pointer"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARTICLE BLOGS CMS */}
        {activeSubTab === 'blogs' && (
          <div className="space-y-8">
            {isEditingBlog ? (
              // Add/Edit Blog rich editor layout
              <form onSubmit={handleSaveBlog} className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-[#800000]" />
                    <span>Lập nội dung bài viết tin tức và cẩm nang</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsEditingBlog(false)}
                    className="p-1 px-3 text-xs bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Hủy bỏ
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Tiêu đề bài viết (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="Mẹo dập lửa ga bằng nước xà phòng..."
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Danh mục cẩm nang</label>
                    <select
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value as any })}
                      className="w-full bg-[#fcfcfc] text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    >
                      <option value="an-toan">Mẹo Sử Dụng Gas An Toàn</option>
                      <option value="huong-dan">Hướng Dẫn Chọn Bếp Gas</option>
                      <option value="khuyen-mai">Tin Khuyến Mãi</option>
                      <option value="tin-tuc">Tin Doanh Nghiệp</option>
                      <option value="oxy">Kiến Thức Bình Oxy Y Tế</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Đại diện tác giả</label>
                    <input
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Ảnh bìa bài viết (URL)</label>
                    <input
                      type="text"
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none"
                    />
                    <div className="mt-1 flex flex-col gap-1 bg-yellow-50/40 p-1.5 rounded border border-yellow-100">
                      <span className="text-[10px] text-zinc-600 font-bold uppercase block">Hoặc tải ảnh bìa từ máy</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => setBlogForm({ ...blogForm, image: base64 }))}
                        className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#800000]/10 file:text-[#800000] hover:file:bg-[#800000]/20 cursor-pointer w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Mã đính kèm clip YouTube ID (Nếu có)</label>
                    <input
                      type="text"
                      placeholder="vd: 9eLMyGivLSw"
                      value={blogForm.youtubeId}
                      onChange={(e) => setBlogForm({ ...blogForm, youtubeId: e.target.value })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Mô tả ngắn SEO (Meta description tóm lược)</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả bài viết để hiển thị trên kết quả tìm kiếm Google..."
                    value={blogForm.summary}
                    onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                    className="w-full bg-gray-200/50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 resize-none focus:outline-none"
                  ></textarea>
                </div>

                 {/* Body Content Editor */}
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-[#2B2B2B] block mb-0.5">Nội dung bài viết (Chỉnh sửa chuyên sâu có hình ảnh)</label>
                   
                   {/* Non-Tech Visual Image Assistant */}
                   <div className="flex flex-col gap-3 bg-yellow-50/30 p-4 rounded-xl border border-yellow-200/50 animate-in fade-in duration-200 my-2 text-left">
                     <span className="text-[11.5px] font-extrabold text-[#800000] flex items-center gap-1 uppercase font-sans">
                       🖼️ TRỢ LÝ HÌNH ẢNH THÔNG MINH (Dành cho người không rành mã)
                     </span>
                     <p className="text-[10.5px] text-gray-500 leading-relaxed font-semibold">
                       Hãy nhấp chuột vào vị trí cần đặt ảnh trong ô soạn thảo bên dưới, sau đó điền chú thích và bấm chọn tệp ảnh của bạn để hệ thống tự động chèn ngay tại vị trí trỏ chuột.
                     </p>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <div className="space-y-1">
                         <span className="text-[10px] text-zinc-500 font-bold uppercase block">1. Nhập chú thích ảnh (Tốt cho SEO tìm kiếm Google)</span>
                         <input
                           type="text"
                           placeholder="vd: Hướng dẫn tháo lắp bình gas an toàn..."
                           value={altTextForNewImage}
                           onChange={(e) => setAltTextForNewImage(e.target.value)}
                           className="w-full bg-white text-xs px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000] font-medium"
                         />
                       </div>
                       <div className="space-y-1">
                         <span className="text-[10px] text-zinc-500 font-bold uppercase block">2. Chọn tập tin ảnh từ máy tính</span>
                         <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => {
                             handleImageUpload(e, (base64) => {
                               const alt = altTextForNewImage.trim() || 'Hình ảnh cẩm nang gas sạch';
                               const imgId = 'img_' + Date.now() + '_' + Math.floor(Math.random() * 100);
                                handleInsertImageAtCursor(imgId, alt);
                               // Add to helper list for reuse
                               if (!blogImagesList.some(p => p.base64 === base64)) {
                                 setBlogImagesList(prev => [...prev, { id: imgId, base64, isHidden: false }]);
                               }
                               setAltTextForNewImage('');
                               e.target.value = ''; // Clean field
                             });
                           }}
                           className="text-[11px] text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#800000]/10 file:text-[#800000] hover:file:bg-[#800000]/20 cursor-pointer w-full"
                         />
                       </div>
                     </div>

                     {/* Uploaded images gallery inside editor */}
                     {blogImagesList.length > 0 && (
                       <div className="space-y-2 pt-2 border-t border-gray-200/50">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase block">
                              Thư viện ảnh ({blogImagesList.filter(img => !img.isHidden).length} hiển thị / {blogImagesList.filter(img => img.isHidden).length} đã ẩn):
                            </span>
                            {blogImagesList.some(img => img.isHidden) && (
                              <button
                                type="button"
                                onClick={() => setBlogImagesList(prev => prev.map(img => ({ ...img, isHidden: false })))}
                                className="text-[10px] text-[#800000] hover:underline font-bold cursor-pointer"
                              >
                                Hiện lại các ảnh đã ẩn
                              </button>
                            )}
                          </div>
                         <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1.5 bg-white rounded border border-gray-150">
                           {blogImagesList.map((img) => {
                              if (img.isHidden) return null;
                              return (
                             <div key={img.id} className="relative w-16 h-16 border border-gray-200 rounded bg-white overflow-hidden group hover:border-[#800000] transition-all">
                               <img src={img.base64} alt="" className="w-full h-full object-cover" />
                               <div className="absolute inset-x-0 bottom-0 bg-black/85 text-[8px] text-white font-mono text-center py-0.5 truncate px-1">{img.id}</div>
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-1">
                                 <button
                                   type="button"
                                   onClick={() => handleInsertImageAtCursor(img.id, 'Hình minh họa')}
                                   className="bg-[#800000] text-white text-[9px] font-bold px-1.5 py-0.5 rounded hover:scale-105 transition-transform cursor-pointer"
                                   title="Click để chèn ảnh bằng mã ID vào bài viết"
                                 >
                                   Chèn lại
                                 </button>
                                 <button
                                   type="button"
                                   onClick={() => {
                                     setBlogImagesList(prev => prev.map(item => item.id === img.id ? { ...item, isHidden: true } : item));
                                   }}
                                   className="bg-zinc-700 text-white text-[8px] font-bold px-1 rounded hover:bg-zinc-800 cursor-pointer"
                                   title="Bỏ hình này khỏi trợ lý (không làm mất ảnh trong nội dung)"
                                 >
                                   Ẩn đi
                                 </button>
                               </div>
                             </div>
                           );
                           })}
                         </div>
                         <p className="text-[9.5px] text-zinc-400 italic">💡 Click nút <strong>"Chèn ID"</strong> trên ảnh ở góc thư viện để dán mã ID <strong>(vd: ![chú thích](id_ảnh))</strong> vào bài để nội dung gọn gàng, giảm thiểu độ lag khi viết bài.</p>
                       </div>
                     )}
                   </div>

                   <div className="text-[10px] text-gray-400 bg-gray-50 p-2.5 rounded border border-gray-200/50 leading-relaxed">
                     Sử dụng các tiền tố: <b className="text-gray-700">## Tiêu đề H2</b>, <b className="text-gray-700">### Tiêu đề H3</b>, <b className="text-gray-700">- Mục lục dấu chấm</b>. Thêm các dòng bắt đầu bằng <b className="text-gray-700">| Ô 1 | Ô 2 |</b> để tự vẽ bảng thông số tiện nghi. Thẻ ảnh có dạng: <b className="text-gray-700">![mô tả_ảnh](đường_dẫn)</b>
                   </div>
                   
                   <textarea
                     ref={blogContentRef}
                     rows={12}
                     required
                     value={blogForm.content}
                     onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                     className="w-full bg-slate-50 text-xs px-4 py-3.5 rounded-lg border border-gray-200 font-mono focus:outline-none focus:border-[#800000]"
                   ></textarea>
                 </div>

                {/* FAQ builder within blog */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
                  <span className="text-xs font-bold text-[#2B2B2B]">Danh sách câu hỏi phụ FAQ cuối bài viết</span>
                  
                  {blogForm.faqs && blogForm.faqs.length > 0 && (
                    <div className="space-y-1.5">
                      {blogForm.faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white p-2.5 text-xs rounded border border-gray-200 flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-800">Q: {faq.question}</div>
                            <div className="font-light text-gray-500 text-[11px] pt-1">A: {faq.answer}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBlogFaq(idx)}
                            className="text-red-600 hover:text-red-800 text-[10px] sm:text-xs font-bold ml-2 shrink-0"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Câu hỏi?"
                      value={newFaqQ}
                      onChange={(e) => setNewFaqQ(e.target.value)}
                      className="bg-white text-xs px-2.5 py-1.5 rounded border border-gray-200 flex-1"
                    />
                    <input
                      type="text"
                      placeholder="Lời giải thích..."
                      value={newFaqA}
                      onChange={(e) => setNewFaqA(e.target.value)}
                      className="bg-white text-xs px-2.5 py-1.5 rounded border border-gray-200 flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddBlogFaq}
                      className="bg-zinc-950 text-white text-[11px] font-bold px-4 py-1.5 rounded h-8 hover:bg-zinc-900 shrink-0 self-end"
                    >
                      Bổ Sung FAQ
                    </button>
                  </div>
                </div>

                {/* Tag builder within blog */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
                  <span className="text-xs font-semibold text-[#2B2B2B] block">Bộ thẻ Tag bài viết</span>
                  
                  {blogForm.tags && blogForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {blogForm.tags.map((t) => (
                        <span key={t} className="bg-white px-2 py-1 text-[11px] rounded border border-gray-200 flex items-center gap-1">
                          <span>#{t}</span>
                          <button type="button" onClick={() => handleRemoveBlogTag(t)} className="text-red-500 font-bold hover:text-red-700">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="Thêm tag mới (vd: Antoangas)"
                      value={newBlogTag}
                      onChange={(e) => setNewBlogTag(e.target.value)}
                      className="bg-white text-xs px-2.5 py-1.5 rounded border border-gray-200 flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddBlogTag}
                      className="bg-zinc-900 text-white text-xs px-3 py-1.5 rounded"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="submit"
                    className="bg-[#800000] text-white font-bold text-xs px-6 py-3 rounded-lg flex items-center gap-1 shadow shadow-[#800000]/20 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>XUẤT BẢN BÀI VIẾT LÊN WEB</span>
                  </button>
                </div>

              </form>
            ) : (
              // Main Blog summary lists
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base">Tổng Bài Viết Tin Tức & Cẩm Nang</h4>
                    <p className="text-xs text-gray-400">Quản trị các bài báo hướng dẫn chọn bếp gas, an toàn gas gia đình chuẩn SEO.</p>
                  </div>
                  <button
                    onClick={handleOpenAddBlog}
                    className="bg-[#800000] text-[#D4B483] font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1 shadow cursor-pointer hover:bg-opacity-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Viết bài SEO mới</span>
                  </button>
                </div>

                <div className="border border-gray-100/80 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-150">
                      <tr>
                        <th className="px-4 py-3">Ảnh</th>
                        <th className="px-4 py-3">Tiêu đề bài báo</th>
                        <th className="px-4 py-3">Chuyên mục</th>
                        <th className="px-4 py-3 font-mono">Ngày đăng</th>
                        <th className="px-4 py-3">Tác giả</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {blogs.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 shrink-0">
                            <img
                              src={b.image}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-12 h-8 object-cover rounded border border-gray-150"
                            />
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 max-w-[280px] break-words">
                            {b.title}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {b.categoryName}
                          </td>
                          <td className="px-4 py-3 text-gray-500 font-mono">
                            {b.date}
                          </td>
                          <td className="px-4 py-3 text-gray-500 font-light">
                            {b.author}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2 text-[11px] font-bold">
                              <button
                                onClick={() => handleOpenEditBlog(b)}
                                className="text-gray-600 hover:text-[#800000] p-1.5 rounded bg-gray-50 hover:bg-gray-100"
                              >
                                Sửa bài
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirm({
                                    isOpen: true,
                                    title: 'Xác nhận xóa bài viết',
                                    message: `Bạn có chắc chắn muốn xóa bài viết cẩm nang mang tên "${b.title}" này vĩnh viễn không?`,
                                    onConfirm: () => {
                                      deleteBlog(b.id);
                                      setDeleteConfirm(null);
                                    }
                                  });
                                }}
                                className="text-red-600 hover:text-red-800 p-1.5 rounded bg-red-50 cursor-pointer"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LANDING LAYOUT & WORDING REALTIME EDITOR */}
        {activeSubTab === 'banners' && (
          <div className="space-y-8">
            <div className="pb-3 border-b border-gray-100">
              <h4 className="font-extrabold text-gray-900 text-base">Cấu hình Landing Hero & Wording Realtime</h4>
              <p className="text-xs text-gray-400">Tinh chỉnh các dòng tiêu đề giới thiệu doanh nghiệp và tiêu chuẩn an toàn hiển thị ngoài trang chủ.</p>
            </div>

            <div className="space-y-6">
              
              {/* Box 1 Wording config */}
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100/85 space-y-4">
                <span className="text-xs font-black text-[#800000] uppercase tracking-widest block">1. Slogans tiêu đề & Giới thiệu tập đoàn</span>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Tiêu đề Hero chính ngoài trang chủ</label>
                    <input
                      type="text"
                      value={wordingsForm.heroTitle}
                      onChange={(e) => setWordingsForm({ ...wordingsForm, heroTitle: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Nội dung khuyến mãi hiện hành chạy ở microbar</label>
                    <input
                      type="text"
                      value={wordingsForm.heroSub}
                      onChange={(e) => setWordingsForm({ ...wordingsForm, heroSub: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Tiêu đề đoạn giới thiệu tập đoàn</label>
                    <input
                      type="text"
                      value={wordingsForm.aboutTitle}
                      onChange={(e) => setWordingsForm({ ...wordingsForm, aboutTitle: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Nội dung mô tả giới thiệu chi tiết</label>
                    <textarea
                      rows={4}
                      value={wordingsForm.aboutText}
                      onChange={(e) => setWordingsForm({ ...wordingsForm, aboutText: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 resize-none font-light"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Promo Popup Config */}
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100/85 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-[#800000] uppercase tracking-widest block">2. Cấu hình POPUP Khuyến mãi bật lúc vào Web</span>
                  <label className="inline-flex items-center gap-1 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={popupForm.isActive}
                      onChange={(e) => setPopupForm({ ...popupForm, isActive: e.target.checked })}
                    />
                    <span>KÍCH HOẠT POPUP BANNER</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Tiêu đề quà tặng lớn</label>
                    <input
                      type="text"
                      value={popupForm.title}
                      onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Đường dẫn ảnh Popup (Min 400x400)</label>
                    <input
                      type="text"
                      value={popupForm.image}
                      onChange={(e) => setPopupForm({ ...popupForm, image: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none"
                    />
                    <div className="mt-1 flex flex-col gap-1 bg-yellow-50/40 p-1.5 rounded border border-yellow-101">
                      <span className="text-[10px] text-zinc-600 font-bold uppercase block">Hoặc tải ảnh Popup trực tiếp từ máy</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => setPopupForm({ ...popupForm, image: base64 }))}
                        className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#800000]/10 file:text-[#800000] hover:file:bg-[#800000]/20 cursor-pointer w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Chi tiết ưu đãi ghi trên Popup</label>
                  <textarea
                    rows={2}
                    value={popupForm.subtitle}
                    onChange={(e) => setPopupForm({ ...popupForm, subtitle: e.target.value })}
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 resize-none font-light"
                  ></textarea>
                </div>
              </div>

              {/* Box 3: HERO SLIDER BANNER MANAGEMENT */}
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100/85 space-y-4 animate-in fade-in duration-200 text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <div>
                    <span className="text-xs font-black text-[#800000] uppercase tracking-widest block font-sans">3. QUẢN LÝ SLIDE BANNER CHẠY TRANG CHỦ</span>
                    <p className="text-[11px] text-gray-400">Thêm, sửa và xóa các slide hình ảnh trượt động cỡ lớn ngoài màn hình chính của website.</p>
                  </div>
                  {!isEditingBanner && (
                    <button
                      type="button"
                      onClick={handleOpenAddBanner}
                      className="bg-[#800000] text-[#D4B483] font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1 hover:bg-opacity-95 shadow cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Slide Mới</span>
                    </button>
                  )}
                </div>

                {isEditingBanner ? (
                  <div className="bg-white p-5 rounded-xl border border-gray-150 space-y-4 text-xs animate-in zoom-in-95 duration-100">
                    <h5 className="font-extrabold text-xs text-gray-905 uppercase text-zinc-800">
                      {isNewBanner ? 'Tạo Slide Banner Mới' : 'Cập nhật Slide Banner'}
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 block">Tiêu đề chính hiển thị trên Slide (vd: Gas sạch chuẩn 100%)</label>
                        <input
                          type="text"
                          value={bannerForm.title || ''}
                          onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                          className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 block">Tiêu đề phụ / Mô tả quảng cáo</label>
                        <input
                          type="text"
                          value={bannerForm.subtitle || ''}
                          onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                          className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 block">Đường dẫn đích khi khách bấm Slide (vd: #bep-gas hoặc danh mục sản xuất)</label>
                        <input
                          type="text"
                          value={bannerForm.link || ''}
                          onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                          className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-600 block">URL ảnh liên kết Slide</label>
                        <input
                          type="text"
                          value={bannerForm.image || ''}
                          onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none"
                        />
                        <div className="mt-1 flex flex-col gap-1 bg-yellow-50/40 p-2 rounded border border-yellow-100">
                          <span className="text-[10px] text-zinc-650 font-bold uppercase block font-sans">Hoặc tải tập tin ảnh slide từ thiết bị</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => setBannerForm({ ...bannerForm, image: base64 }))}
                            className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#800000]/10 file:text-[#800000] hover:file:bg-[#800000]/20 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-row items-center pt-2">
                      <button
                        type="button"
                        onClick={handleSaveBanner}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Lưu Slide Banner</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingBanner(false)}
                        className="p-2 text-xs bg-gray-100 rounded hover:bg-gray-200 text-gray-700 cursor-pointer px-4"
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {banners && banners.length > 0 ? banners.map((b) => (
                      <div key={b.id} className="bg-white p-3 rounded-xl border border-gray-150 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <img
                            src={b.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-16 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
                          />
                          <div className="space-y-0.5 text-xs text-left">
                            <span className="font-bold text-gray-800 block truncate max-w-[200px]">{b.title || '(Không có tiêu đề)'}</span>
                            <span className="text-[10px] text-gray-400 block truncate max-w-[240px]">{b.subtitle || '(Không có phụ đề)'}</span>
                            <span className="text-[10px] font-mono text-gray-400 block truncate max-w-[240px]">Link: {b.link}</span>
                          </div>
                        </div>

                        <div className="flex gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditBanner(b)}
                            className="p-1 px-2.5 text-[11px] font-bold bg-zinc-50 hover:bg-zinc-100 text-gray-600 rounded-lg flex items-center gap-1 cursor-pointer border border-gray-200/60"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirm({
                                isOpen: true,
                                title: 'Xác nhận xóa Slide Banner',
                                message: `Bạn có chắc chắn muốn xóa Slide "${b.title || b.id}" khỏi danh sách trình chiếu chính của trang chủ?`,
                                onConfirm: () => {
                                  deleteBanner(b.id);
                                  setDeleteConfirm(null);
                                }
                              });
                            }}
                            className="p-1 px-2.5 text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-1 cursor-pointer border border-red-200/40"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>
                    )) : (
                      <p className="text-xs text-gray-400 font-light italic">Chưa có Slide Banner nào phục vụ trình chiếu ngoài trang chủ.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveWordingsAndSeo}
                  className="bg-[#800000] text-white font-bold text-xs px-6 py-3 rounded-lg flex items-center gap-1.5 hover:bg-[#a31d1d] shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>XÁC NHẬN CẬP NHẬT LANDING LAYOUT</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM CONTACT DETAILS & WEB SEO OPTIONS */}
        {activeSubTab === 'seo-contact' && (
          <div className="space-y-8">
            <div className="pb-3 border-b border-gray-100">
              <h4 className="font-extrabold text-gray-900 text-base">Cấu hình SEO & Thông tin Công Ty</h4>
              <p className="text-xs text-gray-400">Điều chỉnh địa chỉ trụ sở, hotlines dán trên nút Zalo/Messenger và các khóa SEO Meta Keywords.</p>
            </div>

            <div className="space-y-6">
              
              {/* Contact info edits */}
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                <span className="text-xs font-black text-[#800000] uppercase tracking-widest block">1. Danh mục Liên Hệ Khách Hàng (Zalo, Messenger, Hotlines)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Tên Doanh Nghiệp (Pháp lý)</label>
                    <input
                      type="text"
                      value={contactForm.companyName}
                      onChange={(e) => setContactForm({ ...contactForm, companyName: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Hotline Đổi Gas 24/7 (vàng dán cổ chai)</label>
                    <input
                      type="text"
                      value={contactForm.hotline}
                      onChange={(e) => setContactForm({ ...contactForm, hotline: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Đường dẫn Chat Zalo (zalo.me/...)</label>
                    <input
                      type="text"
                      value={contactForm.zaloLink}
                      onChange={(e) => setContactForm({ ...contactForm, zaloLink: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Đường dẫn Messenger (m.me/...)</label>
                    <input
                      type="text"
                      value={contactForm.fbMessengerLink}
                      onChange={(e) => setContactForm({ ...contactForm, fbMessengerLink: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Địa Chỉ Trụ Sở Chính (*)</label>
                  <input
                    type="text"
                    value={contactForm.addressMain}
                    onChange={(e) => setContactForm({ ...contactForm, addressMain: e.target.value })}
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Mã Iframe nhúng bản đồ Google Map (src link nhúng)</label>
                  <input
                    type="text"
                    value={contactForm.mapsEmbedUrl}
                    onChange={(e) => setContactForm({ ...contactForm, mapsEmbedUrl: e.target.value })}
                    className="w-full bg-white text-[11px] px-3.5 py-2.5 rounded-lg border border-gray-200 font-mono"
                  />
                </div>
              </div>

              {/* SEO Configurations */}
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-4">
                <span className="text-xs font-black text-[#800000] uppercase tracking-widest block">2. Khóa SEO Meta Toàn Diện (Chuẩn Google Index)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">SEO Default Title (Thẻ tiêu đề)</label>
                    <input
                      type="text"
                      value={seoForm.metaTitle}
                      onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">SEO Keywords (Phân tách bằng dấu phẩy)</label>
                    <input
                      type="text"
                      value={seoForm.metaKeywords}
                      onChange={(e) => setSeoForm({ ...seoForm, metaKeywords: e.target.value })}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">SEO Default Meta Description (Nội dung mô tả)</label>
                  <textarea
                    rows={2}
                    value={seoForm.metaDescription}
                    onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 resize-none font-light"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Ảnh đại diện mặc định của Web khi chia sẻ FB/Zalo (SEO OpenGraph Image)</label>
                  <input
                    type="text"
                    value={seoForm.ogImage || ''}
                    onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none"
                  />
                  <div className="mt-1 flex flex-col gap-1 bg-yellow-50/40 p-1.5 rounded border border-yellow-101">
                    <span className="text-[10px] text-zinc-650 font-bold uppercase block font-sans">Tải ảnh đại diện SEO trực tiếp từ máy</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (base64) => setSeoForm({ ...seoForm, ogImage: base64 }))}
                      className="text-[11px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#800000]/10 file:text-[#800000] hover:file:bg-[#800000]/20 cursor-pointer w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveWordingsAndSeo}
                  className="bg-[#800000] text-white font-bold text-xs px-6 py-3 rounded-lg flex items-center gap-1.5 hover:bg-[#a31d1d] shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>XÁC NHẬN CẬP NHẬT CẤU HÌNH DOANH NGHIỆP</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: CLIENT CONTACTS & QUOTE REQUEST LOGS */}
        {activeSubTab === 'quotes' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h4 className="font-extrabold text-gray-900 text-base">Hồ Sơ Yêu Cầu Tư Vấn & Khách Liên Hệ</h4>
              <p className="text-xs text-gray-400">Danh sách cuộc gọi và tin nhắn gửi từ biểu mẫu trang chủ, bài viết chi tiết, danh mục thiết bị.</p>
            </div>

            {quotes.length > 0 ? (
              <div className="space-y-4">
                {quotes.map((q) => (
                  <div 
                    key={q.id}
                    className={`p-5 rounded-2xl border shadow-sm transition-all space-y-3 ${
                      q.status === 'pending' 
                        ? 'bg-rose-50/20 border-[#800000]/20' 
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-gray-900">{q.name}</span>
                        {q.status === 'pending' ? (
                          <span className="bg-red-100 text-[#800000] text-[9px] font-black px-2 py-0.5 rounded shadow-sm">MỚI YÊU CẦU</span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-[9px] font-black px-2 py-0.5 rounded shadow-sm">ĐÃ XỬ LÝ</span>
                        )}
                      </div>
                      <span className="text-gray-400 font-mono text-[10px] sm:text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {q.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Điện thoại / Zalo</span>
                        <a href={`tel:${q.phone}`} className="text-[#800000] font-bold hover:underline">
                          {q.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Thiết bị quan tâm</span>
                        <span className="font-semibold text-gray-700">{q.productName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Địa chỉ Email</span>
                        <span className="font-light text-gray-500 font-mono">{q.email}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 font-light leading-relaxed">
                      <b>Yêu cầu:</b> {q.message}
                    </div>

                    {q.status === 'pending' && (
                      <div className="pt-2 flex justify-start gap-2">
                        <button
                          onClick={() => markQuoteRequestProcessed(q.id)}
                          className="bg-green-700 hover:bg-green-800 text-white font-bold text-[10px] sm:text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Xác nhận đã gọi điện xử lý</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 max-w-sm mx-auto space-y-3">
                <span className="text-3xl">📭</span>
                <h4 className="font-bold text-gray-800 text-sm">Chưa có yêu cầu liên hệ nào</h4>
                <p className="text-xs text-gray-400 font-light max-w-xs mx-auto">
                  Toàn bộ biểu mẫu liên hệ khách gửi ngoài trang chủ sẽ được lưu vết hiển thị trực tiếp tại tab quản trị này.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PRODUCT CATEGORIES MANAGEMENT */}
        {activeSubTab === 'categories' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-gray-900 text-base">Quản Lý Danh Mục Sản Phẩm</h4>
                <p className="text-xs text-gray-400">Thêm, sửa và xóa danh mục mặt hàng hàng hóa thiết bị hiển thị trên website.</p>
              </div>
              {!isEditingCategory && (
                <button
                  onClick={() => {
                    setCategoryForm({ id: '', name: '' });
                    setIsNewCategory(true);
                    setIsEditingCategory(true);
                  }}
                  className="bg-[#800000] text-[#D4B483] font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1 shadow hover:bg-opacity-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm danh mục mới</span>
                </button>
              )}
            </div>

            {isEditingCategory ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!categoryForm.id || !categoryForm.name) {
                    alert('Vui lòng điền mã ID danh mục và tên danh mục hiển thị!');
                    return;
                  }
                  // Normalization ID logic
                  const cleanId = categoryForm.id.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
                  if (isNewCategory) {
                    const exist = categories.find(c => c.id === cleanId);
                    if (exist) {
                      alert('Mã nhóm ID này đã tồn tại, kính mong admin nhập mã khác!');
                      return;
                    }
                    addCategory({ id: cleanId, name: categoryForm.name.trim() });
                  } else {
                    editCategory({ id: categoryForm.id, name: categoryForm.name.trim() });
                  }
                  setIsEditingCategory(false);
                }}
                className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 max-w-lg shadow-sm"
              >
                <h5 className="font-bold text-gray-900 text-sm">
                  {isNewCategory ? 'Tạo mới danh mục sản phẩm' : 'Chỉnh sửa danh mục'}
                </h5>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Mã nhóm ID (Viết liền hoa thường không dấu, không khoảng cách) (*)</label>
                    <input
                      type="text"
                      disabled={!isNewCategory}
                      placeholder="vd: bep-tu, binh-gas-mini"
                      value={categoryForm.id}
                      onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                      className="w-full bg-gray-50 disabled:bg-gray-100/70 disabled:text-gray-400 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">Tên danh mục hiển thị (*)</label>
                    <input
                      type="text"
                      placeholder="vd: Bếp Từ, Bình Gas Mini"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full bg-gray-50 text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-[#800000] text-white hover:bg-[#a31d1d] font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lưu danh mục</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingCategory(false)}
                    className="p-2 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors px-3.5 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const itemsCount = products.filter(p => p.category === cat.id).length;
                  return (
                    <div 
                      key={cat.id} 
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow transition-shadow flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <h5 className="font-extrabold text-[#2B2B2B] text-sm">{cat.name}</h5>
                        <p className="text-[11px] text-gray-400 font-mono">
                          Mã: {cat.id} • {itemsCount} sản phẩm
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCategoryForm({ id: cat.id, name: cat.name });
                            setIsNewCategory(false);
                            setIsEditingCategory(true);
                          }}
                          className="p-1.5 px-3 text-zinc-600 hover:text-[#800000] hover:bg-zinc-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Sửa</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setDeleteConfirm({
                              isOpen: true,
                              title: 'Xác nhận xóa danh mục',
                              message: `Bạn có chắc chắn muốn xóa danh mục "${cat.name}" này? Lưu ý: Các sản phẩm thuộc danh mục này sẽ hiển thị dưới dạng chưa phân loại.`,
                              onConfirm: () => {
                                deleteCategory(cat.id);
                                setDeleteConfirm(null);
                              }
                            });
                          }}
                          className="p-1.5 px-3 text-zinc-400 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: SUPABASE DATABASE ENGINE CONFIGURATION */}
        {activeSubTab === 'supabase' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-gray-900 text-base">Hệ Thống Cơ Sở Dữ Liệu Supabase</h4>
                <p className="text-xs text-gray-400">Đồng bộ đám mây thời gian thực, lưu trữ thông tin sản phẩm, bài viết và đơn đăng ký tư vấn bền vững.</p>
              </div>
            </div>

            {/* Connection Status Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#800000]" />
                  <span>Trạng thái kết nối Supabase Cloud</span>
                </h5>
                
                <div className="flex flex-wrap items-center gap-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    isSupabaseReady 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : isSupabaseEnabled 
                        ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isSupabaseReady ? 'bg-emerald-500' : isSupabaseEnabled ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    {isSupabaseReady ? 'Đã kích hoạt trực tuyến' : isSupabaseEnabled ? 'Đang kiểm tra / Chưa có bảng' : 'Chưa cấu hình'}
                  </span>
                  
                  <span className="text-xs text-gray-400 font-mono">
                    Host: {isSupabaseEnabled ? 'Supabase Cloud (External API)' : 'Chưa có cấu hình'}
                  </span>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-medium text-gray-700">
                    <strong className="text-gray-900">Chi tiết phản hồi:</strong> {supabaseStatusMsg}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#800000]/5 border border-[#800000]/10 p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h6 className="font-bold text-gray-900 text-xs">Cấu hình bảo mật môi trường</h6>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Vui lòng thêm các biến môi trường sau trong phần Settings/Secrets của AI Studio để ứng dụng kết nối:
                  </p>
                  <code className="block text-[10px] text-[#800000] font-mono bg-white p-1.5 rounded border border-gray-150/80 mt-1">
                    VITE_SUPABASE_URL<br />
                    VITE_SUPABASE_ANON_KEY
                  </code>
                </div>
              </div>
            </div>

            {/* Sync local to remote hub */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="space-y-1">
                <h5 className="font-bold text-gray-800 text-sm">Đồng Bộ Hóa Dữ Liệu Cục Bộ Lên Đám Mây</h5>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Nếu bạn mới thiết kế cơ sở dữ liệu trên Supabase và muốn di chuyển toàn bộ dữ liệu mẫu hiện tại (bao gồm các sản phẩm và bài viết bạn đã tự nhập trước đây), hãy sử dụng nút bấm dưới đây. Tất cả các mục sẽ được ghi đè an toàn lên Supabase.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await triggerSyncLocalToSupabase();
                    if (ok) {
                      alert('Đồng bộ dữ liệu thành công rực rỡ!');
                    }
                  }}
                  disabled={!isSupabaseEnabled || isLoadingFromSupabase}
                  className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                    !isSupabaseEnabled 
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'bg-[#800000] text-[#D4B483] hover:bg-opacity-95'
                  }`}
                >
                  <Save className={`w-4 h-4 ${isLoadingFromSupabase ? 'animate-spin' : ''}`} />
                  <span>
                    {isLoadingFromSupabase ? 'Đang đồng bộ...' : 'Đẩy toàn bộ dữ liệu cục bộ lên Supabase'}
                  </span>
                </button>
                
                {!isSupabaseEnabled && (
                  <p className="text-[10px] text-red-600 font-bold italic animate-pulse">
                    ⚠ Vui lòng cấu hình VITE_SUPABASE_URL & ANON_KEY để kích hoạt tính năng đồng bộ.
                  </p>
                )}
              </div>
            </div>

            {/* SQL Table Generation Panel */}
            <div className="bg-white p-6 rounded-2xl border border-gray-150/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h5 className="font-bold text-gray-800 text-sm">Mã SQL Khởi Tạo Bảng (SQL Schema Setup Instructions)</h5>
                  <p className="text-xs text-gray-400">Copy và chạy lệnh này trong Supabase Dashboard -&gt; SQL Editor của project bạn để tạo các bảng lưu trữ tự động.</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="w-3.5 h-3.5 flex items-center justify-center">
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : '📋'}
                  </span>
                  <span>{copiedSql ? 'Đã sao chép!' : 'Sao chép đoạn mã SQL Code'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="text-[10.5px] font-mono leading-relaxed bg-zinc-950 text-zinc-300 p-5 rounded-2xl h-[320px] overflow-y-auto border border-zinc-900 shadow-inner scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {SUPABASE_SETUP_SQL}
                </pre>
                <div className="absolute bottom-3 right-3 bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 text-[10px] text-zinc-500 select-none">
                  💡 Hỗ trợ: Products, Blogs, Banners, Campaigns, Quotes, Categories, Settings (JSONB)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Beautiful Custom Custom Confirmation Modal */}
        {deleteConfirm && deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-150/80 animate-in zoom-in-95 duration-100 text-left">
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <div className="bg-red-50 p-2.5 rounded-full border border-red-100">
                  <Trash2 className="w-5 h-5 animate-bounce" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-wide text-gray-900 font-sans">{deleteConfirm.title}</h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-semibold mb-5">{deleteConfirm.message}</p>
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteConfirm.onConfirm();
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-red-200 cursor-pointer transition-all"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
