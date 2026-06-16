import { supabase } from "../../lib/supabase";
import ProductCatalogClient from "./component/ProductCatalogClient";

export const revalidate = 60;

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const collectionParam = resolvedSearchParams.collection || "all";
  const titleMap = {
    sandals: "Sandals & Slides",
    apparel: "Urban Apparel",
    accessories: "Caps & Accessories",
    all: "All Products",
  };

  return {
    title: `${titleMap[collectionParam]} | Zahwa Clothing`,
    description: `Temukan koleksi ${titleMap[collectionParam]} terbaru di Zahwa Clothing. Belanja sekarang.`,
  };
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const collectionParam = resolvedSearchParams.collection || "all";

  let query = supabase.from("products").select("*");

  if (collectionParam !== "all") {
    query = query.eq("collection", collectionParam);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error(
      "Gagal menjemput data katalog dinamis di sisi server:",
      error,
    );
  }

  return (
    <ProductCatalogClient
      initialProducts={products || []}
      collectionParam={collectionParam}
    />
  );
}
