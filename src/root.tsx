import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState, type ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from 'react-router'
import monaSansUrl from '~/assets/fonts/Mona-Sans.woff2?url'
import { GOOGLE_FONTS_URL, SITE } from '~/config/site'
import { DEFAULT_LOCALE, LOCALE_SETTINGS, resolveLocale } from '~/i18n/config'
import { I18nProvider } from '~/i18n/I18nProvider'
import { createQueryClient } from '~/lib/query-client'
import { useCartStore } from '~/stores/cart'
import { useFavoritesStore } from '~/stores/favorites'
import type { Route } from './+types/root'
import './index.css'

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: GOOGLE_FONTS_URL },
  { rel: 'preload', href: monaSansUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
]

export function loader({ request }: Route.LoaderArgs) {
  return { locale: resolveLocale(request) }
}

export function Layout({ children }: { children: ReactNode }) {
  // Puede no haber datos si el propio loader de root falló: se usa el idioma por defecto.
  const locale = useRouteLoaderData<typeof loader>('root')?.locale ?? DEFAULT_LOCALE

  return (
    <html lang={LOCALE_SETTINGS[locale].htmlLang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={SITE.themeColor} />
        <Meta />
        <Links />
      </head>
      <body>
        <I18nProvider locale={locale}>{children}</I18nProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  // Un QueryClient por request en el servidor y uno estable en el navegador.
  const [queryClient] = useState(createQueryClient)

  // Carrito y favoritos se leen de localStorage recién después de hidratar (el HTML del SSR no los conoce).
  useEffect(() => {
    void useCartStore.persist.rehydrate()
    void useFavoritesStore.persist.rehydrate()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}

/** Último recurso: errores que no atrapó el layout del sitio. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const title = isRouteErrorResponse(error) ? `${error.status}` : 'Error'
  const detail = isRouteErrorResponse(error)
    ? error.statusText || 'Ocurrió un error.'
    : import.meta.env.DEV && error instanceof Error
      ? error.message
      : 'Ocurrió un error inesperado.'

  return (
    <main className="site-container py-[64px] text-white">
      <title>{`${title} | ${SITE.name}`}</title>
      <h1 className="font-bakbak text-[48px]">{title}</h1>
      <p className="font-mona text-[16px]">{detail}</p>
    </main>
  )
}
