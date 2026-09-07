# Personal Portfolio - Martin Mzumara

A responsive portfolio website built with HTML5, CSS3, Vanilla JavaScript, and custom SVG icons (from the MIT-licensed [Phosphor Icons](https://phosphoricons.com) library, regular weight).

## Project Structure
- `index.html`: Core markup and section architecture.
- `leaksafe.html`: LeakSAFE project case study detail page.
- `manguzi.html`: Manguzi Executive Lodge project case study detail page.
- `404.html`: Custom error page for missing routes (GitHub Pages automatically uses this).
- `css/style.css`: Custom styles using CSS variables and responsive grid layouts.
- `js/script.js`: Interactive navigation, theme toggle, dynamic year, and image lightbox.
- `assets/images/`: Compressed image files.
- `assets/icons/icons.svg`: SVG icon sprite (Phosphor regular icons rendered with `currentColor`; `icons.backup.svg` holds the previous Iconoir set).
- `js/icons.js`: Swaps `ti-…` icon classes for the matching `<svg>` icon from the sprite.

## Local Development
1. Clone or download the repository.
2. Open `index.html` directly in a browser, or run a local dev server (e.g., Live Server extension in VS Code).

## Tools &amp; Software Blog
The "Tools I Use" section is rendered from a JavaScript data array in `js/script.js`
(see `=============== 14. Tools &amp; Software data ===============`). Each entry is an
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