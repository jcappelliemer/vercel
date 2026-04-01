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
                <div class="sf-grid sf-grid--2">
                    <div class="sf-form__group">
                        <label class="sf-form__label">Nome *</label>
                        <input type="text" name="name" class="sf-form__input" required>
                    </div>
                    <div class="sf-form__group">
                        <label class="sf-form__label">Email *</label>
                        <input type="email" name="email" class="sf-form__input" required>
                    </div>
                </div>
                <div class="sf-grid sf-grid--2">
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
                <button type="submit" class="sf-btn sf-btn--yellow sf-btn--lg sf-btn--full">
                    Richiedi Preventivo <?php echo solaris_icon('arrow-right', 18); ?>
                </button>
            </form>
        </div>
    </section>
</main>

<?php get_footer();
