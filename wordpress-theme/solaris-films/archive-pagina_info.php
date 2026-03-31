<?php
/**
 * Archive: Pagine Info
 */
get_header();

$items = new WP_Query(array(
    'post_type' => 'pagina_info',
    'posts_per_page' => -1,
    'orderby' => 'menu_order title',
    'order' => 'ASC',
));
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container">
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up">Informazioni <span class="sf-text-gold">Utili</span></h1>
            <p class="sf-page-subtitle">Norme, garanzie, certificazioni e informazioni utili sulle pellicole per vetri.</p>
        </div>
    </section>

    <section class="sf-section sf-section--light">
        <div class="sf-container">
            <div class="sf-grid sf-grid--3">
                <?php while ($items->have_posts()): $items->the_post(); ?>
                    <a href="<?php the_permalink(); ?>" class="sf-product-card sf-product-card--light" data-aos="fade-up">
                        <h4 class="sf-product-card__title"><?php the_title(); ?></h4>
                        <p class="sf-product-card__desc"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
                    </a>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
        </div>
    </section>
</main>

<?php get_footer();
