<?php
/**
 * Custom Post Types for Solaris Films
 */

function solaris_register_post_types() {

    // ===== PRODOTTO (Schede Prodotto) =====
    register_post_type('prodotto', array(
        'labels' => array(
            'name'               => 'Prodotti',
            'singular_name'      => 'Prodotto',
            'add_new'            => 'Aggiungi Prodotto',
            'add_new_item'       => 'Aggiungi Nuovo Prodotto',
            'edit_item'          => 'Modifica Prodotto',
            'view_item'          => 'Vedi Prodotto',
            'search_items'       => 'Cerca Prodotti',
            'not_found'          => 'Nessun prodotto trovato',
            'menu_name'          => 'Prodotti',
        ),
        'public'             => true,
        'has_archive'        => true,
        'rewrite'            => array('slug' => 'prodotti', 'with_front' => false),
        'menu_icon'          => 'dashicons-shield',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest'       => true,
        'menu_position'      => 5,
    ));

    // ===== SERVIZIO LOCALE (Pagine Citta) =====
    register_post_type('servizio_locale', array(
        'labels' => array(
            'name'               => 'Servizi Locali',
            'singular_name'      => 'Servizio Locale',
            'add_new'            => 'Aggiungi Citta',
            'add_new_item'       => 'Aggiungi Nuova Citta',
            'edit_item'          => 'Modifica Citta',
            'view_item'          => 'Vedi Citta',
            'search_items'       => 'Cerca Citta',
            'not_found'          => 'Nessuna citta trovata',
            'menu_name'          => 'Servizi Locali',
        ),
        'public'             => true,
        'has_archive'        => true,
        'rewrite'            => array('slug' => 'servizio-locale', 'with_front' => false),
        'menu_icon'          => 'dashicons-location',
        'supports'           => array('title', 'editor', 'thumbnail'),
        'show_in_rest'       => true,
        'menu_position'      => 6,
    ));

    // ===== FOCUS TECNICO =====
    register_post_type('focus_tecnico', array(
        'labels' => array(
            'name'               => 'Focus Tecnici',
            'singular_name'      => 'Focus Tecnico',
            'add_new'            => 'Aggiungi Focus',
            'add_new_item'       => 'Aggiungi Nuovo Focus Tecnico',
            'edit_item'          => 'Modifica Focus Tecnico',
            'view_item'          => 'Vedi Focus Tecnico',
            'search_items'       => 'Cerca Focus Tecnici',
            'not_found'          => 'Nessun focus tecnico trovato',
            'menu_name'          => 'Focus Tecnici',
        ),
        'public'             => true,
        'has_archive'        => true,
        'rewrite'            => array('slug' => 'focus-tecnico', 'with_front' => false),
        'menu_icon'          => 'dashicons-visibility',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest'       => true,
        'menu_position'      => 7,
    ));

    // ===== PAGINA INFO =====
    register_post_type('pagina_info', array(
        'labels' => array(
            'name'               => 'Pagine Info',
            'singular_name'      => 'Pagina Info',
            'add_new'            => 'Aggiungi Info',
            'add_new_item'       => 'Aggiungi Nuova Pagina Info',
            'edit_item'          => 'Modifica Pagina Info',
            'view_item'          => 'Vedi Pagina Info',
            'search_items'       => 'Cerca Pagine Info',
            'not_found'          => 'Nessuna pagina trovata',
            'menu_name'          => 'Pagine Info',
        ),
        'public'             => true,
        'has_archive'        => true,
        'rewrite'            => array('slug' => 'info', 'with_front' => false),
        'menu_icon'          => 'dashicons-info',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest'       => true,
        'menu_position'      => 8,
    ));

    // ===== CONTATTO (stored form submissions) =====
    register_post_type('contatto', array(
        'labels' => array(
            'name'          => 'Contatti Ricevuti',
            'singular_name' => 'Contatto',
            'menu_name'     => 'Contatti',
        ),
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'menu_icon'          => 'dashicons-email-alt',
        'supports'           => array('title'),
        'menu_position'      => 25,
    ));

    // ===== PREVENTIVO (stored quote submissions) =====
    register_post_type('preventivo', array(
        'labels' => array(
            'name'          => 'Preventivi Ricevuti',
            'singular_name' => 'Preventivo',
            'menu_name'     => 'Preventivi',
        ),
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'menu_icon'          => 'dashicons-media-document',
        'supports'           => array('title'),
        'menu_position'      => 26,
    ));
}
add_action('init', 'solaris_register_post_types');

// ===== TAXONOMIES =====
function solaris_register_taxonomies() {
    register_taxonomy('categoria_prodotto', 'prodotto', array(
        'labels' => array(
            'name'          => 'Categorie Prodotto',
            'singular_name' => 'Categoria',
            'add_new_item'  => 'Aggiungi Categoria',
        ),
        'hierarchical' => true,
        'public'       => true,
        'show_in_rest' => true,
        'rewrite'      => array('slug' => 'categoria-prodotto'),
    ));

    register_taxonomy('regione', 'servizio_locale', array(
        'labels' => array(
            'name'          => 'Regioni',
            'singular_name' => 'Regione',
            'add_new_item'  => 'Aggiungi Regione',
        ),
        'hierarchical' => true,
        'public'       => true,
        'show_in_rest' => true,
        'rewrite'      => array('slug' => 'regione'),
    ));
}
add_action('init', 'solaris_register_taxonomies');
