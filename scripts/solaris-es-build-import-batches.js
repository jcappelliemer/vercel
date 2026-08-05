const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const defaultPayloadPath = path.join(root, "docs", "solaris-es", "solarisfilms-es-wp-import-payload-2026-08-05.json");
const defaultOutDir = path.join(root, "docs", "solaris-es", "generated");

const placeholderPattern = /\[[A-Z0-9_]+\]/g;
const mvpPaths = new Set([
  "/",
  "/servicios/",
  "/productos/",
  "/company-profile/",
  "/presupuesto/",
  "/contacto/",
  "/certificado-de-seguridad/",
  "/lo-sabias/"
]);

function parseArgs(argv) {
  const args = {
    payload: defaultPayloadPath,
    outDir: defaultOutDir
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--payload") args.payload = path.resolve(argv[++i]);
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
Solaris ES import batch planner

Generate local, non-deployed import batches:
  node scripts/solaris-es-build-import-batches.js

Options:
  --payload <file>   Payload JSON to read.
  --out-dir <dir>    Output directory. Default: docs/solaris-es/generated

Safety:
  - Writes only local planning files.
  - Does not write to WordPress.
  - Does not publish any content.
`);
}

function loadPayload(payloadPath) {
  const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
  if (!Array.isArray(payload.items)) throw new Error("Payload does not contain items[].");
  return payload;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function itemStatus(item) {
  const placeholders = [...new Set(JSON.stringify(item).match(placeholderPattern) || [])];
  const blockers = [];
  if (!item.draft_import_ready) blockers.push("not_draft_import_ready");
  if (!item.post_content_html || !item.post_content_html.trim()) blockers.push("missing_content");
  if (placeholders.length) blockers.push("placeholder_present");
  if (item.publish_blocked_until_review === true) blockers.push("manual_review_required");
  if (item.content_source === "template_generated") blockers.push("template_generated_review_required");

  return {
    placeholders,
    blockers,
    draft_import_safe: item.draft_import_ready === true && Boolean(item.post_content_html && item.post_content_html.trim()),
    publish_candidate_after_review: blockers.filter((blocker) => blocker !== "manual_review_required").length === 0
  };
}

function toBatchItem(item, batch, note = "") {
  const status = itemStatus(item);
  return {
    batch,
    path: item.path,
    title: item.post_title,
    target_post_type: item.target_post_type,
    post_name: item.post_name,
    review_gate: item.review_gate,
    content_source: item.content_source,
    draft_import_safe: status.draft_import_safe,
    publish_candidate_after_review: status.publish_candidate_after_review,
    blockers: status.blockers,
    placeholders: status.placeholders,
    note
  };
}

function countBy(items, key) {
  const result = {};
  for (const item of items) {
    const value = item[key] || "unknown";
    result[value] = (result[value] || 0) + 1;
  }
  return result;
}

function buildBatches(items) {
  const pilotPaths = new Set(["/", "/servicios/", "/productos/"]);
  const pilot = items
    .filter((item) => pilotPaths.has(item.path))
    .map((item) => toBatchItem(item, "pilot_draft_import", "Prima prova REST/editor. Importare come draft, non pubblicare."));

  const mvp = items
    .filter((item) => mvpPaths.has(item.path))
    .map((item) => toBatchItem(item, "mvp_review_set", "Set minimo da revisionare prima di una pubblicazione corta."));

  const seeded = items
    .filter((item) => item.content_source === "content_seed")
    .map((item) => toBatchItem(item, "seed_content_review", "Contenuto seed manuale: prioritario per revisione."));

  const fullDraft = items
    .map((item) => toBatchItem(item, "full_draft_import", "Import completo come draft, mai publish automatico."));

  const templateReview = items
    .filter((item) => item.content_source === "template_generated")
    .map((item) => toBatchItem(item, "template_generated_review", "Bozza generata: richiede copy/localizzazione prima del publish."));

  const publishBlocked = items
    .map((item) => toBatchItem(item, "publish_blockers"))
    .filter((item) => item.blockers.length);

  return {
    pilot_draft_import: pilot,
    mvp_review_set: mvp,
    seed_content_review: seeded,
    full_draft_import: fullDraft,
    template_generated_review: templateReview,
    publish_blockers: publishBlocked
  };
}

function flattenBatches(batches) {
  return Object.values(batches).flat();
}

function buildCsv(rows) {
  const headers = [
    "batch",
    "path",
    "title",
    "target_post_type",
    "post_name",
    "review_gate",
    "content_source",
    "draft_import_safe",
    "publish_candidate_after_review",
    "blockers",
    "placeholders",
    "note"
  ];

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => {
      const value = Array.isArray(row[header]) ? row[header].join("|") : row[header];
      return csvEscape(value);
    }).join(","))
  ].join("\n") + "\n";
}

function summarizeBatches(batches) {
  const summary = {};
  for (const [name, rows] of Object.entries(batches)) {
    summary[name] = {
      total: rows.length,
      draft_import_safe: rows.filter((row) => row.draft_import_safe).length,
      publish_candidate_after_review: rows.filter((row) => row.publish_candidate_after_review).length,
      with_blockers: rows.filter((row) => row.blockers.length).length,
      by_post_type: countBy(rows, "target_post_type"),
      by_review_gate: countBy(rows, "review_gate")
    };
  }
  return summary;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = loadPayload(args.payload);
  const batches = buildBatches(payload.items);
  const rows = flattenBatches(batches);
  const summary = summarizeBatches(batches);

  fs.mkdirSync(args.outDir, { recursive: true });

  const jsonPath = path.join(args.outDir, "solarisfilms-es-import-batches.json");
  const csvPath = path.join(args.outDir, "solarisfilms-es-import-batches.csv");

  fs.writeFileSync(jsonPath, `${JSON.stringify({
    generated_at: new Date().toISOString(),
    payload: path.relative(root, args.payload).replace(/\\/g, "/"),
    safety: [
      "All imports are drafts.",
      "No batch authorizes publish by itself.",
      "Publish requires manual review, contacts, legal checks and live QA."
    ],
    summary,
    batches
  }, null, 2)}\n`);

  fs.writeFileSync(csvPath, buildCsv(rows));

  console.log(JSON.stringify({
    output: {
      json: path.relative(root, jsonPath).replace(/\\/g, "/"),
      csv: path.relative(root, csvPath).replace(/\\/g, "/")
    },
    summary
  }, null, 2));
}

main();
