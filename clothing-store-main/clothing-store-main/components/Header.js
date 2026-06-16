"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../store/useCartStore";

export default function Header() {
  const pathname = usePathname();
  const [accountRoute, setAccountRoute] = useState("/login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Berlangganan langsung ke Zustand Store
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsMounted(true);
    setIsMobileMenuOpen(false);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAccountRoute(session ? "/account" : "/login");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountRoute(session ? "/account" : "/login");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  const getMenuClass = (path) => {
    return pathname === path
      ? "text-[10px] lg:text-[11px] font-black tracking-[0.2em] text-gray-950 uppercase transition-colors"
      : "text-[10px] lg:text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-black transition-colors";
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="w-full px-6 lg:px-12 h-20 flex items-center justify-between relative">
        {/* SISI KIRI: HAMBURGER BUTTON */}
        <div className="flex items-center lg:hidden z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-950 hover:opacity-60 transition-opacity p-1 cursor-pointer outline-none"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-[20px] h-[20px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-[20px] h-[20px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* LOGO UTAMA Z SERIF ITALIC ASLI */}
        <div className="z-50 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
          <Link
            href="/"
            className="text-3xl font-serif italic font-black tracking-wide text-gray-950 select-none hover:opacity-80 transition-opacity"
          >
            Z
          </Link>
        </div>

        {/* SISI TENGAH: NAVIGASI UTAMA LAYAR LEBAR */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <nav className="flex items-center gap-8">
            <Link href="/men" className={getMenuClass("/men")}>
              Men
            </Link>
            <Link href="/women" className={getMenuClass("/women")}>
              Women
            </Link>
            <Link href="/collections" className={getMenuClass("/collections")}>
              Collections
            </Link>
            <Link href="/sale" className={getMenuClass("/sale")}>
              Sale
            </Link>
          </nav>
        </div>

        {/* SISI KANAN: IKON UTILITAS */}
        <div className="flex items-center gap-4 sm:gap-6 text-gray-950 z-50">
          <Link
            href={accountRoute}
            className="hover:opacity-40 transition-opacity p-1"
            title="Akun"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-[19px] h-[19px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>
          <Link
            href="/cart"
            className="hover:opacity-40 transition-opacity p-1 relative"
            title="Keranjang"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-[19px] h-[19px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {isMounted && cartCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full animate-fadeIn"></span>
            )}
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="w-full bg-white border-b border-gray-100 lg:hidden animate-slideDown absolute top-20 left-0 z-40 shadow-sm">
          <nav className="flex flex-col py-6 px-8 gap-5 text-left">
            <Link href="/men" className={getMenuClass("/men")}>
              Men
            </Link>
            <Link href="/women" className={getMenuClass("/women")}>
              Women
            </Link>
            <Link href="/collections" className={getMenuClass("/collections")}>
              Collections
            </Link>
            <Link href="/sale" className={getMenuClass("/sale")}>
              Sale
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
