import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../config/site';
import { tagSlug } from '../utils/tags';

// Sitemap generated at build time from src/config/site.ts - the only place
// the public URL lives. Static pages are listed by hand; blog post and tag
// URLs are derived from the posts collection, so new posts appear here
// automatically. Drafts are never listed.
const PAGES = [
  { path: '/', lastmod: '2026-09-30', changefreq: 'monthly', priority: '1.0' },
  { path: '/leaksafe/', lastmod: '2026-09-16', changefreq: 'yearly', priority: '0.8' },
  { path: '/encplus/', lastmod: '2026-09-30', changefreq: 'yearly', priority: '0.8' },
  { path: '/manguzi/', lastmod: '2026-09-16', changefreq: 'yearly', priority: '0.8' },
  { path: '/lah-cctv/', lastmod: '2026-09-25', changefreq: 'yearly', priority: '0.8' },
  { path: '/cv/', lastmod: '2026-09-17', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/', lastmod: '2026-10-03', changefreq: 'monthly', priority: '0.9' },
];

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const postEntries = posts.map((post) => ({
    path: `/blog/posts/${post.id}/`,
    lastmod: post.data.date.toISOString().slice(0, 10),
    changefreq: 'yearly',
    priority: '0.7',
  }));

  const tagEntries = [...new Set(posts.map((post) => post.data.tag))].map((tag) => ({
    path: `/blog/tag/${tagSlug(tag)}/`,
    lastmod: posts.find((post) => post.data.tag === tag)!.data.date.toISOString().slice(0, 10),
    changefreq: 'yearly',
    priority: '0.5',
  }));

  const urls = [...PAGES, ...postEntries, ...tagEntries]
    .map(
      (p) => `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
