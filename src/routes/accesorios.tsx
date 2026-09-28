import { CategoryPage } from '~/components/product/CategoryPage'
import { CATALOG_CACHE_HEADERS } from '~/lib/cache'
import { listProducts } from '~/services/products'
import type { Route } from './+types/accesorios'

export async function loader() {
  return { products: await listProducts({ category: 'accesorios' }) }
}

export function headers() {
  return CATALOG_CACHE_HEADERS
}

export default function Accesorios({ loaderData }: Route.ComponentProps) {
  return (
    <CategoryPage
      title="Accesorios"
      description="Gorras, bolsos y accesorios de streetwear en Blitocuenca."
      path="/accesorios"
      filters={{ category: 'accesorios' }}
      initialProducts={loaderData.products}
    />
  )
}
