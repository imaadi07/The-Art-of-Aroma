import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Smoke } from './Smoke'

/**
 * 7-Stick Organic Incense Bundle Specification
 * Directly referenced from the user's uploaded photograph:
 * "Lavender Incense Stick Combo ... for Pooja & Relaxation"
 *
 * Characteristics:
 * - 7 sticks gathered together at the base inside the ceremonial brass holder well.
 * - Center master stick stands tall and upright (1.28m length).
 * - 6 outer sticks fan outward gracefully at natural tilt angles (2.5° to 5.5°).
 * - Naturally staggered heights (1.18m to 1.28m) and organic azimuth spacing.
 * - Authentic lavender / plum fragrant incense paste (#682642 to #581E36).
 * - Slender natural bamboo stems at base (#D2AA72).
 * - Multiple burning glowing ember tips with organic Blackbody combustion flicker.
 * - Silky continuous smoke plume rising and swirling gracefully into the air.
 */
const BUNDLE_STICKS = [
  // 1. Master Center Stick (tallest, upright focal stick)
  {
    id: 'center',
    baseX: 0,
    baseZ: 0,
    rotX: 0.012,
    rotZ: -0.008,
    bambooHeight: 0.22,
    bodyLength: 1.28,
    pasteColor: '#6B2644', // rich lavender plum
    isLit: true,
    emberY: 1.50,
  },
  // 2. Front-Right Stick (fanned outward toward viewer)
  {
    id: 'front-right',
    baseX: 0.024,
    baseZ: 0.018,
    rotX: 0.054,
    rotZ: 0.046,
    bambooHeight: 0.21,
    bodyLength: 1.22,
    pasteColor: '#5E203A',
    isLit: true,
    emberY: 1.44,
  },
  // 3. Back-Right Stick
  {
    id: 'back-right',
    baseX: 0.022,
    baseZ: -0.022,
    rotX: -0.048,
    rotZ: 0.052,
    bambooHeight: 0.23,
    bodyLength: 1.25,
    pasteColor: '#722A4A',
    isLit: true,
    emberY: 1.47,
  },
  // 4. Back-Left Stick
  {
    id: 'back-left',
    baseX: -0.021,
    baseZ: -0.023,
    rotX: -0.056,
    rotZ: -0.045,
    bambooHeight: 0.20,
    bodyLength: 1.20,
    pasteColor: '#64223E',
    isLit: true,
    emberY: 1.41,
  },
  // 5. Front-Left Stick
  {
    id: 'front-left',
    baseX: -0.023,
    baseZ: 0.017,
    rotX: 0.052,
    rotZ: -0.048,
    bambooHeight: 0.22,
    bodyLength: 1.24,
    pasteColor: '#5B1E36',
    isLit: true,
    emberY: 1.45,
  },
  // 6. Right Lateral Stick
  {
    id: 'right-lateral',
    baseX: 0.030,
    baseZ: -0.002,
    rotX: 0.010,
    rotZ: 0.062,
    bambooHeight: 0.19,
    bodyLength: 1.18,
    pasteColor: '#6E2846',
    isLit: true,
    emberY: 1.38,
  },
  // 7. Left Lateral Stick
  {
    id: 'left-lateral',
    baseX: -0.028,
    baseZ: 0.002,
    rotX: -0.012,
    rotZ: -0.060,
    bambooHeight: 0.21,
    bodyLength: 1.21,
    pasteColor: '#752D4E',
    isLit: true,
    emberY: 1.42,
  },
]

/**
 * SingleBundleStick
 * Sub-component representing one handcrafted incense stick within the bundle.
 */
