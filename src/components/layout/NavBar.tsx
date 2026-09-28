import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { categoryPath, CLOTHING_CATEGORIES } from '~/data/categories'
import { getActiveNavIndex, INDUMENTARIA_NAV_INDEX, NAV_ITEMS } from '~/data/navigation'
import { useI18n } from '~/i18n/context'
import { useUiStore } from '~/stores/ui'

const PILL_TRANSITION = 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)'

/** Menú principal de desktop (xl+): pastilla con indicador animado y desplegable de indumentaria. */
export function NavBar() {
  const location = useLocation()
  const { messages } = useI18n()
  const active = getActiveNavIndex(location.pathname)
  const categoryMenuOpen = useUiStore((state) => state.categoryMenuOpen)
  const setCategoryMenuOpen = useUiStore((state) => state.setCategoryMenuOpen)
  const showCategories = categoryMenuOpen && active === INDUMENTARIA_NAV_INDEX

  const wrapperRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [pill, setPill] = useState({ width: 0, left: 0, visible: false })
  const [animatePill, setAnimatePill] = useState(false)

  // Se vuelve a medir cuando cambia el ítem activo, cuando cambia el tamaño del menú y
  // cuando termina de cargar la fuente (antes el indicador quedaba mal medido o volvía a "inicio").
  useLayoutEffect(() => {
    const measure = () => {
      const el = active >= 0 ? itemRefs.current[active] : null
      setPill((previous) =>
        el ? { width: el.offsetWidth, left: el.offsetLeft, visible: true } : { ...previous, visible: false },
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (navRef.current) observer.observe(navRef.current)
    let cancelled = false
    void document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [active])

  // Las mediciones hasta que carga la fuente se aplican sin animación (si no, el indicador
  // "se desliza" al cargar la página).
  useEffect(() => {
    if (!pill.visible || animatePill) return
    let frame = 0
    let cancelled = false
    void (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!cancelled) frame = requestAnimationFrame(() => setAnimatePill(true))
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [pill.visible, animatePill])

  useEffect(() => {
    if (!showCategories) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setCategoryMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCategoryMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showCategories, setCategoryMenuOpen])

  return (
    <div ref={wrapperRef} className="relative">
      <div className="rounded-[100px] bg-white/20 p-[calc(6*var(--u))]">
        <nav ref={navRef} aria-label={messages.nav.mainLabel} className="relative flex items-center">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 rounded-[100px] bg-white"
            style={{
              width: pill.width,
              transform: `translateX(${pill.left}px)`,
              opacity: pill.visible ? 1 : 0,
              transition: animatePill ? `${PILL_TRANSITION}, opacity 300ms ease-out` : 'none',
            }}
          />
          {NAV_ITEMS.map((item, i) => {
            const isIndumentaria = i === INDUMENTARIA_NAV_INDEX
            return (
              <Link
                key={item.key}
                to={item.to}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                aria-current={active === i ? 'page' : undefined}
                aria-expanded={isIndumentaria ? showCategories : undefined}
                aria-controls={isIndumentaria ? 'category-menu' : undefined}
                onClick={() => setCategoryMenuOpen(isIndumentaria ? !(showCategories && active === i) : false)}
                className="relative flex shrink-0 items-center justify-center rounded-[100px] px-[calc(20*var(--u))] py-[calc(10*var(--u))]"
              >
                <span
                  className={`font-mona text-[calc(16*var(--u))] leading-[calc(22*var(--u))] font-bold whitespace-nowrap uppercase transition-colors duration-300 ${
                    active === i ? 'text-ink' : 'text-white'
                  }`}
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  {messages.nav[item.key]}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div
        id="category-menu"
        inert={!showCategories}
        className={`absolute top-full left-1/2 mt-[calc(6*var(--u))] w-[calc(460*var(--u))] rounded-[calc(24*var(--u))] bg-ink/95 p-[calc(20*var(--u))] shadow-2xl transition-[opacity] duration-300 ease-out ${
          showCategories ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ transform: `translateX(-50%) translateY(${showCategories ? 0 : -8}px)` }}
      >
        <ul className="grid grid-cols-3 gap-[calc(10*var(--u))]">
          {CLOTHING_CATEGORIES.map((category) => (
            <li key={category.slug} className="contents">
              <Link
                to={categoryPath(category.slug)}
                onClick={() => setCategoryMenuOpen(false)}
                className="flex items-center justify-center rounded-[100px] bg-white/10 px-[calc(14*var(--u))] py-[calc(10*var(--u))] text-center font-mona text-[calc(13*var(--u))] font-bold text-white uppercase transition-colors duration-200 hover:bg-brand hover:text-ink"
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
