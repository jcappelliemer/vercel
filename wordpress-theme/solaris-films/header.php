<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class('bg-dark text-white'); ?>>
<?php wp_body_open(); ?>

<header class="sf-header" id="site-header">
    <div class="sf-header__inner">
        <!-- Logo -->
        <a href="<?php echo esc_url(home_url('/')); ?>" class="sf-header__logo">
            <div class="sf-header__logo-icon">SF</div>
            <span class="sf-header__logo-text">
                <span class="sf-header__logo-solaris">SOLARIS</span><span class="sf-header__logo-films">FILMS</span>
            </span>
        </a>

        <!-- Desktop Nav -->
        <nav class="sf-header__nav" id="main-nav">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'sf-header__menu',
                'items_wrap'     => '<ul class="%2$s">%3$s</ul>',
                'fallback_cb'    => 'solaris_fallback_menu',
            ));
            ?>
        </nav>

        <!-- CTA Buttons -->
        <div class="sf-header__cta">
            <a href="tel:+390200000000" class="sf-header__cta-icon sf-header__cta-icon--phone" title="Chiama ora">
                <?php echo solaris_icon('phone', 18); ?>
            </a>
            <a href="https://wa.me/39XXXXXXXXXX" target="_blank" class="sf-header__cta-icon sf-header__cta-icon--whatsapp" title="WhatsApp">
                <?php echo solaris_icon('whatsapp', 18); ?>
            </a>
            <a href="<?php echo esc_url(home_url('/preventivo/')); ?>" class="sf-btn sf-btn--yellow">
                PREVENTIVO
            </a>
        </div>

        <!-- Mobile Toggle -->
        <button class="sf-header__toggle" id="menu-toggle" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </div>

    <!-- Mobile Menu -->
    <div class="sf-header__mobile" id="mobile-menu">
        <?php
        wp_nav_menu(array(
            'theme_location' => 'primary',
            'container'      => false,
            'menu_class'     => 'sf-header__mobile-menu',
        ));
        ?>
        <div class="sf-header__mobile-cta">
            <a href="tel:+390200000000" class="sf-btn sf-btn--outline">Chiama Ora</a>
            <a href="<?php echo esc_url(home_url('/preventivo/')); ?>" class="sf-btn sf-btn--yellow">Preventivo Gratuito</a>
        </div>
    </div>
</header>
