const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const defaultPayloadPath = path.join(
  root,
  "docs",
  "solaris-es",
  "solarisfilms-es-wp-import-payload-2026-08-05.json"
);

const defaultEndpointMap = {
  page: "pages",
  articulo: "posts",
  producto: "producto",
  focus_tecnico: "focus_tecnico",
  pagina_info: "pagina_info",
  servicio_local: "servicio_local"
};

function parseArgs(argv) {
  const args = {
    apply: false,
    includeSkeletons: false,
    payload: defaultPayloadPath,
    limit: null,
    type: null
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--apply") args.apply = true;
    else if (arg === "--include-skeletons") args.includeSkeletons = true;
    else if (arg === "--payload") args.payload = path.resolve(argv[++i]);
    else if (arg === "--limit") args.limit = Number(argv[++i]);
    else if (arg === "--type") args.type = argv[++i];
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
Solaris ES WordPress draft importer

Dry-run only:
  node scripts/solaris-es-wp-rest-import-drafts.js

Apply to a WordPress site:
  set SOLARIS_ES_WP_URL=https://example.com
  set SOLARIS_ES_WP_USER=admin
  set SOLARIS_ES_WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
  node scripts/solaris-es-wp-rest-import-drafts.js --apply

Options:
  --apply                 Write to WordPress. Defaults to dry-run.
  --include-skeletons     Include items without seed HTML as draft skeletons.
  --payload <file>        Use a custom payload file.
  --type <post_type>      Filter by target_post_type.
  --limit <n>             Limit items, useful for pilot imports.

Safety:
  - Creates only draft posts.
  - Never publishes.
  - Skips existing slugs.
  - Leaves Orchestra fields empty.
`);
}

function getEndpointMap() {
  if (!process.env.SOLARIS_ES_CPT_ENDPOINTS) return defaultEndpointMap;
  return {
    ...defaultEndpointMap,
    ...JSON.parse(process.env.SOLARIS_ES_CPT_ENDPOINTS)
  };
}

function requireApplyEnv() {
  const url = process.env.SOLARIS_ES_WP_URL;
  const user = process.env.SOLARIS_ES_WP_USER;
  const password = process.env.SOLARIS_ES_WP_APP_PASSWORD;

  if (!url || !user || !password) {
    throw new Error(
      "Missing SOLARIS_ES_WP_URL, SOLARIS_ES_WP_USER or SOLARIS_ES_WP_APP_PASSWORD. Refusing to write."
    );
  }

  return {
    baseUrl: url.replace(/\/$/, ""),
    authHeader: `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`
  };
}

function loadPayload(filePath) {
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(payload.items)) throw new Error("Payload does not contain items[].");
  return payload;
}

function normalizeContent(item, includeSkeletons) {
  if (item.post_content_html && item.post_content_html.trim()) return item.post_content_html;
  if (!includeSkeletons) return "";

  return [
    `<section class="sf-es-draft-skeleton">`,
    `<h1>${escapeHtml(item.post_title)}</h1>`,
    `<p>Contenido pendiente de localizacion y revision antes de publicar.</p>`,
    `<p><strong>Revision requerida:</strong> ${escapeHtml(item.review_gate || "copy_review")}</p>`,
    `</section>`
  ].join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function filterItems(items, args) {
  let filtered = items.filter((item) => item.publish_blocked_until_review === true);

  if (!args.includeSkeletons) {
    filtered = filtered.filter((item) => item.draft_import_ready);
  }

  if (args.type) {
    filtered = filtered.filter((item) => item.target_post_type === args.type);
  }

  if (Number.isFinite(args.limit) && args.limit >= 0) {
    filtered = filtered.slice(0, args.limit);
  }

  return filtered;
}

function summarize(items) {
  const summary = { total: items.length, by_post_type: {}, by_review_gate: {} };
  for (const item of items) {
    summary.by_post_type[item.target_post_type] = (summary.by_post_type[item.target_post_type] || 0) + 1;
    summary.by_review_gate[item.review_gate] = (summary.by_review_gate[item.review_gate] || 0) + 1;
  }
  return summary;
}

async function wpFetch(url, options = {}, authHeader) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: authHeader,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const detail = data && (data.message || data.raw) ? `: ${data.message || data.raw}` : "";
    throw new Error(`HTTP ${response.status} for ${url}${detail}`);
  }

  return data;
}

async function slugExists({ baseUrl, authHeader }, endpoint, slug) {
  const url = `${baseUrl}/wp-json/wp/v2/${endpoint}?slug=${encodeURIComponent(slug)}&status=any&per_page=1`;
  const data = await wpFetch(url, {}, authHeader);
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

async function createDraft({ baseUrl, authHeader }, endpoint, item, content) {
  const url = `${baseUrl}/wp-json/wp/v2/${endpoint}`;
  return wpFetch(
    url,
    {
      method: "POST",
      body: JSON.stringify({
        title: item.post_title,
        slug: item.post_name,
        status: "draft",
        content,
        excerpt: item.review_gate ? `Revision requerida: ${item.review_gate}` : ""
      })
    },
    authHeader
  );
}

async function applyImport(items, endpointMap) {
  const wp = requireApplyEnv();
  const result = { created: [], skipped: [], failed: [] };

  for (const item of items) {
    const endpoint = endpointMap[item.target_post_type];
    const content = normalizeContent(item, true);

    if (!endpoint) {
      result.failed.push({ path: item.path, reason: `No endpoint for ${item.target_post_type}` });
      continue;
    }

    try {
      const existing = await slugExists(wp, endpoint, item.post_name);
      if (existing) {
        result.skipped.push({ path: item.path, endpoint, id: existing.id, reason: "slug_exists" });
        continue;
      }

      const created = await createDraft(wp, endpoint, item, content);
      result.created.push({ path: item.path, endpoint, id: created.id, status: created.status });
    } catch (error) {
      result.failed.push({ path: item.path, endpoint, reason: error.message });
    }
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = loadPayload(args.payload);
  const endpointMap = getEndpointMap();
  const items = filterItems(payload.items, args);
  const summary = summarize(items);

  console.log(JSON.stringify({
    mode: args.apply ? "apply" : "dry-run",
    payload: path.relative(root, args.payload).replace(/\\/g, "/"),
    include_skeletons: args.includeSkeletons,
    endpoint_map: endpointMap,
    summary
  }, null, 2));

  if (!args.apply) {
    console.log("\nDry-run only. No WordPress writes performed.");
    console.log("Preview:");
    for (const item of items.slice(0, 12)) {
      console.log(`- ${item.target_post_type} ${item.path} -> ${endpointMap[item.target_post_type] || "NO_ENDPOINT"} (${item.review_gate})`);
    }
    return;
  }

  const result = await applyImport(items, endpointMap);
  console.log(JSON.stringify(result, null, 2));

  if (result.failed.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
