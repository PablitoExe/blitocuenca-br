import { useEffect, useRef, useState } from 'react'

const MAX_DURATION_MS = 6000
const FADE_MS = 600

/** Video de intro a pantalla completa. Desactivado por ahora (ver PRELOADER_ENABLED en layouts/site-layout.tsx). */
export function Preloader({ onFinish }: { onFinish: () => void }) {
  const [fading, setFading] = useState(false)
  const finishedRef = useRef(false)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  const finish = () => {
    // El video puede terminar y además dispararse el timeout de seguridad: solo cerramos una vez.
    if (finishedRef.current) return
    finishedRef.current = true
    setFading(true)
    window.setTimeout(() => onFinishRef.current(), FADE_MS)
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(finish, MAX_DURATION_MS)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
    }
    // eslint-disable-next-line react/exhaustive-deps -- solo al montar
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-[600ms] ease-out ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <video
        className="h-full w-full object-cover"
        src="/videos/logo-intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={finish}
      />
    </div>
  )
}
