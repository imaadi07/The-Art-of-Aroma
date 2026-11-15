import { useLenis } from '../../hooks/useLenis'

/**
 * SmoothScroll
 * Provides butter-smooth inertial scrolling using Lenis and GSAP Ticker sync.
 */
export function SmoothScroll({ children }) {
  useLenis()
  return <div className="smooth-scroll-wrapper relative w-full">{children}</div>
}

export default SmoothScroll
