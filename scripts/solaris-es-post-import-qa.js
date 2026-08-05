const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const defaultPayloadPath = path.join(
  root,
  "docs",
  "solaris-es",
  "solarisfilms-es-wp-import-payload-2026-08-05.json"
);

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
    live: false,
    base: process.env.SOLARIS_ES_PUBLIC_URL || "https://www.solarisfilms.es",
    payload: defaultPayloadPath,
    out: "",
    limit: null,
    timeoutMs: 10000
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--live") args.live = true;
    else if (arg === "--base") args.base = argv[++i];
    else if (arg === "--payload") args.payload = path.resolve(argv[++i]);
    else if (arg === "--out") args.out = path.resolve(argv[++i]);
    else if (arg === "--limit") args.limit = Number(argv[++i]);
    else if (arg === "--timeout-ms") args.timeoutMs = Number(argv[++i]);
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
Solaris ES post-import QA

Offline payload QA:
  node scripts/solaris-es-post-import-qa.js

Live URL QA, after WordPress is reachable:
  node scripts/solaris-es-post-import-qa.js --live --base https://www.solarisfilms.es

Options:
  --live             Fetch every payload URL and verify rendered HTML.
  --base <url>       Public base URL for live checks.
  --payload <file>   Payload JSON to check.
  --out <file>       Write full JSON report to a file.
  --limit <n>        Limit URL checks, useful for pilot QA.
  --timeout-ms <n>   Per-request timeout. Default: 10000.

Safety:
  - Does not write to WordPress.
  - Does not publish or change DNS.
  - Live checks run only with --live.
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

function joinUrl(base, itemPath) {
  if (itemPath === "/") return `${normalizeBase(base)}/`;
  return `${normalizeBase(base)}${itemPath}`;
}

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

function countBy(items, key) {
  const result = {};
  for (const item of items) {
    const value = item[key] || "unknown";
    result[value] = (result[value] || 0) + 1;
  }
  return result;
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort();
}

function inspectText(text) {
  const lower = text.toLowerCase();
  return {
    placeholders: [...new Set(text.match(placeholderPattern) || [])],
    forbidden: forbiddenTerms.filter((term) => lower.includes(term))
  };
}

function offlineQa(payload, args) {
  const items = payload.items.slice(0, Number.isFinite(args.limit) ? args.limit : payload.items.length);
  const failures = [];
  const warnings = [];
  const perItem = [];

  const duplicatePaths = findDuplicates(items.map((item) => item.path));
  const duplicateSlugs = findDuplicates(items.map((item) => `${item.target_post_type}:${item.post_name}`));

  if (duplicatePaths.length) failures.push({ code: "duplicate_paths", paths: duplicatePaths });
  if (duplicateSlugs.length) failures.push({ code: "duplicate_post_type_slugs", slugs: duplicateSlugs });

  for (const item of items) {
    const text = JSON.stringify(item);
    const textFindings = inspectText(text);
    const itemFailures = [];

    if (!item.path || !item.path.startsWith("/")) itemFailures.push("invalid_path");
    if (!item.post_title) itemFailures.push("missing_title");
    if (!item.post_name) itemFailures.push("missing_post_name");
    if (!item.target_post_type) itemFailures.push("missing_target_post_type");
    if (!item.post_content_html || !item.post_content_html.trim()) itemFailures.push("missing_post_content_html");
    if (item.post_status !== "draft") itemFailures.push("post_status_not_draft");
    if (item.publish_blocked_until_review !== true) itemFailures.push("publish_guard_missing");
    if (textFindings.placeholders.length) itemFailures.push("placeholder_present");
    if (textFindings.forbidden.length) itemFailures.push("forbidden_term_present");

    if (item.content_source === "template_generated") {
      warnings.push({ path: item.path, code: "template_generated_needs_editorial_review" });
    }

    perItem.push({
      path: item.path,
      target_post_type: item.target_post_type,
      post_name: item.post_name,
      review_gate: item.review_gate,
      content_source: item.content_source,
      failures: itemFailures,
      placeholders: textFindings.placeholders,
      forbidden: textFindings.forbidden
    });
  }

  const failedItems = perItem.filter((item) => item.failures.length);
  if (failedItems.length) failures.push({ code: "item_failures", count: failedItems.length });

  return {
    mode: "offline",
    total: items.length,
    by_post_type: countBy(items, "target_post_type"),
    by_review_gate: countBy(items, "review_gate"),
    by_content_source: countBy(items, "content_source"),
    failures,
    warnings,
    failed_items: failedItems
  };
}

