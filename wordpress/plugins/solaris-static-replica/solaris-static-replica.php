<?php
/**
 * Plugin Name: Solaris Static Replica
 * Description: Serve la replica statica 1:1 del nuovo sito Solaris dentro WordPress, con redirect e 410 server-side.
 * Version: 0.3.2
 * Author: Solaris Films
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SOLARIS_STATIC_REPLICA_DIR', plugin_dir_path(__FILE__));
define('SOLARIS_STATIC_REPLICA_URL', plugin_dir_url(__FILE__));
define('SOLARIS_STATIC_REPLICA_REBUILD_OPTION', 'solaris_static_replica_rebuild_token');

function solaris_static_replica_is_private() {
    return (int) get_option('blog_public', 1) === 0;
}

/**
 * The React replica renders these managed changes after consuming Orchestra's
 * headless-fixes manifest. REWRITE_INTRO is applied only when the committed
 * mirror still exact-matches the snapshot source; other body actions stay
 * fail-closed.
 */
add_filter('seo_aeo_capability_managed_block_action_supported', function ($supported, $action_type, $post_id) {
    if ($supported) {
        return true;
    }
    if ((int) $post_id <= 0) {
        return false;
    }
    return in_array((string) $action_type, array(
        'ADD_AUTHORITY_SIGNALS',
        'ADD_FAQ_SECTION',
        'ADD_INTERNAL_LINKS',
        'OPTIMIZE_FEATURED_SNIPPET',
        'REWRITE_INTRO',
    ), true);
}, 10, 3);

/**
 * The React connector consumes these metadata fields from Orchestra's fixes
 * manifest and Helmet republishes them in the generated document head.
 */
add_filter('seo_aeo_capability_managed_head_action_supported', function ($supported, $action_type, $post_id) {
    if ($supported) {
        return true;
    }
    if ((int) $post_id <= 0) {
        return false;
    }
    return in_array((string) $action_type, array(
        'REWRITE_META',
        'OPTIMIZE_KEYWORDS',
        'GENERATE_SCHEMA',
    ), true);
}, 10, 3);

function solaris_static_replica_rebuild_permission($request) {
    $provided = (string) $request->get_param('token');
    $expected = (string) get_option(SOLARIS_STATIC_REPLICA_REBUILD_OPTION, '');
    return $provided !== '' && $expected !== '' && hash_equals($expected, $provided);
}

function solaris_static_replica_request_rebuild() {
    $uploads = wp_upload_dir();
    if (!empty($uploads['error']) || empty($uploads['basedir'])) {
        return new WP_Error('rebuild_queue_unavailable', 'Rebuild queue unavailable.', array('status' => 503));
    }

    $queue_dir = trailingslashit($uploads['basedir']) . 'solaris-static-replica-rebuild';
    if (!wp_mkdir_p($queue_dir) || !is_dir($queue_dir)) {
        return new WP_Error('rebuild_queue_unavailable', 'Rebuild queue unavailable.', array('status' => 503));
    }

    $request_id = gmdate('Ymd\THis\Z') . '-' . wp_generate_password(12, false, false);
    $payload = wp_json_encode(array(
        'request_id' => $request_id,
        'requested_at' => gmdate('c'),
        'source' => 'aeo-orchestra-deploy-hook',
    ));
    $target = trailingslashit($queue_dir) . 'request-' . sanitize_file_name($request_id) . '.json';
    $written = file_put_contents($target, $payload . "\n", LOCK_EX);
    if ($written === false) {
        return new WP_Error('rebuild_queue_write_failed', 'Rebuild request was not queued.', array('status' => 503));
    }
    @chmod($target, 0640);

    return new WP_REST_Response(array(
        'accepted' => true,
        'request_id' => $request_id,
    ), 202);
}

add_action('rest_api_init', function () {
    register_rest_route('solaris-static-replica/v1', '/rebuild/(?P<token>[A-Za-z0-9_-]{32,128})', array(
        'methods' => 'POST',
        'callback' => 'solaris_static_replica_request_rebuild',
        'permission_callback' => 'solaris_static_replica_rebuild_permission',
    ));
});

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
    $robots = solaris_static_replica_is_private() ? 'noindex, nofollow' : 'index, follow';
    $meta = '<meta name="robots" content="' . esc_attr($robots) . '">';
    if (preg_match('/<meta\b[^>]*\bname=["\']robots["\'][^>]*>/i', $html)) {
        $html = preg_replace('/<meta\b[^>]*\bname=["\']robots["\'][^>]*>/i', $meta, $html, 1);
    } else {
        $html = preg_replace('/<\/head>/i', $meta . '</head>', $html, 1);
    }
    return apply_filters('seo_aeo_headless_static_html', $html);
}

