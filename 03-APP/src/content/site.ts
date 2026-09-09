/** La ÚNICA fuente del nombre de marca, el claim y el contacto (constitution 30). */
export const siteConfig = {
  name: 'Nexus Consulting',
  essence: 'El punto donde todo conecta.',
  claim: 'Tecnología que conecta. Soluciones que avanzan.',
  tagline: 'Software, IA y automatización para empresas que quieren operar mejor.',
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexus.ad'),
  locale: 'es_ES',
  contact: {
    email: 'hola@nexus.ad',
    phone: '+376 123 456',
    address: 'Andorra la Vella, Andorra',
    country: 'AD',
  },
} as const

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString().replace(/\/$/, path === '/' ? '/' : '')
}
