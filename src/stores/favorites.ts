import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface FavoritesState {
  productIds: string[]
  toggle: (productId: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      productIds: [],
      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
    }),
    {
      name: 'blitocuenca-favorites',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ productIds: state.productIds }),
      skipHydration: true,
    },
  ),
)

export const selectIsFavorite = (productId: string) => (state: FavoritesState) => state.productIds.includes(productId)
