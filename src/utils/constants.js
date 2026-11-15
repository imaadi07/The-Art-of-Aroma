export const BRAND_NAME = 'THE ART OF AROMA'

export const NAVIGATION_LINKS = [
  { label: 'ESSENCE', href: '#hero' },
  { label: 'ABOUT', href: '#about' },
  { label: 'PRODUCTS', href: '#products' },
  { label: 'CONTACT', href: '#contact' },
]

export const HERO_CONTENT = {
  eyebrow: 'HAUTE PARFUMERIE • N° 01',
  headlineLine1: 'A MOMENT OF',
  headlineLine2: 'STILLNESS.',
  subtitle:
    'From the sacred burning tip, where ancient flame awakens harmonic atmosphere and timeless presence.',
  cta: 'DISCOVER THE CRAFT',
  scroll: 'SCROLL TO EXPLORE',
}

export const ABOUT_CONTENT = {
  eyebrow: 'HERITAGE // AWAJI ISLAND CRAFT',
  heading: 'The Sacred Mastery of Pure Aroma',
  subtitle:
    'Rooted in centuries of Japanese Koh-do tradition, where every stick is an invitation to profound stillness.',
  description:
    'Formed on the windswept shores of Awaji Island, our incense sticks are extruded exclusively from wild-harvested woods, sacred tree resins, and natural Tabu-no-ki bark. We reject synthetic binders, toxic accelerants, and petroleum dyes. When planted into its hand-turned brass vessel, each stick burns with an uninterrupted silky plume for forty-five minutes of mindful contemplation.',
  stats: [
    { value: '1876', label: 'Awaji Kiln Heritage' },
    { value: '100%', label: 'Botanical Tabu-no-ki' },
    { value: '45 MIN', label: 'Contemplative Burn' },
  ],
}

export const PRODUCT_COLLECTION = [
  {
    id: 'kyara',
    index: 0,
    code: 'FORMULATION 01',
    name: 'Kyara Woods',
    tagline: 'Deep Imperial Agarwood',
    position: 'top-left', // 1st info: top left
    colorHex: '#3A2E24',
    accentColor: '#C5A880',
    emberColor: '#FF7814',
    price: '$84 USD',
    notes: '30-Year Aged Kyara • Fossilized Amber • Temple Frankincense • Cedar Bark',
    olfactoryProfile:
      'Deep, resinous, balsamic, and solemnly meditative. Formulated from wild heartwood harvested in misted mountain valleys.',
    ritual: 'Best suited for late evening contemplation, deep reading, or formal tea ceremony.',
    origin: 'Awaji Island, Japan',
    maturation: '36 days in seasoned cedar casks',
    burnTime: '45 minutes',
    packetImage: '/images/packets/square-kyara.svg',
  },
  {
    id: 'hinoki',
    index: 1,
    code: 'FORMULATION 02',
    name: 'Hinoki Mist',
    tagline: 'Misted Kyoto Cypress & Temple Moss',
    position: 'bottom-left', // 2nd info: bottom left
    colorHex: '#4A4637',
    accentColor: '#A3B18A',
    emberColor: '#FFA834',
    price: '$72 USD',
    notes: 'Sacred White Hinoki • Wet Mountain Granite • Kyoto Moss • Wild Vetiver',
    olfactoryProfile:
      'Crisp, cleansing, green, and ethereal. Captures the dawn air of a forest shrine after heavy autumn rain.',
    ritual: 'Ideal for morning meditation, creative focus, and clearing architectural spaces.',
    origin: 'Kiso Valley & Awaji, Japan',
    maturation: '36 days in seasoned cedar casks',
    burnTime: '45 minutes',
    packetImage: '/images/packets/square-hinoki.svg',
  },
  {
    id: 'sumi',
    index: 2,
    code: 'FORMULATION 03',
    name: 'Sumi & Shiso',
    tagline: 'Charred Pine Ash & Mineral Ink',
    position: 'top-right', // 3rd info: top right
    colorHex: '#252525',
    accentColor: '#9E9A90',
    emberColor: '#FF5722',
    price: '$76 USD',
    notes: 'Roasted Bancha Tea • Sumi Ink Soot • Charred Pine • Wet Red Shiso Earth',
    olfactoryProfile:
      'Smoky, mineral, dry, and aristocratic. Reminiscent of calligraphy studios in ancient Nara, damp ink stones, and winter fireplaces.',
    ritual: 'Designed for quiet reading hours, introspective writing, and twilight dusk.',
    origin: 'Nara & Awaji, Japan',
    maturation: '36 days in seasoned cedar casks',
    burnTime: '45 minutes',
    packetImage: '/images/packets/square-sumi.svg',
  },
  {
    id: 'byakudan',
    index: 3,
    code: 'FORMULATION 04',
    name: 'Byakudan Sandalwood',
    tagline: 'Vintage Mysore Sandalwood & Silk',
    position: 'bottom-right', // 4th info: bottom right
    colorHex: '#524336',
    accentColor: '#E0A96D',
    emberColor: '#FF9100',
    price: '$80 USD',
    notes: 'Vintage Indian Sandalwood • Florentine Orris • Madagascar Tonka • Silk Ash',
    olfactoryProfile:
      'Creamy, buttery, comforting, and subtly warm. Sweet balsamic woods wrapped in velvet orris root and sun-warmed amber resins.',
    ritual: 'Perfect for welcoming honored guests, shared dining, and evening unwind.',
    origin: 'Awaji Island & Mysore',
    maturation: '45 days in seasoned cedar casks',
    burnTime: '50 minutes',
    packetImage: '/images/packets/square-byakudan.svg',
  },
]

// Keep FLAVOR_COLLECTION alias for backward compatibility
export const FLAVOR_COLLECTION = PRODUCT_COLLECTION

export const CONTACT_CONTENT = {
  eyebrow: 'THE ATELIER // CONCIERGE',
  heading: 'Connect with Our Scent Sanctuary',
  subtitle:
    'For private ceremony consultations, bespoke scent extrusions, or personal concierge service, we welcome your dialogue.',
  image: '/images/sanctuary-temple.jpg',
  email: 'concierge@theartofaroma.com',
  phone: '+81 (0) 799 85 1024',
}

export const FOOTER_CONTENT = {
  copyright: 'THE ART OF AROMA • © 2026 ALL RIGHTS RESERVED',
  tagline: 'Haute Parfumerie & Sacred Koh-do Traditions of Awaji Island',
  links: [
    { label: 'PRIVACY POLICY', href: '#privacy' },
    { label: 'TERMS OF CRAFT', href: '#terms' },
    { label: 'CONCIERGE', href: '#contact' },
  ],
}
