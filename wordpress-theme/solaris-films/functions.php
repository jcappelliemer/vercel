<?php
/**
 * Solaris Films - Theme Functions
 */

// ============== THEME SETUP ==============
function solaris_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array(
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('responsive-embeds');

    register_nav_menus(array(
        'primary'   => __('Menu Principale', 'solaris-films'),
        'footer'    => __('Menu Footer', 'solaris-films'),
    ));

    add_image_size('hero-banner', 1920, 800, true);
    add_image_size('card-thumb', 540, 400, true);
}
add_action('after_setup_theme', 'solaris_setup');

// ============== WIDGET AREAS ==============
function solaris_widgets_init() {
    register_sidebar(array(
        'name'          => __('Footer Widget Area', 'solaris-films'),
        'id'            => 'footer-widgets',
        'before_widget' => '<div class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'solaris_widgets_init');

// ============== ENQUEUE ASSETS ==============
function solaris_enqueue_assets() {
    // CSS
    wp_enqueue_style('solaris-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', array(), null);
    wp_enqueue_style('aos-css', 'https://unpkg.com/aos@2.3.4/dist/aos.css', array(), '2.3.4');
    wp_enqueue_style('solaris-theme', get_template_directory_uri() . '/css/theme.css', array(), '1.0.0');
    wp_enqueue_style('solaris-style', get_stylesheet_uri(), array('solaris-theme'), '1.0.0');

    // JS
    wp_enqueue_script('aos-js', 'https://unpkg.com/aos@2.3.4/dist/aos.js', array(), '2.3.4', true);
    wp_enqueue_script('solaris-main', get_template_directory_uri() . '/js/main.js', array('aos-js'), '1.0.0', true);

    wp_localize_script('solaris-main', 'solarisData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('solaris_nonce'),
        'siteUrl' => home_url(),
    ));
}
add_action('wp_enqueue_scripts', 'solaris_enqueue_assets');

// ============== CUSTOM POST TYPES ==============
require_once get_template_directory() . '/inc/custom-post-types.php';

// ============== ACF FIELDS ==============
require_once get_template_directory() . '/inc/acf-fields.php';

// ============== THEME HELPERS ==============
require_once get_template_directory() . '/inc/theme-helpers.php';

// ============== DATA IMPORT ==============
require_once get_template_directory() . '/inc/import-data.php';

// ============== CONTACT FORM AJAX ==============
function solaris_handle_contact_form() {
    check_ajax_referer('solaris_nonce', 'nonce');

    $name    = sanitize_text_field($_POST['name'] ?? '');
    $email   = sanitize_email($_POST['email'] ?? '');
    $phone   = sanitize_text_field($_POST['phone'] ?? '');
    $message = sanitize_textarea_field($_POST['message'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        wp_send_json_error(array('message' => 'Compila tutti i campi obbligatori.'));
    }

    $to = get_option('admin_email');
    $subject = sprintf('[Solaris Films] Nuovo messaggio da %s', $name);
    $body = sprintf("Nome: %s\nEmail: %s\nTelefono: %s\n\nMessaggio:\n%s", $name, $email, $phone, $message);
    $headers = array('Content-Type: text/plain; charset=UTF-8', sprintf('Reply-To: %s', $email));

    $sent = wp_mail($to, $subject, $body, $headers);

    // Save to DB as custom post
    wp_insert_post(array(
        'post_type'   => 'contatto',
        'post_title'  => sprintf('Contatto da %s — %s', $name, current_time('d/m/Y H:i')),
        'post_status' => 'private',
        'meta_input'  => array(
            '_contact_name'    => $name,
            '_contact_email'   => $email,
            '_contact_phone'   => $phone,
            '_contact_message' => $message,
        ),
    ));

    if ($sent) {
        wp_send_json_success(array('message' => 'Messaggio inviato con successo!'));
    } else {
        wp_send_json_success(array('message' => 'Messaggio registrato. Ti contatteremo presto.'));
    }
}
add_action('wp_ajax_solaris_contact', 'solaris_handle_contact_form');
add_action('wp_ajax_nopriv_solaris_contact', 'solaris_handle_contact_form');

// Quote form
function solaris_handle_quote_form() {
    check_ajax_referer('solaris_nonce', 'nonce');

    $name     = sanitize_text_field($_POST['name'] ?? '');
    $email    = sanitize_email($_POST['email'] ?? '');
    $phone    = sanitize_text_field($_POST['phone'] ?? '');
    $service  = sanitize_text_field($_POST['service'] ?? '');
    $sqm      = sanitize_text_field($_POST['sqm'] ?? '');
    $message  = sanitize_textarea_field($_POST['message'] ?? '');

    if (empty($name) || empty($email)) {
        wp_send_json_error(array('message' => 'Compila tutti i campi obbligatori.'));
    }

    $to = get_option('admin_email');
    $subject = sprintf('[Solaris Films] Richiesta Preventivo da %s', $name);
    $body = sprintf("Nome: %s\nEmail: %s\nTelefono: %s\nServizio: %s\nMq: %s\n\nMessaggio:\n%s", $name, $email, $phone, $service, $sqm, $message);
    $headers = array('Content-Type: text/plain; charset=UTF-8', sprintf('Reply-To: %s', $email));

    wp_mail($to, $subject, $body, $headers);

    wp_insert_post(array(
        'post_type'   => 'preventivo',
        'post_title'  => sprintf('Preventivo da %s — %s', $name, current_time('d/m/Y H:i')),
        'post_status' => 'private',
        'meta_input'  => array(
            '_quote_name'    => $name,
            '_quote_email'   => $email,
            '_quote_phone'   => $phone,
            '_quote_service' => $service,
            '_quote_sqm'     => $sqm,
            '_quote_message' => $message,
        ),
    ));

    wp_send_json_success(array('message' => 'Richiesta preventivo inviata! Ti contatteremo entro 24 ore.'));
}
add_action('wp_ajax_solaris_quote', 'solaris_handle_quote_form');
add_action('wp_ajax_nopriv_solaris_quote', 'solaris_handle_quote_form');

// ============== FALLBACK MENU ==============
function solaris_fallback_menu() {
    echo '<ul class="sf-header__menu">';
    echo '<li><a href="' . esc_url(home_url('/')) . '">Home</a></li>';
    echo '<li><a href="' . esc_url(home_url('/prodotti/')) . '">Prodotti</a></li>';
    echo '<li><a href="' . esc_url(home_url('/servizio-locale/')) . '">Servizi Locali</a></li>';
    echo '<li><a href="' . esc_url(home_url('/guida-tecnica/')) . '">Guida Tecnica</a></li>';
    echo '<li><a href="' . esc_url(home_url('/chi-siamo/')) . '">Chi Siamo</a></li>';
    echo '<li><a href="' . esc_url(home_url('/contatti/')) . '">Contatti</a></li>';
    echo '</ul>';
}

// ============== DISABLE GUTENBERG FOR CPTs ==============
function solaris_disable_gutenberg($use_block_editor, $post_type) {
    $disabled = array('prodotto', 'servizio_locale', 'focus_tecnico', 'pagina_info', 'contatto', 'preventivo');
    if (in_array($post_type, $disabled)) {
        return false;
    }
    return $use_block_editor;
}
add_filter('use_block_editor_for_post_type', 'solaris_disable_gutenberg', 10, 2);

// ============== ADMIN COLUMNS ==============
function solaris_prodotto_columns($columns) {
    $new = array();
    $new['cb'] = $columns['cb'];
    $new['title'] = $columns['title'];
    $new['categoria'] = __('Categoria', 'solaris-films');
    $new['sottocategoria'] = __('Sottocategoria', 'solaris-films');
    $new['applicazione'] = __('Applicazione', 'solaris-films');
    $new['date'] = $columns['date'];
    return $new;
}
add_filter('manage_prodotto_posts_columns', 'solaris_prodotto_columns');

function solaris_prodotto_column_content($column, $post_id) {
    if ($column === 'categoria') {
        echo esc_html(get_field('categoria', $post_id) ?: '—');
    }
    if ($column === 'sottocategoria') {
        echo esc_html(get_field('sottocategoria', $post_id) ?: '—');
    }
    if ($column === 'applicazione') {
        echo esc_html(get_field('applicazione', $post_id) ?: '—');
    }
}
add_action('manage_prodotto_posts_custom_column', 'solaris_prodotto_column_content', 10, 2);

// ============== EXCERPT LENGTH ==============
function solaris_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'solaris_excerpt_length');
