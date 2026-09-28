export const SITE = {
  name: 'Blitocuenca',
  url: (import.meta.env.VITE_SITE_URL ?? 'https://blitocuenca.com.br').replace(/\/$/, ''),
  defaultTitle: 'Blitocuenca — Zapatillas, indumentaria y streetwear',
  defaultDescription:
    'Zapatillas, indumentaria, perfumes y accesorios de Nike, Jordan, Louis Vuitton, Adidas, Vans y Off White. Estilo urbano original.',
  themeColor: '#07d555',
} as const

export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Audiowide&family=Aoboshi+One&family=Bakbak+One&display=swap'
