<?php
/**
 * Solaris Films — Data Import Script
 * 
 * Run this ONCE after theme activation to import all products, cities, and pages.
 * Access via: yoursite.com/wp-admin/admin.php?page=solaris-import
 * Or run via WP-CLI: wp eval-file import-data.php
 */

// Prevent direct access
if (!defined('ABSPATH') && !defined('WP_CLI')) {
    // If running via WP-CLI, ABSPATH will be defined
    if (php_sapi_name() !== 'cli') {
        exit('Direct access not allowed.');
    }
}

function solaris_import_all_data() {
    $results = array('prodotti' => 0, 'citta' => 0, 'focus' => 0, 'info' => 0, 'pagine' => 0);

    // ===== IMPORT PRODUCTS =====
    $prodotti = array(
        array('title' => 'Madico SB 20 E PS SR 75 micron', 'slug' => 'madico-sb-20-e-ps-sr', 'content' => 'Le pellicole sputtered Madico SB 20 E PS SR vengono utilizzate dove si deve schermare l\'irraggiamento solare con esigenza di maggiore luminosita.', 'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Sputtered — Serie SB', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera basso emissivo 6 mm', 'energia_trasmessa' => '8', 'energia_riflessa' => '53', 'energia_assorbita' => '39', 'vlt' => '16', 'vlr_esterno' => '37', 'riduzione_abbaglio' => '79', 'ir_respinti' => '96', 'uv_trasmessi' => '1', 'energia_respinta' => '88', 'caratteristiche' => "Resistenza e durata nel tempo grazie alla tecnologia sputtering\nRiflettono fino all'88% dell'energia solare\nBuona schermatura solare lasciando quasi inalterata la trasparenza\nProdotto unico con brevetto esclusivo\nDoppio strato antigraffio\nVetro di sicurezza UNI EN 12600 classe 3B3")),
        array('title' => 'Madico SB 35 E PS SR 75 micron', 'slug' => 'madico-sb-35-e-ps-sr', 'content' => 'Le pellicole sputtered Madico SB 35 E PS SR vengono utilizzate dove si deve schermare l\'irraggiamento solare con esigenza di maggiore luminosita.', 'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Sputtered — Serie SB', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera basso emissivo 6 mm', 'energia_trasmessa' => '13', 'energia_riflessa' => '41', 'energia_assorbita' => '46', 'vlt' => '26', 'vlr_esterno' => '26', 'riduzione_abbaglio' => '64', 'ir_respinti' => '89', 'uv_trasmessi' => '1', 'energia_respinta' => '80')),
        array('title' => 'Tecnosolar NT 20 E PS SR', 'slug' => 'tecnosolar-nt-20-e-ps-sr', 'content' => 'Le pellicole antisolari NT 20 E PS SR vengono utilizzate dove si deve schermare l\'irraggiamento solare ed eliminare i problemi di abbagliamento.', 'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Oscuranti — Serie NT', 'applicazione' => 'Esterno', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 6 mm', 'energia_trasmessa' => '19', 'energia_riflessa' => '24', 'energia_assorbita' => '57', 'vlt' => '20', 'vlr_esterno' => '18', 'riduzione_abbaglio' => '62', 'ir_respinti' => '77', 'uv_trasmessi' => '1', 'energia_respinta' => '100')),
        array('title' => 'Madico SG 20 E PS SR 75 micron', 'slug' => 'madico-sg-20-e-ps-sr', 'content' => 'Le pellicole sputtered Madico SG 20 E PS SR vengono utilizzate dove si deve schermare l\'irraggiamento solare. Tono neutro grigio fume.', 'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Sputtered — Serie SG', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera basso emissivo 6 mm', 'energia_trasmessa' => '9', 'energia_riflessa' => '30', 'energia_assorbita' => '61', 'vlt' => '16', 'vlr_esterno' => '31', 'riduzione_abbaglio' => '82', 'ir_respinti' => '84', 'uv_trasmessi' => '1', 'energia_respinta' => '84')),
        array('title' => 'Madico SL 8 E PS SR 75 Micron', 'slug' => 'madico-sl-8-e-ps-sr', 'content' => 'Le pellicole antisolari Madico SL 8 sono consigliate per grandi superfici vetrate con elevata riflessione solare.', 'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Sunscape', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera basso emissivo 6 mm', 'energia_trasmessa' => '3', 'energia_riflessa' => '63', 'energia_assorbita' => '34', 'vlt' => '6', 'vlr_esterno' => '61', 'vlr_interno' => '30', 'riduzione_abbaglio' => '92', 'ir_respinti' => '98', 'uv_trasmessi' => '1', 'energia_respinta' => '94')),
        array('title' => 'Tecnosolar SSN 50 TE SR', 'slug' => 'tecnosolar-ssn-50-te-sr', 'content' => 'Pellicola antisolare spettro-selettiva. Mantiene inalterata la trasparenza e l\'aspetto estetico delle vetrate.', 'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Spettro-selettive — Serie Hi-Tec-Clear', 'applicazione' => 'Esterno', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera 4 mm', 'energia_trasmessa' => '25', 'energia_riflessa' => '23', 'energia_assorbita' => '52', 'vlt' => '45', 'vlr_esterno' => '23', 'vlr_interno' => '26', 'riduzione_abbaglio' => '48', 'ir_respinti' => '84', 'uv_trasmessi' => '1', 'energia_respinta' => '69')),
        array('title' => 'Madico RS 20 E PS SR 75 Micron', 'slug' => 'madico-rs-20-e-ps-sr', 'content' => 'Pellicola antisolare riflettente per vetrate con grossi problemi di insolazione e surriscaldamento.', 'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Riflettenti — Serie RS', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 6 mm', 'energia_trasmessa' => '12', 'energia_riflessa' => '64', 'energia_assorbita' => '24', 'vlt' => '16', 'vlr_esterno' => '63', 'riduzione_abbaglio' => '82', 'ir_respinti' => '91', 'uv_trasmessi' => '1', 'energia_respinta' => '81')),
        array('title' => 'Madico RS 40 E PS SR 75 Micron', 'slug' => 'madico-rs-40-e-ps-sr', 'content' => 'Versione a maggiore trasmissione luminosa della serie RS riflettente.', 'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Riflettenti — Serie RS', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 6 mm', 'energia_trasmessa' => '28', 'energia_riflessa' => '36', 'energia_assorbita' => '36', 'vlt' => '40', 'vlr_esterno' => '63', 'riduzione_abbaglio' => '54', 'ir_respinti' => '78', 'uv_trasmessi' => '1', 'energia_respinta' => '61')),
        // Sicurezza RS
        array('title' => 'Madico RS 20 PS SR 4 MIL', 'slug' => 'madico-rs-20-ps-sr-4mil', 'content' => 'Pellicola antisolare di sicurezza certificata EN 12600, classe 2B2.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Antisolari di Sicurezza — Serie RS', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '13', 'energia_riflessa' => '53', 'energia_assorbita' => '34', 'vlt' => '18', 'vlr_esterno' => '57', 'riduzione_abbaglio' => '80', 'ir_respinti' => '94', 'uv_trasmessi' => '1', 'energia_respinta' => '78')),
        array('title' => 'Madico RS 20 PS SR 8 MIL', 'slug' => 'madico-rs-20-ps-sr-8mil', 'content' => 'Versione a maggior spessore della serie RS 20 di sicurezza.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Antisolari di Sicurezza — Serie RS', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '13', 'energia_riflessa' => '52', 'energia_assorbita' => '35', 'vlt' => '17', 'vlr_esterno' => '57', 'riduzione_abbaglio' => '81', 'ir_respinti' => '94', 'uv_trasmessi' => '1', 'energia_respinta' => '81')),
        array('title' => 'Madico RS 40 PS SR 4 MIL', 'slug' => 'madico-rs-40-ps-sr-4mil', 'content' => 'Pellicola antisolare di sicurezza a maggiore trasmissione luminosa.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Antisolari di Sicurezza — Serie RS', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '34', 'energia_riflessa' => '28', 'energia_assorbita' => '38', 'vlt' => '44', 'vlr_esterno' => '28', 'riduzione_abbaglio' => '51', 'ir_respinti' => '79', 'uv_trasmessi' => '1', 'energia_respinta' => '55')),
        array('title' => 'Madico RS 40 PS SR 8 MIL', 'slug' => 'madico-rs-40-ps-sr-8mil', 'content' => 'Versione a maggior spessore della serie RS 40 di sicurezza.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Antisolari di Sicurezza — Serie RS', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '13', 'energia_riflessa' => '52', 'energia_assorbita' => '35', 'vlt' => '17', 'vlr_esterno' => '57', 'riduzione_abbaglio' => '81', 'ir_respinti' => '94', 'uv_trasmessi' => '1', 'energia_respinta' => '78')),
        // Sicurezza CL
        array('title' => 'Madico CL 400 PS SR', 'slug' => 'madico-cl-400-ps-sr', 'content' => 'Pellicola di sicurezza neutra e trasparente, certificata EN 12600, classe 2B2.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Sicurezza Neutre — Serie CL', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '89', 'energia_riflessa' => '8', 'energia_assorbita' => '9', 'vlt' => '89', 'vlr_esterno' => '9', 'riduzione_abbaglio' => '1', 'ir_respinti' => '20', 'uv_trasmessi' => '1', 'energia_respinta' => '15')),
        array('title' => 'Madico CL 400 E PS SR', 'slug' => 'madico-cl-400-e-ps-sr', 'content' => 'Versione per esterno della CL 400. Sicurezza neutra e trasparente.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Sicurezza Neutre — Serie CL', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '82', 'energia_riflessa' => '8', 'energia_assorbita' => '9', 'vlt' => '89', 'vlr_esterno' => '9', 'riduzione_abbaglio' => '1', 'ir_respinti' => '31', 'uv_trasmessi' => '1', 'energia_respinta' => '15')),
        array('title' => 'Madico CL 700 PS SR', 'slug' => 'madico-cl-700-ps-sr', 'content' => 'Pellicola di sicurezza neutra ad alto spessore. Perfetta trasparenza cristallina.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Sicurezza Neutre — Serie CL', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '80', 'energia_riflessa' => '7', 'energia_assorbita' => '13', 'vlt' => '90', 'vlr_esterno' => '8', 'riduzione_abbaglio' => '1', 'ir_respinti' => '19', 'uv_trasmessi' => '1', 'energia_respinta' => '16')),
        array('title' => 'Madico CL 700 E PS SR', 'slug' => 'madico-cl-700-e-ps-sr', 'content' => 'Versione per esterno della CL 700. Protezione rinforzata per esterno.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Sicurezza Neutre — Serie CL', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '80', 'energia_riflessa' => '7', 'energia_assorbita' => '13', 'vlt' => '90', 'vlr_esterno' => '8', 'riduzione_abbaglio' => '1', 'ir_respinti' => '19', 'uv_trasmessi' => '1', 'energia_respinta' => '16')),
        // SafetyShield
        array('title' => 'Madico SafetyShield 800', 'slug' => 'madico-safetyshield-800', 'content' => 'Pellicola di sicurezza anti-esplosione. Trasforma vetro normale in vetro antieffrazione.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Anti-Esplosione — SafetyShield', 'applicazione' => 'Interno', 'certificazione' => 'EN 13123 / EN 13124 / ISO 16933 / US-GSA', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '79', 'energia_riflessa' => '8', 'energia_assorbita' => '13', 'vlt' => '87', 'vlr_esterno' => '10', 'riduzione_abbaglio' => '3', 'uv_trasmessi' => '1', 'energia_respinta' => '17')),
        array('title' => 'Madico SafetyShield 1500', 'slug' => 'madico-safetyshield-1500', 'content' => 'Pellicola di sicurezza anti-intrusione. Certificata EN 356 classe P2A/P3A.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Anti-Esplosione — SafetyShield', 'applicazione' => 'Interno', 'certificazione' => 'EN 356 P2A/P3A / GSA', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '82', 'energia_riflessa' => '10', 'energia_assorbita' => '8', 'vlt' => '88', 'vlr_esterno' => '10', 'riduzione_abbaglio' => '3', 'uv_trasmessi' => '1', 'energia_respinta' => '17')),
        array('title' => 'Sistema di Ancoraggio GullWing', 'slug' => 'madico-gullwing', 'content' => 'Il sistema di ancoraggio GullWing, in combinazione con le pellicole Madico SafetyShield, assorbe e disperde l\'energia incidente trattenendo il vetro nel proprio vano.', 'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Accessori — Ancoraggio', 'applicazione' => 'Interno/Esterno')),
        // Privacy
        array('title' => 'Madico MT 200 XW', 'slug' => 'madico-mt-200-xw', 'content' => 'Pellicola privacy che tutela la privacy preservando la luminosita.', 'meta' => array('categoria' => 'Privacy', 'sottocategoria' => 'Privacy', 'applicazione' => 'Interno', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '66', 'energia_riflessa' => '16', 'energia_assorbita' => '14', 'vlt' => '68', 'vlr_esterno' => '19', 'riduzione_abbaglio' => '24', 'ir_respinti' => '33', 'uv_trasmessi' => '1', 'energia_respinta' => '29')),
        array('title' => 'Vetrofanie', 'slug' => 'vetrofanie', 'content' => 'Le vetrofanie sono sottili fogli di materiale stampato a colori con decorazioni o scritte che si applicano sulle vetrine.', 'meta' => array('categoria' => 'Privacy', 'sottocategoria' => 'Decorative — Vetrofanie', 'applicazione' => 'Interno/Esterno')),
    );

    foreach ($prodotti as $p) {
        if (get_page_by_path($p['slug'], OBJECT, 'prodotto')) continue;
        $id = wp_insert_post(array(
            'post_type' => 'prodotto',
            'post_title' => $p['title'],
            'post_name' => $p['slug'],
            'post_content' => $p['content'],
            'post_status' => 'publish',
        ));
        if ($id && !is_wp_error($id) && isset($p['meta'])) {
            foreach ($p['meta'] as $key => $val) {
                update_post_meta($id, $key, $val);
            }
            $results['prodotti']++;
        }
    }

    // ===== IMPORT CITIES =====
    $citta = array(
        array('Roma', 'roma', 'Lazio'), array('Milano', 'milano', 'Lombardia'),
        array('Firenze', 'firenze', 'Toscana'), array('Torino', 'torino', 'Piemonte'),
        array('Napoli', 'napoli', 'Campania'), array('Bologna', 'bologna', 'Emilia-Romagna'),
        array('Genova', 'genova', 'Liguria'), array('Venezia', 'venezia', 'Veneto'),
        array('Palermo', 'palermo', 'Sicilia'), array('Verona', 'verona', 'Veneto'),
        array('Parma', 'parma', 'Emilia-Romagna'), array('Padova', 'padova', 'Veneto'),
        array('Brescia', 'brescia', 'Lombardia'), array('Modena', 'modena', 'Emilia-Romagna'),
        array('Prato', 'prato', 'Toscana'), array('Reggio Emilia', 'reggio-emilia', 'Emilia-Romagna'),
        array('Perugia', 'perugia', 'Umbria'), array('Rimini', 'rimini', 'Emilia-Romagna'),
        array('Cagliari', 'cagliari', 'Sardegna'), array('Bergamo', 'bergamo', 'Lombardia'),
        array('Vicenza', 'vicenza', 'Veneto'), array('Trieste', 'trieste', 'Friuli-Venezia Giulia'),
    );

    foreach ($citta as $c) {
        if (get_page_by_path($c[1], OBJECT, 'servizio_locale')) continue;
        $id = wp_insert_post(array(
            'post_type' => 'servizio_locale',
            'post_title' => $c[0],
            'post_name' => $c[1],
            'post_content' => sprintf('Solaris Films offre servizi di installazione pellicole per vetri MADICO a %s e in tutta la provincia. Sopralluogo e preventivo gratuiti.', $c[0]),
            'post_status' => 'publish',
        ));
        if ($id && !is_wp_error($id)) {
            update_post_meta($id, 'regione', $c[2]);
            $results['citta']++;
        }
    }

    // ===== CREATE PAGES =====
    $pages = array(
        array('title' => 'Servizi', 'slug' => 'servizi', 'template' => ''),
        array('title' => 'Chi Siamo', 'slug' => 'chi-siamo', 'template' => ''),
        array('title' => 'Contatti', 'slug' => 'contatti', 'template' => 'page-contatti.php'),
        array('title' => 'Preventivo', 'slug' => 'preventivo', 'template' => 'page-preventivo.php'),
        array('title' => 'Guida Tecnica', 'slug' => 'guida-tecnica', 'template' => ''),
        array('title' => 'Profilo Solaris', 'slug' => 'profilo-solaris', 'template' => ''),
        array('title' => 'Privacy Policy', 'slug' => 'privacy-policy', 'template' => ''),
    );

    foreach ($pages as $pg) {
        if (get_page_by_path($pg['slug'])) continue;
        $id = wp_insert_post(array(
            'post_type' => 'page',
            'post_title' => $pg['title'],
            'post_name' => $pg['slug'],
            'post_status' => 'publish',
        ));
        if ($id && !is_wp_error($id)) {
            if (!empty($pg['template'])) {
                update_post_meta($id, '_wp_page_template', $pg['template']);
            }
            $results['pagine']++;
        }
    }

    return $results;
}

// Admin menu for import
function solaris_import_menu() {
    add_management_page('Solaris Import', 'Solaris Import', 'manage_options', 'solaris-import', 'solaris_import_page');
}
add_action('admin_menu', 'solaris_import_menu');

function solaris_import_page() {
    echo '<div class="wrap"><h1>Solaris Films — Import Dati</h1>';
    if (isset($_POST['solaris_run_import']) && wp_verify_nonce($_POST['_wpnonce'], 'solaris_import')) {
        $results = solaris_import_all_data();
        echo '<div class="notice notice-success"><p>';
        printf('Import completato: %d prodotti, %d citta, %d pagine.', $results['prodotti'], $results['citta'], $results['pagine']);
        echo '</p></div>';
    }
    echo '<form method="post">';
    wp_nonce_field('solaris_import');
    echo '<p>Clicca per importare tutti i dati del sito (prodotti, citta, pagine). Lo script e idempotente: non crea duplicati.</p>';
    echo '<p><input type="submit" name="solaris_run_import" class="button button-primary" value="Importa Dati"></p>';
    echo '</form></div>';
}
