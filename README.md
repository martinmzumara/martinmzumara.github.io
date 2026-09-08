# Personal Portfolio — Martin Mzumara

A responsive portfolio website built with HTML5, CSS3, and Vanilla JavaScript — no frameworks, no build step. Deployed via **GitHub Pages** at `martinmzumara.github.io`.

Icons are hand-picked **Phosphor Icons** (regular weight, MIT) embedded as an SVG sprite.

## Current Features

- **Glassmorphism design** — frosted-glass cards over an animated aurora background, light/dark themes with system-preference detection and a labeled footer toggle.
- **Animated, non-static experience** — preloader, scroll-progress bar, scroll-reveal sections, animated stat counters, skills marquee, 3D tilt/spotlight cards, and back-to-top button.
- **Articles & Tools blog** — the homepage shows a few featured posts; a **"View All Posts"** button leads to `/articles/`, which lists every post with the filterable (Laptop / Phone / All) card grid and glass reading modal. Posts live in a shared JS data array (see below).
- **Proof of Work section** — verifiable facts (CCNA, delivered projects, field experience, documented installs) instead of testimonials; placeholder quotes were removed until real ones exist.
- **Contact section** — email / phone / location glass cards with a copy-to-clipboard email button, `mailto:` + resume CTAs, and a matching nav link + hero "Get in Touch" button.
- **Custom icon system** — a single SVG sprite swapped in at runtime; no icon font CDN.
- **Case study & client project pages** — LeakSAFE and EncPlus case studies plus the Manguzi Executive Lodge client project, each with image galleries and lightbox.
- **Project cards** — the homepage cards expose individually clickable links: case study / details, GitHub source (LeakSAFE, EncPlus), and the live Manguzi site.
- **SEO basics** — `sitemap.xml` and `robots.txt`, plus a custom `404.html` (GitHub Pages serves it automatically).
- **Performance** — pre-optimized `.webp` image variants under `assets/images/optimized/`; the Tabler icon webfont is loaded on demand only when the SVG sprite can't be fetched, instead of blocking page render.

## Project Structure

- `index.html`: Core markup and section architecture (numbered "chapter" sections: Expertise, Projects, Approach, Experience, Testimonials, Tools, Showcase, Contact).
- `articles/index.html`: Full articles & tools archive (all posts, with filters + reading modal).
- `leaksafe/index.html`: LeakSAFE case study page.
- `manguzi/index.html`: Manguzi Executive Lodge client project page.
- `encplus/index.html`: EncPlus case study page.
- `404.html`: Custom error page for missing routes.
- `css/style.css`: Custom styles — CSS variables, glass components, responsive breakpoints, `prefers-reduced-motion` fallbacks.
- `js/tools-data.js`: The posts data array (`SITE_TOOLS`) shared by the homepage and `/articles/` (see below).
- `js/tools.js`: Renders the tools grid wherever `#tools-grid` exists — featured subset on the homepage, full archive with filters on `/articles/`; wires the reading modal on both.
- `js/script.js`: All other interactivity — preloader, scroll reveal, counters, marquee, tilt/spotlight, live clock, theme toggle, lightbox, copy-email button.
- `js/icons.js`: Swaps `ti-…` icon classes for the matching `<svg><use>` from the sprite; if the sprite can't be fetched (e.g. `file://`), it injects the Tabler webfont stylesheet on demand as a fallback — the font is never loaded on normal page views.
- `assets/icons/icons.svg`: SVG icon sprite (Phosphor regular icons rendered with `currentColor`; `icons.backup.svg` holds the previous Iconoir set).
- `assets/images/`: Source images; `assets/images/optimized/`: compressed `.webp` variants.

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

## Proof of Work Section (formerly Testimonials)

The testimonial quote cards were removed because there are no real quotes yet —
invented testimonials are worse than none. In their place, the homepage shows a
**"Why Work With Me"** grid of verifiable facts (plain HTML in `index.html`, see
the `<!-- Proof of Work Section -->` comment), reusing the existing `.card`
styles from the Expertise section.

To add real testimonials later, ask past clients/colleagues for one-line quotes
(LinkedIn recommendations work well), then replace or supplement the facts grid
with `testimonial-card` figures — the CSS for `.testimonials-grid` and
`.testimonial-card` is still in `style.css`.

## Editing the Contact Section

The "Let's Work Together" section is plain HTML in `index.html` (see the
`<!-- Contact Section -->` comment). The copy-to-clipboard button reads its
email address from `js/script.js` (search for `copy-email`); update both the
`mailto:` links in the HTML and the `EMAIL` constant in the script if the
address ever changes.

## Deployment

Push to `main` — GitHub Pages serves the repository root automatically.