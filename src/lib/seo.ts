import { SITE } from '~/config/site'
import { LOCALE_SETTINGS, type Locale } from '~/i18n/config'
import { toMajorUnits } from './money'
import type { Product } from '~/types/product'

export type JsonLd = Record<string, unknown>

/** Convierte una ruta o un asset (`/assets/x.png`) en URL absoluta del sitio. */
export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return `${SITE.url}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export function formatTitle(title?: string) {
  return title ? `${title} | ${SITE.name}` : SITE.defaultTitle
}

/** JSON serializado de forma segura para `<script type="application/ld+json">`. */
export function serializeJsonLd(data: JsonLd | JsonLd[]) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function organizationJsonLd(logoUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(logoUrl),
  }
}

export function websiteJsonLd(locale: Locale): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: LOCALE_SETTINGS[locale].htmlLang,
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function productJsonLd(product: Product): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.id,
    description: product.description,
    image: product.images.map((image) => absoluteUrl(image.src)),
    brand: { '@type': 'Brand', name: product.brand },
    url: absoluteUrl(`/producto/${product.slug}`),
    // Una oferta por moneda cargada. Sin precios no se publica `offers` (Google lo rechazaría incompleto).
    ...(product.prices.length > 0 && {
      offers: product.prices.map((price) => ({
        '@type': 'Offer',
        price: toMajorUnits(price).toFixed(2),
        priceCurrency: price.currency,
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: absoluteUrl(`/producto/${product.slug}`),
      })),
    }),
  }
}
