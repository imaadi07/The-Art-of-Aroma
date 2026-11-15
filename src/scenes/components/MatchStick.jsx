import { useRef } from 'react'
import { Flame } from './Flame'

/**
 * MatchStick
 * Slender, realistic wooden matchstick with sulfur tip and burning flame.
 * Props:
 * - position: [x, y, z]
 * - rotation: [x, y, z]
 * - flameActive: boolean (whether the match is burning)
 * - scale: number
 */
export function MatchStick({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  flameActive = true,
  scale = 1.0,
}) {
  const matchGroupRef = useRef(null)

  return (
    <group
      ref={matchGroupRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      {/* 1. Natural Aspen Wood Shaft */}
      <mesh position={[0, -0.38, 0]}>
        <boxGeometry args={[0.022, 0.72, 0.022]} />
        <meshStandardMaterial
          color="#D2BA93"
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>

      {/* 2. Charred Wood Transition (Just below head) */}
      <mesh position={[0, -0.012, 0]}>
        <boxGeometry args={[0.0225, 0.045, 0.0225]} />
        <meshStandardMaterial
          color="#2B2117"
          roughness={0.92}
        />
      </mesh>

      {/* 3. Sulfur Combustion Head (Dark crimson with charred texture) */}
      <mesh position={[0, 0.028, 0]}>
        <sphereGeometry args={[0.025, 20, 20]} />
        <meshStandardMaterial
          color="#8B1E1E"
          roughness={0.65}
          metalness={0.12}
        />
      </mesh>

      {/* 4. Active Burning Flame */}
      <Flame active={flameActive} scale={1.0} />
    </group>
  )
}

export default MatchStick
