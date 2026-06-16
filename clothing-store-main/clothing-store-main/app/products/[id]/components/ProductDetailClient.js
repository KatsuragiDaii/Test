"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
} from "lucide-react";
import { useCartStore } from "../../../../store/useCartStore";

export default function ProductDetailClient({ product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState("details");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isAdding, setIsAdding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);
    setIsAdding(true);

    try {
      // Langsung tembak ke Zustand, tidak peduli guest/logged in
      addItem({
        productId: product.id,
        size: selectedSize,
        quantity: quantity,
      });

      setIsAdding(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 flex items-center gap-3 text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase select-none">
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight size={10} />
        <Link href="/products" className="hover:text-black transition-colors">
          Products
        </Link>
        <ChevronRight size={10} />
        <span className="text-neutral-950 font-bold tracking-widest">
          {product.name}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="w-full aspect-[3/4] bg-[#f9f9f9] overflow-hidden border border-neutral-100 relative group select-none rounded-xl shadow-xs">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[currentImageIndex]
                  : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop"
              }
              alt={`${product.name}`}
              className="w-full h-full object-cover object-top"
            />
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) =>
                        (prev - 1 + product.images.length) %
                        product.images.length,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 border border-neutral-100 w-11 h-11 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % product.images.length,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 border border-neutral-100 w-11 h-11 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 text-[9px] font-mono tracking-widest uppercase rounded-md shadow-2xs">
              {currentImageIndex + 1} /{" "}
              {product.images ? product.images.length : 1}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-8 sticky top-32 h-fit">
          <div className="space-y-4 text-left border-b border-neutral-100 pb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral-950 uppercase leading-none">
              {product.name}
            </h1>
            <p className="text-xl font-bold tracking-wider text-neutral-950">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
              SKU: {product.sku || "-"} Color: {product.color || "-"}
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex justify-between items-baseline select-none">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase">
                Select Size
              </h3>
              <button className="text-[9px] text-neutral-400 font-bold uppercase underline underline-offset-4 tracking-widest hover:text-black transition-colors cursor-pointer">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {(product.sizes && product.sizes.length > 0
                ? product.sizes
                : ["S", "M", "L", "XL"]
              ).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`w-14 h-14 flex items-center justify-center text-[11px] font-black tracking-widest border transition-all duration-200 cursor-pointer rounded-xl ${selectedSize === size ? "bg-black border-black text-white" : "bg-white border-neutral-200 text-neutral-400 hover:border-black hover:text-black"}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="text-[10px] text-red-600 font-black tracking-widest uppercase animate-fadeIn pl-0.5">
                Please select your size before adding to cart.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-neutral-200 h-14 bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 h-full flex items-center justify-center text-neutral-400 hover:text-black cursor-pointer"
                >
                  <Minus size={12} />
                </button>
                <span className="w-10 text-center text-xs font-bold text-neutral-950 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 h-full flex items-center justify-center text-neutral-400 hover:text-black cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 h-14 flex items-center justify-center gap-3 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300 border rounded-xl shadow-sm ${isSuccess ? "bg-neutral-50 border-neutral-300 text-neutral-900" : "bg-black border-black text-white hover:bg-neutral-900 cursor-pointer"}`}
              >
                {isAdding ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : isSuccess ? (
                  <span className="flex items-center gap-2 tracking-[0.25em]">
                    <Check size={13} strokeWidth={3} />
                    <span>ADDED</span>
                  </span>
                ) : (
                  <>
                    <ShoppingBag size={13} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-6 space-y-0 border-t border-neutral-100">
            <div className="border-b border-neutral-100">
              <button
                onClick={() =>
                  setActiveAccordion(
                    activeAccordion === "details" ? "" : "details",
                  )
                }
                className="w-full py-4 flex justify-between items-center text-[10px] font-black tracking-[0.2em] uppercase text-neutral-950 hover:text-gray-500 transition-colors select-none"
              >
                <span>Product Details</span>
                {activeAccordion === "details" ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${activeAccordion === "details" ? "max-h-40 pb-5" : "max-h-0"}`}
              >
                <p className="text-[11px] text-neutral-500 tracking-wider leading-loose uppercase text-left">
                  Bahan: {product.material || "Organic Heavy Cotton"}
                  <br />
                  Fit: Modern Oversized Fit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
