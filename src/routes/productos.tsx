import { redirect } from 'react-router'
import { CategoryPage } from '~/components/product/CategoryPage'
import { categoryPath } from '~/data/categories'
import { CATALOG_CACHE_HEADERS } from '~/lib/cache'
import { listProducts } from '~/services/products'
import type { Route } from './+types/productos'

export async function loader({ request }: Route.LoaderArgs) {
  // Compatibilidad con las URLs viejas `/productos?categoria=...&tipo=...`.
  const params = new URL(request.url).searchParams
  const legacySlug = params.get('tipo') ?? params.get('categoria')
  if (legacySlug) throw redirect(categoryPath(legacySlug), 301)

  return { products: await listProducts() }
}

export function headers() {
  return CATALOG_CACHE_HEADERS
}

export default function Productos({ loaderData }: Route.ComponentProps) {
  return (
    <CategoryPage
      title="Productos"
      description="Zapatillas, indumentaria, perfumes y accesorios originales en Blitocuenca."
      path="/productos"
      filters={{}}
      initialProducts={loaderData.products}
    />
  )
}
