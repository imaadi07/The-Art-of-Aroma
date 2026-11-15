import { useState, useEffect } from 'react'

// Global singleton to allow both React state and 60fps useFrame reads
export const scrollState = {
  progress: 0,
  scrollY: 0,
  maxScroll: 1,
}

if (typeof window !== 'undefined') {
  window.__scrollState = scrollState
}

const listeners = new Set()

export function setScrollProgress(progress, scrollY, maxScroll) {
  scrollState.progress = Math.max(0, Math.min(1, progress))
  scrollState.scrollY = scrollY
  scrollState.maxScroll = maxScroll
  listeners.forEach((fn) => fn(scrollState.progress))
}

/**
 * useScrollProgress
 * Subscribes to normalized scroll progress (0.0 to 1.0) across the entire page.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(scrollState.progress)

  useEffect(() => {
    listeners.add(setProgress)
    return () => {
      listeners.delete(setProgress)
    }
  }, [])

  return progress
}

export default useScrollProgress
