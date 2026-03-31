<?php
/**
 * Default index / fallback
 */
get_header();
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container">
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up">
                <?php echo is_archive() ? get_the_archive_title() : 'Blog'; ?>
            </h1>
        </div>
    </section>

    <section class="sf-section sf-section--light">
        <div class="sf-container">
            <div class="sf-grid sf-grid--3">
                <?php while (have_posts()): the_post(); ?>
                    <a href="<?php the_permalink(); ?>" class="sf-product-card sf-product-card--light" data-aos="fade-up">
                        <?php if (has_post_thumbnail()): ?>
                            <div class="sf-product-card__image">
                                <?php the_post_thumbnail('card-thumb'); ?>
                            </div>
                        <?php endif; ?>
                        <h4 class="sf-product-card__title"><?php the_title(); ?></h4>
                        <p class="sf-product-card__desc"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
                        <span class="sf-product-card__date"><?php echo get_the_date(); ?></span>
                    </a>
                <?php endwhile; ?>
            </div>
            <div class="sf-pagination">
                <?php the_posts_pagination(array('mid_size' => 2, 'prev_text' => '&laquo;', 'next_text' => '&raquo;')); ?>
            </div>
        </div>
    </section>
</main>

<?php get_footer();
