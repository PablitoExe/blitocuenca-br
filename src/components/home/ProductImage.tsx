import type { HeroSlide } from '~/data/hero-slides'

/** Ancho del área de la imagen en el diseño original: las medidas de cada slide son relativas a él. */
const IMAGE_AREA_WIDTH = 670

export const IMAGE_TRANSITION_MS = 400

export function ProductImage({ slide, exiting = false }: { slide: HeroSlide; exiting?: boolean }) {
  const width = (slide.imageWidth / IMAGE_AREA_WIDTH) * 100
  const offset = ((slide.imageOffsetX ?? 0) / slide.imageWidth) * 100

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${
        exiting ? 'animate-[product-image-exit_0.4s_ease-in_both]' : 'animate-[product-image-enter_0.4s_ease-out_both]'
      }`}
    >
      <div
        className="flex-none"
        style={{
          width: `${width}%`,
          aspectRatio: `${slide.imageWidth} / ${slide.imageHeight}`,
          transform: `translateX(${offset}%) rotate(${slide.imageRotate})`,
        }}
      >
        <img
          alt={exiting ? '' : slide.imageAlt}
          className="pointer-events-none size-full max-w-none object-cover"
          src={slide.image}
        />
      </div>
    </div>
  )
}
