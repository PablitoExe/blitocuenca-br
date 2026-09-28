import type { Currency } from '~/types/money'

export const LOCALES = ['es-AR', 'pt-BR'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es-AR'

export interface LocaleSettings {
  label: string
  /** Valor de `<html lang>`. */
  htmlLang: string
  /** Valor de `og:locale`. */
  ogLocale: string
  /** Moneda en la que se muestran los precios. */
  currency: Currency
}

export const LOCALE_SETTINGS: Record<Locale, LocaleSettings> = {
  'es-AR': { label: 'Español (Argentina)', htmlLang: 'es-AR', ogLocale: 'es_AR', currency: 'ARS' },
  'pt-BR': { label: 'Português (Brasil)', htmlLang: 'pt-BR', ogLocale: 'pt_BR', currency: 'BRL' },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * Idioma de la request. Por ahora el sitio es solo es-AR.
 * Pendiente decidir la estrategia para pt-BR (prefijo `/pt-BR/...`, dominio o cookie) y
 * resolverla acá; el resto de la app ya lee el idioma desde el contexto.
 */
export function resolveLocale(_request: Request): Locale {
  return DEFAULT_LOCALE
}
