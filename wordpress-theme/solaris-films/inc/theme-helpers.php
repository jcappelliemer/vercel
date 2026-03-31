<?php
/**
 * Theme Helper Functions
 */

/**
 * Get ACF field with fallback for non-ACF installations
 */
function solaris_get_field($field_name, $post_id = false) {
    if (function_exists('get_field')) {
        return get_field($field_name, $post_id);
    }
    if (!$post_id) $post_id = get_the_ID();
    return get_post_meta($post_id, $field_name, true);
}

/**
 * Get caratteristiche as array
 */
function solaris_get_caratteristiche($post_id = false) {
    if (function_exists('get_field')) {
        $rows = get_field('caratteristiche', $post_id);
        if ($rows) return array_column($rows, 'testo');
    }
    $raw = get_post_meta($post_id ?: get_the_ID(), 'caratteristiche', true);
    if (is_string($raw)) return array_filter(explode("\n", $raw));
    return array();
}

/**
 * Render energy bar component
 */
function solaris_energy_bar($label, $value, $color = '#EAB308') {
    $num = intval(str_replace('%', '', $value));
    ?>
    <div class="sf-energy-bar">
        <span class="sf-energy-bar__label"><?php echo esc_html($label); ?></span>
        <div class="sf-energy-bar__track">
            <div class="sf-energy-bar__fill" style="width:<?php echo esc_attr($num); ?>%;background:<?php echo esc_attr($color); ?>;" data-aos="slide-right"></div>
        </div>
        <span class="sf-energy-bar__value"><?php echo esc_html($value); ?></span>
    </div>
    <?php
}

/**
 * Render spec card component
 */
function solaris_spec_card($icon, $label, $value) {
    ?>
    <div class="sf-spec-card" data-aos="fade-up">
        <div class="sf-spec-card__icon"><?php echo $icon; ?></div>
        <p class="sf-spec-card__label"><?php echo esc_html($label); ?></p>
        <p class="sf-spec-card__value"><?php echo esc_html($value); ?></p>
    </div>
    <?php
}

/**
 * Render JSON-LD script tag (when Yoast is NOT active)
 */
function solaris_render_jsonld($data) {
    if (solaris_is_yoast_active()) return; // Yoast handles schema
    printf('<script type="application/ld+json">%s</script>', wp_json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

/**
 * Check if Yoast is active
 */
function solaris_is_yoast_active() {
    return defined('WPSEO_VERSION');
}

/**
 * SVG Icons
 */
function solaris_icon($name, $size = 24) {
    $icons = array(
        'check' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>',
        'shield' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,26.07,47.07,26.37a8,8,0,0,0,4,0c1-.3,24-7.51,47.07-26.37C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Z"/></svg>',
        'sun' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Z"/></svg>',
        'eye' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,123.97,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"/></svg>',
        'drop' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75Z"/></svg>',
        'arrow-right' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69l-58.35-58.34a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>',
        'arrow-left' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>',
        'phone' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/></svg>',
        'whatsapp' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Z"/></svg>',
        'map-pin' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"/></svg>',
        'certificate' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M128,136a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h48A8,8,0,0,1,128,136Zm-8-40H72a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm112,60.69V224a8,8,0,0,1-12,6.94L192,213.39l-28,17.55A8,8,0,0,1,152,224V207.25A95.54,95.54,0,0,1,128,208,96,96,0,1,1,224,112,95.54,95.54,0,0,1,223.75,119.25,39.77,39.77,0,0,1,232,144Z"/></svg>',
        'tag' => '<svg width="' . $size . '" height="' . $size . '" viewBox="0 0 256 256" fill="currentColor"><path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM83,104A20,20,0,1,1,96,83,20,20,0,0,1,83,104Z"/></svg>',
    );
    return $icons[$name] ?? '';
}