async function fetchPage(url, timeoutMs) {
  const timeout = timeoutSignal(timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: timeout.signal,
      headers: {
        "User-Agent": "Solaris-ES-QA/1.0"
      }
    });
    const html = await response.text();
    return {
      ok: true,
      url,
      final_url: response.url,
      status: response.status,
      redirected: response.redirected,
      content_type: response.headers.get("content-type") || "",
      html
    };
  } catch (error) {
    return {
      ok: false,
      url,
      error: error.name === "AbortError" ? "timeout" : error.message
    };
  } finally {
    timeout.cancel();
  }
}

function extractH1(html) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return "";
  return match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return "";
  return match[1].replace(/\s+/g, " ").trim();
}

async function liveQa(payload, args) {
  const items = payload.items.slice(0, Number.isFinite(args.limit) ? args.limit : payload.items.length);
  const pages = [];

  for (const item of items) {
    const url = joinUrl(args.base, item.path);
    const fetched = await fetchPage(url, args.timeoutMs);
    const failures = [];
    let htmlFindings = { placeholders: [], forbidden: [] };
    let title = "";
    let h1 = "";

    if (!fetched.ok) {
      failures.push("fetch_failed");
    } else {
      title = extractTitle(fetched.html);
      h1 = extractH1(fetched.html);
      htmlFindings = inspectText(fetched.html);

      if (fetched.status !== 200) failures.push(`status_${fetched.status}`);
      if (!/text\/html/i.test(fetched.content_type)) failures.push("not_html");
      if (!title) failures.push("missing_title");
      if (!h1) failures.push("missing_h1");
      if (/Verification of Contact Information/i.test(fetched.html)) failures.push("registrant_hold_page");
      if (/pagina no encontrada|page not found|404/i.test(`${title} ${h1}`)) failures.push("not_found_copy");
      if (htmlFindings.placeholders.length) failures.push("placeholder_present");
      if (htmlFindings.forbidden.length) failures.push("forbidden_term_present");
    }

    pages.push({
      path: item.path,
      url,
      final_url: fetched.final_url || "",
      status: fetched.status || null,
      redirected: Boolean(fetched.redirected),
      title,
      h1,
      failures,
      placeholders: htmlFindings.placeholders,
      forbidden: htmlFindings.forbidden,
      error: fetched.error || ""
    });
  }

  const failedPages = pages.filter((page) => page.failures.length);
  return {
    mode: "live",
    base: args.base,
    total: items.length,
    ok: items.length - failedPages.length,
    failures: failedPages.length ? [{ code: "page_failures", count: failedPages.length }] : [],
    failed_pages: failedPages,
    pages
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = loadPayload(args.payload);
  const payloadRef = path.relative(root, args.payload).replace(/\\/g, "/");
  const qa = args.live ? await liveQa(payload, args) : offlineQa(payload, args);

  const report = {
    checked_at: new Date().toISOString(),
    payload: payloadRef,
    go: qa.failures.length === 0,
    ...qa
  };

  if (args.out) {
    fs.mkdirSync(path.dirname(args.out), { recursive: true });
    fs.writeFileSync(args.out, `${JSON.stringify(report, null, 2)}\n`);
  }

  console.log(JSON.stringify(report, null, 2));
  if (!report.go) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
