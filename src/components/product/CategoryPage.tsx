import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { Seo } from '~/components/seo/Seo'
import { ComingSoon, PageShell } from '~/components/ui/PageShell'
import { categoryPath } from '~/data/categories'
import { breadcrumbJsonLd } from '~/lib/seo'
import { productListQuery } from '~/queries/products'
import type { Product, ProductFilters } from '~/types/product'
import { ProductGrid } from './ProductCard'

interface CategoryPageProps {
  title: string
  description: string
  path: string
  /** Migas de pan entre "Inicio" y esta página (p. ej. Indumentaria para Remeras). */
  parents?: { name: string; path: string }[]
  filters: ProductFilters
  /** Datos del loader (SSR); TanStack Query los usa como caché inicial. */
  initialProducts: Product[]
}

export function CategoryPage({ title, description, path, parents = [], filters, initialProducts }: CategoryPageProps) {
  const { data: products } = useQuery({ ...productListQuery(filters), initialData: initialProducts })

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={path}
        jsonLd={breadcrumbJsonLd([{ name: 'Inicio', path: '/' }, ...parents, { name: title, path }])}
      />
      <PageShell title={title} description={description}>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <ComingSoon>
            Estamos cargando el catálogo de esta sección. Mientras tanto, mirá{' '}
            <Link to={categoryPath('zapatillas')} className="text-lime underline">
              nuestras zapatillas
            </Link>
            .
          </ComingSoon>
        )}
      </PageShell>
    </>
  )
}
