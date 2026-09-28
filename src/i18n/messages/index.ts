import type { Locale } from '../config'
import { esAR, type Messages } from './es-AR'
import { ptBR } from './pt-BR'

export type { Messages }

function mergeDeep<T extends object>(base: T, override: object | undefined): T {
  if (!override) return base
  const result = { ...base } as Record<string, unknown>
  for (const [key, value] of Object.entries(override)) {
    const baseValue = (base as Record<string, unknown>)[key]
    result[key] =
      value && typeof value === 'object' && baseValue && typeof baseValue === 'object'
        ? mergeDeep(baseValue, value as object)
        : (value ?? baseValue)
  }
  return result as T
}

const MESSAGES: Record<Locale, Messages> = {
  'es-AR': esAR,
  'pt-BR': mergeDeep<Messages>(esAR, ptBR),
}

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale]
}
