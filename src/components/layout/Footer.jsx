import { FOOTER_CONTENT } from '../../utils/constants'
import { Container } from '../common/Container'

/**
 * Footer
 * Minimal luxury editorial footer.
 * Left: THE ART OF AROMA • © 2026 ALL RIGHTS RESERVED
 * Right: PRIVACY | TERMS OF CRAFT | ATELIER INQUIRIES
 * Border: Subtle unbleached linen border #DDD4C7
 */
export function Footer() {
  return (
    <footer className="border-t border-[#DDD4C7] py-14 bg-[#F8F5EE] text-[#5D544C] text-xs">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Left: Copyright */}
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#5D544C]">
            {FOOTER_CONTENT.copyright}
          </div>

          {/* Right: Restrained Links */}
          <div className="flex flex-wrap items-center justify-center space-x-6 text-[10px] uppercase tracking-[0.24em]">
            {FOOTER_CONTENT.links.map((link, index) => (
              <div key={link.label} className="flex items-center space-x-6">
                <a
                  href={link.href}
                  className="hover:text-[#241F1C] transition-colors duration-200"
                >
                  {link.label}
                </a>
                {index < FOOTER_CONTENT.links.length - 1 && (
                  <span className="text-[#DDD4C7] select-none">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

