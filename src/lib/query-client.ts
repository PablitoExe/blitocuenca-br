import { QueryClient } from '@tanstack/react-query'

/** Se crea uno por request en el servidor y uno solo en el navegador (ver root.tsx). */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Los loaders ya traen los datos en el SSR; evitamos volver a pedirlos al hidratar.
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  })
}
