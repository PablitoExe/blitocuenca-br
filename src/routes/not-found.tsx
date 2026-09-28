import { data } from 'react-router'

// Cualquier URL desconocida responde 404 y la muestra el ErrorBoundary del layout.
export function loader() {
  throw data(null, { status: 404 })
}

export default function NotFound() {
  return null
}
