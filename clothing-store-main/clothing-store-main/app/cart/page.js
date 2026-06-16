"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Loader2, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useCartStore } from "../../store/useCartStore";

export default function CartPage() {
  const router = useRouter();

  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [liveProducts, setLiveProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchLivePrices = async () => {
      if (cartItems.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const productIds = cartItems.map((item) => item.productId);
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, images, color")
          .in("id", productIds);

        if (error) throw error;
        setLiveProducts(data || []);
      } catch (err) {
        console.error("Gagal memuat harga asli dari server:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted) fetchLivePrices();
  }, [cartItems, isMounted]);

  const formatRupiah = (num) => "Rp " + num.toLocaleString("id-ID");

  // Menggabungkan data kuantitas Zustand dengan data harga Live Database
  const displayCartItems = cartItems.map((item) => {
    const liveData = liveProducts.find((p) => p.id === item.productId);
    return {
      ...item,
      name: liveData?.name || "Loading...",
      price: liveData ? liveData.price : 0,
      imageLabel: liveData?.color || "PRODUCT",
    };
  });

  const subtotal = displayCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (!isMounted || isLoading) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
        <Loader2 size={16} className="animate-spin text-neutral-900" />
        <span>Syncing Live Prices...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pb-32 text-left font-sans antialiased text-neutral-900">
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          Your Cart
        </h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
          [ {cartItems.length} ITEMS ]
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        {cartItems.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-5 text-neutral-400 border border-neutral-100">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900 mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mb-8 uppercase font-bold tracking-wider">
              Tidak ada produk yang mengantre. Silakan kembali meluncur ke
              katalog untuk memilih produk favoritmu.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="px-8 py-3.5 bg-black text-white text-[10px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all cursor-pointer rounded-xl shadow-md"
            >
              Shop Our Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start animate-fadeIn">
            {/* DAFTAR PRODUK KIRI */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-end border-b border-neutral-100 pb-2">
                <button
                  onClick={() => clearCart()}
                  className="text-[9px] font-black tracking-widest uppercase text-neutral-400 hover:text-red-600 transition-colors cursor-pointer outline-none"
                >
                  Hapus Semua
                </button>
              </div>

              {displayCartItems.map((item) => {
                const uniqueKey = `${item.productId}-${item.size}`;
                return (
                  <div
                    key={uniqueKey}
                    className="flex items-start justify-between gap-6 pb-6 border-b border-neutral-100 relative"
                  >
                    <div className="flex gap-4 md:gap-6">
                      <div className="w-24 h-28 bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-[9px] text-neutral-400 uppercase tracking-tighter shrink-0 rounded-xl select-none text-center px-2">
                        [{item.imageLabel}]
                      </div>

                      <div className="space-y-1 pt-1">
                        <h3 className="text-xs font-black uppercase tracking-wide text-neutral-950">
                          {item.name}
                        </h3>
                        <p className="text-[10px] font-bold text-neutral-400">
                          SIZE: {item.size}
                        </p>
                        <p className="text-xs font-black text-neutral-950 pt-1">
                          {formatRupiah(item.price)}
                        </p>

                        <div className="flex items-center border border-neutral-200 w-fit bg-white mt-4 rounded-xl overflow-hidden shadow-2xs">
                          {item.quantity === 1 ? (
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(item.productId, item.size)
                              }
                              className="p-2 hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Hapus item dari keranjang"
                            >
                              <Trash2 size={11} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.productId, item.size, -1)
                              }
                              className="p-2 hover:bg-neutral-50 text-neutral-500 transition-colors cursor-pointer"
                            >
                              <Minus size={11} />
                            </button>
                          )}
                          <span className="px-3 text-xs font-bold text-neutral-900 select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.size, 1)
                            }
                            className="p-2 hover:bg-neutral-50 text-neutral-500 transition-colors cursor-pointer"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-neutral-400 hover:text-red-600 transition-colors pt-1 cursor-pointer outline-none p-1"
                      title="Hapus Produk"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* RINGKASAN BIAYA KANAN */}
            <div className="lg:col-span-5 bg-[#FDFDFD] border border-neutral-200 p-6 lg:p-8 rounded-xl shadow-2xs">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-950 mb-6 border-b border-neutral-200 pb-3">
                Order Summary
              </h3>

              <div className="space-y-4 text-xs font-bold text-neutral-500 border-b border-neutral-200 pb-5 mb-5">
                <div className="flex justify-between">
                  <span className="uppercase text-[11px] font-medium text-neutral-500">
                    Subtotal
                  </span>
                  <span className="text-neutral-900 font-bold">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase text-[11px] font-medium text-neutral-500">
                    Shipping
                  </span>
                  <span className="text-emerald-600 text-[10px] font-black tracking-widest">
                    FREE
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-[11px] font-black uppercase tracking-widest text-neutral-950">
                  Total Cost
                </span>
                <span className="text-xl font-black text-neutral-950 tracking-tight">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-4 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 active:bg-neutral-950 transition-all text-center flex items-center justify-center gap-2 cursor-pointer rounded-xl"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
