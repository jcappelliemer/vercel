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

const placeholderPattern = /\[[A-Z0-9_]+\]/g;
const hrefPattern = /href\s*=\s*["']([^"']+)["']/gi;
const htmlTagPattern = /<[^>]*>/g;
const mojibakePattern = /Ã.|Â.|�/;

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

const italianResidueTerms = [
  "pellicola",
  "pellicole",
  "vetro",
  "vetri",
  "antisolare",
  "antisolari",
  "sicurezza",
  "certificato",
  "certificata",
  "preventivo",
  "contatti",
  "servizi",
  "garanzia",
  "garanzie",
  "norme",
  "guida tecnica",
  "lo sapevi",
  "richiedi",
  "posa",
  "installazione",
  "intervento",
  "scheda tecnica",
  "luogo",
  "azienda"
];

const accentReviewTerms = [
  "peliculas",
  "laminas",
  "proteccion",
  "tecnica",
  "tecnico",
  "mas",
  "despues",
  "radiacion",
  "instalacion",
  "aplicacion",
  "energia",
  "estetica",
  "informacion",
  "garantias",
  "certificacion",
  "direccion",
  "Espana"
];

const minimumWords = {
  page: 120,
  producto: 180,
  pagina_info: 160,
  servicio_local: 140,
  articulo: 180
};

function parseArgs(argv) {
  const args = {
    payload: defaultPayloadPath,
    outDir: defaultOutDir,
    failOnError: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--payload") args.payload = path.resolve(argv[++i]);
    else if (arg === "--out-dir") args.outDir = path.resolve(argv[++i]);
    else if (arg === "--fail-on-error") args.failOnError = true;
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
Solaris ES editorial QA

Generate offline QA reports for Spanish draft payload:
  node scripts/solaris-es-content-qa.js

Options:
  --payload <file>       Payload JSON to inspect.
  --out-dir <dir>        Output directory. Default: docs/solaris-es/generated
  --fail-on-error        Exit with 1 if blocking issues are found.

Safety:
  - Reads local payload only.
  - Does not write to WordPress.
  - Does not publish, deploy or change DNS.
`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizePath(value) {
  if (!value || value === "/") return "/";
  let clean = String(value).trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(clean)) return clean;
  clean = clean.split("#")[0].split("?")[0];
  if (!clean.startsWith("/")) clean = `/${clean}`;
  if (!clean.endsWith("/")) clean = `${clean}/`;
  return clean.replace(/\/{2,}/g, "/");
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(htmlTagPattern, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text) {
  const matches = String(text || "").match(/\b[\p{L}\p{N}'-]+\b/gu);
  return matches ? matches.length : 0;
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) {
    const value = item[key] || "unknown";
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

function unique(values) {
  return [...new Set(values)].sort();
}

function findTerms(text, terms) {
  const lower = ` ${String(text || "").toLowerCase()} `;
  return terms.filter((term) => {
    const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[^\\p{L}])${escaped}([^\\p{L}]|$)`, "u");
    return pattern.test(lower);
  });
}

function extractInternalLinks(html) {
  const links = [];
  let match;
  hrefPattern.lastIndex = 0;
  while ((match = hrefPattern.exec(String(html || "")))) {
    const href = match[1].trim();
    if (!href || href.startsWith("#")) continue;
    if (/^(mailto:|tel:|https?:\/\/|\/\/|javascript:)/i.test(href)) continue;
    links.push(normalizePath(href));
  }
  return unique(links);
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(rows) {
  const headers = [
    "severity",
    "code",
    "path",
    "target_post_type",
    "title",
    "detail",
    "values"
  ];

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(
      Array.isArray(row[header]) ? row[header].join("|") : row[header]
    )).join(","))
  ].join("\n") + "\n";
}

