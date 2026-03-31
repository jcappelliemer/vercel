<?php
/**
 * Single Pagina Info
 */
get_header();

$punti = array();
if (function_exists('get_field') && have_rows('punti_chiave')) {
    while (have_rows('punti_chiave')): the_row();
        $punti[] = get_sub_field('testo');
    endwhile;
}
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container sf-container--narrow">
            <a href="<?php echo esc_url(get_post_type_archive_link('pagina_info')); ?>" class="sf-breadcrumb-link">
                <?php echo solaris_icon('arrow-left', 16); ?> Tutte le info
            </a>
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

    <?php if (!empty($punti)): ?>
    <section class="sf-section sf-section--dark">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title">Punti chiave</h2>
            <div class="sf-grid sf-grid--2">
                <?php foreach ($punti as $i => $p): ?>
                    <div class="sf-feature-card" data-aos="fade-up" data-aos-delay="<?php echo $i * 60; ?>">
                        <span class="sf-feature-card__icon sf-feature-card__icon--gold"><?php echo solaris_icon('check', 20); ?></span>
                        <span class="sf-feature-card__text"><?php echo esc_html($p); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <?php get_template_part('template-parts/cta-section'); ?>
</main>

<?php get_footer();
