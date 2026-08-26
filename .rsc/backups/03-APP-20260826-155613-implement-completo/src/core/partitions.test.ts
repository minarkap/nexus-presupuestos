import { describe, it, expect } from 'vitest'
import {
  SIZE_OPTIONS,
  TIMING_OPTIONS,
  SPONSOR_OPTIONS,
  sizeBucketFor,
  timingBucketFor,
} from './options'

/** CA-23: ningún valor pertenece a dos opciones a la vez. */
describe('Partición de tramos — sin solape posible (CA-23)', () => {
  it('toda plantilla de 0 a 5.000 cae en exactamente un tramo de tamaño', () => {
    const válidos = new Set(SIZE_OPTIONS.map((o) => o.value))
    for (let n = 0; n <= 5000; n += 1) {
      expect(válidos.has(sizeBucketFor(n))).toBe(true)
    }
  })

  it('todo plazo de 0 a 36 meses cae en exactamente un tramo', () => {
    const válidos = new Set(TIMING_OPTIONS.map((o) => o.value))
    for (let m = 0; m <= 36; m += 1) {
      expect(válidos.has(timingBucketFor(m))).toBe(true)
    }
  })

  it('los cuatro tramos de tamaño son alcanzables y ninguno queda muerto', () => {
    const vistos = new Set<string>()
    for (let n = 0; n <= 5000; n += 1) vistos.add(sizeBucketFor(n))
    expect(vistos.size).toBe(SIZE_OPTIONS.length)
  })

  it('las opciones no repiten etiqueta', () => {
    for (const grupo of [SIZE_OPTIONS, TIMING_OPTIONS, SPONSOR_OPTIONS]) {
      const etiquetas = grupo.map((o) => o.label)
      expect(new Set(etiquetas).size).toBe(etiquetas.length)
    }
  })
})

describe('Los bordes exactos que antes estaban en dos sitios', () => {
  it('250 empleados exactos → «De 250 a 999» (CA-21)', () => {
    expect(sizeBucketFor(250)).toBe('250-999')
    expect(sizeBucketFor(249)).toBe('50-249')
  })

  it('1.000 empleados exactos → «1.000 o más»', () => {
    expect(sizeBucketFor(1000)).toBe('>=1000')
    expect(sizeBucketFor(999)).toBe('250-999')
  })

  it('6 meses exactos → «De 3 a 6 meses» (CA-22)', () => {
    expect(timingBucketFor(6)).toBe('3-6m')
    expect(timingBucketFor(7)).toBe('>6m')
  })

  it('3 meses exactos → «De 3 a 6 meses», no urgente', () => {
    expect(timingBucketFor(3)).toBe('3-6m')
    expect(timingBucketFor(2)).toBe('<3m')
  })
})
