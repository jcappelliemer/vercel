<?php
/**
 * Template Name: Pagina Contatti
 */
get_header();
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container sf-container--narrow">
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up">Contattaci</h1>
            <p class="sf-page-subtitle">Richiedi informazioni sulle pellicole per vetri MADICO. Rispondiamo entro 24 ore.</p>
        </div>
    </section>

    <section class="sf-section sf-section--light">
        <div class="sf-container">
            <div class="sf-grid sf-grid--2" style="gap:3rem;align-items:start;">
                <!-- Contact Info -->
                <div data-aos="fade-up">
                    <h2 class="sf-subsection-title sf-subsection-title--dark">Informazioni di contatto</h2>
                    <div class="sf-contact-list">
                        <div class="sf-contact-item">
                            <div class="sf-contact-icon sf-contact-icon--phone"><?php echo solaris_icon('phone', 20); ?></div>
                            <div>
                                <p class="sf-contact-label">Telefono</p>
                                <a href="tel:<?php echo esc_attr(solaris_option('phone', '+390287168098')); ?>" class="sf-contact-value"><?php echo esc_html(solaris_option('phone_display', '+39 02 8716 8098')); ?></a>
                            </div>
                        </div>
                        <div class="sf-contact-item">
                            <div class="sf-contact-icon sf-contact-icon--whatsapp"><?php echo solaris_icon('whatsapp', 20); ?></div>
                            <div>
                                <p class="sf-contact-label">WhatsApp</p>
                                <a href="https://wa.me/<?php echo esc_attr(solaris_option('whatsapp', '390287168098')); ?>" class="sf-contact-value">Scrivici su WhatsApp</a>
                            </div>
                        </div>
                        <div class="sf-contact-item">
                            <div class="sf-contact-icon sf-contact-icon--email"><span style="font-weight:700;">@</span></div>
                            <div>
                                <p class="sf-contact-label">Email</p>
                                <a href="mailto:<?php echo esc_attr(solaris_option('email', 'info@solarisfilms.it')); ?>" class="sf-contact-value"><?php echo esc_html(solaris_option('email', 'info@solarisfilms.it')); ?></a>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Contact Form -->
                <div data-aos="fade-up" data-aos-delay="100">
                    <form id="solaris-contact-form" class="sf-form">
                        <div class="sf-form__group">
                            <label class="sf-form__label">Nome *</label>
                            <input type="text" name="name" class="sf-form__input" required>
                        </div>
                        <div class="sf-form__group">
                            <label class="sf-form__label">Email *</label>
                            <input type="email" name="email" class="sf-form__input" required>
                        </div>
                        <div class="sf-form__group">
                            <label class="sf-form__label">Telefono</label>
                            <input type="tel" name="phone" class="sf-form__input">
                        </div>
                        <div class="sf-form__group">
                            <label class="sf-form__label">Messaggio *</label>
                            <textarea name="message" class="sf-form__textarea" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="sf-btn sf-btn--yellow sf-btn--lg sf-btn--full">
                            Invia Messaggio <?php echo solaris_icon('arrow-right', 18); ?>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>

<?php get_footer();
