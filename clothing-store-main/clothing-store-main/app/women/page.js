// app/women/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link'; 
import { ChevronDown, ChevronUp, SlidersHorizontal, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Mundur 2 tingkat ke folder lib di root proyek

function WomenPageContent() {
  // 1. State Accordion Buka-Tutup Menu Samping
  const [openSections, setOpenSections] = useState({
    productType: true,
    size: true,
  });

  // 2. State Dropdown Sort By Aktif
  const [sortBy, setSortBy] = useState('Newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // 3. State Manajemen Data & Filter
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // FETCH DATA LIVE DARI SUPABASE
  useEffect(() => {
    const fetchWomenProducts = async () => {
      setIsLoading(true);
      try {
        // Ambil produk yang klasifikasi gendernya adalah 'Women' atau 'Unisex'
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('gender', ['Women', 'Unisex']);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Gagal memuat produk wanita:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWomenProducts();
  }, []);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // LOGIKA FILTERING DATA
  const filteredProducts = products.filter((product) => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
    const matchesSize = selectedSizes.length === 0 || 
      (product.sizes && product.sizes.some(s => selectedSizes.includes(s))) ||
      (product.sizes && product.sizes.includes('ONE SIZE'));

    return matchesType && matchesSize;
  });

  // LOGIKA SORTING DATA
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Low to High') return a.price - b.price;
    if (sortBy === 'High to Low') return b.price - a.price;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-[10px] font-bold tracking-widest text-neutral-400 uppercase select-none">
        <Loader2 size={16} className="animate-spin text-neutral-950" />
        <span>Loading Women's Catalog...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      
      {/* TOP GREY BANNER */}
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">All Women's Products</h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">[{filteredProducts.length} Results]</span>
      </div>

      {/* UTILITY SORT BAR */}
      <div className="max-w-full w-full mx-auto px-4 md:px-10 lg:px-16 h-16 flex items-center justify-between lg:justify-end pt-4">
        <button className="flex items-center gap-2 lg:hidden border border-neutral-200 px-4 py-2 bg-white text-[11px] font-bold tracking-wider text-neutral-900 rounded-xl shadow-2xs uppercase">
          <SlidersHorizontal size={13} /> Filter
        </button>

        <div className="relative z-30">
          <button onClick={() => setIsSortOpen(!isSortOpen)} className="border border-neutral-300 bg-white px-4 py-2 flex items-center justify-between gap-6 text-[13px] text-neutral-900 font-normal hover:bg-neutral-50 transition-colors cursor-pointer min-w-[150px] text-left select-none rounded-xl shadow-2xs">
            <span>{sortBy}</span>
            <ChevronDown size={14} className={`text-neutral-600 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isSortOpen && (
            <div className="absolute right-0 mt-1.5 w-full bg-white border border-neutral-200 shadow-md flex flex-col overflow-hidden rounded-xl animate-fadeIn">
              {['Newest', 'High to Low', 'Low to High', 'Best Sellers'].map((option) => (
                <button key={option} onClick={() => { setSortBy(option); setIsSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-150 cursor-pointer ${sortBy === option ? 'bg-neutral-50 text-black font-semibold' : 'text-neutral-700 hover:bg-neutral-50 bg-white'}`}>{option}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-full w-full mx-auto px-4 md:px-10 lg:px-16 py-6 flex flex-col lg:flex-row gap-10 lg:gap-14">
        
        {/* SIDEBAR FILTER */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-8 pt-2">
          <div className="border-b border-neutral-100 pb-6">
            <button onClick={() => toggleSection('productType')} className="w-full flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-neutral-950 mb-4 cursor-pointer select-none">
              Product Type {openSections.productType ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {openSections.productType && (
              <div className="space-y-3 text-[11px] tracking-wider text-neutral-600 font-bold uppercase">
                {['Apparel', 'Accessories', 'Sandals', 'Shoes'].map((item) => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group hover:text-black select-none">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-black rounded-md cursor-pointer border-neutral-300" checked={selectedTypes.includes(item)} onChange={() => handleTypeChange(item)} />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-neutral-100 pb-6">
            <button onClick={() => toggleSection('size')} className="w-full flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-neutral-950 mb-4 cursor-pointer select-none">
              Size {openSections.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {openSections.size && (
              <div className="grid grid-cols-3 gap-2 text-[10px] font-black text-center">
                {['S', 'M', 'L', 'XL'].map((sz) => (
                  <button key={sz} onClick={() => handleSizeToggle(sz)} className={`border py-2 transition-all uppercase cursor-pointer rounded-xl ${selectedSizes.includes(sz) ? 'border-black bg-black text-white shadow-sm' : 'border-neutral-200 text-neutral-900 hover:border-black bg-white shadow-2xs'}`}>{sz}</button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full">
              {sortedProducts.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col relative bg-white pb-4 block transition-all">
                  <div className="w-full aspect-[3/4] bg-[#f9f9f9] border border-neutral-100 relative flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-[#f0f0f0] rounded-xl shadow-xs">
                    {product.discount && (
                      <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-black tracking-widest px-2.5 py-1.5 uppercase z-20 rounded-br-xl rounded-tl-xl">{product.discount}</div>
                    )}
                    <img src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop'} alt={product.name} className="w-full h-full object-cover object-top" />
                  </div>

                  <div className="mt-4 space-y-1 px-1 text-left">
                    <h3 className="text-[11px] font-bold tracking-widest text-neutral-950 uppercase line-clamp-1 group-hover:text-neutral-500 transition-colors leading-normal">{product.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium tracking-wider">
                      <span className={product.original_price ? "text-red-600 font-black font-mono" : "text-neutral-950 font-black font-mono"}>
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </span>
                      {product.original_price && (
                        <span className="text-neutral-400 line-through font-normal font-mono">Rp {Number(product.original_price).toLocaleString('id-ID')}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-xs font-bold tracking-widest text-neutral-400 uppercase">Tidak ada produk wanita yang cocok dengan filter.</div>
          )}
        </main>

      </div>
    </div>
  );
}

export default function WomenPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-white flex items-center justify-center text-xs font-mono tracking-widest text-neutral-400 uppercase select-none">Loading Women Catalog Shell...</div>}><WomenPageContent /></Suspense>
  );
}