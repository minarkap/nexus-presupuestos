import 'server-only'
import { SERVICES } from '@/core/catalog'
import { formatRange } from '@/core/format'
import type { Challenge, ServiceId } from '@/core/types'

/**
 * Vista PÚBLICA del catálogo (constitution 4, 8, 33 · C-08). Expone solo lo que se puede publicar:
 * nombre, rango oficial y copy editorial. Factores, puntos y umbral no existen en este tipo.
 */
export interface PublicService {
  readonly id: ServiceId
  readonly line: Challenge
  readonly label: string
  readonly officialMin: number
  readonly officialMax: number | null
  readonly unit: 'total' | 'month'
  readonly openEnded: boolean
  readonly rangeText: string
  readonly forWhom: string
  readonly includes: readonly string[]
  readonly whenApplies: string
}

export interface PublicLine {
  readonly key: Challenge
  readonly name: string
  readonly short: string
  readonly forWhom: string
  readonly capabilities: readonly string[]
  readonly priced: boolean
  readonly reason?: string
  readonly services: readonly PublicService[]
}

const EDITORIAL: Record<ServiceId, { line: Challenge; forWhom: string; includes: readonly string[]; whenApplies: string }> = {
  ai_opportunity_assessment: {
    line: 'ia',
    forWhom: 'Para direcciones que quieren saber dónde tiene sentido la IA en su operativa antes de gastar en ella.',
    includes: ['Mapa de procesos, datos y herramientas tal como funcionan hoy', 'Casos de uso priorizados por impacto y viabilidad', 'Business case por caso, con supuestos escritos', 'Hoja de ruta a doce meses y criterio de compra, construcción o integración'],
    whenApplies: 'Cuando hay interés por la IA y todavía no hay un caso elegido. Rango orientativo; el alcance se acota en la llamada.',
  },
  ai_transformation_program: {
    line: 'ia',
    forWhom: 'Para organizaciones que ya han elegido sus casos y necesitan implantarlos con gobierno, integración y adopción real.',
    includes: ['Arquitectura de solución e integración con los sistemas que ya tenéis', 'Desarrollo e implantación de los casos priorizados', 'Gobierno del dato, seguridad y trazabilidad de las decisiones', 'Gestión del cambio y formación de los equipos que lo usarán'],
    whenApplies: 'Cuando el diagnóstico está hecho y toca construir. Rango orientativo según alcance, número de casos y sistemas a integrar.',
  },
  ai_executive_advisory: {
    line: 'ia',
    forWhom: 'Para comités de dirección que quieren criterio continuo, no un proyecto puntual.',
    includes: ['Revisión mensual de la cartera de iniciativas tecnológicas', 'Criterio para decidir qué comprar, qué construir y qué integrar', 'Lectura de riesgos regulatorios, de datos y de proveedor', 'Acompañamiento en las decisiones que llegan al comité'],
    whenApplies: 'Cuando la tecnología ya está en la agenda de dirección y falta alguien que la traduzca a decisiones. Cuota mensual orientativa.',
  },
  custom_ai_solutions: {
    line: 'ia',
    forWhom: 'Para empresas cuyo problema no cabe en software genérico y necesitan una pieza construida alrededor de su operativa.',
    includes: ['Asistentes internos y análisis documental conectados a vuestros datos', 'Automatizaciones inteligentes dentro de los flujos que ya usáis', 'Arneses de IA con control: qué puede hacer, qué no, y quién revisa', 'Integración con CRM, ERP, bases de datos y APIs existentes'],
    whenApplies: 'Cuando la solución es a medida. El rango es orientativo y abierto por arriba: el techo se cierra en la llamada de alcance.',
  },
  cyber_resilience_assessment: {
    line: 'ciberseguridad',
    forWhom: 'Para empresas que necesitan saber cómo de expuestas están y qué exige NIS2 o DORA de ellas.',
    includes: ['Diagnóstico de superficie, accesos e identidades', 'Plan Zero Trust con prioridades y responsables', 'Mapa de cumplimiento NIS2 y DORA con lo que falta', 'Ejercicio de detección y respuesta con el equipo'],
    whenApplies: 'Cuando la resiliencia ha dejado de ser un asunto solo del departamento de sistemas. Rango orientativo.',
  },
  esg_strategy_compliance: {
    line: 'esg',
    forWhom: 'Para direcciones que deben reportar bajo CSRD y quieren que el dato ESG sirva para decidir, no solo para cumplir.',
    includes: ['Análisis de doble materialidad con las partes interesadas', 'Mapa de datos ESG y cómo recogerlos sin trabajo manual', 'Informe CSRD y alineación con la taxonomía europea', 'Plan de eficiencia energética y economía circular con métricas'],
    whenApplies: 'Cuando el reporte es obligatorio y el dato está disperso. Rango orientativo.',
  },
}

