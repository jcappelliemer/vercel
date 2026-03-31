<?php
/**
 * Template Part: Process
 */
$steps = array(
    array('num' => '01', 'title' => 'Sopralluogo', 'desc' => 'Un nostro tecnico specializzato effettua un sopralluogo gratuito per valutare le esigenze.'),
    array('num' => '02', 'title' => 'Preventivo', 'desc' => 'Riceviamo un preventivo dettagliato e personalizzato entro 24 ore.'),
    array('num' => '03', 'title' => 'Installazione', 'desc' => 'Installatori certificati MADICO eseguono il lavoro con precisione e pulizia.'),
    array('num' => '04', 'title' => 'Garanzia', 'desc' => 'Garanzia MADICO fino a 10 anni. Assistenza post-vendita dedicata.'),
);
?>
<section class="sf-section sf-section--dark">
    <div class="sf-container">
        <h2 class="sf-section-title" data-aos="fade-up">Come <span class="sf-text-gold">Lavoriamo</span></h2>
        <div class="sf-grid sf-grid--4">
            <?php foreach ($steps as $i => $step): ?>
                <div class="sf-process-card" data-aos="fade-up" data-aos-delay="<?php echo $i * 100; ?>">
                    <span class="sf-process-card__num"><?php echo esc_html($step['num']); ?></span>
                    <h3 class="sf-process-card__title"><?php echo esc_html($step['title']); ?></h3>
                    <p class="sf-process-card__desc"><?php echo esc_html($step['desc']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
