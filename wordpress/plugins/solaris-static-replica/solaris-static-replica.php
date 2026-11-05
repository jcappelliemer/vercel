<?php
/**
 * Plugin Name: Solaris Static Replica
 * Description: Serve la replica statica 1:1 del nuovo sito Solaris dentro WordPress, con redirect e 410 server-side.
 * Version: 0.2.0
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

function solaris_static_replica_current_origin() {
    $host = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? ($_SERVER['HTTP_HOST'] ?? '');
    if (strpos((string) $host, ',') !== false) {
        $host = trim(explode(',', (string) $host)[0]);
    }
    $host = preg_replace('/[^a-z0-9\\.\\-:\\[\\]]/i', '', (string) $host);
    if ($host === '') {
        return rtrim(home_url(), '/');
    }

    $proto = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '';
    if (strpos((string) $proto, ',') !== false) {
        $proto = trim(explode(',', (string) $proto)[0]);
    }
    $proto = strtolower((string) $proto);
    if (!in_array($proto, array('http', 'https'), true)) {
        $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (string) ($_SERVER['SERVER_PORT'] ?? '') === '443' ? 'https' : 'http';
    }

    return $proto . '://' . $host;
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

function solaris_static_replica_prepare_html($html) {
    $robots = get_option('blog_public') === '0' ? 'noindex, nofollow' : 'index, follow';
    $meta = '<meta name="robots" content="' . esc_attr($robots) . '">';
    if (preg_match('/<meta\b[^>]*\bname=["\']robots["\'][^>]*>/i', $html)) {
        return preg_replace('/<meta\b[^>]*\bname=["\']robots["\'][^>]*>/i', $meta, $html, 1);
    }
    return preg_replace('/<\/head>/i', $meta . '</head>', $html, 1);
}

function solaris_static_replica_send_file($file, $cache = 'public, max-age=300') {
    if (!file_exists($file) || !is_file($file)) {
        return false;
    }
    status_header(200);
    $mime = solaris_static_replica_mime($file);
    header('Content-Type: ' . $mime);
    $is_html = strpos($mime, 'text/html') === 0;
    $is_private_staging = get_option('blog_public') === '0';
    if ($is_html && $is_private_staging) {
        $cache = 'no-store, max-age=0';
        header('X-Robots-Tag: noindex, nofollow');
    }
    header('Cache-Control: ' . $cache);
    header('X-Solaris-Static-Replica: 1');
    if ($is_html) {
        echo solaris_static_replica_prepare_html(file_get_contents($file));
        return true;
    }
    readfile($file);
    return true;
}

function solaris_static_replica_safe_join($root, $path) {
    $path = rawurldecode((string) $path);
    $path = preg_replace('#\\\\#', '/', $path);
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
    return rtrim($root, '/\\') . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, $safe);
}

function solaris_static_replica_try_static_asset($path) {
    $asset_roots = array(
        '/_next/static/' => SOLARIS_STATIC_REPLICA_DIR . 'static/_next/static/',
        '/_next/data/' => SOLARIS_STATIC_REPLICA_DIR . 'static/_next/data/',
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
            if ($prefix === '/_next/static/' && strpos($path, '/_next/static/css/') === 0) {
                $css_files = glob(rtrim($root, '/\\') . DIRECTORY_SEPARATOR . 'css' . DIRECTORY_SEPARATOR . '*.css');
                if (!empty($css_files) && solaris_static_replica_send_file($css_files[0], 'public, max-age=31536000, immutable')) {
                    return true;
                }
            }
        }
    }
    return false;
}

function solaris_static_replica_try_public_asset($path) {
    $blocked = array(
        '/llms.txt',
        '/llms-full.txt',
        '/robots.txt',
        '/sitemap.xml',
        '/seo-aeo-sitemap.xml',
    );
    if (in_array($path, $blocked, true)) {
        return false;
    }

    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if ($extension === '') {
        return false;
    }

    $file = solaris_static_replica_safe_join(
        SOLARIS_STATIC_REPLICA_DIR . 'static/public/',
        ltrim($path, '/')
    );
    if (!$file || !file_exists($file) || !is_file($file)) {
        return false;
    }

    return solaris_static_replica_send_file($file, 'public, max-age=86400');
}

function solaris_static_replica_pattern_match($pattern, $path, &$matches = array()) {
    $pattern = solaris_static_replica_normalize_path($pattern);
    $path = solaris_static_replica_normalize_path($path);
    if (strpos($pattern, ':') === false) {
        return $pattern === $path;
    }
    $regex = preg_quote($pattern, '#');
    $regex = preg_replace('#\\:([A-Za-z0-9_]+)\\\*#', '(?P<$1>.*)', $regex);
    $regex = preg_replace('#\\:([A-Za-z0-9_]+)#', '(?P<$1>[^/]+)', $regex);
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
            wp_redirect('/prodotti/madico-sg-20-e-ps-sr/', 301);
            return true;
        }
    }
    if (stripos($path, 'ssn' . '-50-te-sr') !== false) {
        wp_redirect('/prodotti/ssn-70-te-sr/', 301);
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

function solaris_static_replica_hide_from_sitemap($path) {
    $manifest = solaris_static_replica_manifest();
    $path = solaris_static_replica_normalize_path($path);
    if ($path === '/blog') {
        return true;
    }
    $legacy_redirect_terms = array(
        'tecno' . 'solar',
        'ssn' . '-50-te-sr',
    );
    foreach ($legacy_redirect_terms as $term) {
        if (stripos($path, $term) !== false) {
            return true;
        }
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
        if (stripos($path, $term) !== false) {
            return true;
        }
    }
    foreach (($manifest['gone'] ?? array()) as $gone_path) {
        $matches = array();
        if (solaris_static_replica_pattern_match($gone_path, $path, $matches)) {
            return true;
        }
    }
    foreach (($manifest['redirects'] ?? array()) as $redirect) {
        $matches = array();
        if (solaris_static_replica_pattern_match($redirect['source'] ?? '', $path, $matches)) {
            return true;
        }
    }
    return false;
}

function solaris_static_replica_send_sitemap() {
    $manifest = solaris_static_replica_manifest();
    $host = solaris_static_replica_current_origin();
    $urls = array();
    foreach (($manifest['savedPaths'] ?? array()) as $path) {
        if (solaris_static_replica_hide_from_sitemap($path)) {
            continue;
        }
        $urls[] = '<url><loc>' . esc_url($host . ($path === '/' ? '/' : trailingslashit($path))) . '</loc></url>';
    }
    status_header(200);
    header('Content-Type: application/xml; charset=utf-8');
    if (get_option('blog_public') === '0') {
        header('X-Robots-Tag: noindex, nofollow');
    }
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n" . implode("\n", $urls) . "\n</urlset>";
}

function solaris_static_replica_send_robots() {
    status_header(200);
    header('Content-Type: text/plain; charset=utf-8');
    if (get_option('blog_public') === '0') {
        echo "User-agent: *\nDisallow: /\n";
        return;
    }
    echo "User-agent: *\nAllow: /\nSitemap: " . esc_url(solaris_static_replica_current_origin() . '/sitemap.xml') . "\n";
}

function solaris_static_replica_send_fast_contact() {
    $phone = preg_replace('/[^0-9]/', '', (string) ($_GET['to'] ?? '3926578067'));
    if ($phone === '') {
        $phone = '3926578067';
    }
    $raw_text = $_GET['text'] ?? ($_GET['amp;text'] ?? '');
    if (is_array($raw_text)) {
        $raw_text = reset($raw_text);
    }
    $location = 'https://wa.me/' . $phone;
    if ((string) $raw_text !== '') {
        $location .= '?text=' . rawurlencode((string) $raw_text);
    }
    wp_redirect($location, 302);
}

add_action('template_redirect', function () {
    $path = solaris_static_replica_normalize_path($_SERVER['REQUEST_URI'] ?? '/');

    if ($path === '/api/fast-contact') {
        solaris_static_replica_send_fast_contact();
        exit;
    }
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
    if (solaris_static_replica_try_public_asset($path)) {
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
