import { Seo } from '~/components/seo/Seo'
import { ComingSoon, PageShell } from '~/components/ui/PageShell'

// Fase 2: ruta privada (requiere sesión de Supabase Auth).
export default function Admin() {
  return (
    <>
      <Seo title="Administración" path="/admin" noindex />
      <PageShell title="Administración">
        <ComingSoon>
          Panel de administración (productos, stock y pedidos). Se habilita en la Fase 2, restringido a usuarios con rol
          de administrador.
        </ComingSoon>
      </PageShell>
    </>
  )
}
