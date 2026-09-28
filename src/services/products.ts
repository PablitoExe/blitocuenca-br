import { MOCK_PRODUCTS } from '~/data/products'
import type { Product, ProductFilters } from '~/types/product'

/*
 * Capa de acceso a datos de productos. Los componentes nunca leen los datos directo:
 * pasan por acá (desde los loaders o desde TanStack Query). En la Fase 2 estas funciones
 * van a consultar Supabase y el resto de la app no debería tener que cambiar.
 */

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  return MOCK_PRODUCTS.filter(
    (product) =>
      (!filters.category || product.category === filters.category) &&
      (!filters.subcategory || product.subcategory === filters.subcategory),
  )
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((product) => product.slug === slug) ?? null
}
