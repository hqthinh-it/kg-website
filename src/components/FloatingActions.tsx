/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, X, Sparkles, Send } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { contact, popup, addQuoteRequest } = useApp();

  // Popup overlay display controller
  const [showPopup, setShowPopup] = useState(false);

  // Popup inline registration form
  const [popName, setPopName] = useState('');
  const [popPhone, setPopPhone] = useState('');
  const [popRegistered, setPopRegistered] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds if active in CMS configuration
    if (popup && popup.isActive) {
      const hasDismissed = sessionStorage.getItem('pgs_popup_dismissed__');
      if (!hasDismissed) {
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [popup]);

  const handleDismissPopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('pgs_popup_dismissed__', 'true');
  };

  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popName || !popPhone) return;

    addQuoteRequest({
      name: popName,
      phone: popPhone,
      email: 'N/A',
      productName: `ƯU ĐÃI LỚN POPUP: ${popup.title}`,
      message: 'Khách hàng đăng ký gói kiểm tra hệ thống gas an toàn 250k miễn phí.'
    });

    setPopRegistered(true);
    setTimeout(() => {
      handleDismissPopup();
    }, 4000);
  };

  return (
    <>
      {/* 1. Floating Desktop widgets (Zalo + Messenger) */}
      <div className="fixed bottom-24 sm:bottom-8 right-6 z-40 flex flex-col gap-3.5 select-none font-sans">
        
        {/* Floating Facebook Messenger circle */}
        <a
          href={contact.fbMessengerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 bg-[#0084ff] rounded-full flex items-center justify-center text-white shadow-xl hover:-translate-y-1 transition-transform pulsing-fb cursor-pointer relative group"
        >
          {/* Label prompt */}
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Nhắn tin Messenger
          </span>
          <svg className="w-6.5 h-6.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.145 2 11.238c0 2.9 1.436 5.483 3.678 7.152.193.143.308.374.312.622l.024 1.956a.6.6 0 00.865.518l2.253-1.226c.148-.08.324-.096.48-.04 1.1.39 2.27.601 3.488.601 5.523 0 10-4.145 10-9.238S17.523 2 12 2zm1.18 12.036l-2.074-2.215-4.04 2.22c-.44.24-.96-.23-.74-.68l4.318-9.043c.21-.44.82-.44 1.03 0l2.064 2.205 4.042-2.22c.448-.246.963.227.74.68l-4.32 9.043c-.22.46-.83.46-1.04 0z" />
          </svg>
        </a>

        {/* Floating Zalo Circle */}
        <a
          href={contact.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 bg-[#0068e6] rounded-full flex items-center justify-center text-white shadow-xl hover:-translate-y-1 transition-transform pulsing-zalo cursor-pointer relative group"
        >
          <span className="absolute right-full mr-3 bg-[#0068e6] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Liên hệ Zalo 24/7
          </span>
          
          {/* Zalo Premium custom styled Icon */}
          <span className="font-black text-xs sm:text-sm tracking-tighter">ZALO</span>
        </a>

      </div>

      {/* 2. Mobile Bottom sticky hotline strip */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#800000] text-white px-5 py-3 flex items-center justify-between shadow-2xl border-t border-[#D4B483]/20 font-sans">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 bg-white/10 rounded-full flex items-center justify-center text-white pulsing-hotline">
            <Phone className="w-4 h-4 text-[#D4B483]" />
          </div>
          <div>
            <p className="text-[9px] text-gray-300 font-semibold tracking-wider uppercase leading-none">HOTLINE GIAO GAS</p>
            <a href={`tel:${contact.hotline}`} className="text-sm font-black text-white hover:underline block pt-1.5 leading-none">
              {contact.hotline}
            </a>
          </div>
        </div>

        <a
          href={contact.zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0068e6] hover:bg-opacity-90 text-white text-[11px] font-extrabold px-3.5 py-2.5 rounded-lg flex items-center gap-1 shadow-md"
        >
          <span>LIÊN HỆ ZALO</span>
        </a>
      </div>

      {/* 3. Popup promo modal (triggered conditionally based on CMS config) */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100/90 flex flex-col sm:flex-row items-stretch animate-in zoom-in-95 duration-200">
            
            {/* Absolute close button */}
            <button
              onClick={handleDismissPopup}
              className="absolute top-3.5 right-3.5 z-50 w-8 h-8 bg-black/55 hover:bg-[#800000] rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Left side: Artwork/image */}
            {popup.image && (
              <div className="w-full sm:w-2/5 relative min-h-[140px] bg-red-900 shrink-0">
                <img
                  src={popup.image}
                  alt={popup.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* Right side: content & fast signup */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                
                {/* Accent mini badge */}
                <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest text-[#800000] uppercase bg-[#800000]/10 px-2 py-0.5 rounded">
                  <Sparkles className="w-3 h-3 text-[#800000]" />
                  <span>ƯU ĐÃI ĐĂNG KÝ HÔM NAY</span>
                </span>

                <h3 className="font-extrabold text-[#2B2B2B] text-base leading-snug">
                  {popup.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed font-light">
                  {popup.subtitle}
                </p>
              </div>

              {/* Fast Inline form */}
              {popRegistered ? (
                <div className="bg-green-50 text-green-700 text-xs px-3.5 py-2.5 rounded-lg border border-green-100 font-semibold leading-relaxed text-center">
                  🎉 Gửi thành công! Chúng tôi sẽ liên hệ lại kiểm tra hệ thống gas an toàn sớm nhất!
                </div>
              ) : (
                <form onSubmit={handlePopupSubmit} className="space-y-2.5 bg-gray-50 p-3 rounded-xl border border-gray-150">
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Họ Tên..."
                      value={popName}
                      onChange={(e) => setPopName(e.target.value)}
                      className="bg-white text-xs px-2.5 py-1.5 rounded border border-gray-200 focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Số Zalo..."
                      value={popPhone}
                      onChange={(e) => setPopPhone(e.target.value)}
                      className="bg-white text-xs px-2.5 py-1.5 rounded border border-gray-200 focus:outline-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#800000] hover:bg-[#a31d1d] text-white text-[11px] font-bold py-2 rounded flex items-center justify-center gap-1.5 shadow cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Đăng Ký Khảo Sát Gas Miễn Phí</span>
                  </button>
                </form>
              )}

              <div className="text-[10px] text-gray-400 font-light text-center">
                * Không cần chia sẻ bất kì giao dịch ngân hàng nào.
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
};
