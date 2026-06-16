"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, MapPin, ShoppingBag, LogOut, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useCartStore } from "../../store/useCartStore";

import ProfileTab from "./components/ProfileTab";
import AddressesTab from "./components/AddressesTab";
import OrdersTab from "./components/OrdersTab";
import AccountSidebarItem from "./components/AccountSidebarItem";

function AccountDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearCart = useCartStore((state) => state.clearCart);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push("/login?next=/account");
          return;
        }
        setUser(currentUser);

        if (searchParams.get("tab") === "orders") {
          setActiveTab("orders");
        }
      } catch (err) {
        console.error("Session error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, [router, searchParams]);

  const handleSignOut = async () => {
    if (confirm("APAKAH ANDA YAKIN INGIN KELUAR DARI AKUN KREASIMU?")) {
      await supabase.auth.signOut();

      clearCart();

      window.location.href = "/login";
    }
  };

  if (isLoading || !user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">
        <Loader2 size={16} className="animate-spin text-neutral-950" />
        <span>Memuat Sesi...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pb-32 text-left font-sans antialiased text-neutral-900">
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          Account Dashboard
        </h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
          [ Welcome Back, {user?.email?.split("@")[0] || "Customer"} ]
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <aside className="md:col-span-4 lg:col-span-3 space-y-2 select-none">
          <div className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase px-3 mb-4">
            Account Navigation
          </div>

          <AccountSidebarItem
            icon={<User size={14} />}
            label="Biodata Diri"
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <AccountSidebarItem
            icon={<MapPin size={14} />}
            label="Daftar Alamat"
            isActive={activeTab === "addresses"}
            onClick={() => setActiveTab("addresses")}
          />
          <AccountSidebarItem
            icon={<ShoppingBag size={14} />}
            label="Daftar Transaksi"
            isActive={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />

          <div className="pt-4 border-t border-neutral-100 mt-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold tracking-wider uppercase text-red-600 hover:bg-red-50/50 transition-all rounded-xl cursor-pointer"
            >
              <LogOut size={14} />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </aside>

        <main className="md:col-span-8 lg:col-span-9 bg-white border border-neutral-200 p-6 md:p-8 rounded-xl shadow-2xs min-h-[420px] animate-fadeIn">
          {activeTab === "profile" && <ProfileTab user={user} />}
          {activeTab === "addresses" && <AddressesTab user={user} />}
          {activeTab === "orders" && <OrdersTab user={user} />}
        </main>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center text-xs font-mono tracking-widest text-neutral-400 uppercase">
          Loading secure shell...
        </div>
      }
    >
      <AccountDashboardContent />
    </Suspense>
  );
}
