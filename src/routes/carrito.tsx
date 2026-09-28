import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { Seo } from '~/components/seo/Seo'
import { PageShell, Panel } from '~/components/ui/PageShell'
import { useCartStore } from '~/stores/cart'

export default function Carrito() {
  const items = useCartStore((state) => state.items)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <>
      <Seo title="Carrito" path="/carrito" noindex />
      <PageShell title="Tu carrito">
        <Panel className="max-w-[760px]">
          {items.length === 0 ? (
            <div className="flex flex-col items-start gap-[16px]">
              <p className="font-mona text-[15px] text-white/70">Todavía no agregaste nada.</p>
              <Link to="/productos" className="rounded-full bg-brand px-[24px] py-[12px] font-audiowide text-white">
                Ver productos
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex flex-col divide-y divide-white/10">
                {items.map((item) => (
                  <li key={item.productId} className="flex flex-wrap items-center gap-[16px] py-[16px]">
                    <Link
                      to={`/producto/${item.slug}`}
                      className="size-[80px] shrink-0 overflow-hidden rounded-[16px] bg-white/10"
                    >
                      <img src={item.image} alt={item.imageAlt} className="size-full object-cover" />
                    </Link>
                    <Link
                      to={`/producto/${item.slug}`}
                      className="min-w-[160px] flex-1 font-mona text-[15px] hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-[10px]">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Quitar una unidad de ${item.name}`}
                        className="flex size-[32px] cursor-pointer items-center justify-center rounded-full bg-white/10"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[20px] text-center font-mona">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Agregar una unidad de ${item.name}`}
                        className="flex size-[32px] cursor-pointer items-center justify-center rounded-full bg-white/10"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Quitar ${item.name} del carrito`}
                      className="flex size-[32px] cursor-pointer items-center justify-center rounded-full text-white/60 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-[24px] flex flex-wrap items-center justify-between gap-[16px]">
                <p className="font-mona text-[13px] text-white/60">
                  Los precios y el envío se calculan en el checkout.
                </p>
                <Link
                  to="/checkout"
                  className="rounded-full bg-brand px-[28px] py-[14px] font-audiowide text-[16px] text-white transition-transform duration-150 hover:scale-105"
                >
                  Ir al checkout
                </Link>
              </div>
            </>
          )}
        </Panel>
      </PageShell>
    </>
  )
}
