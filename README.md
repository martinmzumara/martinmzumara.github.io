# Personal Portfolio — Martin Mzumara

A responsive portfolio website built with HTML5, CSS3, and Vanilla JavaScript — no frameworks, no build step. Deployed via **GitHub Pages** at `martinmzumara.github.io`.

Icons are hand-picked **Phosphor Icons** (regular weight, MIT) embedded as an SVG sprite.

## Current Features

- **Terminal aesthetic** — flat near-black console with phosphor-green accent, subtle scanlines, monospace headings, fake window title bars on cards, shell-command section labels (`$ ls ~/projects/`), prompt-style logo and nav, blinking hero cursor with typewriter effect, light "paper console" second theme.
- **Animated, non-static experience** — preloader, scroll-progress bar, scroll-reveal sections, animated stat counters, skills marquee, 3D tilt/spotlight cards, and an auto-hiding navbar that slides away as you scroll down and reveals on any scroll up.
- **Liquid-glass surfaces** — iOS-style frosted materials: the sticky navbar (all widths) and the mobile dropdown panel (floating rounded card with rim lighting and an opening sheen pulse) blur the page behind them; built with `backdrop-filter` on sibling pseudo-elements so nested filters never cancel each other.
- **Articles & Tools** — the homepage shows a few featured posts with glass reading modals (data in `js/tools-data.js`); a **"View All Posts"** button links to the separate blog at [martinmzumara.github.io/blog](https://martinmzumara.github.io/blog/), built with Astro in its own repo.
- **Testimonials / social proof** — intentionally omitted for now (see "Adding Testimonials Later").
- **Contact section** — email / phone / location glass cards with a copy-to-clipboard email button, `mailto:` + resume CTAs, and a matching nav link + hero "Get in Touch" button.
- **Custom icon system** — a single SVG sprite swapped in at runtime; no icon font CDN.
- **Case study & client project pages** — LeakSAFE and EncPlus case studies plus the Manguzi Executive Lodge client project, each with image galleries and lightbox.
- **Project cards** — the homepage cards expose individually clickable links: case study / details, GitHub source (LeakSAFE, EncPlus), and the live Manguzi site.
- **SEO basics** — `sitemap.xml` and `robots.txt`, plus a custom `404.html` (GitHub Pages serves it automatically).
- **Performance** — pre-optimized `.webp` image variants under `assets/images/optimized/`; fonts are self-hosted (no third-party font requests); images carry explicit `width`/`height` (no layout shift); the Tabler icon webfont is loaded on demand only when the SVG sprite can't be fetched, instead of blocking page render.

## Project Structure

- `index.html`: Core markup and section architecture (numbered "chapter" sections: Expertise, Projects, Experience, Tools, Showcase, Contact).
- `leaksafe/index.html`: LeakSAFE case study page.
- `manguzi/index.html`: Manguzi Executive Lodge client project page.
- `encplus/index.html`: EncPlus case study page.
- `404.html`: Custom error page for missing routes.
- `css/style.css`: Custom styles — CSS variables, liquid-glass navbar and mobile panel, responsive breakpoints, `prefers-reduced-motion` fallbacks. Note: the page uses `overflow-x: clip` (not `hidden`) — `hidden` on `html`/`body` silently breaks the navbar's `position: sticky`.
- `js/tools-data.js`: The posts data array (`SITE_TOOLS`) shared by the homepage and `/articles/` (see below).
- `js/tools.js`: Renders the tools grid wherever `#tools-grid` exists — featured subset on the homepage, full archive with filters on `/articles/`; wires the reading modal on both.
- `js/script.js`: All other interactivity — preloader, scroll reveal, counters, marquee, tilt/spotlight, live clock, theme toggle, lightbox, copy-email button.
- `js/terminal.js`: The hidden terminal easter egg (press <kbd>`</kbd> on any page) — a fake shell with `help`, `whoami`, `ls`, `open <project>`, `contact`, `theme`, `uptime`, `clear`, `exit` and `sudo hire-me`, plus command history; honours `prefers-reduced-motion`.
- `js/icons.js`: Swaps `ti-…` icon classes for the matching `<svg><use>` from the sprite; if the sprite can't be fetched (e.g. `file://`), it injects the Tabler webfont stylesheet on demand as a fallback — the font is never loaded on normal page views.
- `assets/icons/icons.svg`: SVG icon sprite (Phosphor regular icons rendered with `currentColor`; `icons.backup.svg` holds the previous Iconoir set).
- `assets/images/`: Source images; `assets/images/optimized/`: compressed `.webp` variants. `logo.png` is the brand mark (its `optimized/logo-96.webp` is used in the footer).
- `assets/fonts/`: Self-hosted **Inter** and **JetBrains Mono** variable fonts as latin-subset `.woff2` (~104 KB total, replacing Google Fonts). Regenerate with `pyftsubset <font>.ttf --flavor=woff2 --unicodes=<latin+symbols>`; the OFL licences sit beside each file.
- `favicon.ico`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png`: generated from `assets/images/logo.png`.
- `.github/workflows/ci.yml` + `.lighthouserc.json`: CI on every push/PR — internal link & asset check (lychee in offline mode with `--root-dir .`) plus Lighthouse CI assertions (mobile, 3 runs: performance ≥ 0.7, accessibility / best-practices / SEO ≥ 0.9). `404.html` is excluded from auditing because it is intentionally `noindex`.

## Local Development

1. Clone or download the repository.
2. Serve the folder over HTTP (required for the icon sprite to load — `file://` blocks the fetch):
   - VS Code **Live Server** extension, or
   - `python3 -m http.server 8000` then open `http://localhost:8000`.

## Adding a Tools & Software Post

The articles are rendered from a JavaScript data array in `js/tools-data.js`
(`SITE_TOOLS`), shared by the homepage (featured subset) and `/articles/`
(full archive). Each entry is an object pushed onto the array:

```js
SITE_TOOLS.push({
    name: 'Visual Studio Code',   // card title + modal heading
    dev: 'laptop',                // 'laptop' or 'phone' (drives the filter + badge)
    tag: 'Code Editor',           // small label shown on the card
    icon: 'ti-brand-vscode',      // icon converted by js/icons.js to the sprite
    featured: true,               // show on the homepage (keep ~3 featured)
    summary: 'One-line card blurb.',
    intro: 'Opening paragraph of the modal.',
    body: 'Longer body text of the modal.',
    bullets: ['Key point 1', 'Key point 2']
});
```

To add a post, copy a `SITE_TOOLS.push({ ... });` block, edit the fields, and
save — no other files need to change. Set `featured: true` on the entries you
want on the homepage (everything appears on `/articles/` regardless).

## Adding Testimonials Later

Social proof is intentionally omitted for now. The CSS for quote cards
(`.testimonials-grid` / `.testimonial-card`) is still in `style.css`, so when
real quotes are collected (e.g. LinkedIn recommendations from past clients or
colleagues), a section can be re-added to `index.html` before the Tools
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

The "Let's Work Together" section is plain HTML in `index.html` (see the
`<!-- Contact Section -->` comment). The copy-to-clipboard button reads its
email address from `js/script.js` (search for `copy-email`); update both the
`mailto:` links in the HTML and the `EMAIL` constant in the script if the
address ever changes.

## Deployment

Push to `main` — GitHub Pages serves the repository root automatically. Each push also runs the CI workflow above (link check + Lighthouse); results appear under the repository's **Actions** tab.