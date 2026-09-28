import type { Messages } from './es-AR'

type DeepPartial<T> = { [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]> }

/**
 * Textos en portugués. Puede quedar incompleto: lo que falte se muestra en español.
 * El contenido de las páginas y del catálogo todavía no está traducido.
 */
export const ptBR: DeepPartial<Messages> = {
  nav: {
    home: 'início',
    sneakers: 'tênis',
    clothing: 'roupas',
    perfumes: 'perfumes',
    accessories: 'acessórios',
    mainLabel: 'Principal',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    clothingCategories: 'Ver categorias de roupas',
  },
  header: {
    homeLink: 'Blitocuenca — início',
    account: 'Minha conta',
    cart: 'Ver carrinho',
    search: 'Buscar',
    closeSearch: 'Fechar busca',
    searchPlaceholder: 'Buscar marca...',
    searchLabel: 'Buscar marca',
  },
  cart: {
    title: 'Seu carrinho',
    close: 'Fechar carrinho',
    empty: 'Você ainda não adicionou nada.',
    remove: 'Remover',
    view: 'Ver carrinho',
    keepShopping: 'Continuar comprando',
  },
  hero: {
    label: 'Produtos em destaque',
    previous: 'Produto anterior',
    next: 'Próximo produto',
    ask: 'Consultar',
    buy: 'Comprar',
    askConfirmation: 'Pronto! Entraremos em contato em breve.',
  },
  brands: {
    title: 'COMPRAR POR MARCA',
    noResults: 'Não encontramos marcas para',
  },
  product: {
    askPrice: 'Consultar preço',
    buy: 'Comprar',
    outOfStock: 'Sem estoque',
    addFavorite: 'Adicionar aos favoritos',
    removeFavorite: 'Remover dos favoritos',
  },
}
