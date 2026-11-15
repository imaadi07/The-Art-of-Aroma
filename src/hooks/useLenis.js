import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { setScrollProgress } from './useScrollProgress'

/**
 * useLenis
 * Initializes Lenis smooth scrolling and binds it directly to GSAP's RAF ticker,
 * ScrollTrigger, and global scroll state for 3D camera & actor synchronization.
 */
export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
    })

    lenisRef.current = lenis
    window.__lenis = lenis

    // Sync with GSAP ScrollTrigger and global 3D state
    lenis.on('scroll', (e) => {
      ScrollTrigger.update()
      setScrollProgress(e.progress, e.scroll, e.limit)
    })

    const onTick = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // Fallback standard scroll listener in case Lenis is idle or initial load
    const onWindowScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0) {
        setScrollProgress(scrollY / maxScroll, scrollY, maxScroll)
      }
    }
    window.addEventListener('scroll', onWindowScroll, { passive: true })
    onWindowScroll()

    return () => {
      window.removeEventListener('scroll', onWindowScroll)
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}

export default useLenis

