const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const paths = {
  payload: path.join(root, "docs", "solaris-es", "solarisfilms-es-wp-import-payload-2026-08-05.json"),
  seoSummary: path.join(root, "docs", "solaris-es", "generated", "solarisfilms-es-seo-assets-summary.json"),
  robotsStaging: path.join(root, "docs", "solaris-es", "generated", "solarisfilms-es-robots-staging-preview.txt"),
  robotsProduction: path.join(root, "docs", "solaris-es", "generated", "solarisfilms-es-robots-production-preview.txt"),
  sitemapCandidate: path.join(root, "docs", "solaris-es", "generated", "solarisfilms-es-sitemap-candidate.xml"),
  urlPreview: path.join(root, "docs", "solaris-es", "generated", "solarisfilms-es-url-publication-preview.csv"),
  themeStyle: path.join(root, "wordpress", "solaris-es-theme", "style.css"),
  themeFunctions: path.join(root, "wordpress", "solaris-es-theme", "functions.php"),
  themeCss: path.join(root, "wordpress", "solaris-es-theme", "assets", "css", "solaris-es.css"),
  themeJs: path.join(root, "wordpress", "solaris-es-theme", "assets", "js", "solaris-es.js"),
  muPlugin: path.join(root, "wordpress", "mu-plugins", "solaris-es-content-types.php"),
  packageScript: path.join(root, "scripts", "solaris-es-package-wp-kit.js"),
  importScript: path.join(root, "scripts", "solaris-es-wp-rest-import-drafts.js"),
  preflightScript: path.join(root, "scripts", "solaris-es-preflight-check.js"),
  readinessScript: path.join(root, "scripts", "solaris-es-wp-readiness-check.js"),
  postImportQaScript: path.join(root, "scripts", "solaris-es-post-import-qa.js"),
  seoAssetsScript: path.join(root, "scripts", "solaris-es-build-seo-assets.js"),
  installKitManifest: path.join(root, "wordpress", "solaris-es-install-kit", "manifest.json")
};

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
  const args = { out: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--out") args.out = path.resolve(argv[++i]);
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
Solaris ES launch gate

Offline consolidated gate:
  node scripts/solaris-es-launch-gate.js

Write report:
  node scripts/solaris-es-launch-gate.js --out docs/solaris-es/solarisfilms-es-launch-gate-latest.json

Safety:
  - Reads local files only.
  - Does not call WordPress.
  - Does not publish, deploy, change DNS or robots.
`);
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) {
    const value = item[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

function inspectText(text) {
  const lower = text.toLowerCase();
  return {
    placeholders: [...new Set(text.match(placeholderPattern) || [])],
    forbidden: forbiddenTerms.filter((term) => lower.includes(term))
  };
}

function validateRequiredFiles() {
  const required = [
    "payload",
    "seoSummary",
    "robotsStaging",
    "robotsProduction",
    "sitemapCandidate",
    "urlPreview",
    "themeStyle",
    "themeFunctions",
    "themeCss",
    "themeJs",
    "muPlugin",
    "packageScript",
    "importScript",
    "preflightScript",
    "readinessScript",
    "postImportQaScript",
    "seoAssetsScript"
  ];

  return required.map((key) => ({
    key,
    path: rel(paths[key]),
    exists: exists(paths[key])
  }));
}

function validatePayload(payload) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const itemIssues = [];

  for (const item of items) {
    const findings = inspectText(JSON.stringify(item));
    const issues = [];
    if (!item.path || !item.path.startsWith("/")) issues.push("invalid_path");
    if (!item.post_title) issues.push("missing_title");
    if (!item.post_name) issues.push("missing_slug");
    if (!item.target_post_type) issues.push("missing_post_type");
    if (!item.post_content_html || !item.post_content_html.trim()) issues.push("missing_content");
    if (findings.placeholders.length) issues.push("placeholder_present");
    if (findings.forbidden.length) issues.push("forbidden_term_present");
    if (item.post_status !== "draft") issues.push("post_status_not_draft");
    if (item.publish_blocked_until_review !== true) issues.push("publish_guard_missing");

    if (issues.length) {
      itemIssues.push({
        path: item.path,
        issues,
        placeholders: findings.placeholders,
        forbidden: findings.forbidden
      });
    }
  }

  return {
    total: items.length,
    by_post_type: countBy(items, "target_post_type"),
    by_review_gate: countBy(items, "review_gate"),
    by_content_source: countBy(items, "content_source"),
    draft_import_ready: items.filter((item) => item.draft_import_ready === true).length,
    publish_blocked_until_review: items.filter((item) => item.publish_blocked_until_review === true).length,
    item_issues: itemIssues
  };
}

function validateSeoAssets(summary) {
  const stagingRobots = exists(paths.robotsStaging) ? fs.readFileSync(paths.robotsStaging, "utf8") : "";
  const productionRobots = exists(paths.robotsProduction) ? fs.readFileSync(paths.robotsProduction, "utf8") : "";
  const sitemap = exists(paths.sitemapCandidate) ? fs.readFileSync(paths.sitemapCandidate, "utf8") : "";

  const issues = [];
  if (!/Disallow:\s*\//i.test(stagingRobots)) issues.push("staging_robots_not_blocking");
  if (!/Allow:\s*\//i.test(productionRobots)) issues.push("production_robots_not_allowing");
  if (!/Sitemap:\s*https:\/\/www\.solarisfilms\.es\/sitemap\.xml/i.test(productionRobots)) issues.push("production_robots_missing_sitemap");
  if (/solarisfilms\.it/i.test(sitemap)) issues.push("sitemap_references_it_domain");
  if (/\/contacto\/<\/loc>/i.test(sitemap)) issues.push("sitemap_includes_placeholder_contact_page");

  return {
    total: summary.total,
    sitemap_candidate_urls: summary.sitemap_candidate_urls,
    machine_blocked_urls: summary.machine_blocked_urls,
    publish_blocked_until_review: summary.publish_blocked_until_review,
    blockers: summary.blockers || [],
    issues
  };
}

function validateInstallKit() {
  if (!exists(paths.installKitManifest)) {
    return {
      generated: false,
      path: rel(paths.installKitManifest),
      files: 0,
      issues: ["install_kit_not_generated"]
    };
  }

  const manifest = readJson(paths.installKitManifest);
  const files = Array.isArray(manifest.files) ? manifest.files : [];
  const issues = [];
  if (!manifest.includes || !manifest.includes.theme) issues.push("install_kit_missing_theme_entry");
  if (!manifest.includes || !manifest.includes.mu_plugin) issues.push("install_kit_missing_mu_plugin_entry");

  return {
    generated: true,
    path: rel(paths.installKitManifest),
    files: files.length,
    issues
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const requiredFiles = validateRequiredFiles();
  const missingRequiredFiles = requiredFiles.filter((file) => !file.exists);
  const payload = exists(paths.payload) ? readJson(paths.payload) : { items: [] };
  const seoSummary = exists(paths.seoSummary) ? readJson(paths.seoSummary) : {};

  const payloadGate = validatePayload(payload);
  const seoGate = validateSeoAssets(seoSummary);
  const installKit = validateInstallKit();

  const repoBlockers = [];
  if (missingRequiredFiles.length) repoBlockers.push("required_files_missing");
  if (payloadGate.total !== 78) repoBlockers.push("payload_total_unexpected");
  if (payloadGate.draft_import_ready !== payloadGate.total) repoBlockers.push("payload_not_all_import_ready");
  if (payloadGate.item_issues.some((item) => item.issues.includes("forbidden_term_present"))) repoBlockers.push("payload_forbidden_terms_present");
  if (seoGate.issues.length) repoBlockers.push("seo_preview_invalid");

  const launchBlockers = [];
  if (payloadGate.item_issues.length) launchBlockers.push("payload_item_issues_present");
  if (seoGate.machine_blocked_urls > 0) launchBlockers.push("seo_machine_blocked_urls_present");
  if (seoGate.publish_blocked_until_review > 0) launchBlockers.push("manual_review_not_cleared");
  if (!installKit.generated) launchBlockers.push("install_kit_not_generated");
  if (installKit.issues.length) launchBlockers.push("install_kit_issues_present");
  launchBlockers.push("domain_wp_https_preflight_required");
  launchBlockers.push("wordpress_readiness_required");
  launchBlockers.push("live_post_import_qa_required");

  const report = {
    checked_at: new Date().toISOString(),
    repo_ready: repoBlockers.length === 0,
    launch_ready: launchBlockers.length === 0,
    required_files: requiredFiles,
    payload: payloadGate,
    seo_assets: seoGate,
    install_kit: installKit,
    repo_blockers: repoBlockers,
    launch_blockers: launchBlockers,
    next_commands_when_wp_is_ready: [
      "node scripts/solaris-es-preflight-check.js",
      "node scripts/solaris-es-wp-readiness-check.js",
      "node scripts/solaris-es-wp-rest-import-drafts.js --apply --type page --limit 2",
      "node scripts/solaris-es-post-import-qa.js --live --base https://www.solarisfilms.es"
    ]
  };

  if (args.out) {
    fs.mkdirSync(path.dirname(args.out), { recursive: true });
    fs.writeFileSync(args.out, `${JSON.stringify(report, null, 2)}\n`);
  }

  console.log(JSON.stringify(report, null, 2));
  if (!report.repo_ready) process.exitCode = 1;
}

main();
