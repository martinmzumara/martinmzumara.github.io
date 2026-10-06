#!/usr/bin/env node
// ============================================================================
// Scaffold a new blog post:  npm run new:post -- "My Post Title"
// Writes src/content/posts/<YYYY-MM-DD>-<slug>.md with the frontmatter filled
// in and draft: true, so it stays unpublished until you flip the flag.
// ============================================================================
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new:post -- "My Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

const date = new Date().toISOString().slice(0, 10);
const dir = fileURLToPath(new URL('../src/content/posts/', import.meta.url));
const file = join(dir, `${date}-${slug}.md`);

if (existsSync(file)) {
  console.error(`Refusing to overwrite existing file: ${file}`);
  process.exit(1);
}

const escapedTitle = title.replace(/'/g, "\\'");
const template = `---
title: '${escapedTitle}'
description: 'One-line summary - shows on the blog index and as the page description.'
date: ${date}
tag: 'General'
device: 'laptop'
draft: true
---

Opening paragraph...

## First heading

Body text. Inline \`code\`, lists, quotes and fenced code blocks are all styled.

\`\`\`bash
echo "hello"
\`\`\`
`;

writeFileSync(file, template);
console.log(`Created ${file.replace(process.cwd() + '/', '')}`);
console.log('Set draft: false (or delete the line) when you are ready to publish.');