const LINES: Record<Challenge, Omit<PublicLine, 'services' | 'key'>> = {
  ia: {
    name: 'IA y transformación digital',
    short: 'Del diagnóstico de oportunidades a la implantación con control, pasando por el acompañamiento a dirección.',
    forWhom: 'Empresas que quieren usar la IA con utilidad real y saber en qué orden.',
    capabilities: ['IA aplicada', 'Software a medida', 'Automatización de procesos', 'Integración de sistemas', 'Consultoría tecnológica'],
    priced: true,
  },
  ciberseguridad: {
    name: 'Ciberseguridad y resiliencia',
    short: 'Zero Trust, detección y respuesta, y el cumplimiento de NIS2 y DORA que ya tenéis encima.',
    forWhom: 'Empresas B2B con sistemas críticos y obligaciones regulatorias nuevas.',
    capabilities: ['Consultoría tecnológica', 'Integración de sistemas', 'Automatización de procesos'],
    priced: true,
  },
  esg: {
    name: 'Sostenibilidad y ESG',
    short: 'Estrategia ESG, CSRD, doble materialidad y taxonomía verde, con el dato conectado a la operativa.',
    forWhom: 'Direcciones con obligación de reporte y ganas de que el dato sirva para algo más.',
    capabilities: ['Consultoría tecnológica', 'Integración de sistemas', 'Software a medida'],
    priced: true,
  },
  estrategia_operaciones: {
    name: 'Estrategia y operaciones',
    short: 'Cadena de suministro, analítica predictiva, sinergias tecnológicas y gestión del cambio.',
    forWhom: 'Empresas con un problema que todavía no tiene forma y hace falta acotar antes de resolver.',
    capabilities: ['Consultoría tecnológica', 'Software a medida', 'IA aplicada'],
    priced: false,
    reason: 'Esta línea no tiene rango publicado a propósito. El alcance cambia tanto de un encargo a otro que cualquier cifra de partida sería inventada, y preferimos no dar un número antes de entender el problema. El camino es una llamada de alcance de 30 minutos, sin coste.',
  },
}

export function publicServices(): PublicService[] {
  return Object.values(SERVICES).map((s) => {
    const e = EDITORIAL[s.id]
    return {
      id: s.id,
      line: e.line,
      label: s.label,
      officialMin: s.officialMin,
      officialMax: s.officialMax,
      unit: s.unit,
      openEnded: s.openEnded,
      rangeText: formatRange({ low: s.officialMin, high: s.officialMax, unit: s.unit }),
      forWhom: e.forWhom,
      includes: e.includes,
      whenApplies: e.whenApplies,
    }
  })
}

const ORDER: readonly Challenge[] = ['ia', 'ciberseguridad', 'esg', 'estrategia_operaciones']

export function publicLines(): PublicLine[] {
  const services = publicServices()
  return ORDER.map((key) => ({ key, ...LINES[key], services: services.filter((s) => s.line === key) }))
}
