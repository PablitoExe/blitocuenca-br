# Roadmap

## Fase 1 — Base (completada)

React Router 7 (framework mode, SSR), TypeScript, layout responsive, rutas, stores, SEO base,
arquitectura i18n (es-AR / pt-BR) y modelo de precios multimoneda (ARS / BRL / USD).

## Fase 2 — Backend (próxima)

- [ ] Supabase: proyecto, tablas (`products`, `product_prices`, `categories`, `orders`, `order_items`, `profiles`) y RLS en todas.
- [ ] Generar tipos con `npm run db:types` y reemplazar `src/services/products.ts` (hoy mock) por consultas a Supabase.
- [ ] Supabase Storage para imágenes de productos.
- [ ] Supabase Auth: `/login`, `/registro`, rutas privadas (`/mi-cuenta`, `/pedidos`) y rol admin para `/admin`.
- [ ] Carrito: al hidratar, refrescar nombre/imagen/precio desde Supabase (hoy guarda una copia local).
- [ ] Checkout: crear la orden y la preferencia de Mercado Pago desde una Edge Function.
- [ ] Mercado Pago (Argentina) y Pix (Brasil) — cuentas y credenciales separadas por país.
- [ ] Webhooks de pago en Edge Functions (idempotentes, validando la firma).
- [ ] Emails transaccionales con Resend desde Edge Functions.

## Pendientes técnicos

- [ ] **Imágenes:** convertir los PNG (≈3,2 MB en total) a WebP/AVIF y servirlos al tamaño en que se muestran.
      `logo.png` pesa 879 KB y se muestra a 104×115.
- [ ] **Open Graph:** crear una imagen de 1200×630 y usarla como `image` por defecto en `components/seo/Seo.tsx`
      (hoy usa el logo).
- [ ] **i18n pt-BR:** decidir la estrategia (prefijo `/pt-BR/…`, dominio o cookie) e implementarla en
      `resolveLocale()` (`src/i18n/config.ts`). Después: traducir páginas y catálogo, y agregar `hreflang` y
      `og:locale:alternate`.
- [ ] **Deploy:** conectar el repo a Vercel, migrar el DNS de `blitocuenca.com.br` (Cloudflare, registros sin proxy)
      y quitar `public/CNAME`. Confirmar en el primer preview que `/perfumes` responde 200 sin redirección.
- [ ] **React Router 8:** evaluar la migración cuando `@vercel/react-router` sea compatible (hoy exige RR 7).
- [ ] Definir el bloque gris del final de la home (placeholder del diseño) y el footer.
- [ ] CI con GitHub Actions (`npm run check` + `npm run build`), GA4 y Search Console.
