/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Award, CheckCircle, ShieldAlert, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, contact } = useApp();

  return (
    <footer className="bg-[#1f1f1f] text-gray-300 pt-16 pb-8 border-t-4 border-[#800000]">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Company brief */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#800000] rounded-lg flex items-center justify-center text-white font-black text-lg select-none">
              P
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white">
                GAS <span className="text-[#D4B483]">KIỆT GẠO</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Thương hiệu năng lượng an toàn</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Cửa hàng chuyên phân phối khí hóa lỏng (Petrolimex Gas, Mỹ Trà Gas, Total Gas, SP Gas, Petimex Gas), bình khí nén cao áp Oxy và các linh kiện bếp an toàn tuyệt đối từ Nhật Bản.
          </p>
          <div className="space-y-1 pt-1">
            <div className="text-[11px] text-gray-500 font-medium">ĐẠI DIỆN PHÁP LUẬT:</div>
            <p className="text-xs text-gray-300 font-semibold">{contact.representative}</p>
            <div className="text-[11px] text-gray-500 font-medium mt-1">SỐ ĐĂNG KÝ KINH DOANH:</div>
            <p className="text-xs text-gray-300 font-mono text-[11px]">{contact.mst}</p>
          </div>
        </div>

        {/* Dynamic products catalogs */}
        <div>
          <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-5 border-l-2 border-[#D4B483] pl-2.5">
            DANH MỤC THIẾT BỊ
          </h3>
          <ul className="space-y-3 text-xs">
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white hover:underline hover:translate-x-1 transition-all text-left"
              >
                Bình Gas Dân Dụng (12kg)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white hover:underline hover:translate-x-1 transition-all text-left"
              >
                Bình Gas Công Nghiệp (45kg)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white hover:underline hover:translate-x-1 transition-all text-left"
              >
                Bếp Gas Đôi Namilux & Sakura
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white hover:underline hover:translate-x-1 transition-all text-left"
              >
                Bình Oxy Y Tế Chăm Sóc Sức Khỏe
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white hover:underline hover:translate-x-1 transition-all text-left"
              >
                Linh kiện Van Gas ngắt tự động Nhật Bản
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('products')}
                className="hover:text-white hover:underline hover:translate-x-1 transition-all text-left"
              >
                Dây dẫn ga 3 lớp chống chuột bọ
              </button>
            </li>
          </ul>
        </div>

        {/* Corporate contact details */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-sm tracking-widest uppercase border-l-2 border-[#D4B483] pl-2.5">
            LIÊN HỆ KHẨN CẤP
          </h3>
          <div className="space-y-3.5 text-xs text-gray-300">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#D4B483] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold">HOTLINE ĐỔI GAS (24/7)</p>
                <a href={`tel:${contact.hotline}`} className="text-sm text-[#D4B483] font-bold hover:underline">
                  {contact.hotline}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold">KỸ THUẬT & DỰ ÁN OXY</p>
                <a href={`tel:${contact.phoneTechnical}`} className="hover:text-white">
                  {contact.phoneTechnical}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold font-mono">EMAIL LIÊN HỆ CHÍNH THỨC</p>
                <a href={`mailto:${contact.email}`} className="hover:text-white break-all">
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Badges Certification */}
        <div className="space-y-5">
          <h3 className="text-white font-bold text-sm tracking-widest uppercase border-l-2 border-[#D4B483] pl-2.5">
            CHỨNG NHẬN & AN TOÀN
          </h3>
          <div className="grid grid-cols-2 gap-3.5">
            {/* Shield Badge */}
            <div className="flex items-center gap-2 bg-[#2d2d2d] p-2.5 rounded-lg border border-gray-800">
              <Award className="w-6 h-6 text-green-400 shrink-0" />
              <div className="text-[10px] text-gray-300 leading-tight">
                <span className="font-bold block text-white">ISO 9001</span>
                An toàn tuyệt đối.
              </div>
            </div>

            {/* PCCC Badge */}
            <div className="flex items-center gap-2 bg-[#2d2d2d] p-2.5 rounded-lg border border-gray-800">
              <CheckCircle className="w-6 h-6 text-[#D4B483] shrink-0" />
              <div className="text-[10px] text-gray-300 leading-tight">
                <span className="font-bold block text-white">PCCC Đạt Chuẩn</span>
                Kiểm định 100%.
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-wider mb-2">Đăng Ký Bộ Công Thương</div>
            <div className="flex items-center gap-3">
              {/* Fake Bo Cong Thuong Blue Seal Icon */}
              {/* <div className="px-3 py-1.5 bg-[#174A84] rounded text-white text-[10px] font-black tracking-widest flex items-center gap-1 border border-blue-400 select-none">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
                ĐÃ ĐĂNG KÝ
              </div> */}
              <div className="text-[9px] text-gray-500 leading-tight">
                Mã số thuế đăng ký thương mại điện tử: 087070022803
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Office branches details */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-4 border-t border-gray-800 text-xs text-gray-400 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 space-y-2">
          <div className="flex items-start gap-1.5 text-gray-300">
            <MapPin className="w-4 h-4 text-[#800000] shrink-0 mt-0.5" />
            <p className="font-semibold text-xs">ĐỊA CHỈ: <span className="text-white">{contact.addressMain}</span></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-5 text-[11px] text-gray-400">
            {contact.addressBranch.map((branch, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-gray-900/40 p-1.5 rounded">
                <span className="w-1.5 h-1.5 bg-[#D4B483] rounded-full shrink-0"></span>
                <span>{branch}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Copyright segment */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 mt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>© 2026 GASKIETGAO.COM. Bảo lưu mọi quyền thương hiệu. Trải nghiệm người dùng được tối ưu bởi Tooltez.vn</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cam kết an toàn chất đốt đạt tiêu chuẩn bảo an tối ưu</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
