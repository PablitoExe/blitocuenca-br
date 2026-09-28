import { Link } from 'react-router'
import { useI18n } from '~/i18n/context'
import { formatMoney, getLocalizedPrice } from '~/lib/money'
import type { Product } from '~/types/product'

export function ProductCard({ product }: { product: Product }) {
  const { locale, messages } = useI18n()
  const image = product.images[0]
  const price = getLocalizedPrice(product, locale)

  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[24px] bg-ink/90 text-white shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
    >
      <div className="relative aspect-square overflow-hidden bg-black">
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="size-full object-contain p-[16px] transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-col gap-[4px] p-[16px]">
        <p className="font-mona text-[12px] font-bold text-lime uppercase">{product.brand}</p>
        <p className="font-audiowide text-[16px] leading-[22px]">{product.name}</p>
        <p className="font-mona text-[14px] text-white/70">
          {price ? formatMoney(price, locale) : messages.product.askPrice}
        </p>
      </div>
    </Link>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-[16px] min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}
