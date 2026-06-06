/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Search, Menu, X, ShieldCheck, HelpCircle, MapPin, Settings2 } from 'lucide-react';
import logo from "@/assets/images/logo.png";

export const Header: React.FC = () => {
  const {
    currentView,
    navigateTo,
    contact,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    categories: appCategories
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setSelectedCategory('all');
    navigateTo('products');
  };

  const categories = appCategories.map(cat => ({
    label: cat.name,
    id: cat.id
  }));

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100"
      style={{ position: 'sticky', top: 0 }}
    >
      {/* Top microbar */}
      <div className="bg-[#800000] text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs tracking-wide opacity-90 truncate">
            <span className="font-semibold bg-white/15 px-1.5 py-0.5 rounded text-[#D4B483]">GAS PREMIUM</span>
            <span>MST: {contact.mst}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4B483]" />
              <span>Cam kết lửa xanh - Van tự động khóa</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main branding & navigation bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo brand block */}
          <div
            id="brand_logo_container"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight leading-tight text-gray-900 flex items-center gap-1.5">
                GAS <span className="text-[#800000]">KIỆT GẠO</span>
              </div>
              <p className="text-[10px] font-medium text-gray-500 tracking-wider uppercase">Năng lượng Việt Cao cấp</p>
            </div>
          </div>

          {/* Search bar inside header desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-md w-full relative">
            <input
              type="text"
              placeholder="Tìm bếp gas, bình oxy, bình gas, phụ kiện..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-gray-50 text-sm pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-all"
            />
            <Search className="absolute left-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
            <button type="submit" className="hidden" />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-[15px] text-gray-700">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#800000] py-1 border-b-2 transition-all cursor-pointer ${currentView === 'home' ? 'border-[#800000] text-[#800000] font-semibold' : 'border-transparent'
                }`}
            >
              Trang Chủ
            </button>
            <div className="relative group/nav py-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  navigateTo('products');
                }}
                className={`hover:text-[#800000] flex items-center gap-1 transition-colors cursor-pointer ${currentView === 'products' ? 'text-[#800000] font-semibold' : ''
                  }`}
              >
                Sản Phẩm
              </button>
              {/* Dropdown catalog */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    navigateTo('products');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#800000] transition-colors"
                >
                  Tất cả sản phẩm
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      navigateTo('products');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#800000] transition-colors"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigateTo('blogs')}
              className={`hover:text-[#800000] py-1 border-b-2 transition-all cursor-pointer ${currentView === 'blogs' ? 'border-[#800000] text-[#800000] font-semibold' : 'border-transparent'
                }`}
            >
              Cẩm Nang & Tin Tức
            </button>

            <a
              href="#quote-form-section"
              onClick={(e) => {
                if (currentView !== 'home') {
                  e.preventDefault();
                  navigateTo('home');
                  setTimeout(() => {
                    const el = document.getElementById('quote-form-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="text-gray-600 hover:text-[#800000] transition-colors"
            >
              Liên Hệ Báo Giá
            </a>
          </nav>

          {/* Desktop Direct Contact Panel */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-gray-400 tracking-wider">ĐỔI GAS NHANH CHÓNG</p>
              <a href={`tel:${contact.hotline}`} className="text-[#800000] font-black text-lg tracking-tight hover:underline">
                {contact.hotline}
              </a>
            </div>
            <a
              href={`tel:${contact.hotline}`}
              className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transitional shadow-md shadow-[#800000]/20 pulsing-hotline cursor-pointer"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile controllers (hamburger & query) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-700 hover:text-[#800000] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile search bar block */}
      <div className="md:hidden bg-gray-50 px-4 py-2 border-t border-gray-100">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Tìm gas, bếp, điều áp..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-[#800000]"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-3.5 h-3.5" />
        </form>
      </div>

      {/* Mobile menu sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500 uppercase pb-2 border-b border-gray-100">
              <span>Tiêu Biểu Gas Chất Lượng Cao Cấp</span>
              <span className="text-right text-[#800000]">Hotline: {contact.hotline}</span>
            </div>
            <div className="flex flex-col gap-3 font-medium text-base text-gray-800">
              <button
                onClick={() => {
                  navigateTo('home');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-1 hover:text-[#800000] ${currentView === 'home' ? 'text-[#800000] font-bold' : ''
                  }`}
              >
                Trang Chủ
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  navigateTo('products');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-1 hover:text-[#800000] ${currentView === 'products' ? 'text-[#800000] font-bold' : ''
                  }`}
              >
                Danh Mục Sản Phẩm
              </button>

              <div className="pl-3 flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      navigateTo('products');
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs bg-gray-50 hover:bg-[#800000]/10 hover:text-[#800000] px-2.5 py-1 rounded-md border border-gray-200 transition-colors"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  navigateTo('blogs');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-1 hover:text-[#800000] ${currentView === 'blogs' ? 'text-[#800000] font-bold' : ''
                  }`}
              >
                Cẩm Nang & Tin Tức
              </button>

              <a
                href="#quote-form-section"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (currentView !== 'home') {
                    e.preventDefault();
                    navigateTo('home');
                    setTimeout(() => {
                      const el = document.getElementById('quote-form-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="text-left py-1 text-gray-800 hover:text-[#800000]"
              >
                Yêu Cầu Báo Giá
              </a>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold">Giao Gas Nhanh Chóng</p>
                <a href={`tel:${contact.hotline}`} className="text-base text-[#800000] font-black tracking-tight block">
                  {contact.hotline}
                </a>
              </div>
              <a
                href={contact.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0068e6] text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 shadow"
              >
                Nhắn Zalo Tư Vấn
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
