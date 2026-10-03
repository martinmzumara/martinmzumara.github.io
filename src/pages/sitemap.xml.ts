import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';

// Sitemap generated at build time from src/config/site.ts - the only place
// the public URL lives. lastmod reflects real content edits (migration day
// for pages whose markup/SEO changed; original dates kept elsewhere).
const PAGES = [
  { path: '/', lastmod: '2026-09-30', changefreq: 'monthly', priority: '1.0' },
  { path: '/leaksafe/', lastmod: '2026-09-16', changefreq: 'yearly', priority: '0.8' },
  { path: '/encplus/', lastmod: '2026-09-30', changefreq: 'yearly', priority: '0.8' },
  { path: '/manguzi/', lastmod: '2026-09-16', changefreq: 'yearly', priority: '0.8' },
  { path: '/lah-cctv/', lastmod: '2026-09-25', changefreq: 'yearly', priority: '0.8' },
  { path: '/cv/', lastmod: '2026-09-17', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/', lastmod: '2026-10-03', changefreq: 'monthly', priority: '0.9' },
  { path: '/blog/posts/2026-09-16-why-i-switched-to-arch-linux/', lastmod: '2026-09-16', changefreq: 'yearly', priority: '0.7' },
  { path: '/blog/posts/visual-studio-code/', lastmod: '2026-09-01', changefreq: 'yearly', priority: '0.7' },
  { path: '/blog/posts/flutter-and-dart/', lastmod: '2026-08-15', changefreq: 'yearly', priority: '0.7' },
  { path: '/blog/posts/github-mobile/', lastmod: '2026-07-28', changefreq: 'yearly', priority: '0.7' },
];

export const GET: APIRoute = () => {
  const urls = PAGES.map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  ).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
