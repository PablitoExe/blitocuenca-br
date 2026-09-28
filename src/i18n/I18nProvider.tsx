import { useMemo, type ReactNode } from 'react'
import type { Locale } from './config'
import { buildI18nValue, I18nContext } from './context'

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo(() => buildI18nValue(locale), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
