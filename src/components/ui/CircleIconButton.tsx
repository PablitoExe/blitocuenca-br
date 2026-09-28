import type { ButtonHTMLAttributes, ReactNode } from 'react'

/** Botón circular de 46 px con el mismo estilo que los íconos del diseño (fondo blanco 20%). */
export function CircleIconButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`relative flex size-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/24 bg-white/20 text-white transition-transform duration-150 hover:scale-105 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
