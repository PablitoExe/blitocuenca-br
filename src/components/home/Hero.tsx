import { useEffect, useRef, useState } from 'react'
import imgArrowCircle from '~/assets/icons/arrow-circle.svg'
import imgArrowRight from '~/assets/icons/arrow-right.svg'
import imgStripes from '~/assets/images/hero-stripes.png'
import { HERO_SLIDES, type HeroSlide } from '~/data/hero-slides'
import { useI18n } from '~/i18n/context'
import { useCartStore } from '~/stores/cart'
import { useUiStore } from '~/stores/ui'
import { IMAGE_TRANSITION_MS, ProductImage } from './ProductImage'
import { SpinningBadge } from './SpinningBadge'

/*
 * Layout:
 * - < xl: todo apilado (texto grande, flechas, tarjeta negra con imagen, texto y botones).
 * - xl+: composición original de Figma. Las medidas usan `--u` (1 px del frame de 1680 px,
 *   ya escalado al 80% como estaba el hero) para mantener las proporciones exactas.
 */

type Direction = 'prev' | 'next'

function ArrowButton({
  direction,
  kickKey,
  onClick,
}: {
  direction: Direction
  kickKey: number | null
  onClick: () => void
}) {
  const { messages } = useI18n()
  const isPrev = direction === 'prev'
  return (
    <button
      key={kickKey ? `${direction}-${kickKey}` : `${direction}-idle`}
      type="button"
      aria-label={isPrev ? messages.hero.previous : messages.hero.next}
      onClick={onClick}
      className={`relative size-[52px] shrink-0 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 xl:size-[calc(66.4*var(--u))] ${
        kickKey ? (isPrev ? 'animate-[arrow-kick-left_0.3s_ease-out]' : 'animate-[arrow-kick-right_0.3s_ease-out]') : ''
      }`}
    >
      <img alt="" className="pointer-events-none absolute inset-0 block size-full max-w-none" src={imgArrowCircle} />
      <img
        alt=""
        className={`pointer-events-none absolute top-1/2 left-1/2 block aspect-[21/17.5] w-[40%] max-w-none -translate-x-1/2 -translate-y-1/2 ${
          isPrev ? '-scale-x-100' : ''
        }`}
        src={imgArrowRight}
      />
    </button>
  )
}

