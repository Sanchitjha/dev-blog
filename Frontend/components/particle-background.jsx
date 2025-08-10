"use client"

import { useEffect, useRef } from "react"

/**
 * Micro particle background with lines. Lightweight and dependency-free.
 * Interactions:
 * - Hover: soft repulsion
 * - Click: spawn a few particles
 */
export default function ParticleBackground({
  className = "",
  particleColor = "rgba(16,185,129,0.8)", // emerald-500
  lineColor = "rgba(16,185,129,0.25)",
  maxParticles = 90,
  connectDistance = 120,
  speed = 0.7,
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: null, y: null, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let width = 0
    let height = 0

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Initialize particles
    const targetCount = Math.floor(Math.min(maxParticles, Math.max(30, Math.min(110, (width * height) / 20000))))
    particlesRef.current = Array.from({ length: targetCount }).map(() => spawnParticle(width, height, speed))

    function spawnParticle(w, h, spd) {
      const angle = Math.random() * Math.PI * 2
      const s = (Math.random() * 0.6 + 0.4) * spd
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s,
        size: Math.random() * 1.8 + 0.8,
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      const pts = particlesRef.current
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]

        // Hover repulsion
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const dist2 = dx * dx + dy * dy
          const radius = 120
          if (dist2 < radius * radius) {
            const dist = Math.sqrt(dist2) || 1
            const force = (radius - dist) / radius
            p.vx += (dx / dist) * force * 0.08
            p.vy += (dy / dist) * force * 0.08
          }
        }

        p.x += p.vx
        p.y += p.vy

        // Soft bounds: wrap with slight reposition to prevent clustering
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        // Draw particle
        ctx.beginPath()
        ctx.fillStyle = particleColor
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw lines between close particles
      ctx.strokeStyle = lineColor
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < connectDistance * connectDistance) {
            const alpha = 1 - Math.sqrt(d2) / connectDistance
            ctx.globalAlpha = Math.max(0.05, Math.min(0.6, alpha * 0.8))
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    function onResize() {
      resize()
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.active = true
    }
    function onMouseLeave() {
      mouseRef.current.active = false
    }
    function onClick(e) {
      // Spawn a few particles at click location
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      for (let k = 0; k < 4; k++) {
        const p = spawnParticle(width, height, speed)
        p.x = x
        p.y = y
        particlesRef.current.push(p)
      }
      // Cap to maxParticles
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current.splice(0, particlesRef.current.length - maxParticles)
      }
    }

    window.addEventListener("resize", onResize)
    canvas.addEventListener("mousemove", onMouseMove)
    canvas.addEventListener("mouseleave", onMouseLeave)
    canvas.addEventListener("click", onClick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", onResize)
      canvas.removeEventListener("mousemove", onMouseMove)
      canvas.removeEventListener("mouseleave", onMouseLeave)
      canvas.removeEventListener("click", onClick)
    }
  }, [connectDistance, lineColor, maxParticles, particleColor, speed])

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" role="img" />
    </div>
  )
}
