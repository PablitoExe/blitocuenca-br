import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  imageAlt: string
  quantity: number
}

export type NewCartItem = Omit<CartItem, 'quantity'>

interface CartState {
  items: CartItem[]
  addItem: (item: NewCartItem, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((line) => line.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((line) =>
                line.productId === item.productId ? { ...line, quantity: line.quantity + quantity } : line,
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity }] }
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((line) => line.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((line) => line.productId !== productId)
              : state.items.map((line) => (line.productId === productId ? { ...line, quantity } : line)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'blitocuenca-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Se rehidrata en el cliente después del primer render para no romper la hidratación del SSR.
      skipHydration: true,
    },
  ),
)

export const selectCartCount = (state: CartState) => state.items.reduce((total, line) => total + line.quantity, 0)
