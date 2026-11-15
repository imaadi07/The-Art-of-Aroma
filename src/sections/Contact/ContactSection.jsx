import { useState } from 'react'
import { CONTACT_CONTENT } from '../../utils/constants'
import { Container } from '../../components/common/Container'

/**
 * ContactSection (Fourth Page: Contact)
 *
 * User Requirements:
 * 1. 50/50 Split Layout: Equal dimensions for both cards (image and form are exactly the same height).
 * 2. Custom Luxury Validation: Replaced default browser tooltip popup with bespoke atelier inline error indicators and notification banner.
 * 3. Compact Form: Perfectly proportioned, sleek, rounded-2xl glassmorphism.
 */
export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please share your ceremonial inquiry'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setSubmitted(true)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex items-center justify-center py-20 sm:py-28 overflow-hidden border-t border-[#DDD4C7] bg-[#F8F5EE]"
    >
      {/* Ambient Radial Backdrop Glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_rgba(240,228,212,0.6)_0%,_rgba(248,245,238,0.95)_100%] opacity-90 pointer-events-none" />

      <Container className="relative z-10 w-full">
        {/* 50 / 50 Split Grid Container - items-stretch guarantees 100% equal height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-5xl mx-auto">
          {/* 1. Left 50%: The Sanctuary Image (Matches Form Height Exactly) */}
          <div className="relative w-full h-full min-h-[440px] sm:min-h-[480px] rounded-2xl overflow-hidden border border-[#DDD4C7] bg-white/70 shadow-[0_20px_50px_rgba(90,70,50,0.06)] group flex flex-col justify-end">
            <img
              src={CONTACT_CONTENT.image}
              alt="Ceremonial incense sanctuary"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-103"
            />
            {/* Subtle Gradient Shadow Vignette on Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#241F1C]/75 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Atelier Caption Badge */}
            <div className="relative z-10 m-5 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[#8A6B42] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#DDD4C7] shadow-sm">
              <span>ATELIER SANCTUARY</span>
              <span className="text-[#5D544C]">KYOTO • AWAJI</span>
            </div>
          </div>

          {/* 2. Right 50%: The Form Itself (Matches Image Height Exactly) */}
          <div className="relative w-full h-full rounded-2xl bg-white/85 backdrop-blur-xl border border-[#DDD4C7] shadow-[0_20px_50px_rgba(90,70,50,0.06)] ring-1 ring-black/5 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300">
            {/* Subtle Header */}
            <div className="mb-4 text-left">
              <span className="text-[9px] uppercase tracking-[0.28em] text-[#8A6B42] block mb-1">
                {CONTACT_CONTENT.eyebrow}
              </span>
              <h2 className="font-editorial-serif text-2xl sm:text-3xl font-light text-[#241F1C] mb-1.5 leading-tight">
                {CONTACT_CONTENT.heading}
              </h2>
              <p className="font-editorial-sans text-[11px] text-[#5D544C] font-light leading-relaxed">
                {CONTACT_CONTENT.subtitle}
              </p>
            </div>

            {/* Custom Luxury Validation Notification Banner */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-[#E5A144]/12 border border-[#E5A144]/40 backdrop-blur-md flex items-center space-x-2 text-[10px] uppercase tracking-[0.16em] text-[#8A5A1E] animate-fadeIn">
                <span className="text-sm leading-none shrink-0">✦</span>
                <span>Please complete the required ceremonial fields</span>
              </div>
            )}

            {submitted ? (
              <div className="py-8 text-center my-auto">
                <div className="w-10 h-10 rounded-full border border-[#8A6B42] flex items-center justify-center mx-auto mb-3 text-[#8A6B42] bg-[#8A6B42]/10 backdrop-blur-md">
                  ✓
                </div>
                <h3 className="font-editorial-serif text-xl text-[#241F1C] mb-1.5">
                  Inquiry Transmitted
                </h3>
                <p className="text-[11px] text-[#5D544C] font-light tracking-[0.12em] max-w-xs mx-auto mb-5">
                  Our atelier concierge will respond within twenty-four hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-[9px] uppercase tracking-[0.22em] text-[#8A6B42] underline hover:text-[#241F1C] transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[9px] uppercase tracking-[0.22em] text-[#8A6B42] mb-1"
                  >
                    FULL NAME
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Master Hiroshi Tanaka"
                    className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2.5 text-xs text-[#241F1C] placeholder-[#8A8074] tracking-[0.08em] focus:outline-none transition-all duration-200 ${
                      errors.name
                        ? 'border-[#E06018] ring-1 ring-[#E06018]/40 bg-[#FFF7F4]'
                        : 'border-[#D8CFC2] focus:border-[#8A6B42] focus:ring-1 focus:ring-[#8A6B42]'
                    }`}
                  />
                  {errors.name && (
                    <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-[#C24E12] tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C24E12] shrink-0" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Email Address Field */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[9px] uppercase tracking-[0.22em] text-[#8A6B42] mb-1"
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="curator@sanctuary.com"
                    className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2.5 text-xs text-[#241F1C] placeholder-[#8A8074] tracking-[0.08em] focus:outline-none transition-all duration-200 ${
                      errors.email
                        ? 'border-[#E06018] ring-1 ring-[#E06018]/40 bg-[#FFF7F4]'
                        : 'border-[#D8CFC2] focus:border-[#8A6B42] focus:ring-1 focus:ring-[#8A6B42]'
                    }`}
                  />
                  {errors.email && (
                    <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-[#C24E12] tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C24E12] shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[9px] uppercase tracking-[0.22em] text-[#8A6B42] mb-1"
                  >
                    CEREMONIAL INQUIRY / MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Share your ceremonial space requirements or questions..."
                    className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2.5 text-xs text-[#241F1C] placeholder-[#8A8074] tracking-[0.08em] focus:outline-none transition-all duration-200 resize-none ${
                      errors.message
                        ? 'border-[#E06018] ring-1 ring-[#E06018]/40 bg-[#FFF7F4]'
                        : 'border-[#D8CFC2] focus:border-[#8A6B42] focus:ring-1 focus:ring-[#8A6B42]'
                    }`}
                  />
                  {errors.message && (
                    <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-[#C24E12] tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C24E12] shrink-0" />
                      <span>{errors.message}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-1 border border-[#241F1C] bg-[#241F1C] text-[#F8F5EE] rounded-xl text-[10px] uppercase tracking-[0.24em] font-medium transition-all duration-300 hover:bg-[#8A6B42] hover:border-[#8A6B42] hover:text-[#F8F5EE] hover:shadow-[0_4px_16px_rgba(138,107,66,0.25)] cursor-pointer"
                >
                  TRANSMIT INQUIRY
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default ContactSection
