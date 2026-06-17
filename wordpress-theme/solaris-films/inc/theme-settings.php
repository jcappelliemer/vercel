<?php
/**
 * Solaris Films - Theme Settings Page
 * Pannello impostazioni in Aspetto > Impostazioni Solaris.
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
    $input = is_array($input) ? $input : array();
    $current = get_option('solaris_options', array());
    $sanitized = array_merge(solaris_defaults(), is_array($current) ? $current : array());

    $text_fields = array(
        'company_name', 'company_subtitle', 'phone', 'phone_display',
        'whatsapp', 'email', 'address', 'piva', 'hero_title', 'hero_subtitle',
        'hero_badge', 'hero_image', 'hero_cta_text', 'hero_video_url',
        'stat1_value', 'stat1_label', 'stat2_value', 'stat2_label', 'stat3_value', 'stat3_label',
        'trust1_label', 'trust1_value', 'trust2_label', 'trust2_value',
        'trust3_label', 'trust3_value', 'trust4_label', 'trust4_value',
        'cta_title', 'cta_subtitle',
        'facebook', 'instagram', 'linkedin', 'youtube',
        'logo_url',
    );

    foreach ($text_fields as $key) {
        if (array_key_exists($key, $input)) {
            $sanitized[$key] = sanitize_text_field($input[$key] ?? '');
        }
    }

    if (array_key_exists('footer_text', $input)) {
        $sanitized['footer_text'] = sanitize_textarea_field($input['footer_text'] ?? '');
    }

    for ($i = 1; $i <= 6; $i++) {
        $sanitized["cs{$i}_titolo"] = sanitize_text_field($input["cs{$i}_titolo"] ?? '');
        $sanitized["cs{$i}_categoria"] = sanitize_text_field($input["cs{$i}_categoria"] ?? '');
        $sanitized["cs{$i}_image"] = esc_url_raw($input["cs{$i}_image"] ?? '');
        $sanitized["cs{$i}_problema"] = sanitize_textarea_field($input["cs{$i}_problema"] ?? '');
        $sanitized["cs{$i}_soluzione"] = sanitize_textarea_field($input["cs{$i}_soluzione"] ?? '');
        $sanitized["cs{$i}_risultati"] = sanitize_textarea_field($input["cs{$i}_risultati"] ?? '');
    }

    for ($i = 1; $i <= 12; $i++) {
        $sanitized["gal{$i}_titolo"] = sanitize_text_field($input["gal{$i}_titolo"] ?? '');
        $sanitized["gal{$i}_categoria"] = sanitize_text_field($input["gal{$i}_categoria"] ?? '');
        $sanitized["gal{$i}_location"] = sanitize_text_field($input["gal{$i}_location"] ?? '');
        $sanitized["gal{$i}_image"] = esc_url_raw($input["gal{$i}_image"] ?? '');
        $sanitized["gal{$i}_descrizione"] = sanitize_textarea_field($input["gal{$i}_descrizione"] ?? '');
        $sanitized["gal{$i}_risultato"] = sanitize_text_field($input["gal{$i}_risultato"] ?? '');
    }

    if (array_key_exists('references_list', $input)) {
        $sanitized['references_list'] = sanitize_textarea_field($input['references_list'] ?? '');
    }

    for ($i = 1; $i <= 20; $i++) {
        $sanitized["ref{$i}_nome"] = sanitize_text_field($input["ref{$i}_nome"] ?? '');
        $sanitized["ref{$i}_logo"] = esc_url_raw($input["ref{$i}_logo"] ?? '');
    }

    $sanitized['stat1_value'] = '30+';
    $sanitized['stat2_value'] = '+45k';
    $sanitized['footer_text'] = 'Distributore esclusivo MADICO USA per l\'Italia. 30+ anni di esperienza, +45k edifici trattati.';

    return $sanitized;
}

function solaris_option($key, $default = '') {
    static $options = null;
    if ($options === null) {
        $options = get_option('solaris_options', array());
    }

    return !empty($options[$key]) ? $options[$key] : $default;
}

function solaris_defaults() {
    return array(
        'company_name' => 'Solaris Films',
        'company_subtitle' => 'Distributore esclusivo MADICO USA Italia e Spagna',
        'phone' => '+390559107621',
        'phone_display' => '055 9107621',
        'whatsapp' => '3926578067',
        'email' => 'info@solarisfilms.it',
        'address' => 'Via G. Brodolini, 8 - Figline e Incisa Valdarno (FI)',
        'piva' => '02223380516',
        'hero_title' => 'Gli Specialisti delle Pellicole per Vetri',
        'hero_subtitle' => 'Distributore esclusivo MADICO USA per l\'Italia e la Spagna. Da oltre 30 anni proteggiamo, schermiamo e rendiamo sicuri i vetri di edifici commerciali, industriali e residenziali.',
        'hero_badge' => 'Distributore Esclusivo MADICO USA',
        'hero_image' => '',
        'hero_cta_text' => 'Richiedi Preventivo',
        'hero_video_url' => '',
        'stat1_value' => '30+',
        'stat1_label' => 'Anni Esperienza',
        'stat2_value' => '+45k',
        'stat2_label' => 'Edifici Trattati',
        'stat3_value' => '-40%',
        'stat3_label' => 'Bolletta Energia',
        'trust1_label' => 'TUTTA ITALIA',
        'trust1_value' => 'Operativita',
        'trust2_label' => 'MADICO',
        'trust2_value' => 'Esclusivista',
        'trust3_label' => 'ISO 9001',
        'trust3_value' => 'Certificato',
        'trust4_label' => 'GREEN',
        'trust4_value' => 'Eco-friendly',
        'cta_title' => 'Il miglioramento delle tue vetrate inizia qui',
        'cta_subtitle' => 'Preventivo gratuito. Risposta in 24 ore.',
        'footer_text' => 'Distributore esclusivo MADICO USA per l\'Italia. 30+ anni di esperienza, +45k edifici trattati.',
        'facebook' => '',
        'instagram' => '',
        'linkedin' => '',
        'youtube' => '',
        'logo_url' => '',
    );
}

function solaris_settings_page() {
    if (!current_user_can('manage_options')) return;
    ?>
    <div class="wrap">
        <h1>Impostazioni Solaris Films</h1>
        <p>Gestisci solo i contenuti variabili pubblicati dal frontend: case studies, gallery, referenze e social media.</p>

        <form method="post" action="options.php">
            <?php settings_fields('solaris_settings_group'); ?>
            <input type="hidden" name="solaris_vercel_webhook" value="<?php echo esc_attr(get_option('solaris_vercel_webhook', '')); ?>">
            <input type="hidden" name="solaris_email_relay_key" value="<?php echo esc_attr(get_option('solaris_email_relay_key', '')); ?>">

            <style>
                .solaris-settings { max-width: 980px; }
                .solaris-settings h2 { font-size: 1.3em; margin-top: 2em; padding-bottom: .5em; border-bottom: 1px solid #ddd; color: #D4A017; }
                .solaris-settings table { width: 100%; }
                .solaris-settings .regular-text { width: 100%; max-width: 500px; }
                .solaris-settings textarea { width: 100%; max-width: 500px; }
                .solaris-settings .description { color: #666; font-style: italic; }
                .solaris-settings .solaris-note { background:#f6f7f7; border-left:4px solid #D4A017; padding:12px 16px; margin:16px 0 24px; }
            </style>

            <div class="solaris-settings">
                <div class="solaris-note">
                    I testi strutturali della home, i numeri aziendali, il logo, le CTA e i contatti sono gestiti dal tema e non sono modificabili da questo pannello. Il dato edifici viene mantenuto in modo coerente come <strong>+45k</strong>.
                </div>

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

                <h2>Case Studies (fino a 6)</h2>
                <p class="description">Per ogni case study compila titolo, categoria, immagine, problema, soluzione e risultati separati da virgola.</p>
                <?php for ($i = 1; $i <= 6; $i++) : ?>
                <table class="form-table" style="border-left:3px solid #D4A017;padding-left:10px;margin-bottom:20px;">
                    <tr><th colspan="2"><strong>Case Study <?php echo $i; ?></strong></th></tr>
                    <tr>
                        <th><label>Titolo</label></th>
                        <td><input type="text" name="solaris_options[cs<?php echo $i; ?>_titolo]" value="<?php echo esc_attr(solaris_option("cs{$i}_titolo")); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label>Categoria</label></th>
                        <td><input type="text" name="solaris_options[cs<?php echo $i; ?>_categoria]" value="<?php echo esc_attr(solaris_option("cs{$i}_categoria")); ?>" class="regular-text" placeholder="Es: Istituzionale, Commerciale, Educazione"></td>
                    </tr>
                    <tr>
                        <th><label>Immagine</label></th>
                        <td>
                            <input type="url" name="solaris_options[cs<?php echo $i; ?>_image]" value="<?php echo esc_attr(solaris_option("cs{$i}_image")); ?>" class="regular-text" placeholder="https://...">
                            <button type="button" class="button solaris-media-btn">Seleziona Immagine</button>
                            <a href="#" class="solaris-media-remove" style="color:#a00;margin-left:8px;text-decoration:none;">Rimuovi</a>
                            <div class="solaris-media-preview"></div>
                        </td>
                    </tr>
                    <tr>
                        <th><label>Problema</label></th>
                        <td><textarea name="solaris_options[cs<?php echo $i; ?>_problema]" rows="2"><?php echo esc_textarea(solaris_option("cs{$i}_problema")); ?></textarea></td>
                    </tr>
                    <tr>
                        <th><label>Soluzione</label></th>
                        <td><textarea name="solaris_options[cs<?php echo $i; ?>_soluzione]" rows="2"><?php echo esc_textarea(solaris_option("cs{$i}_soluzione")); ?></textarea></td>
                    </tr>
                    <tr>
                        <th><label>Risultati</label></th>
                        <td><input type="text" name="solaris_options[cs<?php echo $i; ?>_risultati]" value="<?php echo esc_attr(solaris_option("cs{$i}_risultati")); ?>" class="regular-text" placeholder="Risultato 1, Risultato 2, Risultato 3"></td>
                    </tr>
                </table>
                <?php endfor; ?>

                <h2>Gallery (fino a 12 lavori)</h2>
                <p class="description">Per ogni lavoro compila titolo, categoria, citta, immagine, descrizione e risultato.</p>
                <?php for ($i = 1; $i <= 12; $i++) : ?>
                <table class="form-table" style="border-left:3px solid #2563EB;padding-left:10px;margin-bottom:20px;">
                    <tr><th colspan="2"><strong>Lavoro <?php echo $i; ?></strong></th></tr>
                    <tr>
                        <th><label>Titolo</label></th>
                        <td><input type="text" name="solaris_options[gal<?php echo $i; ?>_titolo]" value="<?php echo esc_attr(solaris_option("gal{$i}_titolo")); ?>" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label>Categoria</label></th>
                        <td><input type="text" name="solaris_options[gal<?php echo $i; ?>_categoria]" value="<?php echo esc_attr(solaris_option("gal{$i}_categoria")); ?>" class="regular-text" placeholder="Es: Antisolari, Sicurezza, Safety Shield, Privacy"></td>
                    </tr>
                    <tr>
                        <th><label>Citta</label></th>
                        <td><input type="text" name="solaris_options[gal<?php echo $i; ?>_location]" value="<?php echo esc_attr(solaris_option("gal{$i}_location")); ?>" class="regular-text" placeholder="Es: Roma, Milano, Firenze"></td>
                    </tr>
                    <tr>
                        <th><label>Immagine</label></th>
                        <td>
                            <input type="url" name="solaris_options[gal<?php echo $i; ?>_image]" value="<?php echo esc_attr(solaris_option("gal{$i}_image")); ?>" class="regular-text" placeholder="https://...">
                            <button type="button" class="button solaris-media-btn">Seleziona Immagine</button>
                            <a href="#" class="solaris-media-remove" style="color:#a00;margin-left:8px;text-decoration:none;">Rimuovi</a>
                            <div class="solaris-media-preview"></div>
                        </td>
                    </tr>
                    <tr>
                        <th><label>Descrizione</label></th>
                        <td><textarea name="solaris_options[gal<?php echo $i; ?>_descrizione]" rows="2"><?php echo esc_textarea(solaris_option("gal{$i}_descrizione")); ?></textarea></td>
                    </tr>
                    <tr>
                        <th><label>Risultato</label></th>
                        <td><input type="text" name="solaris_options[gal<?php echo $i; ?>_risultato]" value="<?php echo esc_attr(solaris_option("gal{$i}_risultato")); ?>" class="regular-text" placeholder="Es: -7 C temperatura interna"></td>
                    </tr>
                </table>
                <?php endfor; ?>

                <h2>Referenze (fino a 20)</h2>
                <p class="description">Per ogni referenza compila il nome dell'azienda e, se disponibile, il logo.</p>
                <?php for ($i = 1; $i <= 20; $i++) : ?>
                <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;padding:8px 12px;background:<?php echo $i % 2 ? '#f9f9f9' : '#fff'; ?>;border-radius:6px;">
                    <span style="color:#999;font-size:12px;width:24px;"><?php echo $i; ?>.</span>
                    <input type="text" name="solaris_options[ref<?php echo $i; ?>_nome]" value="<?php echo esc_attr(solaris_option("ref{$i}_nome")); ?>" style="flex:1;" placeholder="Nome azienda">
                    <input type="url" name="solaris_options[ref<?php echo $i; ?>_logo]" value="<?php echo esc_attr(solaris_option("ref{$i}_logo")); ?>" style="flex:1;" placeholder="URL logo (opzionale)">
                    <button type="button" class="button solaris-media-btn">Logo</button>
                    <div class="solaris-media-preview" style="width:40px;"></div>
                </div>
                <?php endfor; ?>
            </div>

            <?php submit_button('Salva contenuti'); ?>
        </form>
    </div>
    <?php
}
