import { describe, expect, it } from 'vitest'
import { MOCK_PRODUCTS } from '~/data/products'
import type { Product } from '~/types/product'
import { buildRobotsTxt } from './robots'
import { absoluteUrl, formatTitle, productJsonLd, serializeJsonLd } from './seo'
import { buildSitemapXml, STATIC_SITEMAP_PATHS } from './sitemap'

const product = MOCK_PRODUCTS[0] as Product

describe('seo', () => {
  it('arma URLs absolutas del sitio', () => {
    expect(absoluteUrl('/producto/x')).toBe('https://blitocuenca.com.br/producto/x')
    expect(absoluteUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
  })

  it('usa el título por defecto o agrega el nombre del sitio', () => {
    expect(formatTitle()).toMatch(/^Blitocuenca/)
    expect(formatTitle('Carrito')).toBe('Carrito | Blitocuenca')
  })

  it('no publica offers si el producto no tiene precio', () => {
    expect(productJsonLd({ ...product, prices: [] })).not.toHaveProperty('offers')
  })

  it('publica una oferta por moneda, en unidades mayores', () => {
    const jsonLd = productJsonLd({
      ...product,
      prices: [
        { amount: 15000000, currency: 'ARS' },
        { amount: 12999, currency: 'USD' },
      ],
    })
    expect(jsonLd.offers).toEqual([
      expect.objectContaining({ price: '150000.00', priceCurrency: 'ARS', availability: 'https://schema.org/InStock' }),
      expect.objectContaining({ price: '129.99', priceCurrency: 'USD' }),
    ])
  })

  it('escapa "<" en el JSON-LD para no cerrar el <script>', () => {
    expect(serializeJsonLd({ name: '</script>' })).not.toContain('</script>')
  })

  it('genera robots.txt con el sitemap y las rutas privadas bloqueadas', () => {
    const robots = buildRobotsTxt()
    expect(robots).toContain('Disallow: /checkout')
    expect(robots).toContain('Sitemap: https://blitocuenca.com.br/sitemap.xml')
  })

  it('genera un sitemap válido y escapa los "&"', () => {
    const xml = buildSitemapXml(['/', '/buscar?q=a&b'])
    expect(xml).toContain('<loc>https://blitocuenca.com.br/</loc>')
    expect(xml).toContain('q=a&amp;b')
  })

  it('el sitemap incluye las categorías con URL limpia', () => {
    expect(STATIC_SITEMAP_PATHS).toContain('/categoria/zapatillas')
    expect(STATIC_SITEMAP_PATHS).toContain('/categoria/remeras')
    expect(STATIC_SITEMAP_PATHS.some((path) => path.includes('?'))).toBe(false)
  })
})
