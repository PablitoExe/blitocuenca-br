export const CURRENCIES = ['ARS', 'BRL', 'USD'] as const
export type Currency = (typeof CURRENCIES)[number]

/**
 * Importe en unidades menores (centavos) para evitar errores de redondeo con decimales.
 * Ej.: ARS 150.000,00 → `{ amount: 15000000, currency: 'ARS' }`.
 */
export interface Money {
  amount: number
  currency: Currency
}
