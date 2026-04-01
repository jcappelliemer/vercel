<?php
/**
 * Template Part: CTA Section
 */
?>
<section class="sf-section sf-section--dark sf-text-center sf-cta-section">
    <div class="sf-container sf-container--narrow">
        <h2 class="sf-section-title" data-aos="fade-up">Proteggi i tuoi <span class="sf-text-gold">vetri oggi</span></h2>
        <p class="sf-muted-text sf-mb-md" data-aos="fade-up" data-aos-delay="100">Richiedi un sopralluogo e preventivo gratuiti. I nostri tecnici ti consiglieranno la soluzione migliore per le tue esigenze.</p>
        <div class="sf-btn-group sf-btn-group--center" data-aos="fade-up" data-aos-delay="200">
            <a href="<?php echo esc_url(home_url('/preventivo/')); ?>" class="sf-btn sf-btn--yellow sf-btn--lg">
                Preventivo Gratuito <?php echo solaris_icon('arrow-right', 18); ?>
            </a>
            <a href="tel:<?php echo esc_attr(solaris_option('phone', '+390287168098')); ?>" class="sf-btn sf-btn--outline sf-btn--lg">
                <?php echo solaris_icon('phone', 18); ?> Chiama Ora
            </a>
        </div>
    </div>
</section>
