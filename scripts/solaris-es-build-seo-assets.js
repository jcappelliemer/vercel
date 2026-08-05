const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const defaultPayloadPath = path.join(
  root,
  "docs",
  "solaris-es",
  "solarisfilms-es-wp-import-payload-2026-08-05.json"
);
const defaultOutDir = path.join(root, "docs", "solaris-es", "generated");

const forbiddenTerms = [
  "lcd",
  "fotocromatic",
  "tecnosolar",
  "stratum",
  "startum",
  "false-parent",
  "zoho-callback",
  "llms-txt",
  "nt20",
  "nt35",
  "nt 20",
  "nt 35"
];

const placeholderPattern = /\[[A-Z0-9_]+\]/g;

function parseArgs(argv) {
  const args = {
    base: "https://www.solarisfilms.es",
    payload: defaultPayloadPath,
    outDir: defaultOutDir
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--base") args.base = argv[++i];
    else if (arg === "--payload") args.payload = path.resolve(argv[++i]);
    else if (arg === "--out-dir") args.outDir = path.resolve(argv[++i]);
    else if (arg === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Solaris ES SEO asset preview generator

Generate local, non-deployed SEO previews:
  node scripts/solaris-es-build-seo-assets.js

Options:
  --base <url>       Canonical base URL. Default: https://www.solarisfilms.es
  --payload <file>   Payload JSON to read.
  --out-dir <dir>    Output directory. Default: docs/solaris-es/generated

Safety:
  - Writes only local preview files.
  - Does not publish robots.txt or sitemap.xml.
  - Does not write to WordPress.
`);
}

function loadPayload(filePath) {
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(payload.items)) throw new Error("Payload does not contain items[].");
  return payload;
}

function normalizeBase(base) {
  return base.replace(/\/$/, "");
}

function absoluteUrl(base, itemPath) {
  if (itemPath === "/") return `${normalizeBase(base)}/`;
  return `${normalizeBase(base)}${itemPath}`;
}

function inspectText(text) {
  const lower = text.toLowerCase();
  return {
    placeholders: [...new Set(text.match(placeholderPattern) || [])],
    forbidden: forbiddenTerms.filter((term) => lower.includes(term))
  };
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function classifyItem(item, base) {
  const serialized = JSON.stringify(item);
  const findings = inspectText(serialized);
  const reasons = [];

  if (!item.draft_import_ready) reasons.push("not_import_ready");
  if (!item.post_content_html || !item.post_content_html.trim()) reasons.push("missing_content");
  if (findings.placeholders.length) reasons.push("placeholder_present");
  if (findings.forbidden.length) reasons.push("forbidden_term_present");

  const machineEligible = reasons.length === 0;
  const editorialBlocked = item.publish_blocked_until_review === true;

  return {
    path: item.path,
    url: absoluteUrl(base, item.path),
    target_post_type: item.target_post_type,
    route_type: item.route_type,
    review_gate: item.review_gate || "",
    content_source: item.content_source || "",
    machine_eligible: machineEligible,
    publish_blocked_until_review: editorialBlocked,
    sitemap_candidate: machineEligible,
    reasons,
    placeholders: findings.placeholders,
    forbidden: findings.forbidden
  };
}

function buildSitemap(rows) {
  const urls = rows
    .filter((row) => row.sitemap_candidate)
    .map((row) => [
      "  <url>",
      `    <loc>${xmlEscape(row.url)}</loc>`,
      `    <lastmod>${today()}</lastmod>`,
      "  </url>"
    ].join("\n"))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobotsStaging() {
  return [
    "User-agent: *",
    "Disallow: /",
    ""
  ].join("\n");
}

function buildRobotsProduction(base) {
  return [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${normalizeBase(base)}/sitemap.xml`,
    ""
  ].join("\n");
}

function buildCsv(rows) {
  const headers = [
    "path",
    "url",
    "target_post_type",
    "route_type",
    "review_gate",
    "content_source",
    "machine_eligible",
    "publish_blocked_until_review",
    "sitemap_candidate",
    "reasons",
    "placeholders",
    "forbidden"
  ];

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => {
      const value = Array.isArray(row[header]) ? row[header].join("|") : row[header];
      return csvEscape(value);
    }).join(","))
  ].join("\n") + "\n";
}

function countBy(rows, key) {
  const counts = {};
  for (const row of rows) {
    const value = row[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = loadPayload(args.payload);
  const base = normalizeBase(args.base);
  const rows = payload.items.map((item) => classifyItem(item, base));
  const blocked = rows.filter((row) => !row.machine_eligible);
  const reviewBlocked = rows.filter((row) => row.publish_blocked_until_review);
  const sitemapRows = rows.filter((row) => row.sitemap_candidate);

  fs.mkdirSync(args.outDir, { recursive: true });

  const files = {
    sitemap: path.join(args.outDir, "solarisfilms-es-sitemap-candidate.xml"),
    robotsStaging: path.join(args.outDir, "solarisfilms-es-robots-staging-preview.txt"),
    robotsProduction: path.join(args.outDir, "solarisfilms-es-robots-production-preview.txt"),
    csv: path.join(args.outDir, "solarisfilms-es-url-publication-preview.csv"),
    summary: path.join(args.outDir, "solarisfilms-es-seo-assets-summary.json")
  };

  fs.writeFileSync(files.sitemap, buildSitemap(rows));
  fs.writeFileSync(files.robotsStaging, buildRobotsStaging());
  fs.writeFileSync(files.robotsProduction, buildRobotsProduction(base));
  fs.writeFileSync(files.csv, buildCsv(rows));

  const summary = {
    generated_at: new Date().toISOString(),
    base,
    payload: path.relative(root, args.payload).replace(/\\/g, "/"),
    total: rows.length,
    sitemap_candidate_urls: sitemapRows.length,
    machine_blocked_urls: blocked.length,
    publish_blocked_until_review: reviewBlocked.length,
    by_post_type: countBy(rows, "target_post_type"),
    by_review_gate: countBy(rows, "review_gate"),
    blockers: blocked.map((row) => ({
      path: row.path,
      reasons: row.reasons,
      placeholders: row.placeholders,
      forbidden: row.forbidden
    })),
    note: "Preview only. Do not upload robots or sitemap before QA and manual publish approval."
  };

  fs.writeFileSync(files.summary, `${JSON.stringify(summary, null, 2)}\n`);

  console.log(JSON.stringify({
    output_dir: path.relative(root, args.outDir).replace(/\\/g, "/"),
    total: rows.length,
    sitemap_candidate_urls: sitemapRows.length,
    machine_blocked_urls: blocked.length,
    publish_blocked_until_review: reviewBlocked.length,
    files: Object.fromEntries(Object.entries(files).map(([key, file]) => [key, path.relative(root, file).replace(/\\/g, "/")]))
  }, null, 2));
}

main();
