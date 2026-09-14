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

/** Lo que devuelve la base de datos: los dos contadores, **incluyendo el intento en curso**. */
export interface AttemptCounts {
  readonly enHora: number
  readonly enDia: number
}

/**
 * ¿Este envío pasa del tope?
 *
 * Función pura sobre contadores, no sobre marcas de tiempo. El cambio no es cosmético: la primera
 * versión leía los intentos y luego anotaba, en dos viajes separados, y la revisión adversarial del
 * 2026-09-14 demostró que eso se atraviesa entero — treinta peticiones simultáneas leen todas el
 * mismo contador antes de que ninguna haya anotado, y las treinta se creen por debajo del tope.
 *
 * Ahora insertar y contar ocurren en la misma transacción dentro de la base de datos, y aquí sólo
 * queda decidir. Los contadores **incluyen el intento en curso**, así que el corte es «más que el
 * tope»: con cinco por hora permitidos, el quinto envío llega con `enHora = 5` y pasa.
 */
export function excedeElTope(counts: AttemptCounts): boolean {
  return counts.enHora > RATE_LIMIT.perHour || counts.enDia > RATE_LIMIT.perDay
}

/**
 * Recorta una dirección IPv6 a su prefijo `/64`; las IPv4 se dejan intactas.
 *
 * Sin esto, el tope no existe para quien tenga un bloque IPv6 enrutado —lo trae cualquier servidor
 * barato—: bastaría con usar una dirección distinta del mismo bloque en cada petición para que cada
 * una pareciera un origen nuevo. Un `/64` es la unidad que se asigna a un único cliente, así que
 * recortar ahí agrupa lo que de verdad es un mismo origen sin mezclar a desconocidos.
 */
export function normalizeIp(ip: string): string {
  if (!ip.includes(':')) return ip

  const [izquierda = '', derecha = ''] = ip.split('::', 2)
  const cabeza = izquierda.split(':').filter(Boolean)

  if (!ip.includes('::')) return cabeza.slice(0, 4).join(':')

  // Con `::` hay grupos de ceros implícitos: se reconstruyen sólo los que caben antes del cuarto.
  const cola = derecha.split(':').filter(Boolean)
  const ceros = Math.max(0, 8 - cabeza.length - cola.length)
  const completa = [...cabeza, ...Array(ceros).fill('0'), ...cola]
  return completa.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, '')).join(':')
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
  return createHmac('sha256', sal).update(normalizeIp(ip)).digest('hex').slice(0, 32)
}
