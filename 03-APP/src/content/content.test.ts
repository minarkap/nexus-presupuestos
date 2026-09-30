import { describe, it, expect } from 'vitest'
import { publicLines, publicServices } from './services.public'
import { SEED_CATALOG } from '@/core/catalog-seed'
import { formatRange } from '@/core/format'
import { faq, llamada } from './como-trabajamos'
import { privacidad } from './privacidad'
import { home } from './home'

describe('Servicios públicos = catálogo (CA-09, constitution 4, 8)', () => {
  const list = publicServices(SEED_CATALOG)
  it('publica seis servicios con cifra y el rango es exactamente el oficial formateado por el motor', () => {
    expect(list).toHaveLength(6)
    for (const s of list) {
      const ref = SEED_CATALOG.services[s.id]
      expect(s.rangeText).toBe(formatRange({ low: ref.officialMin, high: ref.officialMax, unit: ref.unit }))
      expect(s.includes.length).toBeGreaterThanOrEqual(3)
    }
  })
  it('no expone factores, puntos ni umbral', () => {
    const json = JSON.stringify(list)
    expect(json).not.toMatch(/factor|points|threshold|umbral|multiplier/i)
  })
  it('cuatro líneas, una sin rango y con motivo', () => {
    const lines = publicLines(SEED_CATALOG)
    expect(lines).toHaveLength(4)
    const sin = lines.find((l) => !l.priced)!
    expect(sin.key).toBe('estrategia_operaciones')
    expect(sin.reason).toMatch(/llamada de alcance/)
    expect(lines.filter((l) => l.priced).flatMap((l) => l.services)).toHaveLength(6)
  })
})

describe('FAQ y llamada de alcance (CA-10)', () => {
  it('hay al menos seis preguntas autocontenidas', () => {
    expect(faq.length).toBeGreaterThanOrEqual(6)
    for (const f of faq) expect(f.a).not.toMatch(/\b(anterior|arriba|como dec[ií]amos)\b/i)
  })
  it('la llamada de alcance es de 30 minutos, sin coste y sin informe', () => {
    const t = `${llamada.h2} ${llamada.p1} ${llamada.p2}`
    expect(t).toMatch(/[Tt]reinta minutos|30 minutos/)
    expect(t).toMatch(/sin coste/)
    expect(t).toMatch(/informe/)
  })
})

describe('Privacidad (CA-12)', () => {
  it('tiene las ocho secciones obligatorias y ningún dato registral inventado', () => {
    const ids = privacidad.sections.map((s) => s.id)
    expect(ids).toEqual(['responsable', 'datos', 'finalidad', 'base-legal', 'destinatarios', 'transferencias', 'conservacion', 'derechos'])
    expect(JSON.stringify(privacidad)).not.toMatch(/NRT|CIF|B-?\d{6,}|L-?\d{6}/)
  })
})

describe('Inicio (CA-07, CA-08)', () => {
  it('dice que el rango es orientativo y no un presupuesto', () => {
    expect(home.before.p).toMatch(/rango orientativo, no un presupuesto/)
  })
})

/**
 * La fase A de `agenda-y-preparacion-de-llamadas` da datos del lead a dos encargados nuevos: la
 * mensajería interna del equipo (Slack) y la herramienta de automatización (n8n). El aviso tiene que
 * decirlo ANTES de publicar esa fase (principio 23, CA-24). Y todavía NO cuenta la investigación de la
 * fase B: mientras no la cuente, nadie queda autorizado a ser investigado (CA-23).
 */
describe('Aviso de privacidad — lo que cambia con la agenda (CA-24, CA-23)', () => {
  const texto = (id: string) => privacidad.sections.find((s) => s.id === id)?.paragraphs.join(' ') ?? ''

  it('CA-24 · «Quién los recibe» nombra la mensajería interna y la automatización', () => {
    expect(texto('destinatarios')).toMatch(/mensajer[ií]a interna/i)
    expect(texto('destinatarios')).toMatch(/automatizaci[oó]n/i)
  })

  it('CA-24 · «Transferencias» las incluye entre los proveedores que pueden tratar fuera del EEE', () => {
    expect(texto('transferencias')).toMatch(/mensajer[ií]a interna/i)
    expect(texto('transferencias')).toMatch(/automatizaci[oó]n/i)
  })

  it('el enlace de reserva también llega por correo, y el aviso lo dice', () => {
    expect(texto('destinatarios')).toMatch(/recibir[aá]s en tu correo/i)
  })

  it('CA-23 · el aviso vigente NO cuenta la investigación de la fase B', () => {
    expect(privacidad.coversResearch).toBe(false)
    expect(JSON.stringify(privacidad.sections)).not.toMatch(/fuentes (abiertas|p[uú]blicas)/i)
  })
})
