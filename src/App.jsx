import { useState, useCallback } from 'react'
import { SmoothScroll } from './components/layout/SmoothScroll'
import { Navbar } from './components/layout/Navbar'
import { MainLoader } from './components/common/MainLoader'
import { Experience } from './scenes/Experience'
import { Hero } from './sections/Hero/Hero'
import { AboutSection } from './sections/About/AboutSection'
import { FlavorsSection } from './sections/Flavors/FlavorsSection'
import { ContactSection } from './sections/Contact/ContactSection'
import { Footer } from './components/layout/Footer'
import { PRODUCT_COLLECTION } from './utils/constants'

/**
 * App
 * Master orchestrator for THE ART OF AROMA full 3D experience.
 *
 * Choreography:
 * 1. Main Loader:
 *    - User lands: puff of smoke rises from bottom center, coalesces into brand logo.
 *    - 0.5s pause.
 *    - Logo increases filling screen and disappears, revealing the Hero section.
 *
 * 2. Hero Section:
 *    - Incense stick burns with steady smoke and glowing ember tip.
 *    - Scrolling down pins the page: text appears from the flame tip, expanding to full size.
 *    - Reversing scroll shrinks text back into the flame tip.
 *
 * 3. Second Page (About the Company):
 *    - Incense stick moves with scroll.
 *    - Page stays PINNED in full screen while stick glides right and seats in the brass holder.
 *    - About the Company text on the left side.
 *    - User has plenty of pinned scroll distance to read before the page unpins.
 *
 * 4. Third Page (Products Offered):
 *    - Stick with holder moves to the center of revolving packets carousel as its final position.
 *    - 4 luxury formulation packet boxes revolve in 3D around the center stick & holder.
 *    - NO cards for info! Pure text on screen.
 *    - Dissolves during transition between front stick and upcoming stick.
 *    - Curvy line connects front stick to information text across 4 staggered positions:
 *      1: Top Left | 2: Bottom Left | 3: Top Right | 4: Bottom Right
 *    - Entire section stays PINNED until all 4 formulations have completed their presentation.
 *
 * 5. Fourth Page (Contact):
 *    - One simple premium image on the left, clean form on the right, subtle animation.
 *    - ALL 3D meshes (stick, holder, orbit) and lines are COMPLETELY HIDDEN.
 *
 * 6. Fully Reversible & Optimized across all viewports.
 */
export function App() {
  const [activeFlavor, setActiveFlavor] = useState(PRODUCT_COLLECTION[0])
  const [customImageSrc, setCustomImageSrc] = useState(null)
  const [, setIsLoaderDone] = useState(false)

  // Callback when a new packet revolves into front view
  const handleFrontFlavorChange = useCallback((flavor) => {
    setActiveFlavor(flavor)
  }, [])

  // Sync flavor selection from section scroll slice
  const handleSelectFlavor = useCallback((index) => {
    if (PRODUCT_COLLECTION[index]) {
      setActiveFlavor(PRODUCT_COLLECTION[index])
    }
  }, [])

  return (
    <>
      {/* 1. Main Preloader: Rising smoke puff -> Logo formation -> 0.5s wait -> Fullscreen zoom reveal */}
      <MainLoader onComplete={() => setIsLoaderDone(true)} />

      <SmoothScroll>
        <div className="relative min-h-screen bg-[#F8F5EE] text-[#241F1C] selection:bg-[#EAE3D6] selection:text-[#241F1C]">
          {/* Ambient Calming Wabi-Sabi Sanctuary Atmosphere Layer */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
            {/* Gentle Morning Temple Sunlight & Soft Washi Mist */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,_rgba(240,228,212,0.65)_0%,_rgba(248,245,238,0.92)_55%,_#F8F5EE_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(235,225,210,0.50)_0%,_transparent_65%)]" />

            {/* Subtle Ethereal Auras (Soft Lotus & Sandalwood Mist) */}
            <div className="absolute top-[16%] right-[12%] w-[28rem] h-[28rem] rounded-full bg-[#EADCCF]/40 blur-3xl" />
            <div className="absolute top-[48%] left-[6%] w-[32rem] h-[32rem] rounded-full bg-[#E5DFD4]/45 blur-3xl" />
            <div className="absolute top-[75%] right-[18%] w-80 h-80 rounded-full bg-[#EADED2]/35 blur-3xl" />
          </div>

          {/* Fixed 3D WebGL Canvas Layer (Full Viewport) */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <Experience
              onFrontFlavorChange={handleFrontFlavorChange}
              customImageSrc={customImageSrc}
            />
          </div>

          {/* Fixed 80px Luxury Editorial Navbar */}
          <Navbar />

          {/* Scroll-Driven Transparent Editorial Content Sections */}
          <main className="relative z-10 flex flex-col w-full">
            {/* Page 1: Hero Section (Stick burning, text emerges from flame upon scroll) */}
            <Hero />

            {/* Page 2: About the Company (Stick seats into brass holder on right, text on left) */}
            <AboutSection />

            {/* Page 3: Products (Stick+holder in center of revolving 4 packets, curvy line, 4 quadrants) */}
            <FlavorsSection
              activeFlavor={activeFlavor}
              onSelectFlavor={handleSelectFlavor}
              customImageSrc={customImageSrc}
              onImageUpload={setCustomImageSrc}
            />

            {/* Page 4: Contact (Simple premium image left, clean form right, subtle animation, NO 3D) */}
            <ContactSection />
          </main>

          {/* Luxury Minimal Footer */}
          <div className="relative z-10">
            <Footer />
          </div>
        </div>
      </SmoothScroll>
    </>
  )
}

export default App
