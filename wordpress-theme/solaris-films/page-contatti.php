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
            <div class="sf-grid sf-grid--2" style="gap:3rem;">
                <!-- Contact Info -->
                <div data-aos="fade-up">
                    <h2 class="sf-section-title sf-section-title--dark" style="font-size:1.5rem;">Informazioni di contatto</h2>
                    <div style="display:flex;flex-direction:column;gap:1.5rem;">
                        <div style="display:flex;align-items:center;gap:1rem;">
                            <div style="width:3rem;height:3rem;border-radius:50%;background:rgba(234,179,8,0.1);display:flex;align-items:center;justify-content:center;color:var(--sf-gold);">
                                <?php echo solaris_icon('phone', 20); ?>
                            </div>
                            <div>
                                <p style="font-size:0.75rem;color:var(--sf-text-dark-muted);margin-bottom:0.25rem;">Telefono</p>
                                <a href="tel:+390200000000" style="font-weight:600;color:var(--sf-text-dark);">+39 02 000 0000</a>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:1rem;">
                            <div style="width:3rem;height:3rem;border-radius:50%;background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;color:var(--sf-green);">
                                <?php echo solaris_icon('whatsapp', 20); ?>
                            </div>
                            <div>
                                <p style="font-size:0.75rem;color:var(--sf-text-dark-muted);margin-bottom:0.25rem;">WhatsApp</p>
                                <a href="https://wa.me/39XXXXXXXXXX" style="font-weight:600;color:var(--sf-text-dark);">Scrivici su WhatsApp</a>
                            </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:1rem;">
                            <div style="width:3rem;height:3rem;border-radius:50%;background:rgba(37,99,235,0.1);display:flex;align-items:center;justify-content:center;color:var(--sf-blue);">
                                <span style="font-weight:700;">@</span>
                            </div>
                            <div>
                                <p style="font-size:0.75rem;color:var(--sf-text-dark-muted);margin-bottom:0.25rem;">Email</p>
                                <a href="mailto:info@solarisfilms.it" style="font-weight:600;color:var(--sf-text-dark);">info@solarisfilms.it</a>
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
                        <button type="submit" class="sf-btn sf-btn--yellow sf-btn--lg" style="width:100%;justify-content:center;">
                            Invia Messaggio <?php echo solaris_icon('arrow-right', 18); ?>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>

<style>
.sf-form__group { margin-bottom: 1.25rem; }
.sf-form__label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--sf-text-dark); margin-bottom: 0.5rem; }
.sf-form__input, .sf-form__textarea, .sf-form__select { width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--sf-light-border); border-radius: var(--sf-radius-sm); font-size: 0.875rem; font-family: inherit; transition: var(--sf-transition); background: white; color: var(--sf-text-dark); }
.sf-form__input:focus, .sf-form__textarea:focus, .sf-form__select:focus { outline: none; border-color: var(--sf-gold); box-shadow: 0 0 0 3px rgba(234,179,8,0.15); }
.sf-form__textarea { resize: vertical; }
.sf-form-success { text-align: center; padding: 2rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: var(--sf-radius); color: #16A34A; font-weight: 500; }
</style>

<?php get_footer();
