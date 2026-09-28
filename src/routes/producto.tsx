import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { data, Link } from 'react-router'
import imgStripes from '~/assets/images/hero-stripes.png'
import { Seo } from '~/components/seo/Seo'
import { categoryPath, getCategoryBySlug } from '~/data/categories'
import { useI18n } from '~/i18n/context'
import { CATALOG_CACHE_HEADERS } from '~/lib/cache'
import { formatMoney, getLocalizedPrice } from '~/lib/money'
import { breadcrumbJsonLd, productJsonLd } from '~/lib/seo'
import { productDetailQuery } from '~/queries/products'
import { getProductBySlug } from '~/services/products'
import { useCartStore } from '~/stores/cart'
import { selectIsFavorite, useFavoritesStore } from '~/stores/favorites'
import { useUiStore } from '~/stores/ui'
import type { Route } from './+types/producto'

export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProductBySlug(params.slug)
  if (!product) throw data(null, { status: 404, statusText: 'Producto no encontrado' })
  return { product }
}

export function headers() {
  return CATALOG_CACHE_HEADERS
}

export default function Producto({ loaderData }: Route.ComponentProps) {
  const { data: fetched } = useQuery({
    ...productDetailQuery(loaderData.product.slug),
    initialData: loaderData.product,
  })
  const product = fetched ?? loaderData.product
  const { locale, messages } = useI18n()
  const price = getLocalizedPrice(product, locale)
  const image = product.images[0]
  const path = `/producto/${product.slug}`

  const addItem = useCartStore((state) => state.addItem)
  const setCartOpen = useUiStore((state) => state.setCartOpen)
  const isFavorite = useFavoritesStore(selectIsFavorite(product.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggle)

  const buy = () => {
    if (!image) return
    addItem({ productId: product.id, slug: product.slug, name: product.name, image: image.src, imageAlt: image.alt })
    setCartOpen(true)
  }

  const categorySlug = product.subcategory ?? product.category
  const categoryHref = categoryPath(categorySlug)
  const categoryLabel = getCategoryBySlug(categorySlug)?.label ?? categorySlug

  return (
    <>
      <Seo
        title={product.name}
        description={product.description}
        path={path}
        image={image?.src}
        imageAlt={image?.alt}
        type="product"
        jsonLd={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: 'Inicio', path: '/' },
            { name: categoryLabel, path: categoryHref },
            { name: product.name, path },
          ]),
        ]}
      />
      <div className="site-container grid gap-[24px] py-[32px] sm:py-[48px] lg:grid-cols-2 lg:gap-[48px]">
        <div className="relative aspect-square overflow-hidden rounded-[40px] bg-black">
          <img alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-50" src={imgStripes} />
          {image && <img alt={image.alt} src={image.src} className="relative size-full object-contain p-[24px]" />}
        </div>

        <div className="flex flex-col gap-[16px] text-white">
          <nav aria-label="Migas de pan" className="font-mona text-[13px] text-white/80">
            <Link to="/" className="hover:underline">
              Inicio
            </Link>{' '}
            /{' '}
            <Link to={categoryHref} className="hover:underline">
              {categoryLabel}
            </Link>
          </nav>
          <p className="font-mona text-[13px] font-bold text-ink uppercase">{product.brand}</p>
          <h1 className="font-audiowide text-[clamp(28px,4vw,40px)] leading-[1.2]">{product.name}</h1>
          <p className="font-bakbak text-[24px]">{price ? formatMoney(price, locale) : messages.product.askPrice}</p>
          <p className="max-w-[520px] font-aoboshi text-[15px] leading-[24px]">{product.description}</p>

          <div className="mt-[8px] flex items-center gap-[12px]">
            <button
              type="button"
              onClick={buy}
              disabled={!product.inStock}
              className="flex h-[57px] w-[180px] cursor-pointer items-center justify-center rounded-full bg-brand font-audiowide text-[20px] text-white transition-transform duration-150 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {product.inStock ? messages.product.buy : messages.product.outOfStock}
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? messages.product.removeFavorite : messages.product.addFavorite}
              className="flex size-[57px] cursor-pointer items-center justify-center rounded-full border border-white/24 bg-white/20 text-white transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
