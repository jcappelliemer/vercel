<?php
/**
 * ACF Field Groups Registration (programmatic)
 * Works with ACF Free or Pro. If ACF not installed, fields are registered as standard meta boxes.
 */

if (!function_exists('acf_add_local_field_group')) {
    // Fallback: register simple meta boxes if ACF is not installed
    function solaris_add_meta_boxes() {
        add_meta_box('solaris_prodotto_fields', 'Dati Prodotto', 'solaris_prodotto_metabox', 'prodotto', 'normal', 'high');
        add_meta_box('solaris_servizio_fields', 'Dati Citta', 'solaris_servizio_metabox', 'servizio_locale', 'normal', 'high');
        add_meta_box('solaris_focus_fields', 'Dati Focus Tecnico', 'solaris_focus_metabox', 'focus_tecnico', 'normal', 'high');
    }
    add_action('add_meta_boxes', 'solaris_add_meta_boxes');

    function solaris_prodotto_metabox($post) {
        wp_nonce_field('solaris_save_meta', 'solaris_meta_nonce');
        $fields = array(
            'categoria' => 'Categoria (Antisolari/Sicurezza/Privacy)',
            'sottocategoria' => 'Sottocategoria',
            'applicazione' => 'Applicazione (Interno/Esterno)',
            'certificazione' => 'Certificazione',
            'garanzia' => 'Garanzia',
            'tipo_vetro' => 'Tipo Vetro Test',
            'energia_trasmessa' => 'Energia Solare Trasmessa (%)',
            'energia_riflessa' => 'Energia Solare Riflessa (%)',
            'energia_assorbita' => 'Energia Solare Assorbita (%)',
            'vlt' => 'VLT - Luce Visibile Trasmessa (%)',
            'vlr_esterno' => 'VLR Esterno (%)',
            'vlr_interno' => 'VLR Interno (%)',
            'riduzione_abbaglio' => 'Riduzione Abbaglio (%)',
            'ir_respinti' => 'Infrarossi Respinti (%)',
            'uv_trasmessi' => 'UV Trasmessi (%)',
            'energia_respinta' => 'Energia Totale Respinta (%)',
        );
        foreach ($fields as $key => $label) {
            $value = get_post_meta($post->ID, $key, true);
            printf('<p><label><strong>%s</strong><br><input type="text" name="solaris_%s" value="%s" style="width:100%%;"></label></p>', esc_html($label), esc_attr($key), esc_attr($value));
        }
        // Caratteristiche (textarea, one per line)
        $chars = get_post_meta($post->ID, 'caratteristiche', true);
        printf('<p><label><strong>Caratteristiche (una per riga)</strong><br><textarea name="solaris_caratteristiche" rows="6" style="width:100%%;">%s</textarea></label></p>', esc_textarea($chars));
        // Specifiche tecniche (textarea)
        $specs = get_post_meta($post->ID, 'specifiche_tecniche', true);
        printf('<p><label><strong>Descrizione Tecnica</strong><br><textarea name="solaris_specifiche_tecniche" rows="4" style="width:100%%;">%s</textarea></label></p>', esc_textarea($specs));
    }

    function solaris_servizio_metabox($post) {
        wp_nonce_field('solaris_save_meta', 'solaris_meta_nonce');
        $fields = array('regione' => 'Regione', 'provincia' => 'Provincia');
        foreach ($fields as $key => $label) {
            $value = get_post_meta($post->ID, $key, true);
            printf('<p><label><strong>%s</strong><br><input type="text" name="solaris_%s" value="%s" style="width:100%%;"></label></p>', esc_html($label), esc_attr($key), esc_attr($value));
        }
        $servizi = get_post_meta($post->ID, 'servizi_disponibili', true);
        printf('<p><label><strong>Servizi Disponibili (uno per riga)</strong><br><textarea name="solaris_servizi_disponibili" rows="6" style="width:100%%;">%s</textarea></label></p>', esc_textarea($servizi));
        $vantaggi = get_post_meta($post->ID, 'vantaggi', true);
        printf('<p><label><strong>Vantaggi (uno per riga)</strong><br><textarea name="solaris_vantaggi" rows="6" style="width:100%%;">%s</textarea></label></p>', esc_textarea($vantaggi));
    }

    function solaris_focus_metabox($post) {
        wp_nonce_field('solaris_save_meta', 'solaris_meta_nonce');
        $fields = array('categoria' => 'Categoria');
        foreach ($fields as $key => $label) {
            $value = get_post_meta($post->ID, $key, true);
            printf('<p><label><strong>%s</strong><br><input type="text" name="solaris_%s" value="%s" style="width:100%%;"></label></p>', esc_html($label), esc_attr($key), esc_attr($value));
        }
        $chars = get_post_meta($post->ID, 'caratteristiche', true);
        printf('<p><label><strong>Caratteristiche (una per riga)</strong><br><textarea name="solaris_caratteristiche" rows="6" style="width:100%%;">%s</textarea></label></p>', esc_textarea($chars));
    }

    function solaris_save_meta($post_id) {
        if (!isset($_POST['solaris_meta_nonce']) || !wp_verify_nonce($_POST['solaris_meta_nonce'], 'solaris_save_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

        $text_fields = array('categoria', 'sottocategoria', 'applicazione', 'certificazione', 'garanzia', 'tipo_vetro',
            'energia_trasmessa', 'energia_riflessa', 'energia_assorbita', 'vlt', 'vlr_esterno', 'vlr_interno',
            'riduzione_abbaglio', 'ir_respinti', 'uv_trasmessi', 'energia_respinta', 'regione', 'provincia');
        foreach ($text_fields as $field) {
            if (isset($_POST['solaris_' . $field])) {
                update_post_meta($post_id, $field, sanitize_text_field($_POST['solaris_' . $field]));
            }
        }
        $textarea_fields = array('caratteristiche', 'specifiche_tecniche', 'servizi_disponibili', 'vantaggi');
        foreach ($textarea_fields as $field) {
            if (isset($_POST['solaris_' . $field])) {
                update_post_meta($post_id, $field, sanitize_textarea_field($_POST['solaris_' . $field]));
            }
        }
    }
    add_action('save_post', 'solaris_save_meta');
    return;
}

// ===== ACF Field Groups (when ACF is installed) =====

// PRODOTTO fields
acf_add_local_field_group(array(
    'key' => 'group_prodotto',
    'title' => 'Dati Prodotto',
    'fields' => array(
        array('key' => 'field_prod_cat', 'label' => 'Categoria', 'name' => 'categoria', 'type' => 'select',
            'choices' => array('Antisolari' => 'Antisolari', 'Sicurezza' => 'Sicurezza', 'Privacy' => 'Privacy'),
            'wrapper' => array('width' => '33'),
        ),
        array('key' => 'field_prod_subcat', 'label' => 'Sottocategoria', 'name' => 'sottocategoria', 'type' => 'text',
            'placeholder' => 'Es: Sputtered — Serie SB', 'wrapper' => array('width' => '33'),
        ),
        array('key' => 'field_prod_app', 'label' => 'Applicazione', 'name' => 'applicazione', 'type' => 'select',
            'choices' => array('Interno' => 'Interno', 'Esterno' => 'Esterno', 'Interno/Esterno' => 'Interno/Esterno'),
            'wrapper' => array('width' => '34'),
        ),
        array('key' => 'field_prod_cert', 'label' => 'Certificazione', 'name' => 'certificazione', 'type' => 'text',
            'placeholder' => 'Es: UNI EN 12600 classe 3B3', 'wrapper' => array('width' => '50'),
        ),
        array('key' => 'field_prod_gar', 'label' => 'Garanzia', 'name' => 'garanzia', 'type' => 'text',
            'default_value' => '10 anni', 'wrapper' => array('width' => '25'),
        ),
        array('key' => 'field_prod_vetro', 'label' => 'Tipo Vetro Test', 'name' => 'tipo_vetro', 'type' => 'text',
            'placeholder' => 'Es: Vetrocamera basso emissivo 6 mm', 'wrapper' => array('width' => '25'),
        ),
        array('key' => 'field_prod_spectech', 'label' => 'Descrizione Tecnica', 'name' => 'specifiche_tecniche', 'type' => 'textarea', 'rows' => 3),
        array('key' => 'field_prod_chars', 'label' => 'Caratteristiche', 'name' => 'caratteristiche', 'type' => 'repeater', 'sub_fields' => array(
            array('key' => 'field_char_text', 'label' => 'Caratteristica', 'name' => 'testo', 'type' => 'text'),
        )),
        // Dati Tecnici
        array('key' => 'field_prod_dt_tab', 'label' => 'Dati Tecnici', 'name' => '', 'type' => 'tab'),
        array('key' => 'field_prod_en_tr', 'label' => 'Energia Trasmessa', 'name' => 'energia_trasmessa', 'type' => 'text', 'wrapper' => array('width' => '33'), 'append' => '%'),
        array('key' => 'field_prod_en_ri', 'label' => 'Energia Riflessa', 'name' => 'energia_riflessa', 'type' => 'text', 'wrapper' => array('width' => '33'), 'append' => '%'),
        array('key' => 'field_prod_en_as', 'label' => 'Energia Assorbita', 'name' => 'energia_assorbita', 'type' => 'text', 'wrapper' => array('width' => '34'), 'append' => '%'),
        array('key' => 'field_prod_vlt', 'label' => 'VLT', 'name' => 'vlt', 'type' => 'text', 'wrapper' => array('width' => '25'), 'append' => '%'),
        array('key' => 'field_prod_vlr_e', 'label' => 'VLR Esterno', 'name' => 'vlr_esterno', 'type' => 'text', 'wrapper' => array('width' => '25'), 'append' => '%'),
        array('key' => 'field_prod_vlr_i', 'label' => 'VLR Interno', 'name' => 'vlr_interno', 'type' => 'text', 'wrapper' => array('width' => '25'), 'append' => '%'),
        array('key' => 'field_prod_abbag', 'label' => 'Riduzione Abbaglio', 'name' => 'riduzione_abbaglio', 'type' => 'text', 'wrapper' => array('width' => '25'), 'append' => '%'),
        array('key' => 'field_prod_ir', 'label' => 'IR Respinti', 'name' => 'ir_respinti', 'type' => 'text', 'wrapper' => array('width' => '33'), 'append' => '%'),
        array('key' => 'field_prod_uv', 'label' => 'UV Trasmessi', 'name' => 'uv_trasmessi', 'type' => 'text', 'wrapper' => array('width' => '33'), 'append' => '%'),
        array('key' => 'field_prod_en_resp', 'label' => 'Energia Respinta', 'name' => 'energia_respinta', 'type' => 'text', 'wrapper' => array('width' => '34'), 'append' => '%'),
        // Focus tecnico link
        array('key' => 'field_prod_focus_tab', 'label' => 'Collegamento', 'name' => '', 'type' => 'tab'),
        array('key' => 'field_prod_focus', 'label' => 'Focus Tecnico Collegato', 'name' => 'focus_tecnico_collegato', 'type' => 'post_object',
            'post_type' => array('focus_tecnico'), 'return_format' => 'object', 'allow_null' => 1,
        ),
    ),
    'location' => array(array(array('param' => 'post_type', 'operator' => '==', 'value' => 'prodotto'))),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
));

// SERVIZIO LOCALE fields
acf_add_local_field_group(array(
    'key' => 'group_servizio_locale',
    'title' => 'Dati Citta',
    'fields' => array(
        array('key' => 'field_sl_regione', 'label' => 'Regione', 'name' => 'regione', 'type' => 'text', 'wrapper' => array('width' => '50')),
        array('key' => 'field_sl_provincia', 'label' => 'Provincia', 'name' => 'provincia', 'type' => 'text', 'wrapper' => array('width' => '50')),
        array('key' => 'field_sl_servizi', 'label' => 'Servizi Disponibili', 'name' => 'servizi_disponibili', 'type' => 'repeater', 'sub_fields' => array(
            array('key' => 'field_sl_serv_text', 'label' => 'Servizio', 'name' => 'testo', 'type' => 'text'),
        )),
        array('key' => 'field_sl_vantaggi', 'label' => 'Vantaggi', 'name' => 'vantaggi', 'type' => 'repeater', 'sub_fields' => array(
            array('key' => 'field_sl_vant_text', 'label' => 'Vantaggio', 'name' => 'testo', 'type' => 'text'),
        )),
    ),
    'location' => array(array(array('param' => 'post_type', 'operator' => '==', 'value' => 'servizio_locale'))),
));

// FOCUS TECNICO fields
acf_add_local_field_group(array(
    'key' => 'group_focus_tecnico',
    'title' => 'Dati Focus Tecnico',
    'fields' => array(
        array('key' => 'field_ft_cat', 'label' => 'Categoria', 'name' => 'categoria', 'type' => 'select',
            'choices' => array('Antisolari' => 'Antisolari', 'Sicurezza' => 'Sicurezza', 'Privacy' => 'Privacy'),
        ),
        array('key' => 'field_ft_chars', 'label' => 'Caratteristiche', 'name' => 'caratteristiche', 'type' => 'repeater', 'sub_fields' => array(
            array('key' => 'field_ft_char_text', 'label' => 'Caratteristica', 'name' => 'testo', 'type' => 'text'),
        )),
    ),
    'location' => array(array(array('param' => 'post_type', 'operator' => '==', 'value' => 'focus_tecnico'))),
));

// PAGINA INFO fields
acf_add_local_field_group(array(
    'key' => 'group_pagina_info',
    'title' => 'Dati Pagina Info',
    'fields' => array(
        array('key' => 'field_pi_punti', 'label' => 'Punti Chiave', 'name' => 'punti_chiave', 'type' => 'repeater', 'sub_fields' => array(
            array('key' => 'field_pi_punto_text', 'label' => 'Punto', 'name' => 'testo', 'type' => 'text'),
        )),
    ),
    'location' => array(array(array('param' => 'post_type', 'operator' => '==', 'value' => 'pagina_info'))),
));

// HOMEPAGE fields (for page template)
acf_add_local_field_group(array(
    'key' => 'group_homepage',
    'title' => 'Impostazioni Homepage',
    'fields' => array(
        array('key' => 'field_hp_hero_title', 'label' => 'Titolo Hero', 'name' => 'hero_title', 'type' => 'text',
            'default_value' => 'Protezione Solare Professionale per i Tuoi Vetri'),
        array('key' => 'field_hp_hero_sub', 'label' => 'Sottotitolo Hero', 'name' => 'hero_subtitle', 'type' => 'textarea', 'rows' => 2),
        array('key' => 'field_hp_hero_img', 'label' => 'Immagine Hero', 'name' => 'hero_image', 'type' => 'image', 'return_format' => 'url'),
        // Trust bar
        array('key' => 'field_hp_trust_tab', 'label' => 'Trust Bar', 'name' => '', 'type' => 'tab'),
        array('key' => 'field_hp_trust', 'label' => 'Statistiche Trust', 'name' => 'trust_stats', 'type' => 'repeater', 'sub_fields' => array(
            array('key' => 'field_hp_trust_num', 'label' => 'Numero', 'name' => 'numero', 'type' => 'text'),
            array('key' => 'field_hp_trust_lbl', 'label' => 'Etichetta', 'name' => 'etichetta', 'type' => 'text'),
        )),
        // Testimonials
        array('key' => 'field_hp_test_tab', 'label' => 'Testimonials', 'name' => '', 'type' => 'tab'),
        array('key' => 'field_hp_testimonials', 'label' => 'Testimonianze', 'name' => 'testimonianze', 'type' => 'repeater', 'sub_fields' => array(
            array('key' => 'field_hp_test_name', 'label' => 'Nome', 'name' => 'nome', 'type' => 'text'),
            array('key' => 'field_hp_test_role', 'label' => 'Ruolo', 'name' => 'ruolo', 'type' => 'text'),
            array('key' => 'field_hp_test_text', 'label' => 'Testo', 'name' => 'testo', 'type' => 'textarea'),
            array('key' => 'field_hp_test_stars', 'label' => 'Stelle', 'name' => 'stelle', 'type' => 'number', 'min' => 1, 'max' => 5, 'default_value' => 5),
        )),
        // FAQ
        array('key' => 'field_hp_faq_tab', 'label' => 'FAQ', 'name' => '', 'type' => 'tab'),
        array('key' => 'field_hp_faq', 'label' => 'FAQ', 'name' => 'faq', 'type' => 'repeater', 'sub_fields' => array(
            array('key' => 'field_hp_faq_q', 'label' => 'Domanda', 'name' => 'domanda', 'type' => 'text'),
            array('key' => 'field_hp_faq_a', 'label' => 'Risposta', 'name' => 'risposta', 'type' => 'textarea'),
        )),
    ),
    'location' => array(array(array('param' => 'page_template', 'operator' => '==', 'value' => 'front-page.php'))),
));
