<?php
/**
 * Template Name: Homepage
 * The front page template
 */
get_header();

$defaults = solaris_defaults();
$hero_title = solaris_get_field('hero_title') ?: solaris_option('hero_title', $defaults['hero_title']);
$hero_subtitle = solaris_get_field('hero_subtitle') ?: solaris_option('hero_subtitle', $defaults['hero_subtitle']);
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
    'name' => solaris_option('company_name', 'Solaris Films'),
    'url' => home_url('/'),
    'description' => solaris_option('company_subtitle', 'Distributore esclusivo MADICO USA per l\'Italia.'),
    'foundingDate' => '1985',
    'areaServed' => array('@type' => 'Country', 'name' => 'Italy'),
    'telephone' => solaris_option('phone', '+390287168098'),
    'email' => solaris_option('email', 'info@solarisfilms.it'),
));

get_footer();
