import { buildSitemapXml, STATIC_SITEMAP_PATHS } from '~/lib/sitemap'
import { listProducts } from '~/services/products'

// Se genera en cada request (con caché de CDN) para incluir los productos nuevos sin redeploy.
export async function loader() {
  const products = await listProducts()
  const xml = buildSitemapXml([...STATIC_SITEMAP_PATHS, ...products.map((product) => `/producto/${product.slug}`)])
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
