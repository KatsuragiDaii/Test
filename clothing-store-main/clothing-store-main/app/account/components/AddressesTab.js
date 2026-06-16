"use client";

import { useState, useEffect } from "react";
import { Plus, X, Trash2, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { accountService } from "../../../services/accountService";
import { addressSchema } from "../../../lib/validations";

export default function AddressesTab({ user }) {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressMode, setAddressMode] = useState("add");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState(null);

  const [addrRecipient, setAddrRecipient] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrDetail, setAddrDetail] = useState("");
  const [addrError, setAddrError] = useState("");
  const [isDetailAddrEmpty, setIsDetailAddrEmpty] = useState(false);

  useEffect(() => {
    const fetchAddressesAndProfile = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone_number")
          .eq("id", user.id)
          .single();
        if (profile) {
          setProfileName(profile.full_name || "");
          setProfilePhone(profile.phone_number || "");
        }

        const { data: addressData } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (addressData) setAddresses(addressData);
      } catch (err) {
        console.error("Gagal memuat alamat:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddressesAndProfile();
  }, [user.id]);

  const handleOpenAddAddress = () => {
    setAddressMode("add");
    setSelectedAddressId(null);
    setAddrRecipient(profileName);
    setAddrPhone(profilePhone);
    setAddrDetail("");
    setAddrError("");
    setIsDetailAddrEmpty(false);
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setAddressMode("edit");
    setSelectedAddressId(addr.id);
    setAddrRecipient(addr.recipient);
    setAddrPhone(addr.phone);
    setAddrDetail(addr.detail);
    setAddrError("");
    setIsDetailAddrEmpty(false);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddrError("");
    setIsDetailAddrEmpty(false);

    const payload = {
      recipient: addrRecipient.trim(),
      phone: addrPhone.trim(),
      detail: addrDetail.trim(),
    };

    const result = addressSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      if (fieldErrors.detail) setIsDetailAddrEmpty(true);
      setAddrError(result.error.issues[0].message);
      return;
    }

    setIsSaving(true);

    try {
      if (addressMode === "add") {
        const newAddress = await accountService.addAddress(payload);
        setAddresses([newAddress, ...addresses]);
      } else {
        await accountService.updateAddress(selectedAddressId, payload);
        const updatedAddresses = addresses.map((item) => {
          if (item.id === selectedAddressId) {
            return { ...item, ...payload };
          }
          return item;
        });
        setAddresses(updatedAddresses);
      }
      setShowAddressModal(false);
    } catch (err) {
      setAddrError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerDeleteAddress = (id) => {
    setAddressIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteAddress = async () => {
    if (addressIdToDelete) {
      setIsDeleting(true);
      try {
        await accountService.deleteAddress(addressIdToDelete);
        setAddresses(addresses.filter((addr) => addr.id !== addressIdToDelete));
        setShowDeleteModal(false);
        setAddressIdToDelete(null);
      } catch (err) {
        alert("Gagal menghapus alamat: " + err.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading)
    return (
      <div className="py-20 text-center text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
        <Loader2 size={16} className="animate-spin inline-block mr-2" /> Memuat
        Daftar Alamat...
      </div>
    );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-neutral-100 pb-4 select-none">
        <div className="space-y-0.5">
          <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-950">
            | Alamat Pengiriman
          </h3>
          <p className="text-[9px] font-mono text-neutral-400 tracking-wider">
            {addresses.length} / 5 Maksimal
          </p>
        </div>

        {addresses.length < 5 && (
          <button
            onClick={handleOpenAddAddress}
            className="text-[10px] font-black tracking-widest bg-black text-white px-4 py-2.5 rounded-xl uppercase cursor-pointer hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={12} /> Tambah Baru
          </button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 text-xs font-bold text-neutral-400 tracking-wider uppercase select-none">
          Belum ada daftar alamat tersimpan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="border border-neutral-200 p-6 rounded-xl bg-white hover:border-neutral-400 transition-all duration-200 relative flex flex-col gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] animate-fadeIn"
            >
              <div className="flex justify-between items-center w-full border-b border-neutral-50 pb-2 select-none">
                <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">
                  {addr.recipient}
                </h4>
                <div className="flex items-center gap-4 text-[10px] font-black tracking-widest uppercase">
                  <button
                    onClick={() => handleOpenEditAddress(addr)}
                    className="text-neutral-400 hover:text-black transition-colors cursor-pointer py-0.5"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => triggerDeleteAddress(addr.id)}
                    className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                    title="Hapus Alamat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-left">
                <p className="text-[11px] font-bold text-neutral-500 font-mono tracking-wide">
                  {addr.phone}
                </p>
                <p className="text-xs text-neutral-600 uppercase leading-relaxed font-semibold tracking-wide pt-0.5">
                  {addr.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TAMBAH/UBAH ALAMAT */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md p-8 rounded-xl border border-neutral-200 space-y-5 relative text-left shadow-lg">
            <button
              onClick={() => setShowAddressModal(false)}
              disabled={isSaving}
              className="absolute right-6 top-6 text-neutral-400 hover:text-black cursor-pointer outline-none disabled:opacity-50"
            >
              <X size={18} />
            </button>
            <div className="space-y-1 select-none">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-900">
                {addressMode === "add" ? "Tambah Alamat" : "Ubah Alamat"}
              </h3>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Lengkapi data tujuan distribusi kiriman paket
              </p>
            </div>
            {addrError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase rounded-xl">
                {addrError}
              </div>
            )}
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-baseline select-none">
                  <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block pl-0.5">
                    Nama Penerima
                  </label>
                  {addressMode === "add" && (
                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-sm">
                      Autofilled
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={30}
                  value={addrRecipient}
                  onChange={(e) => setAddrRecipient(e.target.value)}
                  placeholder="Nama Lengkap Penerima"
                  className="w-full border border-neutral-300 px-4 py-3 text-xs font-semibold tracking-wide outline-none rounded-xl focus:border-black bg-white disabled:opacity-70 disabled:bg-neutral-50"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-baseline select-none">
                  <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block pl-0.5">
                    Nomor Handphone
                  </label>
                  {addressMode === "add" && (
                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-sm">
                      Autofilled
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={14}
                  value={addrPhone}
                  onChange={(e) =>
                    setAddrPhone(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Contoh: 0812345678"
                  className="w-full border border-neutral-300 px-4 py-3 text-xs font-mono font-bold tracking-wide outline-none rounded-xl focus:border-black bg-white disabled:opacity-70 disabled:bg-neutral-50"
                  disabled={isSaving}
                  required
                />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block pl-0.5 select-none">
                  Detail Alamat Lengkap
                </label>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={addrDetail}
                  onChange={(e) => {
                    setAddrDetail(e.target.value);
                    if (e.target.value.trim()) setIsDetailAddrEmpty(false);
                  }}
                  placeholder="Contoh: Jln. Mawar No. 12, RT 01/RW 02, Kec. Cileunyi"
                  className={`w-full border px-4 py-3 text-xs font-semibold tracking-wide outline-none rounded-xl bg-white resize-none leading-relaxed transition-colors disabled:opacity-70 disabled:bg-neutral-50 ${
                    isDetailAddrEmpty
                      ? "border-red-500 focus:border-red-500 bg-red-50/5"
                      : "border-neutral-300 focus:border-black"
                  }`}
                  disabled={isSaving}
                />
                <div className="flex justify-between items-baseline mt-1 select-none px-0.5">
                  <div>
                    {isDetailAddrEmpty && (
                      <span className="text-red-600 text-[9px] font-black tracking-widest uppercase block animate-fadeIn">
                        Wajib lebih spesifik (Min. 25 Karakter)
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold tracking-wider ${
                      addrDetail.length > 0 && addrDetail.length < 25
                        ? "text-red-500"
                        : "text-neutral-400"
                    }`}
                  >
                    {addrDetail.length} / 160
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3.5 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center gap-2 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Alamat"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl border border-neutral-200 text-center space-y-6 relative shadow-lg">
            <div className="space-y-2 select-none">
              <h3 className="text-xs font-black tracking-[0.15em] uppercase text-neutral-900">
                HAPUS ALAMAT
              </h3>
              <p className="text-[11px] text-neutral-400 uppercase font-bold tracking-normal leading-relaxed">
                Apakah Anda yakin ingin menghapus alamat pengiriman ini?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAddressIdToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1 py-3 border border-neutral-300 bg-white text-neutral-900 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer rounded-xl shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteAddress}
                disabled={isDeleting}
                className="flex-1 py-3 bg-black text-white text-[11px] font-black tracking-[0.15em] uppercase hover:bg-neutral-800 active:bg-neutral-950 transition-all cursor-pointer rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> MENGHAPUS...
                  </>
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
