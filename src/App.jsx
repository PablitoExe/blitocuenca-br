import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import imgLogoToxic from './assets/figma/logo-toxic.png'
import imgRectangle7 from './assets/figma/rectangle7.png'
import imgKindpng5818855 from './assets/figma/kindpng-5818855.png'
import imgNikeShoe1 from './assets/figma/nike-shoe-1.png'
import imgLvSkate1 from './assets/figma/lv-skate-1.png'
import imgNikeAf1_1 from './assets/figma/nike-af1-1.png'
import imgShoe9c00e0c9 from './assets/figma/shoe-9c00e0c9.png'
import imgNikeAf1_2 from './assets/figma/nike-af1-2.png'
import imgSl17074Vans from './assets/figma/sl17074-vans.png'
import imgGroup1 from './assets/figma/group1-icon.svg'
import imgGroup3 from './assets/figma/group3-icon.svg'
import imgGroup2 from './assets/figma/group2-icon.svg'
import imgEllipse6 from './assets/figma/ellipse6.svg'
import imgEllipse33 from './assets/figma/ellipse33.svg'
import imgEllipse34 from './assets/figma/ellipse34.svg'
import imgVector from './assets/figma/vector.svg'
import imgVector1 from './assets/figma/vector1.svg'
import imgVector2 from './assets/figma/vector2.svg'

const NAV_LINKS = ['inicio', 'zapatillas', 'indumentaria', 'perfumes', 'accesorios']
const BRANDS = ['Nike', 'Louis Vuitton', 'Adidas', 'Vans', 'Off White']
const BRAND_GRADIENT =
  'linear-gradient(131.29deg, rgb(7, 213, 85) 14.577%, rgb(130, 235, 83) 50.062%, rgb(191, 248, 78) 85.548%)'

const HERO_SLIDES = [
  {
    bigText: 'AIR JORDAN',
    image: imgKindpng5818855,
    imageAlt: 'Air Jordan 4 Retro White Cement',
    imageWidth: 575.355,
    imageHeight: 344.807,
    imageRotate: '33.71deg',
    badgeText: 'JORDAN RETRO 4 ・',
    titleLines: ['Air Jordan 4 Retro ', '"White Cement"'],
    description: [
      'Un clásico de 1989 diseñado por Tinker Hatfield. Creadas en cuero blanco con el icónico acabado gris cemento salpicado y cápsula Air visible: pura historia',
      'y estilo urbano en tus pies.',
    ],
  },
  {
    bigText: 'LV SKATE',
    image: imgLvSkate1,
    imageAlt: 'Louis Vuitton LV Skate Negro/Blanco',
    imageWidth: 560,
    imageHeight: 541.9,
    imageRotate: '0deg',
    imageOffsetX: -70,
    badgeText: 'LV SKATE ・ LV SKATE ・ ',
    titleLines: ['Louis Vuitton Skate ', 'Negro / Blanco'],
    description: [
      'Cuero negro con inserto de malla técnica y la flor LV en blanco como sello distintivo. Suela blanca de',
      'goma y silueta skate: el lujo urbano de Louis Vuitton en formato sneaker.',
    ],
  },
]

// The design's absolute positioning (mix of % and fixed px) is calibrated for this
// exact canvas size, matching the original Figma frame. Instead of letting it stretch
// unevenly at other widths, we render it at its native size and scale the whole canvas
// uniformly to fit the viewport — the same effect as the browser's own zoom.
const DESIGN_WIDTH = 1680
// The hero (title through the product banner) is scaled down a bit more than the
// rest of the page so it fits within a typical laptop viewport height without
// scrolling. Everything below it shifts up by the space this saves.
const HERO_HEIGHT = 866
const HERO_SCALE = 0.8
const HERO_SHIFT = HERO_HEIGHT * (1 - HERO_SCALE)
const DESIGN_HEIGHT = 1730 - HERO_SHIFT

