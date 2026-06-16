// app/order-confirmed/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

export default function OrderConfirmedPage() {
  const [orderId, setOrderId] = useState("");

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    setOrderId(`#ZHWA-${randomDigits}`);

    clearCart();
  }, [clearCart]);

  return (
    <div className="w-full min-h-[90vh] bg-white flex flex-col items-center justify-center px-6 animate-fadeIn">
      {/* Container Utama */}
      <div className="max-w-xl w-full text-center space-y-10 flex flex-col items-center">
        {/* Ikon Sukses Lingkaran Centang Tipis Modern */}
        <div className="text-emerald-500 transform transition-transform duration-700 hover:scale-110">
          <CheckCircle size={80} strokeWidth={1} />
        </div>

        {/* Teks Header Editorial Luxury Style */}
        <div className="space-y-4">
          <h3 className="text-[10px] md:text-[11px] font-bold tracking-[0.4em] text-gray-400 uppercase">
            Payment Successful
          </h3>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.15em] text-gray-950 uppercase leading-tight">
            Thank You For Your Order
          </h1>

          {/* Label Order ID */}
          <div className="pt-2">
            <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase bg-[#f9f9f9] px-5 py-2.5 border border-gray-100 inline-block">
              ORDER ID: {orderId}
            </span>
          </div>
        </div>

        {/* Deskripsi Konfirmasi */}
        <p className="max-w-md text-xs text-gray-500 tracking-widest leading-loose font-medium uppercase">
          Konfirmasi pesanan bersama rincian resi pelacakan kurir otomatis akan
          segera kami kirimkan ke email Anda. Terima kasih telah berbelanja di
          <span className="text-gray-950 font-bold ml-1">Zahwa Clothing.</span>
        </p>

        {/* Garis Pembatas Halus */}
        <div className="w-16 h-px bg-gray-200"></div>

        {/* Navigasi Pilihan Lanjut Belanja */}
        <div className="w-full max-w-xs space-y-4 pt-4">
          {/* Tombol Utama: Continue Shopping */}
          <Link
            href="/men"
            className="w-full bg-black text-white text-[10px] font-black tracking-[0.25em] uppercase py-5 border border-black hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span>Continue Shopping</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>

          {/* Tombol Sekunder: Back to Home */}
          <Link
            href="/"
            className="w-full bg-white text-gray-950 text-[10px] font-black tracking-[0.25em] uppercase py-5 border border-gray-100 hover:border-black transition-all duration-300 flex items-center justify-center gap-3"
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Footer Hak Cipta */}
      <div className="mt-20 text-[9px] text-gray-300 tracking-[0.2em] uppercase font-medium">
        &copy; 2026 Zahwa Clothing Retail Operations.
      </div>
    </div>
  );
}
