<?php
/**
 * Template Name: Pagina Preventivo
 */
get_header();
?>

<main class="sf-main">
    <section class="sf-section sf-section--dark sf-section--border-b">
        <div class="sf-container sf-container--narrow">
            <div class="sf-accent-bar"></div>
            <h1 class="sf-page-title" data-aos="fade-up">Richiedi un <span class="sf-text-gold">Preventivo Gratuito</span></h1>
            <p class="sf-page-subtitle">Compila il modulo e ricevi un preventivo dettagliato entro 24 ore. Sopralluogo gratuito e senza impegno.</p>
        </div>
    </section>

    <section class="sf-section sf-section--light">
        <div class="sf-container sf-container--narrow">
            <form id="solaris-quote-form" class="sf-form" data-aos="fade-up">
                <div class="sf-grid sf-grid--2" style="gap:1rem;">
                    <div class="sf-form__group">
                        <label class="sf-form__label">Nome *</label>
                        <input type="text" name="name" class="sf-form__input" required>
                    </div>
                    <div class="sf-form__group">
                        <label class="sf-form__label">Email *</label>
                        <input type="email" name="email" class="sf-form__input" required>
                    </div>
                </div>
                <div class="sf-grid sf-grid--2" style="gap:1rem;">
                    <div class="sf-form__group">
                        <label class="sf-form__label">Telefono</label>
                        <input type="tel" name="phone" class="sf-form__input">
                    </div>
                    <div class="sf-form__group">
                        <label class="sf-form__label">Tipo di Servizio</label>
                        <select name="service" class="sf-form__select">
                            <option value="">Seleziona...</option>
                            <option value="antisolari">Pellicole Antisolari</option>
                            <option value="sicurezza">Pellicole di Sicurezza</option>
                            <option value="privacy">Pellicole Privacy</option>
                            <option value="safetyshield">SafetyShield Anti-Esplosione</option>
                            <option value="vetrofanie">Vetrofanie / Decorative</option>
                            <option value="altro">Altro</option>
                        </select>
                    </div>
                </div>
                <div class="sf-form__group">
                    <label class="sf-form__label">Superficie approssimativa (mq)</label>
                    <input type="text" name="sqm" class="sf-form__input" placeholder="Es: 50">
                </div>
                <div class="sf-form__group">
                    <label class="sf-form__label">Descrivi la tua esigenza</label>
                    <textarea name="message" class="sf-form__textarea" rows="5" placeholder="Descrivici il progetto, il tipo di vetrata e le tue esigenze specifiche..."></textarea>
                </div>
                <button type="submit" class="sf-btn sf-btn--yellow sf-btn--lg" style="width:100%;justify-content:center;">
                    Richiedi Preventivo <?php echo solaris_icon('arrow-right', 18); ?>
                </button>
            </form>
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
