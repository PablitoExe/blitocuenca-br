import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { categoryPath, CLOTHING_CATEGORIES } from '~/data/categories'
import { getActiveNavIndex, INDUMENTARIA_NAV_INDEX, NAV_ITEMS } from '~/data/navigation'
import { useI18n } from '~/i18n/context'
import { useUiStore } from '~/stores/ui'

/** Menú desplegable para mobile y tablet (< xl). Mismo lenguaje visual que el menú de desktop. */
export function MobileMenu() {
  const open = useUiStore((state) => state.mobileMenuOpen)
  const location = useLocation()
  const { messages } = useI18n()
  const active = getActiveNavIndex(location.pathname)
  const [categoriesOpen, setCategoriesOpen] = useState(active === INDUMENTARIA_NAV_INDEX)

  return (
    <div
      id="mobile-menu"
      inert={!open}
      className={`absolute inset-x-0 top-full z-40 transition-[opacity,translate] duration-300 ease-out xl:hidden ${
        open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
      }`}
    >
      <nav aria-label={messages.nav.mainLabel} className="site-container">
        <ul className="flex flex-col gap-[8px] rounded-[24px] bg-ink/95 p-[16px] shadow-2xl">
          {NAV_ITEMS.map((item, i) => {
            const linkClass = `flex-1 rounded-[100px] px-[20px] py-[10px] font-mona text-[16px] leading-[22px] font-bold uppercase transition-colors duration-300 ${
              active === i ? 'bg-white text-ink' : 'bg-white/10 text-white'
            }`
            if (i !== INDUMENTARIA_NAV_INDEX) {
              return (
                <li key={item.key} className="flex">
                  <Link to={item.to} aria-current={active === i ? 'page' : undefined} className={linkClass}>
                    {messages.nav[item.key]}
                  </Link>
                </li>
              )
            }
            return (
              <li key={item.key} className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px]">
                  <Link to={item.to} aria-current={active === i ? 'page' : undefined} className={linkClass}>
                    {messages.nav[item.key]}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((value) => !value)}
                    aria-expanded={categoriesOpen}
                    aria-controls="mobile-category-menu"
                    aria-label={messages.nav.clothingCategories}
                    className="flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white"
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
                {categoriesOpen && (
                  <ul id="mobile-category-menu" className="grid grid-cols-2 gap-[8px] sm:grid-cols-3">
                    {CLOTHING_CATEGORIES.map((category) => (
                      <li key={category.slug} className="flex">
                        <Link
                          to={categoryPath(category.slug)}
                          className="flex flex-1 items-center justify-center rounded-[100px] bg-white/10 px-[14px] py-[10px] text-center font-mona text-[13px] font-bold text-white uppercase transition-colors duration-200 hover:bg-brand hover:text-ink"
                        >
                          {category.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
