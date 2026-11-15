/**
 * scrollState.js
 * Unified DOM-grounded scroll coordinate and section metrics calculator.
 *
 * Guarantees that:
 * 1. 2nd Page (About) stays pinned until the incense stick seats into the holder and the user finishes reading.
 * 2. 3rd Page (Products) stays pinned until all 4 revolving formulation packets complete their full presentation.
 * 3. 4th Page (Contact) completely hides all 3D actors, lines, and animations.
 */

export function getSectionMetrics() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return {
      scrollY: 0,
      vh: 800,
      heroTop: 0,
      heroTrack: 1000,
      heroEnd: 1000,
      aboutTop: 1000,
      aboutTrack: 300,
      aboutEnd: 1300,
      productsTop: 1300,
      productsTrack: 2800,
      productsEnd: 4100,
      contactTop: 4100,
      heroProgress: 0,
      aboutProgress: 0,
      productsProgress: 0,
      activeSection: 'hero',
      isHeroActive: true,
      isAboutActive: false,
      isProductsActive: false,
      isContactActive: false,
      transitionHeroToAbout: 0,
      transitionAboutToProducts: 0,
    }
  }

  const scrollY = window.scrollY || window.pageYOffset || 0
  const vh = window.innerHeight

  const heroEl = document.getElementById('hero')
  const aboutEl = document.getElementById('about')
  const productsEl = document.getElementById('products')
  const contactEl = document.getElementById('contact')

  const heroTop = heroEl ? heroEl.offsetTop : 0
  const heroHeight = heroEl ? heroEl.offsetHeight : vh * 2.2
  const heroTrack = Math.max(1, heroHeight - vh)
  const heroEnd = heroTop + heroTrack

  const aboutTop = aboutEl ? aboutEl.offsetTop : heroEnd + vh
  const aboutHeight = aboutEl ? aboutEl.offsetHeight : vh * 1.3
  const aboutTrack = Math.max(1, aboutHeight - vh)
  const aboutEnd = aboutTop + aboutTrack

  const productsTop = productsEl ? productsEl.offsetTop : aboutEnd + vh
  const productsHeight = productsEl ? productsEl.offsetHeight : vh * 2.6
  const productsTrack = Math.max(1, productsHeight - vh)
  const productsEnd = productsTop + productsTrack

  const contactTop = contactEl ? contactEl.offsetTop : productsEnd + vh

  // Local progress clamped to [0, 1]
  const heroProgress = Math.max(0, Math.min(1, (scrollY - heroTop) / heroTrack))
  const aboutProgress = Math.max(0, Math.min(1, (scrollY - aboutTop) / aboutTrack))
  const productsProgress = Math.max(0, Math.min(1, (scrollY - productsTop) / productsTrack))

  // Inter-section transition progress [0, 1]
  const heroToAboutDist = Math.max(1, aboutTop - heroEnd)
  const transitionHeroToAbout = Math.max(
    0,
    Math.min(1, (scrollY - heroEnd) / heroToAboutDist)
  )

  const aboutToProductsDist = Math.max(1, productsTop - aboutEnd)
  const transitionAboutToProducts = Math.max(
    0,
    Math.min(1, (scrollY - aboutEnd) / aboutToProductsDist)
  )

  // Current active section
  let activeSection = 'hero'
  if (scrollY >= contactTop - vh * 0.25) {
    activeSection = 'contact'
  } else if (scrollY >= productsTop - 10) {
    activeSection = 'products'
  } else if (scrollY >= aboutTop - 10) {
    activeSection = 'about'
  }

  return {
    scrollY,
    vh,
    heroTop,
    heroTrack,
    heroEnd,
    aboutTop,
    aboutTrack,
    aboutEnd,
    productsTop,
    productsTrack,
    productsEnd,
    contactTop,
    heroProgress,
    aboutProgress,
    productsProgress,
    activeSection,
    isHeroActive: activeSection === 'hero',
    isAboutActive: activeSection === 'about',
    isProductsActive: activeSection === 'products',
    isContactActive: activeSection === 'contact',
    transitionHeroToAbout,
    transitionAboutToProducts,
  }
}

/**
 * getOrbitPhase
 * Canonical synchronized calculation for the 4 revolving formulation packets.
 * Ensures 100% mathematical synchronization between the 3D rotating carousel
 * and the editorial quadrant text:
 *
 * 1. Formulation 01 (Kyara): Top Left
 * 2. Formulation 02 (Hinoki): Bottom Left
 * 3. Formulation 03 (Sumi): Top Right
 * 4. Formulation 04 (Byakudan): Bottom Right
 *
 * Between formulations:
 * - Text & connecting spline fade out to opacity: 0
 * - Screen shows ONLY the revolving packets in 3D
 * - When the next packet faces front, its text fades in at its new quadrant.
 */
export function getOrbitPhase(productsProgress) {
  const count = 4
  const clamped = Math.max(0, Math.min(1, productsProgress))
  const s = clamped * count
  const slotIndex = Math.min(count - 1, Math.floor(s))
  const p = slotIndex === count - 1 ? Math.min(1, s - (count - 1)) : s - slotIndex

  let rotationIndex
  let textOpacity
  let activeIndex

  if (slotIndex < count - 1) {
    if (p < 0.60) {
      // Steady display plateau (60% of slice length)
      rotationIndex = slotIndex
      textOpacity = 1
      activeIndex = slotIndex
    } else if (p < 0.70) {
      // Graceful text dissolve before packet begins turning
      rotationIndex = slotIndex
      textOpacity = 1 - (p - 0.60) / 0.10
      activeIndex = slotIndex
    } else if (p < 0.90) {
      // Carousel turns smoothly; text is completely hidden (opacity 0)
      const turnT = (p - 0.70) / 0.20
      const easedTurn = turnT * turnT * (3 - 2 * turnT)
      rotationIndex = slotIndex + easedTurn
      textOpacity = 0
      activeIndex = turnT > 0.5 ? slotIndex + 1 : slotIndex
    } else {
      // Arrived at next formulation: turn complete, new text fades in
      const inT = (p - 0.90) / 0.10
      rotationIndex = slotIndex + 1
      textOpacity = inT
      activeIndex = slotIndex + 1
    }
  } else {
    // 4th formulation (final formulation)
    rotationIndex = count - 1
    // Gracefully dissolve text at the tail end as user scrolls into Contact
    textOpacity = p > 0.70 ? Math.max(0, 1 - (p - 0.70) / 0.30) : 1
    activeIndex = count - 1
  }

  return {
    rotationIndex,
    rotationY: -rotationIndex * (Math.PI / 2),
    textOpacity,
    activeIndex,
  }
}
