import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from '~/stores/ui'
import { BrandShowcase } from './BrandShowcase'

describe('BrandShowcase', () => {
  beforeEach(() => useUiStore.setState({ searchQuery: '' }))

  it('muestra las cinco marcas', () => {
    render(<BrandShowcase />)
    for (const name of ['Nike', 'Louis Vuitton', 'Adidas', 'Vans', 'Off White']) {
      expect(screen.getByRole('img', { name })).toBeInTheDocument()
    }
  })

  it('atenúa las marcas que no coinciden con la búsqueda', () => {
    useUiStore.setState({ searchQuery: 'nik' })
    render(<BrandShowcase />)
    const card = (name: string) => screen.getByRole('img', { name }).closest('.transition-opacity')
    expect(card('Nike')).toHaveClass('opacity-100')
    expect(card('Vans')).toHaveClass('opacity-10')
  })

  it('avisa cuando ninguna marca coincide', () => {
    useUiStore.setState({ searchQuery: 'zzz' })
    render(<BrandShowcase />)
    expect(screen.getByRole('status')).toHaveTextContent('No encontramos marcas para "zzz"')
  })
})
