import { supabase } from "../../lib/supabase";
import MenCatalogClient from "./components/MenCatalogClient";

export const revalidate = 60;

export const metadata = {
  title: "Men's Collection | Zahwa Clothing",
  description:
    "Eksplorasi koleksi apparel pria terbaik dari Zahwa Clothing. Streetwear yang dirancang untuk kenyamanan mutakhir.",
};

export default async function MenPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .in("gender", ["Men", "Unisex"]);

  if (error) {
    console.error("Gagal memuat katalog pria di sisi server:", error);
  }

  return <MenCatalogClient initialProducts={products || []} />;
}
