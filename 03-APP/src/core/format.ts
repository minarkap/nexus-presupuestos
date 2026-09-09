import type { PriceRange } from './types'

function formatEuros(amount: number): string {
  return `${amount.toLocaleString('es-ES')} €`
}

/**
 * Formato ÚNICO de un rango (constitution 5, C-08): lo usa la pantalla de resultado y la página de
 * servicios, así el rango publicado y el calculado se escriben con la misma mano.
 */
export function formatRange(price: PriceRange): string {
  const sufijo = price.unit === 'month' ? ' / mes' : ''
  if (price.high === null) {
    return `Desde ${formatEuros(price.low)}${sufijo}, con el techo a confirmar en llamada de alcance`
  }
  return `${price.low.toLocaleString('es-ES')} – ${formatEuros(price.high)}${sufijo}`
}
