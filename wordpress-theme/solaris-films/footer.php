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
                <p class="sf-footer__desc"><?php echo esc_html(solaris_option('footer_text', 'Distributore esclusivo MADICO USA per l\'Italia. 40 anni di esperienza, oltre 45.000 edifici trattati.')); ?></p>
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
                        <a href="tel:<?php echo esc_attr(solaris_option('phone', '+390287168098')); ?>"><?php echo esc_html(solaris_option('phone_display', '+39 02 8716 8098')); ?></a>
                    </li>
                    <li>
                        <span class="sf-footer__icon"><?php echo solaris_icon('whatsapp', 16); ?></span>
                        <a href="https://wa.me/<?php echo esc_attr(solaris_option('whatsapp', '390287168098')); ?>">WhatsApp</a>
                    </li>
                    <li>
                        <span class="sf-footer__icon sf-footer__icon--mail">@</span>
                        <a href="mailto:<?php echo esc_attr(solaris_option('email', 'info@solarisfilms.it')); ?>"><?php echo esc_html(solaris_option('email', 'info@solarisfilms.it')); ?></a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="sf-footer__bottom">
            <?php
            $social_links = array();
            if (solaris_option('facebook')) $social_links[] = '<a href="' . esc_url(solaris_option('facebook')) . '" target="_blank" rel="noopener" class="sf-footer__social-link">Facebook</a>';
            if (solaris_option('instagram')) $social_links[] = '<a href="' . esc_url(solaris_option('instagram')) . '" target="_blank" rel="noopener" class="sf-footer__social-link">Instagram</a>';
            if (solaris_option('linkedin')) $social_links[] = '<a href="' . esc_url(solaris_option('linkedin')) . '" target="_blank" rel="noopener" class="sf-footer__social-link">LinkedIn</a>';
            if (solaris_option('youtube')) $social_links[] = '<a href="' . esc_url(solaris_option('youtube')) . '" target="_blank" rel="noopener" class="sf-footer__social-link">YouTube</a>';
            if (!empty($social_links)):
            ?>
            <div class="sf-footer__social"><?php echo implode('', $social_links); ?></div>
            <?php endif; ?>
            <p>&copy; <?php echo date('Y'); ?> <?php echo esc_html(solaris_option('company_name', 'Solaris Films')); ?> S.r.l. — Tutti i diritti riservati. P.IVA <?php echo esc_html(solaris_option('piva', '00000000000')); ?></p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
