import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readToken } from '@/design/tokens'
import { siteConfig } from '@/content/site'

export const alt = 'Nexus Consulting. Tecnología que conecta. Soluciones que avanzan.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const night = readToken('--nx-night')
  const white = readToken('--nx-white')
  const cyan = readToken('--nx-cyan')
  const muted = readToken('--nx-technical')
  const logo = await readFile(join(process.cwd(), 'public/brand/nexus-isotype.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: 72, background: night, color: white, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={logoSrc} width={72} height={72} alt="" style={{ borderRadius: 12 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, letterSpacing: 8, fontWeight: 600 }}>NEXUS</div>
            <div style={{ fontSize: 16, letterSpacing: 10, color: muted }}>CONSULTING</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}><span>El punto donde todo</span><span style={{ color: cyan }}>conecta.</span></div>
          <div style={{ fontSize: 30, color: muted }}>{siteConfig.claim}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: muted }}>
          <span>{siteConfig.tagline}</span>
          <span>nexus.ad</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
