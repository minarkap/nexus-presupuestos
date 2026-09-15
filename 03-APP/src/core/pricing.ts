import type { Catalog } from './catalog-types'
import type { Maturity, PriceRange, ServiceRef, Size, Timing } from './types'

/** Ancla un valor dentro del rango oficial. En rango abierto sólo existe el suelo. */
function anchor(value: number, service: ServiceRef): number {
  if (value < service.officialMin) return service.officialMin
  if (service.officialMax !== null && value > service.officialMax) return service.officialMax
  return value
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step
}

/**
 * Los cuatro pasos deterministas del método de estimación.
 *
 *  1. Punto de partida: punto medio del rango oficial; en rango abierto, el propio mínimo.
 *  2. Factores acumulativos: como mucho uno de cada bloque.
 *  3. Anclaje al rango oficial.
 *  4. ±12 %, redondeo al millar, y ANCLAJE OTRA VEZ.
 *
 * El anclaje ocurre DOS veces (constitution 7). Implementar sólo el primero publica cifras
 * fuera de catálogo, que es un fallo y no una tolerancia.
 *
 * El catálogo entra POR PARÁMETRO desde la spec `catalogo-en-supabase` (decisión `S-0034`): esta
 * función no sabe de dónde salen los factores y no puede averiguarlo. Sigue siendo síncrona, pura y
 * determinista — dos llamadas con el mismo catálogo dan el mismo resultado, siempre.
 */
export function priceService(
  catalog: Catalog,
  service: ServiceRef,
  size: Size,
  maturity: Maturity,
  timing: Timing,
): PriceRange {
  // Paso 1
  const start = service.openEnded
    ? service.officialMin
    : (service.officialMin + (service.officialMax as number)) / 2

  // Paso 2
  const adjusted =
    start * catalog.sizeFactor[size] * catalog.maturityFactor[maturity] * catalog.timingFactor[timing]

  // Paso 3 — primer anclaje
  const anchored = anchor(adjusted, service)

  // Paso 4 — margen, redondeo y segundo anclaje
  const { margin, roundingStep } = catalog
  const low = anchor(roundToStep(anchored * (1 - margin), roundingStep), service)
  const high = service.openEnded
    ? null
    : anchor(roundToStep(anchored * (1 + margin), roundingStep), service)

  return { low, high, unit: service.unit }
}
