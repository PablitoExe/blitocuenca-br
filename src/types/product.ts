import type { Money } from './money'

export const PRODUCT_CATEGORIES = ['zapatillas', 'indumentaria', 'perfumes', 'accesorios'] as const
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export interface ProductImage {
  src: string
  alt: string
}

/**
 * Modelo de producto del frontend. En la Fase 2 se va a mapear desde la tabla
 * `products` de Supabase (ver `types/database.ts`).
 */
export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: ProductCategory
  /** Tipo dentro de la categoría, p. ej. `remeras` dentro de `indumentaria`. */
  subcategory: string | null
  description: string
  images: ProductImage[]
  /**
   * Un precio por moneda (ARS, BRL, USD). Vacío mientras no haya precio cargado:
   * la tienda muestra "Consultar precio".
   */
  prices: Money[]
  inStock: boolean
}

export interface ProductFilters {
  category?: ProductCategory
  subcategory?: string
}