function solaris_static_replica_send_file($file, $cache = 'public, max-age=300') {
    if (!file_exists($file) || !is_file($file)) {
        return false;
    }
    status_header(200);
    $mime = solaris_static_replica_mime($file);
    header('Content-Type: ' . $mime);
    $is_html = strpos($mime, 'text/html') === 0;
    $is_private_staging = solaris_static_replica_is_private();
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
    if (solaris_static_replica_is_private()) {
        header('X-Robots-Tag: noindex, nofollow');
    }
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n" . implode("\n", $urls) . "\n</urlset>";
}

function solaris_static_replica_send_robots() {
    status_header(200);
    header('Content-Type: text/plain; charset=utf-8');
    if (solaris_static_replica_is_private()) {
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

function solaris_static_replica_send_json($status, $payload) {
    status_header((int) $status);
    nocache_headers();
    header('Content-Type: application/json; charset=utf-8');
    echo wp_json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

function solaris_static_replica_read_json_request($payload = null) {
    if (is_array($payload)) {
        return $payload;
    }

    $raw = file_get_contents('php://input');
    if (!is_string($raw) || $raw === '') {
        return array();
    }
    if (strlen($raw) > 100000) {
        return new WP_Error('request_too_large', 'Request body too large');
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return new WP_Error('invalid_json', 'Invalid JSON body');
    }
    return $decoded;
}

function solaris_static_replica_crm_api_url($path) {
    $base = (string) apply_filters('solaris_static_replica_crm_api_base', 'https://crm.solarisfilms.it/api');
    return untrailingslashit($base) . '/' . ltrim((string) $path, '/');
}

function solaris_static_replica_crm_post($path, $body, $as_json = false) {
    $headers = array('X-Solaris-Source' => 'headless-wordpress');
    $request_body = $body;
    if ($as_json) {
        $headers['Content-Type'] = 'application/json';
        $request_body = wp_json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    $response = wp_safe_remote_post(solaris_static_replica_crm_api_url($path), array(
        'timeout' => 25,
        'redirection' => 0,
        'headers' => $headers,
        'body' => $request_body,
        'limit_response_size' => 1048576,
    ));
    if (is_wp_error($response)) {
        return array('ok' => false, 'status' => 0, 'data' => array());
    }

    $status = (int) wp_remote_retrieve_response_code($response);
    $data = json_decode((string) wp_remote_retrieve_body($response), true);
    return array(
        'ok' => $status >= 200 && $status < 300,
        'status' => $status,
        'data' => is_array($data) ? $data : array(),
    );
}

function solaris_static_replica_chat_fallback($message) {
    $text = strtolower(remove_accents((string) $message));
    if (preg_match('/safety|sicurezza|antisfondamento|blindat/', $text)) {
        return 'Per sicurezza e protezione delle vetrate valuterei le soluzioni Safety Shield. Per consigliarti bene servono tipo di vetro, dimensioni e obiettivo: antieffrazione, anti-infortunio o protezione da esplosione.';
    }
    if (preg_match('/caldo|sole|antisolare|abbagliamento/', $text)) {
        return 'Per caldo e abbagliamento la famiglia corretta e quella delle pellicole antisolari. La scelta dipende da esposizione, dimensione delle vetrate e trasparenza desiderata.';
    }
    if (preg_match('/privacy|decor|satin|opaca/', $text)) {
        return 'Per privacy e resa estetica si lavora con pellicole decorative, satinate o schermanti, mantenendo la luminosita richiesta.';
    }
    if (preg_match('/preventivo|prezzo|costo|\bmq\b/', $text)) {
        return 'Per un preventivo servono citta, metri quadri indicativi, tipo di esigenza e qualche foto delle vetrate. Puoi lasciare i dati nel modulo del chatbot.';
    }
    if (strpos($text, 'madico') !== false) {
        return 'Solaris Films distribuisce soluzioni MADICO USA in Italia. La famiglia corretta dipende dall obiettivo: controllo solare, sicurezza, privacy o riqualificazione energetica.';
    }
    return 'Posso aiutarti a orientarti tra pellicole antisolari, Safety Shield, privacy, decorative e consulenza tecnica. Dimmi quale problema vuoi risolvere.';
}

function solaris_static_replica_chat_response($message, $knowledge) {
    $sources = isset($knowledge['sources']) && is_array($knowledge['sources']) ? $knowledge['sources'] : array();
    if (!$sources) {
        return solaris_static_replica_chat_fallback($message);
    }

    $highlights = array();
    $references = array();
    foreach (array_slice($sources, 0, 3) as $source) {
        if (!is_array($source)) {
            continue;
        }
        $title = sanitize_text_field((string) ($source['title'] ?? ''));
        if ($title !== '') {
            $references[] = $title;
        }
        $snippet = trim(preg_replace('/\s+/', ' ', wp_strip_all_tags((string) ($source['snippet'] ?? ''))));
        if ($snippet !== '' && count($highlights) < 2) {
            $highlights[] = wp_html_excerpt($snippet, 220, '...');
        }
    }

    if (!$highlights) {
        return solaris_static_replica_chat_fallback($message);
    }

    $response = solaris_static_replica_chat_fallback($message) . ' Dalle fonti attive risulta inoltre: ' . implode(' ', $highlights);
    if ($references) {
        $response .= "\n\nRiferimenti usati: " . implode(', ', array_unique($references)) . '.';
    }
    return $response;
}

function solaris_static_replica_public_sources($knowledge) {
    $result = array();
    $sources = isset($knowledge['sources']) && is_array($knowledge['sources']) ? $knowledge['sources'] : array();
    foreach (array_slice($sources, 0, 3) as $source) {
        if (!is_array($source)) {
            continue;
        }
        $result[] = array(
            'title' => sanitize_text_field((string) ($source['title'] ?? '')),
            'source_type' => sanitize_key((string) ($source['source_type'] ?? '')),
            'origin_url' => esc_url_raw((string) ($source['origin_url'] ?? '')),
            'score' => isset($source['score']) ? (float) $source['score'] : null,
        );
    }
    return $result;
}

function solaris_static_replica_handle_chat($payload = null) {
    if ($payload === null && strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')) !== 'POST') {
        solaris_static_replica_send_json(405, array('detail' => 'Method not allowed'));
        return;
    }

    $body = solaris_static_replica_read_json_request($payload);
    if (is_wp_error($body)) {
        solaris_static_replica_send_json(400, array('detail' => $body->get_error_message()));
        return;
    }
    $message = sanitize_textarea_field((string) ($body['message'] ?? ''));
    if ($message === '') {
        solaris_static_replica_send_json(422, array('detail' => 'Message is required'));
        return;
    }

    $knowledge_result = solaris_static_replica_crm_post('/public/chatbot/knowledge/search', array(
        'message' => $message,
        'page_path' => sanitize_text_field((string) ($body['page_path'] ?? '')),
        'limit' => 6,
    ), true);
    $knowledge = $knowledge_result['ok'] ? $knowledge_result['data'] : array();
    $session_id = sanitize_text_field((string) ($body['session_id'] ?? ''));
    if ($session_id === '') {
        $session_id = wp_generate_uuid4();
    }

    solaris_static_replica_send_json(200, array(
        'response' => solaris_static_replica_chat_response($message, $knowledge),
        'session_id' => $session_id,
        'sources' => solaris_static_replica_public_sources($knowledge),
        'knowledge_status' => $knowledge_result['ok'] ? 'ok' : 'fallback',
    ));
}

function solaris_static_replica_chat_priority($body) {
    $parts = array(
        (string) ($body['interesse'] ?? ''),
        (string) ($body['messaggio'] ?? ''),
        (string) ($body['page_path'] ?? ''),
    );
    foreach (($body['transcript'] ?? array()) as $item) {
        if (is_array($item)) {
            $parts[] = (string) ($item['text'] ?? '');
        }
    }
    $text = strtolower(remove_accents(implode(' ', $parts)));
    if (preg_match('/safety|shield|anti-esplosione|sicurezza|antisfondamento|urgente/', $text)) {
        return 'alta';
    }
    if (preg_match('/preventivo|consulenza|sopralluogo|azienda|ufficio|\bmq\b|metri|caldo|antisolare/', $text)) {
        return 'media';
    }
    return 'standard';
}

function solaris_static_replica_chat_notes($body) {
    $notes = array(
        'Lead generato dal chatbot Solaris Films.',
        'Priorita: ' . solaris_static_replica_chat_priority($body),
        'Interesse: ' . sanitize_text_field((string) ($body['interesse'] ?? 'Non specificato')),
        'Citta: ' . sanitize_text_field((string) ($body['citta'] ?? 'Non specificata')),
        'Pagina: ' . sanitize_text_field((string) ($body['page_path'] ?? 'Non disponibile')),
        'URL completo: ' . esc_url_raw((string) ($body['source_url'] ?? '')),
        'Sessione chat: ' . sanitize_text_field((string) ($body['session_id'] ?? 'Non disponibile')),
    );
    $message = sanitize_textarea_field((string) ($body['messaggio'] ?? ''));
    if ($message !== '') {
        $notes[] = '';
        $notes[] = 'Messaggio cliente: ' . $message;
    }
    $transcript = array();
    foreach (array_slice((array) ($body['transcript'] ?? array()), -12) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $role = ($item['type'] ?? '') === 'user' ? 'Cliente' : 'Assistente';
        $text = sanitize_textarea_field((string) ($item['text'] ?? ''));
        if ($text !== '') {
            $transcript[] = $role . ': ' . $text;
        }
    }
    if ($transcript) {
        $notes[] = '';
        $notes[] = "Ultimi messaggi chat:\n" . implode("\n", $transcript);
    }
    return implode("\n", $notes);
}

function solaris_static_replica_handle_chat_lead($payload = null) {
    if ($payload === null && strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')) !== 'POST') {
        solaris_static_replica_send_json(405, array('detail' => 'Method not allowed'));
        return;
    }

    $body = solaris_static_replica_read_json_request($payload);
    if (is_wp_error($body)) {
        solaris_static_replica_send_json(400, array('detail' => $body->get_error_message()));
        return;
    }
    if (!filter_var($body['privacy_accettata'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
        solaris_static_replica_send_json(422, array('detail' => 'Privacy non accettata'));
        return;
    }
    $first_name = sanitize_text_field((string) ($body['nome'] ?? ''));
    $email = sanitize_email((string) ($body['email'] ?? ''));
    $phone = sanitize_text_field((string) ($body['telefono'] ?? ''));
    if ($first_name === '') {
        solaris_static_replica_send_json(422, array('detail' => 'Nome obbligatorio'));
        return;
    }
    if ($email === '' && $phone === '') {
        solaris_static_replica_send_json(422, array('detail' => 'Inserisci almeno email o telefono'));
        return;
    }

    $source_page = esc_url_raw((string) ($body['source_url'] ?? $body['page_path'] ?? ''));
    $source_site = sanitize_text_field((string) ($body['source_site'] ?? ''));
    if ($source_site === '' && $source_page !== '') {
        $source_site = (string) wp_parse_url($source_page, PHP_URL_HOST);
    }
    $crm_result = solaris_static_replica_crm_post('/public/forms/contact/plain', array(
        'first_name' => $first_name,
        'last_name' => sanitize_text_field((string) ($body['cognome'] ?? '')),
        'email' => $email,
        'phone' => $phone,
        'company_name' => sanitize_text_field((string) ($body['ragione_sociale'] ?? '')),
        'city' => sanitize_text_field((string) ($body['citta'] ?? '')),
        'request_notes' => solaris_static_replica_chat_notes($body),
        'privacy_acceptance' => 'true',
        'source_page' => $source_page,
        'source_site' => $source_site !== '' ? $source_site : 'solarisfilms.it',
        'form_code' => 'chatbot',
    ));
    if (!$crm_result['ok'] || empty($crm_result['data']['lead_id'])) {
        solaris_static_replica_send_json(502, array('detail' => 'Lead temporarily unavailable', 'crm_status' => 'error'));
        return;
    }

    solaris_static_replica_send_json(200, array(
        'id' => sanitize_text_field((string) $crm_result['data']['lead_id']),
        'status' => 'created',
        'crm_status' => 'sent',
        'session_id' => sanitize_text_field((string) ($body['session_id'] ?? '')),
    ));
}

add_action('template_redirect', function () {
    $path = solaris_static_replica_normalize_path($_SERVER['REQUEST_URI'] ?? '/');

    if ($path === '/api/chat') {
        solaris_static_replica_handle_chat();
        exit;
    }
    if ($path === '/api/chat/lead') {
        solaris_static_replica_handle_chat_lead();
        exit;
    }
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
