'use client'

import { useEffect, useRef } from 'react'

/**
 * El motivo firma de la marca: nodos que se conectan. Canvas decorativo (aria-hidden).
 * No arranca con `prefers-reduced-motion: reduce`, se pausa fuera de pantalla, ≤ 60 nodos, dpr ≤ 2.
 * Los colores salen de las custom properties del DS leídas en tiempo de ejecución.
 */
export function NodeField({ density = 0.00008, className }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const styles = getComputedStyle(document.documentElement)
    const hexToRgb = (hex: string): string => {
      const h = hex.trim().replace('#', '')
      const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
      return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
    }
    const dotHex = styles.getPropertyValue('--nx-cyan-500')
    const linkHex = styles.getPropertyValue('--nx-blue-500')
    if (!dotHex || !linkHex) return // sin tokens no se dibuja: nunca un color a mano (constitution 31)
    const dot = hexToRgb(dotHex)
    const link = hexToRgb(linkHex)

    type Node = { x: number; y: number; vx: number; vy: number; r: number }
    let nodes: Node[] = []
    let w = 0
    let h = 0
    let raf = 0
    let running = false
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const parent = canvas!.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(16, Math.min(60, Math.floor(w * h * density)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.8,
      }))
    }

    function tick() {
      if (!running) return
      ctx!.clearRect(0, 0, w, h)
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]!
          const b = nodes[j]!
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 130) {
            ctx!.strokeStyle = `rgba(${link},${(1 - d / 130) * 0.28})`
            ctx!.lineWidth = 1
            ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx!.fillStyle = `rgba(${dot},0.9)`
        ctx!.shadowColor = `rgba(${dot},0.8)`
        ctx!.shadowBlur = 8
        ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx!.fill()
        ctx!.shadowBlur = 0
      }
      raf = requestAnimationFrame(tick)
    }

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick) } }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    resize()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) start()
        else stop()
      }
    })
    io.observe(canvas)
    window.addEventListener('resize', resize)
    return () => { stop(); io.disconnect(); window.removeEventListener('resize', resize) }
  }, [density])

  return <canvas ref={ref} aria-hidden="true" className={className} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
}
