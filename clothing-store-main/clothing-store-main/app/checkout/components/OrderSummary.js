import { ShoppingBag, CreditCard, Loader2 } from "lucide-react";

export default function OrderSummary({
  cartItems,
  subtotal,
  totalCost,
  isSubmitting,
  handlePlaceOrder,
}) {
  const formatRupiah = (num) => "Rp " + num.toLocaleString("id-ID");

  return (
    <div className="bg-[#FDFDFD] border border-neutral-200 p-6 lg:p-8 rounded-xl shadow-2xs">
      <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-950 mb-6 border-b border-neutral-200 pb-3 flex items-center gap-2 select-none">
        <ShoppingBag size={14} /> Review Your Order
      </h3>
      <div className="max-h-56 overflow-y-auto pr-2 space-y-4 border-b border-neutral-100 pb-5 mb-5 text-left">
        {cartItems.map((item, index) => {
          const uniqueKey = `${item.productId || item.id || "item"}-${item.size}-${index}`;

          return (
            <div
              key={uniqueKey}
              className="flex justify-between items-start gap-4"
            >
              <div className="space-y-0.5">
                <h4 className="text-xs font-black uppercase tracking-wide text-neutral-950 leading-tight">
                  {item.name}
                </h4>
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                  Size: {item.size} — Qty: {item.quantity}
                </p>
              </div>
              <span className="text-xs font-black text-neutral-950 font-mono shrink-0">
                {item.price !== undefined
                  ? formatRupiah(item.price * item.quantity)
                  : "Menghitung..."}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 text-xs font-bold text-neutral-500 border-b border-neutral-200 pb-5 mb-5 select-none">
        <div className="flex justify-between">
          <span className="uppercase text-[11px] font-medium text-neutral-500">
            Subtotal
          </span>
          <span className="text-neutral-900 font-bold font-mono">
            {subtotal !== undefined ? formatRupiah(subtotal) : "Menghitung..."}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="uppercase text-[11px] font-medium text-neutral-500">
            Shipping Cost
          </span>
          <span className="text-emerald-600 text-[10px] font-black tracking-widest">
            FREE
          </span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8 select-none">
        <span className="text-[11px] font-black uppercase tracking-widest text-neutral-950">
          Total Cost
        </span>
        <span className="text-xl font-black text-neutral-950 tracking-tight font-mono">
          {totalCost !== undefined ? formatRupiah(totalCost) : "Menghitung..."}
        </span>
      </div>
      <button
        onClick={handlePlaceOrder}
        disabled={isSubmitting || totalCost === undefined}
        className="w-full py-4 bg-black text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 active:bg-neutral-950 transition-all text-center flex items-center justify-center gap-2 cursor-pointer rounded-xl disabled:opacity-50 shadow-md"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard size={13} />
            <span>Pay with Midtrans</span>
          </>
        )}
      </button>
    </div>
  );
}
