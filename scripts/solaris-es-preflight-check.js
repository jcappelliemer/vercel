const dns = require("dns").promises;
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const payloadPath = path.join(root, "docs", "solaris-es", "solarisfilms-es-wp-import-payload-2026-08-05.json");

const DEFAULT_HOSTS = ["solarisfilms.es", "www.solarisfilms.es", "crm.solarisfilms.es"];
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
  "nt 35",
];

function timeoutSignal(ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timer) };
}

async function resolveHost(host) {
  try {
    const records = await dns.resolve4(host);
    return { host, ok: true, records };
  } catch (error) {
    return { host, ok: false, error: error.code || error.message };
  }
}

async function head(url) {
  const timeout = timeoutSignal(8000);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: timeout.signal,
    });
    return {
      url,
      ok: true,
      status: response.status,
      location: response.headers.get("location") || "",
      server: response.headers.get("server") || "",
      contentType: response.headers.get("content-type") || "",
    };
  } catch (error) {
    return { url, ok: false, error: error.name === "AbortError" ? "timeout" : error.message };
  } finally {
    timeout.cancel();
  }
}

async function textProbe(url) {
  const timeout = timeoutSignal(8000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: timeout.signal,
    });
    const text = await response.text();
    return {
      url,
      ok: true,
      status: response.status,
      hasRegistrantHold: /Verification of Contact Information/i.test(text),
      sample: text.slice(0, 120).replace(/\s+/g, " ").trim(),
    };
  } catch (error) {
    return { url, ok: false, error: error.name === "AbortError" ? "timeout" : error.message };
  } finally {
    timeout.cancel();
  }
}

function loadPayload() {
  const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
  const items = Array.isArray(payload.items) ? payload.items : [];
  const byType = {};
  const bySource = {};
  const placeholders = [];
  const forbiddenHits = [];
  const placeholderPattern = /\[[A-Z0-9_]+\]/g;

  for (const item of items) {
    byType[item.target_post_type] = (byType[item.target_post_type] || 0) + 1;
    bySource[item.content_source] = (bySource[item.content_source] || 0) + 1;

    const text = JSON.stringify(item);
    const foundPlaceholders = [...new Set(text.match(placeholderPattern) || [])];
    if (foundPlaceholders.length) {
      placeholders.push({ path: item.path, placeholders: foundPlaceholders });
    }

    const lower = text.toLowerCase();
    const hits = forbiddenTerms.filter((term) => lower.includes(term));
    if (hits.length) {
      forbiddenHits.push({ path: item.path, terms: hits });
    }
  }

  return {
    file: path.relative(root, payloadPath).replace(/\\/g, "/"),
    total: items.length,
    draftImportReady: items.filter((item) => item.draft_import_ready === true).length,
    publishBlocked: items.filter((item) => item.publish_blocked_until_review === true).length,
    byType,
    bySource,
    placeholders,
    forbiddenHits,
  };
}

async function main() {
  const domain = process.argv[2] || "https://www.solarisfilms.es";
  const base = domain.replace(/\/$/, "");
  const hosts = DEFAULT_HOSTS;

  const [dnsResults, httpApex, httpWww, httpsApex, httpsWww, wpRest, bodyProbe] = await Promise.all([
    Promise.all(hosts.map(resolveHost)),
    head("http://solarisfilms.es/"),
    head("http://www.solarisfilms.es/"),
    head("https://solarisfilms.es/"),
    head("https://www.solarisfilms.es/"),
    head(`${base}/wp-json/`),
    textProbe("http://solarisfilms.es/"),
  ]);

  const payload = loadPayload();
  const blockers = [];

  if (bodyProbe.hasRegistrantHold) blockers.push("domain_registrant_hold");
  if (!httpsWww.ok || httpsWww.status >= 400) blockers.push("https_www_not_ready");
  if (!wpRest.ok || wpRest.status >= 400) blockers.push("wp_rest_not_ready");
  if (payload.placeholders.length) blockers.push("payload_placeholders_present");
  if (payload.forbiddenHits.length) blockers.push("payload_forbidden_terms_present");
  if (payload.publishBlocked !== payload.total) blockers.push("payload_publish_guard_missing");

  const report = {
    checkedAt: new Date().toISOString(),
    domain,
    dns: dnsResults,
    http: {
      apex: httpApex,
      www: httpWww,
      httpsApex,
      httpsWww,
      bodyProbe,
    },
    wordpress: {
      rest: wpRest,
      env: {
        SOLARIS_ES_WP_URL: Boolean(process.env.SOLARIS_ES_WP_URL),
        SOLARIS_ES_WP_USER: Boolean(process.env.SOLARIS_ES_WP_USER),
        SOLARIS_ES_WP_APP_PASSWORD: Boolean(process.env.SOLARIS_ES_WP_APP_PASSWORD),
      },
    },
    payload,
    blockers,
    go: blockers.length === 0,
  };

  console.log(JSON.stringify(report, null, 2));
  if (blockers.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

