import type { Messages } from '~/i18n/messages'
import { categoryPath, CLOTHING_CATEGORIES } from './categories'

export interface NavItem {
  /** Clave del texto en `messages.nav`. */
  key: keyof Pick<Messages['nav'], 'home' | 'sneakers' | 'clothing' | 'perfumes' | 'accessories'>
  to: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'home', to: '/' },
  { key: 'sneakers', to: categoryPath('zapatillas') },
  { key: 'clothing', to: categoryPath('indumentaria') },
  { key: 'perfumes', to: '/perfumes' },
  { key: 'accessories', to: '/accesorios' },
]

export const INDUMENTARIA_NAV_INDEX = NAV_ITEMS.findIndex((item) => item.key === 'clothing')

const CLOTHING_SLUGS = new Set(['indumentaria', ...CLOTHING_CATEGORIES.map((category) => category.slug)])

/** Índice del ítem del menú que corresponde a la URL actual, o -1 si ninguno. */
export function getActiveNavIndex(pathname: string): number {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return 0
  if (path === '/perfumes') return 3
  if (path === '/accesorios') return 4
  const slug = path.match(/^\/categoria\/([^/]+)$/)?.[1]
  if (slug === 'zapatillas') return 1
  if (slug && CLOTHING_SLUGS.has(slug)) return INDUMENTARIA_NAV_INDEX
  return -1
}
