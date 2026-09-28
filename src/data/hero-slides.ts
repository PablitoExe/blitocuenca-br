import imgAirJordan4 from '~/assets/images/hero-air-jordan-4.png'
import imgLvSkate from '~/assets/images/hero-lv-skate.png'

export interface HeroSlide {
  productId: string
  productSlug: string
  bigText: string
  image: string
  imageAlt: string
  /** Medidas de la imagen en px del diseño original, dentro de un área de 670 px de ancho. */
  imageWidth: number
  imageHeight: number
  imageRotate: string
  imageOffsetX?: number
  badgeText: string
  titleLines: [string, string]
  description: [string, string]
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    productId: 'air-jordan-4-retro-white-cement',
    productSlug: 'air-jordan-4-retro-white-cement',
    bigText: 'AIR JORDAN',
    image: imgAirJordan4,
    imageAlt: 'Air Jordan 4 Retro White Cement',
    imageWidth: 575.355,
    imageHeight: 344.807,
    imageRotate: '33.71deg',
    badgeText: 'JORDAN RETRO 4 ・',
    titleLines: ['Air Jordan 4 Retro ', '"White Cement"'],
    description: [
      'Un clásico de 1989 diseñado por Tinker Hatfield. Creadas en cuero blanco con el icónico acabado gris cemento salpicado y cápsula Air visible: pura historia',
      'y estilo urbano en tus pies.',
    ],
  },
  {
    productId: 'louis-vuitton-skate-negro-blanco',
    productSlug: 'louis-vuitton-skate-negro-blanco',
    bigText: 'LV SKATE',
    image: imgLvSkate,
    imageAlt: 'Louis Vuitton LV Skate Negro/Blanco',
    imageWidth: 560,
    imageHeight: 541.9,
    imageRotate: '0deg',
    imageOffsetX: -70,
    badgeText: 'LV SKATE ・ LV SKATE ・ ',
    titleLines: ['Louis Vuitton Skate ', 'Negro / Blanco'],
    description: [
      'Cuero negro con inserto de malla técnica y la flor LV en blanco como sello distintivo. Suela blanca de',
      'goma y silueta skate: el lujo urbano de Louis Vuitton en formato sneaker.',
    ],
  },
]
