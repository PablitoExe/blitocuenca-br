import { CATEGORIES, categoryPath } from '~/data/categories'
import { absoluteUrl } from './seo'

/** Páginas públicas fijas. Los productos se agregan dinámicamente. */
export const STATIC_SITEMAP_PATHS = [
  '/',
  '/productos',
  '/perfumes',
  '/accesorios',
  ...CATEGORIES.map((category) => categoryPath(category.slug)),
]

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function buildSitemapXml(paths: string[]) {
  const urls = paths.map((path) => `  <url><loc>${escapeXml(absoluteUrl(path))}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
