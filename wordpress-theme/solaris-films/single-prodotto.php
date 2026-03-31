<?php
/**
 * Single Product Template
 */
get_header();

$categoria = solaris_get_field('categoria');
$sottocategoria = solaris_get_field('sottocategoria');
$applicazione = solaris_get_field('applicazione');
$certificazione = solaris_get_field('certificazione');
$garanzia = solaris_get_field('garanzia');
$tipo_vetro = solaris_get_field('tipo_vetro');
$specifiche = solaris_get_field('specifiche_tecniche');
$caratteristiche = solaris_get_caratteristiche();

// Dati tecnici
$en_tr = solaris_get_field('energia_trasmessa');
$en_ri = solaris_get_field('energia_riflessa');
$en_as = solaris_get_field('energia_assorbita');
$vlt = solaris_get_field('vlt');
$vlr_e = solaris_get_field('vlr_esterno');
$vlr_i = solaris_get_field('vlr_interno');
$abbaglio = solaris_get_field('riduzione_abbaglio');
$ir = solaris_get_field('ir_respinti');
$uv = solaris_get_field('uv_trasmessi');
$en_resp = solaris_get_field('energia_respinta');
$has_specs = !empty($en_tr);

$focus = solaris_get_field('focus_tecnico_collegato');
?>

