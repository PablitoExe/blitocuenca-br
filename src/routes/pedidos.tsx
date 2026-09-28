import { Seo } from '~/components/seo/Seo'
import { ComingSoon, PageShell } from '~/components/ui/PageShell'

// Fase 2: ruta privada (requiere sesión de Supabase Auth).
export default function Pedidos() {
  return (
    <>
      <Seo title="Mis pedidos" path="/pedidos" noindex />
      <PageShell title="Mis pedidos">
        <ComingSoon>
          Acá vas a ver el historial y el estado de tus pedidos cuando se habiliten los pagos (Fase 2).
        </ComingSoon>
      </PageShell>
    </>
  )
}
