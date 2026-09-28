# Blitocuenca

Tienda online de zapatillas, indumentaria, perfumes y accesorios — [blitocuenca.com.br](https://blitocuenca.com.br).

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **React Router 7** en modo framework (SSR + prerender), preparado para **Vercel**
- **Tailwind CSS 4**
- **Zustand** (carrito, favoritos, estado de UI) · **TanStack Query** (datos del servidor)
- **React Hook Form** + **Zod** · **Lucide React**
- **Vitest** + **Testing Library** · **Oxlint** · **Prettier**

## Requisitos

- Node.js 20 o superior

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # servidor de desarrollo (http://localhost:5173)
npm run build        # build de producción (SSR + páginas prerenderizadas)
npm start            # sirve el build de producción en local (http://localhost:3000)

npm run typecheck    # genera los tipos de las rutas y corre tsc
npm run lint         # oxlint
npm run format       # prettier --write
npm test             # vitest
npm run check        # typecheck + lint + formato + tests
```

## Estructura

```
src/
├── root.tsx              # documento HTML, fuentes, QueryClient, rehidratación de stores
├── routes.ts             # definición de rutas
├── layouts/              # layout del sitio (header, carrito) y página de error
├── routes/               # una ruta = un archivo (loader, SEO y página)
├── components/           # home/, layout/, product/, seo/, ui/
├── services/             # acceso a datos (hoy mock; Supabase en la Fase 2)
├── queries/              # queryOptions de TanStack Query
├── stores/               # stores de Zustand
├── data/                 # contenido estático (slides, marcas, navegación, productos mock)
├── i18n/                 # idiomas (es-AR, pt-BR), textos de interfaz y contexto
├── lib/                  # SEO, precios, validaciones Zod, caché, robots/sitemap
├── types/                # tipos del dominio y de la base de datos
└── assets/               # imágenes, íconos y fuentes
```

## Rutas y renderizado

| Ruta                                                                                            | Modo                                              |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `/`, `/robots.txt`                                                                              | Prerender (HTML estático en el build)             |
| `/productos`, `/perfumes`, `/accesorios`, `/categoria/:slug`, `/producto/:slug`, `/sitemap.xml` | SSR con caché de CDN (datos frescos del catálogo) |
| `/carrito`, `/checkout`, `/login`, `/registro`, `/mi-cuenta`, `/pedidos`, `/admin`              | SSR, `noindex`                                    |

Categorías: `/categoria/zapatillas`, `/categoria/indumentaria` y subcategorías (`/categoria/remeras`, `/categoria/buzos`, …).
Las URLs viejas `/productos?categoria=…` redirigen con 301.

## Idiomas y monedas

- Idiomas preparados: `es-AR` (activo) y `pt-BR` (textos de interfaz en `src/i18n/messages/`). Ver `src/i18n/config.ts`.
- Precios en unidades menores (centavos) por moneda: `ARS`, `BRL`, `USD` (`src/types/money.ts`, `src/lib/money.ts`).
  Sin precio cargado se muestra "Consultar precio".

## Variables de entorno

Copiar `.env.example` a `.env`. Los secretos (service role de Supabase, access token de
Mercado Pago, API key de Resend) nunca van en variables `VITE_*`: solo en Edge Functions o
en las variables de entorno de Vercel.

## Roadmap

Ver [docs/ROADMAP.md](docs/ROADMAP.md).
