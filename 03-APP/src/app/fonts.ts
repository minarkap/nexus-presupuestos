import { IBM_Plex_Mono, Inter, Sora } from 'next/font/google'

/** Las tres familias del design system, autoalojadas por next/font (sin CLS, sin petición externa). */
export const sora = Sora({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], display: 'swap', variable: '--font-display' })
export const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-body' })
export const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-mono' })
