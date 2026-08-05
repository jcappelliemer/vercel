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
      if (Array.isArray(block.items) && block.items.length) {
        html.push(`<ul>`);
        for (const item of block.items) html.push(`<li>${escapeHtml(item)}</li>`);
        html.push(`</ul>`);
      }
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

function titleCaseFromSlug(slug) {
  return slug
    .replace(/^\/|\/$/g, "")
    .split("/")
    .pop()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function localAreaFromPath(pathValue) {
  const slug = slugFromPath(pathValue).replace(/^peliculas-para-cristales-/, "");
  return titleCaseFromSlug(slug);
}

function focusCopy(pathValue, title) {
  const clean = normalizePath(pathValue);
  const map = [
    {
      test: "safetyshield",
      problem: "proteccion avanzada de personas frente a roturas criticas del vidrio",
      details: "SafetyShield se plantea como un sistema especial: pelicula, vidrio existente, marco y, cuando procede, anclaje trabajan juntos para reducir la proyeccion de fragmentos en escenarios de alto impacto.",
      items: ["evaluacion del riesgo", "tipo de vidrio y marco", "posible uso de FrameGard o GullWing", "documentacion tecnica del sistema"]
    },
    {
      test: "seguridad",
      problem: "mejorar el comportamiento del vidrio en caso de impacto o rotura",
      details: "Las peliculas de seguridad ayudan a retener fragmentos y a reducir riesgos para las personas. La clase declarada debe leerse siempre junto con el vidrio, la instalacion y la documentacion del trabajo.",
      items: ["UNE-EN 12600:2003 cuando aplica", "uso del espacio", "riesgo de impacto", "producto instalado"]
    },
    {
      test: "espectro",
      problem: "reducir calor manteniendo alta transparencia",
      details: "Las soluciones espectro selectivas priorizan el equilibrio entre rechazo infrarrojo, entrada de luz natural y baja alteracion estetica del vidrio.",
      items: ["transparencia", "rechazo infrarrojo", "baja reflexion", "compatibilidad con el vidrio"]
    },
    {
      test: "reflectantes",
      problem: "control solar con efecto exterior mas reflectante",
      details: "Las peliculas reflectantes son utiles cuando se busca reducir calor y deslumbramiento con una imagen exterior mas marcada y, durante el dia, mayor privacidad visual.",
      items: ["control solar", "reduccion del deslumbramiento", "efecto especular", "privacidad diurna"]
    },
    {
      test: "decorativas",
      problem: "privacidad, diseno e identidad visual en superficies acristaladas",
      details: "Las peliculas decorativas permiten modificar el aspecto del vidrio, crear zonas de privacidad y personalizar oficinas, escaparates o espacios comerciales sin sustituir el cristal.",
      items: ["privacidad", "diseno", "rotulacion", "integracion con la arquitectura"]
    },
    {
      test: "antigraffiti",
      problem: "proteger superficies expuestas frente a rayaduras y vandalismo",
      details: "La pelicula actua como capa sacrificable sobre el vidrio. Si se dana, puede sustituirse con una intervencion mas simple que cambiar el cristal.",
      items: ["escaparates", "zonas publicas", "mantenimiento", "proteccion superficial"]
    },
    {
      test: "termoaislantes",
      problem: "mejorar el confort de las superficies acristaladas en proyectos donde el aislamiento es prioritario",
      details: "Esta familia requiere validacion comercial antes de publicarse en el mercado espanol inicial.",
      items: ["tipo de vidrio", "estacion de uso", "resultado esperado", "revision tecnica previa"]
    },
    {
      test: "oscurantes",
      problem: "reducir entrada de luz y controlar privacidad en casos especificos",
      details: "La seleccion debe evitar soluciones demasiado oscuras si afectan al uso del espacio o a la estetica del edificio.",
      items: ["privacidad", "transmision luminosa", "uso del espacio", "impacto estetico"]
    }
  ];

  const found = map.find((entry) => clean.includes(entry.test)) || {
    problem: "controlar calor, deslumbramiento y radiacion sobre cristales existentes",
    details: "Solaris evalua orientacion, tipo de vidrio y uso del espacio antes de proponer una pelicula compatible con el resultado esperado.",
    items: ["tipo de vidrio", "exposicion solar", "aplicacion interior o exterior", "resultado estetico"]
  };

  return [
    {
      type: "hero",
      eyebrow: "Soluciones tecnicas Solaris",
      heading: title,
      text: `Esta solucion esta pensada para ${found.problem}. La eleccion correcta parte del caso real y no solo del nombre del producto.`
    },
    {
      type: "section",
      heading: "Cuando tiene sentido",
      text: found.details
    },
    {
      type: "section",
      heading: "Que se verifica antes de elegir",
      text: "Antes de confirmar la pelicula se revisan los puntos que condicionan rendimiento, durabilidad y resultado visual.",
      items: found.items
    },
    {
      type: "faq",
      items: [
        {
          question: "Como se elige la pelicula correcta?",
          answer: "Se parte del problema real, se identifica el tipo de vidrio y se comparan las soluciones compatibles con el objetivo del proyecto."
        },
        {
          question: "Se puede instalar sin cambiar los cristales?",
          answer: "En muchos casos si. La intervencion se realiza sobre vidrio existente, pero antes hay que comprobar estado, composicion y exposicion."
        },
        {
          question: "La solucion cambia la estetica del edificio?",
          answer: "Depende de la familia elegida. Algunas peliculas son muy discretas, otras tienen un efecto mas reflectante, decorativo o tecnico."
        }
      ]
    }
  ];
}

function productCopy(pathValue, title) {
  const clean = normalizePath(pathValue);
  let benefit = "mejorar el comportamiento del vidrio existente";
  let context = "edificios, oficinas, comercios y viviendas donde se necesita una solucion profesional sin sustituir el acristalamiento.";
  let items = ["compatibilidad del vidrio", "aplicacion", "prestacion esperada", "mantenimiento"];

  if (clean.includes("safetyshield")) {
    benefit = "aumentar la proteccion en escenarios de rotura critica y alto impacto";
    context = "proyectos donde la prioridad es proteger a las personas y reducir la proyeccion de fragmentos.";
    items = ["nivel de prestacion", "tipo de vidrio", "marco existente", "posible sistema de anclaje"];
  } else if (clean.includes("gullwing")) {
    benefit = "completar sistemas de seguridad con anclaje mecanico especifico";
    context = "instalaciones SafetyShield o proyectos donde el anclaje forma parte de la estrategia de mitigacion.";
    items = ["sistema de anclaje", "marco", "compatibilidad", "documentacion del proyecto"];
  } else if (clean.includes("cl-")) {
    benefit = "aportar seguridad transparente al vidrio existente";
    context = "colegios, oficinas, comercios, hoteles y edificios donde se busca seguridad sin alterar la vision del cristal.";
    items = ["clase UNE-EN 12600", "espesor", "aplicacion interior o exterior", "documentacion tecnica"];
  } else if (clean.includes("rs-") && clean.includes("ps-sr")) {
    benefit = "combinar control solar reflectante y seguridad del vidrio";
    context = "vitrinas, oficinas y fachadas con necesidad de reducir calor y mejorar el comportamiento del vidrio.";
    items = ["control solar", "seguridad", "efecto reflectante", "clase certificada cuando aplica"];
  } else if (clean.includes("sb-") || clean.includes("sg-") || clean.includes("sl-")) {
    benefit = "reducir calor y deslumbramiento con una pelicula de control solar profesional";
    context = "espacios de trabajo, edificios con grandes superficies acristaladas y ambientes donde se busca mas confort.";
    items = ["energia solar rechazada", "transmision luminosa", "reflexion", "aplicacion exterior"];
  } else if (clean.includes("ssn-70")) {
    benefit = "reducir infrarrojos manteniendo alta transparencia";
    context = "vitrinas, museos, showrooms, oficinas y edificios donde la estetica original del vidrio debe mantenerse.";
    items = ["rechazo infrarrojo", "transparencia", "baja reflexion", "compatibilidad"];
  } else if (clean.includes("mt-200") || clean.includes("vetrofan")) {
    benefit = "crear privacidad, identidad visual o decoracion sobre cristal";
    context = "oficinas, salas de reuniones, escaparates y espacios donde el vidrio tambien comunica imagen.";
    items = ["privacidad", "diseno", "rotulacion", "mantenimiento"];
  }

  return [
    {
      type: "hero",
      eyebrow: "Producto MADICO",
      heading: title,
      text: `${title} es una solucion profesional para cristales indicada cuando se necesita ${benefit}.`
    },
    {
      type: "section",
      heading: "Panoramica",
      text: "La seleccion del producto se realiza segun tipo de vidrio, exposicion, uso del espacio y resultado esperado. Los datos tecnicos deben validarse siempre con la ficha oficial antes de publicar o presupuestar."
    },
    {
      type: "section",
      heading: "Contexto de uso recomendado",
      text: `Se recomienda en ${context}`,
      items
    },
    {
      type: "faq",
      items: [
        {
          question: `Para que se utiliza ${title}?`,
          answer: `Se utiliza cuando el objetivo es ${benefit}, con instalacion profesional sobre vidrio existente.`
        },
        {
          question: "Como se confirma si es compatible?",
          answer: "Se revisan fotos, medidas, tipo de vidrio, orientacion y objetivo antes de confirmar la solucion."
        },
        {
          question: "Tiene garantia?",
          answer: "La garantia depende del producto, la aplicacion, la instalacion y las condiciones de uso y mantenimiento."
        }
      ]
    }
  ];
}

function infoCopy(pathValue, title) {
  const clean = normalizePath(pathValue);
  const isSafety = clean.includes("seguridad") || clean.includes("normativa") || clean.includes("brc") || clean.includes("sistemas-filtrantes");
  const text = isSafety
    ? "Esta pagina resume criterios utiles para leer la seguridad del vidrio, la documentacion tecnica y las verificaciones necesarias antes de confirmar una solucion. Las referencias normativas deben validarse para el caso concreto y el mercado espanol."
    : "Esta pagina recoge informacion practica para entender mejor producto, mantenimiento, garantia y lenguaje tecnico antes de solicitar una valoracion.";

  return [
    {
      type: "hero",
      eyebrow: "Informacion Solaris",
      heading: title,
      text
    },
    {
      type: "section",
      heading: "Que conviene tener claro",
      text: "La pelicula correcta depende del vidrio existente, del uso del espacio, de la exposicion y del resultado que se quiere conseguir.",
      items: isSafety
        ? ["tipo de vidrio", "uso y riesgo", "clasificacion tecnica", "documentacion del trabajo"]
        : ["producto elegido", "condiciones de uso", "mantenimiento", "resultado esperado"]
    },
    {
      type: "faq",
      items: [
        {
          question: "Esta informacion sustituye una verificacion tecnica?",
          answer: "No. Sirve para orientarse, pero la eleccion final debe confirmarse con datos del vidrio y del proyecto."
        },
        {
          question: "Cuando conviene pedir ayuda a Solaris?",
          answer: "Cuando hay dudas sobre compatibilidad, normativa, garantia, mantenimiento o resultado visual."
        }
      ]
    }
  ];
}

function localCopy(pathValue) {
  const area = localAreaFromPath(pathValue);
  return [
    {
      type: "hero",
      eyebrow: "Servicio local Solaris",
      heading: `Peliculas para cristales en ${area}`,
      text: `Solaris Films puede valorar soluciones para cristales en ${area}: control solar, seguridad, privacidad y diseno para viviendas, oficinas, comercios y edificios con superficies acristaladas.`
    },
    {
      type: "section",
      heading: `Soluciones para edificios y cristales en ${area}`,
      text: "La primera valoracion puede hacerse con fotos, medidas aproximadas y objetivo del proyecto. Cuando el caso lo requiere, se programa una verificacion tecnica.",
      items: ["control solar", "reduccion de deslumbramiento", "seguridad del vidrio", "privacidad", "decoracion y rotulacion"]
    },
    {
      type: "faq",
      items: [
        {
          question: `Trabajais en ${area}?`,
          answer: `Podemos valorar proyectos en ${area} y zonas cercanas, empezando por fotos, medidas y descripcion del caso.`
        },
        {
          question: "Hace falta visita tecnica?",
          answer: "No siempre. Para una primera orientacion bastan fotos y medidas. Si el vidrio o el proyecto lo requiere, se confirma una visita."
        }
      ]
    }
  ];
}

function articleCopy(pathValue, title) {
  const clean = normalizePath(pathValue);
  let angle = "entender como elegir una pelicula para cristales segun el problema real";
  if (clean.includes("interior-o-exterior")) angle = "decidir si conviene una aplicacion interior o exterior";
  else if (clean.includes("privacidad")) angle = "comparar privacidad, vidrio satinado y soluciones adhesivas";
  else if (clean.includes("calor")) angle = "reducir calor en cristaleras sin perder funcionalidad";
  else if (clean.includes("seguridad")) angle = "leer la seguridad del vidrio y la clasificacion UNE-EN 12600";
  else if (clean.includes("espectro")) angle = "comparar peliculas espectro selectivas y reflectantes";
  else if (clean.includes("mantenimiento")) angle = "mantener correctamente una pelicula para cristales";
  else if (clean.includes("anti-uv")) angle = "proteger interiores frente a radiacion UV";
  else if (clean.includes("dura")) angle = "entender durabilidad, mantenimiento e instalacion";
  else if (clean.includes("antigraffiti")) angle = "proteger escaparates y superficies expuestas";
  else if (clean.includes("safetyshield")) angle = "entender SafetyShield como sistema especial de proteccion";

  return [
    {
      type: "hero",
      eyebrow: "Lo sabias?",
      heading: title,
      text: `Una guia practica para ${angle}.`
    },
    {
      type: "section",
      heading: "Punto de partida",
      text: "La respuesta correcta depende del vidrio, del uso del espacio y del resultado esperado. Antes de elegir una pelicula conviene definir el objetivo principal y descartar soluciones incompatibles."
    },
    {
      type: "section",
      heading: "Que mirar antes de decidir",
      text: "Estos son los elementos que normalmente cambian la eleccion del producto.",
      items: ["tipo de vidrio", "orientacion y exposicion", "transparencia deseada", "seguridad o privacidad requerida", "mantenimiento"]
    },
    {
      type: "faq",
      items: [
        {
          question: "Puedo decidir solo con una foto?",
          answer: "Una foto ayuda a orientar, pero para confirmar la solucion pueden servir medidas, tipo de vidrio y objetivo del proyecto."
        },
        {
          question: "Cuando conviene pedir una verificacion?",
          answer: "Cuando hay dudas sobre compatibilidad, seguridad, aplicacion exterior o resultado estetico."
        }
      ]
    }
  ];
}

function indexCopy(pathValue, title, routeManifest) {
  if (pathValue === "/lo-sabias/") {
    return [
      {
        type: "hero",
        eyebrow: "Guias Solaris",
        heading: title,
        text: "Articulos breves para entender como funcionan las peliculas para cristales, que verificaciones conviene hacer y que solucion puede encajar mejor en cada caso."
      },
      {
        type: "cards",
        heading: "Rutas de lectura",
        items: (routeManifest.article_starter_pack || []).slice(0, 10).map((pathItem) => ({
          title: titleCaseFromSlug(pathItem),
          text: "Articulo pendiente de revision antes de la publicacion.",
          href: pathItem
        }))
      }
    ];
  }
  return [];
}

function templateBlocksForItem(row, source, routeManifest) {
  const cleanPath = normalizePath(row.path);
  const title = row.title || source.title || titleCaseFromSlug(cleanPath);

  if (cleanPath === "/lo-sabias/") return indexCopy(cleanPath, title, routeManifest);
  if (row.target_post_type === "focus_tecnico") return focusCopy(cleanPath, title);
  if (row.target_post_type === "producto") return productCopy(cleanPath, title);
  if (row.target_post_type === "pagina_info") return infoCopy(cleanPath, title);
  if (row.target_post_type === "servicio_local") return localCopy(cleanPath);
  if (row.target_post_type === "articulo") return articleCopy(cleanPath, title);
  return [];
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
    const blocks = source.seed_blocks || templateBlocksForItem(row, source, routeManifest);
    const postContent = blocks.length ? blocksToHtml(blocks) : "";
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
      content_source: source.seed_blocks ? row.content_source : "template_generated",
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
