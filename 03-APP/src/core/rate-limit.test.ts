import { describe, it, expect } from 'vitest'
import { RATE_LIMIT, excedeElTope, fingerprintFor, normalizeIp } from './rate-limit'

describe('El tope vive en un único punto de configuración (CA-L7)', () => {
  it('declara las dos ventanas y nada más', () => {
    expect(RATE_LIMIT).toEqual({ perHour: 5, perDay: 15 })
  })
})

/**
 * Los contadores llegan de la base de datos y YA INCLUYEN el intento en curso: la función que los
 * produce inserta y cuenta en la misma transacción. Por eso el corte es «más que el tope», no «tanto
 * como el tope» — con cinco permitidos por hora, el quinto envío llega con `enHora = 5`.
 */
describe('La decisión del tope — frontera por frontera', () => {
  it('el primer envío de un origen pasa', () => {
    expect(excedeElTope({ enHora: 1, enDia: 1 })).toBe(false)
  })

  it('justo EN el tope de la hora todavía pasa: el quinto envío es legítimo', () => {
    expect(excedeElTope({ enHora: RATE_LIMIT.perHour, enDia: 5 })).toBe(false)
  })

  it('uno por encima del tope de la hora, no pasa', () => {
    expect(excedeElTope({ enHora: RATE_LIMIT.perHour + 1, enDia: 6 })).toBe(true)
  })

  it('el tope diario corta aunque la hora esté limpia', () => {
    expect(excedeElTope({ enHora: 1, enDia: RATE_LIMIT.perDay + 1 })).toBe(true)
  })

  it('justo EN el tope diario todavía pasa', () => {
    expect(excedeElTope({ enHora: 1, enDia: RATE_LIMIT.perDay })).toBe(false)
  })

  it('contadores absurdos se tratan como pasados de tope, no se ignoran', () => {
    expect(excedeElTope({ enHora: 9999, enDia: 9999 })).toBe(true)
  })
})

describe('Normalización de la dirección — IPv6 no da cupo infinito', () => {
  /**
   * Un atacante con un bloque /64 enrutado —lo trae cualquier servidor barato— puede usar una
   * dirección IPv6 distinta en cada petición. Sin recortar al prefijo, cada una sería «un origen
   * nuevo» y el tope no existiría para él.
   */
  it('recorta una IPv6 a su prefijo /64: todo el bloque comparte cupo', () => {
    expect(normalizeIp('2001:db8:1:2:aaaa:bbbb:cccc:dddd'))
      .toBe(normalizeIp('2001:db8:1:2:9999:8888:7777:6666'))
  })

  it('dos bloques /64 distintos NO comparten cupo', () => {
    expect(normalizeIp('2001:db8:1:2::1')).not.toBe(normalizeIp('2001:db8:1:3::1'))
  })

  it('una IPv4 se deja intacta: ahí cada dirección ya es un origen', () => {
    expect(normalizeIp('81.203.4.7')).toBe('81.203.4.7')
  })

  it('una IPv6 comprimida también se recorta', () => {
    expect(normalizeIp('2001:db8::1')).toBe(normalizeIp('2001:db8:0:0:ffff::2'))
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
