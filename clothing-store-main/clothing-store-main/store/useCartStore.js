import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find(
          (i) => i.productId === newItem.productId && i.size === newItem.size,
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i === existingItem
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      updateQuantity: (productId, size, amount) => {
        set({
          items: get().items.map((i) => {
            if (i.productId === productId && i.size === size) {
              const newQty = i.quantity + amount;
              return { ...i, quantity: newQty > 0 ? newQty : 1 };
            }
            return i;
          }),
        });
      },

      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.size === size),
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "zahwa-cart-storage",
    },
  ),
);
