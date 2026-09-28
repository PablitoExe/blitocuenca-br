import { BRANDS } from '~/data/brands'
import { useI18n } from '~/i18n/context'
import { useUiStore } from '~/stores/ui'
import { BrandCard } from './BrandCard'

export function BrandShowcase() {
  const { messages } = useI18n()
  const query = useUiStore((state) => state.searchQuery)
  const normalizedQuery = query.trim().toLowerCase()
  const matches = (name: string) => !normalizedQuery || name.toLowerCase().includes(normalizedQuery)
  const hasAnyMatch = BRANDS.some((brand) => matches(brand.name))

  return (
    <section aria-labelledby="brands-title" className="site-container pb-[40px]">
      <h2
        id="brands-title"
        className="text-center font-bakbak text-[clamp(32px,7vw,64px)] leading-[normal] text-white xl:text-[calc(64*var(--u))]"
      >
        {messages.brands.title}
      </h2>

      <div className="relative mt-[16px] xl:mt-0">
        {!hasAnyMatch && (
          <p
            role="status"
            className="absolute inset-x-0 top-[16px] z-10 text-center font-mona text-[20px] text-white/80"
          >
            {messages.brands.noResults} &quot;{query}&quot;.
          </p>
        )}
        <ul className="mx-auto flex max-w-[1480px] flex-wrap justify-center gap-y-[32px]">
          {BRANDS.map((brand) => (
            <li key={brand.name} className="w-1/2 px-[6px] sm:w-1/3 lg:w-1/5 lg:px-0">
              <BrandCard brand={brand} dimmed={!matches(brand.name)} />
            </li>
          ))}
        </ul>
      </div>

      {/* Bloque gris del diseño actual (placeholder de una sección futura). */}
      <div
        aria-hidden
        className="mt-[64px] h-[clamp(140px,17vw,280px)] w-full max-w-[553px] rounded-full bg-placeholder xl:mt-[calc(227*var(--u))]"
      />
    </section>
  )
}
