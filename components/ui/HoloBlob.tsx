'use client'

import { useEffect, useRef } from 'react'

export default function HoloBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function noise(x: number, y: number, t: number) {
      return Math.sin(x * 1.2 + t * 0.7) * Math.cos(y * 0.9 + t * 0.5)
           + Math.sin(x * 0.5 + y * 1.1 + t * 0.4) * 0.5
           + Math.cos(x * 1.8 - y * 0.6 + t * 0.9) * 0.3
    }

    function getBlobPoint(angle: number, t: number) {
      const n = noise(Math.cos(angle) * 2, Math.sin(angle) * 2, t * 0.012)
      return 1 + n * 0.38
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width * 0.62
      const cy = canvas.height * 0.55
      const size = Math.min(canvas.width, canvas.height) * 0.52
      const steps = 180

      const layers = [
        { offset: 0,    c1: 'rgba(124,95,245,0.10)', c2: 'rgba(251,113,133,0.07)', c3: 'rgba(100,200,255,0.05)' },
        { offset: 0.3,  c1: 'rgba(251,113,133,0.08)', c2: 'rgba(180,100,255,0.06)', c3: 'rgba(100,220,200,0.04)' },
        { offset: -0.2, c1: 'rgba(100,180,255,0.07)', c2: 'rgba(251,113,133,0.05)', c3: 'rgba(200,100,255,0.06)' },
      ]

      layers.forEach(({ offset, c1, c2, c3 }) => {
        const to = t * 0.008 + offset
        const pts: { x: number; y: number }[] = []

        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2
          const r = getBlobPoint(angle, to * 80) * size
          pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r })
        }

        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2
          const my = (pts[i].y + pts[i + 1].y) / 2
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my)
        }
        ctx.closePath()

        const grad = ctx.createRadialGradient(cx - size * 0.2, cy - size * 0.2, 0, cx, cy, size * 1.1)
        grad.addColorStop(0, c1)
        grad.addColorStop(0.4, c2)
        grad.addColorStop(1, c3)
        ctx.fillStyle = grad
        ctx.fill()
      })

      // Sheen
      const mainPts: { x: number; y: number }[] = []
      for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * Math.PI * 2
        const r = getBlobPoint(angle, t * 0.008 * 80) * size
        mainPts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r })
      }
      ctx.beginPath()
      ctx.moveTo(mainPts[0].x, mainPts[0].y)
      for (let i = 1; i < mainPts.length - 1; i++) {
        const mx = (mainPts[i].x + mainPts[i + 1].x) / 2
        const my = (mainPts[i].y + mainPts[i + 1].y) / 2
        ctx.quadraticCurveTo(mainPts[i].x, mainPts[i].y, mx, my)
      }
      ctx.closePath()
      const sheen = ctx.createRadialGradient(cx - size * 0.25, cy - size * 0.3, 0, cx - size * 0.1, cy - size * 0.1, size * 0.6)
      sheen.addColorStop(0, `rgba(255,255,255,${0.04 + Math.sin(t * 0.02) * 0.02})`)
      sheen.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = sheen
      ctx.fill()

      t++
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
