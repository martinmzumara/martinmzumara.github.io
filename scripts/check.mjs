#!/usr/bin/env node
// ============================================================================
// Post-build verification (zero dependencies):
//   1. Internal link check  - every root-relative href/src/srcset/data-full in
//      dist/ must resolve to a real file; #fragments must match an id on the
//      target page (mirrors the lychee --offline --include-fragments CI rules).
//   2. Stale-domain guard   - fails if the old github.io domain appears in any
//      built text file (HTML/CSS/JS/TXT/XML/JSON), i.e. every absolute URL is
//      driven by src/config/site.ts.
// Usage: node scripts/check.mjs   (expects `astro build` to have run first)
// ============================================================================
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const STALE_DOMAIN = 'martinmzumara.github.io';
const TEXT_EXTS = new Set(['.html', '.css', '.js', '.mjs', '.txt', '.xml', '.json', '.svg', '.webmanifest']);
const ATTR_RE = /(?:href|src|data-full|srcset|imagesrcset)\s*=\s*"([^"]+)"/g;

if (!existsSync(DIST)) {
  console.error('check: dist/ not found - run `astro build` first.');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => extname(f) === '.html');
const errors = [];

// --- helpers ---------------------------------------------------------------
const idsCache = new Map();
function idsOf(file) {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\sid\s*=\s*"([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}

function resolveLocal(url, fromFile) {
  // strip query/fragment
  const [pathPart] = url.split(/(?=[?#])/);
  const [path, fragment] = [pathPart.split(/[?#]/)[0], (url.split('#')[1] || null)];
  if (path === '' ) return fragment ? { file: fromFile, fragment } : null; // pure "#frag"
  if (!path.startsWith('/')) return null; // relative - skip (all links are root-relative)
  let target = join(DIST, path);
  if (path.endsWith('/')) target = join(target, 'index.html');
  return { file: target, fragment };
}

// --- 1. internal links -----------------------------------------------------
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const urls = new Set();
  for (const m of html.matchAll(ATTR_RE)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0]; // srcset candidates "url size"
      if (u) urls.add(u);
    }
  }
  for (const url of urls) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|#|$)/.test(url)) {
      if (url.startsWith('#') && url.length > 1) {
        // same-page fragment
        if (!idsOf(file).has(url.slice(1))) {
          errors.push(`${file.replace(DIST, '')}: dead fragment ${url}`);
        }
      }
      continue;
    }
    const resolved = resolveLocal(url, file);
    if (!resolved) continue;
    if (!existsSync(resolved.file)) {
      errors.push(`${file.replace(DIST, '')}: broken link ${url} (missing ${resolved.file.replace(DIST, '')})`);
      continue;
    }
    if (resolved.fragment && extname(resolved.file) === '.html') {
      if (!idsOf(resolved.file).has(resolved.fragment)) {
        errors.push(`${file.replace(DIST, '')}: dead fragment ${url}`);
      }
    }
  }
}

// --- 2. stale domain guard -------------------------------------------------
let staleCount = 0;
for (const file of files) {
  if (!TEXT_EXTS.has(extname(file))) continue;
  const text = readFileSync(file, 'utf8');
  if (text.includes(STALE_DOMAIN)) {
    staleCount++;
    errors.push(`${file.replace(DIST, '')}: still references ${STALE_DOMAIN}`);
  }
}

// --- report ----------------------------------------------------------------
if (errors.length) {
  console.error(`\ncheck: FAILED - ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`check: OK - ${htmlFiles.length} pages, all internal links/fragments resolve, no stale domain references.`);
