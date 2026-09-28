import { Minus, Plus, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useI18n } from '~/i18n/context'
import { useCartStore } from '~/stores/cart'
import { useUiStore } from '~/stores/ui'

export function CartDrawer() {
  const { messages } = useI18n()
  const open = useUiStore((state) => state.cartOpen)
  const setOpen = useUiStore((state) => state.setCartOpen)
  const items = useCartStore((state) => state.items)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, setOpen])

  const close = () => setOpen(false)

  return (
    <>
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[9997] bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={messages.cart.title}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[9998] flex h-full w-full max-w-[380px] flex-col bg-ink shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-[20px]">
          <p className="font-bakbak text-[20px] text-white">{messages.cart.title}</p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={messages.cart.close}
            className="flex size-[32px] cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-[20px]">
          {items.length === 0 ? (
            <p className="font-mona text-[14px] text-white/60">{messages.cart.empty}</p>
          ) : (
            <ul className="flex flex-col gap-[16px]">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-[12px]">
                  <Link
                    to={`/producto/${item.slug}`}
                    onClick={close}
                    className="size-[64px] shrink-0 overflow-hidden rounded-[12px] bg-white/10"
                  >
                    <img alt={item.imageAlt} className="size-full object-cover" src={item.image} />
                  </Link>
                  <div className="flex flex-1 flex-col gap-[6px]">
                    <p className="font-mona text-[14px] text-white">{item.name}</p>
                    <div className="flex items-center gap-[8px] text-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Quitar una unidad de ${item.name}`}
                        className="flex size-[24px] cursor-pointer items-center justify-center rounded-full bg-white/10"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-[16px] text-center font-mona text-[13px]" aria-label="Cantidad">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Agregar una unidad de ${item.name}`}
                        className="flex size-[24px] cursor-pointer items-center justify-center rounded-full bg-white/10"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Quitar ${item.name} del carrito`}
                    className="cursor-pointer font-mona text-[12px] text-white/50 underline transition-colors hover:text-white"
                  >
                    {messages.cart.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-[10px] border-t border-white/10 p-[20px]">
          {items.length > 0 && (
            <Link
              to="/carrito"
              onClick={close}
              className="w-full rounded-[100px] border border-white/20 py-[12px] text-center font-audiowide text-[16px] text-white transition-colors hover:bg-white/10"
            >
              {messages.cart.view}
            </Link>
          )}
          <button
            type="button"
            onClick={close}
            className="w-full cursor-pointer rounded-[100px] bg-brand py-[14px] font-audiowide text-[16px] text-white transition-transform duration-150 hover:scale-[1.02] active:scale-95"
          >
            {messages.cart.keepShopping}
          </button>
        </div>
      </div>
    </>
  )
}
