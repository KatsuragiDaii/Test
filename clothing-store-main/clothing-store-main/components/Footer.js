// components/Footer.js
'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-[#f5f5f5] text-gray-800 pt-16 pb-12 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
        
        {/* Kolom 1: Information */}
        <div className="space-y-4 text-left">
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-900 underline underline-offset-4 decoration-gray-400">
            INFORMATION
          </h4>
          <div className="text-xs text-gray-600 space-y-2 font-light leading-relaxed">
            <p className="font-semibold text-gray-900">Senin–Jumat: 08.00 – 18.00 WIB</p>
            <p>Sabtu, Minggu & Hari Libur Nasional: <span className="font-semibold text-red-600">Libur / Offline</span></p>
          </div>
        </div>

        {/* Kolom 2: Shipping & Returns */}
        <div className="space-y-4 md:text-right">
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-900 underline underline-offset-4 decoration-gray-400">
            SHIPPING & RETURNS
          </h4>
          <ul className="text-xs text-gray-600 space-y-3 font-light">
            <li><a href="#" className="hover:text-black transition-colors">Shipping</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Return Policy</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar Pembatas Bawah */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 font-light">
        <p>© 2026 Zahwa Clothing. All Rights Reserved.</p>
        <p className="tracking-widest uppercase text-[9px] font-bold text-gray-500 mt-2 sm:mt-0">Built for Quality</p>
      </div>
    </footer>
  );
}