<?php
/**
 * Archive template.
 */

get_header();
?>
<main id="main" class="sf-site-main">
    <section class="sf-archive-hero">
        <p class="sf-es-eyebrow"><?php esc_html_e('Solaris Films', 'solaris-es'); ?></p>
        <h1><?php the_archive_title(); ?></h1>
        <?php the_archive_description('<p>', '</p>'); ?>
    </section>

    <?php if (have_posts()) : ?>
        <div class="sf-archive-grid">
            <?php while (have_posts()) : the_post(); ?>
                <article <?php post_class('sf-archive-card'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <a class="sf-archive-card-media" href="<?php the_permalink(); ?>">
                            <?php the_post_thumbnail('medium_large'); ?>
                        </a>
                    <?php endif; ?>
                    <div>
                        <p class="sf-es-eyebrow"><?php echo esc_html(get_post_type_object(get_post_type())->labels->singular_name); ?></p>
                        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <?php if (has_excerpt()) : ?>
                            <p><?php echo esc_html(get_the_excerpt()); ?></p>
                        <?php endif; ?>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>
        <div class="sf-pagination">
            <?php the_posts_pagination(array('mid_size' => 1)); ?>
        </div>
    <?php else : ?>
        <section class="sf-es-section">
            <h2><?php esc_html_e('Nessun contenuto trovato', 'solaris-es'); ?></h2>
            <p><?php esc_html_e('Il contenuto non e ancora stato pubblicato.', 'solaris-es'); ?></p>
        </section>
    <?php endif; ?>
</main>
<?php
get_footer();
