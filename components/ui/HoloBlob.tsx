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

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const isMobile = canvas.width < 768
      const cols = isMobile ? 28 : 65
      const dotSpacingX = canvas.width / cols
      const centerY = canvas.height * 0.5
      const maxH = canvas.height * (isMobile ? 0.42 : 0.45)
      const rows = isMobile ? 22 : 26

      for (let col = 0; col < cols; col++) {
        const x = col * dotSpacingX + dotSpacingX / 2
        const phase = (col / cols) * Math.PI * 4
        const pulse  = Math.sin(phase - t * 0.055) * 0.5 + 0.5
        const pulse2 = Math.sin(phase * 0.6 - t * 0.035 + 1.5) * 0.35 + 0.35
        const pulse3 = Math.sin(phase * 1.3 - t * 0.07 + 0.8) * 0.15 + 0.15
        const height = (pulse * 0.6 + pulse2 * 0.25 + pulse3 * 0.15) * maxH

        for (let row = 0; row < rows; row++) {
          const rowY = (row / (rows - 1)) * maxH * 2
          const dist = Math.abs(rowY - maxH)
          if (dist > height) continue

          const y = centerY - maxH + rowY
          const proximity = 1 - dist / height
          const dotSize = (isMobile ? 2.0 : 2.2) + proximity * (isMobile ? 2.8 : 3.2)

          const hue = ((col / cols) * 0.8 + t * 0.002) % 1
          let r = 0, g = 0, b = 0
          if (hue < 0.33) {
            const h = hue / 0.33
            r = Math.round(124 + (251 - 124) * h)
            g = Math.round(95 + (113 - 95) * h)
            b = Math.round(245 + (133 - 245) * h)
          } else if (hue < 0.66) {
            const h = (hue - 0.33) / 0.33
            r = Math.round(251 + (100 - 251) * h)
            g = Math.round(113 + (200 - 113) * h)
            b = Math.round(133 + (255 - 133) * h)
          } else {
            const h = (hue - 0.66) / 0.34
            r = Math.round(100 + (124 - 100) * h)
            g = Math.round(200 + (95 - 200) * h)
            b = Math.round(255 + (245 - 255) * h)
          }

          ctx.beginPath()
          ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${0.1 + proximity * 0.55})`
          ctx.fill()
        }
      }

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
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.9 }}
    />
  )
}
