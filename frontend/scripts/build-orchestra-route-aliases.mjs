#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(here, '..');
const indexPath = path.join(frontendRoot, 'public', 'wp-data', 'live-pages-index.json');
const outPath = path.join(frontendRoot, 'src', 'data', 'orchestra-route-aliases.json');

// These WordPress permalinks differ from both the legacy public paths and the
// React canonical routes. Keep the connector keyed to the current WP records.
const WORDPRESS_ROUTE_ALIASES = {
  '/company-profile': '/about',
  '/guida-tecnica': '/guida-tecnica-pellicole-per-vetri-antisolari-sicurezza-e-privacy',
  '/servizi': '/pellicole-per-vetri',
};

function normalizePath(value) {
  let pathname = String(value || '/').trim();
  try {
    if (/^https?:\/\//i.test(pathname)) pathname = new URL(pathname).pathname;
  } catch {
    return null;
  }
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, '/');
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '');
  return pathname || '/';
}

function main() {
  const aliases = {};
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(outPath, '{}\n');
    console.warn('[orchestra] live page index missing; wrote an empty route alias map');
    return;
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  for (const page of Array.isArray(index.pages) ? index.pages : []) {
    const source = normalizePath(page?.path);
    const target = normalizePath(page?.route?.newPath);
    if (!source || !target || source === target) continue;
    if (aliases[target] && aliases[target] !== source) {
      throw new Error(`Conflicting Orchestra route alias for ${target}`);
    }
    aliases[target] = source;
  }

  Object.assign(aliases, WORDPRESS_ROUTE_ALIASES);

  const ordered = Object.fromEntries(Object.entries(aliases).sort(([a], [b]) => a.localeCompare(b)));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(ordered, null, 2)}\n`);
  console.log(`[orchestra] wrote ${Object.keys(ordered).length} route alias(es)`);
}

main();
