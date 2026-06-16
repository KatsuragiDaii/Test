import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { supabase } from "../lib/supabase";
export const revalidate = 60;

export default async function Home() {
  const { data: featuredProducts, error } = await supabase
    .from("products")
    .select("*")
    .limit(4);

  if (error) {
    console.error("Gagal memuat katalog di sisi server:", error);
  }

  const campaigns = [
    {
      id: 1,
      title: "Headwear & Caps",
      label: "Accessories",
      link: "/products?collection=accessories",
      bgPlaceholder: "bg-[#e5e5e5]",
    },
    {
      id: 2,
      title: "Urban Shorts & Pants",
      label: "Men's Apparel",
      link: "/men",
      bgPlaceholder: "bg-[#d4d4d4]",
    },
    {
      id: 3,
      title: "New Arrivals Lookbook",
      label: "Fresh Drops",
      link: "/products",
      bgPlaceholder: "bg-[#222222]",
    },
  ];

  const formatRupiah = (num) => "Rp " + Number(num).toLocaleString("id-ID");

  return (
    <div className="w-full bg-white">
      {/* SECTION 1: HERO VIDEO BANNER */}
      <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden border-b border-gray-200">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/video-utama.mp4"
          className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-1000 hover:scale-105"
        >
          <source src="/video-utama.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40 lg:bg-black/20 z-5 transition-colors duration-500" />

        <div className="absolute inset-0 max-w-full w-full mx-auto px-6 md:px-24 lg:px-40 flex items-center z-10">
          <div className="max-w-xl space-y-6 text-left p-6 lg:p-0">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] uppercase">
              Zahwa <br /> Clothing
            </h1>
            <p className="text-sm md:text-base font-bold tracking-[0.3em] text-gray-200 uppercase border-l-2 border-white pl-4">
              A New Mix of Classics.
            </p>
            <p className="text-gray-200 text-xs md:text-sm font-medium tracking-wide leading-relaxed max-w-md uppercase">
              Upgrade penampilan harianmu dengan koleksi streetwear apparel
              terbaru yang dirancang untuk kenyamanan mutakhir.
            </p>
            <div className="pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-white text-black font-black tracking-[0.2em] text-[10px] px-10 py-5 uppercase border border-white hover:bg-transparent hover:text-white transition-all duration-300 rounded-xl group shadow-sm"
              >
                <span>Shop Now</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 lg:left-16 flex gap-3 z-20">
          <span className="w-10 h-0.5 bg-white transition-all duration-300"></span>
          <span className="w-6 h-0.5 bg-white/40 hover:bg-white/70 cursor-pointer transition-all duration-300"></span>
          <span className="w-6 h-0.5 bg-white/40 hover:bg-white/70 cursor-pointer transition-all duration-300"></span>
        </div>
      </div>

      {/* SECTION 2: FEATURED PRODUCTS GRID */}
      <section className="max-w-full w-full mx-auto px-4 md:px-10 lg:px-16 pt-24 pb-16">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <h2 className="text-lg md:text-xl font-black tracking-widest text-gray-900 uppercase">
            Featured Collection
          </h2>
          <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase hidden sm:block">
            [001 - Essentials]
          </span>
        </div>

        {!featuredProducts || featuredProducts.length === 0 ? (
          <div className="text-center py-20 text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Belum ada daftar katalog produk tersimpan di database.
          </div>
        ) : (
          <div className="relative w-full overflow-hidden bg-transparent">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 bg-transparent">
              {featuredProducts.map((product) => (
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
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover object-top"
                    />

                    <div className="absolute bottom-0 right-0 bg-black text-white w-10 h-10 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 rounded-tl-xl">
                      <Plus size={16} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="mt-4 text-left px-1 space-y-1">
                    <h3 className="text-[11px] font-bold tracking-widest text-gray-950 uppercase line-clamp-1 group-hover:text-gray-500 transition-colors leading-normal">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span
                        className={
                          product.original_price
                            ? "text-red-600 font-black font-mono"
                            : "text-gray-950 font-black font-mono"
                        }
                      >
                        {formatRupiah(product.price)}
                      </span>
                      {product.original_price && (
                        <span className="text-neutral-400 line-through font-normal font-mono">
                          {formatRupiah(product.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex justify-center mt-16 mb-8">
          <Link
            href="/products"
            className="group flex items-center gap-3 bg-black text-white font-black tracking-[0.2em] text-[10px] px-16 py-5 uppercase border border-black hover:bg-neutral-800 transition-all rounded-xl shadow-md"
          >
            <span>View All Products</span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
            />
          </Link>
        </div>
      </section>

      {/* SECTION 3: CAMPAIGN LIFESTYLE GRID */}
      <section className="w-full max-w-full mx-auto px-4 md:px-10 lg:px-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {campaigns.map((camp) => (
            <Link
              href={camp.link}
              key={camp.id}
              className="group flex flex-col cursor-pointer"
            >
              <div
                className={`w-full aspect-[3/4] md:aspect-square ${camp.bgPlaceholder} relative overflow-hidden flex items-center justify-center transition-all duration-700 rounded-xl shadow-xs group-hover:shadow-md`}
              >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/40 transition-colors duration-500" />

                <h2 className="text-white text-sm md:text-base font-black tracking-[0.25em] text-center px-6 z-10 select-none uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {camp.title}
                </h2>

                <div className="absolute top-5 left-5 text-[9px] font-mono text-black/30 group-hover:text-white/50 uppercase tracking-widest transition-colors duration-500">
                  {`[ KAMPANYE ${camp.id} ]`}
                </div>
              </div>

              <div className="mt-4 text-left flex justify-between items-center px-1">
                <span className="text-[11px] font-black tracking-widest text-gray-900 uppercase group-hover:text-gray-500 transition-colors">
                  {camp.label}
                </span>
                <ArrowRight
                  size={14}
                  className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
