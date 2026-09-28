import { Seo } from '~/components/seo/Seo'
import { ComingSoon, PageShell } from '~/components/ui/PageShell'

// Fase 2: ruta privada (requiere sesión de Supabase Auth).
export default function MiCuenta() {
  return (
    <>
      <Seo title="Mi cuenta" path="/mi-cuenta" noindex />
      <PageShell title="Mi cuenta">
        <ComingSoon>
          Acá vas a ver tus datos, direcciones y favoritos cuando se habilite el inicio de sesión (Fase 2).
        </ComingSoon>
      </PageShell>
    </>
  )
}
