<?php
/**
 * Template Part: Testimonials
 */
$testimonials = array(
    array('nome' => 'Marco R.', 'ruolo' => 'Direttore Tecnico, Studio Architettura', 'testo' => 'Professionalita impeccabile. Le pellicole MADICO hanno risolto completamente il problema del surriscaldamento nel nostro ufficio.', 'stelle' => 5),
    array('nome' => 'Laura B.', 'ruolo' => 'Responsabile Facility, Hotel 5 Stelle', 'testo' => 'Investimento ripagato in meno di 2 anni grazie al risparmio energetico. Consiglio Solaris Films senza riserve.', 'stelle' => 5),
    array('nome' => 'Giuseppe M.', 'ruolo' => 'Titolare, Showroom Auto', 'testo' => 'Le pellicole di sicurezza SafetyShield ci hanno dato la tranquillita che cercavamo. Installazione rapida e pulita.', 'stelle' => 5),
);

if (is_front_page() && function_exists('get_field')) {
    $custom = get_field('testimonianze');
    if ($custom) $testimonials = $custom;
}
?>
<section class="sf-section sf-section--light">
    <div class="sf-container">
        <h2 class="sf-section-title sf-section-title--dark" data-aos="fade-up">Cosa Dicono i <span class="sf-text-gold">Nostri Clienti</span></h2>
        <div class="sf-grid sf-grid--3">
            <?php foreach ($testimonials as $i => $t): ?>
                <div class="sf-testimonial-card" data-aos="fade-up" data-aos-delay="<?php echo $i * 100; ?>">
                    <div class="sf-testimonial-card__stars">
                        <?php for ($s = 0; $s < ($t['stelle'] ?? 5); $s++): ?>
                            <span class="sf-star">&#9733;</span>
                        <?php endfor; ?>
                    </div>
                    <p class="sf-testimonial-card__text"><?php echo esc_html($t['testo']); ?></p>
                    <div class="sf-testimonial-card__author">
                        <strong><?php echo esc_html($t['nome']); ?></strong>
                        <span><?php echo esc_html($t['ruolo']); ?></span>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
