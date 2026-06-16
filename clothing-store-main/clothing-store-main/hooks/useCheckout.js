import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { checkoutService } from "../services/checkoutService";
import { useCartStore } from "../store/useCartStore";

export function useCheckout() {
  const router = useRouter();

  const storeCartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  const submitLock = useRef(false);
  const idempotencyKey = useRef(null);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalCost = subtotal;

  useEffect(() => {
    if (!idempotencyKey.current && typeof window !== "undefined") {
      idempotencyKey.current = crypto.randomUUID();
    }

    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    let script = document.querySelector(`script[src="${midtransScriptUrl}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = midtransScriptUrl;
      script.setAttribute("data-client-key", clientKey);
      document.body.appendChild(script);
    }

    const initializeCheckoutData = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push("/login?next=/checkout");
          return;
        }

        setUser(currentUser);

        if (storeCartItems.length === 0) {
          router.push("/cart");
          return;
        }

        const productIds = storeCartItems.map((item) => item.productId);
        const { data: dbProducts } = await supabase
          .from("products")
          .select("id, name, price")
          .in("id", productIds);

        const mergedCart = storeCartItems.map((item) => {
          const liveData = dbProducts?.find((p) => p.id === item.productId);
          return {
            id: item.productId,
            name: liveData?.name || "Loading...",
            price: liveData?.price || 0,
            size: item.size,
            quantity: item.quantity,
          };
        });

        setCartItems(mergedCart);

        const addressData = await checkoutService.getUserAddresses(
          currentUser.id,
        );
        if (addressData && addressData.length > 0) {
          setAddresses(addressData);
          setSelectedAddressId(addressData[0].id);
        }
      } catch (err) {
        console.error("Gagal memuat ekosistem data checkout:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCheckoutData();
  }, [router, storeCartItems]);

  const handlePlaceOrder = async () => {
    if (submitLock.current) return;

    setCheckoutError("");
    if (!selectedAddressId) {
      setCheckoutError(
        "Silakan tambahkan dan pilih alamat pengiriman terlebih dahulu.",
      );
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);

    try {
      const payload = {
        cartItems: cartItems,
        totalAmount: totalCost,
        addressId: selectedAddressId,
        idempotencyKey: idempotencyKey.current,
      };

      const data = await checkoutService.createTransactionToken(payload);

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function () {
            clearCart();
            setIsSuccess(true);
            setTimeout(() => {
              router.push("/account?tab=orders");
            }, 3000);
          },
          onPending: function () {
            clearCart();
            router.push("/account?tab=orders");
          },
          onError: function () {
            setCheckoutError(
              "Pembayaran gagal diproses oleh sistem bank. Silakan coba kembali.",
            );
            setIsSubmitting(false);
            submitLock.current = false;
          },
          onClose: function () {
            setCheckoutError(
              "Kamu menutup jendela pembayaran. Silakan klik tombol bayar kembali untuk melanjutkan.",
            );
            setIsSubmitting(false);
            submitLock.current = false;
          },
        });
      } else {
        clearCart();
        router.push(data.redirectUrl);
      }
    } catch (err) {
      setCheckoutError(
        err.message || "Terjadi kesalahan koneksi sistem transaksi.",
      );
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  return {
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
  };
}
