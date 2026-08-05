<?php
/**
 * Theme footer.
 */

if (!defined('ABSPATH')) {
    exit;
}

$email = solaris_es_contact_value('email');
$phone = solaris_es_contact_value('phone');
$whatsapp = solaris_es_contact_value('whatsapp');
$address = solaris_es_contact_value('address');
?>
<footer class="sf-site-footer">
    <div class="sf-footer-inner">
        <div class="sf-footer-brand">
            <a class="sf-brand sf-brand--footer" href="<?php echo esc_url(home_url('/')); ?>">
                <span class="sf-brand-mark" aria-hidden="true"></span>
                <span class="sf-brand-text"><strong>SOLARIS</strong><span>FILMS</span></span>
            </a>
            <p><?php esc_html_e('Peliculas profesionales para cristales: control solar, seguridad, privacidad y diseno.', 'solaris-es'); ?></p>
        </div>

        <div class="sf-footer-column">
            <h2><?php esc_html_e('Servicios', 'solaris-es'); ?></h2>
            <a href="<?php echo esc_url(home_url('/peliculas-antisolares/')); ?>"><?php esc_html_e('Control solar', 'solaris-es'); ?></a>
            <a href="<?php echo esc_url(home_url('/peliculas-de-seguridad/')); ?>"><?php esc_html_e('Seguridad', 'solaris-es'); ?></a>
            <a href="<?php echo esc_url(home_url('/peliculas-decorativas/')); ?>"><?php esc_html_e('Privacidad y diseno', 'solaris-es'); ?></a>
            <a href="<?php echo esc_url(home_url('/safetyshield/')); ?>"><?php esc_html_e('SafetyShield', 'solaris-es'); ?></a>
        </div>

        <div class="sf-footer-column">
            <h2><?php esc_html_e('Empresa', 'solaris-es'); ?></h2>
            <a href="<?php echo esc_url(home_url('/company-profile/')); ?>"><?php esc_html_e('Company profile', 'solaris-es'); ?></a>
            <a href="<?php echo esc_url(home_url('/productos/')); ?>"><?php esc_html_e('Productos', 'solaris-es'); ?></a>
            <a href="<?php echo esc_url(home_url('/lo-sabias/')); ?>"><?php esc_html_e('Lo sabias?', 'solaris-es'); ?></a>
            <a href="<?php echo esc_url(home_url('/contacto/')); ?>"><?php esc_html_e('Contacto', 'solaris-es'); ?></a>
        </div>

        <div class="sf-footer-column">
            <h2><?php esc_html_e('Contactos', 'solaris-es'); ?></h2>
            <?php if ($email) : ?>
                <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
            <?php endif; ?>
            <?php if ($phone) : ?>
                <a href="<?php echo esc_url(solaris_es_phone_href($phone)); ?>"><?php echo esc_html($phone); ?></a>
            <?php endif; ?>
            <?php if ($whatsapp) : ?>
                <a href="<?php echo esc_url(solaris_es_whatsapp_href($whatsapp)); ?>" target="_blank" rel="noopener"><?php esc_html_e('WhatsApp', 'solaris-es'); ?></a>
            <?php endif; ?>
            <?php if ($address) : ?>
                <p><?php echo esc_html($address); ?></p>
            <?php endif; ?>
        </div>
    </div>

    <div class="sf-footer-bottom">
        <p>&copy; <?php echo esc_html(date_i18n('Y')); ?> Solaris Films.</p>
        <p><?php esc_html_e('Solaris Code SL - datos societarios pendientes de confirmacion.', 'solaris-es'); ?></p>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
