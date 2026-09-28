import imgAdidas from '~/assets/images/brand-adidas.png'
import imgLouisVuitton from '~/assets/images/brand-louis-vuitton.png'
import imgNike from '~/assets/images/brand-nike.png'
import imgOffWhite from '~/assets/images/brand-off-white.png'
import imgVans from '~/assets/images/brand-vans.png'

/**
 * Composición de cada tarjeta de marca, en px del diseño original.
 * La tarjeta mide ART_WIDTH x ART_HEIGHT y los cuadrados decorativos están centrados en
 * (ART_WIDTH / 2, SQUARES_CENTER_Y). El componente convierte todo a porcentajes para
 * que la tarjeta escale con su columna de la grilla.
 */
export const ART_WIDTH = 296
export const ART_HEIGHT = 243
export const SQUARES_CENTER_Y = 160

export interface BrandArt {
  image: string
  /** Tamaño del recuadro que contiene la imagen (antes de rotar). */
  frameWidth: number
  frameHeight: number
  rotate: number
  flipY?: boolean
  /** Desplazamiento del centro de la imagen respecto del centro de los cuadrados. */
  offsetX: number
  offsetY: number
  /** Recorte de la imagen dentro del recuadro (valores CSS en %). */
  crop?: { top: string; left: string; width: string; height: string }
}

export interface Brand {
  name: string
  art: BrandArt
}

export const BRANDS: Brand[] = [
  {
    name: 'Nike',
    art: { image: imgNike, frameWidth: 206.242, frameHeight: 205.109, rotate: 19.26, offsetX: 7.6, offsetY: -15.7 },
  },
  {
    name: 'Louis Vuitton',
    art: {
      image: imgLouisVuitton,
      frameWidth: 204.727,
      frameHeight: 204.727,
      rotate: 18.68,
      offsetX: 15,
      offsetY: -30.2,
    },
  },
  {
    name: 'Adidas',
    art: {
      image: imgAdidas,
      frameWidth: 205.062,
      frameHeight: 182.466,
      rotate: 18.36,
      offsetX: 7.5,
      offsetY: -26.6,
      crop: { top: '-0.97%', left: '0.54%', width: '99.46%', height: '100.97%' },
    },
  },
  {
    name: 'Vans',
    art: {
      image: imgVans,
      frameWidth: 273.557,
      frameHeight: 172.973,
      rotate: -158.16,
      flipY: true,
      offsetX: -7.8,
      offsetY: -19.1,
      crop: { top: '0', left: '-3.87%', width: '101.17%', height: '100%' },
    },
  },
  {
    name: 'Off White',
    art: {
      image: imgOffWhite,
      frameWidth: 235.468,
      frameHeight: 128.861,
      rotate: 18.85,
      offsetX: 8.9,
      offsetY: -16.6,
      crop: { top: '-116.2%', left: '0', width: '100%', height: '243.64%' },
    },
  },
]
