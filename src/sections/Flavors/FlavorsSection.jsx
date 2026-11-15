import { useState, useEffect, useRef } from 'react'
import { PRODUCT_COLLECTION } from '../../utils/constants'
import { getSectionMetrics, getOrbitPhase } from '../../utils/scrollState'

/**
 * FlavorsSection (Third Page: Products Offered)
 *
 * User Refinements:
 * 1. Pinned Scroll Track: Exactly 4 clean scroll gestures to advance through the 4 formulations (h-[260vh]).
 * 2. Top editorial header completely removed ("Formulations in Orbit" & eyebrow).
 * 3. Bottom bar text completely removed ("AWAJI ATELIER // FORMULATION 01 OF 04", "+ UPLOAD REFERENCE", etc.).
 * 4. Top-left and top-right info cards moved higher up on the screen (top-20 sm:top-24 lg:top-28).
 * 5. Direct Square Glassmorphic Images rotating in 3D center at eye level (NO album box, NO plinth base).
 * 6. Clean, pure editorial typography (no cards, no formulation codes) starting directly with the title.
 * 7. Curvy golden spline connects from the top crest of the front rotating image to the active text.
 * 8. Complete fade-out of text and spline during 3D carousel transitions.
 */
export function FlavorsSection({
  onSelectFlavor,
}) {
  const containerRef = useRef(null)
  const [sectionProgress, setSectionProgress] = useState(0)
  const [isSectionActive, setIsSectionActive] = useState(false)

  // Track local scroll progress through the pinned track (0 to 1) using unified metrics
  useEffect(() => {
    const handleScroll = () => {
      const metrics = getSectionMetrics()
      setSectionProgress(metrics.productsProgress)
      setIsSectionActive(metrics.isProductsActive)

      const phase = getOrbitPhase(metrics.productsProgress)
      if (onSelectFlavor) {
        onSelectFlavor(phase.activeIndex)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onSelectFlavor])

  // Precise mathematical phase shared with 3D carousel
  const { activeIndex, textOpacity } = getOrbitPhase(sectionProgress)
  const activeFlavor = PRODUCT_COLLECTION[activeIndex] || PRODUCT_COLLECTION[0]

  const [lineCoords, setLineCoords] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  })

  // Compute connecting curve coordinates from front square image crest to active text
  useEffect(() => {
    const updateCurve = () => {
      // Viewport coordinate of the top crest of the front square image (centered at eye-level)
      const startX = window.innerWidth * 0.50
      const startY = window.innerHeight * 0.30

      // Find the active visible text block
      const activeTextContainer = containerRef.current?.querySelector(`[data-flavor-index="${activeIndex}"]`)
      let endX
      let endY

      if (activeTextContainer) {
        const textRect = activeTextContainer.getBoundingClientRect()
        const isRight = activeFlavor.position.includes('right')
        endX = isRight ? textRect.left - 18 : textRect.right + 18
        endY = textRect.top + 28
      } else {
        const width = window.innerWidth
        const height = window.innerHeight
        if (activeFlavor.position === 'top-left') {
          endX = width * 0.28
          endY = height * 0.20
        } else if (activeFlavor.position === 'bottom-left') {
          endX = width * 0.28
          endY = height * 0.74
        } else if (activeFlavor.position === 'top-right') {
          endX = width * 0.72
          endY = height * 0.20
        } else {
          endX = width * 0.72
          endY = height * 0.74
        }
      }

      setLineCoords({ startX, startY, endX, endY })
    }

    updateCurve()
    window.addEventListener('resize', updateCurve)
    window.addEventListener('scroll', updateCurve, { passive: true })
    return () => {
      window.removeEventListener('resize', updateCurve)
      window.removeEventListener('scroll', updateCurve)
    }
  }, [activeIndex, activeFlavor.position])

  // Graceful organic cubic Bézier curve calculation from front square image to quadrant text
  const { startX, startY, endX, endY } = lineCoords
  const dx = endX - startX
  const dy = endY - startY
  const controlPoint1X = startX + dx * 0.35
  const controlPoint1Y = startY + (dy < 0 ? -32 : 20)
  const controlPoint2X = startX + dx * 0.70
  const controlPoint2Y = endY + (dy < 0 ? 18 : -22)
  const bezierPath = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`

  const effectiveSplineOpacity = isSectionActive ? textOpacity : 0

  return (
    <section
      id="products"
      ref={containerRef}
      className="relative w-full h-[260vh] pointer-events-none"
    >
      {/* Anchor alias */}
      <div id="flavors" className="absolute -top-24" />
      <div id="collection" className="absolute -top-24" />

      {/* Sticky Fullscreen Frame - Keeps page pinned while 4 square images revolve */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden select-none">
        {/* Dynamic Curvy SVG Golden Line (Strictly hidden when revolving or outside section) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-200"
          style={{
            opacity: effectiveSplineOpacity,
            filter: 'drop-shadow(0 0 6px rgba(138, 107, 66, 0.35))',
          }}
        >
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A6B42" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#B88E58" stopOpacity="0.80" />
              <stop offset="100%" stopColor="#241F1C" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* The Curvy Connecting Spline */}
          <path
            d={bezierPath}
            fill="none"
            stroke="url(#curveGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="transition-all duration-300 ease-out"
          />

          {/* Origin Glowing Anchor at Top Crest of Front Square Image */}
          <circle
            cx={startX}
            cy={startY}
            r="4"
            fill="#8A6B42"
            className="animate-pulse"
          />
          <circle
            cx={startX}
            cy={startY}
            r="7.5"
            fill="none"
            stroke="#8A6B42"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Target Anchor Dot at Information Text */}
          <circle
            cx={endX}
            cy={endY}
            r="3.5"
            fill="#8A6B42"
            className="transition-all duration-300"
          />
        </svg>

        {/* Pure Typography Information Overlay - Fixed Absolute Quadrants pushed to outer edges */}
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-none">
          {/* Position 0: Top Left (Formulation 01 - Kyara Woods) */}
          <div
            data-flavor-index="0"
            style={{ opacity: activeIndex === 0 ? textOpacity : 0 }}
            className={`absolute top-20 sm:top-24 lg:top-28 left-8 sm:left-12 lg:left-16 xl:left-24 max-w-[280px] text-left transition-opacity duration-200 pointer-events-auto ${
              activeIndex === 0 && textOpacity > 0.05 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <div className="space-y-2">
              <h3 className="font-editorial-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#241F1C] leading-none">
                {PRODUCT_COLLECTION[0].name}
              </h3>
              <p className="font-editorial-serif italic text-sm text-[#8A6B42]">
                {PRODUCT_COLLECTION[0].tagline}
              </p>
              <p className="font-editorial-sans text-[11px] text-[#5D544C] font-light leading-relaxed pt-1">
                {PRODUCT_COLLECTION[0].olfactoryProfile}
              </p>
              <div className="pt-2 text-[9px] uppercase tracking-[0.2em] text-[#241F1C]">
                <span className="text-[#5D544C] block">NOTES:</span>
                <span>{PRODUCT_COLLECTION[0].notes}</span>
              </div>
              <div className="pt-1 flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] text-[#8A6B42]">
                <span>{PRODUCT_COLLECTION[0].price}</span>
                <span>•</span>
                <span>{PRODUCT_COLLECTION[0].burnTime}</span>
              </div>
            </div>
          </div>

          {/* Position 1: Bottom Left (Formulation 02 - Hinoki Mist) */}
          <div
            data-flavor-index="1"
            style={{ opacity: activeIndex === 1 ? textOpacity : 0 }}
            className={`absolute bottom-16 sm:bottom-20 left-8 sm:left-12 lg:left-16 xl:left-24 max-w-[280px] text-left transition-opacity duration-200 pointer-events-auto ${
              activeIndex === 1 && textOpacity > 0.05 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <div className="space-y-2">
              <h3 className="font-editorial-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#241F1C] leading-none">
                {PRODUCT_COLLECTION[1].name}
              </h3>
              <p className="font-editorial-serif italic text-sm text-[#8A6B42]">
                {PRODUCT_COLLECTION[1].tagline}
              </p>
              <p className="font-editorial-sans text-[11px] text-[#5D544C] font-light leading-relaxed pt-1">
                {PRODUCT_COLLECTION[1].olfactoryProfile}
              </p>
              <div className="pt-2 text-[9px] uppercase tracking-[0.2em] text-[#241F1C]">
                <span className="text-[#5D544C] block">NOTES:</span>
                <span>{PRODUCT_COLLECTION[1].notes}</span>
              </div>
              <div className="pt-1 flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] text-[#8A6B42]">
                <span>{PRODUCT_COLLECTION[1].price}</span>
                <span>•</span>
                <span>{PRODUCT_COLLECTION[1].burnTime}</span>
              </div>
            </div>
          </div>

          {/* Position 2: Top Right (Formulation 03 - Sumi & Shiso) */}
          <div
            data-flavor-index="2"
            style={{ opacity: activeIndex === 2 ? textOpacity : 0 }}
            className={`absolute top-20 sm:top-24 lg:top-28 right-8 sm:right-12 lg:right-16 xl:right-24 max-w-[280px] text-right ml-auto transition-opacity duration-200 pointer-events-auto ${
              activeIndex === 2 && textOpacity > 0.05 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <div className="space-y-2">
              <h3 className="font-editorial-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#241F1C] leading-none">
                {PRODUCT_COLLECTION[2].name}
              </h3>
              <p className="font-editorial-serif italic text-sm text-[#8A6B42]">
                {PRODUCT_COLLECTION[2].tagline}
              </p>
              <p className="font-editorial-sans text-[11px] text-[#5D544C] font-light leading-relaxed pt-1">
                {PRODUCT_COLLECTION[2].olfactoryProfile}
              </p>
              <div className="pt-2 text-[9px] uppercase tracking-[0.2em] text-[#241F1C]">
                <span className="text-[#5D544C] block">NOTES:</span>
                <span>{PRODUCT_COLLECTION[2].notes}</span>
              </div>
              <div className="pt-1 flex items-center justify-end space-x-3 text-[10px] uppercase tracking-[0.2em] text-[#8A6B42]">
                <span>{PRODUCT_COLLECTION[2].price}</span>
                <span>•</span>
                <span>{PRODUCT_COLLECTION[2].burnTime}</span>
              </div>
            </div>
          </div>

          {/* Position 3: Bottom Right (Formulation 04 - Byakudan Sandalwood) */}
          <div
            data-flavor-index="3"
            style={{ opacity: activeIndex === 3 ? textOpacity : 0 }}
            className={`absolute bottom-16 sm:bottom-20 right-8 sm:right-12 lg:right-16 xl:right-24 max-w-[280px] text-right ml-auto transition-opacity duration-200 pointer-events-auto ${
              activeIndex === 3 && textOpacity > 0.05 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <div className="space-y-2">
              <h3 className="font-editorial-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#241F1C] leading-none">
                {PRODUCT_COLLECTION[3].name}
              </h3>
              <p className="font-editorial-serif italic text-sm text-[#8A6B42]">
                {PRODUCT_COLLECTION[3].tagline}
              </p>
              <p className="font-editorial-sans text-[11px] text-[#5D544C] font-light leading-relaxed pt-1">
                {PRODUCT_COLLECTION[3].olfactoryProfile}
              </p>
              <div className="pt-2 text-[9px] uppercase tracking-[0.2em] text-[#241F1C]">
                <span className="text-[#5D544C] block">NOTES:</span>
                <span>{PRODUCT_COLLECTION[3].notes}</span>
              </div>
              <div className="pt-1 flex items-center justify-end space-x-3 text-[10px] uppercase tracking-[0.2em] text-[#8A6B42]">
                <span>{PRODUCT_COLLECTION[3].price}</span>
                <span>•</span>
                <span>{PRODUCT_COLLECTION[3].burnTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlavorsSection
