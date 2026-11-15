import { IGNITION_CONTENT } from '../../utils/constants'

/**
 * IgnitionSection
 * Opening screen where user sees the burning matchstick and unlit incense stick.
 * Guides the user to scroll to bring them into contact and ignite the sacred incense.
 */
export function IgnitionSection() {
  return (
    <section
      id="ignition"
      className="relative min-h-[100vh] w-full flex flex-col justify-between px-6 sm:px-12 pt-28 sm:pt-36 pb-12 pointer-events-none"
    >
      {/* Top Header Prompt */}
      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center space-x-3 mb-3">
          <span className="w-8 h-[1px] bg-[#C5A880]/70" />
          <span className="eyebrow tracking-[0.32em] text-[10px] sm:text-[11px] text-[#C5A880]">
            {IGNITION_CONTENT.eyebrow}
          </span>
          <span className="w-8 h-[1px] bg-[#C5A880]/70" />
        </div>

        <h1 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#F2EEE5] uppercase tracking-[0.05em] mb-4">
          {IGNITION_CONTENT.headline}
        </h1>

        <p className="font-editorial-sans text-xs sm:text-sm text-[#9E9A90] font-light tracking-[0.16em] max-w-sm mx-auto leading-relaxed">
          {IGNITION_CONTENT.instruction}
        </p>
      </div>

      {/* Bottom Scroll Guide */}
      <div className="flex flex-col items-center justify-center space-y-3 pb-4">
        <span className="text-[10px] uppercase tracking-[0.32em] text-[#C5A880] animate-pulse">
          {IGNITION_CONTENT.hint}
        </span>
        <div className="w-[1px] h-10 bg-[#302D26] overflow-hidden relative">
          <div className="w-full h-3 bg-[#FF7814] absolute top-0 animate-[bounce_2s_infinite]" />
        </div>
      </div>
    </section>
  )
}

export default IgnitionSection
