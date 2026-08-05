<?php
/**
 * Plugin Name: Solaris ES Content Types
 * Description: Registers the WordPress content model for solarisfilms.es imports.
 * Version: 0.1.0
 * Author: Solaris Films
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'solaris_es_register_content_types');
add_action('init', 'solaris_es_register_taxonomies');

function solaris_es_register_content_types() {
    solaris_es_register_post_type('producto', array(
        'name' => 'Productos',
        'singular_name' => 'Producto',
        'menu_name' => 'Productos Solaris',
        'slug' => 'productos',
        'rest_base' => 'producto',
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
        'menu_icon' => 'dashicons-products',
    ));

    solaris_es_register_post_type('pagina_info', array(
        'name' => 'Paginas info',
        'singular_name' => 'Pagina info',
        'menu_name' => 'Info Solaris',
        'slug' => 'info',
        'rest_base' => 'pagina_info',
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
        'menu_icon' => 'dashicons-info-outline',
    ));

    solaris_es_register_post_type('servicio_local', array(
        'name' => 'Servicios locales',
        'singular_name' => 'Servicio local',
        'menu_name' => 'Servicio local',
        'slug' => 'servicio-local',
        'rest_base' => 'servicio_local',
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
        'menu_icon' => 'dashicons-location-alt',
    ));
}

function solaris_es_register_post_type($post_type, $config) {
    $labels = array(
        'name' => $config['name'],
        'singular_name' => $config['singular_name'],
        'menu_name' => $config['menu_name'],
        'add_new' => 'Anadir nuevo',
        'add_new_item' => 'Anadir nuevo',
        'edit_item' => 'Editar',
        'new_item' => 'Nuevo',
        'view_item' => 'Ver',
        'search_items' => 'Buscar',
        'not_found' => 'No encontrado',
        'not_found_in_trash' => 'No encontrado en la papelera',
        'all_items' => 'Todos',
    );

    register_post_type($post_type, array(
        'labels' => $labels,
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base' => $config['rest_base'],
        'has_archive' => true,
        'hierarchical' => false,
        'menu_icon' => $config['menu_icon'],
        'supports' => $config['supports'],
        'rewrite' => array(
            'slug' => $config['slug'],
            'with_front' => false,
        ),
    ));
}

function solaris_es_register_taxonomies() {
    register_taxonomy('categoria_producto', array('producto'), array(
        'labels' => array(
            'name' => 'Categorias de producto',
            'singular_name' => 'Categoria de producto',
        ),
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'hierarchical' => true,
        'rewrite' => array(
            'slug' => 'categoria-producto',
            'with_front' => false,
        ),
    ));

    register_taxonomy('area_servicio', array('servicio_local'), array(
        'labels' => array(
            'name' => 'Areas de servicio',
            'singular_name' => 'Area de servicio',
        ),
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'hierarchical' => true,
        'rewrite' => array(
            'slug' => 'area-servicio',
            'with_front' => false,
        ),
    ));
}

