import { useEffect, useRef } from 'react'

/**
 * ScreenSmokeOverlay
 * Fullscreen atmospheric smoke veil that billows and fills the entire screen
 * when the incense stick ignites, then gracefully clears to reveal the Hero section.
 *
 * Props:
 * - density: number (0.0 to 1.0)
 *   0.0: crystal clear
 *   1.0: screen entirely engulfed in rich, undulating warm amber & charcoal ceremonial smoke
 */
export function ScreenSmokeOverlay({ density = 0 }) {
  const canvasRef = useRef(null)
  const densityRef = useRef(density)

  // Keep density ref updated without restarting render loop
  useEffect(() => {
    densityRef.current = density
  }, [density])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Generate billowing volumetric cloud particle seeds
    const particleCount = 48
    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width * (0.3 + Math.random() * 0.4),
        y: height * (0.4 + Math.random() * 0.5),
        radius: Math.min(width, height) * (0.28 + Math.random() * 0.45),
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.6 - Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012,
        baseAlpha: 0.22 + Math.random() * 0.35,
        tint: Math.random() > 0.4 ? 'amber' : 'charcoal',
      })
    }

    let time = 0

    const render = () => {
      const currentDensity = densityRef.current

      // If density is virtually zero, keep canvas cleared and skip heavy draw
      if (currentDensity <= 0.001) {
        ctx.clearRect(0, 0, width, height)
        animationId = requestAnimationFrame(render)
        return
      }

      time += 0.018
      ctx.clearRect(0, 0, width, height)

      // Base atmospheric dark fog layer proportional to density
      const bgOpacity = Math.min(1.0, currentDensity * 1.15)
      ctx.fillStyle = `rgba(21, 20, 16, ${bgOpacity})`
      ctx.fillRect(0, 0, width, height)

      // Billowing volumetric swirls
      particles.forEach((p, idx) => {
        // Drift upwards and sway
        p.y += p.vy * (1 + currentDensity * 1.5)
        p.x += Math.sin(time + p.phase) * 1.2

        // Reset particle if drifted past top
        if (p.y < -p.radius) {
          p.y = height + p.radius * 0.5
          p.x = width * 0.5 + (Math.random() - 0.5) * width * 0.6
        }

        const currentRadius = p.radius * (0.7 + currentDensity * 0.8)
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          currentRadius
        )

        const particleAlpha = Math.min(
          1.0,
          p.baseAlpha * currentDensity * (currentDensity > 0.8 ? 1.5 : 1.2)
        )

        if (p.tint === 'amber' && idx % 2 === 0) {
          // Warm golden amber lit smoke from ember
          gradient.addColorStop(0, `rgba(220, 150, 70, ${particleAlpha * 0.45})`)
          gradient.addColorStop(0.35, `rgba(180, 120, 55, ${particleAlpha * 0.25})`)
          gradient.addColorStop(0.7, `rgba(45, 40, 32, ${particleAlpha * 0.12})`)
          gradient.addColorStop(1, 'rgba(21, 20, 16, 0)')
        } else {
          // Velvety charcoal and warm linen mist
          gradient.addColorStop(0, `rgba(90, 85, 75, ${particleAlpha * 0.55})`)
          gradient.addColorStop(0.4, `rgba(50, 46, 38, ${particleAlpha * 0.35})`)
          gradient.addColorStop(0.8, `rgba(25, 23, 19, ${particleAlpha * 0.15})`)
          gradient.addColorStop(1, 'rgba(21, 20, 16, 0)')
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Don't render pointer events on the smoke so user can still scroll freely
  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-300"
      style={{
        opacity: density > 0.005 ? 1 : 0,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {/* Cinematic vignette & warmth overlay */}
      <div
        className="absolute inset-0 bg-radial-[circle_at_center,_transparent_20%,_#151410_100%] pointer-events-none transition-opacity duration-500"
        style={{ opacity: Math.min(1, density * 1.3) }}
      />
    </div>
  )
}

export default ScreenSmokeOverlay
