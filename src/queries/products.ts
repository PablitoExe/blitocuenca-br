import { queryOptions } from '@tanstack/react-query'
import { getProductBySlug, listProducts } from '~/services/products'
import type { ProductFilters } from '~/types/product'

export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => [...productKeys.all, 'list', filters] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
}

export const productListQuery = (filters: ProductFilters) =>
  queryOptions({ queryKey: productKeys.list(filters), queryFn: () => listProducts(filters) })

export const productDetailQuery = (slug: string) =>
  queryOptions({ queryKey: productKeys.detail(slug), queryFn: () => getProductBySlug(slug) })
