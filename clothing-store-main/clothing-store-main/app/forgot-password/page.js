"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [systemError, setSystemError] = useState("");

  const validateEmailFormat = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setSystemError("");

    const isEmailEmpty = !email.trim();
    const isEmailInvalid = !isEmailEmpty && !validateEmailFormat(email);

    if (isEmailEmpty || isEmailInvalid) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/update-password")}`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setSystemError(error.message.toUpperCase());
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setSystemError("TERJADI KESALAHAN JARINGAN SISTEM.");
    } finally {
      setIsLoading(false);
    }
  };

  const emailHasError =
    showErrors && (!email.trim() || !validateEmailFormat(email));

  return (
    <div className="w-full min-h-screen bg-white pb-32 text-left font-sans antialiased text-neutral-900">
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          Account
        </h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
          [Reset Password]
        </span>
      </div>

      <div className="max-w-[420px] mx-auto px-6 pt-16 md:pt-24 text-center">
        <div className="w-full space-y-6">
          <div className="text-left space-y-1 pb-2">
            <h3 className="text-xs font-black tracking-[0.15em] uppercase text-neutral-950">
              | Reset Your Password
            </h3>
            <p className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase leading-relaxed">
              {!isSubmitted
                ? "Enter your email address below and we'll send you a secure link to reset your password."
                : "A secure reset link has been sent. Please check your inbox and spam folder."}
            </p>
          </div>

          {systemError && (
            <div className="w-full p-3.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase text-left animate-fadeIn rounded-xl">
              {systemError}
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleResetSubmit} noValidate className="space-y-4">
              <div className="space-y-1 text-left">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className={`w-full border px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl transition-all duration-200 placeholder:text-neutral-400 placeholder:tracking-wide autofill:shadow-[inset_0_0_0_1000px_#ffffff] ${
                    emailHasError
                      ? "border-red-500 focus:border-red-500 bg-red-50/10"
                      : "border-neutral-300 focus:border-black bg-white"
                  }`}
                  disabled={isLoading}
                />
                {showErrors && !email.trim() && (
                  <span className="text-red-600 text-[9px] font-black tracking-widest uppercase pl-1 block animate-fadeIn">
                    WAJIB DIISI
                  </span>
                )}
                {showErrors && email.trim() && !validateEmailFormat(email) && (
                  <span className="text-red-600 text-[9px] font-black tracking-widest uppercase pl-1 block animate-fadeIn">
                    EMAIL TIDAK VALID (TIDAK BOLEH SATU KATA)
                  </span>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 active:bg-neutral-950 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-2 animate-fadeIn">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-3.5 border border-neutral-300 bg-white text-neutral-900 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer rounded-xl"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {!isSubmitted && (
            <div className="text-center pt-6">
              <Link
                href="/login"
                className="text-[10px] text-neutral-400 hover:text-black font-bold tracking-[0.15em] uppercase underline underline-offset-4 transition-colors"
              >
                Cancel and return to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
