import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  categoryName?: string;
}

interface CartState {
  items: CartItem[];
  taxRate: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      taxRate: 0.14, // 14% ضريبة القيمة المضافة المصرية

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTax: () => {
        const state = get();
        return state.getSubtotal() * state.taxRate;
      },

      getTotal: () => {
        const state = get();
        return state.getSubtotal() + state.getTax();
      },
    }),
    {
      name: 'pos-cart-storage',
    }
  )
);
