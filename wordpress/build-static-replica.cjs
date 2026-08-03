const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PLUGIN_SLUG = "solaris-static-replica";
const PLUGIN_DIR = path.join(ROOT, "wordpress", PLUGIN_SLUG);
const STATIC_DIR = path.join(PLUGIN_DIR, "static");
const SITE_SOURCE = path.join(ROOT, "wp-site-1to1");
const PUBLIC_SOURCE = path.join(ROOT, "frontend", "public");
const NEXT_STATIC_SOURCE = path.join(ROOT, "frontend", ".next", "static");
const NEXT_CONFIG = path.join(ROOT, "frontend", "next.config.js");

const TEXT_EXTENSIONS = new Set([
  ".html",
  ".css",
  ".js",
  ".json",
  ".xml",
  ".txt",
  ".svg",
]);

const EXCLUDED_STATIC_PATTERNS = [
  /lcd/i,
  /tecnosolar/i,
  /fotocromatic/i,
  /zoho-callback/i,
  /false-parent/i,
  /llms-txt/i,
  /stratum/i,
  /startum/i,
];

function hasExcludedStaticToken(value) {
  return EXCLUDED_STATIC_PATTERNS.some((pattern) => pattern.test(String(value || "")));
}

function nextCssLinks() {
  const cssDir = path.join(NEXT_STATIC_SOURCE, "css");
  if (!fs.existsSync(cssDir)) return "";
  return fs.readdirSync(cssDir)
    .filter((name) => name.toLowerCase().endsWith(".css"))
    .sort()
    .map((name) => `<link rel="stylesheet" href="/_next/static/css/${name}" />`)
    .join("");
}

const NEXT_CSS_LINKS = nextCssLinks();

function sanitizeSolarisText(value) {
  let output = String(value)
    .replace(/Design Pellicole per Vetri:\s*LCD,\s*/gi, "Design Pellicole per Vetri: ")
    .replace(/Dalle pellicole\s+LCD\s+Switch\s+per\s+privacy\s+on-demand\s+e\s+proiezione/gi, "Dalle vetrofanie alle pellicole satinate per privacy e design")
    .replace(/\bLCD\s*Switch\b/gi, "pellicole privacy")
    .replace(/\bLCD\b/gi, "privacy");

  if (/<html[\s>]/i.test(output)) {
    output = output.replace(/<script\b[^>]*\bsrc=["']\/_next\/static\/[^"']+["'][^>]*>\s*<\/script>/gi, "");
    output = output.replace(/<script\b[^>]*\bsrc=["']\/_next\/static\/[^"']+["'][^>]*\/>/gi, "");
    if (NEXT_CSS_LINKS && !output.includes("/_next/static/css/")) {
      output = output.replace("</head>", `${NEXT_CSS_LINKS}</head>`);
    }
  }

  return output;
}

function copyDir(source, destination, options = {}) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing source: ${source}`);
  }
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const src = path.join(source, entry.name);
    const dest = path.join(destination, entry.name);
    if (hasExcludedStaticToken(src)) continue;
    if (options.exclude?.(src, entry)) continue;
    if (entry.isDirectory()) {
      copyDir(src, dest, options);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (TEXT_EXTENSIONS.has(ext)) {
      const text = fs.readFileSync(src, "utf8");
      fs.writeFileSync(dest, sanitizeSolarisText(text), "utf8");
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

function normalizePathname(value) {
  if (!value) return "/";
  let pathname = String(value).trim();
  try {
    pathname = new URL(pathname, "https://www.solarisfilms.it").pathname;
  } catch {
    // Keep raw path.
  }
  pathname = pathname.replace(/\/{2,}/g, "/");
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
  return pathname;
}

async function loadRoutingManifest() {
  const nextConfig = require(NEXT_CONFIG);
  const redirects = typeof nextConfig.redirects === "function" ? await nextConfig.redirects() : [];
  const rewrites = typeof nextConfig.rewrites === "function" ? await nextConfig.rewrites() : [];
  const gone = rewrites
    .filter((rule) => rule.destination === "/api/gone")
    .map((rule) => normalizePathname(rule.source))
    .filter((source) => !hasExcludedStaticToken(source));
  return {
    redirects: redirects
      .map((rule) => ({
        source: normalizePathname(rule.source),
        destination: rule.destination,
        statusCode: Number(rule.statusCode || (rule.permanent ? 301 : 302)),
      }))
      .filter((rule) => !hasExcludedStaticToken(rule.source) && !hasExcludedStaticToken(rule.destination)),
    gone,
  };
}

function loadSiteReport() {
  const reportPath = path.join(SITE_SOURCE, "report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const savedPaths = [...new Set((report.savedPaths || []).map(normalizePathname))]
    .filter((savedPath) => !hasExcludedStaticToken(savedPath))
    .sort();
  return {
    origin: report.origin,
    generatedAt: report.generatedAt,
    totalSaved: savedPaths.length,
    totalFailures: Number(report.totalFailures || 0),
    savedPaths,
  };
}

function writePluginPhp() {
  const php = `<?php
