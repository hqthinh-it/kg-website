/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  HeartHandshake, 
  Clock, 
  PhoneCall, 
  Calendar,
  Sparkles,
  Send,
  ExternalLink
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    blogs,
    banners,
    contact,
    wordings,
    addQuoteRequest,
    navigateTo,
    setSelectedCategory,
    categories
  } = useApp();

  // Hero Carousel State
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Quote form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedProductInterest, setSelectedProductInterest] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [quoteError, setQuoteError] = useState('');

  // Auto rotate banner carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const handlePrevBanner = () => {
    setActiveBannerIdx((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextBanner = () => {
    setActiveBannerIdx((prev) => (prev + 1) % banners.length);
  };

  // Quote Submission Handler
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setQuoteError('Vui lòng nhập tên và số điện thoại liên hệ!');
      return;
    }
    setQuoteError('');
    addQuoteRequest({
      name: customerName,
      phone: customerPhone,
      email: customerEmail || 'N/A',
      productName: selectedProductInterest || 'Tư vấn tổng quát thiết bị Gas/Oxy',
      message: customerMessage || 'Khách hàng có nhu cầu tư vấn trực tiếp từ biểu mẫu Trang Chủ.'
    });

    // Reset Form
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setSelectedProductInterest('');
    setCustomerMessage('');
  };

  // Filter only prominent items (Hot/New/Sale) for homepage grid
  const featuredProducts = products.slice(0, 6);

  // Take the 3 most recent blogs
  const recentBlogs = blogs.slice(0, 3);

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* 1. Hero banner Slider section */}
      <section className="relative h-[480px] md:h-[580px] bg-gray-950 overflow-hidden text-white">
        {banners.length > 0 && (
          <div className="relative w-full h-full">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === activeBannerIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Image Overlay */}
                <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent z-10" />
                <img
                  src={banner.image}
                  alt={banner.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {/* Banner contents */}
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 md:px-6 w-full text-left">
                    <div className="max-w-xl md:max-w-2xl space-y-4 md:space-y-6">
                      
                      {/* Premium Accent badge */}
                      <div className="inline-flex items-center gap-2 bg-[#800000] text-[#D4B483] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-[#D4B483]/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Siam Gas & Petrolimex Chính Hãng</span>
                      </div>

                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-sans">
                        {banner.title}
                      </h1>

                      <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-light">
                        {banner.subtitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setSelectedCategory('all');
                            navigateTo('products');
                          }}
                          className="bg-[#800000] hover:bg-[#a31d1d] text-white font-semibold text-sm px-6 py-3.5 rounded-lg flex items-center gap-2 shadow-lg shadow-[#800000]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                        >
                          <span>Xem Toàn Bộ Sản Phẩm</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        
                        <a
                          href="#quote-form-section"
                          className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-lg border border-white/20 transition-all flex items-center justify-center cursor-pointer"
                        >
                          Liên Hệ Hotline Nhận Ưu Đãi
                        </a>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider arrows */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={handlePrevBanner}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-[#800000] rounded-full flex items-center justify-center border border-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleNextBanner}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-[#800000] rounded-full flex items-center justify-center border border-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Slider Dots indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveBannerIdx(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        idx === activeBannerIdx ? 'w-8 bg-[#D4B483]' : 'w-2.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

          </div>
        )}
      </section>

      {/* 2. Top campaign bar (realtime editable CMS representation) */}
      <section className="bg-white py-4 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <div className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">
              Chương trình khuyến mãi hiện hành:
            </div>
          </div>
          <div className="text-xs sm:text-sm text-[#800000] font-semibold text-center md:text-right bg-red-50 px-4 py-1.5 rounded-md border border-red-100/60 flex-1 max-w-xl md:mx-4 truncate">
            {wordings.heroSub}
          </div>
          <a
            href="#quote-form-section"
            className="text-xs font-bold text-[#800000] hover:text-[#a31d1d] flex items-center gap-1 shrink-0 uppercase tracking-widest"
          >
            <span>Nhận khuyến mãi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 3. Section lý do chọn chúng tôi - Trust Grid */}
      <section className="py-20 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="text-[#800000] text-xs font-bold uppercase tracking-widest">{wordings.whyChooseUsTitle}</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B]">
              Lý Do Hơn 10,000+ Khách Hàng Tin Dùng PGS Premium
            </h2>
            <div className="w-16 h-1 bg-[#800000] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-[#800000]/10 flex items-center justify-center text-[#800000]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">100% Khí Gas Sạch</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Nguồn gas nhập trực tiếp, không pha tạp chất hay chất phụ gia, ngọn lửa xanh rực tỏa đều, ngăn đen nồi và tiết kiệm hơn 25% lượng gas tiêu thụ.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-[#800000]/10 flex items-center justify-center text-[#800000]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Giao Gas Hỏa Tốc (15 Phút)</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Đội ngũ kỹ thuật viên thường trực toàn quốc, am hiểu kiểm định phòng cháy nổ, giao và lắp ráp chuẩn Nhật tại nhà chỉ vòng từ 15-20 phút.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-[#800000]/10 flex items-center justify-center text-[#800000]">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Phục Vụ Bảo An 24/7</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Bất kể ngày nghỉ lễ hay đêm tối, tổng đài khẩn cấp luôn phản hồi lập tức để giải cứu sự cố rò rỉ hoặc cấp khí oxy y tế thở cấp bách kịp thời.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-[#800000]/10 flex items-center justify-center text-[#800000]">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Kiểm Tra Gas Định Kỳ Miễn Phí</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Mỗi lần đổi gas, nhân viên luôn dùng thiết bị đo rò rỉ khí và xà phòng kiểm tra lại bếp nấu, van gas, tư vấn thay thế thiết bị đã hao mòn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section sản phẩm nổi bật */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-[#800000] text-xs font-bold uppercase tracking-widest">Sản Phẩm Độc Quyền</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B]">Thiết Bị Nổi Bật Doanh Nghiệp Chọn Lọc</h2>
              <div className="w-12 h-1 bg-[#800000] rounded-full"></div>
            </div>
            
            <button
              onClick={() => {
                setSelectedCategory('all');
                navigateTo('products');
              }}
              className="text-[#800000] hover:text-[#a31d1d] font-bold text-sm flex items-center gap-1 uppercase tracking-widest group"
            >
              <span>Xem toàn bộ gian hàng</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((p) => {
              const hasDiscount = p.originalPrice > p.salePrice;
              return (
                <div 
                  key={p.id}
                  className="bg-white rounded-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-4/3 bg-gray-50 overflow-hidden group">
                    {/* Floating badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      {p.isHot && (
                        <span className="bg-[#800000] text-white font-bold text-[10px] px-2.5 py-1 rounded shadow uppercase tracking-wider">
                          HOT
                        </span>
                      )}
                      {p.isNew && (
                        <span className="bg-[#D4B483] text-gray-900 font-bold text-[10px] px-2.5 py-1 rounded shadow uppercase tracking-wider">
                          NEW
                        </span>
                      )}
                      {p.isSale && (
                        <span className="bg-red-500 text-white font-bold text-[10px] px-2.5 py-1 rounded shadow uppercase tracking-wider animate-pulse">
                          SALE
                        </span>
                      )}
                    </div>
                    
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* In stock floating status */}
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide">
                      {p.inStock ? '🟢 CÒN HÀNG' : '🔴 HẾT HÀNG'}
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Danh mục: {categories.find(c => c.id === p.category)?.name || p.category}
                      </div>
                      <h3 
                        onClick={() => navigateTo('products', p.id)}
                        className="font-bold text-base text-gray-900 hover:text-[#800000] transition-colors line-clamp-2 cursor-pointer"
                      >
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-light">
                        {p.description}
                      </p>
                    </div>

                    {/* Price & specs */}
                    <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        {hasDiscount ? (
                          <div className="space-y-1">
                            <span className="text-xs text-gray-400 line-through block leading-none">
                              {p.originalPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-[#800000] font-black text-base">
                              {p.salePrice.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#2B2B2B] font-black text-base">
                            {p.originalPrice.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => navigateTo('products', p.id)}
                        className="bg-gray-50 hover:bg-[#800000] hover:text-white border border-gray-200 hover:border-transparent text-gray-700 font-bold text-xs px-3.5 py-2 rounded transition-all cursor-pointer"
                      >
                        Xem Chi Tiết
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Section giới thiệu doanh nghiệp - Corporate about */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Visual illustrations */}
            <div className="lg:col-span-5 relative space-y-6">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800"
                  alt="Phòng bếp hiện đại"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#800000]/20 mix-blend-multiply" />
              </div>
              
              <div className="absolute -bottom-8 -right-8 w-1/2 aspect-1/1 bg-white p-2.5 rounded-xl shadow-2xl hidden md:block">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=400"
                    alt="Lắp đặt gas"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Float Experience badge */}
              <div className="absolute top-4 left-4 bg-[#800000] text-[#D4B483] p-5 rounded-lg shadow-xl text-center border border-[#D4B483]/25">
                <div className="text-3xl font-black">15+</div>
                <div className="text-[10px] font-black tracking-wider uppercase">Năm Uy Tín</div>
              </div>
            </div>

            {/* Structured wording */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#800000] text-xs font-black uppercase tracking-widest pl-2.5 border-l-2 border-[#800000]">
                Về Chúng Tôi
              </span>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2B2B2B] leading-tight">
                {wordings.aboutTitle}
              </h2>
              
              <p className="text-base text-gray-700 font-semibold leading-relaxed">
                {wordings.aboutLead}
              </p>
              
              <p className="text-sm text-gray-500 leading-relaxed font-light">
                {wordings.aboutText}
              </p>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-6 pt-5 border-t border-gray-200">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#800000]">10,000+</div>
                  <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Hộ Gia Đình Sử Dụng</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#800000]">15 Phút</div>
                  <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Thời Gian Giao Gas Hỏa Tốc</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#800000]">100%</div>
                  <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-1">Bình Gas Mới Kiểm Định</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. Section chứng nhận / an toàn */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[#800000] text-xs font-bold uppercase tracking-widest">Tiêu chuẩn kiểm định</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{wordings.certificateTitle}</h2>
            <div className="w-16 h-1 bg-[#800000] mx-auto rounded-full"></div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Toàn bộ sản phẩm bình gas và thiết bị oxy tại hệ thống kho PGS đều phải trải qua kiểm nghiệm khắc khe của Trung tâm Kiểm định Công nghiệp I, trang bị lớp vỏ chịu lực cao áp đạt chứng nhận quốc gia.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-[#800000] font-black text-sm">CO</div>
              <h4 className="font-bold text-sm text-gray-900">Chứng nhận CO/CQ</h4>
              <p className="text-[11px] text-gray-500">Bếp gas & Van gas nhập khẩu chính hãng nguyên kiện.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-black text-sm">PCCC</div>
              <h4 className="font-bold text-sm text-gray-900">Tiêu Chuẩn PCCC</h4>
              <p className="text-[11px] text-gray-500">Giấy kiểm định phòng cháy của Bộ Công An cấp phép.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-black text-sm">9001</div>
              <h4 className="font-bold text-sm text-gray-900">Hệ Thống ISO 9001</h4>
              <p className="text-[11px] text-gray-500">Quy trình vận hành lưu thông gas đạt chuẩn ISO quốc tế.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-black text-sm">JIS</div>
              <h4 className="font-bold text-sm text-gray-900">Tiêu chuẩn Nhật Bản</h4>
              <p className="text-[11px] text-gray-500">Van ngắt an toàn tuân thủ chặt chuẩn kỹ nghệ JIS S 2018.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section tin tức / blog mới nhất */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-[#800000] text-xs font-bold uppercase tracking-widest">Tin tức & Hướng dẫn</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B]">Cẩm Nang Sử Dụng Gas An Toàn</h2>
              <div className="w-12 h-1 bg-[#800000] rounded-full"></div>
            </div>
            
            <button
              onClick={() => navigateTo('blogs')}
              className="text-[#800000] hover:text-[#a31d1d] font-bold text-sm flex items-center gap-1 uppercase tracking-widest group"
            >
              <span>Xem toàn bộ cẩm nang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentBlogs.map((b) => (
              <div 
                key={b.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 duration-300 overflow-hidden flex flex-col cursor-pointer"
                onClick={() => navigateTo('blogs', b.slug)}
              >
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <span className="absolute top-3 left-3 bg-[#800000] text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded shadow uppercase z-10">
                    {b.categoryName || 'Tin tức'}
                  </span>
                  
                  <img
                    src={b.image}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold font-mono">
                      <Calendar className="w-3.5 h-3.5 text-gray-300" />
                      <span>{b.date}</span>
                      <span>•</span>
                      <span>By {b.author}</span>
                    </div>
                    
                    <h3 className="font-bold text-sm text-[#2B2B2B] hover:text-[#800000] line-clamp-2 transition-colors">
                      {b.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-light">
                      {b.summary}
                    </p>
                  </div>
                  
                  <div className="text-xs font-bold text-[#800000] flex items-center gap-1 hover:underline">
                    <span>Đọc Cẩm Nang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Map & Quick quote request form - Direct Call Action */}
      <section id="quote-form-section" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-stretch">
            
            {/* Direct Google Map + Office Block */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[#800000] text-xs font-bold uppercase tracking-widest">Hệ thống phân phối</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B]">
                  Liên Hệ Nhận Tư Vấn Trực Tiếp & Khảo Sát Tận Nhà
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed max-w-lg">
                  Nhận yêu cầu báo giá dự án bếp gas công nghiệp, nạp khí oxy y tế khối lượng lớn hoặc liên hệ đổi gas dân dụng siêu tốc. Đội ngũ kỹ sư sẽ gọi điện tư vấn ngay tức khắc.
                </p>
              </div>

              {/* Map Holder */}
              <div className="w-full h-[280px] rounded-xl overflow-hidden border border-gray-200 shadow-md">
                <iframe
                  title="PGS Vietnam Map Location"
                  src={contact.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <MapPin className="w-4.5 h-4.5 text-[#800000]" />
                  <span>TRỤ SỞ CHÍNH TRƯỜNG THUẬN LỢI</span>
                </div>
                <p className="text-xs text-gray-500 pl-6 leading-relaxed">
                  {contact.addressMain}
                </p>
              </div>
            </div>

            {/* Quick Consultation Request Form */}
            <div className="lg:col-span-6 bg-gray-50/50 p-8 rounded-2xl border border-gray-100 space-y-6">
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-[20px] text-gray-900">Gửi Yêu Cầu Tư Vấn Mẫu</h3>
                <p className="text-xs text-gray-500">
                  Vui lòng cung cấp chính xác thông tin, tư vấn viên PGS sẽ hỗ trợ qua Zalo sau 5-15 phút. No checkout - No online payment.
                </p>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                {quoteError && (
                  <div className="bg-red-50 text-red-700 text-xs px-3.5 py-2 rounded-lg border border-red-100 font-semibold">
                    ⚠️ {quoteError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">Họ & Tên khách hàng (*)</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">Số điện thoại / Zalo (*)</label>
                    <input
                      type="tel"
                      placeholder="09xx.xxx.xxx"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">Địa chỉ Email (Nếu có)</label>
                    <input
                      type="email"
                      placeholder="khachhang@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600">Loại thiết bị quan tâm</label>
                    <select
                      value={selectedProductInterest}
                      onChange={(e) => setSelectedProductInterest(e.target.value)}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      <option value="Đổi Gas 12kg / 45kg">Đổi bình gas dân dụng/công nghiệp</option>
                      <option value="Bếp Gas Rinnai / Paloma">Bếp gas đôi / Bếp âm nhập khẩu</option>
                      <option value="Bình Oxy Y Tế 8L / 40L">Bình Oxy y tế & công nghiệp</option>
                      <option value="Linh kiện Van & Dây dẫn">Trọn bộ linh kiện van ngắt khóa an toàn</option>
                      <option value="Dự án lắp đặt công nghiệp">Khảo sát dự án trạm gas nhà hàng</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Nội dung yêu cầu cụ thể</label>
                  <textarea
                    rows={4}
                    placeholder="Ghi rõ yêu cầu đổi ga, giờ giấc giao nhận hoặc địa chỉ nhận tư vấn..."
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#800000] hover:bg-[#a31d1d] text-white text-xs font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#800000]/15"
                >
                  <Send className="w-4 h-4" />
                  <span>XÁC NHẬN GỬI YÊU CẦU</span>
                </button>
              </form>

              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1 font-semibold text-[#800000]">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Giao siêu tốc 15 phút</span>
                </span>
                <span>An mật thông tin khách hàng tuyệt đối</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
