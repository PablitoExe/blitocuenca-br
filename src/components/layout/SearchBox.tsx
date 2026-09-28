import imgSearch from '~/assets/icons/search.svg'
import { useI18n } from '~/i18n/context'
import { useUiStore } from '~/stores/ui'
import { SearchInput } from './SearchInput'

/** Botón de búsqueda. En desktop el campo se despliega a su izquierda; en mobile va en una fila aparte (Header). */
export function SearchBox() {
  const { messages } = useI18n()
  const open = useUiStore((state) => state.searchOpen)
  const setOpen = useUiStore((state) => state.setSearchOpen)

  return (
    <div className="flex items-center">
      <div
        inert={!open}
        className="hidden overflow-hidden transition-[width,opacity,margin] duration-300 ease-out xl:block"
        style={{
          width: open ? 'calc(220 * var(--u))' : 0,
          opacity: open ? 1 : 0,
          marginRight: open ? 'calc(8 * var(--u))' : 0,
        }}
      >
        <SearchInput className="w-[220px] xl:h-[calc(46*var(--u))] xl:w-[calc(220*var(--u))] xl:px-[calc(16*var(--u))] xl:text-[calc(14*var(--u))]" />
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? messages.header.closeSearch : messages.header.search}
        aria-expanded={open}
        className="relative size-[46px] shrink-0 cursor-pointer xl:size-[calc(46*var(--u))]"
      >
        <img alt="" className="pointer-events-none absolute inset-0 block size-full max-w-none" src={imgSearch} />
      </button>
    </div>
  )
}
