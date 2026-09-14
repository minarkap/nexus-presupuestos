import type { Catalog } from './catalog-types'
import type { ServiceId, ServiceRef } from './types'

/**
 * La puerta entre «lo que la base de datos ha devuelto» y «un catálogo».
 *
 * Es total: NUNCA lanza. Devuelve el catálogo o la razón por la que no lo es, y quien llama decide
 * replegarse. Lanzar aquí obligaría a envolver cada llamada en un try, y un try alrededor de una
 * validación es donde se cuelan los repliegues silenciosos.
 *
 * **Rechaza entero, nunca a medias** (CA-07). Un catálogo medio adoptado es peor que ninguno:
 * mezclaría precios de dos ediciones sin que nada lo delate.
 *
 * Los límites son los del plan §0, decididos en `clarify` C-2. Están puestos para atrapar el
 * disparate —un multiplicador de 50—, no para afinar: una frontera apretada rechazaría mañana un
 * cambio comercial legítimo, y eso convertiría la validación en un estorbo que alguien acabaría
 * quitando.
 */

export type CatalogValidation =
  | { readonly ok: true; readonly catalog: Catalog }
  | { readonly ok: false; readonly reason: string }

/** Los seis del catálogo oficial 2026. Ni cinco ni siete (CA-12, constitution 4). */
const SERVICIOS_OBLIGATORIOS: readonly ServiceId[] = [
  'ai_opportunity_assessment',
  'ai_transformation_program',
  'ai_executive_advisory',
  'cyber_resilience_assessment',
  'esg_strategy_compliance',
  'custom_ai_solutions',
]

const CLAVES_TAMAÑO = ['<50', '50-249', '250-999', '>=1000'] as const
const CLAVES_MADUREZ = ['inicial', 'en_desarrollo', 'avanzada'] as const
const CLAVES_URGENCIA = ['<3m', '3-6m', '>6m'] as const
const CLAVES_PATROCINIO = ['si', 'en_proceso', 'no'] as const
const CLAVES_PRESUPUESTO = ['asignado', 'previsto', 'sin'] as const

const UNIDADES = ['total', 'month'] as const

/** Un multiplicador de 0 anularía el precio en silencio; uno de 50 lo dispararía. */
const FACTOR_MÁX = 3
const PUNTOS_MÍN = -10
const PUNTOS_MÁX = 10

class Rechazo extends Error {}

function rechazar(razón: string): never {
  throw new Rechazo(razón)
}

/**
 * Convierte a número lo que la API REST pueda haber mandado como cadena.
 *
 * Postgres serializa `numeric` como cadena para no perder precisión, y una multiplicación sobre una
 * cadena en JavaScript no falla: concatena o da `NaN`, ambas en silencio. Es el riesgo R-2 del plan,
 * y este es el único sitio donde se atrapa.
 */
function num(valor: unknown, dónde: string): number {
  const n = typeof valor === 'string' ? Number(valor.trim()) : valor
  if (typeof n !== 'number' || !Number.isFinite(n)) {
    rechazar(`${dónde}: se esperaba un número y llegó ${JSON.stringify(valor)}`)
  }
  return n
}

function entero(valor: unknown, dónde: string): number {
  const n = num(valor, dónde)
  if (!Number.isInteger(n)) rechazar(`${dónde}: se esperaba un entero y llegó ${n}`)
  return n
}

function objeto(valor: unknown, dónde: string): Record<string, unknown> {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    rechazar(`${dónde}: se esperaba un objeto`)
  }
  return valor as Record<string, unknown>
}

/** Un bloque completo: todas sus claves, ninguna de más, cada valor dentro de sus límites. */
function bloque<K extends string>(
  crudo: unknown,
  claves: readonly K[],
  dónde: string,
  valida: (valor: unknown, dónde: string) => number,
): Record<K, number> {
  const obj = objeto(crudo, dónde)
  const salida = {} as Record<K, number>

  for (const clave of claves) {
    if (!(clave in obj)) rechazar(`${dónde}: falta la clave «${clave}»`)
    salida[clave] = valida(obj[clave], `${dónde}.${clave}`)
  }

  const sobrantes = Object.keys(obj).filter((k) => !(claves as readonly string[]).includes(k))
  if (sobrantes.length > 0) rechazar(`${dónde}: claves que no existen — ${sobrantes.join(', ')}`)

  return salida
}

function factor(valor: unknown, dónde: string): number {
  const n = num(valor, dónde)
  if (n <= 0) rechazar(`${dónde}: un multiplicador de ${n} anularía o invertiría el precio`)
  if (n > FACTOR_MÁX) rechazar(`${dónde}: multiplicador de ${n}, por encima del máximo ${FACTOR_MÁX}`)
  return n
}

function puntos(valor: unknown, dónde: string): number {
  const n = entero(valor, dónde)
  if (n < PUNTOS_MÍN || n > PUNTOS_MÁX) {
    rechazar(`${dónde}: ${n} puntos, fuera del rango [${PUNTOS_MÍN}, ${PUNTOS_MÁX}]`)
  }
  return n
}

