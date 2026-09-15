/**
 * Genera el SQL que siembra el catálogo, LEYÉNDOLO de `catalog-seed.ts`.
 *
 * Existe para cerrar el riesgo R-1 del plan: teclear a mano los seis rangos, los diez
 * multiplicadores y las dieciséis puntuaciones es una invitación a que un dígito se caiga, y un
 * dígito caído aquí produce rangos equivocados con el membrete de Nexus. Copiarlos a mano habría
 * sido más rápido y exactamente igual de peligroso.
 *
 * Uso:  node scripts/seed-catalog.ts > /tmp/semilla.sql
 *       …y pegar en Supabase → SQL Editor. Se pega entero: los disparadores de completitud son
 *       DEFERRABLE y sólo cuadran al cerrar la transacción.
 */
import { SEED_CATALOG } from '../src/core/catalog-seed.ts'

const q = (s: string) => `'${s.replace(/'/g, "''")}'`
const nulo = (n: number | null) => (n === null ? 'null' : String(n))

const líneas: string[] = [
  '-- ══════════════════════════════════════════════════════════════════════════════',
  '-- SEMILLA DEL CATÁLOGO — GENERADO por scripts/seed-catalog.ts desde catalog-seed.ts.',
  '-- No editar a mano: si hay que cambiar un valor de partida, se cambia en la semilla',
  '-- del código y se regenera. Editar aquí rompería la única garantía que este fichero da.',
  '--',
  '-- Es idempotente: se puede ejecutar dos veces sin duplicar nada.',
  '-- ══════════════════════════════════════════════════════════════════════════════',
  '',
  'begin;',
  '',
  '-- Servicios',
]

for (const s of Object.values(SEED_CATALOG.services)) {
  líneas.push(
    `insert into public.catalogo_servicios (id, label, official_min, official_max, unit, open_ended)`,
    `  values (${q(s.id)}, ${q(s.label)}, ${s.officialMin}, ${nulo(s.officialMax)}, ${q(s.unit)}, ${s.openEnded})`,
    `  on conflict (id) do update set label = excluded.label, official_min = excluded.official_min,`,
    `    official_max = excluded.official_max, unit = excluded.unit, open_ended = excluded.open_ended;`,
  )
}

líneas.push('', '-- Multiplicadores')
const factores: [string, Readonly<Record<string, number>>][] = [
  ['size', SEED_CATALOG.sizeFactor],
  ['maturity', SEED_CATALOG.maturityFactor],
  ['timing', SEED_CATALOG.timingFactor],
]
for (const [bloque, tabla] of factores) {
  for (const [clave, valor] of Object.entries(tabla)) {
    líneas.push(
      `insert into public.catalogo_factores (bloque, clave, valor) values (${q(bloque)}, ${q(clave)}, ${valor})`,
      `  on conflict (bloque, clave) do update set valor = excluded.valor;`,
    )
  }
}

líneas.push('', '-- Tabla de puntos')
const puntos: [string, Readonly<Record<string, number>>][] = [
  ['sponsor', SEED_CATALOG.sponsorPoints],
  ['budget', SEED_CATALOG.budgetPoints],
  ['timing', SEED_CATALOG.timingPoints],
  ['maturity', SEED_CATALOG.maturityPoints],
  ['size', SEED_CATALOG.sizePoints],
]
for (const [bloque, tabla] of puntos) {
  for (const [clave, p] of Object.entries(tabla)) {
    líneas.push(
      `insert into public.catalogo_puntos (bloque, clave, puntos) values (${q(bloque)}, ${q(clave)}, ${p})`,
      `  on conflict (bloque, clave) do update set puntos = excluded.puntos;`,
    )
  }
}

líneas.push(
  '',
  '-- Ajustes (fila única)',
  `insert into public.catalogo_ajustes (id, threshold, max_score, margin, rounding_step, expires_on)`,
  `  values (true, ${SEED_CATALOG.threshold}, ${SEED_CATALOG.maxScore}, ${SEED_CATALOG.margin}, ${SEED_CATALOG.roundingStep}, ${q(SEED_CATALOG.expiresOn)})`,
  `  on conflict (id) do update set threshold = excluded.threshold, max_score = excluded.max_score,`,
  `    margin = excluded.margin, rounding_step = excluded.rounding_step, expires_on = excluded.expires_on;`,
  '',
  'commit;',
  '',
  '-- Comprobación: debe devolver el catálogo entero, y el caso de referencia debe seguir dando',
  '-- 28.000 – 35.000 € cuando lo verifique `npm run catalog-gate`.',
  'select jsonb_pretty(public.catalogo_vigente());',
)

console.log(líneas.join('\n'))
