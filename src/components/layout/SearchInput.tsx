import { useEffect, useRef } from 'react'
import { useI18n } from '~/i18n/context'
import { useUiStore } from '~/stores/ui'

/**
 * Campo del buscador. Se usa en dos lugares (en línea en desktop y en una fila propia en
 * mobile); solo el que está visible toma el foco al abrirse.
 */
export function SearchInput({ className = '' }: { className?: string }) {
  const { messages } = useI18n()
  const open = useUiStore((state) => state.searchOpen)
  const query = useUiStore((state) => state.searchQuery)
  const setQuery = useUiStore((state) => state.setSearchQuery)
  const setOpen = useUiStore((state) => state.setSearchOpen)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const input = inputRef.current
    if (!open || !input || input.offsetParent === null) return
    // Esperamos a que arranque la transición de apertura antes de enfocar.
    const frame = requestAnimationFrame(() => input.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <input
      ref={inputRef}
      type="search"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
      placeholder={messages.header.searchPlaceholder}
      aria-label={messages.header.searchLabel}
      className={`h-[46px] rounded-[100px] bg-white/20 px-[16px] font-mona text-[14px] text-white placeholder-white/70 outline-none focus:bg-white/30 [&::-webkit-search-cancel-button]:hidden ${className}`}
    />
  )
}
