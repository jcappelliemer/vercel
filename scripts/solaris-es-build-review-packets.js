const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs", "solaris-es");
const generatedDir = path.join(docsDir, "generated");

const defaultPayloadPath = path.join(docsDir, "solarisfilms-es-wp-import-payload-2026-08-05.json");
const defaultEditorialBoardPath = path.join(docsDir, "solarisfilms-es-editorial-board-2026-08-05.csv");
const defaultQaPath = path.join(generatedDir, "solarisfilms-es-content-qa-report.json");

const htmlTagPattern = /<[^>]*>/g;

function parseArgs(argv) {
  const args = {
    payload: defaultPayloadPath,
    editorialBoard: defaultEditorialBoardPath,
    qa: defaultQaPath,
    outDir: generatedDir
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--payload") args.payload = path.resolve(argv[++i]);
    else if (arg === "--editorial-board") args.editorialBoard = path.resolve(argv[++i]);
    else if (arg === "--qa") args.qa = path.resolve(argv[++i]);
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
Solaris ES review packet builder

Generate review packets from payload + editorial board + QA report:
  node scripts/solaris-es-build-review-packets.js

Options:
  --payload <file>             Payload JSON to inspect.
  --editorial-board <file>     Editorial board CSV.
  --qa <file>                  Content QA JSON.
  --out-dir <dir>              Output directory. Default: docs/solaris-es/generated

Safety:
  - Reads local files only.
  - Does not write to WordPress.
  - Does not publish, deploy or change DNS.
`);
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, repairMojibake(values[index] || "")]));
  });
}

function repairMojibake(value) {
  const text = String(value ?? "");
  if (!/[ÃÂ�]/.test(text)) return text;
  try {
    return Buffer.from(text, "latin1").toString("utf8").replace(/�/g, "");
  } catch (_error) {
    return text;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizePath(value) {
  if (!value || value === "/") return "/";
  let clean = String(value).trim().split("#")[0].split("?")[0];
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

function textExcerpt(text, maxLength = 220) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}...`;
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

function priorityWeight(priority) {
  const match = String(priority || "").match(/^P(\d+)$/i);
  return match ? Number(match[1]) : 9;
}

function qaSeverityWeight(issues) {
  if (issues.some((issue) => issue.severity === "error")) return 0;
  if (issues.some((issue) => issue.severity === "warning")) return 1;
  return 2;
}

function buildPacket(item, boardRow, qaIssues) {
  const pathValue = normalizePath(item.path);
  const bodyText = stripHtml(item.post_content_html || "");
  const errorCodes = qaIssues.filter((issue) => issue.severity === "error").map((issue) => issue.code);
  const warningCodes = qaIssues.filter((issue) => issue.severity === "warning").map((issue) => issue.code);
  const infoCodes = qaIssues.filter((issue) => issue.severity === "info").map((issue) => issue.code);
  const requiredActions = [];

  if (errorCodes.includes("placeholder_present")) requiredActions.push("Inserire contatti/dati reali prima di import o publish.");
  if (warningCodes.includes("thin_content_review")) requiredActions.push("Ampliare il testo prima della pubblicazione.");
  if (infoCodes.includes("spanish_accent_review")) requiredActions.push("Correggere accenti e naturalezza dello spagnolo.");
  if (infoCodes.includes("template_generated_review")) requiredActions.push("Revisionare come bozza generata, non pubblicare senza controllo umano.");
  if (boardRow && boardRow.recommended_action) requiredActions.push(boardRow.recommended_action);

  return {
    priority: boardRow && boardRow.priority ? boardRow.priority : "P2",
    path: pathValue,
    title: item.post_title || "",
    target_post_type: item.target_post_type || "",
    review_gate: item.review_gate || "",
    content_source: item.content_source || "",
    owner: boardRow ? boardRow.owner || "" : "",
    blocker: boardRow ? boardRow.blocker || "" : "",
    recommended_action: boardRow ? boardRow.recommended_action || "" : "",
    primary_keyword: boardRow ? boardRow.primary_keyword || "" : "",
    source_it_reference: item.source_it_reference || (boardRow ? boardRow.it_reference || "" : ""),
    word_count: countWords(bodyText),
    qa_errors: errorCodes,
    qa_warnings: warningCodes,
    qa_info: infoCodes,
    required_actions: [...new Set(requiredActions)],
    publish_blocked_until_review: item.publish_blocked_until_review === true,
    draft_import_ready: item.draft_import_ready === true,
    excerpt: textExcerpt(bodyText)
  };
}

function buildCsv(packets) {
  const headers = [
    "priority",
    "path",
    "title",
    "target_post_type",
    "review_gate",
    "content_source",
    "owner",
    "blocker",
    "recommended_action",
    "primary_keyword",
    "source_it_reference",
    "word_count",
    "qa_errors",
    "qa_warnings",
    "qa_info",
    "required_actions",
    "draft_import_ready",
    "publish_blocked_until_review"
  ];

  return [
    headers.join(","),
    ...packets.map((packet) => headers.map((header) => {
      const value = Array.isArray(packet[header]) ? packet[header].join("|") : packet[header];
      return csvEscape(value);
    }).join(","))
  ].join("\n") + "\n";
}

function buildMarkdown(report) {
  const lines = [
    "# Solarisfilms.es - Pacchetti revisione editoriale",
    "",
    `Generato: ${report.generated_at}`,
    `Payload: \`${report.sources.payload}\``,
    `QA: \`${report.sources.qa}\``,
    "",
    "## Sintesi",
    "",
    `- Pagine totali: ${report.summary.total}`,
    ...Object.entries(report.summary.by_priority)
      .sort((a, b) => priorityWeight(a[0]) - priorityWeight(b[0]) || a[0].localeCompare(b[0]))
      .map(([priority, count]) => `- ${priority}: ${count}`),
    `- Con errori QA: ${report.summary.with_qa_errors}`,
    `- Con warning QA: ${report.summary.with_qa_warnings}`,
    "",
    "## Priorita P0",
    ""
  ];

  const priorityGroups = Object.keys(report.summary.by_priority)
    .sort((a, b) => priorityWeight(a) - priorityWeight(b) || a.localeCompare(b));
  for (const priority of priorityGroups) {
    const packets = report.packets.filter((packet) => packet.priority === priority);
    if (priority !== "P0") {
      lines.push(`## Priorita ${priority}`);
      lines.push("");
    }
    if (!packets.length) {
      lines.push("- Nessuna pagina.");
      lines.push("");
      continue;
    }
    for (const packet of packets) {
      lines.push(`### ${packet.path}`);
      lines.push("");
      lines.push(`- Titolo: ${packet.title}`);
      lines.push(`- Tipo: \`${packet.target_post_type}\` - Gate: \`${packet.review_gate}\` - Fonte: \`${packet.content_source}\``);
      lines.push(`- Owner: ${packet.owner || "da assegnare"}`);
      lines.push(`- Parole: ${packet.word_count}`);
      if (packet.blocker) lines.push(`- Blocco: ${packet.blocker}`);
      if (packet.primary_keyword) lines.push(`- Keyword: ${packet.primary_keyword}`);
      if (packet.qa_errors.length) lines.push(`- Errori QA: ${packet.qa_errors.join(", ")}`);
      if (packet.qa_warnings.length) lines.push(`- Warning QA: ${packet.qa_warnings.join(", ")}`);
      if (packet.required_actions.length) {
        lines.push("- Azioni:");
        for (const action of packet.required_actions) lines.push(`  - ${action}`);
      }
      lines.push("");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = readJson(args.payload);
  const qa = readJson(args.qa);
  const boardRows = parseCsv(args.editorialBoard);

  if (!Array.isArray(payload.items)) throw new Error("Payload does not contain items[].");
  if (!Array.isArray(qa.issues)) throw new Error("QA report does not contain issues[].");

  const boardByPath = new Map(boardRows.map((row) => [normalizePath(row.path), row]));
  const qaByPath = new Map();
  for (const issue of qa.issues) {
    const issuePath = normalizePath(issue.path);
    qaByPath.set(issuePath, [...(qaByPath.get(issuePath) || []), issue]);
  }

  const packets = payload.items
    .map((item) => {
      const itemPath = normalizePath(item.path);
      return buildPacket(item, boardByPath.get(itemPath), qaByPath.get(itemPath) || []);
    })
    .sort((a, b) => {
      const priorityDiff = priorityWeight(a.priority) - priorityWeight(b.priority);
      if (priorityDiff) return priorityDiff;
      const severityDiff = qaSeverityWeight(a.qa_errors.concat(a.qa_warnings).map((code) => (
        a.qa_errors.includes(code) ? { severity: "error" } : { severity: "warning" }
      ))) - qaSeverityWeight(b.qa_errors.concat(b.qa_warnings).map((code) => (
        b.qa_errors.includes(code) ? { severity: "error" } : { severity: "warning" }
      )));
      if (severityDiff) return severityDiff;
      return a.path.localeCompare(b.path);
    });

  const report = {
    generated_at: new Date().toISOString(),
    sources: {
      payload: path.relative(root, args.payload).replace(/\\/g, "/"),
      editorial_board: path.relative(root, args.editorialBoard).replace(/\\/g, "/"),
      qa: path.relative(root, args.qa).replace(/\\/g, "/")
    },
    summary: {
      total: packets.length,
      by_priority: countBy(packets, "priority"),
      by_post_type: countBy(packets, "target_post_type"),
      by_review_gate: countBy(packets, "review_gate"),
      with_qa_errors: packets.filter((packet) => packet.qa_errors.length).length,
      with_qa_warnings: packets.filter((packet) => packet.qa_warnings.length).length,
      publish_blocked_until_review: packets.filter((packet) => packet.publish_blocked_until_review).length
    },
    packets
  };

  fs.mkdirSync(args.outDir, { recursive: true });
  const jsonPath = path.join(args.outDir, "solarisfilms-es-review-packets.json");
  const csvPath = path.join(args.outDir, "solarisfilms-es-review-packets.csv");
  const mdPath = path.join(args.outDir, "solarisfilms-es-review-packets.md");

  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(csvPath, buildCsv(packets));
  fs.writeFileSync(mdPath, buildMarkdown(report));

  console.log(JSON.stringify({
    ok: true,
    files: {
      json: path.relative(root, jsonPath).replace(/\\/g, "/"),
      csv: path.relative(root, csvPath).replace(/\\/g, "/"),
      markdown: path.relative(root, mdPath).replace(/\\/g, "/")
    },
    summary: report.summary
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
