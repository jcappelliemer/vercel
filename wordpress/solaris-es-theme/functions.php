<?php
/**
 * Solaris Films ES theme bootstrap.
 */

if (!defined('ABSPATH')) {
    exit;
}

define('SOLARIS_ES_THEME_VERSION', '0.1.0');

add_action('after_setup_theme', 'solaris_es_theme_setup');
add_action('wp_enqueue_scripts', 'solaris_es_enqueue_assets');

function solaris_es_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('responsive-embeds');

    register_nav_menus(array(
        'primary' => __('Menu principal', 'solaris-es'),
        'footer' => __('Menu footer', 'solaris-es'),
    ));
}

function solaris_es_asset_version($relative_path) {
    $file = get_theme_file_path($relative_path);
    return file_exists($file) ? (string) filemtime($file) : SOLARIS_ES_THEME_VERSION;
}

function solaris_es_enqueue_assets() {
    wp_enqueue_style(
        'solaris-es',
        get_theme_file_uri('/assets/css/solaris-es.css'),
        array(),
        solaris_es_asset_version('/assets/css/solaris-es.css')
    );

    wp_enqueue_script(
        'solaris-es',
        get_theme_file_uri('/assets/js/solaris-es.js'),
        array(),
        solaris_es_asset_version('/assets/js/solaris-es.js'),
        true
    );
}

function solaris_es_contact_value($key) {
    $defaults = array(
        'email' => 'info@solarisfilms.es',
        'phone' => '',
        'whatsapp' => '',
        'address' => '',
    );

    $value = get_theme_mod('solaris_es_' . $key, isset($defaults[$key]) ? $defaults[$key] : '');
    $value = is_string($value) ? trim($value) : '';

    if ($value === '' || preg_match('/^\[.+\]$/', $value)) {
        return '';
    }

    return $value;
}

function solaris_es_phone_href($value) {
    $number = preg_replace('/[^0-9+]/', '', $value);
    return $number ? 'tel:' . $number : '';
}

function solaris_es_whatsapp_href($value) {
    $number = preg_replace('/[^0-9]/', '', $value);
    return $number ? 'https://wa.me/' . $number : '';
}

function solaris_es_menu_fallback() {
    $items = array(
        __('Servicios', 'solaris-es') => '/servicios/',
        __('Productos', 'solaris-es') => '/productos/',
        __('SafetyShield', 'solaris-es') => '/safetyshield/',
        __('Lo sabias?', 'solaris-es') => '/lo-sabias/',
        __('Info', 'solaris-es') => '/info/',
        __('Contacto', 'solaris-es') => '/contacto/',
    );

    echo '<ul id="primary-menu" class="sf-primary-menu">';
    foreach ($items as $label => $path) {
        echo '<li><a href="' . esc_url(home_url($path)) . '">' . esc_html($label) . '</a></li>';
    }
    echo '</ul>';
}

function solaris_es_render_import_content() {
    while (have_posts()) {
        the_post();
        echo '<main id="main" class="sf-site-main">';
        echo '<article id="post-' . esc_attr(get_the_ID()) . '" ';
        post_class('sf-entry');
        echo '>';

        if (has_post_thumbnail()) {
            echo '<figure class="sf-entry-media">';
            the_post_thumbnail('large');
            echo '</figure>';
        }

        echo '<div class="sf-entry-content">';
        the_content();
        echo '</div>';
        echo '</article>';
        echo '</main>';
    }
}
