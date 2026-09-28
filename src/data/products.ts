import imgAirJordan4 from '~/assets/images/hero-air-jordan-4.png'
import imgLvSkate from '~/assets/images/hero-lv-skate.png'
import type { Product } from '~/types/product'

/**
 * Catálogo de prueba. Se reemplaza por Supabase en la Fase 2; hasta entonces es la
 * única fuente de datos de `services/products.ts`.
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'air-jordan-4-retro-white-cement',
    slug: 'air-jordan-4-retro-white-cement',
    name: 'Air Jordan 4 Retro "White Cement"',
    brand: 'Jordan',
    category: 'zapatillas',
    subcategory: null,
    description:
      'Un clásico de 1989 diseñado por Tinker Hatfield. Creadas en cuero blanco con el icónico acabado gris cemento salpicado y cápsula Air visible: pura historia y estilo urbano en tus pies.',
    images: [{ src: imgAirJordan4, alt: 'Air Jordan 4 Retro White Cement' }],
    prices: [],
    inStock: true,
  },
  {
    id: 'louis-vuitton-skate-negro-blanco',
    slug: 'louis-vuitton-skate-negro-blanco',
    name: 'Louis Vuitton Skate Negro / Blanco',
    brand: 'Louis Vuitton',
    category: 'zapatillas',
    subcategory: null,
    description:
      'Cuero negro con inserto de malla técnica y la flor LV en blanco como sello distintivo. Suela blanca de goma y silueta skate: el lujo urbano de Louis Vuitton en formato sneaker.',
    images: [{ src: imgLvSkate, alt: 'Louis Vuitton LV Skate Negro/Blanco' }],
    prices: [],
    inStock: true,
  },
]
