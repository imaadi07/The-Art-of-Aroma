import { RITUAL_CONTENT } from '../../utils/constants'
import { Container } from '../../components/common/Container'

/**
 * RitualSection
 * Second page: As user scrolls through this section, the incense stick moves
 * with the scroll and is placed securely into the ceremonial brass holder.
 * Features photographic reference of the Monko ash planting ceremony.
 */
export function RitualSection() {
  return (
    <section
      id="ritual"
      className="relative min-h-[120vh] w-full flex flex-col justify-center py-28 sm:py-36 pointer-events-none"
    >
      <Container>
        <div className="max-w-xl lg:max-w-2xl text-left pointer-events-auto">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center space-x-3">
            <span className="w-6 h-[1px] bg-[#C5A880]/70" />
            <span className="eyebrow tracking-[0.28em] text-[10px] sm:text-[11px] text-[#C5A880]">
              {RITUAL_CONTENT.eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#F2EEE5] leading-[1.08] mb-6">
            {RITUAL_CONTENT.heading}
          </h2>

          {/* Subtitle */}
          <p className="font-editorial-serif italic text-lg sm:text-xl md:text-2xl text-[#C5A880] font-light leading-relaxed mb-6">
            {RITUAL_CONTENT.subtitle}
          </p>

          {/* Description */}
          <p className="font-editorial-sans text-xs sm:text-sm md:text-base text-[#9E9A90] font-light leading-relaxed mb-8 max-w-lg">
            {RITUAL_CONTENT.description}
          </p>

          {/* Ceremonial Photo Inset Card */}
          <div className="border border-[#302D26] bg-[#1A1914] p-3.5 mb-8 max-w-lg flex items-center space-x-4">
            <div className="w-28 h-20 shrink-0 overflow-hidden border border-[#302D26]/80 bg-[#151410]">
              <img
                src="/images/ritual-brass-bowl.jpg"
                alt="Planting incense stick into antique brass ash bowl"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#C5A880] block mb-1">
                CEREMONY PLATE // MONKO
              </span>
              <p className="text-xs text-[#D9D5CC] font-editorial-sans font-light leading-snug">
                The master gently plants the ignited stick into compacted sacred white ash inside the hand-turned brass koro.
              </p>
            </div>
          </div>

          {/* 3 Key Ceremony Metrics */}
          <div className="grid grid-cols-3 gap-4 border-t border-b border-[#302D26] py-6 mb-8 max-w-lg">
            {RITUAL_CONTENT.stats.map((stat) => (
              <div key={stat.label}>
                <span className="font-editorial-serif text-xl sm:text-2xl text-[#F2EEE5] block">
                  {stat.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#9E9A90] block mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Alignment status indicator */}
          <div className="inline-flex items-center space-x-3 text-[10px] uppercase tracking-[0.26em] text-[#C5A880]">
            <span className="w-2 h-2 rounded-full bg-[#FF7814] animate-ping" />
            <span>Ceremonial vessel alignment active</span>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default RitualSection
