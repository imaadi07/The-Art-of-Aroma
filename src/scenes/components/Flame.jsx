import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Flame
 * Organic teardrop 3D burning flame for the matchstick.
 * Features:
 * - Smooth Lathe teardrop geometry with natural curvature
 * - Multi-layered incandescent combustion zone (hot cyan base -> radiant golden amber -> white-hot core)
 * - Organic multi-harmonic wind flicker & thermal stretch
 * - Dynamic heat haze sprite and flickering warmth point light
 */
export function Flame({ active = true, scale = 1.0 }) {
  const flameGroupRef = useRef(null)
  const outerFlameRef = useRef(null)
  const innerFlameRef = useRef(null)
  const blueBaseRef = useRef(null)
  const flameLightRef = useRef(null)
  const glowSpriteRef = useRef(null)

  // 1. Procedural Teardrop Flame Curvature
  const outerFlameGeo = useMemo(() => {
    const points = []
    const segments = 16
    for (let i = 0; i <= segments; i++) {
      const t = i / segments // 0 (bottom) to 1 (top)
      const y = t * 0.15
      // Teardrop profile: narrow at base, bulbous at 25%, tapering to tip
      let r
      if (t < 0.25) {
        r = Math.sin((t / 0.25) * (Math.PI / 2)) * 0.038
      } else {
        r = Math.cos(((t - 0.25) / 0.75) * (Math.PI / 2)) * 0.038
      }
      points.push(new THREE.Vector2(Math.max(0.001, r), y))
    }
    return new THREE.LatheGeometry(points, 24)
  }, [])

  const innerFlameGeo = useMemo(() => {
    const points = []
    const segments = 14
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const y = t * 0.10
      let r
      if (t < 0.25) {
        r = Math.sin((t / 0.25) * (Math.PI / 2)) * 0.022
      } else {
        r = Math.cos(((t - 0.25) / 0.75) * (Math.PI / 2)) * 0.022
      }
      points.push(new THREE.Vector2(Math.max(0.001, r), y))
    }
    return new THREE.LatheGeometry(points, 20)
  }, [])

  // 2. Procedural Radial Glow Texture for the flame aura
  const flameGlowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      gradient.addColorStop(0, 'rgba(255, 185, 45, 0.95)')
      gradient.addColorStop(0.25, 'rgba(255, 110, 15, 0.55)')
      gradient.addColorStop(0.65, 'rgba(200, 45, 0, 0.15)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 128, 128)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    return texture
  }, [])

  useEffect(() => {
    return () => {
      outerFlameGeo.dispose()
      innerFlameGeo.dispose()
      if (flameGlowTexture) flameGlowTexture.dispose()
    }
  }, [outerFlameGeo, innerFlameGeo, flameGlowTexture])

  useFrame((state, delta) => {
    if (!flameGroupRef.current) return

    const time = state.clock.elapsedTime * 6.8

    // Smooth visibility transition based on active state
    const targetScale = active ? scale : 0.0001
    flameGroupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 14
    )

    if (!active && flameGroupRef.current.scale.y < 0.01) {
      flameGroupRef.current.visible = false
      return
    } else {
      flameGroupRef.current.visible = true
    }

    // Organic wind and draft sway
    const swayX = Math.sin(time * 0.95) * 0.05 + Math.cos(time * 2.4) * 0.02
    const swayZ = Math.cos(time * 1.15) * 0.04 + Math.sin(time * 1.8) * 0.02
    flameGroupRef.current.rotation.z = swayX
    flameGroupRef.current.rotation.x = swayZ

    // Thermal stretch and flicker
    const stretch = 1.0 + Math.sin(time * 1.9) * 0.12 + Math.sin(time * 4.4) * 0.06

    if (outerFlameRef.current) {
      outerFlameRef.current.scale.set(
        1.0 - (stretch - 1.0) * 0.35,
        stretch,
        1.0 - (stretch - 1.0) * 0.35
      )
    }

    if (innerFlameRef.current) {
      innerFlameRef.current.scale.set(
        0.8,
        0.85 * stretch,
        0.8
      )
    }

    // Flicker light intensity
    if (flameLightRef.current) {
      const flicker = 0.86 + Math.sin(time * 3.5) * 0.14 + Math.sin(time * 8.2) * 0.08
      flameLightRef.current.intensity = flicker * 3.2 * (flameGroupRef.current.scale.y / scale)
    }

    if (glowSpriteRef.current) {
      const s = 0.28 * (0.9 + Math.sin(time * 2.8) * 0.1) * scale
      glowSpriteRef.current.scale.set(s, s, 1)
    }
  })

  return (
    <group ref={flameGroupRef} position={[0, 0.035, 0]}>
      {/* 1. Base Combustion Zone (Subtle Hot Blue / Violet) */}
      <mesh ref={blueBaseRef} position={[0, 0.012, 0]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial
          color="#00D2FF"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Outer Teardrop Flame Body (Luminous Golden Orange) */}
      <mesh ref={outerFlameRef} geometry={outerFlameGeo} position={[0, 0.005, 0]}>
        <meshStandardMaterial
          color="#FF6B00"
          emissive="#FFA000"
          emissiveIntensity={3.8}
          roughness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* 3. Inner White-Hot Thermal Core */}
      <mesh ref={innerFlameRef} geometry={innerFlameGeo} position={[0, 0.008, 0]}>
        <meshBasicMaterial
          color="#FFF8E7"
          transparent
          opacity={0.96}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Radiating Ambient & Direct Warmth */}
      <pointLight
        ref={flameLightRef}
        position={[0, 0.07, 0]}
        color="#FF951E"
        distance={2.4}
        intensity={3.2}
        decay={2}
      />

      {/* 5. Soft Atmospheric Heat Glow Sprite */}
      <sprite ref={glowSpriteRef} position={[0, 0.065, 0]}>
        <spriteMaterial
          map={flameGlowTexture}
          transparent
          opacity={0.65}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}

export default Flame
