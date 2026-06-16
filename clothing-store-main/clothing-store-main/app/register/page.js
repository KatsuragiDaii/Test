"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { registerSchema } from "../../lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const checkPasswordStrength = (pass) => {
    if (!pass) {
      return {
        score: 0,
        label: "",
        color: "bg-neutral-200",
        textClass: "text-neutral-400",
      };
    }

    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (pass.length >= 10 && /[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) {
      return {
        score: 1,
        label: "LEMAH",
        color: "bg-red-500",
        textClass: "text-red-500",
      };
    } else if (score === 2) {
      return {
        score: 2,
        label: "SEDANG",
        color: "bg-amber-500",
        textClass: "text-amber-500",
      };
    } else {
      return {
        score: 3,
        label: "KUAT",
        color: "bg-emerald-500",
        textClass: "text-emerald-500",
      };
    }
  };

  const strength = checkPasswordStrength(password);

  const getFieldError = (field) => errors[field]?.[0];

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    const payload = {
      full_name: fullName,
      email,
      password,
      confirmPassword,
    };

    const result = registerSchema.safeParse(payload);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const validatedData = result.data;

      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            full_name: validatedData.full_name,
            gender: "Laki-laki",
          },
        },
      });

      if (error) {
        setErrors({
          root: [error.message.toUpperCase()],
        });
        return;
      }

      if (data?.user) {
        if (data.session === null) {
          setSuccessMessage(
            "REGISTRASI BERHASIL! SILAKAN CEK KOTAK MASUK ATAU SPAM EMAIL ANDA UNTUK VERIFIKASI SEBELUM LOGIN.",
          );
        } else {
          setSuccessMessage("AKUN BERHASIL DIBUAT! SILAKAN LOGIN.");
        }

        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});

        setTimeout(() => {
          router.push("/login");
        }, 4000);
      }
    } catch {
      setErrors({
        root: ["TERJADI KESALAHAN JARINGAN SISTEM."],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-32 text-left font-sans antialiased text-neutral-900">
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          Register
        </h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
          [Create Account]
        </span>
      </div>

      <div className="max-w-[420px] mx-auto px-6 pt-16 md:pt-24 text-center">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="text-left space-y-1 pb-2">
            <h3 className="text-xs font-black tracking-[0.15em] uppercase text-neutral-950">
              | Create An Account
            </h3>
            <p className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">
              Please fill in the details below to register.
            </p>
          </div>

          {successMessage && (
            <div className="w-full p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black tracking-wider uppercase text-left animate-fadeIn rounded-xl">
              {successMessage}
            </div>
          )}

          {getFieldError("root") && (
            <div className="w-full p-3.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase text-left animate-fadeIn rounded-xl">
              {getFieldError("root")}
            </div>
          )}

          <div className="space-y-1 text-left">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className={`w-full border px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl transition-all duration-200 placeholder:text-neutral-400 placeholder:tracking-wide ${
                getFieldError("full_name")
                  ? "border-red-500 focus:border-red-500 bg-red-50/10"
                  : "border-neutral-300 focus:border-black bg-white"
              }`}
              disabled={isSubmitting}
            />
            {getFieldError("full_name") && (
              <span className="text-red-600 text-[9px] font-black tracking-widest uppercase pl-1 block animate-fadeIn">
                {getFieldError("full_name")}
              </span>
            )}
          </div>

          <div className="space-y-1 text-left">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={`w-full border px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl transition-all duration-200 placeholder:text-neutral-400 placeholder:tracking-wide autofill:shadow-[inset_0_0_0_1000px_#ffffff] ${
                getFieldError("email")
                  ? "border-red-500 focus:border-red-500 bg-red-50/10"
                  : "border-neutral-300 focus:border-black bg-white"
              }`}
              disabled={isSubmitting}
            />
            {getFieldError("email") && (
              <span className="text-red-600 text-[9px] font-black tracking-widest uppercase pl-1 block animate-fadeIn">
                {getFieldError("email")}
              </span>
            )}
          </div>

          <div className="space-y-1 text-left">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (Min. 8 Char, 1 Capital, 1 Number)"
              className={`w-full border px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl transition-all duration-200 placeholder:text-neutral-400 placeholder:tracking-wide ${
                getFieldError("password")
                  ? "border-red-500 focus:border-red-500 bg-red-50/10"
                  : "border-neutral-300 focus:border-black bg-white"
              }`}
              disabled={isSubmitting}
            />
            {getFieldError("password") && (
              <span className="text-red-600 text-[9px] font-black tracking-widest uppercase pl-1 block animate-fadeIn">
                {getFieldError("password")}
              </span>
            )}
          </div>

          <div className="space-y-1 text-left">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className={`w-full border px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl transition-all duration-200 placeholder:text-neutral-400 placeholder:tracking-wide ${
                getFieldError("confirmPassword")
                  ? "border-red-500 focus:border-red-500 bg-red-50/10"
                  : "border-neutral-300 focus:border-black bg-white"
              }`}
              disabled={isSubmitting}
            />

            {password && (
              <div className="mt-1.5 flex items-center gap-3 px-1 animate-fadeIn">
                <div className="flex gap-1 flex-1">
                  <div
                    className={`h-1 flex-1 transition-all duration-300 ${
                      strength.score >= 1 ? strength.color : "bg-neutral-100"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 transition-all duration-300 ${
                      strength.score >= 2 ? strength.color : "bg-neutral-100"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 transition-all duration-300 ${
                      strength.score >= 3 ? strength.color : "bg-neutral-100"
                    }`}
                  />
                </div>
                <span
                  className={`text-[8px] font-black tracking-wider uppercase shrink-0 ${strength.textClass}`}
                >
                  SANDI {strength.label}
                </span>
              </div>
            )}

            {getFieldError("confirmPassword") && (
              <span className="text-red-600 text-[9px] font-black tracking-widest uppercase pl-1 block animate-fadeIn">
                {getFieldError("confirmPassword")}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase pt-1 pb-1">
            <label className="flex items-center gap-2 text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="accent-black w-3.5 h-3.5 rounded-md border-neutral-300"
              />
              <span>Show Password</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 active:bg-neutral-950 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </div>

          <div className="pt-6 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase block">
              Already have an account?
            </span>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full py-3.5 border border-neutral-300 bg-white text-neutral-900 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer rounded-xl"
            >
              Sign In Instantly
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
