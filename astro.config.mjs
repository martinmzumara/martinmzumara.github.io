// @ts-check
import { defineConfig } from 'astro/config';

// Single source of truth for the public URL is src/config/site.ts (SITE_URL).
// The value below must match it - Astro reads `site` for canonical URLs,
// sitemap generation and RSS-style absolute links.
export default defineConfig({
  site: 'https://martinmzumara.com',
  base: '/',
  trailingSlash: 'always',
  build: {
    // 'directory' keeps the existing URL shape: /leaksafe/ -> /leaksafe/index.html
    format: 'directory',
  },
});
