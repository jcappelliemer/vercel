<?php
/**
 * Template Part: FAQ
 */
$faqs = array(
    array('domanda' => 'Quanto durano le pellicole per vetri?', 'risposta' => 'Le pellicole MADICO hanno una garanzia fino a 10 anni. La durata effettiva puo superare i 20 anni con corretta manutenzione.'),
    array('domanda' => 'Le pellicole alterano la vista verso l\'esterno?', 'risposta' => 'No, le pellicole MADICO mantengono un\'eccellente trasparenza ottica. Dall\'interno la vista e praticamente inalterata.'),
    array('domanda' => 'Quanto costa installare le pellicole?', 'risposta' => 'Il costo dipende dalla tipologia di pellicola e dalla metratura. Offriamo sopralluogo e preventivo gratuiti e senza impegno.'),
    array('domanda' => 'Le pellicole sono conformi alle normative?', 'risposta' => 'Si, tutte le pellicole MADICO sono testate e certificate secondo le normative europee EN 12600, EN 356, EN 13123 e conformi al D.Lgs. 81/2008.'),
    array('domanda' => 'In quanto tempo si recupera l\'investimento?', 'risposta' => 'Mediamente l\'investimento si recupera in 2-3 anni grazie al risparmio sui costi di condizionamento estivo.'),
);

if (is_front_page() && function_exists('get_field')) {
    $custom = get_field('faq');
    if ($custom) $faqs = $custom;
}
?>
<section class="sf-section sf-section--dark">
    <div class="sf-container sf-container--narrow">
        <h2 class="sf-section-title" data-aos="fade-up">Domande <span class="sf-text-gold">Frequenti</span></h2>
        <div class="sf-faq-list">
            <?php foreach ($faqs as $i => $faq): ?>
                <div class="sf-faq-item" data-aos="fade-up" data-aos-delay="<?php echo $i * 50; ?>">
                    <button class="sf-faq-item__question" onclick="this.parentElement.classList.toggle('sf-faq-item--open')">
                        <span><?php echo esc_html($faq['domanda']); ?></span>
                        <span class="sf-faq-item__arrow">+</span>
                    </button>
                    <div class="sf-faq-item__answer">
                        <p><?php echo esc_html($faq['risposta']); ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
