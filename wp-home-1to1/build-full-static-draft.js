const fs = require("fs");
const path = require("path");
const { createRequire } = require("module");

const ORIGIN = process.env.SOLARIS_DRAFT_ORIGIN || "https://solarisfilms.vercel.app";
const ORIGIN_URL = new URL(ORIGIN);
const INTERNAL_HOSTNAMES = new Set(["solarisfilms.vercel.app", "www.solarisfilms.it", ORIGIN_URL.hostname]);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(PROJECT_ROOT, "wp-site-1to1");
const REPORT_PATH = path.join(OUT_DIR, "report.json");
const DRAFT_ASSET_DIR = path.join(OUT_DIR, "draft-assets");

const ALWAYS_INCLUDE = [
  "/",
  "/servizi/",
  "/prodotti/",
  "/focus-tecnico/",
  "/info/",
  "/lo-sapevi-che/",
  "/company-profile/",
  "/guida-tecnica/",
  "/servizio-locale/",
  "/preventivo/",
  "/contatti/",
  "/pellicole-antisolari/",
  "/pellicole-antisolari-sputtered/",
  "/pellicole-antisolari-sunscape/",
  "/pellicole-riflettenti/",
  "/pellicole-spettro-selettive/",
  "/pellicole-di-sicurezza/",
  "/pellicole-decorative/",
  "/focus-tecnico/safetyshield/",
];

const NON_PAGE_PREFIXES = [
  "/_next/",
  "/assets/",
  "/wp-data/",
  "/api/",
  "/static/",
];

const NON_PAGE_EXTENSIONS = new Set([
  ".css",
  ".js",
  ".mjs",
  ".map",
  ".json",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".ico",
  ".pdf",
  ".xml",
  ".txt",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".mp4",
  ".webm",
]);

const LOCAL_ALIASES = {
  "/blog": "/approfondimenti",
};

function loadPuppeteer() {
  try {
    return require("puppeteer");
  } catch {
    const frontendRequire = createRequire(path.join(PROJECT_ROOT, "frontend", "package.json"));
    return frontendRequire("puppeteer");
  }
}

function normalizePathname(input) {
  if (!input) return null;
  let value = String(input).trim();
  if (!value || value === "#") return null;
  if (/^(mailto:|tel:|sms:|whatsapp:|javascript:)/i.test(value)) return null;

  try {
    const parsed = new URL(value, ORIGIN);
    if (!INTERNAL_HOSTNAMES.has(parsed.hostname)) return null;
    value = parsed.pathname;
  } catch {
    return null;
  }

  value = value.replace(/\/{2,}/g, "/");
  if (!value.startsWith("/")) value = `/${value}`;
  const ext = path.posix.extname(value).toLowerCase();
  if (NON_PAGE_PREFIXES.some((prefix) => value.startsWith(prefix))) return null;
  if (NON_PAGE_EXTENSIONS.has(ext)) return null;
  return value === "/" ? "/" : value.replace(/\/$/, "");
}

function pagePathToFile(pagePath) {
  const normalized = pagePath === "/" ? "/" : pagePath.replace(/\/$/, "");
  if (normalized === "/") return path.join(OUT_DIR, "index.html");
  const safe = normalized
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment).replace(/[<>:"\\|?*]/g, "-"));
  return path.join(OUT_DIR, ...safe, "index.html");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Solaris-Static-Draft/1.0",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    ...options,
  });
  const body = await response.text();
  return {
    url,
    finalUrl: response.url,
    status: response.status,
    ok: response.ok,
    contentType: response.headers.get("content-type") || "",
    body,
  };
}

async function fetchJson(pathname) {
  const response = await fetchText(`${ORIGIN}${pathname}`, {
    headers: {
      "user-agent": "Solaris-Static-Draft/1.0",
      "accept": "application/json,text/plain,*/*",
    },
  });
  if (!response.ok) throw new Error(`${pathname} ${response.status}`);
  return JSON.parse(response.body);
}

function collectLinksFromHtml(html) {
  const links = new Set();
  const attrPattern = /\b(?:href|src)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrPattern)) {
    const pathname = normalizePathname(match[1]);
    if (pathname) links.add(pathname);
  }
  return [...links];
}

