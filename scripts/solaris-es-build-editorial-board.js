#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs", "solaris-es");
const DRYRUN_PATH = path.join(DOCS_DIR, "solarisfilms-es-wp-import-dryrun-2026-08-05.csv");
const SEO_PATH = path.join(DOCS_DIR, "solarisfilms-es-seo-metadata-2026-08-05.csv");
const HREFLANG_PATH = path.join(DOCS_DIR, "solarisfilms-es-hreflang-map-2026-08-05.csv");
const MANIFEST_PATH = path.join(DOCS_DIR, "solarisfilms-es-route-manifest-2026-08-04.json");
const OUT_CSV = path.join(DOCS_DIR, "solarisfilms-es-editorial-board-2026-08-05.csv");
const OUT_MD = path.join(DOCS_DIR, "solarisfilms-es-editorial-board-2026-08-05.md");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.length > 0)) rows.push(row);

  const [headers, ...dataRows] = rows;
  return dataRows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function toCsvValue(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(filePath, rows, headers) {
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => toCsvValue(row[header])).join(",")),
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function flattenManifestRoutes(manifest) {
  const groups = [
    "core_pages",
    "technical_focus_pages",
    "product_pages",
    "info_pages",
    "local_pages",
    "starter_articles",
  ];

  const routes = new Map();
  for (const group of groups) {
    for (const item of manifest[group] || []) {
      routes.set(item.path, {
        manifest_group: group,
        source_it_reference: item.source_it_reference || "",
      });
    }
  }
  return routes;
}

function gateOwner(gate) {
  return {
    legal_data: "James + consulente legale/societario",
    contact_data: "James + commerciale Spagna",
    form_crm: "James + CRM",
    legal_review: "legale/normativo",
    technical_sheet: "tecnico prodotto",
    local_review: "commerciale locale",
    commercial_review: "James/commerciale",
    copy_review: "copy + James",
  }[gate] || "James";
}

function blocker(gate) {
  return {
    legal_data: "Dati societari reali, CIF/NIF, indirizzo e privacy.",
    contact_data: "Telefono, WhatsApp, email, indirizzo e orari spagnoli.",
    form_crm: "Endpoint form, consenso privacy, routing lead e test marker.",
    legal_review: "Validazione riferimenti UNE/CTE/garanzie e frasi di responsabilita.",
    technical_sheet: "Scheda tecnica ufficiale, dati prodotto, immagini e download.",
    local_review: "Aree realmente servite, CTA locale e dati contatto coerenti.",
    commercial_review: "Decisione se includere nella prima release o tenere in backlog.",
    copy_review: "Riscrittura naturale in spagnolo, niente note interne, CTA coerenti.",
  }[gate] || "Revisione contenuto.";
}

function priority(row) {
  const p = row.path;
  const gate = row.review_gate;
  if (gate === "legal_data" || gate === "contact_data" || gate === "form_crm") return "P0";
  if (p === "/certificado-de-seguridad/" || gate === "legal_review") return "P0";
  if (gate === "technical_sheet" || gate === "local_review") return "P1";
  if (gate === "commercial_review") return "P2-hold";
  return "P2";
}

function action(row) {
  const gate = row.review_gate;
  if (gate === "commercial_review") return "Decidere se pubblicare o rimandare.";
  if (gate === "technical_sheet") return "Compilare prodotto da scheda tecnica e controllare download.";
  if (gate === "local_review") return "Validare area servita e personalizzare CTA locale.";
  if (gate === "legal_review") return "Revisionare testo prima di pubblicare.";
  if (gate === "copy_review") return "Rifinire copy e collegamenti interni.";
  if (gate === "form_crm") return "Configurare e testare form senza lead reali.";
  if (gate === "contact_data") return "Inserire contatti definitivi.";
  if (gate === "legal_data") return "Inserire dati societari definitivi.";
  return "Review.";
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    acc[row[key]] = (acc[row[key]] || 0) + 1;
    return acc;
  }, {});
}

