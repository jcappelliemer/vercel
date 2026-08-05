const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs", "solaris-es");

const dryRunPath = path.join(docsDir, "solarisfilms-es-wp-import-dryrun-2026-08-05.csv");
const routeManifestPath = path.join(docsDir, "solarisfilms-es-route-manifest-2026-08-04.json");
const contentSeedPath = path.join(docsDir, "solarisfilms-es-content-seed-2026-08-04.json");
const outputPath = path.join(docsDir, "solarisfilms-es-wp-import-payload-2026-08-05.json");

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
  const lines = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function normalizePath(value) {
  if (!value || value === "/") return "/";
  const clean = value.trim();
  return clean.startsWith("/") ? clean : `/${clean}`;
}

function slugFromPath(value) {
  const clean = normalizePath(value);
  if (clean === "/") return "home";
  return clean.replace(/^\/|\/$/g, "").split("/").pop();
}

function simpleTextToHtml(text) {
  if (!text) return "";
  return `<p>${escapeHtml(text)}</p>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blocksToHtml(blocks = []) {
  const html = [];
  for (const block of blocks) {
    if (block.type === "hero") {
      html.push(`<section class="sf-es-hero">`);
      if (block.eyebrow) html.push(`<p class="sf-es-eyebrow">${escapeHtml(block.eyebrow)}</p>`);
      if (block.heading) html.push(`<h1>${escapeHtml(block.heading)}</h1>`);
      if (block.text) html.push(simpleTextToHtml(block.text));
      if (block.secondary_text) html.push(simpleTextToHtml(block.secondary_text));
      html.push(`</section>`);
      continue;
    }

    if (block.type === "cards" || block.type === "service_grid") {
      html.push(`<section class="sf-es-card-grid">`);
      if (block.heading) html.push(`<h2>${escapeHtml(block.heading)}</h2>`);
      html.push(`<div class="sf-es-cards">`);
      for (const item of block.items || []) {
        html.push(`<article class="sf-es-card">`);
        if (item.title) html.push(`<h3>${escapeHtml(item.title)}</h3>`);
        if (item.text) html.push(simpleTextToHtml(item.text));
        if (item.href) html.push(`<p><a href="${escapeHtml(item.href)}">Ver mas</a></p>`);
        html.push(`</article>`);
      }
      html.push(`</div></section>`);
      continue;
    }

    if (block.type === "section" || block.type === "intro") {
      html.push(`<section class="sf-es-section">`);
      if (block.heading) html.push(`<h2>${escapeHtml(block.heading)}</h2>`);
      if (block.text) html.push(simpleTextToHtml(block.text));
      html.push(`</section>`);
      continue;
    }

    if (block.type === "faq") {
      html.push(`<section class="sf-es-faq"><h2>Preguntas frecuentes</h2>`);
      for (const item of block.items || []) {
        html.push(`<article class="sf-es-faq-item">`);
        html.push(`<h3>${escapeHtml(item.question || "")}</h3>`);
        html.push(simpleTextToHtml(item.answer || ""));
        html.push(`</article>`);
      }
      html.push(`</section>`);
      continue;
    }

    if (block.type === "product_families") {
      html.push(`<section class="sf-es-section"><h2>Familias de producto</h2><ul>`);
      for (const item of block.items || []) html.push(`<li>${escapeHtml(item)}</li>`);
      html.push(`</ul></section>`);
      continue;
    }

    if (block.type === "form_spec") {
      html.push(`<section class="sf-es-section"><h2>Datos utiles para preparar el presupuesto</h2><ul>`);
      for (const item of block.fields || []) html.push(`<li>${escapeHtml(item)}</li>`);
      html.push(`</ul></section>`);
      continue;
    }

    if (block.type === "contact_data") {
      html.push(`<section class="sf-es-contact"><h2>Datos de contacto</h2><ul>`);
      for (const [label, value] of Object.entries(block)) {
        if (label !== "type" && value) html.push(`<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`);
      }
      html.push(`</ul></section>`);
    }
  }
  return html.join("\n");
}

function buildLookup(routeManifest, contentSeed) {
  const lookup = new Map();

  for (const group of ["core_pages", "technical_focus_pages", "products", "info_pages"]) {
    for (const item of routeManifest[group] || []) {
      lookup.set(normalizePath(item.path), item);
    }
  }

  for (const pathValue of routeManifest.local_pages_initial || []) {
    const clean = normalizePath(pathValue);
    lookup.set(clean, {
      path: clean,
      title: clean.replace(/^\/servicio-local\/peliculas-para-cristales-?|\/$/g, "").replace(/-/g, " "),
      source_it_reference: ""
    });
  }

  for (const pathValue of routeManifest.article_starter_pack || []) {
    const clean = normalizePath(pathValue);
    lookup.set(clean, {
      path: clean,
      title: clean.replace(/^\/lo-sabias\/|\/$/g, "").replace(/-/g, " "),
      source_it_reference: ""
    });
  }

  for (const page of contentSeed.pages || []) {
    const clean = normalizePath(page.path);
    lookup.set(clean, {
      ...(lookup.get(clean) || {}),
      ...page,
      seed_blocks: page.blocks || []
    });
  }

  return lookup;
}

function main() {
  const dryRun = parseCsv(dryRunPath);
  const routeManifest = JSON.parse(fs.readFileSync(routeManifestPath, "utf8"));
  const contentSeed = JSON.parse(fs.readFileSync(contentSeedPath, "utf8"));
  const lookup = buildLookup(routeManifest, contentSeed);

  const items = dryRun.map((row) => {
    const cleanPath = normalizePath(row.path);
    const source = lookup.get(cleanPath) || {};
    const postContent = source.seed_blocks ? blocksToHtml(source.seed_blocks) : "";
    const draftImportReady = Boolean(postContent);

    return {
      path: cleanPath,
      frontend_url: `${routeManifest.domain.replace(/\/$/, "")}${cleanPath}`,
      target_post_type: row.target_post_type,
      post_status: row.status || "draft",
      post_title: row.title || source.title || slugFromPath(cleanPath),
      post_name: cleanPath === "/" ? "home" : slugFromPath(cleanPath),
      post_content_html: postContent,
      source_it_reference: source.source_it_reference || "",
      content_source: row.content_source,
      review_gate: row.review_gate,
      draft_import_ready: draftImportReady,
      publish_blocked_until_review: true,
      orchestra_fields: {
        seo_aeo_meta_title: "",
        seo_aeo_meta_description: "",
        seo_aeo_keywords: "",
        aeo_faq: [],
        seo_aeo_custom_schema_html: ""
      }
    };
  });

  const summary = {
    total_items: items.length,
    by_post_type: {},
    by_review_gate: {},
    draft_import_ready: items.filter((item) => item.draft_import_ready).length,
    publish_blocked_until_review: items.filter((item) => item.publish_blocked_until_review).length
  };

  for (const item of items) {
    summary.by_post_type[item.target_post_type] = (summary.by_post_type[item.target_post_type] || 0) + 1;
    summary.by_review_gate[item.review_gate] = (summary.by_review_gate[item.review_gate] || 0) + 1;
  }

  const payload = {
    domain: routeManifest.domain,
    language: "es-ES",
    status: "dry_run_payload_no_write",
    generated_at: new Date().toISOString(),
    sources: {
      dry_run: path.relative(root, dryRunPath).replace(/\\/g, "/"),
      route_manifest: path.relative(root, routeManifestPath).replace(/\\/g, "/"),
      content_seed: path.relative(root, contentSeedPath).replace(/\\/g, "/")
    },
    summary,
    warnings: [
      "Do not import as publish without legal/company data.",
      "Do not expose pages with placeholders.",
      "Legal/normative pages require Spanish review before indexing.",
      "Orchestra fields intentionally remain empty for later optimization."
    ],
    items
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${items.length} item(s) to ${path.relative(root, outputPath)}`);
  console.log(JSON.stringify(summary, null, 2));
}

main();
