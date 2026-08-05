const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const docsDir = path.join(root, "docs", "solaris-es");
const payloadPath = path.join(docsDir, "solarisfilms-es-wp-import-payload-2026-08-05.json");
const outputPath = path.join(docsDir, "solarisfilms-es-seo-metadata-2026-08-05.csv");

function csvEscape(value) {
  const stringValue = value == null ? "" : String(value);
  if (/[",\r\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

function titleCaseFromSlug(pathValue) {
  const clean = pathValue.replace(/^\/|\/$/g, "").split("/").pop() || "home";
  return clean
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function cityFromLocalPath(pathValue) {
  return titleCaseFromSlug(pathValue)
    .replace(/^Peliculas Para Cristales\s*/i, "")
    .replace(/\bDe\b/g, "de");
}

function clusterFor(item) {
  const value = `${item.path} ${item.post_title}`.toLowerCase();
  if (value.includes("safetyshield") || value.includes("gullwing")) return "safetyshield";
  if (value.includes("seguridad") || value.includes("security") || value.includes("cl-") || value.includes("rs-20-ps") || value.includes("rs-40-ps")) return "seguridad";
  if (value.includes("decor") || value.includes("privacidad") || value.includes("vetrof") || value.includes("mt-200")) return "privacidad";
  if (value.includes("local") || value.includes("tenerife") || value.includes("adeje") || value.includes("madrid") || value.includes("barcelona")) return "local";
  if (value.includes("garant") || value.includes("norm") || value.includes("mantenimiento") || value.includes("glosario")) return "info";
  return "control_solar";
}

function primaryKeyword(item) {
  const cluster = clusterFor(item);
  if (item.target_post_type === "producto") return `${item.post_title} película para cristales`;
  if (item.target_post_type === "servicio_local") return `películas para cristales en ${cityFromLocalPath(item.path)}`;
  if (cluster === "safetyshield") return "películas de seguridad SafetyShield";
  if (cluster === "seguridad") return "láminas de seguridad para cristales";
  if (cluster === "privacidad") return "vinilos y películas de privacidad para cristales";
  if (cluster === "info") return "información técnica sobre películas para cristales";
  return "láminas solares para cristales";
}

function secondaryKeywords(item) {
  const cluster = clusterFor(item);
  const common = ["películas para cristales", "láminas para ventanas"];
  if (cluster === "safetyshield") return ["seguridad para vidrios", "protección anti impacto", "anclaje para láminas de seguridad", ...common];
  if (cluster === "seguridad") return ["vidrios de seguridad", "UNE EN 12600", "películas anti rotura", ...common];
  if (cluster === "privacidad") return ["vinilos para cristales", "privacidad oficinas", "cristales decorativos", ...common];
  if (cluster === "local") return ["instalación profesional", "presupuesto películas cristales", "control solar", "privacidad", "seguridad"];
  if (cluster === "info") return ["normativa cristales", "garantía películas", "mantenimiento láminas", ...common];
  return ["control solar", "reducir calor", "protección UV", "deslumbramiento", ...common];
}

function h1For(item) {
  if (item.path === "/") return "Películas para cristales que mejoran confort, seguridad y privacidad";
  if (item.target_post_type === "servicio_local") return `Películas para cristales en ${cityFromLocalPath(item.path)}`;
  return item.post_title;
}

function seoTitleFor(item) {
  if (item.path === "/") return "Películas para cristales en España | Solaris Films";
  if (item.target_post_type === "producto") return `${item.post_title} | Solaris Films España`;
  if (item.target_post_type === "servicio_local") return `Películas para cristales en ${cityFromLocalPath(item.path)} | Solaris Films`;
  if (item.target_post_type === "articulo") return `${item.post_title} | Lo sabías? Solaris Films`;
  return `${item.post_title} | Solaris Films España`;
}

function metaDescriptionFor(item) {
  const cluster = clusterFor(item);
  if (item.path === "/") {
    return "Películas solares, de seguridad, privacidad y diseño para cristales existentes. Solaris ayuda a elegir la solución correcta según vidrio, uso y resultado esperado.";
  }
  if (item.target_post_type === "producto") {
    return `Ficha de ${item.post_title}: uso recomendado, aplicación, datos técnicos y orientación Solaris para elegir la película adecuada para el vidrio.`;
  }
  if (item.target_post_type === "servicio_local") {
    return `Películas para cristales en ${cityFromLocalPath(item.path)}: control solar, seguridad, privacidad y diseño para viviendas, oficinas, comercios y hoteles.`;
  }
  if (item.target_post_type === "articulo") {
    return `Guía Solaris sobre ${item.post_title.toLowerCase()}: qué comprobar en el vidrio, cuándo conviene instalar una película y cómo pedir una valoración.`;
  }
  if (cluster === "safetyshield") {
    return "Soluciones SafetyShield para cristales: protección especial, sistemas de anclaje y criterios de evaluación para proyectos de seguridad avanzada.";
  }
  if (cluster === "seguridad") {
    return "Películas de seguridad para cristales: mejora del comportamiento del vidrio, retención de fragmentos y evaluación según uso, riesgo y documentación técnica.";
  }
  if (cluster === "privacidad") {
    return "Películas decorativas, vinilos y soluciones de privacidad para cristales de oficinas, mamparas, escaparates y espacios acristalados.";
  }
  if (cluster === "info") {
    return "Información Solaris sobre películas para cristales: normativa, garantías, mantenimiento, documentación técnica y criterios de elección.";
  }
  return "Películas y láminas solares para cristales: reducción de calor, deslumbramiento y radiación UV con verificación previa del vidrio.";
}

function reviewStatus(item) {
  if (["legal_data", "contact_data", "form_crm"].includes(item.review_gate)) return "blocked_company_data";
  if (item.review_gate === "legal_review") return "blocked_legal_review";
  if (item.review_gate === "technical_sheet") return "blocked_technical_sheet";
  if (item.review_gate === "local_review") return "blocked_local_review";
  if (item.review_gate === "commercial_review") return "blocked_commercial_review";
  return "draft_copy_review";
}

function main() {
  const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
  const headers = [
    "path",
    "target_post_type",
    "h1",
    "seo_title",
    "meta_description",
    "canonical",
    "primary_keyword",
    "secondary_keywords",
    "review_gate",
    "seo_status"
  ];

  const rows = payload.items.map((item) => ({
    path: item.path,
    target_post_type: item.target_post_type,
    h1: h1For(item),
    seo_title: seoTitleFor(item),
    meta_description: metaDescriptionFor(item),
    canonical: `${payload.domain}${item.path}`,
    primary_keyword: primaryKeyword(item),
    secondary_keywords: secondaryKeywords(item).join("; "),
    review_gate: item.review_gate,
    seo_status: reviewStatus(item)
  }));

  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
  ].join("\n");

  fs.writeFileSync(outputPath, `${csv}\n`);
  console.log(`Wrote ${rows.length} metadata row(s) to ${path.relative(root, outputPath)}`);
  console.log(JSON.stringify(rows.reduce((acc, row) => {
    acc[row.seo_status] = (acc[row.seo_status] || 0) + 1;
    return acc;
  }, {}), null, 2));
}

main();
