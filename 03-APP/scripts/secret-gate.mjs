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

/** Variables cuyo VALOR no puede aparecer jamás en el cliente. */
const VALORES_PROHIBIDOS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_URL',
  'RESEND_API_KEY',
  'GOOGLE_SERVICE_ACCOUNT_JSON',
  'GOOGLE_SHEET_ID',
]

/** Cadenas que no pueden aparecer literalmente, haya o no credenciales cargadas ahora mismo. */
const CADENAS_PROHIBIDAS = [
  'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'service_role',
]

function ficheros(dir) {
  const salida = []
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada)
    if (statSync(ruta).isDirectory()) salida.push(...ficheros(ruta))
    else if (/\.(js|mjs|css|json|txt)$/.test(entrada)) salida.push(ruta)
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

if (hallazgos.length > 0) {
  console.error('✗ LA BASE DE DATOS QUEDARÍA EXPUESTA:')
  for (const h of hallazgos) console.error(`   - ${h}`)
  process.exit(1)
}

console.log('✓ Ninguna credencial del registro viaja al navegador.')
