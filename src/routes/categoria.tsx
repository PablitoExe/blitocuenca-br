import { data, redirect } from 'react-router'
import { CategoryPage } from '~/components/product/CategoryPage'
import { categoryPath, CATEGORY_REDIRECTS, getCategoryBySlug } from '~/data/categories'
import { CATALOG_CACHE_HEADERS } from '~/lib/cache'
import { listProducts } from '~/services/products'
import type { Route } from './+types/categoria'

export async function loader({ params }: Route.LoaderArgs) {
  const redirectTo = CATEGORY_REDIRECTS[params.slug]
  if (redirectTo) throw redirect(redirectTo, 301)

  const category = getCategoryBySlug(params.slug)
  if (!category) throw data(null, { status: 404, statusText: 'Categoría no encontrada' })

  const parent = category.parent ? getCategoryBySlug(category.parent) : undefined
  return {
    category,
    parents: parent ? [{ name: parent.label, path: categoryPath(parent.slug) }] : [],
    products: await listProducts(category.filters),
  }
}

export function headers() {
  return CATALOG_CACHE_HEADERS
}

export default function Categoria({ loaderData }: Route.ComponentProps) {
  const { category, parents, products } = loaderData
  return (
    <CategoryPage
      key={category.slug}
      title={category.label}
      description={category.description}
      path={categoryPath(category.slug)}
      parents={parents}
      filters={category.filters}
      initialProducts={products}
    />
  )
}
