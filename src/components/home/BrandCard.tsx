import { ART_HEIGHT, ART_WIDTH, SQUARES_CENTER_Y, type Brand } from '~/data/brands'

const CENTER_X = ART_WIDTH / 2

/** Posición y tamaño (en % de la tarjeta) de un rectángulo centrado en (cx, cy) del diseño. */
function box(width: number, height: number, cx = CENTER_X, cy = SQUARES_CENTER_Y) {
  return {
    left: `${((cx - width / 2) / ART_WIDTH) * 100}%`,
    top: `${((cy - height / 2) / ART_HEIGHT) * 100}%`,
    width: `${(width / ART_WIDTH) * 100}%`,
    height: `${(height / ART_HEIGHT) * 100}%`,
  }
}

export function BrandCard({ brand, dimmed }: { brand: Brand; dimmed: boolean }) {
  const { art } = brand
  const imageTransform = `rotate(${art.rotate}deg)${art.flipY ? ' scaleY(-1)' : ''}`

  return (
    <div className={`transition-opacity duration-300 ${dimmed ? 'pointer-events-none opacity-10' : 'opacity-100'}`}>
      <div className="@container relative mx-auto aspect-[296/243] w-full max-w-[296px]">
        <div
          aria-hidden
          className="absolute rounded-[5.4cqw] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          style={{ ...box(114.013, 119.106), transform: 'rotate(-3.58deg)' }}
        />
        <div
          aria-hidden
          className="absolute rounded-[6.4cqw]"
          style={{ ...box(115.325, 119.106), transform: 'rotate(28.67deg)', backgroundImage: 'var(--brand-gradient)' }}
        />
        <div
          className={`absolute cursor-pointer transition-transform duration-300 ease-out hover:z-10 hover:scale-110 ${art.crop ? 'overflow-hidden' : ''}`}
          style={{
            ...box(art.frameWidth, art.frameHeight, CENTER_X + art.offsetX, SQUARES_CENTER_Y + art.offsetY),
            transform: imageTransform,
          }}
        >
          <img
            alt={brand.name}
            src={art.image}
            loading="lazy"
            className={
              art.crop ? 'pointer-events-none absolute max-w-none' : 'pointer-events-none size-full object-cover'
            }
            style={art.crop}
          />
        </div>
      </div>
      <p className="text-center font-bakbak text-[18px] leading-[normal] text-white sm:text-[24px]">{brand.name}</p>
    </div>
  )
}
