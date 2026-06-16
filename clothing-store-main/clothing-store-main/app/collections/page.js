// app/collections/page.js
'use client';

import Link from 'next/link';

export default function CollectionsPage() {
  // Data Koleksi Utama Zahwa Clothing (Tetap Konstan Sesuai Aslinya)
  const collections = [
    {
      id: 1,
      title: "Sandals & Slides",
      link: "/products?collection=sandals", 
      bgClass: "bg-[#b3b3b3]", 
      assetLabel: "📷 [ZAHWA SANDALS COLLECTION]"
    },
    {
      id: 2,
      title: "Urban Apparel",
      link: "/products?collection=apparel", 
      bgClass: "bg-[#b3b3b3]", 
      assetLabel: "📷 [ZAHWA CLOTHING & APPAREL]"
    },
    {
      id: 3,
      title: "Caps & Accessories",
      link: "/products?collection=accessories", 
      bgClass: "bg-neutral-700", 
      assetLabel: "📷 [ZAHWA ACCESSORIES DROPS]"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-white pb-32">
      
      {/* =========================================================
          1. TOP GREY BANNER HEADER: KEMBAR SINKRON DENGAN PAGES LAINNYA
          ========================================================= */}
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          All Collections
        </h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
          [{collections.length} Categories]
        </span>
      </div>

      {/* =========================================================
          2. MAIN AREA: 3-COLUMN EDITORIAL GRID (FULL EXTENDED)
          ========================================================= */}
      {/* FIX DISPLAY: Kontainer dilebarkan penuh (max-w-full) & padding adaptif mengikuti panggung layar utama */}
      <div className="max-w-full w-full mx-auto px-4 md:px-10 lg:px-16 pt-12">
        {/* FIX GAP: Jarak grid antar-koleksi diperlebar agar terlihat bernapas dan premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((col) => (
            <Link 
              href={col.link} 
              key={col.id} 
              className="group flex flex-col relative cursor-pointer overflow-hidden rounded-xl"
            >
              {/* Bingkai Foto Skala Besar (Rasio 3:4) - FIX STYLE: Ditambahkan rounded-xl & border halus */}
              <div className={`w-full aspect-[3/4] ${col.bgClass} border border-neutral-100 relative flex items-center justify-center transition-all duration-500 overflow-hidden rounded-xl shadow-xs`}>
                
                {/* Efek Hover Gelap Halus */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/25 transition-all duration-300 z-10" />
                
                {/* Text Label Placeholder */}
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest z-20 select-none">
                  {col.assetLabel}
                </span>

                {/* Judul Koleksi yang Muncul Saat Di-hover - FIX STYLE: Memotong lengkung di area dalam gradasi bottom */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col items-center justify-end rounded-b-xl">
                  <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase text-center">
                    {col.title}
                  </h3>
                  <span className="text-[9px] text-white/70 font-medium tracking-widest uppercase mt-2 underline underline-offset-4 decoration-white/50">
                    View Products ➔
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}