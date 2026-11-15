import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PRODUCT_COLLECTION } from '../../utils/constants'
import { getSectionMetrics, getOrbitPhase } from '../../utils/scrollState'

/**
 * OrbitGlassImage
 * Square, wide and big direct formulation artwork plaque with true glassmorphism.
 *
 * User Requirement:
 * - Prominent exhibition scale: wide and big (1.24m x 1.24m), commanding central presence.
 * - Gap to text is achieved by pushing editorial text to outer edges, NOT by shrinking the card!
 * - Non-front facets softly translucent (opacity 0.25) so they don't distract or visually crowd.
 * - Front face brilliantly lit with warm amber focal glow.
 * - NO plinth holder, NO album container.
 */
function OrbitGlassImage({ flavor, isFront, angle, customImageSrc }) {
  const meshRef = useRef(null)
  const [texture, setTexture] = useState(null)

  const packetUrl = customImageSrc && isFront ? customImageSrc : flavor.packetImage

  useEffect(() => {
    let active = true
    const loader = new THREE.TextureLoader()
    loader.load(
      packetUrl,
      (tex) => {
        if (!active) {
          tex.dispose()
          return
        }
        tex.generateMipmaps = false
        tex.minFilter = THREE.LinearFilter
        setTexture(tex)
      },
      undefined,
      (err) => {
        console.warn('Failed to load square formulation texture:', flavor.id, err)
      }
    )

    return () => {
      active = false
    }
  }, [packetUrl, flavor.id])

  // Front face material with loaded square formulation artwork
  const frontMaterial = useMemo(() => {
    if (!texture) {
      return new THREE.MeshStandardMaterial({
        color: flavor.colorHex,
        roughness: 0.5,
        transparent: !isFront,
        opacity: isFront ? 1.0 : 0.35,
      })
    }
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.28,
      metalness: 0.12,
      side: THREE.FrontSide,
      transparent: !isFront,
      opacity: isFront ? 1.0 : 0.35,
    })
  }, [texture, flavor.colorHex, isFront])

  // Frosted washi glass substrate material
  const glassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FAF7F0',
      roughness: 0.25,
      metalness: 0.15,
      transparent: true,
      opacity: isFront ? 0.92 : 0.40,
    })
  }, [isFront])

  const boxMaterials = useMemo(() => {
    return [
      glassMaterial, // right
      glassMaterial, // left
      glassMaterial, // top
      glassMaterial, // bottom
      frontMaterial, // front (+Z)
      glassMaterial, // back (-Z)
    ]
  }, [frontMaterial, glassMaterial])

  return (
    <group
      rotation={[0, angle, 0]}
      scale={isFront ? [1.05, 1.05, 1.05] : [0.88, 0.88, 0.88]}
    >
      {/* 1. Subtle Outer Warm Antique-Brass Bezel Rim */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.26, 1.26, 0.022]} />
        <meshStandardMaterial
          color="#C4A882"
          metalness={0.85}
          roughness={0.28}
          transparent={true}
          opacity={isFront ? 0.55 : 0.20}
        />
      </mesh>

      {/* 2. Direct Square Glassmorphic Image Plaque - Wide & Big (1.24m x 1.24m x 0.024m) */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        material={boxMaterials}
      >
        <boxGeometry args={[1.24, 1.24, 0.024]} />
      </mesh>

      {/* 3. Dedicated Warm Accent Glow when facing front */}
      {isFront && (
        <pointLight
          position={[0, 0.05, 0.55]}
          color={flavor.accentColor}
          intensity={1.8}
          distance={2.2}
        />
      )}
    </group>
  )
}

/**
 * FlavorOrbit (The Swivvle / Roller)
 * 3D revolving carousel where the 4 formulation SQUARE DIRECT IMAGES orbit in 3D.
 *
 * User Constraints:
 * - Wide and big exhibition scale (1.24m square).
 * - Floating cards separated by an airy gap ("apart just by a bit", radius = 0.78m, not a closed square).
 * - Non-front facets softly translucent.
 * - Revolves ONLY when scrolling through the Products page.
 * - Exact 1-to-1 mathematical sync with the active formulation text via getOrbitPhase.
 */
export function FlavorOrbit({
  onFrontFlavorChange,
  customImageSrc = null,
  position = [0, 0, 0],
  scale = 1.0,
}) {
  const carouselGroupRef = useRef(null)
  const lastActiveIndexRef = useRef(-1)
  const [activeFrontIndex, setActiveFrontIndex] = useState(0)

  // Orbit radius: 0.78m leaves an airy ~20cm gap between adjacent cards ("apart just by a bit")
  const radius = 0.78
  const count = PRODUCT_COLLECTION.length

  useFrame((_, delta) => {
    if (!carouselGroupRef.current) return

    const metrics = getSectionMetrics()
    const { productsProgress, scrollY, productsTop, productsEnd } = metrics

    // If past products, stop
    if (scrollY > productsEnd) return

    // Before Products Section: Stay stationary at angle 0 (Formulation 01 Kyara facing front)
    if (scrollY < productsTop) {
      carouselGroupRef.current.rotation.y = THREE.MathUtils.damp(
        carouselGroupRef.current.rotation.y,
        0,
        10,
        delta
      )
      if (lastActiveIndexRef.current !== 0) {
        lastActiveIndexRef.current = 0
        setActiveFrontIndex(0)
        if (onFrontFlavorChange) {
          onFrontFlavorChange(PRODUCT_COLLECTION[0], 0)
        }
      }
      return
    }

    // Inside Products Section: Revolve precisely according to getOrbitPhase
    const { rotationY, activeIndex } = getOrbitPhase(productsProgress)

    carouselGroupRef.current.rotation.y = THREE.MathUtils.damp(
      carouselGroupRef.current.rotation.y,
      rotationY,
      12,
      delta
    )

    if (activeIndex !== lastActiveIndexRef.current && activeIndex < count) {
      lastActiveIndexRef.current = activeIndex
      setActiveFrontIndex(activeIndex)
      if (onFrontFlavorChange) {
        onFrontFlavorChange(PRODUCT_COLLECTION[activeIndex], activeIndex)
      }
    }
  })

  // Pre-calculate packet positions around circle
  const packets = PRODUCT_COLLECTION.map((flavor, index) => {
    const angle = (index / count) * Math.PI * 2
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    return { flavor, index, angle, x, z }
  })

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Revolving Monolith of the 4 Formulation Direct Images */}
      <group ref={carouselGroupRef}>
        {packets.map(({ flavor, index, angle, x, z }) => {
          const isFront = index === activeFrontIndex

          return (
            <group key={flavor.id} position={[x, 0, z]}>
              <OrbitGlassImage
                flavor={flavor}
                isFront={isFront}
                angle={angle}
                customImageSrc={customImageSrc}
              />
            </group>
          )
        })}
      </group>
    </group>
  )
}

export default FlavorOrbit
