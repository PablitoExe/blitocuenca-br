import { describe, expect, it } from 'vitest'
import { getActiveNavIndex } from './navigation'

describe('getActiveNavIndex', () => {
  it.each([
    ['/', 0],
    ['/categoria/zapatillas', 1],
    ['/categoria/indumentaria', 2],
    ['/categoria/buzos', 2],
    ['/perfumes', 3],
    ['/perfumes/', 3],
    ['/accesorios', 4],
    ['/productos', -1],
    ['/categoria/no-existe', -1],
    ['/carrito', -1],
  ])('%s → %i', (pathname, expected) => {
    expect(getActiveNavIndex(pathname)).toBe(expected)
  })
})