function rewriteHtmlForLocalDraft(html) {
  let output = html;

  output = output
    .replace(/Design Pellicole per Vetri:\s*LCD,\s*/gi, "Design Pellicole per Vetri: ")
    .replace(/Dalle pellicole\s+LCD\s+Switch\s+per\s+privacy\s+on-demand\s+e\s+proiezione/gi, "Dalle vetrofanie alle pellicole satinate per privacy e design")
    .replace(/\bLCD\s*Switch\b/gi, "pellicole privacy")
    .replace(/\bLCD\b/gi, "privacy");

  // Keep internal navigation local while preserving external links.
  output = output.replace(
    /\b(href|src|poster)=["']https:\/\/(?:solarisfilms\.vercel\.app|www\.solarisfilms\.it)([^"']*)["']/gi,
    (_match, attr, rest) => `${attr}="${rest || "/"}"`
  );

  output = output.replace(
    /\bsrcset=["']([^"']+)["']/gi,
    (_match, srcset) => {
      const rewritten = srcset
        .split(",")
        .map((part) => part.trim().replace(/^https:\/\/(?:solarisfilms\.vercel\.app|www\.solarisfilms\.it)/i, ""))
        .join(", ");
      return `srcset="${rewritten}"`;
    }
  );

  output = output.replace(/<link\b(?=[^>]*\brel=["']prefetch["'])(?=[^>]*\bas=["']script["'])[^>]*>/gi, "");

  if (/<body\b[^>]*class=["']/i.test(output)) {
    output = output.replace(/<body\b([^>]*class=["'])([^"']*)(["'][^>]*)>/i, (_match, before, classes, after) => {
      const classList = classes.includes("faithful-static-wp") ? classes : `${classes} faithful-static-wp`;
      return `<body${before}${classList}${after}>`;
    });
  } else {
    output = output.replace(/<body\b([^>]*)>/i, '<body$1 class="faithful-static-wp">');
  }

  output = output.replace(
    "</head>",
    '<meta name="x-solaris-static-draft" content="1:1 staging snapshot" /><link rel="stylesheet" href="/draft-assets/faithful-overrides.css?v=menu-6" /></head>'
  );

  output = output.replace(
    "</body>",
    '<script src="/draft-assets/faithful.js?v=menu-6"></script></body>'
  );

  return output;
}

async function buildSeedUrls() {
  const urls = new Set(ALWAYS_INCLUDE.map(normalizePathname).filter(Boolean));

  const sitemap = await fetchText(`${ORIGIN}/sitemap.xml`, {
    headers: { "accept": "application/xml,text/xml,*/*" },
  });
  for (const match of sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const pathname = normalizePathname(match[1]);
    if (pathname) urls.add(pathname);
  }

  const index = await fetchJson("/wp-data/live-pages-index.json");
  for (const page of index.pages || []) {
    const pathname = normalizePathname(page.path || page.route?.path || page.url);
    if (pathname) urls.add(pathname);
  }

  const products = await fetchJson("/wp-data/prodotti.json");
  for (const product of products || []) {
    const slug = product.slug || product?.acf?.slug;
    if (slug) urls.add(`/prodotti/${slug}`);
    const linkPath = normalizePathname(product.link);
    if (linkPath) urls.add(linkPath);
  }

  return urls;
}

async function mirrorPages() {
  const resolvedOut = path.resolve(OUT_DIR);
  if (!resolvedOut.startsWith(PROJECT_ROOT)) {
    throw new Error(`Output path outside project: ${resolvedOut}`);
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(DRAFT_ASSET_DIR, { recursive: true });
  fs.copyFileSync(path.join(__dirname, "faithful-overrides.css"), path.join(DRAFT_ASSET_DIR, "faithful-overrides.css"));
  fs.copyFileSync(path.join(__dirname, "faithful.js"), path.join(DRAFT_ASSET_DIR, "faithful.js"));

  const queue = [...(await buildSeedUrls())];
  const queued = new Set(queue);
  const fetched = new Set();
  const savedPagePaths = new Set();
  const pages = [];
  const failures = [];
  const maxPages = 360;
  const puppeteer = loadPuppeteer();
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const saveHtmlForPath = (pathname, html) => {
    const outFile = pagePathToFile(pathname);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, "utf8");
    savedPagePaths.add(pathname === "/" ? "/" : pathname.replace(/\/$/, ""));
  };

  try {
    for (let i = 0; i < queue.length && fetched.size < maxPages; i += 1) {
      const pathname = queue[i];
      if (fetched.has(pathname)) continue;
      fetched.add(pathname);

      const url = `${ORIGIN}${pathname}`;
      let page;
      try {
        page = await browser.newPage();
        await page.setCacheEnabled(false);
        await page.setUserAgent("Solaris-Static-Draft/1.0 Mozilla/5.0");
        await page.setExtraHTTPHeaders({
          "cache-control": "no-cache",
          "pragma": "no-cache",
        });
        await page.setViewport({ width: 1440, height: 1400, deviceScaleFactor: 1 });
        const response = await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
        await sleep(900);
        const body = await page.content();
        const finalUrl = page.url();
        const status = response ? response.status() : 0;
        const contentType = response ? (response.headers()["content-type"] || "") : "";
        const isHtml = contentType.includes("text/html") || body.trim().startsWith("<!DOCTYPE");
        const redirectedPath = normalizePathname(finalUrl);
        const okPage = status >= 200 && status < 300 && isHtml;

        if (okPage) {
          const html = rewriteHtmlForLocalDraft(body);
          saveHtmlForPath(pathname, html);
          if (redirectedPath && redirectedPath !== pathname) {
            saveHtmlForPath(redirectedPath, html);
          }

          for (const link of collectLinksFromHtml(body)) {
            if (!LOCAL_ALIASES[link] && !queued.has(link) && fetched.size + queue.length < maxPages + 80) {
              queued.add(link);
              queue.push(link);
            }
          }
        }

        pages.push({
          path: pathname,
          url,
          finalUrl,
          redirected: redirectedPath && redirectedPath !== pathname,
          status,
          contentType,
          saved: okPage,
          bytes: body.length,
        });
      } catch (error) {
        failures.push({ path: pathname, url, error: error.message });
      } finally {
        if (page) {
          await page.close().catch(() => {});
        }
      }

      if (i % 25 === 0) await sleep(60);
    }
  } finally {
    await browser.close();
  }

  const report = {
    origin: ORIGIN,
    generatedAt: new Date().toISOString(),
    outputDir: OUT_DIR,
    totalDiscovered: queued.size,
    totalFetched: fetched.size,
    totalSaved: savedPagePaths.size,
    totalRedirected: pages.filter((page) => page.redirected).length,
    totalFailures: failures.length,
    failures,
    notSaved: pages.filter((page) => !page.saved),
    pages,
    aliases: [],
    savedPaths: [...savedPagePaths].sort(),
  };

  for (const [aliasPath, targetPath] of Object.entries(LOCAL_ALIASES)) {
    const targetFile = pagePathToFile(targetPath);
    const aliasFile = pagePathToFile(aliasPath);
    if (fs.existsSync(targetFile)) {
      fs.mkdirSync(path.dirname(aliasFile), { recursive: true });
      fs.copyFileSync(targetFile, aliasFile);
      savedPagePaths.add(aliasPath);
      report.aliases.push({ path: aliasPath, target: targetPath, saved: true });
      report.totalSaved = savedPagePaths.size;
      report.savedPaths = [...savedPagePaths].sort();
    } else {
      report.aliases.push({ path: aliasPath, target: targetPath, saved: false });
    }
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  return report;
}

mirrorPages()
  .then((report) => {
    console.log(JSON.stringify({
      outputDir: report.outputDir,
      totalDiscovered: report.totalDiscovered,
      totalFetched: report.totalFetched,
      totalSaved: report.totalSaved,
      totalRedirected: report.totalRedirected,
      totalFailures: report.totalFailures,
      notSaved: report.notSaved.length,
    }, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
