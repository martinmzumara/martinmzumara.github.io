# Personal Portfolio — Martin Mzumara

A responsive portfolio website with a terminal aesthetic, built with **Astro 5** (static output, no client framework) plus vanilla CSS/JS for interactivity. Deployed via **GitHub Pages** at `martinmzumara.com` (custom domain; see Deployment).

Icons are hand-picked **Phosphor Icons** (regular weight, MIT) embedded as an SVG sprite.

## Current Features

- **Terminal aesthetic** — flat near-black console with phosphor-green accent, monospace headings, fake window title bars on cards, shell-command section labels (`$ ls ~/projects/`), prompt-style logo and nav, typewriter effect on the hero command line, light "paper console" second theme.
- **Animated, non-static experience** — preloader, scroll-progress bar, scroll-reveal sections, animated stat counters, skills marquee, 3D tilt/spotlight cards, and an auto-hiding navbar that slides away as you scroll down and reveals on any scroll up.
- **Liquid-glass surfaces** — iOS-style frosted materials: the sticky navbar (all widths) and the mobile dropdown panel (floating rounded card with rim lighting and an opening sheen pulse) blur the page behind them; built with `backdrop-filter` on sibling pseudo-elements so nested filters never cancel each other.
- **Articles & Tools** — the homepage shows a few featured posts with glass reading modals (data in `src/data/tools.ts`); a **"View All Posts"** button links to the separate blog at [martinmzumara.com/blog](https://martinmzumara.com/blog/), built with Astro in its own repo.
- **Testimonials / social proof** — intentionally omitted for now (see "Adding Testimonials Later").
- **Contact section** — email / phone / location glass cards with a copy-to-clipboard email button, `mailto:` + resume CTAs, and a matching nav link + hero "Get in Touch" button.
- **Custom icon system** — a single SVG sprite swapped in at runtime; no icon font CDN.
- **Case study & client project pages** — LeakSAFE and EncPlus case studies plus the Manguzi Executive Lodge client project and the LAH CCTV surveillance installation, each with image galleries and lightbox.
- **Project cards** — the homepage cards expose individually clickable links: case study / details, GitHub source (LeakSAFE, EncPlus), the live Manguzi site, and the LAH CCTV case study.
- **SEO basics** — `sitemap.xml` and `robots.txt`, plus a custom `404.html` (GitHub Pages serves it automatically).
- **Performance** — responsive images: the hero and showcase photos ship `400w`/`800w` WebP candidates with `srcset`/`sizes` (plus a same-size JPEG fallback), and the lightbox loads a separate 1600px-capped `-full.jpg` only when opened; the LeakSAFE gallery screenshots use `400w` WebP variants. Fonts are self-hosted (no third-party font requests); images carry explicit `width`/`height` (no layout shift); the Tabler icon webfont is loaded on demand only when the SVG sprite can't be fetched, instead of blocking page render.
- **Resilient hero (no-JS / script-failure safe)** — the preloader overlay and the hero's `opacity: 0` base state are cleared from `js/script.js`. Two safeguards in `index.html` prevent a permanently blank page if that file never runs: a `<noscript>` style block that hides the preloader and reveals the hero, and an inline head failsafe that force-adds `.loaded` after 4.5 s (cancelled by `finishPreload()` on the normal path). Verified with JavaScript disabled and with `/js/script.js` blocked.

## Project Structure

- `astro.config.mjs`: Astro config — `site: 'https://martinmzumara.com'`, static directory output (URL shape matches the old `/page/` paths).
- `src/config/site.ts`: **Single source of truth for the public site URL.** Canonical, Open Graph, Twitter, JSON-LD, `sitemap.xml` and `robots.txt` all derive from `SITE_URL` — never hard-code the domain elsewhere.
- `src/layouts/BaseLayout.astro`: Document shell — head (favicons, `site.webmanifest`, font preloads, skip link, `data-theme` init), navbar, main content slot, footer, deferred scripts.
- `src/components/Navbar.astro`, `src/components/Footer.astro`: Shared chrome. Nav links and the action button are passed as props per page. The footer replicates the same contact obfuscation as the contact section (see below).
- `src/pages/index.astro`: Core markup and section architecture (numbered "chapter" sections: Expertise, Projects, Experience, Networking, Tools, Showcase, Contact). Featured Tools cards are **pre-rendered at build time** from `src/data/tools.ts`.
- `src/pages/leaksafe/index.astro`: LeakSAFE case study page.
- `src/pages/lah-cctv/index.astro`: LAH CCTV surveillance installation case study page.
- `src/pages/manguzi/index.astro`: Manguzi Executive Lodge client project page.
- `src/pages/encplus/index.astro`: EncPlus case study page.
- `src/pages/cv/index.astro`: Branded CV page at `/cv/`, with a desktop PDF preview and open/download controls on all devices. Replace `public/cv/Martin-Mzumara-CV.pdf` when updating the CV; also refresh `public/assets/Martin_Mzumara_CV.pdf`, retained for previously shared links. Browser PDF support varies; the direct link remains available if embedding fails.
- `src/pages/404.astro`: Custom error page for missing routes (GitHub Pages serves it automatically; intentionally `noindex`).
- `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts`: Generated at build time from `site.ts`.
- `src/data/tools.ts`: The posts data array (`SITE_TOOLS`) — the single source for both the pre-rendered homepage cards and the modal bodies (embedded as page JSON; see below).
- `src/utils/obfuscate.ts`: Build-time entity encoder used for contact details (see below).
- `scripts/check.mjs`: Post-build check — internal link/fragment audit plus a stale-domain guard that fails the build if the old `github.io` domain appears in any built text file.
- `public/css/style.css`: Custom styles — CSS variables, liquid-glass navbar and mobile panel, responsive breakpoints, `prefers-reduced-motion` fallbacks. Note: the page uses `overflow-x: clip` (not `hidden`) — `hidden` on `html`/`body` silently breaks the navbar's `position: sticky`.
- `public/js/tools.js`: Wires the tools reading modal from the embedded page JSON; skips re-rendering because the cards already exist as static HTML.
- `public/js/script.js`: All other interactivity — preloader, scroll reveal, counters, marquee, tilt/spotlight, live clock, theme toggle, lightbox, copy-email button.
- `public/js/terminal.js`: The hidden terminal easter egg (press <kbd>`</kbd> on any page) — a fake shell with `help`, `whoami`, `ls`, `open <project>`, `contact`, `theme`, `uptime`, `clear`, `exit` and `sudo hire-me`, plus command history; honours `prefers-reduced-motion`.
- `public/js/icons.js`: Swaps `ti-…` icon classes for the matching `<svg><use>` from the sprite; if the sprite can't be fetched (e.g. `file://`), it injects the Tabler webfont stylesheet on demand as a fallback — the font is never loaded on normal page views.
- `public/assets/icons/icons.svg`: SVG icon sprite (Phosphor regular icons rendered with `currentColor`; `icons.backup.svg` holds the previous Iconoir set).
- `public/assets/images/`: optimised images. Display sizes are suffixed `-400w` / `-800w` (regular) or `-full` (lightbox, capped at 1600px); `leaksafe-*.jpeg` are the LeakSAFE gallery JPEG fallbacks. `logo.png` is the brand mark (its `optimized/logo-96.webp` is used in the footer); `og-cover.jpg` is the social/link-preview card. The full-resolution source photos are not tracked (they live in `~/images-backup/` locally) — regenerate variants from them with `magick <source> -auto-orient -strip -resize <width>x -quality 78 <name>-<width>w.webp`.
- `public/assets/fonts/`: Self-hosted **Inter** and **JetBrains Mono** variable fonts as latin-subset `.woff2` (~104 KB total, replacing Google Fonts). Regenerate with `pyftsubset <font>.ttf --flavor=woff2 --unicodes=<latin+symbols>`; the OFL licences sit beside each file.
- `public/favicon.ico`, `public/favicon-32.png`, `public/favicon-16.png`, `public/apple-touch-icon.png`, `public/site.webmanifest`: generated from `assets/images/logo.png`.
- `public/CNAME`: custom domain (`martinmzumara.com`), shipped in the build artifact.
- `public/google19deb8b21f6153e2.html`: Google Search Console verification file (must stay a bare one-line document).
- `.github/workflows/deploy.yml`: Astro build → `dist/` → GitHub Pages artifact deployment (see below).
- `.github/workflows/ci.yml` + `.lighthouserc.json`: CI on every push/PR — `npm ci`, `npm run build`, then internal link & asset check (lychee in offline mode against `dist/`, with `--index-files index.html` and `--include-fragments`, so dead `#anchors` are caught too) plus Lighthouse CI assertions on `dist/` (mobile, 3 runs with an explicit URL list: performance ≥ 0.7, accessibility / best-practices / SEO ≥ 0.9). The Google Search Console verification file is excluded from auditing (it must stay a bare one-line document).

## Local Development

1. Clone the repository and install dependencies: `npm ci`.
2. `npm run dev` for the local server, `npm run build` for a production build into `dist/` (the build also runs the internal link/fragment check and the stale-domain guard via `scripts/check.mjs`).
3. Preview a production build with `npm run preview`, or serve `dist/` over HTTP (required for the icon sprite to load — `file://` blocks the fetch):
   - `python3 -m http.server 8000 --directory dist` then open `http://localhost:8000`.

## Adding a Tools & Software Post

The articles are rendered from a typed data array in `src/data/tools.ts`
(`SITE_TOOLS`). The homepage's **featured** subset is pre-rendered into static
HTML at build time; the full list is embedded as page JSON for the reading
modal (`public/js/tools.js` reads it from `#site-tools-data`). Each entry is
an object in the array:

```ts
{
    name: 'Visual Studio Code',   // card title + modal heading
    dev: 'laptop',                // 'laptop' or 'phone' (drives the filter + badge)
    tag: 'Code Editor',           // small label shown on the card
    icon: 'ti-brand-vscode',      // icon converted by public/js/icons.js to the sprite
    featured: true,               // show on the homepage (keep ~3 featured)
    summary: 'One-line card blurb.',
    intro: 'Opening paragraph of the modal.',
    body: 'Longer body text of the modal.',
    bullets: ['Key point 1', 'Key point 2']
}
```

To add a post, append an entry, then run `npm run build` — no other files
need to change. (`js/tools-data.js` no longer exists; it was merged into
`src/data/tools.ts` during the Astro migration.)

## Contact-detail obfuscation

E-mail and phone numbers never appear as plain text in the served HTML
(scraper deterrent). At build time, `src/utils/obfuscate.ts` encodes them as
numeric HTML character references (injected via `set:html`, which Astro
preserves verbatim — writing entities directly in a template gets normalised
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
(`src/utils/obfuscate.ts`) — edit those constants, not the HTML. The
copy-to-clipboard button assembles the same address at runtime from
`public/js/script.js` (search for `copy-email`); keep all three in sync if the
address ever changes. The shared footer contact list is generated the same way
in `src/components/Footer.astro`.

## Deployment

Push to `main` — the **Deploy to GitHub Pages** workflow (`npm ci` →
`npm run build` → upload `dist/` → deploy) publishes automatically. The Pages
source in the repository settings must be **GitHub Actions** (not "Deploy from
a branch"); the custom domain (`martinmzumara.com`) is set in Settings →
Pages, which also enables **Enforce HTTPS** once the certificate is issued
(up to 24 h after the domain is attached). Each push also runs the CI workflow
above (build + link check + Lighthouse on `dist/`); results appear under the
repository's **Actions** tab.