/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { 
  PhoneCall, 
  MessageCircle, 
  ChevronRight, 
  Search, 
  Filter, 
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const {
    products,
    contact,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    addQuoteRequest,
    currentViewId,
    navigateTo,
    categories: appCategories
  } = useApp();

  // Active Selected Product Details Modal Overlay
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryQty, setInquiryQty] = useState('1');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState('');

  // Local states for filtering
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<'all' | 'hot' | 'sale' | 'new'>('all');
  const [localSearch, setLocalSearch] = useState('');

  // Handle URL SKU/ID route if navigated from another page (e.g., clicking on Home, slug or ID)
  useEffect(() => {
    if (currentViewId) {
      const prod = products.find(p => p.id === currentViewId || p.slug === currentViewId);
      if (prod) {
        setActiveProduct(prod);
      }
    } else {
      setActiveProduct(null);
    }
  }, [currentViewId, products]);

  const categories = [
    { value: 'all', label: 'Tất cả sản phẩm' },
    ...appCategories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  // Search Submit Handler inside view catalog
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  // Filter items matching Category, Badge filters and keyword Search Queries
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesBadge =
      selectedBadgeFilter === 'all' ||
      (selectedBadgeFilter === 'hot' && p.isHot) ||
      (selectedBadgeFilter === 'sale' && p.isSale) ||
      (selectedBadgeFilter === 'new' && p.isNew);

    const matchQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesBadge && matchQuery;
  });

  // Handle Inquiry Form Submission
  const handleInquirySubmit = (e: React.FormEvent, productName: string) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      alert('Vui lòng nhập Tên và Số Điện Thoại để tư vấn viên liên hệ!');
      return;
    }

    addQuoteRequest({
      name: inquiryName,
      phone: inquiryPhone,
      email: 'N/A',
      productName: `${productName} (SL: ${inquiryQty})`,
      message: inquiryMsg || `Yêu cầu liên hệ khẩn tư vấn qua điện thoại. Khách quan tâm số lượng ${inquiryQty}.`
    });

    setInquirySuccess('Yêu cầu của bạn đã được tiếp nhận! Kỹ thuật viên sẽ gọi lại sau ít phút.');
    setInquiryName('');
    setInquiryPhone('');
    setInquiryMsg('');
    setInquiryQty('1');

    setTimeout(() => {
      setInquirySuccess('');
    }, 5000);
  };

  const handleBackToCatalog = () => {
    navigateTo('products');
    setActiveProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      
      {/* Dynamic Detail Panel Overlay (Structured detailed view of product) */}
      {activeProduct ? (
        <div className="animate-in fade-in slide-in-from-left-6 duration-300 space-y-8">
          
          {/* Back Action Header Breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToCatalog}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#800000] uppercase tracking-wider group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Quay lại danh mục sản phẩm</span>
            </button>
            <span className="text-gray-300 text-xs">/</span>
            <span className="text-gray-400 text-xs truncate max-w-[200px] sm:max-w-xs">{activeProduct.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Product Images Grid */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow bg-white">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Float Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {activeProduct.isHot && (
                    <span className="bg-[#800000] text-white font-black text-[10px] px-2.5 py-1 rounded shadow">HOT</span>
                  )}
                  {activeProduct.isSale && (
                    <span className="bg-red-500 text-white font-black text-[10px] px-2.5 py-1 rounded shadow">SALE</span>
                  )}
                  {activeProduct.isNew && (
                    <span className="bg-[#D4B483] text-gray-900 font-black text-[10px] px-2.5 py-1 rounded shadow">NEW</span>
                  )}
                </div>
              </div>

              {/* Multi-images Carousel Indicators row */}
              {activeProduct.images && activeProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {activeProduct.images.map((img, idx) => (
                    <div 
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-[#800000] transition-colors"
                    >
                      <img
                        src={img}
                        alt={`Thêm ${idx}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Middle: Product description, specs table */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <span className="text-xs bg-gray-100 text-[#800000] font-bold px-2.5 py-1 rounded">
                  {categories.find(c => c.value === activeProduct.category)?.label || 'Gas & Thiết Bị'}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B2B2B]">
                  {activeProduct.name}
                </h1>
                
                {/* Stock indicator badge */}
                <div className="flex items-center gap-2 pt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${activeProduct.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-xs font-bold text-gray-600">
                    {activeProduct.inStock ? 'TÌNH TRẠNG: CÒN HÀNG - SẴN SÀNG GIAO' : 'TẠM HẾT HÀNG'}
                  </span>
                </div>
              </div>

              {/* Price Tag */}
              <div className="bg-[#F8F8F8] p-4.5 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-400 font-semibold mb-1">GIÁ BÁN BUÔN / BÁN LẺ DỰ KIẾN:</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[#800000] text-2xl font-black">
                    {activeProduct.salePrice.toLocaleString('vi-VN')} đ
                  </span>
                  {activeProduct.originalPrice > activeProduct.salePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {activeProduct.originalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 font-light mt-1.5 leading-relaxed">
                  * Giá thực tế có thể dao động nhẹ theo thị trường gas thế giới CP. Liên hệ hotline để nhận báo giá chiết khấu dự án tốt nhất.
                </p>
              </div>

              {/* Short summary text */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-gray-600 uppercase tracking-widest flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#800000]" />
                  <span>Tổng quan sản phẩm</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light">
                  {activeProduct.description}
                </p>
              </div>

              {/* Specs Table List */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs text-gray-600 uppercase tracking-widest">Thông số kỹ thuật chuẩn</h4>
                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left">
                    <tbody>
                      {Object.entries(activeProduct.specs).map(([key, val], idx) => (
                        <tr 
                          key={idx}
                          className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100/60`}
                        >
                          <td className="px-4 py-3 font-semibold text-gray-600">{key}</td>
                          <td className="px-4 py-3 text-gray-500">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Safety banner notes */}
              <div className="bg-red-50 p-4 rounded-xl border border-red-100/60 leading-relaxed space-y-2">
                <div className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <span>⚠️ CAM KẾT CHẤT LƯỢNG TỪ GAS KIỆT GẠO</span>
                </div>
                <ul className="text-[11px] text-red-700 space-y-1 pl-4 list-disc">
                  <li>Bảo hiểm an toàn chất đốt lên đến 2 tỷ đồng.</li>
                  <li>Lắp đặt và dùng nước xà phòng kiểm tra rò rỉ khí gas tại chỗ.</li>
                  <li>Phục vụ đổi gas, xử lý kỹ thuật túc trực 24/7.</li>
                </ul>
              </div>

            </div>

            {/* Right: Instant calling buttons & Zalo / Call to Action inquiry Form */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl space-y-6 lg:sticky lg:top-32">
              <div className="space-y-2 text-center lg:text-left">
                <h3 className="font-bold text-sm text-gray-900">LIÊN HỆ KHUYÊN DÙNG</h3>
                <p className="text-xs text-gray-400">Quý khách vui lòng liên lạc tư vấn trực tiếp:</p>
              </div>

              {/* 3 Floater buttons inside block */}
              <div className="space-y-2.5">
                <a
                  href={`tel:${contact.hotline}`}
                  className="w-full bg-[#800000] hover:bg-[#a31d1d] text-white text-xs font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow shadow-[#800000]/10 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>GỌI HOTLINE: {contact.hotline}</span>
                </a>

                <a
                  href={contact.zaloLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0068e6] hover:bg-blue-700 text-white text-xs font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>LIÊN HỆ ZALO NGAY</span>
                </a>

                <a
                  href={contact.fbMessengerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0084ff] hover:bg-blue-600 text-white text-xs font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>NHẮN MESSENGER FACEBOOK</span>
                </a>
              </div>

              <div className="text-center">
                <span className="text-gray-300 text-xs">— HOẶC ĐĂNG KÝ GỌI LẠI —</span>
              </div>

              {/* Minimal inline request consultation form */}
              <form onSubmit={(e) => handleInquirySubmit(e, activeProduct.name)} className="space-y-4">
                {inquirySuccess && (
                  <div className="bg-green-50 text-green-700 text-xs px-3.5 py-2 rounded-lg border border-green-100 font-semibold leading-relaxed">
                    🎉 {inquirySuccess}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tên khách hàng (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-gray-50 text-xs px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Điện thoại / Zalo (*)</label>
                  <input
                    type="tel"
                    required
                    placeholder="SĐT liên hệ"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full bg-gray-50 text-xs px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số lượng</label>
                    <input
                      type="number"
                      min="1"
                      value={inquiryQty}
                      onChange={(e) => setInquiryQty(e.target.value)}
                      className="w-full bg-gray-50 text-xs px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-zinc-900 text-white hover:bg-[#800000] text-[11px] font-bold py-2.5 rounded-lg h-10 cursor-pointer transition-colors"
                    >
                      Đăng Ký Khảo Sát
                    </button>
                  </div>
                </div>
              </form>

            </div>

          </div>

        </div>
      ) : (
        /* Catalog View Browse Grid */
        <div className="space-y-10 animate-in fade-in duration-300">
          
          {/* Header title */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#800000] text-xs font-bold uppercase tracking-widest">Kho thiết bị GAS KIỆT GẠO</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B]">
              Danh Mục Sản Phẩm Gas & Bình Oxy Y Tế
            </h1>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              Tất cả bình gas dân dụng/công nghiệp, bình oxy nén khí tinh chất bảo an 24/7, van ngắt và dây dẫn gas chống cắt chuột bọ nhập khẩu nguyên bộ.
            </p>
          </div>

          {/* Filtering control zone */}
          <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-4">
            
            {/* Quick Categories filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap w-full xl:w-auto overflow-x-auto no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`text-xs px-4 py-2 rounded-lg font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === c.value
                      ? 'bg-[#800000] text-white border-transparent shadow shadow-[#800000]/10'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sub-Badge toggle + Search input */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
              
              {/* Badge selector options */}
              <div className="bg-gray-50 p-1 rounded-lg border border-gray-200/60 flex items-center text-[11px] font-bold text-gray-500 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setSelectedBadgeFilter('all')}
                  className={`px-3 py-1.5 rounded-md ${selectedBadgeFilter === 'all' ? 'bg-white text-[#800000] shadow' : 'hover:text-gray-900'}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setSelectedBadgeFilter('hot')}
                  className={`px-3 py-1.5 rounded-md ${selectedBadgeFilter === 'hot' ? 'bg-white text-[#800000] shadow' : 'hover:text-gray-900'}`}
                >
                  HOT 🔥
                </button>
                <button
                  onClick={() => setSelectedBadgeFilter('sale')}
                  className={`px-3 py-1.5 rounded-md ${selectedBadgeFilter === 'sale' ? 'bg-white text-[#800000] shadow' : 'hover:text-gray-900'}`}
                >
                  SALE 🏷️
                </button>
                <button
                  onClick={() => setSelectedBadgeFilter('new')}
                  className={`px-3 py-1.5 rounded-md ${selectedBadgeFilter === 'new' ? 'bg-white text-[#800000] shadow' : 'hover:text-gray-900'}`}
                >
                  Nổi bật ⭐
                </button>
              </div>

              {/* Local query search input */}
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-60">
                <input
                  type="text"
                  placeholder="Lọc từ khóa..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-gray-50 text-xs pl-8 pr-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                />
                <Search className="absolute left-2.5 top-3 text-gray-400 w-3.5 h-3.5" />
                <button type="submit" className="hidden" />
              </form>

            </div>

          </div>

          {/* Catalog grid results */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => {
                const hasDiscount = p.originalPrice > p.salePrice;
                return (
                  <div 
                    key={p.id}
                    className="bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    
                    {/* Item header image thumbnail */}
                    <div className="relative aspect-4/3 bg-gray-50 overflow-hidden group">
                      
                      {/* Floating badges */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                        {p.isHot && (
                          <span className="bg-[#800000] text-white font-black text-[9px] px-2 py-0.5 rounded shadow">HOT</span>
                        )}
                        {p.isSale && (
                          <span className="bg-red-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">SALE</span>
                        )}
                        {p.isNew && (
                          <span className="bg-[#D4B483] text-gray-900 font-black text-[9px] px-2 py-0.5 rounded shadow">NEW</span>
                        )}
                      </div>

                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* stock level overlay */}
                      <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide">
                        {p.inStock ? '🟢 CÒN HÀNG' : '🔴 HẾT HÀNG'}
                      </div>
                    </div>

                    {/* body contents */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="text-[9px] bg-red-50 text-[#800000] font-black uppercase tracking-widest px-2 py-0.5 rounded self-start w-fit">
                          {categories.find(c => c.value === p.category)?.label || 'Gas & Thiết bị'}
                        </div>
                        
                        <h3 
                          onClick={() => navigateTo('products', p.id)}
                          className="font-bold text-base text-gray-900 hover:text-[#800000] transition-colors line-clamp-2 cursor-pointer leading-tight"
                        >
                          {p.name}
                        </h3>
                        
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-light">
                          {p.description}
                        </p>
                      </div>

                      {/* Pricing block */}
                      <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                        <div>
                          {hasDiscount ? (
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-gray-400 line-through block leading-none">
                                {p.originalPrice.toLocaleString('vi-VN')} đ
                              </span>
                              <span className="text-[#800000] font-black text-sm">
                                {p.salePrice.toLocaleString('vi-VN')} đ
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-900 font-extrabold text-sm">
                              {p.originalPrice.toLocaleString('vi-VN')} đ
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => navigateTo('products', p.id)}
                          className="text-white bg-[#800000] hover:bg-[#a31d1d] font-bold text-xs px-3.5 py-2.5 rounded transition-transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          Yêu cầu tư vấn
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 max-w-lg mx-auto space-y-4">
              <span className="text-3xl">🔍</span>
              <h3 className="font-bold text-gray-800 text-lg">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Chúng tôi không tìm thấy thiết bị nào khớp với từ khóa của bạn. Vui lòng bấm xóa bộ lọc hoặc liên hệ trực tiếp hotline để tư vấn viên chụp gửi kho ảnh thực tế.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBadgeFilter('all');
                  setSearchQuery('');
                  setLocalSearch('');
                }}
                className="bg-gray-100 hover:bg-[#800000] hover:text-white text-gray-700 text-xs font-bold px-4 py-2 rounded transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
