import { describe, it, expect } from 'vitest'
import { RATE_LIMIT, isOverLimit, fingerprintFor } from './rate-limit'

/** Marcas de tiempo a N minutos antes de `ahora`, en el formato que devuelve la base de datos. */
const ahora = new Date('2026-09-14T12:00:00.000Z')
const haceMinutos = (...ns: number[]) =>
  ns.map((n) => new Date(ahora.getTime() - n * 60_000).toISOString())

describe('El tope vive en un único punto de configuración (CA-L7)', () => {
  it('declara las dos ventanas y nada más', () => {
    expect(RATE_LIMIT).toEqual({ perHour: 5, perDay: 15 })
  })
})

describe('La decisión del tope — frontera por frontera', () => {
  it('sin intentos previos, pasa', () => {
    expect(isOverLimit([], ahora)).toBe(false)
  })

  it('justo EN el tope de la hora todavía pasa: el quinto envío es legítimo', () => {
    expect(isOverLimit(haceMinutos(1, 2, 3, 4), ahora)).toBe(false)
  })

  it('uno por encima del tope de la hora, no pasa', () => {
    expect(isOverLimit(haceMinutos(1, 2, 3, 4, 5), ahora)).toBe(true)
  })

  it('los intentos de hace más de una hora no cuentan para la ventana horaria', () => {
    expect(isOverLimit(haceMinutos(61, 62, 63, 64, 65), ahora)).toBe(false)
  })

  it('un intento de hace exactamente una hora ya está fuera de la ventana', () => {
    expect(isOverLimit(haceMinutos(60, 1, 2, 3, 4), ahora)).toBe(false)
  })

  it('el tope diario corta aunque la hora esté limpia', () => {
    // Quince repartidos a lo largo del día, ninguno en la última hora.
    const repartidos = haceMinutos(...Array.from({ length: 15 }, (_, i) => 70 + i * 60))
    expect(isOverLimit(repartidos, ahora)).toBe(true)
  })

  it('catorce en el día todavía pasan: el quince es el que sobra', () => {
    const repartidos = haceMinutos(...Array.from({ length: 14 }, (_, i) => 70 + i * 60))
    expect(isOverLimit(repartidos, ahora)).toBe(false)
  })

  it('lo de hace más de un día no cuenta para nada', () => {
    const viejos = haceMinutos(...Array.from({ length: 40 }, (_, i) => 1500 + i))
    expect(isOverLimit(viejos, ahora)).toBe(false)
  })

  it('una marca de tiempo ilegible se ignora en vez de romper el envío', () => {
    expect(isOverLimit(['no-es-una-fecha', ...haceMinutos(1, 2)], ahora)).toBe(false)
  })
})

describe('La huella — la dirección no se guarda, ni se puede deducir', () => {
  const SAL = 'sal-secreta-de-pruebas'

  it('la misma dirección con la misma sal da la misma huella', () => {
    expect(fingerprintFor('81.203.4.7', SAL)).toBe(fingerprintFor('81.203.4.7', SAL))
  })

  it('dos direcciones distintas dan huellas distintas', () => {
    expect(fingerprintFor('81.203.4.7', SAL)).not.toBe(fingerprintFor('81.203.4.8', SAL))
  })

  /**
   * El motivo de que haya un secreto y no un hash a secas: el espacio de direcciones IPv4 entero son
   * 4.300 millones de valores, que un portátil recorre en minutos. Sin secreto, la huella es
   * reversible y por tanto sigue siendo un dato personal en toda regla.
   */
  it('la misma dirección con OTRA sal da otra huella: sin el secreto no se puede revertir', () => {
    expect(fingerprintFor('81.203.4.7', SAL)).not.toBe(fingerprintFor('81.203.4.7', 'otra-sal'))
  })

  it('la huella NO contiene la dirección (CA-L5)', () => {
    expect(fingerprintFor('81.203.4.7', SAL)).not.toContain('81.203.4.7')
    expect(fingerprintFor('81.203.4.7', SAL)).not.toMatch(/\d+\.\d+\.\d+\.\d+/)
  })

  it('es corta y hexadecimal: no hace falta más para distinguir orígenes', () => {
    expect(fingerprintFor('81.203.4.7', SAL)).toMatch(/^[0-9a-f]{32}$/)
  })

  it('sin sal NO hay huella: el tope se desactiva en vez de fingir que protege', () => {
    expect(fingerprintFor('81.203.4.7', '')).toBeNull()
    expect(fingerprintFor('81.203.4.7', undefined)).toBeNull()
  })

  it('sin dirección tampoco hay huella', () => {
    expect(fingerprintFor('', SAL)).toBeNull()
    expect(fingerprintFor(undefined, SAL)).toBeNull()
  })
})
