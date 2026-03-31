<footer class="sf-footer">
    <div class="sf-footer__inner">
        <div class="sf-footer__grid">
            <!-- Brand -->
            <div class="sf-footer__brand">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="sf-header__logo">
                    <div class="sf-header__logo-icon">SF</div>
                    <span class="sf-header__logo-text">
                        <span class="sf-header__logo-solaris">SOLARIS</span><span class="sf-header__logo-films">FILMS</span>
                    </span>
                </a>
                <p class="sf-footer__desc">Distributore esclusivo MADICO USA per l'Italia. 40 anni di esperienza, oltre 45.000 edifici trattati.</p>
            </div>
            <!-- Links -->
            <div class="sf-footer__col">
                <h4 class="sf-footer__title">Servizi</h4>
                <ul class="sf-footer__links">
                    <li><a href="<?php echo esc_url(home_url('/prodotti/')); ?>">Catalogo Prodotti</a></li>
                    <li><a href="<?php echo esc_url(home_url('/servizi/')); ?>">I Nostri Servizi</a></li>
                    <li><a href="<?php echo esc_url(home_url('/guida-tecnica/')); ?>">Guida Tecnica</a></li>
                    <li><a href="<?php echo esc_url(home_url('/preventivo/')); ?>">Richiedi Preventivo</a></li>
                </ul>
            </div>
            <div class="sf-footer__col">
                <h4 class="sf-footer__title">Azienda</h4>
                <ul class="sf-footer__links">
                    <li><a href="<?php echo esc_url(home_url('/chi-siamo/')); ?>">Chi Siamo</a></li>
                    <li><a href="<?php echo esc_url(home_url('/profilo-solaris/')); ?>">Profilo Aziendale</a></li>
                    <li><a href="<?php echo esc_url(home_url('/contatti/')); ?>">Contatti</a></li>
                    <li><a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="sf-footer__col">
                <h4 class="sf-footer__title">Contatti</h4>
                <ul class="sf-footer__links sf-footer__links--contact">
                    <li>
                        <span class="sf-footer__icon"><?php echo solaris_icon('phone', 16); ?></span>
                        <a href="tel:+390200000000">+39 02 000 0000</a>
                    </li>
                    <li>
                        <span class="sf-footer__icon"><?php echo solaris_icon('whatsapp', 16); ?></span>
                        <a href="https://wa.me/39XXXXXXXXXX">WhatsApp</a>
                    </li>
                    <li>
                        <span class="sf-footer__icon sf-footer__icon--mail">@</span>
                        <a href="mailto:info@solarisfilms.it">info@solarisfilms.it</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="sf-footer__bottom">
            <p>&copy; <?php echo date('Y'); ?> Solaris Films S.r.l. — Tutti i diritti riservati. P.IVA 00000000000</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
