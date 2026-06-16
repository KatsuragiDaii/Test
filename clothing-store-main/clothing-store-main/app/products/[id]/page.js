import { supabase } from "../../../lib/supabase";
import ProductDetailClient from "./components/ProductDetailClient";
import Link from "next/link";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", resolvedParams.id)
    .single();

  if (!product) return { title: "Product Not Found | Zahwa Clothing" };

  return {
    title: `${product.name} | Zahwa Clothing`,
    description:
      product.description ||
      `Beli ${product.name} original di Zahwa Clothing dengan garansi kualitas terbaik.`,
  };
}

export default async function ProductDetailPage({ params }) {
  // FIX: Unpack params sebagai Promise (Next.js 15)
  const resolvedParams = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center text-center p-6 uppercase select-none">
        <h2 className="text-xs font-black tracking-widest text-neutral-900 mb-2">
          Product Not Found
        </h2>
        <Link
          href="/products"
          className="text-[10px] font-black tracking-widest underline underline-offset-4 text-neutral-400 hover:text-black transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
