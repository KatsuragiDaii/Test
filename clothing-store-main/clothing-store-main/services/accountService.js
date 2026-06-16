import { supabase } from "../lib/supabase";

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token}`,
  };
};

export const accountService = {
  async updateProfile(updates) {
    const headers = await getAuthHeaders();
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers,
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  async addAddress(payload) {
    const headers = await getAuthHeaders();
    const response = await fetch("/api/addresses", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  },

  async updateAddress(id, updates) {
    const headers = await getAuthHeaders();
    const response = await fetch("/api/addresses", {
      method: "PUT",
      headers,
      body: JSON.stringify({ id, ...updates }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  async deleteAddress(id) {
    const headers = await getAuthHeaders();
    const response = await fetch("/api/addresses", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },
};