<main class="sf-main">
    <!-- Hero -->
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container sf-container--narrow">
            <a href="<?php echo esc_url(get_post_type_archive_link('prodotto')); ?>" class="sf-breadcrumb-link">
                <?php echo solaris_icon('arrow-left', 16); ?>
                Tutti i prodotti
            </a>
            <div class="sf-product__meta">
                <?php if ($categoria): ?>
                    <span class="sf-tag sf-tag--gold"><?php echo esc_html($categoria); ?></span>
                <?php endif; ?>
                <?php if ($sottocategoria): ?>
                    <span class="sf-product__dot"></span>
                    <span class="sf-tag sf-tag--muted"><?php echo esc_html($sottocategoria); ?></span>
                <?php endif; ?>
            </div>
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up"><?php the_title(); ?></h1>
            <div class="sf-product__badges">
                <?php if ($applicazione): ?>
                    <span class="sf-badge sf-badge--blue">
                        <?php echo solaris_icon('tag', 14); ?>
                        Applicazione: <?php echo esc_html($applicazione); ?>
                    </span>
                <?php endif; ?>
                <?php if ($certificazione): ?>
                    <span class="sf-badge sf-badge--gold">
                        <?php echo solaris_icon('certificate', 14); ?>
                        <?php echo esc_html($certificazione); ?>
                    </span>
                <?php endif; ?>
                <?php if ($garanzia): ?>
                    <span class="sf-badge sf-badge--green">
                        <?php echo solaris_icon('shield', 14); ?>
                        Garanzia <?php echo esc_html($garanzia); ?>
                    </span>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- Description -->
    <section class="sf-section sf-section--dark">
        <div class="sf-container sf-container--narrow">
            <div class="sf-product__description" data-aos="fade-up">
                <?php the_content(); ?>
            </div>
            <?php if ($specifiche): ?>
                <p class="sf-product__specs-text"><?php echo esc_html($specifiche); ?></p>
            <?php endif; ?>
        </div>
    </section>

    <!-- Caratteristiche -->
    <?php if (!empty($caratteristiche)): ?>
    <section class="sf-section sf-section--light">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title sf-section-title--dark">Caratteristiche distintive</h2>
            <div class="sf-grid sf-grid--2">
                <?php foreach ($caratteristiche as $i => $char): ?>
                    <div class="sf-feature-card sf-feature-card--light" data-aos="fade-up" data-aos-delay="<?php echo $i * 60; ?>">
                        <span class="sf-feature-card__icon sf-feature-card__icon--gold"><?php echo solaris_icon('check', 20); ?></span>
                        <span class="sf-feature-card__text"><?php echo esc_html($char); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Dati Tecnici -->
    <?php if ($has_specs): ?>
    <section class="sf-section sf-section--dark">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title">Dati tecnici</h2>
            <?php if ($tipo_vetro): ?>
                <p class="sf-muted-text">Testato su: <?php echo esc_html($tipo_vetro); ?></p>
            <?php endif; ?>

            <!-- Quick Stats -->
            <div class="sf-grid sf-grid--4 sf-mb-lg">
                <?php if ($vlt): solaris_spec_card(solaris_icon('eye', 24), 'VLT', $vlt . '%'); endif; ?>
                <?php if ($ir): solaris_spec_card(solaris_icon('sun', 24), 'IR Respinti', $ir . '%'); endif; ?>
                <?php if ($uv): solaris_spec_card(solaris_icon('drop', 24), 'UV Trasmessi', $uv . '%'); endif; ?>
                <?php if ($en_resp): solaris_spec_card(solaris_icon('shield', 24), 'Energia Respinta', $en_resp . '%'); endif; ?>
            </div>

            <!-- Energia Solare -->
            <div class="sf-card sf-card--glass sf-mb-md">
                <h3 class="sf-card__label">Energia Solare Totale</h3>
                <?php if ($en_tr): solaris_energy_bar('Trasmessa', $en_tr . '%', '#EF4444'); endif; ?>
                <?php if ($en_ri): solaris_energy_bar('Riflessa', $en_ri . '%', '#3B82F6'); endif; ?>
                <?php if ($en_as): solaris_energy_bar('Assorbita', $en_as . '%', '#8B5CF6'); endif; ?>
            </div>

            <!-- Luce Visibile -->
            <div class="sf-card sf-card--glass sf-mb-md">
                <h3 class="sf-card__label">Luce Visibile</h3>
                <?php if ($vlt): solaris_energy_bar('Trasmessa', $vlt . '%', '#FACC15'); endif; ?>
                <?php if ($vlr_e): solaris_energy_bar('Riflessa - Esterno', $vlr_e . '%', '#3B82F6'); endif; ?>
                <?php if ($vlr_i): solaris_energy_bar('Riflessa - Interno', $vlr_i . '%', '#6366F1'); endif; ?>
                <?php if ($abbaglio): solaris_energy_bar('Riduzione Abbaglio', $abbaglio . '%', '#10B981'); endif; ?>
            </div>

            <!-- Energia Respinta Total -->
            <?php if ($en_resp): ?>
            <div class="sf-highlight-box" data-aos="zoom-in">
                <p class="sf-highlight-box__label">Totale Energia Respinta</p>
                <p class="sf-highlight-box__value"><?php echo esc_html($en_resp); ?>%</p>
            </div>
            <?php endif; ?>
        </div>
    </section>
    <?php endif; ?>

    <!-- Focus Tecnico Link -->
    <?php if ($focus): ?>
    <section class="sf-section sf-section--dark sf-section--border-t">
        <div class="sf-container sf-container--narrow sf-flex-between">
            <p class="sf-muted-text">Approfondisci le caratteristiche tecniche di questa tipologia</p>
            <a href="<?php echo esc_url(get_permalink($focus)); ?>" class="sf-btn sf-btn--outline sf-btn--sm">
                Vai al focus tecnico <?php echo solaris_icon('arrow-right', 16); ?>
            </a>
        </div>
    </section>
    <?php endif; ?>

    <!-- CTA -->
    <section class="sf-section sf-section--light sf-text-center">
        <div class="sf-container sf-container--narrow">
            <h2 class="sf-section-title sf-section-title--dark">Interessato a questo prodotto?</h2>
            <p class="sf-muted-text--dark">Richiedi un preventivo gratuito e senza impegno. I nostri tecnici ti consiglieranno la soluzione migliore.</p>
            <div class="sf-btn-group sf-btn-group--center">
                <a href="<?php echo esc_url(home_url('/preventivo/')); ?>" class="sf-btn sf-btn--primary sf-btn--lg">
                    Richiedi Preventivo <?php echo solaris_icon('arrow-right', 18); ?>
                </a>
                <a href="<?php echo esc_url(home_url('/contatti/')); ?>" class="sf-btn sf-btn--outline-dark">
                    Contattaci
                </a>
            </div>
        </div>
    </section>
</main>

<?php
// Product JSON-LD
solaris_render_jsonld(array(
    '@context' => 'https://schema.org',
    '@type' => 'Product',
    'name' => get_the_title(),
    'description' => get_the_excerpt(),
    'url' => get_permalink(),
    'brand' => array('@type' => 'Brand', 'name' => 'MADICO'),
    'manufacturer' => array('@type' => 'Organization', 'name' => 'Madico Inc.'),
    'category' => 'Pellicole ' . $categoria,
    'additionalProperty' => array_filter(array(
        $vlt ? array('@type' => 'PropertyValue', 'name' => 'VLT', 'value' => $vlt . '%') : null,
        $ir ? array('@type' => 'PropertyValue', 'name' => 'IR Respinti', 'value' => $ir . '%') : null,
        $uv ? array('@type' => 'PropertyValue', 'name' => 'UV Trasmessi', 'value' => $uv . '%') : null,
        $en_resp ? array('@type' => 'PropertyValue', 'name' => 'Energia Respinta', 'value' => $en_resp . '%') : null,
    )),
));

get_footer();
