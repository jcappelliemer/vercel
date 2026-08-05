<?php
/**
 * Theme header.
 */

if (!defined('ABSPATH')) {
    exit;
}

$email = solaris_es_contact_value('email');
$phone = solaris_es_contact_value('phone');
$whatsapp = solaris_es_contact_value('whatsapp');
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="sf-skip-link" href="#main"><?php esc_html_e('Saltar al contenido', 'solaris-es'); ?></a>
<header class="sf-site-header" data-sf-header>
    <div class="sf-header-inner">
        <a class="sf-brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php esc_attr_e('Solaris Films Espana', 'solaris-es'); ?>">
            <span class="sf-brand-mark" aria-hidden="true"></span>
            <span class="sf-brand-text"><strong>SOLARIS</strong><span>FILMS</span></span>
        </a>

        <button class="sf-menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" data-sf-menu-toggle>
            <span></span>
            <span></span>
            <span></span>
            <span class="screen-reader-text"><?php esc_html_e('Abrir menu', 'solaris-es'); ?></span>
        </button>

        <nav class="sf-primary-nav" aria-label="<?php esc_attr_e('Menu principal', 'solaris-es'); ?>" data-sf-nav>
            <?php
            if (has_nav_menu('primary')) {
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_id' => 'primary-menu',
                    'menu_class' => 'sf-primary-menu',
                    'container' => false,
                    'depth' => 2,
                ));
            } else {
                solaris_es_menu_fallback();
            }
            ?>
        </nav>

        <div class="sf-header-actions">
            <?php if ($phone) : ?>
                <a class="sf-icon-link" href="<?php echo esc_url(solaris_es_phone_href($phone)); ?>" aria-label="<?php esc_attr_e('Llamar a Solaris Films', 'solaris-es'); ?>">Tel</a>
            <?php endif; ?>
            <?php if ($whatsapp) : ?>
                <a class="sf-icon-link sf-icon-link--whatsapp" href="<?php echo esc_url(solaris_es_whatsapp_href($whatsapp)); ?>" target="_blank" rel="noopener" aria-label="<?php esc_attr_e('WhatsApp Solaris Films', 'solaris-es'); ?>">WA</a>
            <?php endif; ?>
            <a class="sf-header-cta" href="<?php echo esc_url(home_url('/presupuesto/')); ?>"><?php esc_html_e('Presupuesto', 'solaris-es'); ?></a>
        </div>
    </div>
</header>