export function Hero() {
  const { messages } = useI18n()
  const [slideIndex, setSlideIndex] = useState(0)
  const slide = HERO_SLIDES[slideIndex] as HeroSlide
  const [exitingSlide, setExitingSlide] = useState<(HeroSlide & { transitionKey: number }) | null>(null)
  const exitTimer = useRef<number | undefined>(undefined)
  const [toast, setToast] = useState<{ text: string; fading: boolean; key: number } | null>(null)
  const toastTimers = useRef<number[]>([])
  const [arrowKick, setArrowKick] = useState<{ direction: Direction; key: number } | null>(null)
  const arrowKickTimer = useRef<number | undefined>(undefined)

  const addItem = useCartStore((state) => state.addItem)
  const setCartOpen = useUiStore((state) => state.setCartOpen)

  const goTo = (index: number, direction: Direction) => {
    const nextIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length
    if (nextIndex === slideIndex) return
    window.clearTimeout(exitTimer.current)
    setExitingSlide({ ...slide, transitionKey: Date.now() })
    setSlideIndex(nextIndex)
    exitTimer.current = window.setTimeout(() => setExitingSlide(null), IMAGE_TRANSITION_MS)

    window.clearTimeout(arrowKickTimer.current)
    setArrowKick({ direction, key: Date.now() })
    arrowKickTimer.current = window.setTimeout(() => setArrowKick(null), 300)
  }

  const showToast = (text: string) => {
    toastTimers.current.forEach(window.clearTimeout)
    // `key` nuevo en cada click para que la animación de entrada se repita.
    setToast({ text, fading: false, key: Date.now() })
    toastTimers.current = [
      window.setTimeout(() => setToast((current) => (current ? { ...current, fading: true } : current)), 1400),
      window.setTimeout(() => setToast(null), 1700),
    ]
  }

  useEffect(
    () => () => {
      window.clearTimeout(exitTimer.current)
      window.clearTimeout(arrowKickTimer.current)
      toastTimers.current.forEach(window.clearTimeout)
    },
    [],
  )

  const buy = () => {
    addItem({
      productId: slide.productId,
      slug: slide.productSlug,
      name: slide.titleLines.map((line) => line.trim()).join(' '),
      image: slide.image,
      imageAlt: slide.imageAlt,
    })
    setCartOpen(true)
  }

  return (
    <section
      aria-roledescription="carrusel"
      aria-label={messages.hero.label}
      className="relative site-container pb-[40px] xl:-mt-[calc(45*var(--u))] xl:pb-[calc(62*var(--u))]"
    >
      <p
        key={slide.bigText}
        aria-hidden
        className="animate-[fade-in_0.4s_ease-out] text-center font-audiowide text-[clamp(40px,12.5vw,110px)] leading-none whitespace-nowrap text-white xl:text-[calc(124.8*var(--u))]"
      >
        {slide.bigText}
      </p>

      <div className="relative mx-auto mt-[12px] w-full max-w-[640px] xl:mt-[calc(74.2*var(--u))] xl:w-[calc(900*var(--u))] xl:max-w-none">
        <div className="mb-[12px] flex justify-end gap-[8px] xl:absolute xl:right-[calc(-2*var(--u))] xl:bottom-[calc(100%+15*var(--u))] xl:mb-0 xl:gap-[calc(8.6*var(--u))]">
          <ArrowButton
            direction="prev"
            kickKey={arrowKick?.direction === 'prev' ? arrowKick.key : null}
            onClick={() => goTo(slideIndex - 1, 'prev')}
          />
          <ArrowButton
            direction="next"
            kickKey={arrowKick?.direction === 'next' ? arrowKick.key : null}
            onClick={() => goTo(slideIndex + 1, 'next')}
          />
        </div>

        <div className="relative flex flex-col rounded-[40px] xl:grid xl:h-[calc(344*var(--u))] xl:grid-cols-2 xl:rounded-full">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] bg-black">
            <img alt="" className="size-full max-w-none object-cover opacity-50" src={imgStripes} />
          </div>

          <div className="relative mx-auto -mt-[4%] aspect-[536/485] w-[88%] md:w-[72%] xl:absolute xl:top-[calc(-96*var(--u))] xl:left-[calc(67.6*var(--u))] xl:m-0 xl:w-[calc(536*var(--u))]">
            {exitingSlide && <ProductImage key={exitingSlide.transitionKey} slide={exitingSlide} exiting />}
            <ProductImage key={slide.image} slide={slide} />
            <div className="absolute top-[67%] left-[-9.6%] aspect-square w-[32.8%]">
              <SpinningBadge text={slide.badgeText} />
            </div>
          </div>

          <div
            aria-live="polite"
            className="relative px-[24px] pt-[12px] pb-[28px] sm:px-[40px] xl:col-start-2 xl:w-[calc(331*var(--u))] xl:p-0 xl:pt-[calc(44*var(--u))] xl:pl-[calc(1.6*var(--u))]"
          >
            <h2
              key={slide.titleLines.join('')}
              className="animate-[fade-in_0.4s_ease-out] font-audiowide text-[24px] leading-[30px] text-white sm:text-[32px] sm:leading-[38px] xl:text-[calc(32*var(--u))] xl:leading-[calc(38.4*var(--u))]"
            >
              <span className="block xl:whitespace-pre">{slide.titleLines[0]}</span>
              <span className="block xl:whitespace-pre">{slide.titleLines[1]}</span>
            </h2>
            <div
              key={slide.description.join('')}
              className="mt-[10px] animate-[fade-in_0.4s_ease-out] font-aoboshi text-[13px] leading-[20px] text-white xl:mt-0 xl:text-[calc(12*var(--u))] xl:leading-[calc(17.6*var(--u))]"
            >
              <p className="xl:hidden">{slide.description.join(' ')}</p>
              <p className="hidden whitespace-pre-wrap xl:block">{slide.description[0]}</p>
              <p className="hidden whitespace-pre-wrap xl:block">{slide.description[1]}</p>
            </div>

            <div className="relative mt-[20px] flex items-center justify-end gap-[20px] xl:absolute xl:top-[calc(224*var(--u))] xl:left-[calc(126*var(--u))] xl:mt-0 xl:justify-start xl:gap-[calc(24*var(--u))]">
              {toast && (
                <div
                  key={toast.key}
                  role="status"
                  className={`pointer-events-none absolute right-0 bottom-full mb-[10px] rounded-[100px] bg-black/80 px-[20px] py-[10px] transition-opacity duration-300 xl:right-auto xl:left-[calc(56*var(--u))] xl:-translate-x-1/2 ${
                    toast.fading ? 'opacity-0' : 'animate-[fade-in_0.25s_ease-out] opacity-100'
                  }`}
                >
                  <p className="font-mona text-[14px] text-white sm:whitespace-nowrap">{toast.text}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => showToast(messages.hero.askConfirmation)}
                className="cursor-pointer font-audiowide text-[18px] leading-[48px] whitespace-nowrap text-white transition-transform duration-150 hover:scale-105 hover:text-lime active:scale-95 xl:text-[calc(16*var(--u))] xl:leading-[calc(38.4*var(--u))]"
              >
                {messages.hero.ask}
              </button>
              <button
                type="button"
                onClick={buy}
                className="flex h-[48px] w-[132px] cursor-pointer items-center justify-center rounded-full bg-brand font-audiowide text-[18px] whitespace-nowrap text-white transition-transform duration-150 hover:scale-105 active:scale-95 xl:h-[calc(45.6*var(--u))] xl:w-[calc(117.6*var(--u))] xl:text-[calc(16*var(--u))]"
              >
                {messages.hero.buy}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
