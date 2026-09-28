import { describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, isLocale, LOCALE_SETTINGS, resolveLocale } from './config'
import { getMessages } from './messages'

describe('i18n', () => {
  it('soporta es-AR y pt-BR con su moneda', () => {
    expect(LOCALE_SETTINGS['es-AR'].currency).toBe('ARS')
    expect(LOCALE_SETTINGS['pt-BR'].currency).toBe('BRL')
    expect(isLocale('pt-BR')).toBe(true)
    expect(isLocale('en-US')).toBe(false)
  })

  it('por ahora todas las requests usan es-AR', () => {
    expect(resolveLocale(new Request('https://blitocuenca.com.br/'))).toBe(DEFAULT_LOCALE)
  })

  it('pt-BR usa sus textos y tiene las mismas claves que es-AR (lo que falte cae en español)', () => {
    expect(getMessages('es-AR').cart.title).toBe('Tu carrito')
    expect(getMessages('pt-BR').cart.title).toBe('Seu carrinho')
    const keys = (value: object): string[] =>
      Object.entries(value).flatMap(([key, child]) =>
        typeof child === 'object' ? keys(child).map((sub) => `${key}.${sub}`) : [key],
      )
    expect(keys(getMessages('pt-BR'))).toEqual(keys(getMessages('es-AR')))
  })
})
