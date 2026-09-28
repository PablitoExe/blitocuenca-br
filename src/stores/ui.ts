import { create } from 'zustand'

interface UiState {
  cartOpen: boolean
  searchOpen: boolean
  searchQuery: string
  mobileMenuOpen: boolean
  categoryMenuOpen: boolean
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setMobileMenuOpen: (open: boolean) => void
  setCategoryMenuOpen: (open: boolean) => void
}

/** Estado de interfaz efímero (no se persiste). */
export const useUiStore = create<UiState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  searchQuery: '',
  mobileMenuOpen: false,
  categoryMenuOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  // Al cerrar el buscador se limpia la búsqueda, igual que antes.
  setSearchOpen: (searchOpen) => set(searchOpen ? { searchOpen } : { searchOpen, searchQuery: '' }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  setCategoryMenuOpen: (categoryMenuOpen) => set({ categoryMenuOpen }),
}))
