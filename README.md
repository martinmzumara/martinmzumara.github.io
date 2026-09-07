# Personal Portfolio — Martin Mzumara

A responsive portfolio website built with HTML5, CSS3, and Vanilla JavaScript — no frameworks, no build step. Deployed via **GitHub Pages** at `martinmzumara.github.io`.

Icons are hand-picked **Phosphor Icons** (regular weight, MIT) embedded as an SVG sprite.

## Current Features

- **Glassmorphism design** — frosted-glass cards over an animated aurora background, light/dark themes with system-preference detection and a labeled footer toggle.
- **Animated, non-static experience** — preloader, scroll-progress bar, scroll-reveal sections, animated stat counters, skills marquee, 3D tilt/spotlight cards, and back-to-top button.
- **Tools & Software blog** — filterable (Laptop / Phone / All) card grid with a glass reading modal, driven by a simple JS data array (see below).
- **Custom icon system** — a single SVG sprite swapped in at runtime; no icon font CDN.
- **Case study pages** — LeakSAFE, Manguzi Executive Lodge, and EncPlus, each with image galleries and lightbox.
- **SEO basics** — `sitemap.xml` and `robots.txt`, plus a custom `404.html` (GitHub Pages serves it automatically).
- **Performance** — pre-optimized `.webp` image variants under `assets/images/optimized/`.

## Project Structure

- `index.html`: Core markup and section architecture (numbered "chapter" sections: Expertise, Projects, Approach, Experience, Tools, Showcase).
- `leaksafe/index.html`: LeakSAFE case study page.
- `manguzi/index.html`: Manguzi Executive Lodge case study page.
- `encplus/index.html`: EncPlus case study page.
- `404.html`: Custom error page for missing routes.
- `css/style.css`: Custom styles — CSS variables, glass components, responsive breakpoints, `prefers-reduced-motion` fallbacks.
- `js/script.js`: All interactivity — preloader, scroll reveal, counters, marquee, tilt/spotlight, live clock, theme toggle, tools data + filter + modal, lightbox.
- `js/icons.js`: Swaps `ti-…` icon classes for the matching `<svg><use>` from the sprite (with a Tabler webfont fallback if the sprite can't be fetched, e.g. `file://`).
- `assets/icons/icons.svg`: SVG icon sprite (Phosphor regular icons rendered with `currentColor`; `icons.backup.svg` holds the previous Iconoir set).
- `assets/images/`: Source images; `assets/images/optimized/`: compressed `.webp` variants.

## Local Development

1. Clone or download the repository.
2. Serve the folder over HTTP (required for the icon sprite to load — `file://` blocks the fetch):
   - VS Code **Live Server** extension, or
   - `python3 -m http.server 8000` then open `http://localhost:8000`.

## Adding a Tools & Software Post

The "Tools I Use" section is rendered from a JavaScript data array in `js/script.js`
(see `=============== 14. Tools & Software data ===============`). Each entry is an
object pushed onto the `tools` array:

```js
tools.push({
    name: 'Visual Studio Code',   // card title + modal heading
    dev: 'laptop',                // 'laptop' or 'phone' (drives the filter + badge)
    tag: 'Code Editor',           // small label shown on the card
    icon: 'ti-brand-vscode',      // icon converted by js/icons.js to the sprite
    summary: 'One-line card blurb.',
    intro: 'Opening paragraph of the modal.',
    body: 'Longer body text of the modal.',
    bullets: ['Key point 1', 'Key point 2']
});
```

To add a post, copy a `tools.push({ ... });` block, edit the fields, and save —
no other files need to change.

## Deployment

Push to `main` — GitHub Pages serves the repository root automatically.