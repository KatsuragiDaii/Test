import { MapPin } from "lucide-react";

export default function ShippingDestination({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  router,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-950 flex items-center gap-2 border-b border-neutral-200 pb-3 select-none">
        <MapPin size={14} /> 1. Shipping Destination
      </h3>
      {addresses.length === 0 ? (
        <div className="border border-dashed border-neutral-300 p-8 rounded-xl text-center space-y-4 bg-neutral-50/50">
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
            Kamu belum memiliki daftar alamat pengiriman tersimpan di database.
          </p>
          <button
            onClick={() => router.push("/account")}
            className="px-5 py-2.5 bg-black text-white text-[10px] font-black tracking-widest uppercase hover:bg-neutral-800 transition-colors rounded-xl cursor-pointer shadow-2xs"
          >
            Tambah Alamat Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`block border p-5 rounded-xl transition-all duration-200 cursor-pointer relative ${
                selectedAddressId === addr.id
                  ? "border-black bg-neutral-50/20"
                  : "border-neutral-200 hover:border-neutral-400 bg-white"
              }`}
            >
              <div className="flex items-start gap-3 text-left">
                <input
                  type="radio"
                  name="checkout_address"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="mt-1 accent-black cursor-pointer"
                />
                <div className="text-xs space-y-1 pr-6">
                  <p className="font-black text-neutral-950 uppercase tracking-wide">
                    {addr.recipient}
                  </p>
                  <p className="font-bold text-neutral-400 font-mono">
                    {addr.phone}
                  </p>
                  <p className="text-neutral-600 uppercase leading-relaxed font-semibold pt-0.5">
                    {addr.detail}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
