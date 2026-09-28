import { LOCALE_SETTINGS, type Locale } from '~/i18n/config'
import type { Currency, Money } from '~/types/money'
import type { Product } from '~/types/product'

/** Cantidad de decimales de cada moneda (las tres usan centavos). */
const MINOR_UNITS: Record<Currency, number> = { ARS: 2, BRL: 2, USD: 2 }

export function toMajorUnits(money: Money) {
  return money.amount / 10 ** MINOR_UNITS[money.currency]
}

export function formatMoney(money: Money, locale: Locale) {
  return new Intl.NumberFormat(LOCALE_SETTINGS[locale].htmlLang, {
    style: 'currency',
    currency: money.currency,
  }).format(toMajorUnits(money))
}

export function getPrice(product: Product, currency: Currency): Money | null {
  return product.prices.find((price) => price.currency === currency) ?? null
}

/** Precio del producto en la moneda del idioma actual, o `null` si no está cargado ("Consultar precio"). */
export function getLocalizedPrice(product: Product, locale: Locale): Money | null {
  return getPrice(product, LOCALE_SETTINGS[locale].currency)
}
