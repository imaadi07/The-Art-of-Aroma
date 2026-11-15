import { Container } from '../../components/common/Container'
import { STORY_CONTENT } from '../../utils/constants'

/**
 * Story Section
 * Editorial storytelling honoring the Koh-do ceremony, Awaji Island craft,
 * and 36-day cedar cask maturation.
 * Anchor ID: id="story"
 */
export function Story() {
  return (
    <section
      id="story"
      className="relative py-28 md:py-36 bg-[#151410] border-t border-[#302D26]"
    >
      <Container>
        {/* Eyebrow & Main Story Header */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="eyebrow block mb-4 text-[#C5A880]">
            {STORY_CONTENT.eyebrow}
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-[#F2EEE5] leading-[1.08] mb-8">
            {STORY_CONTENT.heading}
          </h2>
          <p className="font-editorial-serif italic text-lg sm:text-xl md:text-2xl text-[#C5A880] font-light leading-relaxed mb-8">
            {STORY_CONTENT.subtitle}
          </p>
          <div className="space-y-4 text-sm sm:text-base text-[#9E9A90] font-light leading-relaxed max-w-2xl">
            {STORY_CONTENT.paragraphs.map((para) => (
              <p key={para.slice(0, 30)}>{para}</p>
            ))}
          </div>
        </div>

        {/* 3 Pillars of Craft */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#302D26] divide-y md:divide-y-0 md:divide-x divide-[#302D26]">
          {STORY_CONTENT.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-8 sm:p-10 flex flex-col justify-between min-h-[260px] bg-[#151410] hover:bg-[#1A1914] transition-colors duration-300"
            >
              <div>
                <span className="block text-xs font-mono uppercase tracking-[0.28em] text-[#C5A880] mb-6">
                  {pillar.roman} //
                </span>
                <h3 className="font-editorial-serif text-2xl sm:text-3xl font-light text-[#F2EEE5] mb-4">
                  {pillar.title}
                </h3>
              </div>
              <p className="font-editorial-sans text-xs tracking-[0.14em] text-[#9E9A90] font-light leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Story

