/** Textos de la interfaz en español (fuente de verdad: pt-BR puede quedar incompleto y cae acá). */
export const esAR = {
  nav: {
    home: 'inicio',
    sneakers: 'zapatillas',
    clothing: 'indumentaria',
    perfumes: 'perfumes',
    accessories: 'accesorios',
    mainLabel: 'Principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    clothingCategories: 'Ver categorías de indumentaria',
  },
  header: {
    homeLink: 'Blitocuenca — inicio',
    account: 'Mi cuenta',
    cart: 'Ver carrito',
    search: 'Buscar',
    closeSearch: 'Cerrar buscador',
    searchPlaceholder: 'Buscar marca...',
    searchLabel: 'Buscar marca',
  },
  cart: {
    title: 'Tu carrito',
    close: 'Cerrar carrito',
    empty: 'Todavía no agregaste nada.',
    remove: 'Quitar',
    view: 'Ver carrito',
    keepShopping: 'Seguir comprando',
  },
  hero: {
    label: 'Productos destacados',
    previous: 'Producto anterior',
    next: 'Producto siguiente',
    ask: 'Consultar',
    buy: 'Comprar',
    askConfirmation: '¡Listo! Te vamos a contactar a la brevedad.',
  },
  brands: {
    title: 'COMPRAR POR MARCA',
    noResults: 'No encontramos marcas para',
  },
  product: {
    askPrice: 'Consultar precio',
    buy: 'Comprar',
    outOfStock: 'Sin stock',
    addFavorite: 'Agregar a favoritos',
    removeFavorite: 'Quitar de favoritos',
  },
}

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> }
export type Messages = Widen<typeof esAR>
