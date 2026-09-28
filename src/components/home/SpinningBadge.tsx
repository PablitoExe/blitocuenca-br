import { useId } from 'react'
import imgBadgeCircle from '~/assets/icons/badge-circle.svg'
import imgSparkle from '~/assets/icons/sparkle.svg'

// Calibrado contra "JORDAN RETRO 4 ・ " (el texto de referencia) para que cada slide mantenga
// el mismo tamaño y densidad de letra, en lugar de estirarse para llenar todo el círculo.
const BADGE_CHAR_SPACING = 560 / `JORDAN RETRO 4 ・ `.repeat(2).length

/** Insignia circular con texto girando. Ocupa el 100% de su contenedor. */
export function SpinningBadge({ text }: { text: string }) {
  const pathId = useId()
  const content = `${text} `.repeat(2)
  const textLength = Math.round(content.length * BADGE_CHAR_SPACING)

  return (
    <div className="relative size-full">
      <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgBadgeCircle} />
      <svg
        key={text}
        viewBox="0 0 220 220"
        className="absolute inset-0 size-full animate-[spin-badge_8s_linear_infinite,fade-in_0.4s_ease-out]"
        aria-hidden="true"
      >
        <path id={pathId} fill="none" d="M 20,110 A 90,90 0 1,1 200,110 A 90,90 0 1,1 20,110" />
        <text className="font-bakbak uppercase" fill="white" fontSize="26" letterSpacing="0.5">
          <textPath href={`#${pathId}`} startOffset="0" textLength={textLength}>
            {content}
          </textPath>
        </text>
      </svg>
      <img
        alt=""
        className="absolute top-1/2 left-1/2 block w-[29.1%] max-w-none -translate-x-1/2 -translate-y-1/2"
        src={imgSparkle}
      />
    </div>
  )
}
