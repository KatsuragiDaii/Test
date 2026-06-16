"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { resetPasswordSchema } from "../../lib/validations";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    const payload = {
      password: newPassword,
      confirmPassword: confirmPassword,
    };

    const result = resetPasswordSchema.safeParse(payload);

    if (!result.success) {
      return setPassError(result.error.issues[0].message);
    }

    setIsUpdatingPass(true);
    try {
      // Supabase secara otomatis memberikan sesi Auth kepada user
      // yang berhasil mengklik link reset password dari email.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPassError(updateError.message.toUpperCase());
      } else {
        setPassSuccess(true);
        setNewPassword("");
        setConfirmPassword("");

        // Agar benar-benar tetap di luar, sign-out otomatis setelah ganti password
        // kemudian kembalikan ke halaman login
        await supabase.auth.signOut();

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setPassError("TERJADI KESALAHAN SISTEM JARINGAN.");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-32 text-left font-sans antialiased text-neutral-900">
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          Account
        </h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
          [Set New Password]
        </span>
      </div>

      <div className="max-w-[420px] mx-auto px-6 pt-16 md:pt-24 text-center">
        <div className="w-full space-y-6">
          <div className="text-left space-y-1 pb-2">
            <h3 className="text-xs font-black tracking-[0.15em] uppercase text-neutral-950">
              | Enter New Password
            </h3>
            <p className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase leading-relaxed">
              Tautan valid. Silakan buat kata sandi baru Anda.
            </p>
          </div>

          {passError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase text-left rounded-xl">
              {passError}
            </div>
          )}

          {passSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 animate-fadeIn">
              <Check size={14} strokeWidth={3} /> KATA SANDI BERHASIL
              DIPERBARUI. MENGALIHKAN...
            </div>
          )}

          {!passSuccess && (
            <form
              onSubmit={handleUpdatePassword}
              className="space-y-4 animate-fadeIn"
            >
              <div className="space-y-1 pt-2 text-left">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="KATA SANDI BARU (MIN 8 CHAR, 1 UPPER, 1 NUM)"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl focus:border-black bg-white placeholder:text-neutral-400 placeholder:text-xs"
                  disabled={isUpdatingPass}
                  required
                />
              </div>
              <div className="space-y-1 text-left">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="KONFIRMASI KATA SANDI BARU"
                  className="w-full border border-neutral-300 px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl focus:border-black bg-white placeholder:text-neutral-400 placeholder:text-xs"
                  disabled={isUpdatingPass}
                  required
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPass}
                  className="w-full py-4 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 active:bg-neutral-950 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 rounded-xl shadow-sm"
                >
                  {isUpdatingPass ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>MENYIMPAN...</span>
                    </>
                  ) : (
                    <span>SIMPAN PASSWORD BARU</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
