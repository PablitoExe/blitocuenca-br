/**
 * Páginas de catálogo (SSR): la CDN de Vercel las cachea un minuto y las revalida en
 * segundo plano. Así los precios y el stock de Supabase se reflejan sin redeploy.
 */
export const CATALOG_CACHE_HEADERS: HeadersInit = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
}