function servicio(crudo: unknown, id: ServiceId): ServiceRef {
  const dónde = `services.${id}`
  const obj = objeto(crudo, dónde)

  if (obj.id !== id) rechazar(`${dónde}: el identificador de dentro dice «${String(obj.id)}»`)

  const label = obj.label
  if (typeof label !== 'string' || label.trim() === '') rechazar(`${dónde}: etiqueta vacía`)

  const unit = obj.unit
  if (!(UNIDADES as readonly unknown[]).includes(unit)) {
    rechazar(`${dónde}: unidad «${String(unit)}» — sólo existen ${UNIDADES.join(' y ')}`)
  }

  if (typeof obj.openEnded !== 'boolean') rechazar(`${dónde}: openEnded no es un sí/no`)
  const openEnded = obj.openEnded

  const officialMin = entero(obj.officialMin, `${dónde}.officialMin`)
  if (officialMin < 0) rechazar(`${dónde}.officialMin: ${officialMin} es negativo`)

  // El techo nulo es un dato VÁLIDO en rango abierto, no un dato incompleto. Y al revés: un rango
  // abierto con techo publicado contradice al catálogo comercial, que dice que ese techo «se cierra
  // en llamada». Las dos direcciones se comprueban porque las dos son errores distintos.
  if (obj.officialMax === null || obj.officialMax === undefined) {
    if (!openEnded) {
      rechazar(`${dónde}: techo nulo sin ser un servicio de rango abierto`)
    }
    return { id, label, officialMin, officialMax: null, unit: unit as ServiceRef['unit'], openEnded }
  }

  if (openEnded) rechazar(`${dónde}: rango abierto CON techo publicado (${String(obj.officialMax)})`)

  const officialMax = entero(obj.officialMax, `${dónde}.officialMax`)
  if (officialMax < 0) rechazar(`${dónde}.officialMax: ${officialMax} es negativo`)
  if (officialMin > officialMax) {
    rechazar(`${dónde}: el mínimo (${officialMin}) está por encima del máximo (${officialMax})`)
  }

  return { id, label, officialMin, officialMax, unit: unit as ServiceRef['unit'], openEnded }
}

export function validateCatalog(input: unknown): CatalogValidation {
  try {
    const raíz = objeto(input, 'catálogo')

    // ── Servicios: los seis, ni uno menos ni uno más ────────────────────────────────────────
    const serviciosCrudos = objeto(raíz.services, 'services')
    const servicios = {} as Record<ServiceId, ServiceRef>

    for (const id of SERVICIOS_OBLIGATORIOS) {
      if (!(id in serviciosCrudos)) rechazar(`services: falta el servicio «${id}»`)
      servicios[id] = servicio(serviciosCrudos[id], id)
    }
    const desconocidos = Object.keys(serviciosCrudos).filter(
      (k) => !(SERVICIOS_OBLIGATORIOS as readonly string[]).includes(k),
    )
    if (desconocidos.length > 0) {
      // Constitution 4: lo que no está catalogado deriva a llamada de alcance. Un servicio de más
      // en la base de datos significaría estimar algo que nadie aprobó.
      rechazar(`services: servicios fuera del catálogo oficial — ${desconocidos.join(', ')}`)
    }

    // ── Factores y puntos ───────────────────────────────────────────────────────────────────
    const sizeFactor = bloque(raíz.sizeFactor, CLAVES_TAMAÑO, 'sizeFactor', factor)
    const maturityFactor = bloque(raíz.maturityFactor, CLAVES_MADUREZ, 'maturityFactor', factor)
    const timingFactor = bloque(raíz.timingFactor, CLAVES_URGENCIA, 'timingFactor', factor)

    const sponsorPoints = bloque(raíz.sponsorPoints, CLAVES_PATROCINIO, 'sponsorPoints', puntos)
    const budgetPoints = bloque(raíz.budgetPoints, CLAVES_PRESUPUESTO, 'budgetPoints', puntos)
    const timingPoints = bloque(raíz.timingPoints, CLAVES_URGENCIA, 'timingPoints', puntos)
    const maturityPoints = bloque(raíz.maturityPoints, CLAVES_MADUREZ, 'maturityPoints', puntos)
    const sizePoints = bloque(raíz.sizePoints, CLAVES_TAMAÑO, 'sizePoints', puntos)

    // ── Ajustes sueltos ─────────────────────────────────────────────────────────────────────
    const maxScore = entero(raíz.maxScore, 'maxScore')
    if (maxScore <= 0) rechazar(`maxScore: ${maxScore} no deja margen a ninguna puntuación`)

    const threshold = entero(raíz.threshold, 'threshold')
    if (threshold < 0 || threshold > maxScore) {
      rechazar(`threshold: ${threshold} fuera de [0, ${maxScore}] — nadie cualificaría jamás`)
    }

    const margin = num(raíz.margin, 'margin')
    if (margin < 0 || margin >= 1) rechazar(`margin: ${margin} fuera de [0, 1)`)

    const roundingStep = entero(raíz.roundingStep, 'roundingStep')
    if (roundingStep <= 0) rechazar(`roundingStep: ${roundingStep} no es un paso de redondeo`)

    const expiresOn = raíz.expiresOn
    if (typeof expiresOn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(expiresOn)) {
      rechazar(`expiresOn: se esperaba una fecha AAAA-MM-DD y llegó ${JSON.stringify(expiresOn)}`)
    }

    return {
      ok: true,
      catalog: {
        services: servicios,
        sizeFactor,
        maturityFactor,
        timingFactor,
        sponsorPoints,
        budgetPoints,
        timingPoints,
        maturityPoints,
        sizePoints,
        threshold,
        maxScore,
        margin,
        roundingStep,
        expiresOn,
      },
    }
  } catch (e) {
    if (e instanceof Rechazo) return { ok: false, reason: e.message }
    // Nada debería llegar aquí, pero «nada debería» no es una garantía y este módulo promete no
    // lanzar NUNCA. Un fallo inesperado se convierte en un rechazo, no en una excepción que suba.
    return { ok: false, reason: `catálogo ilegible: ${e instanceof Error ? e.message : String(e)}` }
  }
}
