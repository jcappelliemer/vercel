<?php
/**
 * Single Focus Tecnico
 */
get_header();

$categoria = solaris_get_field('categoria');
$caratteristiche = solaris_get_caratteristiche();
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container sf-container--narrow">
            <a href="<?php echo esc_url(get_post_type_archive_link('focus_tecnico')); ?>" class="sf-breadcrumb-link">
                <?php echo solaris_icon('arrow-left', 16); ?> Tutti i focus tecnici
            </a>
            <?php if ($categoria): ?>
                <span class="sf-tag sf-tag--gold sf-mb-sm"><?php echo esc_html($categoria); ?></span>
            <?php endif; ?>
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up"><?php the_title(); ?></h1>
        </div>
    </section>

    <section class="sf-section sf-section--light">
        <div class="sf-container sf-container--narrow">
            <div class="sf-content" data-aos="fade-up">
                <?php the_content(); ?>
            </div>
        </div>
    </section>

    <?php if (!empty($caratteristiche)): ?>
    <section class="sf-section sf-section--dark">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title">Caratteristiche principali</h2>
            <div class="sf-grid sf-grid--2">
                <?php foreach ($caratteristiche as $i => $c): ?>
                    <div class="sf-feature-card" data-aos="fade-up" data-aos-delay="<?php echo $i * 60; ?>">
                        <span class="sf-feature-card__icon sf-feature-card__icon--gold"><?php echo solaris_icon('check', 20); ?></span>
                        <span class="sf-feature-card__text"><?php echo esc_html($c); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Related Products -->
    <?php
    $related = new WP_Query(array(
        'post_type' => 'prodotto',
        'posts_per_page' => 6,
        'meta_query' => array(array(
            'key' => 'focus_tecnico_collegato',
            'value' => get_the_ID(),
        )),
    ));
    if ($related->have_posts()):
    ?>
    <section class="sf-section sf-section--light">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title sf-section-title--dark">Prodotti correlati</h2>
            <div class="sf-grid sf-grid--3">
                <?php while ($related->have_posts()): $related->the_post(); ?>
                    <a href="<?php the_permalink(); ?>" class="sf-product-card sf-product-card--light" data-aos="fade-up">
                        <h4 class="sf-product-card__title"><?php the_title(); ?></h4>
                        <p class="sf-product-card__desc"><?php echo wp_trim_words(get_the_excerpt(), 15); ?></p>
                    </a>
                <?php endwhile; wp_reset_postdata(); ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <?php get_template_part('template-parts/cta-section'); ?>
</main>

<?php get_footer();
