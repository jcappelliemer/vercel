<?php
/**
 * Single Servizio Locale — City Page
 */
get_header();

$regione = solaris_get_field('regione');
$provincia = solaris_get_field('provincia');
$nome_citta = get_the_title();

// Get servizi and vantaggi
$servizi = array();
if (function_exists('get_field') && have_rows('servizi_disponibili')) {
    while (have_rows('servizi_disponibili')): the_row();
        $servizi[] = get_sub_field('testo');
    endwhile;
} else {
    $raw = get_post_meta(get_the_ID(), 'servizi_disponibili', true);
    if ($raw) $servizi = array_filter(explode("\n", $raw));
}

$vantaggi = array();
if (function_exists('get_field') && have_rows('vantaggi')) {
    while (have_rows('vantaggi')): the_row();
        $vantaggi[] = get_sub_field('testo');
    endwhile;
} else {
    $raw = get_post_meta(get_the_ID(), 'vantaggi', true);
    if ($raw) $vantaggi = array_filter(explode("\n", $raw));
}
?>

<main class="sf-main">
    <!-- Hero -->
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container">
            <a href="<?php echo esc_url(get_post_type_archive_link('servizio_locale')); ?>" class="sf-breadcrumb-link">
                <?php echo solaris_icon('arrow-left', 16); ?> Tutte le citta
            </a>
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up">
                Pellicole per Vetri a <span class="sf-text-gold"><?php echo esc_html($nome_citta); ?></span>
            </h1>
            <?php if ($regione): ?>
                <div class="sf-product__meta">
                    <span class="sf-tag sf-tag--muted">
                        <?php echo solaris_icon('map-pin', 14); ?>
                        <?php echo esc_html($regione); ?><?php if ($provincia) echo ' — ' . esc_html($provincia); ?>
                    </span>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Content -->
    <section class="sf-section sf-section--light">
        <div class="sf-container sf-container--narrow">
            <div class="sf-content" data-aos="fade-up">
                <?php the_content(); ?>
            </div>
        </div>
    </section>

    <!-- Servizi -->
    <?php if (!empty($servizi)): ?>
    <section class="sf-section sf-section--dark">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title">I nostri servizi a <?php echo esc_html($nome_citta); ?></h2>
            <div class="sf-grid sf-grid--2">
                <?php foreach ($servizi as $i => $s): ?>
                    <div class="sf-feature-card" data-aos="fade-up" data-aos-delay="<?php echo $i * 60; ?>">
                        <span class="sf-feature-card__icon sf-feature-card__icon--gold"><?php echo solaris_icon('check', 20); ?></span>
                        <span class="sf-feature-card__text"><?php echo esc_html($s); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Vantaggi -->
    <?php if (!empty($vantaggi)): ?>
    <section class="sf-section sf-section--light">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title sf-section-title--dark">Perche scegliere Solaris Films a <?php echo esc_html($nome_citta); ?></h2>
            <div class="sf-grid sf-grid--2">
                <?php foreach ($vantaggi as $i => $v): ?>
                    <div class="sf-feature-card sf-feature-card--light" data-aos="fade-up" data-aos-delay="<?php echo $i * 60; ?>">
                        <span class="sf-feature-card__icon sf-feature-card__icon--gold"><?php echo solaris_icon('check', 20); ?></span>
                        <span class="sf-feature-card__text"><?php echo esc_html($v); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- CTA -->
    <?php get_template_part('template-parts/cta-section'); ?>
</main>

<?php
solaris_render_jsonld(array(
    '@context' => 'https://schema.org',
    '@type' => 'LocalBusiness',
    'name' => solaris_option('company_name', 'Solaris Films') . ' — ' . $nome_citta,
    'url' => get_permalink(),
    'telephone' => solaris_option('phone', '+390287168098'),
    'email' => solaris_option('email', 'info@solarisfilms.it'),
    'areaServed' => array('@type' => 'City', 'name' => $nome_citta),
));
get_footer();
