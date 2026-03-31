<?php
/**
 * Archive: Focus Tecnici
 */
get_header();

$items = new WP_Query(array(
    'post_type' => 'focus_tecnico',
    'posts_per_page' => -1,
    'orderby' => 'menu_order title',
    'order' => 'ASC',
));

$grouped = array();
if ($items->have_posts()) {
    while ($items->have_posts()): $items->the_post();
        $cat = solaris_get_field('categoria') ?: 'Generale';
        if (!isset($grouped[$cat])) $grouped[$cat] = array();
        $grouped[$cat][] = array(
            'title' => get_the_title(),
            'url'   => get_permalink(),
            'desc'  => get_the_excerpt(),
        );
    endwhile;
    wp_reset_postdata();
}
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container">
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up">Focus <span class="sf-text-gold">Tecnico</span></h1>
            <p class="sf-page-subtitle">Approfondimenti tecnici sulle tipologie di pellicole per vetri MADICO.</p>
        </div>
    </section>

    <?php $i = 0; foreach ($grouped as $cat => $focuses): $is_light = ($i % 2 === 0); ?>
    <section class="sf-section <?php echo $is_light ? 'sf-section--light' : 'sf-section--dark'; ?>">
        <div class="sf-container">
            <h2 class="sf-section-title <?php echo $is_light ? 'sf-section-title--dark' : ''; ?>">Pellicole <?php echo esc_html($cat); ?></h2>
            <div class="sf-grid sf-grid--3">
                <?php foreach ($focuses as $j => $f): ?>
                    <a href="<?php echo esc_url($f['url']); ?>"
                       class="sf-product-card <?php echo $is_light ? 'sf-product-card--light' : 'sf-product-card--dark'; ?>"
                       data-aos="fade-up" data-aos-delay="<?php echo $j * 50; ?>">
                        <h4 class="sf-product-card__title"><?php echo esc_html($f['title']); ?></h4>
                        <p class="sf-product-card__desc"><?php echo esc_html(wp_trim_words($f['desc'], 20)); ?></p>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php $i++; endforeach; ?>
</main>

<?php get_footer();
