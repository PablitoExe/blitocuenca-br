import { createContext, useContext } from 'react'
import { DEFAULT_LOCALE, LOCALE_SETTINGS, type Locale, type LocaleSettings } from './config'
import { getMessages, type Messages } from './messages'

export interface I18nValue {
  locale: Locale
  settings: LocaleSettings
  messages: Messages
}

export function buildI18nValue(locale: Locale): I18nValue {
  return { locale, settings: LOCALE_SETTINGS[locale], messages: getMessages(locale) }
}

// Valor por defecto: es-AR. Permite renderizar componentes sueltos (tests) sin provider.
export const I18nContext = createContext<I18nValue>(buildI18nValue(DEFAULT_LOCALE))

export function useI18n() {
  return useContext(I18nContext)
}