function SingleBundleStick({ spec, isLit, emberIntensity, emberGlowTexture }) {
  const emberMeshRef = useRef(null)
  const emberCoreRef = useRef(null)
  const emberTipRef = useRef(null)
  const emberLightRef = useRef(null)
  const glowSpriteRef = useRef(null)

  const halfBody = spec.bodyLength / 2
  const bodyCenterY = spec.bambooHeight + halfBody
  const tipBaseY = spec.bambooHeight + spec.bodyLength

  useFrame((state) => {
    if (!isLit || !spec.isLit) {
      if (emberLightRef.current) emberLightRef.current.intensity = 0
      if (glowSpriteRef.current) glowSpriteRef.current.material.opacity = 0
      return
    }

    // Micro phase offset per stick for authentic organic desynchronized combustion
    const phaseOffset = spec.baseX * 20 + spec.baseZ * 30
    const t = state.clock.elapsedTime * 2.2 + phaseOffset
    const organicFlicker =
      (0.86 +
        0.14 * Math.sin(t * 1.8) +
        0.08 * Math.sin(t * 4.4 + 1.2) +
        0.04 * Math.sin(t * 8.8 + 2.1)) *
      emberIntensity

    if (emberMeshRef.current) {
      emberMeshRef.current.material.emissiveIntensity = organicFlicker * 3.4
    }
    if (emberCoreRef.current) {
      emberCoreRef.current.material.emissiveIntensity = organicFlicker * 4.8
    }
    if (emberTipRef.current) {
      emberTipRef.current.material.emissiveIntensity = organicFlicker * 6.0
    }
    if (emberLightRef.current) {
      emberLightRef.current.intensity = organicFlicker * (spec.id === 'center' ? 2.2 : 0.8)
    }
    if (glowSpriteRef.current) {
      const s = (spec.id === 'center' ? 0.12 : 0.08) * (0.95 + organicFlicker * 0.1)
      glowSpriteRef.current.scale.set(s, s, 1)
      glowSpriteRef.current.material.opacity = 0.42 * organicFlicker
    }
  })

  return (
    <group
      position={[spec.baseX, 0, spec.baseZ]}
      rotation={[spec.rotX, 0, spec.rotZ]}
    >
      {/* 1. Slender Natural Bamboo Core Stem */}
      <mesh position={[0, spec.bambooHeight / 2, 0]}>
        <cylinderGeometry args={[0.009, 0.010, spec.bambooHeight, 12]} />
        <meshStandardMaterial
          color="#D2AA72"
          roughness={0.65}
          metalness={0.08}
        />
      </mesh>

      {/* 2. Main Aromatic Incense Body (Lavender / Plum Paste from Reference) */}
      <mesh position={[0, bodyCenterY, 0]}>
        <cylinderGeometry args={[0.017, 0.018, spec.bodyLength, 16]} />
        <meshStandardMaterial
          color={spec.pasteColor}
          roughness={0.62}
          metalness={0.08}
        />
      </mesh>

      {/* 3. Charred Boundary Ring */}
      <mesh position={[0, tipBaseY + 0.006, 0]}>
        <cylinderGeometry args={[0.0175, 0.018, 0.012, 14]} />
        <meshStandardMaterial
          color="#1A0D12"
          roughness={0.96}
        />
      </mesh>

      {/* 4. Active Burning Ember - Outer Combustion Ring */}
      <mesh ref={emberMeshRef} position={[0, tipBaseY + 0.016, 0]}>
        <cylinderGeometry args={[0.017, 0.0175, 0.014, 14]} />
        <meshStandardMaterial
          color={isLit ? '#450B18' : '#2D2024'}
          emissive="#FF4500"
          emissiveIntensity={isLit ? 3.4 : 0}
          roughness={0.3}
        />
      </mesh>

      {/* 5. Incandescent Thermal Core Ring */}
      <mesh ref={emberCoreRef} position={[0, tipBaseY + 0.024, 0]}>
        <cylinderGeometry args={[0.014, 0.016, 0.012, 14]} />
        <meshStandardMaterial
          color={isLit ? '#661400' : '#261C18'}
          emissive="#FFA500"
          emissiveIntensity={isLit ? 4.8 : 0}
          roughness={0.2}
        />
      </mesh>

      {/* 6. White-Hot Incandescent Micro Filament Tip */}
      <mesh ref={emberTipRef} position={[0, tipBaseY + 0.031, 0]}>
        <sphereGeometry args={[0.0065, 12, 12]} />
        <meshStandardMaterial
          color={isLit ? '#FFF8E2' : '#2D2024'}
          emissive="#FFF8E0"
          emissiveIntensity={isLit ? 6.0 : 0}
          roughness={0.12}
        />
      </mesh>

      {/* 7. Porous Mineral Ash Cap */}
      <mesh position={[0, tipBaseY + 0.042, 0]}>
        <coneGeometry args={[0.012, 0.022, 12]} />
        <meshStandardMaterial
          color="#9C948B"
          roughness={0.96}
        />
      </mesh>

      {/* 8. Luminous Ember Halo Sprite */}
      <sprite
        ref={glowSpriteRef}
        position={[0, tipBaseY + 0.03, 0]}
        scale={[0.11, 0.11, 1]}
        visible={isLit}
      >
        <spriteMaterial
          map={emberGlowTexture}
          transparent
          opacity={isLit ? 0.42 : 0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* 9. Dedicated Local Warm Point Light for Ember */}
      <pointLight
        ref={emberLightRef}
        position={[0, tipBaseY + 0.03, 0]}
        color="#FF821E"
        distance={1.6}
        intensity={isLit ? 1.8 : 0}
        decay={2}
      />
    </group>
  )
}

/**
 * IncenseStick (Bundle / Bunch of Incense Sticks)
 * Production-quality ceremonial incense stick bundle.
 * Props:
 * - position: [x, y, z]
 * - rotation: [x, y, z]
 * - scale: number or [x, y, z]
 * - isLit: boolean (whether the bundle is ignited)
 * - showSmoke: boolean (whether smoke is rising from the bundle)
 * - emberIntensity: number (multiplier for glow intensity)
 */
export function IncenseStick({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  isLit = true,
  showSmoke = true,
  emberIntensity = 1.0,
}) {
  const groupRef = useRef(null)

  // Procedural Soft Glow Halo Texture for Ember Tips
  const emberGlowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, 'rgba(255, 130, 30, 0.98)')
      gradient.addColorStop(0.25, 'rgba(255, 95, 10, 0.58)')
      gradient.addColorStop(0.6, 'rgba(190, 45, 0, 0.16)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 64, 64)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    return texture
  }, [])

  useEffect(() => {
    return () => {
      if (emberGlowTexture) emberGlowTexture.dispose()
    }
  }, [emberGlowTexture])

  // Micro-sway of still temple sanctuary air
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.28) * 0.0006
    }
  })

  const s = Array.isArray(scale) ? scale : [scale, scale, scale]

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={s}>
      {/* 7-Stick Organic Fanned Bundle */}
      {BUNDLE_STICKS.map((spec) => (
        <SingleBundleStick
          key={spec.id}
          spec={spec}
          isLit={isLit}
          emberIntensity={emberIntensity}
          emberGlowTexture={emberGlowTexture}
        />
      ))}

      {/* Center Unified Silky Incense Smoke Plume */}
      {isLit && showSmoke && <Smoke />}
    </group>
  )
}

export default IncenseStick
