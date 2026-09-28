import { describe, expect, it } from 'vitest'
import { MOCK_PRODUCTS } from '~/data/products'
import type { Product } from '~/types/product'
import { formatMoney, getLocalizedPrice, getPrice } from './money'

// Intl usa espacios no separables: los normalizamos para comparar.
const normalize = (value: string) => value.replace(/\s/g, ' ')
const product = MOCK_PRODUCTS[0] as Product

describe('money', () => {
  it('formatea ARS, BRL y USD desde centavos', () => {
    expect(normalize(formatMoney({ amount: 15000050, currency: 'ARS' }, 'es-AR'))).toBe('$ 150.000,50')
    expect(normalize(formatMoney({ amount: 89990, currency: 'BRL' }, 'pt-BR'))).toBe('R$ 899,90')
    expect(normalize(formatMoney({ amount: 12999, currency: 'USD' }, 'es-AR'))).toBe('US$ 129,99')
  })

  it('devuelve el precio en la moneda del idioma, o null si no está cargado', () => {
    const withPrices: Product = {
      ...product,
      prices: [
        { amount: 100, currency: 'ARS' },
        { amount: 200, currency: 'USD' },
      ],
    }
    expect(getLocalizedPrice(withPrices, 'es-AR')).toEqual({ amount: 100, currency: 'ARS' })
    expect(getLocalizedPrice(withPrices, 'pt-BR')).toBeNull()
    expect(getPrice(withPrices, 'USD')?.amount).toBe(200)
  })

  it('los productos actuales no tienen precios inventados', () => {
    expect(MOCK_PRODUCTS.every((item) => item.prices.length === 0)).toBe(true)
  })
})
