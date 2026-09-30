// ============================================================================
// Single source of truth for the public site URL.
// Everything absolute (canonical, og:url, og:image, twitter:image, JSON-LD,
// sitemap.xml, robots.txt) is derived from this value.
// ============================================================================
export const SITE_URL = 'https://martinmzumara.com';

export const SITE = {
  url: SITE_URL,
  name: 'Martin Mzumara',
  title: 'Martin Mzumara - Software Developer & IT Technician',
  description:
    'Martin Mzumara — Software Developer & IT Technician in Malawi. IoT systems, web apps, networks.',
  ogImage: `${SITE_URL}/assets/images/og-cover.jpg`,
  ogImageAlt: 'Martin Mzumara - Software Developer & IT Technician',
  locale: 'en_US',
  themeColor: '#238636',
} as const;

/** Absolute URL for a root-relative path ("/leaksafe/" -> "https://…/leaksafe/"). */
export function abs(path: string): string {
  return `${SITE_URL}${path}`;
}
