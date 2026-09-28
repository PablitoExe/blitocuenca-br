import type { ProductFilters } from '~/types/product'

export interface Category {
  slug: string
  label: string
  description: string
  filters: ProductFilters
  /** Slug de la categoría padre (p. ej. `remeras` → `indumentaria`). */
  parent?: string
}

const clothing = (slug: string, label: string): Category => ({
  slug,
  label,
  parent: 'indumentaria',
  description: `${label} originales de las mejores marcas de streetwear en Blitocuenca.`,
  filters: { category: 'indumentaria', subcategory: slug },
})

/** Categorías que viven en `/categoria/:slug`. Perfumes y accesorios tienen ruta propia. */
export const CATEGORIES: Category[] = [
  {
    slug: 'zapatillas',
    label: 'Zapatillas',
    description: 'Zapatillas originales de Nike, Jordan, Louis Vuitton, Adidas, Vans y Off White.',
    filters: { category: 'zapatillas' },
  },
  {
    slug: 'indumentaria',
    label: 'Indumentaria',
    description: 'Remeras, buzos, bermudas, jeans y más: indumentaria urbana original.',
    filters: { category: 'indumentaria' },
  },
  clothing('remeras', 'Remeras'),
  clothing('buzos', 'Buzos'),
  clothing('bermudas', 'Bermudas'),
  clothing('camisetas-de-futbol', 'Camisetas de fútbol'),
  clothing('jeans', 'Jeans'),
  clothing('baggys', 'Baggys'),
]

export const CLOTHING_CATEGORIES = CATEGORIES.filter((category) => category.parent === 'indumentaria')

/** Secciones con URL propia: `/categoria/perfumes` redirige acá para no duplicar contenido. */
export const CATEGORY_REDIRECTS: Record<string, string> = {
  perfumes: '/perfumes',
  accesorios: '/accesorios',
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug)
}

/** URL canónica de una categoría o subcategoría. */
export function categoryPath(slug: string) {
  return CATEGORY_REDIRECTS[slug] ?? `/categoria/${slug}`
}
