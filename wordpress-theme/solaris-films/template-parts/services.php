<?php
/**
 * Template Part: Services
 */
$services = array(
    array('icon' => 'sun', 'title' => 'Pellicole Antisolari', 'desc' => 'Riducono fino al 94% del calore solare mantenendo la luminosita. Risparmio energetico certificato.', 'link' => '/prodotti/?cat=Antisolari'),
    array('icon' => 'shield', 'title' => 'Pellicole di Sicurezza', 'desc' => 'Protezione anti-sfondamento e anti-infortunio certificate EN 12600. Conformi al D.Lgs. 81/2008.', 'link' => '/prodotti/?cat=Sicurezza'),
    array('icon' => 'eye', 'title' => 'Pellicole Privacy', 'desc' => 'Proteggono la privacy preservando la luminosita. Effetto vetro smerigliato professionale.', 'link' => '/prodotti/?cat=Privacy'),
    array('icon' => 'certificate', 'title' => 'SafetyShield Anti-Esplosione', 'desc' => 'Protezione anti-esplosione e anti-intrusione certificata GSA e EN 13123.', 'link' => '/prodotti/'),
);
?>
<section class="sf-section sf-section--light">
    <div class="sf-container">
        <h2 class="sf-section-title sf-section-title--dark" data-aos="fade-up">I Nostri <span class="sf-text-gold">Servizi</span></h2>
        <div class="sf-grid sf-grid--4">
            <?php foreach ($services as $i => $s): ?>
                <a href="<?php echo esc_url(home_url($s['link'])); ?>" class="sf-service-card" data-aos="fade-up" data-aos-delay="<?php echo $i * 100; ?>">
                    <div class="sf-service-card__icon"><?php echo solaris_icon($s['icon'], 28); ?></div>
                    <h3 class="sf-service-card__title"><?php echo esc_html($s['title']); ?></h3>
                    <p class="sf-service-card__desc"><?php echo esc_html($s['desc']); ?></p>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>
