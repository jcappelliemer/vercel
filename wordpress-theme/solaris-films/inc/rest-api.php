<?php
/**
 * Solaris Films — REST API Meta Fields
 * Exposes custom meta fields via WordPress REST API for headless usage
 */

function solaris_register_rest_meta() {
    // Product meta fields
    $prodotto_fields = array(
        'categoria', 'sottocategoria', 'applicazione', 'certificazione', 'garanzia',
        'tipo_vetro', 'energia_trasmessa', 'energia_riflessa', 'energia_assorbita',
        'vlt', 'vlr_esterno', 'vlr_interno', 'riduzione_abbaglio', 'ir_respinti',
        'uv_trasmessi', 'energia_respinta', 'caratteristiche',
    );

    foreach ($prodotto_fields as $field) {
        register_post_meta('prodotto', $field, array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
        ));
    }

    // Focus Tecnico meta fields
    $focus_fields = array('categoria', 'caratteristiche');
    foreach ($focus_fields as $field) {
        register_post_meta('focus_tecnico', $field, array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
        ));
    }

    // Servizio Locale meta fields
    $servizio_fields = array('nome_citta', 'regione', 'descrizione_breve');
    foreach ($servizio_fields as $field) {
        register_post_meta('servizio_locale', $field, array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
        ));
    }
}
add_action('init', 'solaris_register_rest_meta');

/**
 * Add all post meta to REST API responses as a flat 'solaris_meta' field
 * This ensures ALL meta data is accessible even if not individually registered
 */
function solaris_add_meta_to_rest($response, $post, $request) {
    $post_type = $post->post_type;
    $allowed_types = array('prodotto', 'servizio_locale', 'focus_tecnico', 'pagina_info');

    if (!in_array($post_type, $allowed_types)) {
        return $response;
    }

    $all_meta = get_post_meta($post->ID);
    $clean_meta = array();

    foreach ($all_meta as $key => $value) {
        // Skip private/internal WP meta
        if (strpos($key, '_') === 0) continue;
        $clean_meta[$key] = is_array($value) && count($value) === 1 ? $value[0] : $value;
    }

    $response->data['solaris_meta'] = $clean_meta;
    return $response;
}
add_filter('rest_prepare_prodotto', 'solaris_add_meta_to_rest', 10, 3);
add_filter('rest_prepare_servizio_locale', 'solaris_add_meta_to_rest', 10, 3);
add_filter('rest_prepare_focus_tecnico', 'solaris_add_meta_to_rest', 10, 3);
add_filter('rest_prepare_pagina_info', 'solaris_add_meta_to_rest', 10, 3);

/**
 * Enable CORS for the REST API (needed for headless frontend on different domain)
 */
function solaris_rest_cors() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}
add_action('rest_api_init', 'solaris_rest_cors', 15);

/**
 * Add theme settings to REST API
 */
function solaris_register_settings_route() {
    register_rest_route('solaris/v1', '/settings', array(
        'methods' => 'GET',
        'callback' => function() {
            $defaults = function_exists('solaris_defaults') ? solaris_defaults() : array();
            $options = get_option('solaris_options', array());
            return array_merge($defaults, $options);
        },
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'solaris_register_settings_route');
