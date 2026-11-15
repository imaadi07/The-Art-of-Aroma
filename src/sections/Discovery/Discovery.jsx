import { Container } from '../../components/common/Container'
import { DISCOVERY_CONTENT } from '../../utils/constants'

/**
 * Discovery / Collection Section
 * Recreated precisely from the visual references.
 * Anchors:
 * - id="discover"
 * - id="collection"
 * - id="shop"
 */
export function Discovery() {
  return (
    <section
      id="discover"
      className="relative py-28 md:py-36 bg-[#151410] border-t border-[#302D26]"
    >
      {/* Anchor targets for collection and shop */}
      <div id="collection" className="absolute -top-20" />
      <div id="shop" className="absolute -top-20" />

      <Container>
        {/* Editorial Header */}
        <div className="max-w-3xl mb-20 md:mb-24">
          <span className="eyebrow block mb-4 text-[#C5A880]">
            {DISCOVERY_CONTENT.eyebrow}
          </span>
          <h2 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#F2EEE5] leading-[1.08] mb-6">
            {DISCOVERY_CONTENT.heading}
          </h2>
          <p className="font-editorial-sans text-[#9E9A90] text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl">
            {DISCOVERY_CONTENT.description}
          </p>
        </div>

        {/* Three Equal-Width Editorial Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#302D26] divide-y md:divide-y-0 md:divide-x divide-[#302D26]">
          {DISCOVERY_CONTENT.formulations.map((item) => (
            <div
              key={item.code}
              className="p-8 sm:p-10 md:p-12 flex flex-col justify-between min-h-[300px] bg-[#151410] hover:bg-[#1A1914] transition-colors duration-300"
            >
              <div>
                {/* Small Amber Code Label */}
                <span className="block text-[11px] font-mono uppercase tracking-[0.28em] text-[#C5A880] mb-8">
                  {item.code}
                </span>

                {/* Serif Product Title */}
                <h3 className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#F2EEE5] mb-6">
                  {item.name}
                </h3>
              </div>

              {/* Uppercase Ingredient Description */}
              <p className="font-editorial-sans text-xs tracking-[0.16em] uppercase text-[#9E9A90] font-light leading-relaxed">
                {item.ingredients}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Discovery
