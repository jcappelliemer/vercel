<?php
/**
 * 404 template.
 */

get_header();
?>
<main id="main" class="sf-site-main">
    <section class="sf-archive-hero">
        <p class="sf-es-eyebrow"><?php esc_html_e('Solaris Films', 'solaris-es'); ?></p>
        <h1><?php esc_html_e('Pagina no encontrada', 'solaris-es'); ?></h1>
        <p><?php esc_html_e('Esta URL no esta disponible en el sitio Solaris Films Espana.', 'solaris-es'); ?></p>
        <p><a class="sf-button sf-button--primary" href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Volver al inicio', 'solaris-es'); ?></a></p>
    </section>
</main>
<?php
get_footer();
