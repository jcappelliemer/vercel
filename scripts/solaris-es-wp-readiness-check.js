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
  pagina_info: "pagina_info",
  servicio_local: "servicio_local"
};

const expectedTypeByPayloadType = {
  page: "page",
  articulo: "post",
  producto: "producto",
  pagina_info: "pagina_info",
  servicio_local: "servicio_local"
};

function parseArgs(argv) {
  const args = {
    base: process.env.SOLARIS_ES_WP_URL || "https://www.solarisfilms.es",
    payload: defaultPayloadPath,
    timeoutMs: 10000,
    limit: null
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--base") args.base = argv[++i];
    else if (arg === "--payload") args.payload = path.resolve(argv[++i]);
    else if (arg === "--timeout-ms") args.timeoutMs = Number(argv[++i]);
    else if (arg === "--limit") args.limit = Number(argv[++i]);
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
Solaris ES WordPress readiness check

Read-only check before importing drafts:
  node scripts/solaris-es-wp-readiness-check.js

With credentials, collision checks include drafts/private posts:
  set SOLARIS_ES_WP_URL=https://www.solarisfilms.es
  set SOLARIS_ES_WP_USER=admin-user
  set SOLARIS_ES_WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
  node scripts/solaris-es-wp-readiness-check.js

Options:
  --base <url>       WordPress base URL.
  --payload <file>   Payload JSON to inspect.
  --limit <n>        Limit slug collision checks.
  --timeout-ms <n>   Per-request timeout. Default: 10000.

Safety:
  - GET requests only.
  - Does not write to WordPress.
  - Does not publish or change DNS.
`);
}

function normalizeBase(base) {
  return base.replace(/\/$/, "");
}

function loadPayload(filePath) {
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(payload.items)) throw new Error("Payload does not contain items[].");
  return payload;
}

function getEndpointMap() {
  if (!process.env.SOLARIS_ES_CPT_ENDPOINTS) return defaultEndpointMap;
  return {
    ...defaultEndpointMap,
    ...JSON.parse(process.env.SOLARIS_ES_CPT_ENDPOINTS)
  };
}

function getAuthHeader() {
  const user = process.env.SOLARIS_ES_WP_USER;
  const password = process.env.SOLARIS_ES_WP_APP_PASSWORD;
  if (!user || !password) return "";
  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
}

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

async function wpGet(url, timeoutMs, authHeader = "") {
  const timeout = timeoutSignal(timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: timeout.signal,
      headers: {
        Accept: "application/json",
        ...(authHeader ? { Authorization: authHeader } : {})
      }
    });
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = { raw: text.slice(0, 300) };
    }

    return {
      ok: response.ok,
      status: response.status,
      url,
      final_url: response.url,
      content_type: response.headers.get("content-type") || "",
      body
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

function unique(values) {
  return [...new Set(values)].sort();
}

function summarizePayload(items) {
  const byType = {};
  for (const item of items) {
    byType[item.target_post_type] = (byType[item.target_post_type] || 0) + 1;
  }
  return byType;
}

async function checkEndpoint(base, endpoint, timeoutMs, authHeader) {
  const url = `${base}/wp-json/wp/v2/${endpoint}?per_page=1`;
  const result = await wpGet(url, timeoutMs, authHeader);
  return {
    endpoint,
    url,
    ok: result.ok,
    status: result.status || null,
    error: result.error || "",
    is_array: Array.isArray(result.body)
  };
}

async function checkSlug(base, endpoint, slug, timeoutMs, authHeader) {
  const statusParam = authHeader ? "status=any" : "status=publish";
  const url = `${base}/wp-json/wp/v2/${endpoint}?slug=${encodeURIComponent(slug)}&${statusParam}&per_page=10`;
  const result = await wpGet(url, timeoutMs, authHeader);
  if (!result.ok) {
    return {
      endpoint,
      slug,
      ok: false,
      status: result.status || null,
      error: result.error || "",
      matches: []
    };
  }

  const matches = Array.isArray(result.body) ? result.body.map((post) => ({
    id: post.id,
    slug: post.slug,
    status: post.status,
    link: post.link
  })) : [];

  return {
    endpoint,
    slug,
    ok: true,
    status: result.status || null,
    error: "",
    matches
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = normalizeBase(args.base);
  const payload = loadPayload(args.payload);
  const endpointMap = getEndpointMap();
  const authHeader = getAuthHeader();
  const items = payload.items.slice(0, Number.isFinite(args.limit) ? args.limit : payload.items.length);
  const payloadTypes = unique(items.map((item) => item.target_post_type));
  const blockers = [];

  const rootCheck = await wpGet(`${base}/wp-json/`, args.timeoutMs);
  if (!rootCheck.ok) blockers.push("wp_rest_root_not_reachable");

  const typesCheck = await wpGet(`${base}/wp-json/wp/v2/types`, args.timeoutMs, authHeader);
  if (!typesCheck.ok) blockers.push("wp_types_not_reachable");

  const availableTypes = typesCheck.ok && typesCheck.body && typeof typesCheck.body === "object"
    ? Object.keys(typesCheck.body)
    : [];

  const missingTypes = typesCheck.ok ? payloadTypes
    .map((payloadType) => expectedTypeByPayloadType[payloadType])
    .filter(Boolean)
    .filter((wpType) => !availableTypes.includes(wpType)) : [];

  if (missingTypes.length) blockers.push("wp_types_missing");

  const canProbeEndpoints = rootCheck.ok && typesCheck.ok;
  const endpoints = canProbeEndpoints ? unique(payloadTypes.map((type) => endpointMap[type]).filter(Boolean)) : [];
  const endpointChecks = [];
  for (const endpoint of endpoints) {
    endpointChecks.push(await checkEndpoint(base, endpoint, args.timeoutMs, authHeader));
  }

  const failedEndpoints = endpointChecks.filter((endpoint) => !endpoint.ok || !endpoint.is_array);
  if (failedEndpoints.length) blockers.push("wp_endpoints_not_ready");

  const slugChecks = [];
  const canProbeSlugs = canProbeEndpoints && failedEndpoints.length === 0;
  for (const item of canProbeSlugs ? items : []) {
    const endpoint = endpointMap[item.target_post_type];
    if (!endpoint) {
      slugChecks.push({
        path: item.path,
        endpoint: "",
        slug: item.post_name,
        ok: false,
        error: `No endpoint for ${item.target_post_type}`,
        matches: []
      });
      continue;
    }

    const checked = await checkSlug(base, endpoint, item.post_name, args.timeoutMs, authHeader);
    slugChecks.push({
      path: item.path,
      target_post_type: item.target_post_type,
      ...checked
    });
  }

  const failedSlugChecks = slugChecks.filter((check) => !check.ok);
  const collisions = slugChecks.filter((check) => check.matches && check.matches.length);

  if (failedSlugChecks.length) blockers.push("slug_checks_failed");
  if (collisions.length) blockers.push("slug_collisions_present");

  const report = {
    checked_at: new Date().toISOString(),
    base,
    payload: path.relative(root, args.payload).replace(/\\/g, "/"),
    auth: {
      available: Boolean(authHeader),
      collision_scope: authHeader ? "status_any" : "published_only"
    },
    payload_summary: {
      total: items.length,
      by_post_type: summarizePayload(items)
    },
    rest_root: {
      ok: rootCheck.ok,
      status: rootCheck.status || null,
      error: rootCheck.error || "",
      content_type: rootCheck.content_type || ""
    },
    types: {
      ok: typesCheck.ok,
      status: typesCheck.status || null,
      available: availableTypes,
      expected: payloadTypes.map((payloadType) => expectedTypeByPayloadType[payloadType]).filter(Boolean),
      missing: missingTypes
    },
    endpoints: endpointChecks,
    skipped: {
      endpoint_checks: !canProbeEndpoints,
      slug_checks: !canProbeSlugs,
      reason: !canProbeEndpoints ? "wp_rest_or_types_unreachable" : (!canProbeSlugs ? "wp_endpoints_not_ready" : "")
    },
    collisions,
    failed_slug_checks: failedSlugChecks,
    blockers: unique(blockers),
    go: blockers.length === 0
  };

  console.log(JSON.stringify(report, null, 2));
  if (blockers.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
