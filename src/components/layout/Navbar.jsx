import { useState } from 'react'
import { BRAND_NAME, NAVIGATION_LINKS } from '../../utils/constants'

/**
 * Navbar
 * Floating luxury navigation bar with rounded corners.
 * - Floats centered near top of screen (top-4 sm:top-6) with rounded-full geometry
 * - Frosted dark glassmorphism (backdrop-blur-xl, subtle gold border #C5A880/30)
 * - Left: THE ART OF AROMA brand logo
 * - Center: ESSENCE • ABOUT • PRODUCTS • CONTACT
 * - Right: ATELIER pill action
 * - Mobile: Responsive floating pill with rounded dropdown panel
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-[#DDD4C7] shadow-[0_8px_30px_rgba(90,70,50,0.06)] ring-1 ring-black/5 rounded-full px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between transition-all duration-300">
        {/* Left: Brand Logo */}
        <a
          href="#hero"
          className="nav-logo flex items-center tracking-[0.25em] transition-opacity duration-300 hover:opacity-80"
        >
          <span className="font-editorial-serif text-sm sm:text-base tracking-[0.22em] text-[#241F1C] uppercase whitespace-nowrap">
            {BRAND_NAME}
          </span>
        </a>

        {/* Center: Editorial Navigation Links with subtle dividers */}
        <nav className="hidden md:flex items-center space-x-6 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#5D544C]">
          {NAVIGATION_LINKS.map((link, index) => (
            <div key={link.label} className="flex items-center space-x-6">
              <a
                href={link.href}
                className="hover:text-[#241F1C] transition-colors duration-200"
              >
                {link.label}
              </a>
              {index < NAVIGATION_LINKS.length - 1 && (
                <span className="text-[#DDD4C7] select-none text-[9px]">•</span>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Atelier Inquiries Action */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className="text-[10px] uppercase tracking-[0.22em] text-[#241F1C] hover:text-[#F8F5EE] hover:bg-[#8A6B42] transition-all duration-200 border border-[#8A6B42]/40 rounded-full px-4 py-1.5"
          >
            ATELIER
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[10px] uppercase tracking-[0.22em] text-[#241F1C] px-3 py-1 border border-[#DDD4C7] rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8A6B42]"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Floating Dropdown Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="pointer-events-auto md:hidden absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-[#DDD4C7] shadow-xl rounded-2xl p-6 flex flex-col space-y-4"
        >
          {NAVIGATION_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.22em] text-[#5D544C] hover:text-[#241F1C] py-2 border-b border-[#DDD4C7]/40"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs uppercase tracking-[0.22em] text-[#8A6B42] py-2 text-center border border-[#8A6B42]/50 rounded-full mt-2"
          >
            ATELIER INQUIRIES
          </a>
        </div>
      )}
    </header>
  )
}

export default Navbar
