<?php
/**
 * Archive: Servizi Locali
 */
get_header();

$citta = new WP_Query(array(
    'post_type' => 'servizio_locale',
    'posts_per_page' => -1,
    'orderby' => 'title',
    'order' => 'ASC',
));

// Group by regione
$regioni = array();
if ($citta->have_posts()) {
    while ($citta->have_posts()): $citta->the_post();
        $reg = solaris_get_field('regione') ?: 'Altra Regione';
        if (!isset($regioni[$reg])) $regioni[$reg] = array();
        $regioni[$reg][] = array('title' => get_the_title(), 'url' => get_permalink());
    endwhile;
    wp_reset_postdata();
}
ksort($regioni);
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container">
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up">Pellicole per Vetri in <span class="sf-text-gold">Tutta Italia</span></h1>
            <p class="sf-page-subtitle">Solaris Films opera su tutto il territorio nazionale con installatori certificati MADICO.</p>
        </div>
    </section>

    <?php $i = 0; foreach ($regioni as $reg => $cities): $is_light = ($i % 2 === 0); ?>
    <section class="sf-section <?php echo $is_light ? 'sf-section--light' : 'sf-section--dark'; ?>">
        <div class="sf-container">
            <h2 class="sf-section-title <?php echo $is_light ? 'sf-section-title--dark' : ''; ?>"><?php echo esc_html($reg); ?></h2>
            <div class="sf-grid sf-grid--3">
                <?php foreach ($cities as $j => $city): ?>
                    <a href="<?php echo esc_url($city['url']); ?>"
                       class="sf-product-card <?php echo $is_light ? 'sf-product-card--light' : 'sf-product-card--dark'; ?>"
                       data-aos="fade-up" data-aos-delay="<?php echo $j * 50; ?>">
                        <h4 class="sf-product-card__title">
                            <?php echo solaris_icon('map-pin', 16); ?>
                            <?php echo esc_html($city['title']); ?>
                        </h4>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php $i++; endforeach; ?>

    <?php get_template_part('template-parts/cta-section'); ?>
</main>

<?php get_footer();
