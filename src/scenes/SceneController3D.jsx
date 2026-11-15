import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { IncenseStick } from './components/IncenseStick'
import { Holder3D } from './components/Holder3D'
import { FlavorOrbit } from './components/FlavorOrbit'
import { getSectionMetrics } from '../utils/scrollState'

/**
 * SceneController3D
 * Master 3D choreographic controller for THE ART OF AROMA.
 *
 * Core Choreography:
 * 1. Hero: Stick upright at focal center, text emerges from flame.
 * 2. Hero -> About: Stick glides to right, holder rises to catch it.
 * 3. Page 2 (About): Final destination of the incense stick & brass holder.
 *    Firmly seated on right.
 * 4. About -> Products Transition:
 *    The incense stick & brass holder scroll UPWARDS off-screen WITH Page 2.
 *    The revolving packet carousel scrolls IN from below WITH Page 3, locking at (0, 0, 0).
 *    Zero overlapping lag, zero abrupt pop-in or disappearing!
 * 5. Page 3 (Products): Revolving carousel fixed at (0, 0, 0) at eye level,
 *    prominently sized, revolving through all 4 formulations.
 * 6. Page 4 (Contact): Completely isolated with zero 3D bleed-through.
 */
export function SceneController3D({ onFrontFlavorChange, customImageSrc = null }) {
  const { width, height, aspect } = useThree((state) => state.viewport)
  const isMobile = aspect < 0.75
  const isTablet = aspect >= 0.75 && aspect < 1.15

  // Actor references
  const stickGroupRef = useRef(null)
  const holderGroupRef = useRef(null)
  const orbitGroupRef = useRef(null)

  // Prominent luxury exhibition scale (~280px tall on 1080p)
  const responsiveScale = isMobile ? 0.62 : isTablet ? 0.72 : 0.78
  // Prominent wide & big exhibition scale for square direct glass image carousel
  const carouselScale = isMobile ? 0.72 : isTablet ? 0.86 : 0.96

  // Target coordinates for right-hand placement (Page 2 - Final destination)
  const rightX = isMobile ? width * 0.18 : isTablet ? width * 0.24 : width * 0.28
  const holderGroundY = -(height / 2) + (isMobile ? 0.38 : 0.48)

  // Coordinates for stick:
  const heroStickX = isMobile ? 0 : width * 0.16
  const heroStickY = -1.05
  const seatedAboutY = holderGroundY - 0.04

  useFrame((state, delta) => {
    const metrics = getSectionMetrics()
    const { scrollY, vh, aboutTop, aboutEnd, productsTop, productsEnd, heroEnd } = metrics
    const time = state.clock.elapsedTime
    const camera = state.camera

    // Subtle mouse parallax
    const mouseX = state.pointer.x * 0.08
    const mouseY = state.pointer.y * 0.04

    // 1. Contact Stage Isolation: Past Products, hide ALL 3D actors
    if (scrollY > productsEnd) {
      if (stickGroupRef.current) stickGroupRef.current.visible = false
      if (holderGroupRef.current) holderGroupRef.current.visible = false
      if (orbitGroupRef.current) orbitGroupRef.current.visible = false
      return
    }

    // 2. Camera Positioning
    let targetCamZ
    let targetCamY
    const targetCamX = 0.0

    if (scrollY <= heroEnd) {
      targetCamZ = 4.2
      targetCamY = 0.0
    } else if (scrollY < aboutTop) {
      const t = metrics.transitionHeroToAbout
      targetCamZ = THREE.MathUtils.lerp(4.2, 4.4, t)
      targetCamY = THREE.MathUtils.lerp(0.0, 0.02, t)
    } else if (scrollY <= aboutEnd) {
      targetCamZ = 4.4
      targetCamY = 0.02
    } else {
      // Products: eye-level framing for centered revolving packet carousel
      targetCamZ = 4.2
      targetCamY = 0.0
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX + mouseX, 6, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY + mouseY, 6, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 6, delta)
    camera.lookAt(targetCamX * 0.1, targetCamY * 0.1, 0)

    // -------------------------------------------------------------
    // 3. Incense Stick & Ceremonial Brass Holder
    // FINAL PLACE IS PAGE 2 (ABOUT). SCROLLS OFF WITH PAGE 2.
    // User Requirement: "on the first page and second page with the scroll make the sticks also rotate."
    // -------------------------------------------------------------
    const scrollStickRotY = scrollY * 0.0035 + (time * 0.06)

    if (stickGroupRef.current && holderGroupRef.current) {
      if (scrollY <= heroEnd) {
        // Hero: Stick upright at focal center, holder hidden. Rotates dynamically with scroll!
        stickGroupRef.current.visible = true
        holderGroupRef.current.visible = false
        stickGroupRef.current.position.set(heroStickX, heroStickY, 0)
        stickGroupRef.current.rotation.set(0.02, scrollStickRotY, 0)
        stickGroupRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale)
      } else if (scrollY < aboutTop) {
        // Hero -> About transition: Stick glides to right and lands DIRECTLY into cauldron while rotating
        stickGroupRef.current.visible = true
        holderGroupRef.current.visible = true

        const t = metrics.transitionHeroToAbout
        const curHolderY = THREE.MathUtils.lerp(holderGroundY - 1.5, holderGroundY, t)
        holderGroupRef.current.position.set(rightX, curHolderY, 0)
        holderGroupRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale)

        const curStickX = THREE.MathUtils.lerp(heroStickX, rightX, t)
        const curStickY = THREE.MathUtils.lerp(heroStickY, seatedAboutY, t)
        stickGroupRef.current.position.set(curStickX, curStickY, 0)
        stickGroupRef.current.rotation.set(0.02, scrollStickRotY, 0)
        stickGroupRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale)
      } else if (scrollY <= aboutEnd) {
        // About Section: Final destination of the incense stick & holder!
        // Firmly seated on right side during Page 2, sticks continue rotating with scroll
        stickGroupRef.current.visible = true
        holderGroupRef.current.visible = true
        holderGroupRef.current.position.set(rightX, holderGroundY, 0)
        holderGroupRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale)

        stickGroupRef.current.position.set(rightX, seatedAboutY, 0)
        stickGroupRef.current.rotation.set(0.02, scrollStickRotY, 0)
        stickGroupRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale)
      } else {
        // As Page 2 scrolls off, stick and holder physically SCROLL UPWARDS WITH PAGE 2!
        const scrollOffsetPx = scrollY - aboutEnd
        const scrollOffset3D = (scrollOffsetPx / Math.max(1, vh)) * height * 1.2
        const exitHolderY = holderGroundY + scrollOffset3D
        const exitStickY = seatedAboutY + scrollOffset3D

        if (exitHolderY < height * 0.85) {
          stickGroupRef.current.visible = true
          holderGroupRef.current.visible = true
          stickGroupRef.current.position.set(rightX, exitStickY, 0)
          stickGroupRef.current.rotation.set(0.02, scrollStickRotY, 0)
          stickGroupRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale)
          holderGroupRef.current.position.set(rightX, exitHolderY, 0)
          holderGroupRef.current.scale.set(responsiveScale, responsiveScale, responsiveScale)
        } else {
          // Off-screen above the viewport: strictly hidden!
          stickGroupRef.current.visible = false
          holderGroupRef.current.visible = false
        }
      }
    }

    // -------------------------------------------------------------
    // 4. The Swivvle / Roller (Revolving Formulation Packets)
    // Strictly invisible on Hero and About.
    // Scrolls IN from bottom WITH Page 3, then locks firmly at (0, 0, 0) at eye level!
    // Revolves ONLY when scrolling through the Products track.
    // -------------------------------------------------------------
    if (orbitGroupRef.current) {
      if (scrollY >= aboutEnd && scrollY <= productsEnd) {
        orbitGroupRef.current.visible = true

        let carouselY
        if (scrollY < productsTop) {
          // As Page 3 scrolls into the viewport from below, the carousel scrolls in WITH it
          const scrollInOffsetPx = productsTop - scrollY
          const scrollIn3D = -(scrollInOffsetPx / Math.max(1, vh)) * height * 0.9
          carouselY = scrollIn3D
        } else {
          // Locked firmly at eye level
          carouselY = 0.0
        }

        orbitGroupRef.current.position.set(0, carouselY, 0)
        orbitGroupRef.current.scale.set(carouselScale, carouselScale, carouselScale)
      } else {
        // Strictly invisible on Hero, About, and Contact
        orbitGroupRef.current.visible = false
      }
    }
  })

  return (
    <>
      {/* 1. Serene Morning Sanctuary Lighting */}
      <ambientLight intensity={1.15} color="#FFFBF5" />
      <directionalLight
        position={[3.8, 3.2, 2.8]}
        intensity={2.8}
        color="#FFF5E8"
      />
      <directionalLight
        position={[-3.2, 2.5, -2.0]}
        intensity={1.9}
        color="#F4ECE1"
      />
      <directionalLight
        position={[0, 0.4, 3.8]}
        intensity={1.2}
        color="#F8F3EC"
      />
      <pointLight
        position={[1.2, 0.8, -0.8]}
        color="#B88E58"
        intensity={1.6}
        distance={4.2}
        decay={2}
      />

      {/* Dedicated Warm Spot on Incense Bundle & Brass Vessel on Right (Page 2) */}
      <pointLight
        position={[rightX, holderGroundY + 0.35, 0.9]}
        color="#FFDC9E"
        intensity={2.8}
        distance={2.5}
      />

      {/* 2. Master Incense Stick Actor (Final Destination: Page 2 right side) */}
      <group ref={stickGroupRef}>
        <IncenseStick
          isLit={true}
          showSmoke={true}
          showBaseHolder={false}
          emberIntensity={1.2}
        />
      </group>

      {/* 3. Ceremonial Brass Holder Actor (Final Destination: Page 2 right side) */}
      <group ref={holderGroupRef}>
        <Holder3D />
      </group>

      {/* 4. The Swivvle / Roller (Centered at eye level, revolves ONLY on Page 3) */}
      <group ref={orbitGroupRef}>
        <FlavorOrbit
          onFrontFlavorChange={onFrontFlavorChange}
          customImageSrc={customImageSrc}
          scale={1.0}
        />
      </group>
    </>
  )
}

export default SceneController3D
