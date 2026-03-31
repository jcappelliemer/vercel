<?php
/**
 * Default page template
 */
get_header();
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container sf-container--narrow">
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
</main>

<?php get_footer();
