import { Menu, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import imgBag from '~/assets/icons/bag.svg'
import imgDot from '~/assets/icons/dot.svg'
import imgUser from '~/assets/icons/user.svg'
import imgLogo from '~/assets/images/logo.png'
import { CircleIconButton } from '~/components/ui/CircleIconButton'
import { selectCartCount, useCartStore } from '~/stores/cart'
import { useI18n } from '~/i18n/context'
import { useUiStore } from '~/stores/ui'
import { MobileMenu } from './MobileMenu'
import { NavBar } from './NavBar'
import { SearchBox } from './SearchBox'
import { SearchInput } from './SearchInput'

export function Header() {
  const location = useLocation()
  const { messages } = useI18n()
  const cartCount = useCartStore(selectCartCount)
  const setCartOpen = useUiStore((state) => state.setCartOpen)
  const searchOpen = useUiStore((state) => state.searchOpen)
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen)
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.search, setMobileMenuOpen])

  return (
    <header className="relative z-30">
      {/* Mobile/tablet: logo | (vacío) | íconos. Desktop: la columna central centra el menú en la página. */}
      <div className="site-container grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-[9px] xl:grid-cols-[1fr_auto_1fr] xl:py-[calc(9*var(--u))]">
        <Link
          to="/"
          aria-label={messages.header.homeLink}
          className="block h-[80px] w-[72px] justify-self-start xl:h-[calc(115*var(--u))] xl:w-[calc(104*var(--u))]"
        >
          <img alt="Blitocuenca" className="pointer-events-none size-full max-w-none object-cover" src={imgLogo} />
        </Link>

        <div className="hidden xl:block">
          <NavBar />
        </div>

        <div className="flex items-center gap-[10px] justify-self-end sm:gap-[16px] xl:gap-[calc(16*var(--u))]">
          <SearchBox />
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={cartCount > 0 ? `${messages.header.cart} (${cartCount})` : messages.header.cart}
            className="relative size-[46px] shrink-0 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 xl:size-[calc(46*var(--u))]"
          >
            <img alt="" className="pointer-events-none absolute inset-0 block size-full max-w-none" src={imgBag} />
            {cartCount > 0 && (
              <span className="pointer-events-none absolute top-0 right-0 size-[12px] xl:size-[calc(12*var(--u))]">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgDot} />
              </span>
            )}
          </button>
          <Link
            to="/mi-cuenta"
            aria-label={messages.header.account}
            className="relative size-[46px] shrink-0 transition-transform duration-150 hover:scale-105 active:scale-95 xl:size-[calc(46*var(--u))]"
          >
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgUser} />
          </Link>
          <CircleIconButton
            className="xl:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? messages.nav.closeMenu : messages.nav.openMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </CircleIconButton>
        </div>
      </div>

      {searchOpen && (
        <div className="site-container animate-[fade-in_0.25s_ease-out] pb-[12px] xl:hidden">
          <SearchInput className="w-full" />
        </div>
      )}

      <MobileMenu />
    </header>
  )
}
