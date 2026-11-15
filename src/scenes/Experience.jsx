import { Suspense, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { SceneController3D } from './SceneController3D'

/**
 * WebGLErrorBoundary
 * Graceful fallback if WebGL is unsupported or disabled on the client device.
 */
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center text-center p-8 bg-[#F8F5EE]">
          <div className="max-w-xs border border-[#DDD4C7] p-6 bg-white/80 shadow-[0_8px_30px_rgba(90,70,50,0.06)]">
            <span className="font-editorial-serif text-[#241F1C] text-lg block mb-2">
              The Art of Aroma
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8A6B42] block">
              Ceremonial Scent Sanctuary
            </span>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Experience
 * Master full-viewport 3D canvas layer:
 * - Fixed background with single WebGL context
 * - Clamped DPR [1, 1.5] for high performance (60 FPS on 8GB RAM devices)
 * - Seamlessly coordinated with page scroll via SceneController3D
 */
export function Experience({
  className = '',
  onSmokeDensityChange,
  onFrontFlavorChange,
  customImageSrc = null,
}) {
  return (
    <WebGLErrorBoundary>
      <div className={`relative h-full w-full select-none ${className}`}>
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 35 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
        >
          <Suspense fallback={null}>
            <SceneController3D
              onSmokeDensityChange={onSmokeDensityChange}
              onFrontFlavorChange={onFrontFlavorChange}
              customImageSrc={customImageSrc}
            />
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  )
}

export default Experience
