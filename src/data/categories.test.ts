import { describe, expect, it } from 'vitest'
import { categoryPath, getCategoryBySlug } from './categories'

describe('categories', () => {
  it('usa URLs limpias por categoría', () => {
    expect(categoryPath('zapatillas')).toBe('/categoria/zapatillas')
    expect(categoryPath('remeras')).toBe('/categoria/remeras')
  })

  it('perfumes y accesorios apuntan a su ruta propia', () => {
    expect(categoryPath('perfumes')).toBe('/perfumes')
    expect(categoryPath('accesorios')).toBe('/accesorios')
  })

  it('las subcategorías de indumentaria filtran por tipo', () => {
    expect(getCategoryBySlug('buzos')?.filters).toEqual({ category: 'indumentaria', subcategory: 'buzos' })
    expect(getCategoryBySlug('no-existe')).toBeUndefined()
  })
})
