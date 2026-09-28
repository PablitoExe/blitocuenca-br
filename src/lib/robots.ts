import { SITE } from '~/config/site'

/** Rutas que no deben rastrearse (privadas o transaccionales). */
export const DISALLOWED_PATHS = ['/carrito', '/checkout', '/mi-cuenta', '/pedidos', '/admin']

export function buildRobotsTxt() {
  return [
    'User-agent: *',
    'Allow: /',
    ...DISALLOWED_PATHS.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ].join('\n')
}
