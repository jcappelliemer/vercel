<?php
/**
 * Solaris Films — Theme Settings Page
 * Pannello impostazioni in Aspetto > Impostazioni Solaris
 */

function solaris_settings_menu() {
    add_theme_page(
        'Impostazioni Solaris',
        'Impostazioni Solaris',
        'manage_options',
        'solaris-settings',
        'solaris_settings_page'
    );
}
add_action('admin_menu', 'solaris_settings_menu');

function solaris_register_settings() {
    register_setting('solaris_settings_group', 'solaris_options', 'solaris_sanitize_options');
    register_setting('solaris_settings_group', 'solaris_vercel_webhook', 'sanitize_url');
}
add_action('admin_init', 'solaris_register_settings');

function solaris_sanitize_options($input) {
    $sanitized = array();
    $text_fields = array(
        'company_name', 'company_subtitle', 'phone', 'phone_display',
        'whatsapp', 'email', 'address', 'piva', 'hero_title', 'hero_subtitle',
        'hero_badge', 'hero_image', 'hero_cta_text', 'hero_video_url',
        'stat1_value', 'stat1_label', 'stat2_value', 'stat2_label', 'stat3_value', 'stat3_label',
        'trust1_label', 'trust1_value', 'trust2_label', 'trust2_value',
        'trust3_label', 'trust3_value', 'trust4_label', 'trust4_value',
        'cta_title', 'cta_subtitle',
        'facebook', 'instagram', 'linkedin', 'youtube',
    );
    foreach ($text_fields as $key) {
        $sanitized[$key] = sanitize_text_field($input[$key] ?? '');
    }
    $sanitized['footer_text'] = sanitize_textarea_field($input['footer_text'] ?? '');
    return $sanitized;
}

/**
 * Get a single theme option with fallback default
 */
function solaris_option($key, $default = '') {
    static $options = null;
    if ($options === null) {
        $options = get_option('solaris_options', array());
    }
    return !empty($options[$key]) ? $options[$key] : $default;
}

/**
 * Default values
 */
function solaris_defaults() {
    return array(
        'company_name'     => 'Solaris Films',
        'company_subtitle' => 'Distributore esclusivo MADICO USA per l\'Italia',
        'phone'            => '+390559107621',
        'phone_display'    => '055 9107621',
        'whatsapp'         => '3925466518',
        'email'            => 'info@solarisfilms.it',
        'address'          => 'Via G. Brodolini, 8 - Figline e Incisa Valdarno (FI)',
        'piva'             => '02223380516',
        'hero_title'       => 'Gli Specialisti delle Pellicole per Vetri',
        'hero_subtitle'    => 'Distributore esclusivo MADICO USA per l\'Italia e la Spagna. Da oltre 30 anni proteggiamo, schermiamo e rendiamo sicuri i vetri di edifici commerciali, industriali e residenziali.',
        'hero_badge'       => 'Distributore Esclusivo MADICO USA',
        'hero_image'       => '',
        'hero_cta_text'    => 'Richiedi Preventivo',
        'hero_video_url'   => '',
        'stat1_value'      => '40+',
        'stat1_label'      => 'Anni Esperienza',
        'stat2_value'      => '45k+',
        'stat2_label'      => 'Edifici Trattati',
        'stat3_value'      => '-40%',
        'stat3_label'      => 'Bolletta Energia',
        'trust1_label'     => 'ISO 9001',
        'trust1_value'     => 'Certificato',
        'trust2_label'     => 'MADICO',
        'trust2_value'     => 'Esclusivista',
        'trust3_label'     => 'UNI EN 12600',
        'trust3_value'     => 'Sicurezza',
        'trust4_label'     => 'Green',
        'trust4_value'     => 'Eco-friendly',
        'cta_title'        => 'Il futuro del tuo spazio inizia qui',
        'cta_subtitle'     => 'Preventivo gratuito. Risposta in 24 ore.',
        'footer_text'      => 'Distributore esclusivo MADICO USA per l\'Italia. 30 anni di esperienza, oltre 45.000 edifici trattati.',
        'facebook'         => '',
        'instagram'        => '',
        'linkedin'         => '',
        'youtube'          => '',
    );
}

