import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Deterministic pseudo-random number generator for React 19 pure renders.
 */
function pseudoRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Smoke
 * Production-grade continuous Japanese incense smoke plume.
 * Closely mirrors the user's reference photograph:
 * - Originates directly at the ember tip (local Y = 1.52)
 * - Initial straight laminar flow transitioning into graceful, organic S-curves
 * - Warm golden-amber illumination at the base that transitions to silky warm linen
 * - Feather-soft Gaussian edges with zero hard particle boundaries, dots, or bubbles
 * - 3-ribbon cross-section guaranteeing continuous volumetric body from all 3D viewing angles
 * - Disposes all procedural textures and geometries on unmount
 */
export function Smoke() {
  const ribbonMeshRefA = useRef(null)
  const ribbonMeshRefB = useRef(null)
  const ribbonMeshRefC = useRef(null)
  const puffsRef = useRef(null)

  const ribbonSegments = 64
  const puffCount = 20

  // 1. Procedural Silky Smoke Ribbon Texture (256x512)
  // Generates warm golden-amber illumination near the ember transitioning to silky linen
  const ribbonTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const imgData = ctx.createImageData(256, 512)
      const data = imgData.data

      for (let y = 0; y < 512; y++) {
        const v = y / 511 // 0 (bottom at ember) to 1 (top of plume)

        // Vertical alpha profile:
        // - Rapid rise to full silky density in the laminar zone (v = 0 -> 0.06)
        // - Rich continuous core (v = 0.06 -> 0.35)
        // - Graceful, gradual quadratic dissipation into deep charcoal (v = 0.35 -> 1.0)
        let vertAlpha
        if (v < 0.06) {
          vertAlpha = v / 0.06
        } else if (v < 0.35) {
          vertAlpha = 1.0
        } else {
          vertAlpha = Math.max(0, 1.0 - Math.pow((v - 0.35) / 0.65, 1.35))
        }

        // Color gradient across height (matching photographic reference):
        // Bottom (near ember): Warm radiant golden-amber [255, 175, 75]
        // Mid: Warm ivory linen [235, 222, 202]
        // Top: Translucent soft grey-linen [200, 195, 185]
        let r, g, b
        if (v < 0.22) {
          const t = v / 0.22
          r = Math.round(255 * (1 - t) + 205 * t)
          g = Math.round(165 * (1 - t) + 190 * t)
          b = Math.round(65 * (1 - t) + 185 * t)
        } else {
          const t = Math.min(1.0, (v - 0.22) / 0.78)
          r = Math.round(205 * (1 - t) + 155 * t)
          g = Math.round(190 * (1 - t) + 160 * t)
          b = Math.round(185 * (1 - t) + 172 * t)
        }

        for (let x = 0; x < 256; x++) {
          const u = (x - 128) / 128 // -1 to +1 across ribbon width
          // Horizontal Gaussian falloff: dense silky core, soft feathery translucent edges
          const horizAlpha = Math.exp(-u * u * 4.6)
          const finalAlpha = Math.min(255, Math.max(0, vertAlpha * horizAlpha * 215))

          const idx = (y * 256 + x) * 4
          data[idx + 0] = r
          data[idx + 1] = g
          data[idx + 2] = b
          data[idx + 3] = finalAlpha
        }
      }
      ctx.putImageData(imgData, 0, 0)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    return texture
  }, [])

  // 2. Procedural Soft Volumetric Cloud Puff Texture (128x128)
  const puffTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      gradient.addColorStop(0, 'rgba(255, 185, 95, 0.28)') // Soft warm amber core
      gradient.addColorStop(0.25, 'rgba(235, 215, 185, 0.16)')
      gradient.addColorStop(0.55, 'rgba(180, 170, 155, 0.06)')
      gradient.addColorStop(0.85, 'rgba(80, 75, 68, 0.015)')
      gradient.addColorStop(1, 'rgba(21, 20, 16, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 128, 128)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    return texture
  }, [])

  // Texture cleanup on unmount
  useEffect(() => {
    return () => {
      if (ribbonTexture) ribbonTexture.dispose()
      if (puffTexture) puffTexture.dispose()
    }
  }, [ribbonTexture, puffTexture])

  // 3. Ribbon Geometry Initialization (triangle strip quad-chain)
  const ribbonGeometryA = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const vertexCount = (ribbonSegments + 1) * 2
    const positions = new Float32Array(vertexCount * 3)
    const uvs = new Float32Array(vertexCount * 2)
    const indices = []

    for (let i = 0; i <= ribbonSegments; i++) {
      const v = i / ribbonSegments
      const y = 1.52 + v * 2.5

      positions[i * 6 + 0] = -0.015
      positions[i * 6 + 1] = y
      positions[i * 6 + 2] = 0
      uvs[i * 4 + 0] = 0
      uvs[i * 4 + 1] = v

      positions[i * 6 + 3] = 0.015
      positions[i * 6 + 4] = y
      positions[i * 6 + 5] = 0
      uvs[i * 4 + 2] = 1
      uvs[i * 4 + 3] = v

      if (i < ribbonSegments) {
        const a = i * 2
        const b = i * 2 + 1
        const c = (i + 1) * 2
        const d = (i + 1) * 2 + 1
        indices.push(a, b, c)
        indices.push(b, d, c)
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    return geo
  }, [ribbonSegments])

  const ribbonGeometryB = useMemo(() => {
    return ribbonGeometryA.clone()
  }, [ribbonGeometryA])

  const ribbonGeometryC = useMemo(() => {
    return ribbonGeometryA.clone()
  }, [ribbonGeometryA])

  // Clean geometries on unmount
  useEffect(() => {
    return () => {
      ribbonGeometryA.dispose()
      ribbonGeometryB.dispose()
      ribbonGeometryC.dispose()
    }
  }, [ribbonGeometryA, ribbonGeometryB, ribbonGeometryC])

  // 4. Volumetric Puff State (drifting along spine curve)
  const [puffPositions, puffVelocities, puffSeeds] = useMemo(() => {
    const pos = new Float32Array(puffCount * 3)
    const vel = new Float32Array(puffCount * 3)
    const seeds = new Float32Array(puffCount)

    for (let i = 0; i < puffCount; i++) {
      const progress = i / puffCount
      const y = 1.53 + progress * 2.4
      const s = i * 4 + 1

      pos[i * 3 + 0] = 0
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = 0

      vel[i * 3 + 0] = 0
      vel[i * 3 + 1] = 0.36 + pseudoRandom(s + 3) * 0.12
      vel[i * 3 + 2] = 0

      seeds[i] = pseudoRandom(s + 5)
    }
    return [pos, vel, seeds]
  }, [puffCount])

  // 5. Dynamic Frame Animation (multi-harmonic fluid curling)
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // A. Animate Crossed Ribbon Spines
    if (
      ribbonMeshRefA.current &&
      ribbonMeshRefB.current &&
      ribbonMeshRefC.current
    ) {
      const posA = ribbonMeshRefA.current.geometry.attributes.position.array
      const posB = ribbonMeshRefB.current.geometry.attributes.position.array
      const posC = ribbonMeshRefC.current.geometry.attributes.position.array

      for (let i = 0; i <= ribbonSegments; i++) {
        const v = i / ribbonSegments
        const y = 1.52 + v * 2.5

        // Plume width expansion: slender at ember (0.018), expanding to 0.32 at top
        const width = 0.018 + Math.pow(v, 1.25) * 0.28

        // Laminar base transition into fluid S-curve (matching reference photo)
        // First 15% is mostly straight laminar stream, then sweeping left and curling back
        const curlFactor = Math.pow(v, 1.35)
        const wave1 = Math.sin(time * 0.85 - v * 4.6) * 0.16 * curlFactor
        const wave2 = Math.sin(time * 0.42 - v * 2.0) * 0.08 * curlFactor
        const wave3 = Math.cos(time * 1.15 - v * 6.2) * 0.03 * Math.pow(v, 1.8)
        const curlX = wave1 + wave2 + wave3

        const curlZ =
          Math.cos(time * 0.75 - v * 4.2) * 0.08 * curlFactor +
          Math.sin(time * 0.32 + v * 1.6) * 0.04 * curlFactor

        // Ribbon A: Primary XY plane
        posA[i * 6 + 0] = curlX - width
        posA[i * 6 + 1] = y
        posA[i * 6 + 2] = curlZ

        posA[i * 6 + 3] = curlX + width
        posA[i * 6 + 4] = y
        posA[i * 6 + 5] = curlZ

        // Ribbon B: Offset by +55 degrees
        const angleB = (55 * Math.PI) / 180
        const cosB = Math.cos(angleB)
        const sinB = Math.sin(angleB)

        posB[i * 6 + 0] = curlX - width * cosB
        posB[i * 6 + 1] = y
        posB[i * 6 + 2] = curlZ - width * sinB

        posB[i * 6 + 3] = curlX + width * cosB
        posB[i * 6 + 4] = y
        posB[i * 6 + 5] = curlZ + width * sinB

        // Ribbon C: Offset by -55 degrees (ensuring true 3D volumetric fullness)
        const angleC = (-55 * Math.PI) / 180
        const cosC = Math.cos(angleC)
        const sinC = Math.sin(angleC)

        posC[i * 6 + 0] = curlX - width * cosC
        posC[i * 6 + 1] = y
        posC[i * 6 + 2] = curlZ - width * sinC

        posC[i * 6 + 3] = curlX + width * cosC
        posC[i * 6 + 4] = y
        posC[i * 6 + 5] = curlZ + width * sinC
      }

      ribbonMeshRefA.current.geometry.attributes.position.needsUpdate = true
      ribbonMeshRefB.current.geometry.attributes.position.needsUpdate = true
      ribbonMeshRefC.current.geometry.attributes.position.needsUpdate = true
    }

    // B. Animate Soft Volumetric Wisps (drifting along spine curve)
    if (puffsRef.current) {
      const puffAttr = puffsRef.current.geometry.attributes.position
      const pPos = puffAttr.array

      for (let i = 0; i < puffCount; i++) {
        const idx = i * 3
        pPos[idx + 1] += puffVelocities[idx + 1] * delta
        const height = pPos[idx + 1] - 1.52
        const normH = Math.min(1.0, Math.max(0.0, height / 2.5))

        const curlFactor = Math.pow(normH, 1.35)
        const curlX = Math.sin(time * 0.85 - normH * 4.6) * 0.16 * curlFactor
        const curlZ = Math.cos(time * 0.75 - normH * 4.2) * 0.08 * curlFactor

        pPos[idx + 0] = curlX + (puffSeeds[i] - 0.5) * 0.03 * normH
        pPos[idx + 2] = curlZ + (pseudoRandom(i + 13) - 0.5) * 0.03 * normH

        // Recycle when reaching plume ceiling
        if (pPos[idx + 1] > 4.02) {
          pPos[idx + 0] = 0
          pPos[idx + 1] = 1.53
          pPos[idx + 2] = 0
        }
      }
      puffAttr.needsUpdate = true
    }
  })

  return (
    <group>
      {/* 1. Primary Continuous Ribbon Spine */}
      <mesh ref={ribbonMeshRefA} geometry={ribbonGeometryA}>
        <meshBasicMaterial
          map={ribbonTexture}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* 2. Secondary Cross Ribbon Spine (Offset +55°) */}
      <mesh ref={ribbonMeshRefB} geometry={ribbonGeometryB}>
        <meshBasicMaterial
          map={ribbonTexture}
          transparent
          opacity={0.72}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* 3. Tertiary Cross Ribbon Spine (Offset -55°) */}
      <mesh ref={ribbonMeshRefC} geometry={ribbonGeometryC}>
        <meshBasicMaterial
          map={ribbonTexture}
          transparent
          opacity={0.62}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* 4. Soft Volumetric Cloud Wisps (no dots, pure ambient haze) */}
      <points ref={puffsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[puffPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.52}
          map={puffTexture}
          transparent
          opacity={0.24}
          depthWrite={false}
          blending={THREE.NormalBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default Smoke
