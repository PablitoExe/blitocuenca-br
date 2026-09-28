import imgLogo from '~/assets/images/logo.png'
import { BrandShowcase } from '~/components/home/BrandShowcase'
import { Hero } from '~/components/home/Hero'
import { Seo } from '~/components/seo/Seo'
import { useI18n } from '~/i18n/context'
import { organizationJsonLd, websiteJsonLd } from '~/lib/seo'

export default function Home() {
  const { locale } = useI18n()
  return (
    <>
      <Seo path="/" jsonLd={[organizationJsonLd(imgLogo), websiteJsonLd(locale)]} />
      <h1 className="sr-only">Blitocuenca — zapatillas, indumentaria y streetwear</h1>
      <Hero />
      <BrandShowcase />
    </>
  )
}
