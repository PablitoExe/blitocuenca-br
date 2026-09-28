import { CategoryPage } from '~/components/product/CategoryPage'
import { CATALOG_CACHE_HEADERS } from '~/lib/cache'
import { listProducts } from '~/services/products'
import type { Route } from './+types/perfumes'

export async function loader() {
  return { products: await listProducts({ category: 'perfumes' }) }
}

export function headers() {
  return CATALOG_CACHE_HEADERS
}

export default function Perfumes({ loaderData }: Route.ComponentProps) {
  return (
    <CategoryPage
      title="Perfumes"
      description="Perfumes y fragancias originales en Blitocuenca."
      path="/perfumes"
      filters={{ category: 'perfumes' }}
      initialProducts={loaderData.products}
    />
  )
}