function solaris_settings_page() {
    if (!current_user_can('manage_options')) return;

    $defaults = solaris_defaults();
    ?>
    <div class="wrap">
        <h1>Impostazioni Solaris Films</h1>
        <p>Configura i dati aziendali, contatti e testi del sito. Queste impostazioni vengono usate in tutto il tema.</p>

        <form method="post" action="options.php">
            <?php settings_fields('solaris_settings_group'); ?>

            <style>
                .solaris-settings { max-width: 800px; }
                .solaris-settings h2 { font-size: 1.3em; margin-top: 2em; padding-bottom: 0.5em; border-bottom: 1px solid #ddd; color: #D4A017; }
                .solaris-settings table { width: 100%; }
                .solaris-settings .regular-text { width: 100%; max-width: 500px; }
                .solaris-settings textarea { width: 100%; max-width: 500px; }
                .solaris-settings .description { color: #666; font-style: italic; }
            </style>

            <div class="solaris-settings">

                <h2>Dati Aziendali</h2>
                <table class="form-table">
                    <tr>
                        <th><label for="company_name">Nome Azienda</label></th>
                        <td><input type="text" id="company_name" name="solaris_options[company_name]" value="<?php echo esc_attr(solaris_option('company_name', $defaults['company_name'])); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="company_subtitle">Sottotitolo</label></th>
                        <td><input type="text" id="company_subtitle" name="solaris_options[company_subtitle]" value="<?php echo esc_attr(solaris_option('company_subtitle', $defaults['company_subtitle'])); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="address">Indirizzo / Sede</label></th>
                        <td><input type="text" id="address" name="solaris_options[address]" value="<?php echo esc_attr(solaris_option('address', $defaults['address'])); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="piva">Partita IVA</label></th>
                        <td><input type="text" id="piva" name="solaris_options[piva]" value="<?php echo esc_attr(solaris_option('piva', $defaults['piva'])); ?>" class="regular-text"></td>
                    </tr>
                </table>

                <h2>Contatti</h2>
                <table class="form-table">
                    <tr>
                        <th><label for="phone">Telefono (formato link)</label></th>
                        <td>
                            <input type="text" id="phone" name="solaris_options[phone]" value="<?php echo esc_attr(solaris_option('phone', $defaults['phone'])); ?>" class="regular-text" placeholder="+390287168098">
                            <p class="description">Formato per il link tel: (senza spazi). Es: +390287168098</p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="phone_display">Telefono (formato visibile)</label></th>
                        <td>
                            <input type="text" id="phone_display" name="solaris_options[phone_display]" value="<?php echo esc_attr(solaris_option('phone_display', $defaults['phone_display'])); ?>" class="regular-text" placeholder="+39 02 8716 8098">
                            <p class="description">Come appare sul sito. Es: +39 02 8716 8098</p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="whatsapp">WhatsApp (numero)</label></th>
                        <td>
                            <input type="text" id="whatsapp" name="solaris_options[whatsapp]" value="<?php echo esc_attr(solaris_option('whatsapp', $defaults['whatsapp'])); ?>" class="regular-text" placeholder="390287168098">
                            <p class="description">Solo numeri, senza + o spazi. Es: 390287168098</p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="email">Email</label></th>
                        <td><input type="email" id="email" name="solaris_options[email]" value="<?php echo esc_attr(solaris_option('email', $defaults['email'])); ?>" class="regular-text" placeholder="info@solarisfilms.it"></td>
                    </tr>
                </table>

                <h2>Testi Homepage</h2>
                <table class="form-table">
                    <tr>
                        <th><label for="hero_badge">Badge Hero (piccolo testo sopra il titolo)</label></th>
                        <td><input type="text" id="hero_badge" name="solaris_options[hero_badge]" value="<?php echo esc_attr(solaris_option('hero_badge', $defaults['hero_badge'])); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="hero_title">Titolo Hero</label></th>
                        <td><input type="text" id="hero_title" name="solaris_options[hero_title]" value="<?php echo esc_attr(solaris_option('hero_title', $defaults['hero_title'])); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="hero_subtitle">Sottotitolo Hero</label></th>
                        <td><textarea id="hero_subtitle" name="solaris_options[hero_subtitle]" rows="3"><?php echo esc_textarea(solaris_option('hero_subtitle', $defaults['hero_subtitle'])); ?></textarea></td>
                    </tr>
                    <tr>
                        <th><label for="hero_image">Immagine Hero (URL)</label></th>
                        <td>
                            <input type="url" id="hero_image" name="solaris_options[hero_image]" value="<?php echo esc_attr(solaris_option('hero_image', $defaults['hero_image'])); ?>" class="regular-text" placeholder="https://...">
                            <p class="description">URL dell'immagine hero. Puoi caricare un'immagine nella Libreria Media e copiare il link qui.</p>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="hero_cta_text">Testo Pulsante CTA</label></th>
                        <td><input type="text" id="hero_cta_text" name="solaris_options[hero_cta_text]" value="<?php echo esc_attr(solaris_option('hero_cta_text', $defaults['hero_cta_text'])); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="hero_video_url">URL Video (opzionale)</label></th>
                        <td><input type="url" id="hero_video_url" name="solaris_options[hero_video_url]" value="<?php echo esc_attr(solaris_option('hero_video_url', $defaults['hero_video_url'])); ?>" class="regular-text" placeholder="https://youtube.com/..."></td>
                    </tr>
                </table>

                <h2>Statistiche Hero (i 3 numeri sull'immagine)</h2>
                <table class="form-table">
                    <tr>
                        <th><label>Statistica 1</label></th>
                        <td>
                            <input type="text" name="solaris_options[stat1_value]" value="<?php echo esc_attr(solaris_option('stat1_value', $defaults['stat1_value'])); ?>" placeholder="40+" style="width:100px;"> 
                            <input type="text" name="solaris_options[stat1_label]" value="<?php echo esc_attr(solaris_option('stat1_label', $defaults['stat1_label'])); ?>" placeholder="Anni Esperienza" style="width:250px;">
                        </td>
                    </tr>
                    <tr>
                        <th><label>Statistica 2</label></th>
                        <td>
                            <input type="text" name="solaris_options[stat2_value]" value="<?php echo esc_attr(solaris_option('stat2_value', $defaults['stat2_value'])); ?>" placeholder="45k+" style="width:100px;"> 
                            <input type="text" name="solaris_options[stat2_label]" value="<?php echo esc_attr(solaris_option('stat2_label', $defaults['stat2_label'])); ?>" placeholder="Edifici Trattati" style="width:250px;">
                        </td>
                    </tr>
                    <tr>
                        <th><label>Statistica 3</label></th>
                        <td>
                            <input type="text" name="solaris_options[stat3_value]" value="<?php echo esc_attr(solaris_option('stat3_value', $defaults['stat3_value'])); ?>" placeholder="-40%" style="width:100px;"> 
                            <input type="text" name="solaris_options[stat3_label]" value="<?php echo esc_attr(solaris_option('stat3_label', $defaults['stat3_label'])); ?>" placeholder="Bolletta Energia" style="width:250px;">
                        </td>
                    </tr>
                </table>

                <h2>Barra Certificazioni (4 badge sotto l'hero)</h2>
                <table class="form-table">
                    <tr>
                        <th><label>Badge 1</label></th>
                        <td>
                            <input type="text" name="solaris_options[trust1_label]" value="<?php echo esc_attr(solaris_option('trust1_label', $defaults['trust1_label'])); ?>" placeholder="ISO 9001" style="width:150px;"> 
                            <input type="text" name="solaris_options[trust1_value]" value="<?php echo esc_attr(solaris_option('trust1_value', $defaults['trust1_value'])); ?>" placeholder="Certificato" style="width:200px;">
                        </td>
                    </tr>
                    <tr>
                        <th><label>Badge 2</label></th>
                        <td>
                            <input type="text" name="solaris_options[trust2_label]" value="<?php echo esc_attr(solaris_option('trust2_label', $defaults['trust2_label'])); ?>" placeholder="MADICO" style="width:150px;"> 
                            <input type="text" name="solaris_options[trust2_value]" value="<?php echo esc_attr(solaris_option('trust2_value', $defaults['trust2_value'])); ?>" placeholder="Esclusivista" style="width:200px;">
                        </td>
                    </tr>
                    <tr>
                        <th><label>Badge 3</label></th>
                        <td>
                            <input type="text" name="solaris_options[trust3_label]" value="<?php echo esc_attr(solaris_option('trust3_label', $defaults['trust3_label'])); ?>" placeholder="UNI EN 12600" style="width:150px;"> 
                            <input type="text" name="solaris_options[trust3_value]" value="<?php echo esc_attr(solaris_option('trust3_value', $defaults['trust3_value'])); ?>" placeholder="Sicurezza" style="width:200px;">
                        </td>
                    </tr>
                    <tr>
                        <th><label>Badge 4</label></th>
                        <td>
                            <input type="text" name="solaris_options[trust4_label]" value="<?php echo esc_attr(solaris_option('trust4_label', $defaults['trust4_label'])); ?>" placeholder="Green" style="width:150px;"> 
                            <input type="text" name="solaris_options[trust4_value]" value="<?php echo esc_attr(solaris_option('trust4_value', $defaults['trust4_value'])); ?>" placeholder="Eco-friendly" style="width:200px;">
                        </td>
                    </tr>
                </table>

                <h2>Sezione CTA Finale (fondo homepage)</h2>
                <table class="form-table">
                    <tr>
                        <th><label for="cta_title">Titolo CTA</label></th>
                        <td><input type="text" id="cta_title" name="solaris_options[cta_title]" value="<?php echo esc_attr(solaris_option('cta_title', $defaults['cta_title'])); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="cta_subtitle">Sottotitolo CTA</label></th>
                        <td><input type="text" id="cta_subtitle" name="solaris_options[cta_subtitle]" value="<?php echo esc_attr(solaris_option('cta_subtitle', $defaults['cta_subtitle'])); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label for="footer_text">Testo Footer</label></th>
                        <td><textarea id="footer_text" name="solaris_options[footer_text]" rows="3"><?php echo esc_textarea(solaris_option('footer_text', $defaults['footer_text'])); ?></textarea></td>
                    </tr>
                </table>

                <h2>Social Media</h2>
                <table class="form-table">
                    <tr>
                        <th><label for="facebook">Facebook URL</label></th>
                        <td><input type="url" id="facebook" name="solaris_options[facebook]" value="<?php echo esc_attr(solaris_option('facebook')); ?>" class="regular-text" placeholder="https://facebook.com/solarisfilms"></td>
                    </tr>
                    <tr>
                        <th><label for="instagram">Instagram URL</label></th>
                        <td><input type="url" id="instagram" name="solaris_options[instagram]" value="<?php echo esc_attr(solaris_option('instagram')); ?>" class="regular-text" placeholder="https://instagram.com/solarisfilms"></td>
                    </tr>
                    <tr>
                        <th><label for="linkedin">LinkedIn URL</label></th>
                        <td><input type="url" id="linkedin" name="solaris_options[linkedin]" value="<?php echo esc_attr(solaris_option('linkedin')); ?>" class="regular-text" placeholder="https://linkedin.com/company/solarisfilms"></td>
                    </tr>
                    <tr>
                        <th><label for="youtube">YouTube URL</label></th>
                        <td><input type="url" id="youtube" name="solaris_options[youtube]" value="<?php echo esc_attr(solaris_option('youtube')); ?>" class="regular-text" placeholder="https://youtube.com/@solarisfilms"></td>
                    </tr>
                </table>

                <h2>Vercel (Deploy Automatico)</h2>
                <table class="form-table">
                    <tr>
                        <th><label for="vercel_webhook">Deploy Hook URL</label></th>
                        <td>
                            <input type="url" id="vercel_webhook" name="solaris_vercel_webhook" value="<?php echo esc_attr(get_option('solaris_vercel_webhook', '')); ?>" class="regular-text" placeholder="https://api.vercel.com/v1/integrations/deploy/...">
                            <p class="description">Quando salvi un contenuto, il sito Vercel si ricostruisce automaticamente.</p>
                        </td>
                    </tr>
                </table>

            </div>

            <?php submit_button('Salva Impostazioni'); ?>
        </form>
    </div>
    <?php
}
