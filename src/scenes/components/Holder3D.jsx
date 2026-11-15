import { useRef } from 'react'

/**
 * Holder3D
 * Authentic antique brass ceremonial Koh-do incense burner bowl (Koro),
 * modelled directly after the ceremonial vessel in the photographic reference:
 * - Rounded antique brass cauldron with warm hammered specular sheen (#C8A66D)
 * - Flared upper lip with side ceremonial ring loops
 * - Broad bed of packed ceremonial grey ash where the incense stick is planted
 * - Low stepped brass pedestal base
 */
export function Holder3D({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
}) {
  const holderGroupRef = useRef(null)

  return (
    <group
      ref={holderGroupRef}
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      {/* 1. Low Stepped Brass Pedestal Base Ring */}
      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry args={[0.26, 0.28, 0.035, 36]} />
        <meshStandardMaterial
          color="#9E7E48"
          metalness={0.92}
          roughness={0.32}
        />
      </mesh>

      {/* 2. Main Cauldron Belly (Rounded antique brass bowl body) */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.39, 0.32, 0.12, 36]} />
        <meshStandardMaterial
          color="#C5A469"
          metalness={0.93}
          roughness={0.24}
        />
      </mesh>

      {/* 3. Upper Taper & Flared Lip Rim */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.38, 0.40, 0.04, 36]} />
        <meshStandardMaterial
          color="#D8B87C"
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>

      {/* 4. Left Ornamental Ring Handle */}
      <mesh position={[-0.41, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.045, 0.012, 16, 24]} />
        <meshStandardMaterial
          color="#C5A469"
          metalness={0.92}
          roughness={0.25}
        />
      </mesh>

      {/* 5. Right Ornamental Ring Handle */}
      <mesh position={[0.41, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.045, 0.012, 16, 24]} />
        <meshStandardMaterial
          color="#C5A469"
          metalness={0.92}
          roughness={0.25}
        />
      </mesh>

      {/* 6. Deep Ceremonial White & Charcoal Ash Bed (Where stick is inserted) */}
      <mesh position={[0, 0.042, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.018, 36]} />
        <meshStandardMaterial
          color="#6E6960"
          roughness={0.96}
          metalness={0.04}
        />
      </mesh>

      {/* 7. Inner Ash Texture Ring */}
      <mesh position={[0, 0.048, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.008, 32]} />
        <meshStandardMaterial
          color="#857F75"
          roughness={0.98}
          metalness={0.02}
        />
      </mesh>

      {/* 8. Center Insertion Well in Ash (Cradles the 7-stick incense bundle) */}
      <mesh position={[0, 0.051, 0]}>
        <cylinderGeometry args={[0.048, 0.052, 0.012, 24]} />
        <meshBasicMaterial color="#1E1915" />
      </mesh>
    </group>
  )
}

export default Holder3D
