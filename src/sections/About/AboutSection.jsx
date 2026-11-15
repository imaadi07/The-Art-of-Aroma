import { useState, useEffect, useRef } from 'react'
import { ABOUT_CONTENT } from '../../utils/constants'
import { Container } from '../../components/common/Container'
import { getSectionMetrics } from '../../utils/scrollState'

/**
 * AboutSection (Second Page: About the Company)
 *
 * User Requirements:
 * 1. Removed heritage line on top as requested.
 * 2. Heading sits cleanly with generous top padding below the fixed navbar.
 * 3. Text dissolves gracefully in place as user advances to Products (no upward collision).
 * 4. Incense stick settles firmly into the ceremonial brass holder on the right (its FINAL place).
 */
export function AboutSection() {
  const containerRef = useRef(null)
  const [exitOpacity, setExitOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const metrics = getSectionMetrics()
      const { scrollY, aboutEnd, productsTop } = metrics

      if (scrollY <= aboutEnd) {
        setExitOpacity(1)
      } else if (scrollY >= productsTop) {
        setExitOpacity(0)
      } else {
        // As user scrolls past About towards Products, dissolve text in place before it can move
        const exitProgress = (scrollY - aboutEnd) / Math.max(1, productsTop - aboutEnd)
        setExitOpacity(Math.max(0, 1 - exitProgress * 2.2))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full h-[130vh] pointer-events-none"
    >
      {/* Sticky Fullscreen Frame - Positioned safely below the 80px fixed navbar */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-start pt-28 sm:pt-32 pb-8 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Company Narrative & Typography (Span 6, max-w-lg) */}
            <div
              className="lg:col-span-6 text-left pointer-events-auto max-w-lg transition-opacity duration-150"
              style={{
                opacity: exitOpacity,
                transform: 'none', // Strictly no upward translation to prevent navbar overlap
              }}
            >
              {/* Heading - Refined, elegant scale */}
              <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#241F1C] leading-[1.12] mb-5">
                {ABOUT_CONTENT.heading}
              </h2>

              {/* Subtitle */}
              <p className="font-editorial-serif italic text-base sm:text-lg text-[#8A6B42] font-light leading-relaxed mb-5">
                {ABOUT_CONTENT.subtitle}
              </p>

              {/* Narrative Description */}
              <p className="font-editorial-sans text-xs sm:text-sm text-[#5D544C] font-light leading-relaxed mb-6">
                {ABOUT_CONTENT.description}
              </p>

              {/* Key Provenance Metrics */}
              <div className="grid grid-cols-3 gap-4 border-t border-b border-[#DDD4C7] py-4">
                {ABOUT_CONTENT.stats.map((stat) => (
                  <div key={stat.label}>
                    <span className="font-editorial-serif text-xl sm:text-2xl text-[#241F1C] block">
                      {stat.value}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#5D544C] block mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Dedicated Negative Space for the 3D Stick & Brass Holder (Span 6) */}
            <div className="hidden lg:flex lg:col-span-6 h-[420px] items-center justify-center pointer-events-none" />
          </div>
        </Container>
      </div>
    </section>
  )
}

export default AboutSection
