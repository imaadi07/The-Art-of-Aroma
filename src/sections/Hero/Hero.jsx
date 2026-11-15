import { useRef, useState, useEffect } from 'react'
import { HERO_CONTENT } from '../../utils/constants'
import { getSectionMetrics } from '../../utils/scrollState'

/**
 * Hero Section
 *
 * User Requirement:
 * "A stick will be burning with a steady rise of smoke and a burning at the tip of the inscense stick.
 *  when the user will scroll down the page should stay still and just the text should appear from
 *  the flame of the stick and show the usual size on the screen and when the user reverse the scroll
 *  it should reverse the animation."
 *
 * Grounded in DOM metrics:
 * - 220vh scroll track with a sticky 100vh viewport container (the page stays still).
 * - Real-time scroll progress calculation scrubbed between 0.0 and 1.0.
 * - At scroll 0: text is miniature (scale: 0.04), blurred, warm glowing, origin at the flame tip, opacity 0.
 * - As user scrolls down: text expands from the flame tip into full editorial size & clarity.
 * - Reversing scroll shrinks the text cleanly back into the flame.
 */
export function Hero() {
  const containerRef = useRef(null)
  const [heroProgress, setHeroProgress] = useState(0)
  const [exitOpacity, setExitOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const metrics = getSectionMetrics()
      setHeroProgress(metrics.heroProgress)

      // When user scrolls past Hero into About, dissolve Hero text in place
      // before it can be dragged upwards under the fixed navbar
      if (metrics.scrollY > metrics.heroEnd) {
        const exitT = (metrics.scrollY - metrics.heroEnd) / Math.max(1, metrics.aboutTop - metrics.heroEnd)
        setExitOpacity(Math.max(0, 1 - exitT * 2.5))
      } else {
        setExitOpacity(1)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scrubbed animation parameters (emerging from the flame)
  // Non-linear easing for natural explosion/expansion from the ember
  const eased = Math.pow(heroProgress, 0.85)

  // Scale: 0.04 (in the flame) -> 1.0 (full screen editorial size)
  const scale = 0.04 + eased * 0.96

  // Opacity: fades in rapidly as soon as it emerges from the ember, dissolves on exit
  const opacity = Math.min(1.0, heroProgress * 2.2) * exitOpacity

  // Blur: 16px in the flame heat -> 0px clear editorial typography
  const blur = Math.max(0, (1.0 - heroProgress) * 16)

  // Translation: begins offset toward the 3D stick flame tip (right-center), translates into left editorial alignment
  const translateX = (1.0 - eased) * 160 // px offset from flame
  const translateY = (1.0 - eased) * -80 // px offset from flame tip

  // Ember glow intensity: intense orange-amber glow when emerging from the fire, settles to pure crisp ivory
  const glowAlpha = Math.max(0, (1.0 - heroProgress) * 0.9)

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-[220vh] pointer-events-none"
    >
      {/* Sticky Fullscreen Frame - Keeps the page still while text emerges from flame */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-24 sm:pt-32 pb-12 overflow-hidden">
        {/* Main Editorial Text Layer - Animated directly from the 3D flame */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-center">
          <div
            className="max-w-xl lg:max-w-2xl xl:max-w-3xl text-left will-change-transform"
            style={{
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
              transformOrigin: '75% 35%', // Aligned with the 3D incense stick flame tip
              opacity: opacity,
              filter: `blur(${blur}px)`,
              textShadow: glowAlpha > 0.05 ? `0 0 28px rgba(224, 96, 24, ${glowAlpha})` : 'none',
              transition: 'none', // Continuous 60 FPS scrub directly synced with scroll
            }}
          >
            {/* Eyebrow */}
            <div className="mb-4 sm:mb-5 flex items-center space-x-3">
              <span className="w-6 h-[1px] bg-[#8A6B42]/70" />
              <span className="eyebrow tracking-[0.28em] text-[10px] sm:text-[11px] text-[#8A6B42]">
                {HERO_CONTENT.eyebrow}
              </span>
            </div>

            {/* 2-Line Large Headline */}
            <h1 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] font-light tracking-[0.04em] text-[#241F1C] uppercase leading-[0.94] mb-6">
              <span className="block whitespace-nowrap">{HERO_CONTENT.headlineLine1}</span>
              <span className="block whitespace-nowrap">{HERO_CONTENT.headlineLine2}</span>
            </h1>

            {/* Subtitle */}
            <p className="font-editorial-sans text-xs sm:text-sm md:text-base font-light tracking-[0.14em] text-[#5D544C] max-w-md leading-relaxed mb-8">
              {HERO_CONTENT.subtitle}
            </p>

            {/* CTA Button */}
            <div className="pointer-events-auto">
              <a
                href="#about"
                className="group relative inline-flex items-center justify-center px-9 py-3.5 border border-[#DDD4C7] bg-white/80 text-[#241F1C] text-[11px] uppercase tracking-[0.28em] transition-all duration-300 hover:border-[#241F1C] hover:bg-[#241F1C] hover:text-[#F8F5EE] hover:tracking-[0.34em]"
              >
                <span>{HERO_CONTENT.cta}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Provenance Tag & Scroll Prompt */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 flex items-end justify-between pointer-events-none">
          <div className="hidden sm:flex items-center space-x-3 text-[10px] uppercase tracking-[0.28em] text-[#7A7067]">
            <span>AWAJI ISLAND • JAPAN</span>
            <span className="text-[#DDD4C7]">|</span>
            <span>45 MIN CONTEMPLATIVE RITUAL</span>
          </div>

          <div className="flex flex-col items-center space-y-2 pointer-events-none">
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#7A7067]">
              {heroProgress < 0.8 ? 'SCROLL DOWN TO REVEAL' : HERO_CONTENT.scroll}
            </span>
            <div className="w-[1px] h-8 bg-[#DDD4C7] overflow-hidden relative">
              <div
                className="w-full bg-[#8A6B42] absolute top-0 transition-all duration-150"
                style={{ height: `${Math.max(15, heroProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
