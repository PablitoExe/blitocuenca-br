import { beforeEach, describe, expect, it } from 'vitest'
import { selectIsFavorite, useFavoritesStore } from './favorites'

describe('favorites store', () => {
  beforeEach(() => useFavoritesStore.setState({ productIds: [] }))

  it('agrega y quita favoritos con toggle', () => {
    const { toggle } = useFavoritesStore.getState()
    toggle('lv-skate')
    expect(selectIsFavorite('lv-skate')(useFavoritesStore.getState())).toBe(true)
    toggle('lv-skate')
    expect(selectIsFavorite('lv-skate')(useFavoritesStore.getState())).toBe(false)
  })
})
