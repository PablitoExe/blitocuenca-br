import type { ReactNode } from 'react'

/** Estructura común de las páginas internas: título, bajada y contenido. */
export function PageShell({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="site-container py-[32px] sm:py-[48px]">
      <h1 className="font-bakbak text-[clamp(32px,7vw,64px)] leading-[normal] text-white uppercase">{title}</h1>
      {description && <p className="mt-[8px] max-w-[640px] font-mona text-[16px] text-white/90">{description}</p>}
      {children && <div className="mt-[32px]">{children}</div>}
    </div>
  )
}

/** Tarjeta oscura para formularios y bloques de contenido. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[24px] bg-ink/90 p-[20px] text-white shadow-2xl sm:p-[32px] ${className}`}>{children}</div>
  )
}

/** Aviso para funcionalidades que se implementan en la próxima fase. */
export function ComingSoon({ children }: { children: ReactNode }) {
  return (
    <Panel className="max-w-[640px]">
      <p className="font-mona text-[15px] text-white/80">{children}</p>
    </Panel>
  )
}
