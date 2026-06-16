// app/account/components/OrdersTab.js
"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function OrdersTab({ user }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Detail States
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .neq("status", "PENDING")
          .order("created_at", { ascending: false });

        if (orderData) {
          const formattedOrders = orderData.map((item) => ({
            id: item.id,
            date: new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            total: "Rp " + item.total_price.toLocaleString("id-ID"),
            status: item.status,
            items: item.items,
          }));
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error("Gagal memuat riwayat pesanan:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user.id]);

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-100";
    }
  };

  const handleOpenOrderDetails = (order) => {
    setSelectedOrderId(order.id);
    setSelectedOrderItems(order.items || []);
    setShowOrderDetailsModal(true);
  };

  if (isLoading)
    return (
      <div className="py-20 text-center text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
        <Loader2 size={16} className="animate-spin inline-block mr-2" /> Memuat
        Data Transaksi...
      </div>
    );

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-950 border-b border-neutral-100 pb-4 select-none">
        | Riwayat Pembelian
      </h3>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-xs font-bold text-neutral-400 tracking-wider uppercase select-none animate-fadeIn">
          Belum ada riwayat transaksi pembelian.
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs bg-white animate-fadeIn">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black tracking-widest uppercase select-none">
                <th className="p-4">ID Pesanan</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Total Biaya</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[11px] font-bold tracking-wide uppercase text-neutral-600 font-mono">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="p-4 font-black text-neutral-900">
                    {order.id}
                  </td>
                  <td className="p-4 text-neutral-500 font-sans font-semibold">
                    {order.date}
                  </td>
                  <td className="p-4 text-neutral-950 font-sans font-bold">
                    {order.total}
                  </td>
                  <td className="p-4 text-center font-sans">
                    <span
                      className={`text-[9px] font-black tracking-widest px-2.5 py-1 border rounded-md ${getStatusStyles(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center font-sans select-none">
                    <button
                      onClick={() => handleOpenOrderDetails(order)}
                      className="text-[10px] font-black tracking-widest border border-neutral-300 px-3 py-1.5 rounded-xl text-neutral-800 bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-3xs"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* M O D A L : Rincian Pesanan */}
      {showOrderDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md p-8 rounded-xl border border-neutral-200 space-y-6 relative text-left shadow-lg">
            <button
              onClick={() => setShowOrderDetailsModal(false)}
              className="absolute right-6 top-6 text-neutral-400 hover:text-black transition-colors cursor-pointer outline-none"
            >
              <X size={18} />
            </button>

            <div className="space-y-1 select-none border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-900">
                RINCIAN PESANAN
              </h3>
              <p className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase font-bold">
                {selectedOrderId}
              </p>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {selectedOrderItems.length === 0 ? (
                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider text-center py-4">
                  Tidak ada rincian data produk.
                </p>
              ) : (
                selectedOrderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center gap-4 pb-3 border-b border-neutral-50 last:border-b-0"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wide leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                        Size: {item.size} — Jumlah: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-black text-neutral-950 font-mono">
                      {"Rp " +
                        ((item.price || 489300) * item.quantity).toLocaleString(
                          "id-ID",
                        )}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowOrderDetailsModal(false)}
              className="w-full py-3.5 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all cursor-pointer rounded-xl shadow-sm"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