/**
 * Plugin Name: Solaris Static Replica
 * Description: Serve la replica statica 1:1 del nuovo sito Solaris dentro WordPress, con redirect e 410 server-side.
 * Version: 0.1.0
 * Author: Solaris Films
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SOLARIS_STATIC_REPLICA_DIR', plugin_dir_path(__FILE__));
define('SOLARIS_STATIC_REPLICA_URL', plugin_dir_url(__FILE__));

function solaris_static_replica_normalize_path($path) {
    $path = parse_url((string) $path, PHP_URL_PATH);
    $path = '/' . ltrim((string) $path, '/');
    $path = preg_replace('#/+#', '/', $path);
    if ($path !== '/' && substr($path, -1) === '/') {
        $path = rtrim($path, '/');
    }
    return $path ?: '/';
}

function solaris_static_replica_manifest() {
    static $manifest = null;
    if ($manifest !== null) {
        return $manifest;
    }
    $file = SOLARIS_STATIC_REPLICA_DIR . 'static/manifest.json';
    $manifest = file_exists($file) ? json_decode(file_get_contents($file), true) : array();
    return is_array($manifest) ? $manifest : array();
}

function solaris_static_replica_file_path($request_path) {
    $path = solaris_static_replica_normalize_path($request_path);
    if ($path === '/') {
        return SOLARIS_STATIC_REPLICA_DIR . 'static/site/index.html';
    }
    return SOLARIS_STATIC_REPLICA_DIR . 'static/site' . $path . '/index.html';
}

function solaris_static_replica_mime($file) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $map = array(
        'html' => 'text/html; charset=utf-8',
        'css' => 'text/css; charset=utf-8',
        'js' => 'application/javascript; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'xml' => 'application/xml; charset=utf-8',
        'txt' => 'text/plain; charset=utf-8',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'ico' => 'image/x-icon',
        'pdf' => 'application/pdf',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
    );
    return isset($map[$ext]) ? $map[$ext] : 'application/octet-stream';
}

function solaris_static_replica_send_file($file, $cache = 'public, max-age=300') {
    if (!file_exists($file) || !is_file($file)) {
        return false;
    }
    status_header(200);
    header('Content-Type: ' . solaris_static_replica_mime($file));
    header('Cache-Control: ' . $cache);
    header('X-Solaris-Static-Replica: 1');
    readfile($file);
    return true;
}

function solaris_static_replica_safe_join($root, $path) {
    $path = rawurldecode((string) $path);
    $path = preg_replace('#\\\\\\\\#', '/', $path);
    $parts = array_filter(explode('/', $path), static function ($part) {
        return $part !== '' && $part !== '.';
    });
    $safe = array();
    foreach ($parts as $part) {
        if ($part === '..') {
            return null;
        }
        $safe[] = $part;
    }
    return rtrim($root, '/\\\\') . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, $safe);
}

function solaris_static_replica_try_static_asset($path) {
    $asset_roots = array(
        '/_next/static/' => SOLARIS_STATIC_REPLICA_DIR . 'static/_next/static/',
        '/assets/' => SOLARIS_STATIC_REPLICA_DIR . 'static/public/assets/',
        '/wp-data/' => SOLARIS_STATIC_REPLICA_DIR . 'static/public/wp-data/',
        '/wp-content/uploads/' => SOLARIS_STATIC_REPLICA_DIR . 'static/public/wp-content/uploads/',
        '/draft-assets/' => SOLARIS_STATIC_REPLICA_DIR . 'static/site/draft-assets/',
    );
    foreach ($asset_roots as $prefix => $root) {
        if (strpos($path, rtrim($prefix, '/')) === 0) {
            $relative = substr($path, strlen($prefix));
            $file = solaris_static_replica_safe_join($root, $relative);
            if ($file && solaris_static_replica_send_file($file, 'public, max-age=31536000, immutable')) {
                return true;
            }
        }
    }
    return false;
}

function solaris_static_replica_pattern_match($pattern, $path, &$matches = array()) {
    $pattern = solaris_static_replica_normalize_path($pattern);
    $path = solaris_static_replica_normalize_path($path);
    if (strpos($pattern, ':') === false) {
        return $pattern === $path;
    }
    $regex = preg_quote($pattern, '#');
    $regex = preg_replace('#\\\\:([A-Za-z0-9_]+)\\\\\\*#', '(?P<$1>.*)', $regex);
    $regex = preg_replace('#\\\\:([A-Za-z0-9_]+)#', '(?P<$1>[^/]+)', $regex);
    return (bool) preg_match('#^' . $regex . '$#', $path, $matches);
}

function solaris_static_replica_apply_destination($destination, $matches) {
    foreach ($matches as $key => $value) {
        if (!is_string($key)) {
            continue;
        }
        $destination = str_replace(':' . $key . '*', trim($value, '/'), $destination);
        $destination = str_replace(':' . $key, trim($value, '/'), $destination);
    }
    return $destination;
}

function solaris_static_replica_maybe_redirect_or_gone($path) {
    $manifest = solaris_static_replica_manifest();
    $legacy_redirect_terms = array(
        'tecno' . 'solar',
    );
    foreach ($legacy_redirect_terms as $term) {
        if (stripos($path, $term) !== false) {
            wp_redirect(home_url('/prodotti/madico-sg-20-e-ps-sr/'), 301);
            return true;
        }
    }
    if (stripos($path, 'ssn' . '-50-te-sr') !== false) {
        wp_redirect(home_url('/prodotti/ssn-70-te-sr/'), 301);
        return true;
    }
    $legacy_gone_terms = array(
        'l' . 'cd',
        'foto' . 'cromatic',
        'zoho' . '-callback',
        'false' . '-parent',
        'llms' . '-txt',
        'strat' . 'um',
        'start' . 'um',
    );
    foreach ($legacy_gone_terms as $term) {
        if (stripos($path, $term) === false) {
            continue;
        }
        status_header(410);
        header('Content-Type: text/html; charset=utf-8');
        header('X-Robots-Tag: noindex');
        echo '<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Pagina rimossa</title><meta name="robots" content="noindex"></head><body><h1>Pagina rimossa</h1></body></html>';
        return true;
    }
    foreach (($manifest['gone'] ?? array()) as $gone_path) {
        $matches = array();
        if (solaris_static_replica_pattern_match($gone_path, $path, $matches)) {
            status_header(410);
            header('Content-Type: text/html; charset=utf-8');
            header('X-Robots-Tag: noindex');
            echo '<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Pagina rimossa</title><meta name="robots" content="noindex"></head><body><h1>Pagina rimossa</h1></body></html>';
            return true;
        }
    }
    foreach (($manifest['redirects'] ?? array()) as $redirect) {
        $matches = array();
        if (!solaris_static_replica_pattern_match($redirect['source'] ?? '', $path, $matches)) {
            continue;
        }
        $destination = solaris_static_replica_apply_destination($redirect['destination'] ?? '/', $matches);
        wp_redirect($destination, (int) ($redirect['statusCode'] ?? 301));
        return true;
    }
    return false;
}

function solaris_static_replica_send_sitemap() {
    $manifest = solaris_static_replica_manifest();
    $host = home_url();
    $urls = array();
    foreach (($manifest['savedPaths'] ?? array()) as $path) {
        if ($path === '/blog') {
            continue;
        }
        $urls[] = '<url><loc>' . esc_url($host . ($path === '/' ? '/' : trailingslashit($path))) . '</loc></url>';
    }
    status_header(200);
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\\n" . implode("\\n", $urls) . "\\n</urlset>";
}

function solaris_static_replica_send_robots() {
    status_header(200);
    header('Content-Type: text/plain; charset=utf-8');
    if (get_option('blog_public') === '0') {
        echo "User-agent: *\\nDisallow: /\\n";
        return;
    }
    echo "User-agent: *\\nAllow: /\\nSitemap: " . esc_url(home_url('/sitemap.xml')) . "\\n";
}

add_action('template_redirect', function () {
    $path = solaris_static_replica_normalize_path($_SERVER['REQUEST_URI'] ?? '/');

    if ($path === '/robots.txt') {
        solaris_static_replica_send_robots();
        exit;
    }
    if ($path === '/sitemap.xml') {
        solaris_static_replica_send_sitemap();
        exit;
    }
    if (solaris_static_replica_try_static_asset($path)) {
        exit;
    }
    if (solaris_static_replica_maybe_redirect_or_gone($path)) {
        exit;
    }

    $file = solaris_static_replica_file_path($path);
    if (solaris_static_replica_send_file($file, 'public, max-age=300')) {
        exit;
    }
}, 0);
`;
  fs.writeFileSync(path.join(PLUGIN_DIR, `${PLUGIN_SLUG}.php`), php, "utf8");
}

async function main() {
  const site = loadSiteReport();
  const routing = await loadRoutingManifest();

  fs.rmSync(PLUGIN_DIR, { recursive: true, force: true });
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  fs.mkdirSync(path.join(STATIC_DIR, "site"), { recursive: true });
  fs.mkdirSync(path.join(STATIC_DIR, "public"), { recursive: true });
  fs.mkdirSync(path.join(STATIC_DIR, "_next", "static"), { recursive: true });

  copyDir(SITE_SOURCE, path.join(STATIC_DIR, "site"));
  copyDir(PUBLIC_SOURCE, path.join(STATIC_DIR, "public"), {
    exclude: (src, entry) => entry.isFile() && path.basename(src).toLowerCase() === "index.html",
  });
  const nextCssDir = path.join(NEXT_STATIC_SOURCE, "css");
  if (fs.existsSync(nextCssDir)) {
    copyDir(nextCssDir, path.join(STATIC_DIR, "_next", "static", "css"));
  }

  const manifest = {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    site,
    savedPaths: site.savedPaths,
    redirects: routing.redirects,
    gone: routing.gone,
  };
  fs.writeFileSync(path.join(STATIC_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  writePluginPhp();
  fs.writeFileSync(
    path.join(PLUGIN_DIR, "README.md"),
    [
      "# Solaris Static Replica",
      "",
      "Plugin WordPress per servire la replica statica 1:1 del nuovo sito Solaris.",
      "",
      "- Serve le pagine salvate in `static/site`.",
      "- Serve asset da `static/public` e CSS Next da `static/_next/static/css`.",
      "- Applica redirect 301 e risposte 410 server-side dal manifest.",
      "- `robots.txt` segue l'opzione WordPress `blog_public`.",
      "",
      "Non sostituisce ancora l'editing nativo dei contenuti: e una replica di conversione per cutover sicuro.",
    ].join("\\n"),
    "utf8"
  );

  console.log(JSON.stringify({
    pluginDir: PLUGIN_DIR,
    pages: site.totalSaved,
    failures: site.totalFailures,
    redirects: routing.redirects.length,
    gone: routing.gone.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
