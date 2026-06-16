"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Lock, Plus, X, Check, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { accountService } from "../../../services/accountService";
import { profileSchema, updatePasswordSchema } from "../../../lib/validations";

export default function ProfileTab({ user }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const [tempName, setTempName] = useState("");
  const [tempGender, setTempGender] = useState("");
  const [tempPhone, setTempPhone] = useState("");

  const [showNameModal, setShowNameModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, gender, phone_number")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setName(profileData.full_name || "Belum diisi");
          setGender(profileData.gender || "Belum diisi");
          setPhone(profileData.phone_number || "");
        } else {
          setName(user.email.split("@")[0]);
          setGender("Belum diisi");
          setPhone("");
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user.id, user.email]);

  const handleStartEditName = () => {
    setTempName(name === "Belum diisi" ? "" : name);
    setNameError("");
    setShowNameModal(true);
  };
  const handleStartEditGender = () => {
    setTempGender(gender === "Belum diisi" ? "Laki-laki" : gender);
    setShowGenderModal(true);
  };
  const handleStartEditPhone = () => {
    setTempPhone(phone);
    setPhoneError("");
    setShowPhoneModal(true);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    setNameError("");

    const result = profileSchema
      .pick({ full_name: true })
      .safeParse({ full_name: tempName.trim() });

    if (!result.success) return setNameError(result.error.issues[0].message);

    setIsSavingProfile(true);
    try {
      await accountService.updateProfile({ full_name: tempName.trim() });
      setName(tempName.trim());
      setShowNameModal(false);
    } catch (err) {
      alert("Gagal menyimpan nama: " + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveGender = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await accountService.updateProfile({ gender: tempGender });
      setGender(tempGender);
      setShowGenderModal(false);
    } catch (err) {
      alert("Gagal menyimpan jenis kelamin: " + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePhone = async (e) => {
    e.preventDefault();
    setPhoneError("");

    const result = profileSchema
      .pick({ phone_number: true })
      .safeParse({ phone_number: tempPhone.trim() });

    if (!result.success) return setPhoneError(result.error.issues[0].message);

    setIsSavingProfile(true);
    try {
      await accountService.updateProfile({ phone_number: tempPhone.trim() });
      setPhone(tempPhone.trim());
      setShowPhoneModal(false);
    } catch (err) {
      alert("Gagal menyimpan nomor HP: " + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    const payload = {
      oldPassword: oldPassword,
      password: newPassword,
      confirmPassword: confirmPassword,
    };

    const result = updatePasswordSchema.safeParse(payload);

    if (!result.success) {
      return setPassError(result.error.issues[0].message);
    }

    setIsUpdatingPass(true);
    try {
      // Verifikasi password lama dengan mencoba sign-in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (verifyError) {
        setPassError("KATA SANDI LAMA TIDAK SESUAI ATAU SALAH.");
        setIsUpdatingPass(false);
        return;
      }

      // Update ke password baru
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPassError(updateError.message.toUpperCase());
      } else {
        setPassSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPassSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setPassError("TERJADI KESALAHAN SISTEM JARINGAN.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  if (isLoading)
    return (
      <div className="py-20 text-center text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
        <Loader2 size={16} className="animate-spin inline-block mr-2" /> Memuat
        Data Profil...
      </div>
    );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Detail Biodata Diri */}
      <div className="space-y-5">
        <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-950 border-b border-neutral-100 pb-3 select-none">
          | Detail Biodata Diri
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 sm:gap-x-4 text-xs items-center border-b border-neutral-50 pb-4 h-12">
          <span className="font-bold text-neutral-400 tracking-wider uppercase select-none">
            Nama Lengkap
          </span>
          <div className="sm:col-span-2 flex justify-between items-center w-full gap-4 overflow-hidden">
            <span className="font-black text-neutral-950 tracking-wide break-words line-clamp-1 flex-1 pr-2">
              {name}
            </span>
            <button
              onClick={handleStartEditName}
              className="text-[10px] font-black tracking-widest text-neutral-400 hover:text-black transition-colors uppercase cursor-pointer flex items-center gap-1.5 p-1 shrink-0"
            >
              <Edit2 size={11} /> Ubah
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 sm:gap-x-4 text-xs items-center border-b border-neutral-50 pb-4 h-12">
          <span className="font-bold text-neutral-400 tracking-wider uppercase select-none">
            Jenis Kelamin
          </span>
          <div className="sm:col-span-2 flex justify-between items-center w-full gap-4">
            <span className="font-semibold text-neutral-800 tracking-wide line-clamp-1 flex-1">
              {gender}
            </span>
            <button
              onClick={handleStartEditGender}
              className="text-[10px] font-black tracking-widest text-neutral-400 hover:text-black transition-colors uppercase cursor-pointer flex items-center gap-1.5 p-1 shrink-0"
            >
              <Edit2 size={11} /> Ubah
            </button>
          </div>
        </div>
      </div>

      {/* Informasi Kontak */}
      <div className="space-y-5 pt-4">
        <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-950 border-b border-neutral-100 pb-3 select-none">
          | Informasi Kontak
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 sm:gap-x-4 text-xs items-center border-b border-neutral-50 pb-4 h-12">
          <span className="font-bold text-neutral-400 tracking-wider uppercase select-none">
            Alamat Email
          </span>
          <div className="sm:col-span-2 flex justify-between items-center w-full gap-4">
            <span className="font-semibold text-neutral-800 font-mono line-clamp-1 flex-1">
              {user?.email}
            </span>
            <span className="text-[9px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase select-none shrink-0">
              VERIFIED
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 sm:gap-x-4 text-xs items-center border-b border-neutral-50 pb-4 h-12">
          <span className="font-bold text-neutral-400 tracking-wider uppercase select-none">
            Nomor Handphone
          </span>
          <div className="sm:col-span-2 flex justify-between items-center w-full gap-4">
            {phone ? (
              <>
                <span className="font-semibold text-neutral-800 font-mono line-clamp-1 flex-1">
                  {phone}
                </span>
                <button
                  onClick={handleStartEditPhone}
                  className="text-[10px] font-black tracking-widest text-neutral-400 hover:text-black transition-colors uppercase cursor-pointer flex items-center gap-1.5 p-1 shrink-0"
                >
                  <Edit2 size={11} /> Ubah
                </button>
              </>
            ) : (
              <>
                <span className="font-medium text-neutral-400 uppercase italic select-none flex-1">
                  Belum Ditambahkan
                </span>
                <button
                  onClick={handleStartEditPhone}
                  className="text-[10px] font-black tracking-widest text-neutral-950 hover:underline underline-offset-4 transition-colors uppercase cursor-pointer flex items-center gap-1.5 p-1 shrink-0"
                >
                  <Plus size={12} /> Tambah Nomor
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-100">
        <button
          onClick={() => {
            setPassError("");
            setPassSuccess(false);
            setShowPasswordModal(true);
          }}
          className="px-6 py-3.5 border border-neutral-300 bg-white text-neutral-900 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer rounded-xl flex items-center gap-2 shadow-2xs"
        >
          <Lock size={12} />
          <span>Ubah Kata Sandi</span>
        </button>
      </div>

      {/* MODAL UBAH NAMA, GENDER, PHONE SAMA SEPERTI SEBELUMNYA */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md p-8 rounded-xl border border-neutral-200 space-y-6 text-left shadow-lg">
            <button
              onClick={() => setShowNameModal(false)}
              disabled={isSavingProfile}
              className="absolute right-6 top-6 text-neutral-400 hover:text-black cursor-pointer outline-none disabled:opacity-50"
            >
              <X size={18} />
            </button>
            <div className="space-y-1">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-900">
                Ubah Nama
              </h3>
            </div>
            {nameError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase rounded-xl">
                {nameError}
              </div>
            )}
            <form onSubmit={handleSaveName} className="space-y-4">
              <input
                type="text"
                maxLength={35}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-3 text-xs font-semibold tracking-wide outline-none rounded-xl focus:border-black bg-white disabled:opacity-70 disabled:bg-neutral-50"
                autoFocus
                required
                disabled={isSavingProfile}
              />
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-3.5 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all cursor-pointer rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> MENYIMPAN...
                  </>
                ) : (
                  "Simpan"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {showGenderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md p-8 rounded-xl border border-neutral-200 space-y-6 text-left shadow-lg">
            <button
              onClick={() => setShowGenderModal(false)}
              disabled={isSavingProfile}
              className="absolute right-6 top-6 text-neutral-400 hover:text-black cursor-pointer outline-none disabled:opacity-50"
            >
              <X size={18} />
            </button>
            <div className="space-y-1">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-900">
                Jenis Kelamin
              </h3>
            </div>
            <form onSubmit={handleSaveGender} className="space-y-4">
              <select
                value={tempGender}
                onChange={(e) => setTempGender(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-3 text-xs font-semibold tracking-wide outline-none rounded-xl focus:border-black bg-white cursor-pointer disabled:opacity-70 disabled:bg-neutral-50"
                disabled={isSavingProfile}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-3.5 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all cursor-pointer rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> MENYIMPAN...
                  </>
                ) : (
                  "Simpan"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md p-8 rounded-xl border border-neutral-200 space-y-6 text-left shadow-lg">
            <button
              onClick={() => setShowPhoneModal(false)}
              disabled={isSavingProfile}
              className="absolute right-6 top-6 text-neutral-400 hover:text-black cursor-pointer outline-none disabled:opacity-50"
            >
              <X size={18} />
            </button>
            <div className="space-y-1">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-900">
                Nomor Handphone
              </h3>
            </div>
            {phoneError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase rounded-xl">
                {phoneError}
              </div>
            )}
            <form onSubmit={handleSavePhone} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={14}
                value={tempPhone}
                onChange={(e) =>
                  setTempPhone(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="Contoh: 0812345678"
                className="w-full border border-neutral-300 px-4 py-3 text-xs font-mono font-bold tracking-wide outline-none rounded-xl focus:border-black bg-white disabled:opacity-70 disabled:bg-neutral-50"
                autoFocus
                required
                disabled={isSavingProfile}
              />
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-3.5 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all cursor-pointer rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> MENYIMPAN...
                  </>
                ) : (
                  "Simpan"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL UBAH PASSWORD LANGSUNG */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md p-8 rounded-xl border border-neutral-200 space-y-6 relative text-left shadow-lg">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPassError("");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="absolute right-6 top-6 text-neutral-400 hover:text-black cursor-pointer outline-none"
            >
              <X size={18} />
            </button>
            <div className="space-y-1 select-none">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-900">
                Ubah Kata Sandi
              </h3>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Masukkan kata sandi lama Anda untuk otorisasi
              </p>
            </div>

            {passError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase rounded-xl">
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black tracking-wider uppercase rounded-xl flex items-center gap-2">
                <Check size={12} strokeWidth={3} /> KATA SANDI BERHASIL
                DIPERBARUI!
              </div>
            )}

            <form
              onSubmit={handleUpdatePassword}
              className="space-y-4 animate-fadeIn mt-4"
            >
              <div className="space-y-1 pb-2 border-b border-neutral-100">
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="KATA SANDI LAMA"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl focus:border-black bg-white placeholder:text-neutral-400 placeholder:text-xs"
                  disabled={isUpdatingPass || passSuccess}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1 pt-2">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="KATA SANDI BARU (MIN 8 CHAR, 1 UPPER, 1 NUM)"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl focus:border-black bg-white placeholder:text-neutral-400 placeholder:text-xs"
                  disabled={isUpdatingPass || passSuccess}
                  required
                />
              </div>
              <div className="space-y-1">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="KONFIRMASI KATA SANDI BARU"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl focus:border-black bg-white placeholder:text-neutral-400 placeholder:text-xs"
                  disabled={isUpdatingPass || passSuccess}
                  required
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPass || passSuccess}
                  className="w-full py-4 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 active:bg-neutral-950 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 rounded-xl shadow-sm"
                >
                  {isUpdatingPass ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>PERBARUI...</span>
                    </>
                  ) : (
                    <span>SIMPAN KATA SANDI BARU</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
