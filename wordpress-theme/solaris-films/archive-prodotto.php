<?php
/**
 * Product Archive — Catalogo Prodotti
 */
get_header();

$categorie = array('Antisolari', 'Sicurezza', 'Privacy');
$cat_desc = array(
    'Antisolari' => 'Pellicole antisolari per il controllo della radiazione solare, risparmio energetico e protezione UV.',
    'Sicurezza'  => 'Pellicole di sicurezza certificate per protezione anti-sfondamento, anti-esplosione e conformita normativa.',
    'Privacy'    => 'Pellicole privacy e decorative per personalizzare e proteggere le superfici vetrate.',
);
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container">
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up">Catalogo <span class="sf-text-gold">Prodotti</span></h1>
            <p class="sf-page-subtitle">Tutte le pellicole per vetri MADICO distribuite in esclusiva da Solaris Films. Schede tecniche dettagliate per ogni prodotto.</p>
        </div>
    </section>

    <?php foreach ($categorie as $i => $cat):
        $is_light = ($i % 2 === 0);
        $products = new WP_Query(array(
            'post_type'      => 'prodotto',
            'posts_per_page' => -1,
            'meta_key'       => 'categoria',
            'meta_value'     => $cat,
            'orderby'        => 'menu_order title',
            'order'          => 'ASC',
        ));

        if (!$products->have_posts()) continue;

        // Group by sottocategoria
        $grouped = array();
        while ($products->have_posts()): $products->the_post();
            $sub = solaris_get_field('sottocategoria') ?: 'Generale';
            if (!isset($grouped[$sub])) $grouped[$sub] = array();
            $grouped[$sub][] = array(
                'title' => get_the_title(),
                'url'   => get_permalink(),
                'desc'  => get_the_excerpt(),
                'app'   => solaris_get_field('applicazione'),
                'en_resp' => solaris_get_field('energia_respinta'),
            );
        endwhile;
        wp_reset_postdata();
    ?>
    <section class="sf-section <?php echo $is_light ? 'sf-section--light' : 'sf-section--dark'; ?>">
        <div class="sf-container">
            <h2 class="sf-section-title <?php echo $is_light ? 'sf-section-title--dark' : ''; ?>">
                Pellicole <?php echo esc_html($cat); ?>
            </h2>
            <p class="<?php echo $is_light ? 'sf-muted-text--dark' : 'sf-muted-text'; ?> sf-mb-lg">
                <?php echo esc_html($cat_desc[$cat] ?? ''); ?>
            </p>

            <?php foreach ($grouped as $sub => $items): ?>
                <h3 class="sf-subsection-title <?php echo $is_light ? 'sf-subsection-title--dark' : 'sf-subsection-title--gold'; ?>">
                    <?php echo esc_html($sub); ?>
                </h3>
                <div class="sf-grid sf-grid--3 sf-mb-lg">
                    <?php foreach ($items as $j => $item): ?>
                        <a href="<?php echo esc_url($item['url']); ?>"
                           class="sf-product-card <?php echo $is_light ? 'sf-product-card--light' : 'sf-product-card--dark'; ?>"
                           data-aos="fade-up" data-aos-delay="<?php echo $j * 50; ?>">
                            <h4 class="sf-product-card__title"><?php echo esc_html($item['title']); ?></h4>
                            <p class="sf-product-card__desc"><?php echo esc_html(wp_trim_words($item['desc'], 20)); ?></p>
                            <div class="sf-product-card__tags">
                                <?php if ($item['app']): ?>
                                    <span class="sf-tag sf-tag--sm sf-tag--blue"><?php echo esc_html($item['app']); ?></span>
                                <?php endif; ?>
                                <?php if ($item['en_resp']): ?>
                                    <span class="sf-tag sf-tag--sm sf-tag--gold">Energia respinta: <?php echo esc_html($item['en_resp']); ?>%</span>
                                <?php endif; ?>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </section>
    <?php endforeach; ?>

    <!-- CTA -->
    <section class="sf-section sf-section--dark sf-text-center">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title">Non sai quale pellicola scegliere?</h2>
            <p class="sf-muted-text sf-mb-md">I nostri tecnici specializzati ti aiuteranno a trovare la soluzione perfetta.</p>
            <a href="<?php echo esc_url(home_url('/preventivo/')); ?>" class="sf-btn sf-btn--yellow sf-btn--lg">
                Richiedi un Preventivo Gratuito <?php echo solaris_icon('arrow-right', 18); ?>
            </a>
        </div>
    </section>
</main>

<?php get_footer();
