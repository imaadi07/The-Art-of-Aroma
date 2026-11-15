import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  FOUNDING_YEAR,
  AUTHOR_EMAIL,
  ATELIER_LOCATION,
  OG_IMAGE_PATH,
} from '../../constants/seo.js'
import { PRODUCT_COLLECTION } from '../../utils/constants.js'

/**
 * generateOrganizationSchema
 * Returns Schema.org Organization descriptor for the brand.
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}${OG_IMAGE_PATH}`,
    description: SITE_DESCRIPTION,
    foundingDate: FOUNDING_YEAR,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressRegion: 'Hyogo & Kyoto',
      addressLocality: ATELIER_LOCATION,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: AUTHOR_EMAIL,
      contactType: 'Customer Service & Concierge',
      availableLanguage: ['English', 'Japanese'],
    },
    knowsAbout: [
      'Japanese Koh-do tradition',
      'Artisanal Incense Craft',
      'Awaji Island Kiln Heritage',
      'Botanical Parfumerie',
    ],
  }
}

/**
 * generateWebSiteSchema
 * Returns Schema.org WebSite descriptor with potential search action.
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}#organization`,
    },
    inLanguage: ['en-US', 'ja-JP'],
  }
}

/**
 * generateProductCollectionSchema
 * Generates Schema.org ItemList containing each formulation Product.
 */
export function generateProductCollectionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}#products`,
    name: 'The Art of Aroma — Haute Parfumerie Formulations',
    description: 'Four signature botanical incense formulations handcrafted in Awaji Island.',
    numberOfItems: PRODUCT_COLLECTION.length,
    itemListElement: PRODUCT_COLLECTION.map((product, index) => {
      // Extract numeric price from price string e.g. "$84 USD" -> "84.00"
      const priceMatch = product.price.match(/\d+/)
      const priceValue = priceMatch ? `${priceMatch[0]}.00` : '80.00'

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': `${SITE_URL}/#product-${product.id}`,
          name: `${product.name} Incense`,
          description: `${product.tagline}. ${product.olfactoryProfile} Notes: ${product.notes}. Burn time: ${product.burnTime}.`,
          image: `${SITE_URL}${product.packetImage}`,
          brand: {
            '@id': `${SITE_URL}#organization`,
          },
          category: 'Home Fragrance > Incense',
          offers: {
            '@type': 'Offer',
            price: priceValue,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2027-12-31',
            seller: {
              '@id': `${SITE_URL}#organization`,
            },
            url: `${SITE_URL}/#products`,
          },
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'Origin',
              value: product.origin,
            },
            {
              '@type': 'PropertyValue',
              name: 'Burn Time',
              value: product.burnTime,
            },
            {
              '@type': 'PropertyValue',
              name: 'Maturation',
              value: product.maturation,
            },
          ],
        },
      }
    }),
  }
}

/**
 * generateBreadcrumbSchema
 * Generates Schema.org BreadcrumbList for navigational indexing.
 */
export function generateBreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE_URL}#breadcrumbs`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Sanctuary Essence',
        item: `${SITE_URL}/#hero`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Awaji Heritage & Kiln Craft',
        item: `${SITE_URL}/#about`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Formulations in Orbit',
        item: `${SITE_URL}/#products`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Atelier Concierge',
        item: `${SITE_URL}/#contact`,
      },
    ],
  }
}
