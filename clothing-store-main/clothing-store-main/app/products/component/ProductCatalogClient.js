"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function ProductCatalogClient({
  initialProducts,
  collectionParam,
}) {
  const [sortBy, setSortBy] = useState("Newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const getBannerTitle = () => {
    if (collectionParam === "sandals") return "Sandals & Slides Collection";
    if (collectionParam === "apparel") return "Urban Apparel Collection";
    if (collectionParam === "accessories")
      return "Caps & Accessories Collection";
    return "All Products";
  };

  const sortedProducts = [...initialProducts].sort((a, b) => {
    if (sortBy === "Low to High") return a.price - b.price;
    if (sortBy === "High to Low") return b.price - a.price;
    return 0;
  });

  return (
    <div className="w-full min-h-screen bg-white pb-24">
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          {getBannerTitle()}
        </h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
          [{sortedProducts.length} Results]
        </span>
      </div>

      <div className="max-w-full w-full mx-auto px-4 md:px-10 lg:px-16 h-16 flex items-center justify-between lg:justify-end pt-4">
        <button className="flex items-center gap-2 lg:hidden border border-neutral-200 px-4 py-2 bg-white text-[11px] font-bold tracking-wider text-neutral-900 rounded-xl shadow-2xs uppercase">
          <SlidersHorizontal size={14} /> Filter
        </button>
        <div className="relative z-30">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="border border-neutral-300 bg-white px-4 py-2 flex items-center justify-between gap-6 text-[13px] text-gray-900 font-normal hover:bg-neutral-50 transition-colors cursor-pointer min-w-[150px] text-left select-none rounded-xl shadow-2xs"
          >
            <span>{sortBy}</span>
            <ChevronDown
              size={14}
              className={`text-neutral-600 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isSortOpen && (
            <div className="absolute right-0 mt-1.5 w-full bg-white border border-neutral-200 shadow-md flex flex-col overflow-hidden rounded-xl animate-fadeIn">
              {["Newest", "High to Low", "Low to High", "Best Sellers"].map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                      sortBy === option
                        ? "bg-neutral-50 text-black font-semibold"
                        : "text-neutral-700 hover:bg-neutral-50 bg-white"
                    }`}
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-full w-full mx-auto px-4 md:px-10 lg:px-16 py-6">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full">
            {sortedProducts.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group cursor-pointer flex flex-col relative bg-white pb-4 block transition-all"
              >
                <div className="w-full aspect-[3/4] bg-[#f9f9f9] border border-neutral-100 relative flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-[#f0f0f0] rounded-xl shadow-xs">
                  {product.discount && (
                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-black tracking-widest px-2.5 py-1.5 uppercase z-20 rounded-br-xl rounded-tl-xl">
                      {product.discount}
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest select-none">
                    [{product.id}]
                  </span>
                  <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur-md w-9 h-9 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm z-20 rounded-tl-xl border-t border-l border-neutral-200">
                    <span className="text-xl font-light text-gray-950">+</span>
                  </div>
                </div>
                <div className="mt-4 space-y-1 px-1 text-left">
                  <h3 className="text-[11px] font-bold tracking-widest text-neutral-950 uppercase line-clamp-1 group-hover:text-gray-500 transition-colors leading-normal">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-black text-neutral-950">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-24 text-xs font-bold tracking-widest text-neutral-400 uppercase">
            No products found in this collection.
          </div>
        )}
      </div>
    </div>
  );
}
