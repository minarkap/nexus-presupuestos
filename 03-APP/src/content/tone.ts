/**
 * Léxico prohibido por la marca y la constitución (27, 36). Lo lee la prueba de tono sobre todo el
 * contenido y sobre el copy de core. Insensible a mayúsculas; las tildes se normalizan en la prueba.
 */
export const PROHIBIDAS: readonly RegExp[] = [
  /disruptiv/i, /revolucion/i, /\b360\b/, /siguiente nivel/i, /sin l[ií]mites/i, /m[aá]gic/i,
  /todopoderos/i, /soluci[oó]n definitiva/i, /futuro de los negocios/i, /game-?changer/i, /cutting-?edge/i,
  /seamless/i, /unlock/i, /supercharge/i, /elevate/i, /multiplica/i, /garantizamos/i, /plazas limitadas/i,
  /s[oó]lo por hoy/i, /descuento/i, /oferta especial/i, /en \d+ semanas/i, /en \d+ d[ií]as/i, /transformaci[oó]n digital 360/i,
]
