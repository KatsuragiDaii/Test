"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { authSchema } from "../../lib/validations";

function LoginFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextRoute = searchParams.get("next") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const getFieldError = (field) => errors[field]?.[0];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const payload = {
      email: email.trim(),
      password: password,
    };

    const result = authSchema
      .pick({ email: true, password: true })
      .safeParse(payload);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error) {
        setErrors({ root: [error.message.toUpperCase()] });
      } else if (data?.user) {
        router.push(nextRoute);
        router.refresh();
      }
    } catch (err) {
      setErrors({ root: ["TERJADI KESALAHAN JARINGAN SISTEM."] });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-32 text-left font-sans antialiased text-neutral-900">
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          Account
        </h1>
        <span className="text-[9px] font-bold tracking-[0.3em] text-neutral-400">
          [Sign In]
        </span>
      </div>

      <div className="max-w-[420px] mx-auto px-6 pt-16 md:pt-24 text-center">
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="text-left space-y-1 pb-2">
            <h3 className="text-xs font-black tracking-[0.15em] uppercase text-neutral-950">
              | Log In To Your Account
            </h3>
            <p className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">
              Please enter your email and password to continue.
            </p>
          </div>

          {getFieldError("root") && (
            <div className="w-full p-3.5 bg-red-50 border border-red-200 text-red-700 text-[10px] font-black tracking-wider uppercase text-left animate-fadeIn rounded-xl">
              {getFieldError("root")}
            </div>
          )}

          <div className="space-y-1 text-left">
            <input
              type="text"
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
              placeholder="Password"
              className={`w-full border px-4 py-3.5 text-xs font-semibold tracking-wide outline-none rounded-xl transition-all duration-200 placeholder:text-neutral-400 placeholder:tracking-wide autofill:shadow-[inset_0_0_0_1000px_#ffffff] ${
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

          <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase pt-1 pb-2">
            <label className="flex items-center gap-2 text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="accent-black w-3.5 h-3.5 rounded-md border-neutral-300"
              />
              <span>Show Password</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-neutral-400 hover:text-black underline underline-offset-2 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 active:bg-neutral-950 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>

          <div className="pt-6 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase block">
              Don't have an account yet?
            </span>
            <button
              type="button"
              onClick={() => router.push(`/register?next=${nextRoute}`)}
              className="w-full py-3.5 border border-neutral-300 bg-white text-neutral-900 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer rounded-xl"
            >
              Create An Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-white flex items-center justify-center text-xs font-mono tracking-widest text-neutral-400 uppercase">
          Loading Login System...
        </div>
      }
    >
      <LoginFormComponent />
    </Suspense>
  );
}
