import imgLogo from '~/assets/images/logo.png'
import { SITE } from '~/config/site'
import { useI18n } from '~/i18n/context'
import { absoluteUrl, formatTitle, serializeJsonLd, type JsonLd } from '~/lib/seo'

interface SeoProps {
  /** Sin título se usa el título por defecto del sitio. */
  title?: string
  description?: string
  /** Ruta canónica de la página, p. ej. `/categoria/zapatillas`. */
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'product'
  /** Páginas privadas o transaccionales: no indexar. */
  noindex?: boolean
  jsonLd?: JsonLd | JsonLd[]
}

/**
 * Meta tags nativos de React 19: `<title>`, `<meta>` y `<link>` se elevan solos al
 * `<head>`, tanto en el SSR como en la navegación del cliente. Renderizar un solo
 * `<Seo>` por página.
 */
export function Seo({
  title,
  description = SITE.defaultDescription,
  path,
  image = imgLogo,
  imageAlt = SITE.name,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const { settings } = useI18n()
  const fullTitle = formatTitle(title)
  const url = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : <link rel="canonical" href={url} />}

      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={settings.ogLocale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />}
    </>
  )
}
