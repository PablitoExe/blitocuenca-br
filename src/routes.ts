import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  layout('layouts/site-layout.tsx', [
    // Públicas (indexables)
    index('routes/home.tsx'),
    route('productos', 'routes/productos.tsx'),
    route('perfumes', 'routes/perfumes.tsx'),
    route('accesorios', 'routes/accesorios.tsx'),
    route('categoria/:slug', 'routes/categoria.tsx'),
    route('producto/:slug', 'routes/producto.tsx'),

    // Compra (noindex)
    route('carrito', 'routes/carrito.tsx'),
    route('checkout', 'routes/checkout.tsx'),

    // Cuenta (noindex; se protegen con Supabase Auth en la Fase 2)
    route('login', 'routes/login.tsx'),
    route('registro', 'routes/registro.tsx'),
    route('mi-cuenta', 'routes/mi-cuenta.tsx'),
    route('pedidos', 'routes/pedidos.tsx'),
    route('admin', 'routes/admin.tsx'),

    route('*', 'routes/not-found.tsx'),
  ]),

  // Recursos para buscadores
  route('robots.txt', 'routes/robots.ts'),
  route('sitemap.xml', 'routes/sitemap.ts'),
] satisfies RouteConfig
