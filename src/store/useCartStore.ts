import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    id: string;
    title: string;
    price: number;
    thumbnail?: string;
    creator: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const exists = get().items.some((i) => i.id === item.id);
                if (!exists) {
                    set((state) => ({ items: [...state.items, item] }));
                }
            },
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            clearCart: () => set({ items: [] }),
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price, 0);
            },
        }),
        {
            name: "cart-storage",
        }
    )
);
