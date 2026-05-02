<?php
/**
 * Plugin Name: Solaris Headless SEO Bridge
 * Description: Exposes WordPress and SEO AEO Orchestra metadata to the Solaris React frontend.
 * Version: 0.1.0
 * Author: Solaris Films
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('solaris/v1', '/seo', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'solaris_headless_seo_get_item',
        'permission_callback' => '__return_true',
        'args' => array(
            'path' => array(
                'type' => 'string',
                'required' => false,
            ),
            'post_id' => array(
                'type' => 'integer',
                'required' => false,
            ),
        ),
    ));

    register_rest_route('solaris/v1', '/seo-map', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'solaris_headless_seo_get_map',
        'permission_callback' => '__return_true',
    ));
});

function solaris_headless_seo_normalize_path($path) {
    $path = wp_parse_url((string) $path, PHP_URL_PATH);
    if (!$path || $path === '/') {
        return '/';
    }

    $path = '/' . trim($path, '/') . '/';
    return preg_replace('#/+#', '/', $path);
}

function solaris_headless_seo_excerpt($post_id) {
    $excerpt = get_the_excerpt($post_id);
    if (!$excerpt) {
        $post = get_post($post_id);
        $excerpt = $post ? wp_strip_all_tags($post->post_content) : '';
    }

    return wp_trim_words(trim(preg_replace('/\s+/', ' ', $excerpt)), 32, '');
}

function solaris_headless_seo_find_post_id($request) {
    $post_id = absint($request->get_param('post_id'));
    if ($post_id && get_post_status($post_id) === 'publish') {
        return $post_id;
    }

    $path = solaris_headless_seo_normalize_path($request->get_param('path'));
    if ($path === '/') {
        return (int) get_option('page_on_front');
    }

    $candidates = array(
        home_url($path),
        site_url($path),
    );

    foreach ($candidates as $url) {
        $found = url_to_postid($url);
        if ($found && get_post_status($found) === 'publish') {
            return (int) $found;
        }
    }

    $slug = basename(untrailingslashit($path));
    if (!$slug) {
        return 0;
    }

    $post_types = solaris_headless_seo_public_post_types();
    $post = get_page_by_path($slug, OBJECT, $post_types);
    if ($post && $post->post_status === 'publish') {
        return (int) $post->ID;
    }

    return 0;
}

function solaris_headless_seo_public_post_types() {
    $post_types = get_post_types(array('public' => true), 'names');
    unset($post_types['attachment']);
    return array_values($post_types);
}

function solaris_headless_seo_read_meta($post_id) {
    $bridge_meta = array();
    if (class_exists('SEO_AEO_SEO_Engine_Bridge')) {
        $bridge_meta = SEO_AEO_SEO_Engine_Bridge::read_meta($post_id);
    }

    $meta_title = isset($bridge_meta['meta_title']) ? $bridge_meta['meta_title'] : '';
    $meta_description = isset($bridge_meta['meta_description']) ? $bridge_meta['meta_description'] : '';
    $meta_keywords = isset($bridge_meta['meta_keywords']) ? $bridge_meta['meta_keywords'] : array();

    if (!$meta_title) {
        $meta_title = get_post_meta($post_id, '_seo_aeo_meta_title', true);
    }
    if (!$meta_description) {
        $meta_description = get_post_meta($post_id, '_seo_aeo_meta_description', true);
    }
    if (empty($meta_keywords)) {
        $keywords_csv = get_post_meta($post_id, '_seo_aeo_meta_keywords', true);
        $meta_keywords = $keywords_csv ? array_filter(array_map('trim', explode(',', $keywords_csv))) : array();
    }

    $fallback_title = wp_strip_all_tags(get_the_title($post_id));
    $fallback_description = solaris_headless_seo_excerpt($post_id);
    $permalink = get_permalink($post_id);

    return array(
        'post_id' => (int) $post_id,
        'post_type' => get_post_type($post_id),
        'slug' => get_post_field('post_name', $post_id),
        'path' => solaris_headless_seo_normalize_path($permalink),
        'canonical' => $permalink,
        'title' => $meta_title ? wp_strip_all_tags($meta_title) : $fallback_title,
        'description' => $meta_description ? wp_strip_all_tags($meta_description) : $fallback_description,
        'keywords' => array_values($meta_keywords),
        'robots' => 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        'source' => ($meta_title || $meta_description) ? 'orchestra' : 'wordpress',
        'engine' => isset($bridge_meta['engine']) ? $bridge_meta['engine'] : 'native',
        'scores' => array(
            'seo' => solaris_headless_seo_int_meta($post_id, '_seo_aeo_seo_score'),
            'aeo' => solaris_headless_seo_int_meta($post_id, '_seo_aeo_aeo_score'),
            'ai_visibility' => get_post_meta($post_id, '_seo_aeo_ai_visibility', true) ?: null,
            'citability' => solaris_headless_seo_int_meta($post_id, '_seo_aeo_citability'),
            'issues' => solaris_headless_seo_int_meta($post_id, '_seo_aeo_issues_count'),
            'aeo_issues' => solaris_headless_seo_int_meta($post_id, '_seo_aeo_aeo_issues_count'),
            'last_analysis' => get_post_meta($post_id, '_seo_aeo_last_analysis', true) ?: null,
        ),
        'modified_gmt' => get_post_modified_time('c', true, $post_id),
    );
}

function solaris_headless_seo_int_meta($post_id, $key) {
    $value = get_post_meta($post_id, $key, true);
    return ($value === '' || $value === false) ? null : (int) $value;
}

function solaris_headless_seo_get_item(WP_REST_Request $request) {
    $post_id = solaris_headless_seo_find_post_id($request);
    if (!$post_id) {
        return new WP_Error('solaris_seo_not_found', 'SEO metadata not found for this path.', array('status' => 404));
    }

    return rest_ensure_response(solaris_headless_seo_read_meta($post_id));
}

function solaris_headless_seo_get_map() {
    $query = new WP_Query(array(
        'post_type' => solaris_headless_seo_public_post_types(),
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids',
        'no_found_rows' => true,
        'orderby' => 'modified',
        'order' => 'DESC',
    ));

    $items = array_map('solaris_headless_seo_read_meta', $query->posts);

    return rest_ensure_response(array(
        'site' => home_url('/'),
        'generated_at' => current_time('mysql', true),
        'count' => count($items),
        'items' => $items,
    ));
}