function buildMarkdown(report) {
  const lines = [
    "# Solarisfilms.es - QA editoriale offline",
    "",
    `Generato: ${report.generated_at}`,
    `Payload: \`${report.payload}\``,
    "",
    "## Sintesi",
    "",
    `- URL analizzate: ${report.summary.total_items}`,
    `- Issue bloccanti: ${report.summary.error_count}`,
    `- Warning editoriali: ${report.summary.warning_count}`,
    `- Info: ${report.summary.info_count}`,
    "",
    "## Conteggi per tipo",
    "",
    "| Tipo | Totale |",
    "| --- | ---: |",
    ...Object.entries(report.summary.by_post_type).map(([key, value]) => `| \`${key}\` | ${value} |`),
    "",
    "## Issue principali",
    ""
  ];

  const grouped = {};
  for (const issue of report.issues) {
    grouped[issue.severity] = grouped[issue.severity] || [];
    grouped[issue.severity].push(issue);
  }

  for (const severity of ["error", "warning", "info"]) {
    const items = grouped[severity] || [];
    lines.push(`### ${severity}`);
    lines.push("");
    if (!items.length) {
      lines.push("- Nessuna.");
      lines.push("");
      continue;
    }
    for (const item of items.slice(0, 80)) {
      const values = Array.isArray(item.values) && item.values.length ? ` (${item.values.join(", ")})` : "";
      lines.push(`- \`${item.path}\` - ${item.code}: ${item.detail}${values}`);
    }
    if (items.length > 80) lines.push(`- ...altre ${items.length - 80} issue nel JSON/CSV.`);
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function inspectPayload(payload, payloadPath) {
  if (!Array.isArray(payload.items)) throw new Error("Payload does not contain items[].");

  const knownPaths = new Set(payload.items.map((item) => normalizePath(item.path)));
  const issues = [];

  for (const item of payload.items) {
    const pathValue = normalizePath(item.path);
    const html = item.post_content_html || "";
    const text = stripHtml(html);
    const serialized = JSON.stringify(item);
    const wordCount = countWords(text);
    const minWords = minimumWords[item.target_post_type] || 120;

    const base = {
      path: pathValue,
      target_post_type: item.target_post_type || "",
      title: item.post_title || ""
    };

    const placeholders = unique(serialized.match(placeholderPattern) || []);
    if (placeholders.length) {
      issues.push({
        ...base,
        severity: "error",
        code: "placeholder_present",
        detail: "La pagina contiene placeholder non pubblicabili.",
        values: placeholders
      });
    }

    const forbidden = findTerms(serialized, forbiddenTerms);
    if (forbidden.length) {
      issues.push({
        ...base,
        severity: "error",
        code: "forbidden_term_present",
        detail: "La pagina contiene termini esclusi dal nuovo sito.",
        values: forbidden
      });
    }

    const brokenLinks = extractInternalLinks(html).filter((link) => !knownPaths.has(link));
    if (brokenLinks.length) {
      issues.push({
        ...base,
        severity: "error",
        code: "unknown_internal_link",
        detail: "Link interno non presente nel payload.",
        values: brokenLinks
      });
    }

    if (mojibakePattern.test(serialized)) {
      issues.push({
        ...base,
        severity: "warning",
        code: "encoding_mojibake_suspected",
        detail: "Possibile testo con codifica corrotta.",
        values: unique((serialized.match(/Ã.|Â.|�/g) || []).slice(0, 12))
      });
    }

    const italianTerms = findTerms(text, italianResidueTerms);
    if (italianTerms.length) {
      issues.push({
        ...base,
        severity: "warning",
        code: "italian_residue_suspected",
        detail: "Possibili residui italiani da revisionare.",
        values: italianTerms
      });
    }

    const accentTerms = findTerms(text, accentReviewTerms);
    if (accentTerms.length) {
      issues.push({
        ...base,
        severity: "info",
        code: "spanish_accent_review",
        detail: "Termini spagnoli probabilmente da accentare in revisione editoriale.",
        values: accentTerms.slice(0, 12)
      });
    }

    if (wordCount < minWords) {
      issues.push({
        ...base,
        severity: "warning",
        code: "thin_content_review",
        detail: `Contenuto breve per il tipo ${item.target_post_type}; soglia ${minWords} parole.`,
        values: [`words:${wordCount}`]
      });
    }

    if (item.content_source === "template_generated") {
      issues.push({
        ...base,
        severity: "info",
        code: "template_generated_review",
        detail: "Bozza generata da template: richiede revisione umana prima del publish.",
        values: []
      });
    }
  }

  const duplicates = payload.items
    .map((item) => normalizePath(item.path))
    .filter((itemPath, index, all) => all.indexOf(itemPath) !== index);
  if (duplicates.length) {
    issues.push({
      severity: "error",
      code: "duplicate_payload_path",
      path: "",
      target_post_type: "",
      title: "",
      detail: "Path duplicati nel payload.",
      values: unique(duplicates)
    });
  }

  const summary = {
    total_items: payload.items.length,
    by_post_type: countBy(payload.items, "target_post_type"),
    error_count: issues.filter((issue) => issue.severity === "error").length,
    warning_count: issues.filter((issue) => issue.severity === "warning").length,
    info_count: issues.filter((issue) => issue.severity === "info").length,
    by_code: countBy(issues, "code")
  };

  return {
    generated_at: new Date().toISOString(),
    payload: path.relative(root, payloadPath).replace(/\\/g, "/"),
    summary,
    issues
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = readJson(args.payload);
  const report = inspectPayload(payload, args.payload);

  fs.mkdirSync(args.outDir, { recursive: true });

  const jsonPath = path.join(args.outDir, "solarisfilms-es-content-qa-report.json");
  const csvPath = path.join(args.outDir, "solarisfilms-es-content-qa-report.csv");
  const mdPath = path.join(args.outDir, "solarisfilms-es-content-qa-report.md");

  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(csvPath, buildCsv(report.issues));
  fs.writeFileSync(mdPath, buildMarkdown(report));

  console.log(JSON.stringify({
    ok: !args.failOnError || report.summary.error_count === 0,
    files: {
      json: path.relative(root, jsonPath).replace(/\\/g, "/"),
      csv: path.relative(root, csvPath).replace(/\\/g, "/"),
      markdown: path.relative(root, mdPath).replace(/\\/g, "/")
    },
    summary: report.summary
  }, null, 2));

  if (args.failOnError && report.summary.error_count > 0) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
