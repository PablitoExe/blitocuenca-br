import { useState } from 'react'
import { isRouteErrorResponse, Link, Outlet } from 'react-router'
import { Preloader } from '~/components/layout/Preloader'
import { SiteChrome } from '~/components/layout/SiteChrome'
import { Seo } from '~/components/seo/Seo'
import { PageShell } from '~/components/ui/PageShell'
import type { Route } from './+types/site-layout'

const PRELOADER_ENABLED = false // TODO: reactivar cuando se vuelva a publicar el video de intro

export default function SiteLayout() {
  const [loading, setLoading] = useState(PRELOADER_ENABLED)

  return (
    <>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      <SiteChrome>
        <Outlet />
      </SiteChrome>
    </>
  )
}

/** Errores de las páginas (404, producto inexistente, etc.) se muestran dentro del layout, con el header. */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <SiteChrome>
      <Seo title={notFound ? 'Página no encontrada' : 'Algo salió mal'} path="/404" noindex />
      <PageShell
        title={notFound ? '404' : 'Error'}
        description={
          notFound ? 'No encontramos lo que buscabas.' : 'Ocurrió un error inesperado. Probá de nuevo en un rato.'
        }
      >
        <Link
          to="/"
          className="inline-flex rounded-full bg-brand px-[28px] py-[14px] font-audiowide text-[16px] text-white transition-transform duration-150 hover:scale-105"
        >
          Volver al inicio
        </Link>
      </PageShell>
    </SiteChrome>
  )
}
