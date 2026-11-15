/**
 * seo.js
 * Single source of truth for site identity, canonical paths, and SEO metadata.
 * Compliant with @frontend-seo and @vibecode-production-qa-validator.
 */

export const SITE_URL = 'https://theartofaroma.com' // No trailing slash
export const SITE_NAME = 'THE ART OF AROMA'
export const SITE_TITLE = 'THE ART OF AROMA — Haute Parfumerie & Sacred Incense Sanctuary'
export const SITE_TAGLINE = 'Sacred Mastery of Pure Botanical Koh-Do'
export const SITE_DESCRIPTION =
  'Rooted in centuries of Japanese Koh-do tradition. Sacred artisanal incense sticks hand-extruded from wild-harvested woods on Awaji Island, Japan.'

export const SITE_KEYWORDS = [
  'Japanese incense',
  'Koh-do tradition',
  'Awaji Island incense',
  'artisanal incense sticks',
  'Kyara agarwood',
  'Hinoki cypress',
  'Mysore sandalwood',
  'natural incense sticks',
  'meditation incense ritual',
  'haute parfumerie',
  'pure botanical aroma',
  'Kyoto incense atelier',
]

export const SITE_LOCALE = 'en_US'
export const SITE_LOCALE_ALTERNATES = ['ja_JP']

export const AUTHOR_NAME = 'THE ART OF AROMA Atelier'
export const AUTHOR_EMAIL = 'curator@theartofaroma.com'
export const FOUNDING_YEAR = '1876'
export const ATELIER_LOCATION = 'Awaji Island & Kyoto, Japan'

export const OG_IMAGE_PATH = '/images/og-image.jpg'
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_ALT =
  'THE ART OF AROMA - Ceremonial Incense Sticks and Sacred Koh-Do Sanctuary'

export const TWITTER_HANDLE = '@theartofaroma'
export const TWITTER_CARD_TYPE = 'summary_large_image'

/**
 * Returns a canonical, normalized absolute URL.
 * Never concatenate SITE_URL + path by hand.
 */
export function canonicalUrl(path = '') {
  if (!path || path === '/') return SITE_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath.replace(/\/+$/, '')}`
}
