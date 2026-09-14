import { createHmac } from 'node:crypto'

/**
 * El tope, en un único punto (`CA-L7`). Cambiarlo es tocar estos dos números y nada más.
 *
 * Los valores los eligió Jose el 2026-09-14 sobre este argumento: el hueco entre el uso legítimo
 * —una oficina de cuatro personas curioseando el estimador la misma tarde— y una inundación real
 * —cientos de envíos por minuto— es tan ancho que afinar el número no cambia el resultado. Más vale
 * holgado: **varias personas de una misma empresa comparten una sola dirección pública**, así que un
 * tope apretado bloquearía a compañeros entre sí.
 */
export const RATE_LIMIT = { perHour: 5, perDay: 15 } as const

const UNA_HORA = 60 * 60 * 1000
const UN_DÍA = 24 * UNA_HORA

/**
 * ¿Este envío pasa del tope?
 *
 * Función pura a propósito: recibe los intentos previos y el instante actual, sin reloj propio y sin
 * red, para poder probar las fronteras exactas —justo en el tope, uno por encima, la ventana que
 * acaba de caducar— que es donde viven los errores de un limitador.
 *
 * Una marca de tiempo ilegible se ignora en lugar de romper el envío: un dato corrupto en la tabla
 * de conteo no puede costarle un lead a nadie.
 */
export function isOverLimit(intentosPrevios: readonly string[], ahora: Date): boolean {
  const t = ahora.getTime()
  const marcas = intentosPrevios
    .map((s) => new Date(s).getTime())
    .filter((ms) => Number.isFinite(ms))

  const enLaÚltimaHora = marcas.filter((ms) => t - ms < UNA_HORA).length
  const enElÚltimoDía = marcas.filter((ms) => t - ms < UN_DÍA).length

  return enLaÚltimaHora >= RATE_LIMIT.perHour || enElÚltimoDía >= RATE_LIMIT.perDay
}

/**
 * La huella del origen: `HMAC-SHA256(sal, dirección)` truncado.
 *
 * **HMAC y no un hash a secas.** Una dirección IPv4 tiene 4.300 millones de valores posibles, que un
 * portátil recorre en minutos: un hash sin secreto es reversible, y por tanto sigue siendo un dato
 * personal en toda regla. Con un secreto que el atacante no tiene, deja de poder recorrerlos.
 *
 * Devuelve `null` —y el tope se desactiva— cuando falta la dirección o falta el secreto. Desactivar
 * es lo correcto: fingir que se protege sin secreto sería peor que no proteger, porque nadie lo
 * miraría. Quien lo llama registra a gritos esa ausencia.
 */
export function fingerprintFor(
  ip: string | undefined,
  sal: string | undefined,
): string | null {
  if (!ip || !sal) return null
  return createHmac('sha256', sal).update(ip).digest('hex').slice(0, 32)
}
