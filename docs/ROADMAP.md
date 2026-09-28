# Roadmap

## Fase 1 — Base (completada)

React Router 7 (framework mode, SSR), TypeScript, layout responsive, rutas, stores, SEO base,
arquitectura i18n (es-AR / pt-BR) y modelo de precios multimoneda (ARS / BRL / USD).

## Fase 2 — Backend (en curso)

- [x] **2A — Diseño de base de datos: aprobado** ([docs/database/DISEÑO.md](database/DISEÑO.md)).
  - [x] Migración preparada: `supabase/migrations/0001_esquema_inicial.sql` (17 tablas, RLS en todas).
        Validada en un Postgres local desechable.
  - [ ] **Todavía NO aplicada** al proyecto de Supabase (próximo paso: vincular el proyecto, aplicar y
        generar tipos con `npm run db:types`).
  - [ ] Datos iniciales: depósitos AR/BR, categorías, marcas y el primer admin.
- [ ] **2B — Checkout transaccional** (siguiente fase): funciones RPC `create_order`, `confirm_order_payment`,
      `expire_pending_orders`, `cancel_order`, `refund_order`, `validate_coupon`, `claim_guest_orders`;
      reservas de stock, job de vencimiento y transiciones de estado (ver DISEÑO.md §11).
- [ ] **2C — Pagos**: Mercado Pago (AR) y Pix (BR), webhooks en Edge Functions, emails con Resend.

Integración con el frontend (después de aplicar la migración):

- [ ] Instalar `@supabase/supabase-js` y reemplazar `src/services/products.ts` (hoy mock) por consultas a Supabase.
- [ ] Stock en la tienda con `get_stock_status()` ("En stock" / "Últimas unidades" / "Sin stock" / "Por encargo").
- [ ] Supabase Storage (bucket `catalog`) para las imágenes de productos.
- [ ] Supabase Auth: `/login`, `/registro`, rutas privadas (`/mi-cuenta`, `/pedidos`) y rol admin para `/admin`.
- [ ] Carrito: al hidratar, refrescar nombre/imagen/precio desde Supabase (hoy guarda una copia local).

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
