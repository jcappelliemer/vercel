/**
 * Pre-build script: fetches the Orchestra headless-fixes MANIFEST and bakes it
 * to a static JSON consumed by the React components at build time.
 *
 * Mirrors the conventions of fetch-wp-data.js (http/https, timeout, FAIL-SOFT:
 * any skip/error/timeout writes an empty { byPath:{} } and exits 0 so the build
 * NEVER breaks — same contract as SKIP_WP_FETCH).
 *
 * Producer: WP plugin REST `aeo-orchestra/v1/headless-fixes?view=manifest`
 *   (Bearer license_key, publish-only, paginated via RFC5988 Link).
 *
 * Env:
 *   ORCHESTRA_BASE        WP origin (default: jc4e). Falls back to REACT_APP_WP_URL / WP_URL.
 *   ORCHESTRA_LICENSE     license key (Bearer). If empty → fail-soft skip.
 *   SKIP_ORCHESTRA_FETCH  '1' → skip (writes empty).
 *   WP_FETCH_TIMEOUT_MS   per-request timeout (default 8000).
 *
 * Output: src/data/orchestra-fixes.json
 *   { contract, generatedAt, byPath: { "/": {post_id,modified_at,meta,aeo,score}, "/chi-siamo": {..} } }
 *   key = normalized frontend_url path ("/" for home, no trailing slash).
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const DEFAULT_BASE = 'https://wordpress-jc4e.srv1502079.hstgr.cloud';
const BASE = (process.env.ORCHESTRA_BASE || process.env.REACT_APP_WP_URL || process.env.WP_URL || DEFAULT_BASE).replace(/\/$/, '');
const LICENSE = process.env.ORCHESTRA_LICENSE || '';
// 30s per attempt: the manifest does meta-bridge + Content Store + block
// extraction, so a cold WP (jc4e) answers in ~25s from the Vercel build network
// (8s was too low → timeout → empty byPath → home stayed dark). Env-overridable.
const TIMEOUT_MS = Number(process.env.WP_FETCH_TIMEOUT_MS || 30000);
const RETRY_BACKOFFS_MS = [2000, 5000]; // between the 3 attempts; attempt 1 warms the WP
const PER_PAGE = 50;
const MAX_PAGES = 50; // backstop
const OUT = path.join(__dirname, 'src', 'data', 'orchestra-fixes.json');

const EMPTY = { contract: 1, generatedAt: null, byPath: {} };

function writeOut(obj) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(obj));
}

if (process.env.SKIP_ORCHESTRA_FETCH === '1' || !LICENSE) {
  console.log('[orchestra] fetch skipped (SKIP_ORCHESTRA_FETCH set or ORCHESTRA_LICENSE empty) — writing empty manifest');
  writeOut(EMPTY);
  process.exit(0);
}

function fetchManifest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { Authorization: `Bearer ${LICENSE}`, Accept: 'application/json' } }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
        try { resolve({ json: JSON.parse(body), headers: res.headers, status: res.statusCode }); }
        catch (e) { reject(new Error('Invalid JSON')); }
      });
    }).on('error', reject);
    req.setTimeout(TIMEOUT_MS, () => { req.destroy(new Error(`Timeout after ${TIMEOUT_MS}ms`)); });
  });
}

// 3 attempts with backoff before the final fail-soft. Logs per attempt
// (number, HTTP status / error, elapsed ms) — no token/URL beyond what main()
// already logs. A cold WP usually times out on attempt 1 then warms up, so
// attempt 2/3 succeed well within the 30s window.
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
async function fetchManifestRetry(url) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const t0 = Date.now();
    try {
      const out = await fetchManifest(url);
      console.log(`[orchestra] attempt ${attempt}/3 OK: HTTP ${out.status} in ${Date.now() - t0}ms`);
      return out;
    } catch (e) {
      lastErr = e;
      console.warn(`[orchestra] attempt ${attempt}/3 failed in ${Date.now() - t0}ms: ${e.message}`);
      if (attempt < 3) await sleep(RETRY_BACKOFFS_MS[attempt - 1] || 5000);
    }
  }
  throw lastErr;
}

function normPath(frontendUrl) {
  try {
    let p = String(frontendUrl || '');
    if (/^https?:\/\//i.test(p)) p = new URL(p).pathname;
    if (!p) return null;
    if (!p.startsWith('/')) p = '/' + p;
    if (p.length > 1) p = p.replace(/\/+$/, ''); // strip trailing slash (non-root)
    return p || '/';
  } catch (e) { return null; }
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? Math.round(num) : null;
}

function normalizeScore(page) {
  const rawScore =
    page.score ||
    page.scores ||
    page.aeo_score ||
    (page.aeo && (page.aeo.score || page.aeo.scores || page.aeo.aeo_score)) ||
    (page.analysis && page.analysis.score) ||
    (page.meta && page.meta.score) ||
    null;

  if (!rawScore) return null;

  if (typeof rawScore === 'number' || typeof rawScore === 'string') {
    const value = numberOrNull(rawScore);
    return value === null ? null : { aeo: value };
  }

  const score = {};
  const seo = numberOrNull(rawScore.seo ?? rawScore.SEO ?? rawScore.seo_score ?? rawScore.seoScore);
  const aeo = numberOrNull(rawScore.aeo ?? rawScore.AEO ?? rawScore.aeo_score ?? rawScore.aeoScore);
  const analyzedAt =
    rawScore.analyzed_at ||
    rawScore.analyzedAt ||
    rawScore.analyzed ||
    page.analyzed_at ||
    page.analyzedAt ||
    null;

  if (seo !== null) score.seo = seo;
  if (aeo !== null) score.aeo = aeo;
  if (analyzedAt) score.analyzed_at = analyzedAt;

  return Object.keys(score).length ? score : null;
}

function nextLink(linkHeader) {
  if (!linkHeader) return null;
  const part = String(linkHeader).split(',').map((s) => s.trim()).find((s) => /rel="next"/.test(s));
  if (!part) return null;
  const m = part.match(/<([^>]+)>/);
  return m ? m[1] : null;
}

async function main() {
  const byPath = {};
  let url = `${BASE}/wp-json/aeo-orchestra/v1/headless-fixes?view=manifest&per_page=${PER_PAGE}&page=1`;
  let generatedAt = null;
  let pages = 0;
  while (url && pages < MAX_PAGES) {
    const { json, headers } = await fetchManifestRetry(url);
    if (json && json.contract !== 1) console.warn(`[orchestra] unexpected contract: ${json && json.contract}`);
    if (!generatedAt && json) generatedAt = json.generated_at || null;
    for (const p of ((json && json.pages) || [])) {
      const key = normPath(p.frontend_url || '');
      if (!key) continue;
      byPath[key] = {
        post_id: p.post_id,
        modified_at: p.modified_at,
        meta: p.meta || {},
        aeo: p.aeo || {},
        score: normalizeScore(p),
      };
    }
    url = nextLink(headers && headers.link);
    pages++;
  }
  writeOut({ contract: 1, generatedAt, byPath });
  console.log(`[orchestra] baked ${Object.keys(byPath).length} page(s) over ${pages} request(s) → ${path.relative(process.cwd(), OUT)}`);
}

main().catch((err) => {
  console.warn(`[orchestra] fetch failed (fail-soft, build continues): ${err.message}`);
  writeOut(EMPTY);
  process.exit(0); // never fail the build
});