function Preloader({ onFinish }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const handleEnded = () => {
    setFading(true)
    window.setTimeout(onFinish, 600)
  }

  useEffect(() => {
    const timer = window.setTimeout(handleEnded, 6000)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-[600ms] ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        className="h-full w-full object-cover"
        src={`${import.meta.env.BASE_URL}videos/logo-intro.mp4`}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
      />
    </div>
  )
}

function NavBar({ searchOpen }) {
  const [active, setActive] = useState(0)
  const itemRefs = useRef([])
  const [pill, setPill] = useState({ width: 0, left: 0, ready: false })

  const measure = (index) => {
    const el = itemRefs.current[index]
    if (el) setPill({ width: el.offsetWidth, left: el.offsetLeft, ready: true })
  }

  useLayoutEffect(() => {
    measure(active)
  }, [active])

  useLayoutEffect(() => {
    const handleResize = () => measure(active)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="absolute bg-white/20 left-1/2 p-[6px] rounded-[100px] top-[36px] transition-transform duration-300 ease-out"
      style={{ transform: `translateX(calc(-50% - ${searchOpen ? 190 : 0}px))` }}
    >
      <nav className="relative flex items-center">
        <div
          className="absolute bg-white rounded-[100px] top-0 bottom-0"
          style={{
            width: pill.width,
            transform: `translateX(${pill.left}px)`,
            transition: pill.ready ? 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
        {NAV_LINKS.map((link, i) => (
          <button
            key={link}
            type="button"
            ref={(el) => (itemRefs.current[i] = el)}
            onClick={() => setActive(i)}
            className="relative flex items-center justify-center px-[20px] py-[10px] rounded-[100px] shrink-0 cursor-pointer"
          >
            <p
              className={`font-['Mona_Sans'] font-bold leading-[22px] text-[16px] uppercase whitespace-nowrap transition-colors duration-300 ${
                active === i ? 'text-[#121212]' : 'text-white'
              }`}
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              {link}
            </p>
          </button>
        ))}
      </nav>
    </div>
  )
}

function SearchBox({ open, setOpen, query, setQuery }) {
  const inputRef = useRef(null)

  const toggle = () => {
    setOpen((wasOpen) => {
      const nowOpen = !wasOpen
      if (nowOpen) {
        // wait for the expand transition to start before focusing
        requestAnimationFrame(() => inputRef.current?.focus())
      } else {
        setQuery('')
      }
      return nowOpen
    })
  }

  return (
    <div className="relative shrink-0 size-[46px]">
      <div
        className="absolute right-[54px] top-1/2 -translate-y-1/2 overflow-hidden transition-[width,opacity] duration-300 ease-out"
        style={{ width: open ? 220 : 0, opacity: open ? 1 : 0 }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false)
              setQuery('')
            }
          }}
          placeholder="Buscar marca..."
          aria-label="Buscar marca"
          className="w-[220px] h-[46px] rounded-[100px] bg-white/20 px-[16px] text-[14px] text-white placeholder-white/70 outline-none font-['Mona_Sans'] focus:bg-white/30"
        />
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? 'Cerrar buscador' : 'Buscar'}
        aria-expanded={open}
        className="absolute inset-0 cursor-pointer"
      >
        <img alt="" className="absolute block inset-0 max-w-none pointer-events-none size-full" src={imgGroup1} />
      </button>
    </div>
  )
}

function Header({ searchOpen, setSearchOpen, query, setQuery }) {
  return (
    <div className="absolute contents left-[calc(10%-28px)] top-[9px]">
      <div className="absolute h-[115px] left-[calc(10%-28px)] top-[9px] w-[104px]">
        <img alt="Blitocuenca" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogoToxic} />
      </div>

      <NavBar searchOpen={searchOpen} />

      <div className="absolute contents left-[calc(80%+26px)] top-[36px]">
        <div className="absolute flex gap-[16px] items-center left-[calc(80%+26px)] top-[36px]">
          <SearchBox open={searchOpen} setOpen={setSearchOpen} query={query} setQuery={setQuery} />
          <div className="relative shrink-0 size-[46px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup3} />
          </div>
          <div className="relative shrink-0 size-[46px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup2} />
          </div>
        </div>
        <div className="absolute left-[calc(90%+16px)] size-[12px] top-[36px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse6} />
        </div>
      </div>
    </div>
  )
}

// Calibrated against "JORDAN RETRO 4 ・ " (the reference badge text) so every
// slide's badge text keeps the same letter size/density instead of being
// force-stretched to fill the full ring regardless of how long the phrase is.
const BADGE_CHAR_SPACING = 560 / `JORDAN RETRO 4 ・ `.repeat(2).length

const IMAGE_TRANSITION_MS = 400

