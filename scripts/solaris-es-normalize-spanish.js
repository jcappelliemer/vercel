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

const replacements = [
  ["peliculas", "películas"],
  ["laminas", "láminas"],
  ["proteccion", "protección"],
  ["tecnica", "técnica"],
  ["tecnico", "técnico"],
  ["mas", "más"],
  ["despues", "después"],
  ["radiacion", "radiación"],
  ["instalacion", "instalación"],
  ["aplicacion", "aplicación"],
  ["energia", "energía"],
  ["estetica", "estética"],
  ["informacion", "información"],
  ["garantias", "garantías"],
  ["certificacion", "certificación"],
  ["direccion", "dirección"],
  ["Espana", "España"]
];

const htmlSplitPattern = /(<[^>]+>)/g;

function parseArgs(argv) {
  const args = {
    payload: defaultPayloadPath,
    outDir: defaultOutDir,
    failOnNoop: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--payload") args.payload = path.resolve(argv[++i]);
    else if (arg === "--out-dir") args.outDir = path.resolve(argv[++i]);
    else if (arg === "--fail-on-noop") args.failOnNoop = true;
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
Solaris ES Spanish normalizer

Generate a separate accent-normalized payload:
  node scripts/solaris-es-normalize-spanish.js

Options:
  --payload <file>       Source payload JSON.
  --out-dir <dir>        Output directory. Default: docs/solaris-es/generated
  --fail-on-noop         Exit with 1 if no replacement is made.

Safety:
  - Writes a separate generated payload.
  - Touches only post_title and post_content_html in the generated copy.
  - Does not modify slugs, paths, frontend_url, source references or WordPress.
`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function preserveCase(source, replacement) {
  if (source.toUpperCase() === source) return replacement.toUpperCase();
  if (source[0] && source[0].toUpperCase() === source[0]) {
    return `${replacement[0].toUpperCase()}${replacement.slice(1)}`;
  }
  return replacement;
}

function normalizeTextSegment(value, pathValue, field, changes) {
  let output = String(value || "");

  for (const [from, to] of replacements) {
    const pattern = new RegExp(`(^|[^\\p{L}])(${from})(?=[^\\p{L}]|$)`, "giu");
    output = output.replace(pattern, (match, prefix, word) => {
      const replacement = preserveCase(word, to);
      changes.push({
        path: pathValue,
        field,
        from: word,
        to: replacement
      });
      return `${prefix}${replacement}`;
    });
  }

  return output;
}

function normalizeVisibleText(value, pathValue, field, changes) {
  return String(value || "")
    .split(/(\[[A-Z0-9_]+\])/g)
    .map((part) => {
      if (/^\[[A-Z0-9_]+\]$/.test(part)) return part;
      return normalizeTextSegment(part, pathValue, field, changes);
    })
    .join("");
}

function normalizeHtml(value, pathValue, field, changes) {
  return String(value || "")
    .split(htmlSplitPattern)
    .map((part) => {
      if (!part) return part;
      if (part.startsWith("<") && part.endsWith(">")) return part;
      return normalizeVisibleText(part, pathValue, field, changes);
    })
    .join("");
}

function countBy(items, key) {
  const result = {};
  for (const item of items) {
    const value = item[key] || "unknown";
    result[value] = (result[value] || 0) + 1;
  }
  return result;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(changes) {
  const headers = ["path", "field", "from", "to"];
  return [
    headers.join(","),
    ...changes.map((change) => headers.map((header) => csvEscape(change[header])).join(","))
  ].join("\n") + "\n";
}

function buildMarkdown(report) {
  const lines = [
    "# Solarisfilms.es - Normalizzazione spagnola",
    "",
    `Generato: ${report.generated_at}`,
    `Payload sorgente: \`${report.source_payload}\``,
    `Payload generato: \`${report.output_payload}\``,
    "",
    "## Sintesi",
    "",
    `- Pagine analizzate: ${report.summary.total_items}`,
    `- Pagine modificate: ${report.summary.paths_changed}`,
    `- Sostituzioni totali: ${report.summary.total_replacements}`,
    "",
    "## Sostituzioni per termine",
    "",
    "| Da | A | Totale |",
    "| --- | --- | ---: |",
    ...Object.entries(report.summary.by_replacement).map(([key, total]) => {
      const [from, to] = key.split(">");
      return `| ${from} | ${to} | ${total} |`;
    }),
    "",
    "## Prime pagine modificate",
    ""
  ];

  for (const item of report.changed_pages.slice(0, 40)) {
    lines.push(`- \`${item.path}\`: ${item.total_replacements} sostituzioni (${Object.keys(item.by_field).join(", ")})`);
  }

  if (report.changed_pages.length > 40) {
    lines.push(`- ...altre ${report.changed_pages.length - 40} pagine nel JSON/CSV.`);
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = readJson(args.payload);
  if (!Array.isArray(payload.items)) throw new Error("Payload does not contain items[].");

  const normalizedPayload = JSON.parse(JSON.stringify(payload));
  const changes = [];

  for (const item of normalizedPayload.items) {
    const pathValue = item.path || "";
    item.post_title = normalizeVisibleText(item.post_title, pathValue, "post_title", changes);
    item.post_content_html = normalizeHtml(item.post_content_html, pathValue, "post_content_html", changes);
  }

  normalizedPayload.spanish_normalization = {
    applied_at: new Date().toISOString(),
    source_payload: path.relative(root, args.payload).replace(/\\/g, "/"),
    touched_fields: ["post_title", "post_content_html"],
    protected_fields: ["path", "frontend_url", "post_name", "source_it_reference"]
  };

  fs.mkdirSync(args.outDir, { recursive: true });

  const payloadOut = path.join(args.outDir, "solarisfilms-es-wp-import-payload-spanish-normalized.json");
  const reportJson = path.join(args.outDir, "solarisfilms-es-spanish-normalization-report.json");
  const reportCsv = path.join(args.outDir, "solarisfilms-es-spanish-normalization-report.csv");
  const reportMd = path.join(args.outDir, "solarisfilms-es-spanish-normalization-report.md");

  const byReplacement = {};
  for (const change of changes) {
    const key = `${change.from}>${change.to}`;
    byReplacement[key] = (byReplacement[key] || 0) + 1;
  }

  const byPath = new Map();
  for (const change of changes) {
    const current = byPath.get(change.path) || { path: change.path, total_replacements: 0, by_field: {} };
    current.total_replacements += 1;
    current.by_field[change.field] = (current.by_field[change.field] || 0) + 1;
    byPath.set(change.path, current);
  }

  const report = {
    generated_at: normalizedPayload.spanish_normalization.applied_at,
    source_payload: path.relative(root, args.payload).replace(/\\/g, "/"),
    output_payload: path.relative(root, payloadOut).replace(/\\/g, "/"),
    summary: {
      total_items: normalizedPayload.items.length,
      total_replacements: changes.length,
      paths_changed: byPath.size,
      by_field: countBy(changes, "field"),
      by_replacement: byReplacement
    },
    changed_pages: [...byPath.values()].sort((a, b) => b.total_replacements - a.total_replacements || a.path.localeCompare(b.path)),
    changes
  };

  fs.writeFileSync(payloadOut, `${JSON.stringify(normalizedPayload, null, 2)}\n`);
  fs.writeFileSync(reportJson, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(reportCsv, buildCsv(changes));
  fs.writeFileSync(reportMd, buildMarkdown(report));

  console.log(JSON.stringify({
    ok: !args.failOnNoop || changes.length > 0,
    files: {
      payload: path.relative(root, payloadOut).replace(/\\/g, "/"),
      report_json: path.relative(root, reportJson).replace(/\\/g, "/"),
      report_csv: path.relative(root, reportCsv).replace(/\\/g, "/"),
      report_markdown: path.relative(root, reportMd).replace(/\\/g, "/")
    },
    summary: report.summary
  }, null, 2));

  if (args.failOnNoop && changes.length === 0) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
