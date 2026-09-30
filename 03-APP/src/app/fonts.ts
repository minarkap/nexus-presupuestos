import localFont from 'next/font/local'

/**
 * Las tres familias del design system, servidas desde el propio repositorio (sin CLS, sin petición
 * externa, y sin que la compilación dependa de nadie).
 *
 * Hasta el 2026-09-30 salían de `next/font/google`, que las descarga de Google EN CADA COMPILACIÓN.
 * Ese día Turbopack empezó a fallar con Sora («next/font/google queries have exactly one entry»):
 * cuando Google Fonts devuelve la dirección de un fichero con `&` dentro, Turbopack la lee como varias
 * y aborta. Fallaba también con el código de `main`, así que no se podía publicar ninguna versión
 * del sitio, y la causa estaba fuera del proyecto (S-0042).
 *
 * Los ficheros son los mismos que servía Google: subconjunto `latin`, el único que se precargaba
 * (`subsets: ['latin']`) y el que cubre todo el texto del sitio, € y comillas latinas incluidos.
 * Sora e Inter son variables: un fichero para todos los pesos. IBM Plex Mono no lo es, así que lleva
 * uno por peso. Licencia SIL OFL 1.1, en `fonts/OFL-*.txt`.
 */
export const sora = localFont({
  src: './fonts/sora-latin.woff2',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-display',
})

export const inter = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-body',
})

export const plexMono = localFont({
  src: [
    { path: './fonts/plex-mono-400-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/plex-mono-500-latin.woff2', weight: '500', style: 'normal' },
    { path: './fonts/plex-mono-600-latin.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-mono',
})
