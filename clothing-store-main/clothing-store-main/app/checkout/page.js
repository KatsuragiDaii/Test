"use client";

import { Suspense } from "react";
import {
  CreditCard,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useCheckout } from "../../hooks/useCheckout";
import ShippingDestination from "./components/ShippingDestination";
import OrderSummary from "./components/OrderSummary";

function CheckoutPageContent() {
  const {
    isLoading,
    isSuccess,
    isSubmitting,
    checkoutError,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    cartItems,
    subtotal,
    totalCost,
    handlePlaceOrder,
    router,
  } = useCheckout();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-[10px] font-bold tracking-widest text-neutral-400 uppercase select-none">
        <Loader2 size={16} className="animate-spin text-neutral-900" />
        <span>Securing Checkout Gateway...</span>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-xs">
          <CheckCircle2 size={28} strokeWidth={2.5} />
        </div>
        <h2 className="text-base font-black uppercase tracking-[0.2em] text-neutral-900 mb-2">
          Payment Authorized
        </h2>
        <p className="text-xs text-neutral-400 max-w-sm leading-relaxed uppercase font-bold tracking-wider mb-2">
          Pembayaran berhasil divalidasi. Terima kasih telah berbelanja.
        </p>
        <span className="text-[10px] bg-neutral-100 font-mono text-neutral-800 px-3 py-1.5 rounded-md font-bold tracking-widest">
          REDIRECTING TO ORDERS HISTORY...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pb-32 text-left font-sans antialiased text-neutral-900">
      <div className="w-full bg-[#F5F5F5] pt-14 pb-10 px-6 lg:px-12 border-b border-neutral-200 flex flex-col gap-1 uppercase select-none">
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-1 text-[9px] font-black tracking-widest text-neutral-400 hover:text-black transition-colors mb-2 cursor-pointer w-fit outline-none"
        >
          <ChevronLeft size={12} strokeWidth={3} /> Back to Cart
        </button>
        <h1 className="text-2xl lg:text-3xl font-black tracking-[0.2em] text-neutral-950">
          Secure Checkout
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        {checkoutError && (
          <div className="w-full bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-xs font-bold tracking-wide uppercase mb-8 flex items-center gap-3 animate-fadeIn">
            <AlertCircle size={16} />
            <span className="pt-0.5">{checkoutError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-10">
            <ShippingDestination
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              router={router}
            />

            <div className="space-y-4">
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-950 border-b border-neutral-200 pb-3 flex items-center gap-2 select-none">
                <CreditCard size={14} /> 2. Payment Gateway
              </h3>
              <div className="border border-black p-5 rounded-xl flex items-center gap-4 bg-neutral-50/20 shadow-2xs">
                <input type="radio" checked readOnly className="accent-black" />
                <div className="text-left select-none">
                  <p className="text-xs font-black uppercase tracking-wider text-neutral-950">
                    MIDTRANS SECURE POPUP
                  </p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">
                    Mendukung Virtual Account, QRIS, e-Wallet, & Kartu Kredit
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 sticky top-32">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              totalCost={totalCost}
              isSubmitting={isSubmitting}
              handlePlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-white flex items-center justify-center text-xs font-mono tracking-widest text-neutral-400 uppercase select-none">
          Loading checkout engine...
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
