import { supabase } from "../lib/supabase";

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const headers = {
    "Content-Type": "application/json",
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  return headers;
};

export const checkoutService = {
  async getUserAddresses(userId) {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTransactionToken(payload) {
    const headers = await getAuthHeaders();

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error || "Gagal memproses pembuatan token transaksi.",
      );
    }

    return data;
  },
};