function main() {
  const dryrun = parseCsv(fs.readFileSync(DRYRUN_PATH, "utf8"));
  const seoRows = parseCsv(fs.readFileSync(SEO_PATH, "utf8"));
  const hreflangRows = parseCsv(fs.readFileSync(HREFLANG_PATH, "utf8"));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const manifestRoutes = flattenManifestRoutes(manifest);

  const seoByPath = new Map(seoRows.map((row) => [row.path, row]));
  const hreflangByPath = new Map(hreflangRows.map((row) => [row.es_path || row.path || row.es_url, row]));

  const rows = dryrun.map((row) => {
    const seo = seoByPath.get(row.path) || {};
    const route = manifestRoutes.get(row.path) || {};
    const hreflang = hreflangByPath.get(row.path) || {};
    return {
      priority: priority(row),
      path: row.path,
      target_post_type: row.target_post_type,
      title: row.title,
      review_gate: row.review_gate,
      owner: gateOwner(row.review_gate),
      blocker: blocker(row.review_gate),
      recommended_action: action(row),
      content_source: row.content_source,
      seo_status: seo.seo_status || "",
      primary_keyword: seo.primary_keyword || "",
      manifest_group: route.manifest_group || "",
      it_reference: route.source_it_reference || "",
      hreflang_status: hreflang.status || hreflang.mapping_status || "",
      notes: row.review_gate === "commercial_review" ? "Non includere automaticamente nel primo go-live." : "",
    };
  });

  const sortOrder = { P0: 0, P1: 1, P2: 2, "P2-hold": 3 };
  rows.sort((a, b) => {
    const byPriority = sortOrder[a.priority] - sortOrder[b.priority];
    if (byPriority !== 0) return byPriority;
    return a.path.localeCompare(b.path);
  });

  const headers = [
    "priority",
    "path",
    "target_post_type",
    "title",
    "review_gate",
    "owner",
    "blocker",
    "recommended_action",
    "content_source",
    "seo_status",
    "primary_keyword",
    "manifest_group",
    "it_reference",
    "hreflang_status",
    "notes",
  ];
  writeCsv(OUT_CSV, rows, headers);

  const byPriority = summarize(rows, "priority");
  const byGate = summarize(rows, "review_gate");
  const byPostType = summarize(rows, "target_post_type");
  const firstP0 = rows.filter((row) => row.priority === "P0").slice(0, 20);

  const md = `# Solarisfilms.es - Editorial board\n\n` +
    `Data: 2026-08-05  \n` +
    `Fonte: dry-run import, SEO metadata, hreflang map e route manifest in \`docs/solaris-es\`.\n\n` +
    `## Scopo\n\n` +
    `Questa board serve a decidere cosa si puo scrivere, revisionare e importare in WordPress per \`solarisfilms.es\` senza pubblicare nulla per errore.\n\n` +
    `Tutte le pagine restano in bozza finche il relativo gate non e chiuso. Nessuna voce di questa board autorizza DNS, indicizzazione o pubblicazione.\n\n` +
    `## Conteggi\n\n` +
    `- Totale righe: ${rows.length}\n` +
    `- Per priorita: ${Object.entries(byPriority).map(([key, value]) => `${key} ${value}`).join(", ")}\n` +
    `- Per post type: ${Object.entries(byPostType).map(([key, value]) => `${key} ${value}`).join(", ")}\n` +
    `- Per gate: ${Object.entries(byGate).map(([key, value]) => `${key} ${value}`).join(", ")}\n\n` +
    `## P0 - blocchi da chiudere prima di qualsiasi go-live\n\n` +
    `| Path | Gate | Owner | Azione |\n` +
    `| --- | --- | --- | --- |\n` +
    firstP0.map((row) => `| \`${row.path}\` | \`${row.review_gate}\` | ${row.owner} | ${row.recommended_action} |`).join("\n") +
    `\n\n` +
    `## File operativo\n\n` +
    `La matrice completa e in:\n\n` +
    `- \`docs/solaris-es/solarisfilms-es-editorial-board-2026-08-05.csv\`\n\n` +
    `Colonne principali:\n\n` +
    `- \`priority\`: P0, P1, P2, P2-hold;\n` +
    `- \`review_gate\`: motivo del blocco;\n` +
    `- \`owner\`: chi deve validare;\n` +
    `- \`blocker\`: cosa manca;\n` +
    `- \`recommended_action\`: prossimo passo concreto;\n` +
    `- \`it_reference\`: pagina italiana di riferimento, se presente;\n` +
    `- \`hreflang_status\`: stato della mappatura lingua, se gia definito.\n\n` +
    `## Regole\n\n` +
    `- Non pubblicare pagine con placeholder societari o contatti non definitivi.\n` +
    `- Non generare sitemap indicizzabile finche i P0 non sono chiusi.\n` +
    `- Non aggiungere hreflang a pagine non equivalenti.\n` +
    `- Non reintrodurre contenuti esclusi dal progetto italiano.\n` +
    `- I campi Orchestra restano vuoti: Orchestra deve intervenire dopo l'import bozza e la review contenuto.\n`;

  fs.writeFileSync(OUT_MD, md, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUT_CSV)}`);
  console.log(`Wrote ${path.relative(ROOT, OUT_MD)}`);
}

main();
