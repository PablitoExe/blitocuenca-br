import type { Config } from '@react-router/dev/config'
import { vercelPreset } from '@vercel/react-router/vite'

export default {
  // Mantenemos `src/` como carpeta de la app en lugar del `app/` por defecto.
  appDirectory: 'src',
  // SSR activo: catálogo y productos se renderizan en el servidor (Vercel) con caché de CDN,
  // así los datos de Supabase se reflejan sin redeploy.
  ssr: true,
  // Solo se prerenderiza lo que no depende del catálogo.
  prerender: ['/', '/robots.txt'],
  // El preset adapta la salida a las funciones de Vercel. En local se usa la salida estándar
  // (build/server/index.js) para poder probar con `npm start`.
  presets: process.env.VERCEL ? [vercelPreset()] : [],
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
  },
} satisfies Config
