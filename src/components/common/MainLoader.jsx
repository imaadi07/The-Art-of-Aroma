import { useEffect, useRef, useState } from 'react'

/**
 * MainLoader
 * 
 * Choreography:
 * 1. User lands: Screen is serene washi linen (#F8F5EE).
 * 2. Puff of silky smoke rises from the bottom center, swirling upwards into the center.
 * 3. The smoke condenses to form the brand logo ("THE ART OF AROMA" & ceremonial seal).
 * 4. 0.5-second wait: Logo stays still, glowing warmly.
 * 5. Logo expands rapidly ("increases filling screen") with atmospheric blur, then fades out ("disappearing").
 * 6. Hero section is revealed underneath.
 */
export function MainLoader({ onComplete }) {
  const canvasRef = useRef(null)
  const [phase, setPhase] = useState('smoke-rising') // 'smoke-rising' | 'logo-formed' | 'wait' | 'expanding' | 'done'
  const [logoScale, setLogoScale] = useState(1)
  const [logoOpacity, setLogoOpacity] = useState(0)
  const [logoBlur, setLogoBlur] = useState(20)
  const [veilOpacity, setVeilOpacity] = useState(1)

  useEffect(() => {
    // Prevent background scrolling while loader is active
    document.body.style.overflow = 'hidden'

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let startTime = performance.now()

    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Smoke particle system for the rising puff
    const particles = []
    const particleCount = 75
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: centerX + (Math.random() - 0.5) * 60,
        y: canvas.height + Math.random() * 80,
        targetY: centerY + (Math.random() - 0.5) * 120,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 3.5 + 3.0),
        size: Math.random() * 45 + 35,
        targetSize: Math.random() * 110 + 70,
        alpha: 0,
        maxAlpha: Math.random() * 0.35 + 0.15,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        curlFreq: Math.random() * 0.03 + 0.01,
      })
    }

    let isDisposed = false

    const render = (now) => {
      if (isDisposed) return
      const elapsed = (now - startTime) / 1000

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Animate smoke puff
      particles.forEach((p, idx) => {
        // Upward movement
        p.y += p.vy
        p.x += Math.sin(elapsed * 2 + idx) * 1.4 + p.vx
        p.rotation += p.vRot

        // Decelerate as it approaches center
        if (p.y <= p.targetY) {
          p.vy *= 0.94
          p.vx *= 0.95
        }

        // Expand and fade in
        if (elapsed < 1.4) {
          p.alpha = Math.min(p.maxAlpha, p.alpha + 0.015)
          p.size = Math.min(p.targetSize, p.size + 0.5)
        } else if (elapsed > 2.5) {
          // Dissolve smoothly when logo expands
          p.alpha = Math.max(0, p.alpha - 0.012)
        }

        // Render soft smoke puff
        if (p.alpha > 0.005) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
          grad.addColorStop(0, `rgba(138, 107, 66, ${p.alpha * 0.45})`)
          grad.addColorStop(0.35, `rgba(110, 100, 90, ${p.alpha * 0.35})`)
          grad.addColorStop(0.7, `rgba(180, 170, 160, ${p.alpha * 0.18})`)
          grad.addColorStop(1, 'rgba(248, 245, 238, 0)')

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    // Sequence Timeline:
    // 0.0s - 1.2s: Smoke rises from bottom
    // 1.2s - 2.0s: Logo emerges from the center smoke
    // 2.0s - 2.5s: 0.5-second wait (logo formed & still)
    // 2.5s - 3.4s: Logo expands filling screen & disappears
    // 3.4s: Complete & reveal hero

    const t1 = setTimeout(() => {
      // Step 2 & 3: Logo forms from smoke
      setPhase('logo-formed')
      setLogoOpacity(1)
      setLogoBlur(0)
    }, 1200)

    const t2 = setTimeout(() => {
      // Step 4: 0.5-second wait starts
      setPhase('wait')
    }, 2000)

    const t3 = setTimeout(() => {
      // Step 5: Logo expands filling the screen smoothly & disappears gracefully
      setPhase('expanding')
      setLogoScale(10)
      setLogoOpacity(0)
      setLogoBlur(16)
      setVeilOpacity(0)
    }, 2500) // 2000ms + 500ms = 2500ms (exact 0.5s contemplative pause)

    const t4 = setTimeout(() => {
      // Step 6: Reveal hero section and restore scroll
      setPhase('done')
      document.body.style.overflow = ''
      if (onComplete) onComplete()
    }, 4200) // 1.7s smooth, cinematic zoomout transition

    return () => {
      isDisposed = true
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      document.body.style.overflow = ''
    }
  }, [onComplete])

  const handleSkip = () => {
    setPhase('done')
    document.body.style.overflow = ''
    if (onComplete) onComplete()
  }

  if (phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F5EE] overflow-hidden select-none pointer-events-auto transition-opacity duration-1000 ease-out"
      style={{ opacity: veilOpacity }}
    >
      {/* 1. Procedural Smoke Veil Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 2. Coalescing Brand Logo */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 transition-all duration-700 ease-out"
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          filter: `blur(${logoBlur}px)`,
          transition:
            phase === 'expanding'
              ? 'transform 1.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.5s ease-out, filter 1.5s ease-out'
              : 'opacity 0.9s ease-out, filter 0.9s ease-out',
        }}
      >
        {/* Ceremonial Seal Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 mb-5 border border-[#8A6B42]/60 rounded-full flex items-center justify-center relative bg-white/60 shadow-[0_4px_20px_rgba(138,107,66,0.12)]">
          <div className="w-10 h-10 border border-[#8A6B42]/30 rounded-full flex items-center justify-center">
            {/* Minimal Incense Burner / Flame Monogram */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8A6B42"
              strokeWidth="1.2"
              className="w-5 h-5 text-[#8A6B42]"
            >
              <path d="M12 2C10 5 8 7 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 7 14 5 12 2Z" />
              <path d="M6 19C7.5 17 9.5 16 12 16C14.5 16 16.5 17 18 19" />
              <line x1="12" y1="16" x2="12" y2="22" />
            </svg>
          </div>
          {/* Subtle glowing halo */}
          <div className="absolute inset-0 rounded-full bg-[#8A6B42]/10 blur-sm pointer-events-none" />
        </div>

        {/* Brand Name */}
        <h1 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.26em] text-[#241F1C] uppercase mb-3">
          THE ART OF AROMA
        </h1>

        {/* Subtitle / Provenance Tag */}
        <p className="font-editorial-sans text-[10px] sm:text-[11px] uppercase tracking-[0.38em] text-[#8A6B42]">
          HAUTE KOH-DO • CEREMONIAL SANCTUARY
        </p>

        {/* Ambient Underline */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#8A6B42]/70 to-transparent mt-4" />
      </div>

      {/* Skip Action (Top Right) */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute top-8 right-8 z-20 text-[10px] uppercase tracking-[0.28em] text-[#5D544C] hover:text-[#241F1C] transition-colors duration-200 cursor-pointer"
      >
        SKIP INTRO →
      </button>
    </div>
  )
}

export default MainLoader
