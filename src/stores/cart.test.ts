import { beforeEach, describe, expect, it } from 'vitest'
import { selectCartCount, useCartStore } from './cart'

const jordan = {
  productId: 'air-jordan-4',
  slug: 'air-jordan-4',
  name: 'Air Jordan 4',
  image: '/jordan.png',
  imageAlt: 'Air Jordan 4',
}

describe('cart store', () => {
  beforeEach(() => useCartStore.setState({ items: [] }))

  it('agrega un producto nuevo con cantidad 1', () => {
    useCartStore.getState().addItem(jordan)
    expect(useCartStore.getState().items).toEqual([{ ...jordan, quantity: 1 }])
  })

  it('suma cantidad si el producto ya está en el carrito', () => {
    useCartStore.getState().addItem(jordan)
    useCartStore.getState().addItem(jordan, 2)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(selectCartCount(useCartStore.getState())).toBe(3)
  })

  it('elimina la línea cuando la cantidad llega a 0', () => {
    useCartStore.getState().addItem(jordan)
    useCartStore.getState().setQuantity(jordan.productId, 0)
    expect(useCartStore.getState().items).toEqual([])
  })

  it('persiste en localStorage', () => {
    useCartStore.getState().addItem(jordan)
    expect(JSON.parse(localStorage.getItem('blitocuenca-cart') ?? '{}').state.items).toHaveLength(1)
  })
})