function ProductImage({ slide, exiting }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${
        exiting ? 'animate-[product-image-exit_0.4s_ease-in_both]' : 'animate-[product-image-enter_0.4s_ease-out_both]'
      }`}
    >
      <div
        className="flex-none"
        style={{ transform: `translateX(${slide.imageOffsetX ?? 0}px) rotate(${slide.imageRotate})` }}
      >
        <div className="relative" style={{ height: slide.imageHeight, width: slide.imageWidth }}>
          <img alt={slide.imageAlt} className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={slide.image} />
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const [slideIndex, setSlideIndex] = useState(0)
  const slide = HERO_SLIDES[slideIndex]
  const [exitingSlide, setExitingSlide] = useState(null)
  const exitTimer = useRef(null)
  const [toast, setToast] = useState(null)
  const toastTimers = useRef([])
  const [arrowKick, setArrowKick] = useState(null)
  const arrowKickTimer = useRef(null)

  const goTo = (index, direction) => {
    const nextIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length
    if (nextIndex === slideIndex) return
    window.clearTimeout(exitTimer.current)
    setExitingSlide({ ...HERO_SLIDES[slideIndex], transitionKey: Date.now() })
    setSlideIndex(nextIndex)
    exitTimer.current = window.setTimeout(() => setExitingSlide(null), IMAGE_TRANSITION_MS)

    window.clearTimeout(arrowKickTimer.current)
    setArrowKick({ direction, key: Date.now() })
    arrowKickTimer.current = window.setTimeout(() => setArrowKick(null), 300)
  }
  const goPrev = () => goTo(slideIndex - 1, 'prev')
  const goNext = () => goTo(slideIndex + 1, 'next')

  useEffect(() => () => window.clearTimeout(arrowKickTimer.current), [])

  useEffect(() => () => window.clearTimeout(exitTimer.current), [])

  const showToast = (text) => {
    toastTimers.current.forEach(window.clearTimeout)
    setToast({ text, fading: false })
    toastTimers.current = [
      window.setTimeout(() => setToast((current) => (current ? { ...current, fading: true } : current)), 1400),
      window.setTimeout(() => setToast(null), 1700),
    ]
  }

  useEffect(() => () => toastTimers.current.forEach(window.clearTimeout), [])

  const badgeContent = `${slide.badgeText} `.repeat(2)
  const badgeTextLength = Math.round(badgeContent.length * BADGE_CHAR_SPACING)

  return (
    <div
      className="absolute left-0 pointer-events-none top-0"
      style={{ width: DESIGN_WIDTH, height: HERO_HEIGHT, transform: `scale(${HERO_SCALE})`, transformOrigin: 'top center' }}
    >
      <p
        key={slide.bigText}
        className="-translate-x-1/2 absolute font-['Audiowide'] leading-[48px] left-1/2 not-italic text-[156px] text-white top-[164px] whitespace-nowrap [word-break:break-word] animate-[fade-in_0.4s_ease-out]"
      >
        {slide.bigText}
      </p>

      <div className="-translate-x-1/2 absolute h-[430px] left-[calc(50%+0.5px)] rounded-[214.5px] top-[359px] w-[1125px]">
        <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[214.5px]">
          <div className="absolute bg-black inset-0 rounded-[214.5px]" />
          <img alt="" className="absolute max-w-none object-cover opacity-50 rounded-[214.5px] size-full" src={imgRectangle7} />
        </div>
      </div>

      <div className="absolute h-[606.164px] left-[calc(20%+26px)] top-[239px] w-[669.976px]">
        {exitingSlide && <ProductImage key={exitingSlide.transitionKey} slide={exitingSlide} exiting />}
        <ProductImage key={slide.image} slide={slide} />
      </div>

      <div className="absolute h-[220px] left-[calc(20%-38px)] top-[645px] w-[220px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse33} />
        <svg
          key={slide.badgeText}
          viewBox="0 0 220 220"
          className="absolute inset-0 size-full animate-[spin-badge_8s_linear_infinite,fade-in_0.4s_ease-out]"
          aria-hidden="true"
        >
          <path
            id="badgeTextCircle"
            fill="none"
            d="M 20,110 A 90,90 0 1,1 200,110 A 90,90 0 1,1 20,110"
          />
          <text className="font-['Bakbak_One'] uppercase" fill="white" fontSize="26" letterSpacing="0.5">
            <textPath href="#badgeTextCircle" startOffset="0" textLength={badgeTextLength}>
              {badgeContent}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute h-[64px] left-[calc(20%+40px)] top-[723px] w-[64px]">
        <div className="absolute inset-[-2.71%_-2.92%_-2.91%_-2.92%]">
          <img alt="" className="block max-w-none size-full" src={imgVector2} />
        </div>
      </div>

      {/* Previous: left circle, arrow flipped to point left */}
      <button
        key={arrowKick?.direction === 'prev' ? `prev-${arrowKick.key}` : 'prev-idle'}
        type="button"
        aria-label="Producto anterior"
        onClick={goPrev}
        className={`absolute left-[calc(70%+53px)] pointer-events-auto size-[83px] top-[258px] cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 ${
          arrowKick?.direction === 'prev' ? 'animate-[arrow-kick-left_0.3s_ease-out]' : ''
        }`}
      >
        <img alt="" className="absolute block inset-0 max-w-none pointer-events-none size-full" src={imgEllipse34} />
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute aspect-[21.000686645507812/17.500974655151367] flex items-center justify-center left-1/2 top-1/2 w-[40%]"
          style={{ containerType: 'size' }}
        >
          <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <img alt="" className="absolute block inset-0 max-w-none pointer-events-none size-full" src={imgVector1} />
          </div>
        </div>
      </button>

      {/* Next: right circle, arrow pointing right */}
      <button
        key={arrowKick?.direction === 'next' ? `next-${arrowKick.key}` : 'next-idle'}
        type="button"
        aria-label="Producto siguiente"
        onClick={goNext}
        className={`absolute left-[calc(70%+147px)] pointer-events-auto size-[83px] top-[258px] cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 ${
          arrowKick?.direction === 'next' ? 'animate-[arrow-kick-right_0.3s_ease-out]' : ''
        }`}
      >
        <img alt="" className="absolute block inset-0 max-w-none pointer-events-none size-full" src={imgEllipse34} />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute aspect-[21.000686645507812/17.500974655151367] left-1/2 top-1/2 w-[40%]">
          <img alt="" className="absolute block inset-0 max-w-none pointer-events-none size-full" src={imgVector} />
        </div>
      </button>

      {toast && (
        <div
          key={toast.text}
          className={`-translate-x-1/2 absolute left-[calc(60%+60px)] pointer-events-none rounded-[100px] bg-black/80 px-[20px] py-[10px] top-[578px] transition-opacity duration-300 ${
            toast.fading ? 'opacity-0' : 'opacity-100 animate-[fade-in_0.25s_ease-out]'
          }`}
        >
          <p className="font-['Mona_Sans'] text-[14px] text-white whitespace-nowrap">{toast.text}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => showToast('¡Agregado! Pronto vas a poder finalizar la compra.')}
        className="absolute bg-[#34e253] flex h-[57px] items-center justify-center left-[calc(60%+127px)] pointer-events-auto rounded-[28.5px] top-[639px] w-[147px] cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        <p className="[word-break:break-word] font-['Audiowide'] leading-[48px] not-italic text-[20px] text-white whitespace-nowrap">
          Comprar
        </p>
      </button>
      <button
        type="button"
        onClick={() => showToast('¡Listo! Te vamos a contactar a la brevedad.')}
        className="absolute font-['Audiowide'] leading-[48px] left-[calc(60%-10px)] not-italic pointer-events-auto text-[20px] text-white top-[643px] whitespace-nowrap cursor-pointer transition-transform duration-150 hover:scale-105 hover:text-[#bff84e] active:scale-95"
      >
        Consultar
      </button>

      <div
        key={slide.titleLines.join('')}
        className="absolute font-['Audiowide'] leading-[0] left-[calc(50%+2px)] not-italic text-[40px] text-white top-[414px] whitespace-nowrap [word-break:break-word] animate-[fade-in_0.4s_ease-out]"
      >
        <p className="leading-[48px] mb-0 whitespace-pre">{slide.titleLines[0]}</p>
        <p className="leading-[48px] whitespace-pre">{slide.titleLines[1]}</p>
      </div>
      <div
        key={slide.description.join('')}
        className="absolute font-['Aoboshi_One'] leading-[0] left-[calc(50%+2px)] not-italic text-[15px] text-white top-[510px] w-[414px] whitespace-pre-wrap [word-break:break-word] animate-[fade-in_0.4s_ease-out]"
      >
        <p className="leading-[22px] mb-0">{slide.description[0]}</p>
        <p className="leading-[22px]">{slide.description[1]}</p>
      </div>
    </div>
  )
}

function BrandShowcase({ query }) {
  const normalizedQuery = query.trim().toLowerCase()
  const matches = (brand) => !normalizedQuery || brand.toLowerCase().includes(normalizedQuery)
  const hasAnyMatch = BRANDS.some(matches)

  const fadeClass = (brand) =>
    `transition-opacity duration-300 ${matches(brand) ? 'opacity-100' : 'opacity-10 pointer-events-none'}`

  return (
    <>
      <p className="[word-break:break-word] absolute font-['Bakbak_One'] leading-[normal] left-[calc(50%-340px)] not-italic text-[64px] text-white top-[866px] whitespace-nowrap">
        COMPRAR POR MARCA
      </p>

      {!hasAnyMatch && (
        <p className="absolute font-['Mona_Sans'] left-[calc(50%-340px)] text-[20px] text-white/80 top-[960px] w-[680px]">
          No encontramos marcas para &quot;{query}&quot;.
        </p>
      )}

      {/* Nike */}
      <div className={fadeClass('Nike')}>
        <div className="absolute flex h-[125.995px] items-center justify-center left-[calc(10%+5.71px)] top-[1039.63px] w-[121.23px]">
          <div className="flex-none rotate-[-3.58deg]">
            <div className="bg-white h-[119.106px] relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[114.013px]" />
          </div>
        </div>
        <div className="absolute flex h-[159.834px] items-center justify-center left-[calc(10%-12.26px)] top-[1023.02px] w-[158.331px]">
          <div className="flex-none rotate-[28.67deg]">
            <div className="h-[119.106px] relative rounded-[19px] w-[115.325px]" style={{ backgroundImage: BRAND_GRADIENT }} />
          </div>
        </div>
        <div className="absolute flex h-[261.658px] items-center justify-center left-[111.04px] top-[956.05px] w-[262.354px] transition-transform duration-300 ease-out hover:scale-110 hover:z-10 cursor-pointer">
          <div className="flex-none rotate-[19.26deg]">
            <img alt="Nike" className="h-[205.109px] object-cover pointer-events-none w-[206.242px]" src={imgNikeShoe1} />
          </div>
        </div>
      </div>

      {/* Louis Vuitton */}
      <div className={fadeClass('Louis Vuitton')}>
        <div className="absolute flex h-[125.995px] items-center justify-center left-[calc(20%+133.71px)] top-[1040.63px] w-[121.23px]">
          <div className="flex-none rotate-[-3.58deg]">
            <div className="bg-white h-[119.106px] relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[114.013px]" />
          </div>
        </div>
        <div className="absolute flex h-[159.834px] items-center justify-center left-[calc(20%+115.74px)] top-[1024.02px] w-[158.331px]">
          <div className="flex-none rotate-[28.67deg]">
            <div className="h-[119.106px] relative rounded-[19px] w-[115.325px]" style={{ backgroundImage: BRAND_GRADIENT }} />
          </div>
        </div>
        <div className="absolute flex items-center justify-center left-[calc(20%+79.53px)] size-[259.516px] top-[943.68px] transition-transform duration-300 ease-out hover:scale-110 hover:z-10 cursor-pointer">
          <div className="flex-none rotate-[18.68deg]">
            <img alt="Louis Vuitton" className="object-cover pointer-events-none size-[204.727px]" src={imgNikeAf1_1} />
          </div>
        </div>
      </div>

      {/* Adidas */}
      <div className={fadeClass('Adidas')}>
        <div className="absolute flex h-[125.995px] items-center justify-center left-[calc(40%+93.71px)] top-[1039.63px] w-[121.23px]">
          <div className="flex-none rotate-[-3.58deg]">
            <div className="bg-white h-[119.106px] relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[114.013px]" />
          </div>
        </div>
        <div className="absolute flex h-[159.834px] items-center justify-center left-[calc(40%+75.74px)] top-[1023.02px] w-[158.331px]">
          <div className="flex-none rotate-[28.67deg]">
            <div className="h-[119.106px] relative rounded-[19px] w-[115.325px]" style={{ backgroundImage: BRAND_GRADIENT }} />
          </div>
        </div>
        <div className="absolute flex h-[237.776px] items-center justify-center left-[calc(40%+35.77px)] top-[957.17px] w-[252.104px] transition-transform duration-300 ease-out hover:scale-110 hover:z-10 cursor-pointer">
          <div className="flex-none rotate-[18.36deg]">
            <div className="h-[182.466px] overflow-hidden relative w-[205.062px]">
              <img alt="Adidas" className="absolute h-[100.97%] left-[0.54%] max-w-none top-[-0.97%] w-[99.46%]" src={imgShoe9c00e0c9} />
            </div>
          </div>
        </div>
      </div>

      {/* Vans */}
      <div className={fadeClass('Vans')}>
        <div className="absolute flex h-[125.995px] items-center justify-center left-[calc(60%+53.72px)] top-[1036.63px] w-[121.23px]">
          <div className="flex-none rotate-[-3.58deg]">
            <div className="bg-white h-[119.106px] relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[114.013px]" />
          </div>
        </div>
        <div className="absolute flex h-[159.834px] items-center justify-center left-[calc(60%+35.74px)] top-[1020.02px] w-[158.331px]">
          <div className="flex-none rotate-[28.67deg]">
            <div className="h-[119.106px] relative rounded-[19px] w-[115.325px]" style={{ backgroundImage: BRAND_GRADIENT }} />
          </div>
        </div>
        <div className="absolute flex h-[262.328px] items-center justify-center left-[calc(50%+115.39px)] top-[949.29px] w-[318.272px] transition-transform duration-300 ease-out hover:scale-110 hover:z-10 cursor-pointer">
          <div className="-scale-y-100 flex-none rotate-[-158.16deg]">
            <div className="h-[172.973px] overflow-hidden relative w-[273.557px]">
              <img alt="Vans" className="absolute h-full left-[-3.87%] max-w-none top-0 w-[101.17%]" src={imgNikeAf1_2} />
            </div>
          </div>
        </div>
      </div>

      {/* Off White */}
      <div className={fadeClass('Off White')}>
        <div className="absolute flex h-[125.995px] items-center justify-center left-[calc(80%+13.71px)] top-[1036.63px] w-[121.23px]">
          <div className="flex-none rotate-[-3.58deg]">
            <div className="bg-white h-[119.106px] relative rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[114.013px]" />
          </div>
        </div>
        <div className="absolute flex h-[159.834px] items-center justify-center left-[calc(80%-4.26px)] top-[1020.02px] w-[158.331px]">
          <div className="flex-none rotate-[28.67deg]">
            <div className="h-[119.106px] relative rounded-[19px] w-[115.325px]" style={{ backgroundImage: BRAND_GRADIENT }} />
          </div>
        </div>
        <div className="absolute flex h-[198.043px] items-center justify-center left-[calc(70%+119px)] top-[984px] w-[264.477px] transition-transform duration-300 ease-out hover:scale-110 hover:z-10 cursor-pointer">
          <div className="flex-none rotate-[18.85deg]">
            <div className="h-[128.861px] overflow-hidden relative w-[235.468px]">
              <img alt="Off White" className="absolute h-[243.64%] left-0 max-w-none top-[-116.2%] w-full" src={imgSl17074Vans} />
            </div>
          </div>
        </div>
      </div>

      {BRANDS.map((brand, i) => (
        <p
          key={brand}
          className={`[word-break:break-word] absolute font-['Bakbak_One'] leading-[normal] not-italic text-[24px] text-white top-[1186px] whitespace-nowrap transition-opacity duration-300 ${
            ['left-[calc(10%+42px)]', 'left-[calc(20%+116px)]', 'left-[calc(40%+116px)]', 'left-[calc(60%+90px)]', 'left-[calc(80%+20px)]'][i]
          } ${matches(brand) ? 'opacity-100' : 'opacity-10'}`}
        >
          {brand}
        </p>
      ))}
    </>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const outerRef = useRef(null)
  const [scale, setScale] = useState(() => (typeof window !== 'undefined' ? window.innerWidth / DESIGN_WIDTH : 1))

  useLayoutEffect(() => {
    const updateScale = () => {
      if (outerRef.current) setScale(outerRef.current.clientWidth / DESIGN_WIDTH)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      <div ref={outerRef} className="w-full overflow-hidden" style={{ height: DESIGN_HEIGHT * scale }}>
        <div
          className="relative"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundImage:
              'linear-gradient(125.53deg, rgb(7, 213, 85) 14.577%, rgb(130, 235, 83) 50.062%, rgb(191, 248, 78) 85.548%)',
          }}
        >
          <Header searchOpen={searchOpen} setSearchOpen={setSearchOpen} query={query} setQuery={setQuery} />
          <Hero />
          <div className="absolute inset-0 pointer-events-none" style={{ transform: `translateY(-${HERO_SHIFT}px)` }}>
            <div className="pointer-events-auto">
              <BrandShowcase query={query} />
            </div>
            <div className="absolute bg-[#d9d9d9] h-[280px] left-[calc(10%-24px)] pointer-events-auto rounded-[140px] top-[1442px] w-[553px]" />
          </div>
        </div>
      </div>
    </>
  )
}
