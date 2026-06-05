/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Blog } from '../types';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  PhoneCall, 
  MessageSquare,
  ChevronRight,
  HelpCircle,
  Clock,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const BlogsView: React.FC = () => {
  const {
    blogs,
    contact,
    currentViewId,
    navigateTo
  } = useApp();

  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);

  // Inquiry form states at bottom of blog
  const [blogInquiryName, setBlogInquiryName] = useState('');
  const [blogInquiryPhone, setBlogInquiryPhone] = useState('');
  const [blogInquiryMsg, setBlogInquiryMsg] = useState('');
  const [blogInquirySuccess, setBlogInquirySuccess] = useState('');

  // Local Category tabs
  const [selectedMetaCategory, setSelectedMetaCategory] = useState<string>('all');

  // Find blog index if loaded via Slug / ID
  useEffect(() => {
    if (currentViewId) {
      const b = blogs.find(item => item.id === currentViewId || item.slug === currentViewId);
      if (b) {
        setActiveBlog(b);
      }
    } else {
      setActiveBlog(null);
    }
  }, [currentViewId, blogs]);

  const categories = [
    { value: 'all', label: 'Tất cả bài viết' },
    { value: 'an-toan', label: 'Mẹo Sử Dụng Gas An Toàn' },
    { value: 'huong-dan', label: 'Hướng Dẫn Chọn Bếp Gas' },
    { value: 'khuyen-mai', label: 'Tin Khuyến Mãi & Doanh Nghiệp' },
    { value: 'oxy', label: 'Kiến Thức Bình Oxy Y Tế' }
  ];

  const allTags = Array.from(new Set(blogs.flatMap(b => b.tags || []))).slice(0, 10);

  // Filtered blogs
  const filteredBlogs = blogs.filter((b) => {
    if (selectedMetaCategory === 'all') return true;
    return b.category === selectedMetaCategory;
  });

  const handleBackToBlogs = () => {
    navigateTo('blogs');
    setActiveBlog(null);
  };

  // Simple Markdown Content Renderer tool to output beautiful clean JSX
  const renderMarkdownToJSX = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    let listItems: string[] = [];
    const elements: React.JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Table Row matcher simple
      if (trimmed.startsWith('|')) {
        // Render simple placeholder or split row
        if (trimmed.includes('---')) return; // skip table divider
        const cells = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
        
        elements.push(
          <div key={`table-row-${index}`} className="overflow-x-auto w-full border border-gray-100/60 rounded-xl my-4 py-1.5 px-4 bg-gray-50 flex items-center justify-between text-xs sm:text-sm font-medium">
            <span className="text-gray-900">{cells[0]}</span>
            <span className="text-[#800000] text-right">{cells[1]}</span>
          </div>
        );
        return;
      }

      // Image Matcher: ![alt_text](imageUrl)
      if (trimmed.startsWith('![') && trimmed.includes('](') && trimmed.endsWith(')')) {
        flushList(inList, listItems, elements, index);
        inList = false;
        listItems = [];

        const altStart = 2;
        const altEnd = trimmed.indexOf('](');
        const urlStart = altEnd + 2;
        const urlEnd = trimmed.length - 1;

        if (altEnd !== -1) {
          const altText = trimmed.substring(altStart, altEnd);
          const imageUrl = trimmed.substring(urlStart, urlEnd);

          let finalUrl = imageUrl;
          if (activeBlog && activeBlog.images && Array.isArray(activeBlog.images)) {
            const matchedImg = activeBlog.images.find(img => img.startsWith(imageUrl + '|||'));
            if (matchedImg) {
              const parts = matchedImg.split('|||');
              if (parts.length > 1) {
                finalUrl = parts[1];
              }
            }
          }

          elements.push(
            <div key={`blog-image-${index}`} className="my-5 w-full overflow-hidden rounded-xl border border-gray-150 shadow-sm bg-gray-50/50 p-1.5 justify-center flex flex-col">
              <img
                src={finalUrl}
                alt={altText}
                className="w-full h-auto max-h-[480px] object-contain rounded-lg mx-auto"
                referrerPolicy="no-referrer"
              />
              {altText && (
                <p className="text-[11px] text-center text-gray-400 mt-2 italic font-light">{altText}</p>
              )}
            </div>
          );
          return;
        }
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        flushList(inList, listItems, elements, index);
        inList = false;
        listItems = [];
        elements.push(
          <h2 key={index} className="text-lg sm:text-xl font-bold text-[#2B2B2B] mt-8 mb-3.5 border-l-4 border-[#800000] pl-3">
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        flushList(inList, listItems, elements, index);
        inList = false;
        listItems = [];
        elements.push(
          <h3 key={index} className="text-base sm:text-lg font-bold text-[#2B2B2B] mt-6 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        inList = true;
        const itemText = trimmed.substring(2);
        // handle bold highlights
        listItems.push(itemText);
        return;
      }

      // Standard Paragraph
      if (trimmed !== '') {
        flushList(inList, listItems, elements, index);
        inList = false;
        listItems = [];

        // Simple Bold matcher for text
        let cleanText: React.ReactNode = trimmed;
        if (trimmed.includes('**')) {
          const parts = trimmed.split('**');
          cleanText = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-gray-900">{part}</strong> : part);
        }

        elements.push(
          <p key={index} className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 font-light">
            {cleanText}
          </p>
        );
      } else {
        flushList(inList, listItems, elements, index);
        inList = false;
        listItems = [];
      }
    });

    flushList(inList, listItems, elements, 9999);
    return elements;
  };

  const flushList = (inList: boolean, listItems: string[], elements: React.JSX.Element[], index: number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${index}`} className="list-disc pl-5 space-y-2.5 mb-5 text-xs sm:text-sm text-gray-600 font-light">
          {listItems.map((item, i) => {
            let cleanItemText: React.ReactNode = item;
            if (item.includes('**')) {
              const parts = item.split('**');
              cleanItemText = parts.map((part, pidx) => pidx % 2 === 1 ? <strong key={pidx} className="font-extrabold text-[#2B2B2B]">{part}</strong> : part);
            }
            return <li key={i}>{cleanItemText}</li>;
          })}
        </ul>
      );
    }
  };

  // Submit bottom blog inquiry
  const handleBlogInquirySubmit = (e: React.FormEvent, articleTitle: string) => {
    e.preventDefault();
    if (!blogInquiryName || !blogInquiryPhone) {
      alert('Vui lòng nhập số điện thoại để tư vấn viên liên hệ hỗ trợ!');
      return;
    }

    setBlogInquirySuccess('Yêu cầu nhận cẩm nang an toàn đã được gửi tới PGS! Chúng tôi sẽ gọi hỗ trợ ngay.');
    setBlogInquiryName('');
    setBlogInquiryPhone('');
    setBlogInquiryMsg('');

    setTimeout(() => {
      setBlogInquirySuccess('');
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      
      {/* Dynamic Blog Article Reading view */}
      {activeBlog ? (
        <div className="animate-in fade-in slide-in-from-right-6 duration-300 space-y-8">
          
          {/* SEO breadcrumb header */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToBlogs}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#800000] uppercase tracking-wider group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Quay lại trang tin tức</span>
            </button>
            <span className="text-gray-300 text-xs">/</span>
            <span className="text-gray-400 text-xs truncate max-w-[200px] sm:max-w-xs">{activeBlog.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Main Article content */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              
              {/* Category tag & metadata */}
              <div className="flex items-center gap-3">
                <span className="bg-[#800000]/10 text-[#800000] text-xs font-bold px-3 py-1 rounded">
                  {activeBlog.categoryName}
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeBlog.date}</span>
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-300" />
                  <span>Tác giả: {activeBlog.author}</span>
                </span>
              </div>

              {/* Title display */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#2B2B2B] leading-tight tracking-tight">
                {activeBlog.title}
              </h1>

              {/* Large intro wrapper */}
              <blockquote className="border-l-4 border-[#D4B483] pl-4 py-1 italic text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-r-lg leading-relaxed">
                {activeBlog.summary}
              </blockquote>

              {/* Large banner photo */}
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={activeProductImageFinder(activeBlog)}
                  alt={activeBlog.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rendered content */}
              <article className="markdown-body pt-4">
                {renderMarkdownToJSX(activeBlog.content)}
              </article>

              {/* Interactive YouTube player if present */}
              {activeBlog.youtubeId && (
                <div className="space-y-3 pt-6">
                  <h4 className="font-bold text-sm text-[#2b2b2b] flex items-center gap-2 border-b border-gray-100 pb-2">
                    <span>📺 VIDEO HƯỚNG DẪN TRỰC QUAN</span>
                  </h4>
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${activeBlog.youtubeId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* FAQ Accordion Section */}
              {activeBlog.faqs && activeBlog.faqs.length > 0 && (
                <div className="space-y-4 pt-8 border-t border-gray-100">
                  <h4 className="font-bold text-base text-[#2B2B2B] flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#800000]" />
                    <span>Hỏi & Đáp Thường Gặp (FAQs)</span>
                  </h4>
                  
                  <div className="space-y-3.5">
                    {activeBlog.faqs.map((faq, fIdx) => (
                      <div key={fIdx} className="bg-gray-50 p-4.5 rounded-xl border border-gray-100/80 space-y-2">
                        <h5 className="font-bold text-xs sm:text-sm text-gray-900 flex items-start gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#800000] shrink-0 mt-1.5"></span>
                          <span>{faq.question}</span>
                        </h5>
                        <p className="text-xs text-gray-500 pl-4.5 font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom dynamic CTA form */}
              <div className="bg-red-50 p-6 sm:p-8 rounded-2xl border border-red-100/50 space-y-6">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#800000] text-lg">Bạn Cần Tư Vấn Thiết Bị Gas An Toàn?</h4>
                  <p className="text-xs text-red-700 leading-relaxed font-light">
                    Để lại số điện thoại để nhận bộ cẩm nang xử lý rò rỉ khí gas kèm phiếu kiểm định an toàn bếp gas miễn phí ngay tại nhà hôm nay.
                  </p>
                </div>

                <form onSubmit={(e) => handleBlogInquirySubmit(e, activeBlog.title)} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Họ và tên..."
                    required
                    value={blogInquiryName}
                    onChange={(e) => setBlogInquiryName(e.target.value)}
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại / Zalo..."
                    required
                    value={blogInquiryPhone}
                    onChange={(e) => setBlogInquiryPhone(e.target.value)}
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#800000]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#800000] hover:bg-[#a31d1d] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  >
                    Đăng Ký Khảo Sát
                  </button>
                </form>

                {blogInquirySuccess && (
                  <p className="text-xs text-green-700 font-bold bg-green-50 p-3 rounded border border-green-100">
                    {blogInquirySuccess}
                  </p>
                )}
              </div>

            </div>

            {/* Right sidebar tags + hotlines info */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
              
              {/* Hotlines helper card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#800000]/10 flex items-center justify-center text-[#800000] mx-auto pulsing-hotline">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold tracking-wider">HỖ TRỢ ĐỔI GAS HỎA TỐC</p>
                  <a href={`tel:${contact.hotline}`} className="text-lg text-[#800000] font-black hover:underline">
                    {contact.hotline}
                  </a>
                  <p className="text-xs text-gray-500 font-light">Thường trực toàn quốc 24 giờ kể cả ngày lễ lộc.</p>
                </div>
                
                <div className="pt-2 border-t border-gray-50 flex gap-2">
                  <a
                    href={contact.zaloLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-50 hover:bg-[#0068e6] hover:text-white text-gray-700 text-xs font-bold py-2 rounded-lg border border-gray-200 text-center"
                  >
                    Chat Zalo
                  </a>
                  <a
                    href={contact.fbMessengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-50 hover:bg-[#0084ff] hover:text-white text-gray-700 text-xs font-bold py-2 rounded-lg border border-gray-200 text-center"
                  >
                    Messenger
                  </a>
                </div>
              </div>

              {/* Category catalog quick switch */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-extrabold text-[#2B2B2B] text-xs uppercase tracking-widest pl-2 border-l-2 border-[#800000]">
                  DANH MỤC TIN TỨC
                </h4>
                
                <div className="flex flex-col gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => {
                        setSelectedMetaCategory(c.value);
                        navigateTo('blogs');
                      }}
                      className="w-full text-left font-semibold text-xs py-2 text-gray-600 hover:text-[#800000] hover:translate-x-1.5 transition-all flex items-center justify-between"
                    >
                      <span>{c.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag clouds */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-extrabold text-[#2B2B2B] text-xs uppercase tracking-widest pl-2 border-l-2 border-[#800000]">
                  THẺ TÌM KIẾM HOT
                </h4>
                
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-[10px] bg-gray-50 text-gray-500 hover:bg-[#800000]/10 hover:text-[#800000] px-2.5 py-1 rounded-md border border-gray-200/60 select-none cursor-pointer"
                    >
                      # {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Blog List layout */
        <div className="space-y-10 animate-in fade-in duration-300">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#800000] text-xs font-bold uppercase tracking-widest">Cẩm nang cống hiến</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B]">
              Tin Tức, Khuyến Mãi & Hướng Dẫn Sử Dụng
            </h1>
            <p className="text-xs text-gray-500 font-light max-w-lg mx-auto leading-relaxed">
              Cập nhật các chương trình trợ giá bình gas, cẩm nang xử lý an toàn phòng chống cháy nổ và quy trình tháo lắp oxy y khoa đạt chỉ số y tế cao.
            </p>
          </div>

          {/* Tab Categories Filters */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center border-b border-gray-200 pb-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedMetaCategory(cat.value)}
                className={`text-xs px-4 py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                  selectedMetaCategory === cat.value
                    ? 'bg-[#800000] text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Blogs list catalog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((b) => (
              <div 
                key={b.id}
                className="bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                onClick={() => navigateTo('blogs', b.slug)}
              >
                {/* Thumb icon */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <span className="absolute top-3 left-3 bg-[#800000] text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded shadow uppercase z-10">
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
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold font-mono">
                      <span>{b.date}</span>
                      <span>•</span>
                      <span>By {b.author}</span>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-gray-900 line-clamp-2 hover:text-[#800000] transition-colors leading-snug">
                      {b.title}
                    </h3>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-light">
                      {b.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(b.tags || []).slice(0, 2).map((tag, tagIdx) => (
                      <span key={tagIdx} className="text-[9px] bg-gray-50 text-gray-500 font-medium px-2 py-0.5 rounded border border-gray-200/50">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-[#800000] flex items-center gap-1 hover:underline pt-2 border-t border-gray-50/75">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Xem cẩm nang an toàn</span>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Empty response blogs */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-16 max-w-md mx-auto space-y-4">
              <span className="text-3xl">📝</span>
              <h3 className="font-bold text-gray-800 text-lg">Chưa có bài viết ở chuyên mục này</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Chuyên mục tin tức này đang được phòng biên tập PGS thẩm định nội dung để cung cấp quy trình kỹ thuật chuẩn xác nhất tới quý độc giả.
              </p>
              <button
                onClick={() => setSelectedMetaCategory('all')}
                className="bg--zinc-900 bg-zinc-900 text-white hover:bg-[#800000] text-xs font-bold px-4 py-2 rounded"
              >
                Quay lại tất cả bài viết
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

const activeProductImageFinder = (blog: Blog) => {
  return blog.image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800';
};
