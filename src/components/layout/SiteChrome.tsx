import type { ReactNode } from 'react'
import { CartDrawer } from './CartDrawer'
import { Header } from './Header'

/** Header + carrito + contenido. Compartido por el layout y su ErrorBoundary. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <CartDrawer />
      <Header />
      <main>{children}</main>
    </>
  )
}
