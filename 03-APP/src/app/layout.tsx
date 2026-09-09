import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { inter, plexMono, sora } from './fonts'
import { siteConfig } from '@/content/site'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.tagline,
  openGraph: { type: 'website', siteName: siteConfig.name, locale: siteConfig.locale },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
