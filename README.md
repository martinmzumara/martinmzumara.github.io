# Personal Portfolio - Martin Mzumara

A responsive portfolio site built with **Astro 5** (static output, no client framework) plus vanilla CSS/JS for interactivity. The homepage reads as a sequence of numbered chapters on alternating surfaces, with hairline borders, a display/body/label type pairing (Bricolage Grotesque / Inter / JetBrains Mono) and a light / dark theme pair. Deployed via **GitHub Pages** at `martinmzumara.com` (custom domain; see Deployment).

Icons are hand-picked **Phosphor Icons** (regular weight, MIT) embedded as an SVG sprite.

## Current Features

- **Editorial chapter design system** - the homepage is split into numbered chapters, each headed by `src/components/ChapterHead.astro` (`num`, `label`, `title`) and sitting on an alternating surface (`surface-a`, `surface-b`, `surface-ink` in `src/pages/index.astro`); glass pills are replaced by hairline borders and a `4px` button radius; Bricolage Grotesque carries display type, Inter the body, JetBrains Mono the uppercase `system-label` eyebrows; two themes (light / dark) are selected with `data-theme` via the footer toggle.
- **Animated, non-static experience** - preloader, scroll-progress bar, scroll-reveal sections, animated stat counters, skills marquee, and an auto-hiding navbar (`.nav-hidden`) that slides away as you scroll down and reveals on any scroll up.
- **Liquid-glass surfaces** - iOS-style frosted materials: the sticky navbar (all widths) and the mobile dropdown panel (floating rounded card with rim lighting and an opening sheen pulse) blur the page behind them; built with `backdrop-filter` on sibling pseudo-elements so nested filters never cancel each other.
- **Blog** - a markdown blog at [martinmzumara.com/blog](https://martinmzumara.com/blog/) (pages in `src/pages/blog/`, posts in `src/content/posts/`, per-tag archives at `/blog/tag/<tag>/`); the homepage "Recent Writing" section lists the three newest posts. The old standalone blog repo is merged into this repo (URLs unchanged).
- **Testimonials / social proof** - intentionally omitted for now (see "Adding Testimonials Later").
- **Contact section** - email / phone / location glass cards with a copy-to-clipboard email button, `mailto:` + resume CTAs, and a matching nav link + hero "Get in Touch" button.
- **Custom icon system** - a single SVG sprite swapped in at runtime; no icon font CDN.
- **Case study & client project pages** - LeakSAFE and EncPlus case studies plus the Manguzi Executive Lodge client project and the LAH CCTV surveillance installation, each with image galleries and lightbox.
- **Project cards** - the homepage cards expose individually clickable links: case study / details, GitHub source (LeakSAFE, EncPlus), the live Manguzi site, and the LAH CCTV case study.
- **SEO basics** - `sitemap.xml` and `robots.txt`, plus a custom `404.html` (GitHub Pages serves it automatically).
- **Performance** - responsive images: the hero and showcase photos ship `400w`/`800w` WebP candidates with `srcset`/`sizes` (plus a same-size JPEG fallback), and the lightbox loads a separate 1600px-capped `-full.jpg` only when opened; the LeakSAFE gallery screenshots use `400w` WebP variants. Fonts are self-hosted (no third-party font requests); images carry explicit `width`/`height` (no layout shift); the Tabler icon webfont is loaded on demand only when the SVG sprite can't be fetched, instead of blocking page render. The Manguzi page ships five live-site captures (`manguzi-live-*.webp`, including a mobile-width variant) with explicit dimensions, and the social/link-preview card is a progressive JPEG (`og-cover.jpg`, 1200x630).
- **Accessibility** - skip link to `#main-content`, focus-trapped lightbox and tools reading modal (Escape closes, focus returns to the opener), visible `:focus-visible` styles, `aria-label` on icon-only controls, and `prefers-reduced-motion` fallbacks that freeze every animation. Lighthouse accessibility scores **100** on all eight pages CI audits; CI itself asserts a floor of 0.9.
- **Resilient hero (no-JS / script-failure safe)** - the preloader overlay and the hero's `opacity: 0` base state are cleared from `js/script.js`. Two safeguards prevent a permanently blank page if that file never runs: `src/layouts/BaseLayout.astro` ships a `<noscript>` style block that hides the preloader and reveals the hero, and `src/pages/index.astro` carries an inline head failsafe that force-adds `.loaded` after 4.5 s (cancelled by `finishPreload()` on the normal path). Verified with JavaScript disabled and with `/js/script.js` blocked.

## Project Structure

- `astro.config.mjs`: Astro config - `site: 'https://martinmzumara.com'`, static directory output (URL shape matches the old `/page/` paths).
- `src/config/site.ts`: **Single source of truth for the public site URL.** Canonical, Open Graph, Twitter, JSON-LD, `sitemap.xml` and `robots.txt` all derive from `SITE_URL` - never hard-code the domain elsewhere.
- `src/layouts/BaseLayout.astro`: Document shell - head (favicons, `site.webmanifest`, font preloads, skip link, `data-theme` init), navbar, main content slot, footer, deferred scripts.
- `src/components/Navbar.astro`, `src/components/Footer.astro`: Shared chrome. Nav links and the action button are passed as props per page. The footer replicates the same contact obfuscation as the contact section (see below).
- `src/pages/index.astro`: Core markup and section architecture (numbered "chapter" sections: Expertise, Projects, Experience, Networking, Tools, Showcase, Contact). Featured Tools cards are **pre-rendered at build time** from `src/data/tools.ts`.
- `src/pages/leaksafe/index.astro`: LeakSAFE case study page.
- `src/pages/lah-cctv/index.astro`: LAH CCTV surveillance installation case study page.
- `src/pages/manguzi/index.astro`: Manguzi Executive Lodge client project page.
- `src/pages/encplus/index.astro`: EncPlus case study page.
- `src/pages/cv/index.astro`: Branded CV page at `/cv/`, with a desktop PDF preview and open/download controls on all devices. Replace `public/cv/Martin-Mzumara-CV.pdf` when updating the CV; also refresh `public/assets/Martin_Mzumara_CV.pdf`, retained for previously shared links. Browser PDF support varies; the direct link remains available if embedding fails.
- `src/pages/404.astro`: Custom error page for missing routes (GitHub Pages serves it automatically; intentionally `noindex`).
- `src/pages/blog/index.astro`, `src/pages/blog/posts/[...slug].astro`: The blog at `/blog/` - index plus one page per post, migrated from the old standalone blog repo (URLs unchanged). Posts live in `src/content/posts/` behind the `posts` collection in `src/content.config.ts`; `src/layouts/BlogPostLayout.astro` wraps each post in the portfolio shell, and `public/css/blog.css` (loaded per page, `style.css` untouched) carries the blog-specific rules.
- `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts`: Generated at build time from `site.ts`.
- `src/data/tools.ts`: The tools & software data array (`SITE_TOOLS`) - now only feeds the reading modal (embedded as page JSON in `src/pages/index.astro`, read by `public/js/tools.js`); the homepage shows recent blog posts instead of tool cards.
- `src/utils/tags.ts`: Blog helpers shared by the routes - `tagSlug()` (tag -> URL slug), `isPublished()` (drafts hidden outside `astro dev`) and `publishedPosts()` (newest first).
- `scripts/new-post.mjs`: `npm run new:post -- "Title"` scaffolds a dated, draft markdown file in `src/content/posts/`.
- `src/utils/obfuscate.ts`: Build-time entity encoder used for contact details (see below).
- `scripts/check.mjs`: Post-build check - internal link/fragment audit plus a stale-domain guard that fails the build if the old `github.io` domain appears in any built text file.
- `public/css/style.css`: Custom styles - CSS variables, liquid-glass navbar and mobile panel, responsive breakpoints, `prefers-reduced-motion` fallbacks. Note: the page uses `overflow-x: clip` (not `hidden`) - `hidden` on `html`/`body` silently breaks the navbar's `position: sticky`.
- `public/js/tools.js`: Wires the tools reading modal from the embedded page JSON; skips re-rendering because the cards already exist as static HTML.
- `public/js/script.js`: All other interactivity - preloader (`finishPreload`), scroll reveal, counters, marquee, auto-hiding navbar, live clock, theme toggle, focus-trapped lightbox, copy-email button, and the cursor-following work-index preview.
- `public/js/terminal.js`: The hidden terminal easter egg (press <kbd>`</kbd> on any page) - a fake shell with `help`, `whoami`, `ls`, `open <project>`, `contact`, `theme`, `uptime`, `clear`, `exit` and `sudo hire-me`, plus command history; honours `prefers-reduced-motion`.
- `public/js/icons.js`: Swaps `ti-…` icon classes for the matching `<svg><use>` from the sprite; if the sprite can't be fetched (e.g. `file://`), it injects the Tabler webfont stylesheet on demand as a fallback - the font is never loaded on normal page views.
- `public/assets/icons/icons.svg`: SVG icon sprite (Phosphor regular icons rendered with `currentColor`; `icons.backup.svg` holds the previous Iconoir set).
- `public/assets/images/`: optimised images. Display sizes are suffixed `-400w` / `-800w` (regular) or `-full` (lightbox, capped at 1600px); `leaksafe-*.jpeg` are the LeakSAFE gallery JPEG fallbacks. `logo.png` is the brand mark (its `optimized/logo-96.webp` is used in the footer); `og-cover.jpg` is the social/link-preview card. The full-resolution source photos are not tracked (they live in `~/images-backup/` locally) - regenerate variants from them with `magick <source> -auto-orient -strip -resize <width>x -quality 78 <name>-<width>w.webp`.
- `public/assets/fonts/`: Self-hosted **Bricolage Grotesque**, **Inter** and **JetBrains Mono** variable fonts as latin-subset `.woff2` (145 KB total: 44 KB display, 63 KB body, 38 KB mono; replacing Google Fonts). Regenerate with `pyftsubset <font>.ttf --flavor=woff2 --unicodes=<latin+symbols>`; the OFL licences sit beside each file.
- `public/favicon.ico`, `public/favicon-32.png`, `public/favicon-16.png`, `public/apple-touch-icon.png`, `public/site.webmanifest`: generated from `assets/images/logo.png`.
- `public/CNAME`: custom domain (`martinmzumara.com`), shipped in the build artifact.
- `public/google19deb8b21f6153e2.html`: Google Search Console verification file (must stay a bare one-line document).
- `.github/workflows/deploy.yml`: Astro build → `dist/` → GitHub Pages artifact deployment (see below).
- `.github/workflows/ci.yml` + `.lighthouserc.json`: CI on every push/PR - `npm ci`, `npm run build`, then internal link & asset check (lychee in offline mode against `dist/`, with `--index-files index.html` and `--include-fragments`, so dead `#anchors` are caught too) plus Lighthouse CI assertions on `dist/` (mobile, 3 runs with an explicit URL list: performance ≥ 0.7, accessibility / best-practices / SEO ≥ 0.9). The Google Search Console verification file is excluded from auditing (it must stay a bare one-line document).

## Local Development

1. Clone the repository and install dependencies: `npm ci`.
2. `npm run dev` for the local server, `npm run build` for a production build into `dist/` (the build also runs the internal link/fragment check and the stale-domain guard via `scripts/check.mjs`). `npm run check` re-runs that same check against an existing `dist/` without rebuilding.
3. Preview a production build with `npm run preview`, or serve `dist/` over HTTP (required for the icon sprite to load - `file://` blocks the fetch):
   - `python3 -m http.server 8000 --directory dist` then open `http://localhost:8000`.

## Writing a blog post

Posts live in `src/content/posts/*.md` behind the `posts` collection
(`src/content.config.ts`). The filename is the URL slug - `my-post.md` becomes
`/blog/posts/my-post/`. Frontmatter:

```md
---
title: 'My Post Title'
description: 'One-line summary - the index excerpt and the page description.'
date: 2026-10-06
tag: 'Linux'        # groups the post and drives its /blog/tag/<slug>/ archive
device: 'laptop'    # 'laptop' | 'phone' (optional - adds the device chip)
draft: true         # optional - drafts are visible in `npm run dev` only
---

## A heading

Body text - `inline code`, lists, > quotes, fenced code blocks and images
(`![alt](/assets/images/foo.webp)`) are all styled by `public/css/blog.css`.
```

Scaffold a pre-filled, dated, draft file and edit it:

```bash
npm run new:post -- "My Post Title"
```

Then:

1. `npm run dev` and preview at `http://localhost:4321/blog/` (drafts included).
2. When ready, set `draft: false` (or delete the line).
3. `npm run build` - runs `astro build` + `scripts/check.mjs`; a broken internal
   link or image path fails the build.
4. Commit on a branch and open a PR.

Nothing else needs editing: the `/blog/` index, the homepage "Recent Writing"
section, the `/blog/tag/<tag>/` archives and `sitemap.xml` are all generated
from the collection at build time. Post images go in `public/assets/images/`
and are referenced with an absolute path (`/assets/images/...`).

## Publishing from GitHub Mobile

You can create and publish a post from the GitHub Mobile app - a post is just
a markdown file in the repo.

1. Open the repository in GitHub Mobile and go to `src/content/posts/`.
2. Tap **+** and create a new file named `<slug>.md` (the filename becomes the
   URL slug, e.g. `my-post.md` -> `/blog/posts/my-post/`).
3. Paste the frontmatter and body from `scripts/post-template.md`.
4. Leave out `draft` (or set `draft: false`) so the post publishes - a
   `draft: true` post only shows under `npm run dev`, which you cannot run on a
   phone.
5. Commit to `main` (or a branch, then open a PR). Pushing to `main` runs the
   Pages deploy automatically.
6. Check the **Actions** tab - a red run means the build failed and the post
   did not publish.

Things to watch on mobile:

- The frontmatter is validated at build time. A typo, a missing required field
  (`title`, `description`, `date`) or an invalid date fails the build.
- There is no local preview on a phone - you only see the rendered post after
  the deploy finishes (~1-2 min).
- Images are awkward to add from the app. Keep mobile posts text-only, or add
  images from a desktop (`public/assets/images/`, referenced as
  `/assets/images/...`); a missing image also fails the build.

## Contact-detail obfuscation

E-mail and phone numbers never appear as plain text in the served HTML
(scraper deterrent). At build time, `src/utils/obfuscate.ts` encodes them as
numeric HTML character references (injected via `set:html`, which Astro
preserves verbatim - writing entities directly in a template gets normalised
back to plain text); in `public/js/script.js` / `public/js/terminal.js` the
address is assembled at runtime (no plain constant). Browsers decode
everything, so links, the copy-to-clipboard button, and the terminal behave
exactly as before. The JSON-LD `email` keeps a valid `@` but with the `@`
escaped as `\u0040` (parses identically, avoids a raw grep match).

## Adding Testimonials Later

Social proof is intentionally omitted for now. The CSS for quote cards
(`.testimonials-grid` / `.testimonial-card`) is still in `style.css`, so when
real quotes are collected (e.g. LinkedIn recommendations from past clients or
colleagues), a section can be re-added to `src/pages/index.astro` before the Tools
section using:

```html
<figure class="testimonial-card">
    <blockquote>&ldquo;The real quote goes here.&rdquo;</blockquote>
    <figcaption>
        <span class="testimonial-name">Name Surname</span>
        <span class="testimonial-role">Role, Organisation</span>
    </figcaption>
</figure>
```

## Editing the Contact Section

The "Let's Work Together" section lives in `src/pages/index.astro` (see the
`<!-- Contact Section -->` comment); its e-mail/phone markup is entity-encoded
at build time from the plain values in that file's frontmatter
(`src/utils/obfuscate.ts`) - edit those constants, not the HTML. The
copy-to-clipboard button assembles the same address at runtime from
`public/js/script.js` (search for `copy-email`); keep all three in sync if the
address ever changes. The shared footer contact list is generated the same way
in `src/components/Footer.astro`.

## Accessibility

Lighthouse accessibility scores **100** on every page CI audits (`/`,
`/leaksafe/`, `/encplus/`, `/manguzi/`, `/lah-cctv/`, `/cv/`, `/blog/`,
`/blog/posts/2026-09-16-why-i-switched-to-arch-linux/`). `.lighthouserc.json`
runs Lighthouse three times per URL and fails the build below 0.9.

- Skip link to `#main-content` on every page (`src/layouts/BaseLayout.astro`).
- The lightbox (`public/js/script.js`) and the tools reading modal
  (`public/js/tools.js`) are focus-trapped: Tab and Shift+Tab cycle inside the
  dialog, `Escape` closes it, and focus returns to the element that opened it.
- `prefers-reduced-motion` freezes scroll reveal, the skills marquee, the
  status dot, smooth scrolling, the navbar slide, carousel scrolling and the
  terminal animations, so every animated section also works as static content.
- Visible `:focus-visible` styles, `aria-label` on icon-only controls, semantic
  headings, and explicit `width`/`height` on images (no layout shift).

To reproduce: `npm run build`, serve `dist/` over HTTP (`file://` blocks the
icon sprite), then run `npx lighthouse http://localhost:8000/ --only-categories=accessibility`.

## Deployment

Push to `main` - the **Deploy to GitHub Pages** workflow (`npm ci` →
`npm run build` → upload `dist/` → deploy) publishes automatically. The Pages
source in the repository settings must be **GitHub Actions** (not "Deploy from
a branch"); the custom domain (`martinmzumara.com`) is set in Settings →
Pages, which also enables **Enforce HTTPS** once the certificate is issued
(up to 24 h after the domain is attached). Each push also runs the CI workflow
above (build + link check + Lighthouse on `dist/`); results appear under the
repository's **Actions** tab.