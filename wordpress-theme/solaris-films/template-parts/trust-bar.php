<?php
/**
 * Template Part: Trust Bar
 */
$stats = array(
    array('numero' => '40+', 'etichetta' => 'Anni di Esperienza'),
    array('numero' => '45.000+', 'etichetta' => 'Edifici Trattati'),
    array('numero' => '100%', 'etichetta' => 'Garanzia MADICO'),
    array('numero' => '24h', 'etichetta' => 'Risposta Garantita'),
);

// Override with ACF if on homepage
if (is_front_page() && function_exists('get_field')) {
    $custom = get_field('trust_stats');
    if ($custom) $stats = $custom;
}
?>
<section class="sf-trustbar" data-aos="fade-up">
    <div class="sf-container">
        <div class="sf-trustbar__grid">
            <?php foreach ($stats as $stat): ?>
                <div class="sf-trustbar__item">
                    <span class="sf-trustbar__number"><?php echo esc_html($stat['numero']); ?></span>
                    <span class="sf-trustbar__label"><?php echo esc_html($stat['etichetta']); ?></span>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
