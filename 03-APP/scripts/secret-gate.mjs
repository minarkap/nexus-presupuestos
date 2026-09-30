#!/usr/bin/env node
/**
 * Puerta de secretos — comprueba que la base de datos NO queda expuesta al navegador.
 *
 * Por qué existe: el registro de leads usa la clave `service_role` de Supabase, que se salta las
 * reglas de acceso de la tabla por diseño. Si esa clave —o la URL del proyecto— acabara en el
 * paquete que descarga el visitante, cualquiera podría leer y borrar la tabla entera de leads.
 *
 * No basta con «tener cuidado»: esto lo comprueba una máquina en cada `verify`, mirando lo que
 * REALMENTE se ha compilado para el cliente, no lo que el código parecía hacer.
 *
 * Falla si encuentra, en el paquete de cliente:
 *   1. el valor real de cualquier variable de entorno sensible,
 *   2. el nombre de esas variables (señal de que alguien las marcó `NEXT_PUBLIC_`),
 *   3. la huella de una clave de servicio de Supabase.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const CLIENTE = '.next/static'

/**
 * Carga los secretos reales antes de buscarlos.
 *
 * Sin esto la puerta tenía un agujero de diseño, encontrado en la revisión adversarial del
 * 2026-09-14: `next build` carga `.env.local` DENTRO de su propio proceso y no lo exporta al shell.
 * Como esta puerta corre en un `node` aparte, `process.env.SUPABASE_SERVICE_ROLE_KEY` era
 * `undefined` en local, la comprobación de VALOR —la única que detecta la clave real, no sólo su
 * nombre— se saltaba, y la puerta daba verde sin haber mirado.
 */
for (const fichero of ['.env.local', '.env.production.local', '.env']) {
  try {
    if (existsSync(fichero)) process.loadEnvFile(fichero)
  } catch {
    // Fichero ilegible o mal formado: no es motivo para abortar la puerta.
  }
}

/** Variables cuyo VALOR no puede aparecer jamás en el cliente. */
const VALORES_PROHIBIDOS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  // La sal del límite de frecuencia es tan secreta como una clave: con ella, las 4.300 millones de
  // direcciones IPv4 se recorren en minutos y la huella deja de proteger nada. Es justo lo que el
  // HMAC existe para impedir, así que filtrarla anula la medida entera (`CA-L5`).
  'RATE_LIMIT_SALT',
  'SUPABASE_URL',
  // La llave de lectura del catálogo es SECRETA, aunque solo pueda leer. Va bien decirlo porque es
  // contraintuitivo: no es una `sb_publishable_`, que sí puede viajar al navegador, sino una
  // `sb_secret_` atada a un rol que únicamente puede ejecutar `catalogo_vigente()`. Filtrarla
  // expondría multiplicadores, tabla de puntos y umbral — lo que el principio 8 prohíbe — aunque
  // nadie pudiera escribir con ella (spec `catalogo-en-supabase`, CA-14, CA-17).
  'SUPABASE_CATALOG_READ_KEY',
  'RESEND_API_KEY',
  'GOOGLE_SERVICE_ACCOUNT_JSON',
  'GOOGLE_SHEET_ID',
  // El aviso a n8n W1 (spec `agenda-y-preparacion-de-llamadas`). Con la URL y el secreto, cualquiera
  // publicaría en el canal del equipo en nombre de la web.
  'N8N_LEAD_WEBHOOK_URL',
  'N8N_LEAD_WEBHOOK_SECRET',
]

/**
 * Cadenas que no pueden aparecer literalmente, haya o no credenciales cargadas ahora mismo.
 *
 * `sb_secret_` es el prefijo de las claves de servidor NUEVAS de Supabase, que **no son JWT**. Sin
 * esta línea, el detector de más abajo —que decodifica JWT y mira el rol— no las vería: sólo las
 * cazaría la búsqueda por valor, y esa depende de tener el secreto cargado. Encontrado el 2026-09-14
 * al ver el panel real de Supabase, que ya emite `sb_secret_…` en vez del `service_role` de siempre.
 *
 * `sb_publishable_` NO está aquí a propósito: esa clave es pública por diseño y puede aparecer.
 */
const CADENAS_PROHIBIDAS = [
  'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_RATE_LIMIT_SALT',
  'RATE_LIMIT_SALT',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'service_role',
  'sb_secret_',
  'NEXT_PUBLIC_N8N_LEAD_WEBHOOK_URL',
  'NEXT_PUBLIC_N8N_LEAD_WEBHOOK_SECRET',
  'N8N_LEAD_WEBHOOK_SECRET',
]

function ficheros(dir) {
  const salida = []
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada)
    if (statSync(ruta).isDirectory()) salida.push(...ficheros(ruta))
    // `.map` incluido a propósito: hoy los mapas de cliente están desactivados, pero si alguien
    // activara `productionBrowserSourceMaps` mañana, la puerta seguiría mirando donde toca.
    else if (/\.(js|mjs|css|json|txt|map)$/.test(entrada)) salida.push(ruta)
  }
  return salida
}

if (!existsSync(CLIENTE)) {
  console.error(`✗ No existe ${CLIENTE}: compila antes de pasar la puerta de secretos.`)
  process.exit(1)
}

const hallazgos = []
const lista = ficheros(CLIENTE)

for (const fichero of lista) {
  const texto = readFileSync(fichero, 'utf8')

  for (const nombre of VALORES_PROHIBIDOS) {
    const valor = process.env[nombre]
    // Un valor muy corto daría falsos positivos; por debajo de 8 no se busca.
    if (valor && valor.length >= 8 && texto.includes(valor)) {
      hallazgos.push(`${fichero}: contiene el VALOR de ${nombre}`)
    }
  }

  for (const cadena of CADENAS_PROHIBIDAS) {
    if (texto.includes(cadena)) hallazgos.push(`${fichero}: contiene la cadena «${cadena}»`)
  }

  // Huella de una clave de servicio de Supabase: un JWT cuyo payload declara ese rol.
  for (const jwt of texto.match(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g) ?? []) {
    try {
      const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8'))
      if (payload.role && payload.role !== 'anon') {
        hallazgos.push(`${fichero}: contiene una clave con rol «${payload.role}»`)
      }
    } catch {
      // No era un JWT legible: no es un hallazgo.
    }
  }
}

console.log(`Puerta de secretos: ${lista.length} ficheros de cliente inspeccionados.`)

// Una puerta que no dice lo que NO ha podido comprobar miente por omisión. Si el secreto real no
// está cargado, la búsqueda por valor no se ha hecho, y eso hay que decirlo en voz alta aunque el
// resto pase — es la diferencia entre «está limpio» y «no he mirado».
const comprobados = VALORES_PROHIBIDOS.filter((n) => (process.env[n] ?? '').length >= 8)
const sinComprobar = VALORES_PROHIBIDOS.filter((n) => !comprobados.includes(n))

console.log(`   · Búsqueda por VALOR realizada para: ${comprobados.join(', ') || 'ninguna variable'}`)
if (sinComprobar.length > 0) {
  console.log(`   · SIN cargar, no buscadas por valor: ${sinComprobar.join(', ')}`)
  console.log('     (siguen cubiertas por los nombres prohibidos y por la huella de clave de servicio)')
}

if (hallazgos.length > 0) {
  console.error('✗ LA BASE DE DATOS QUEDARÍA EXPUESTA:')
  for (const h of hallazgos) console.error(`   - ${h}`)
  process.exit(1)
}

console.log('✓ Ninguna credencial del registro viaja al navegador.')
