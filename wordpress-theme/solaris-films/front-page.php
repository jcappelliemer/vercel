<?php
/**
 * Template Name: Homepage
 * The front page template
 */
get_header();

$hero_title = solaris_get_field('hero_title') ?: 'Protezione Solare Professionale per i Tuoi Vetri';
$hero_subtitle = solaris_get_field('hero_subtitle') ?: 'Distributore esclusivo MADICO USA per l\'Italia. Da oltre 40 anni proteggiamo, isoliamo e rendiamo sicuri i vetri di edifici residenziali, commerciali e industriali.';
?>

<main>
    <!-- Hero Section -->
    <section class="sf-hero">
        <div class="sf-hero__inner">
            <div class="sf-hero__content" data-aos="fade-up">
                <div class="sf-accent-bar"></div>
                <h1 class="sf-hero__title"><?php echo esc_html($hero_title); ?></h1>
                <p class="sf-hero__subtitle"><?php echo esc_html($hero_subtitle); ?></p>
                <div class="sf-hero__buttons">
                    <a href="<?php echo esc_url(home_url('/preventivo/')); ?>" class="sf-btn sf-btn--yellow sf-btn--lg">
                        Richiedi Preventivo Gratuito
                        <?php echo solaris_icon('arrow-right', 18); ?>
                    </a>
                    <a href="<?php echo esc_url(home_url('/prodotti/')); ?>" class="sf-btn sf-btn--outline sf-btn--lg">
                        Scopri i Prodotti
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Trust Bar -->
    <?php get_template_part('template-parts/trust-bar'); ?>

    <!-- Services -->
    <?php get_template_part('template-parts/services'); ?>

    <!-- Process -->
    <?php get_template_part('template-parts/process'); ?>

    <!-- Gallery -->
    <?php get_template_part('template-parts/gallery'); ?>

    <!-- Testimonials -->
    <?php get_template_part('template-parts/testimonials'); ?>

    <!-- FAQ -->
    <?php get_template_part('template-parts/faq'); ?>

    <!-- CTA -->
    <?php get_template_part('template-parts/cta-section'); ?>
</main>

<?php
// JSON-LD Organization Schema
solaris_render_jsonld(array(
    '@context' => 'https://schema.org',
    '@type' => 'Organization',
    'name' => 'Solaris Films',
    'url' => home_url('/'),
    'description' => 'Distributore esclusivo MADICO USA per l\'Italia.',
    'foundingDate' => '1985',
    'areaServed' => array('@type' => 'Country', 'name' => 'Italy'),
));

get_footer();
