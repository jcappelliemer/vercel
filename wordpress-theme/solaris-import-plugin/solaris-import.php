<?php
/**
 * Plugin Name: Solaris Films — Importa Contenuti
 * Description: Importa automaticamente tutti i prodotti MADICO, le citta, i focus tecnici, le pagine info e le pagine statiche del sito Solaris Films. Vai su Strumenti > Solaris Import.
 * Version: 1.0.0
 * Author: Solaris Films
 * Text Domain: solaris-import
 */

if (!defined('ABSPATH')) exit;

// ============================================================
// ADMIN MENU
// ============================================================
add_action('admin_menu', function () {
    add_management_page(
        'Solaris Import Contenuti',
        'Solaris Import',
        'manage_options',
        'solaris-import',
        'solaris_import_render_page'
    );
});

// ============================================================
// ADMIN PAGE
// ============================================================
function solaris_import_render_page() {
    echo '<div class="wrap">';
    echo '<h1 style="margin-bottom:20px;">Solaris Films — Importa Contenuti</h1>';

    // Handle import
    if (isset($_POST['solaris_do_import']) && check_admin_referer('solaris_import_nonce')) {
        $what = sanitize_text_field($_POST['solaris_do_import']);
        $r = array();
        if ($what === 'tutto' || $what === 'prodotti') $r['prodotti'] = solaris_import_prodotti();
        if ($what === 'tutto' || $what === 'citta') $r['citta'] = solaris_import_citta();
        if ($what === 'tutto' || $what === 'focus') $r['focus'] = solaris_import_focus_tecnici();
        if ($what === 'tutto' || $what === 'info') $r['info'] = solaris_import_pagine_info();
        if ($what === 'tutto' || $what === 'pagine') $r['pagine'] = solaris_import_pagine_statiche();

        echo '<div class="notice notice-success" style="padding:12px 16px;margin:16px 0;">';
        echo '<strong>Importazione completata!</strong><br>';
        foreach ($r as $tipo => $num) {
            echo ucfirst($tipo) . ': <strong>' . intval($num) . '</strong> creati<br>';
        }
        echo '</div>';
    }

    // Count existing
    $count_prodotti = wp_count_posts('prodotto')->publish ?? 0;
    $count_citta = wp_count_posts('servizio_locale')->publish ?? 0;
    $count_focus = wp_count_posts('focus_tecnico')->publish ?? 0;
    $count_info = wp_count_posts('pagina_info')->publish ?? 0;
    ?>

    <div style="background:#fff;border:1px solid #ccd0d4;border-radius:8px;padding:24px;max-width:700px;">
        <p style="font-size:14px;color:#555;">Questo plugin importa tutti i contenuti del sito Solaris Films. Lo script e <strong>idempotente</strong>: non crea duplicati se eseguito piu volte.</p>

        <h2 style="font-size:16px;margin:20px 0 10px;">Stato attuale</h2>
        <table class="widefat" style="max-width:400px;">
            <tr><td>Prodotti</td><td><strong><?php echo $count_prodotti; ?></strong> / 21</td></tr>
            <tr><td>Servizi Locali (citta)</td><td><strong><?php echo $count_citta; ?></strong> / 22</td></tr>
            <tr><td>Focus Tecnici</td><td><strong><?php echo $count_focus; ?></strong> / 15</td></tr>
            <tr><td>Pagine Info</td><td><strong><?php echo $count_info; ?></strong> / 10</td></tr>
        </table>

        <h2 style="font-size:16px;margin:24px 0 10px;">Importa contenuti</h2>

        <form method="post" style="margin-bottom:12px;">
            <?php wp_nonce_field('solaris_import_nonce'); ?>
            <input type="hidden" name="solaris_do_import" value="tutto">
            <button type="submit" class="button button-primary button-hero" style="width:100%;text-align:center;font-size:15px;">
                IMPORTA TUTTO (prodotti + citta + focus + info + pagine)
            </button>
        </form>

        <p style="color:#888;font-size:12px;margin:16px 0 8px;">Oppure importa singolarmente:</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <form method="post"><?php wp_nonce_field('solaris_import_nonce'); ?>
                <input type="hidden" name="solaris_do_import" value="prodotti">
                <button type="submit" class="button">21 Prodotti</button>
            </form>
            <form method="post"><?php wp_nonce_field('solaris_import_nonce'); ?>
                <input type="hidden" name="solaris_do_import" value="citta">
                <button type="submit" class="button">22 Citta</button>
            </form>
            <form method="post"><?php wp_nonce_field('solaris_import_nonce'); ?>
                <input type="hidden" name="solaris_do_import" value="focus">
                <button type="submit" class="button">15 Focus Tecnici</button>
            </form>
            <form method="post"><?php wp_nonce_field('solaris_import_nonce'); ?>
                <input type="hidden" name="solaris_do_import" value="info">
                <button type="submit" class="button">10 Pagine Info</button>
            </form>
            <form method="post"><?php wp_nonce_field('solaris_import_nonce'); ?>
                <input type="hidden" name="solaris_do_import" value="pagine">
                <button type="submit" class="button">Pagine Statiche</button>
            </form>
        </div>
    </div>

    <div style="background:#f0f6fc;border:1px solid #72aee6;border-radius:8px;padding:16px 20px;max-width:700px;margin-top:20px;">
        <strong>Dopo l'importazione:</strong>
        <ol style="margin:8px 0 0 20px;color:#555;">
            <li>Vai su <strong>Impostazioni > Permalink</strong> > seleziona "Nome articolo" > Salva</li>
            <li>Vai su <strong>Impostazioni > Lettura</strong> > "Una pagina statica" > Homepage: seleziona "Home"</li>
            <li>Vai su <strong>Aspetto > Menu</strong> > crea menu con le pagine > assegna a "Menu Principale"</li>
        </ol>
    </div>

    <?php
    echo '</div>';
}

// ============================================================
// IMPORT FUNCTIONS
// ============================================================

function solaris_import_prodotti() {
    $count = 0;
    $prodotti = array(
        array('title' => 'Madico SB 20 E PS SR 75 micron', 'slug' => 'madico-sb-20-e-ps-sr',
            'content' => 'Le pellicole sputtered Madico SB 20 E PS SR vengono utilizzate dove si deve schermare l\'irraggiamento solare con esigenza di maggiore luminosita. Sono ideali per uffici, scuole, banche, industrie, ospedali, alberghi, ristoranti, servizi pubblici, negozi vari, musei, show room e palestre. Resistenza e durata nel tempo grazie alla sofisticata tecnologia sputtering. Le pellicole antisolari sputtered SB 20 E PS SR sono formate da una base di poliestere trasparente trattata con un processo chiamato sputtering che permette di raccogliere ed incorporare nella superficie della pellicola atomi di metallo, garantendo durata e prestazioni.',
            'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Sputtered — Serie SB', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera basso emissivo 6 mm', 'specifiche_tecniche' => 'Base di poliestere trasparente trattata con processo sputtering per incorporare atomi di metallo. Doppio strato antigraffio. Brevetto esclusivo.', 'energia_trasmessa' => '8', 'energia_riflessa' => '53', 'energia_assorbita' => '39', 'vlt' => '16', 'vlr_esterno' => '37', 'riduzione_abbaglio' => '79', 'ir_respinti' => '96', 'uv_trasmessi' => '1', 'energia_respinta' => '88', 'caratteristiche' => "Resistenza e durata nel tempo grazie alla tecnologia sputtering\nRiflettono fino all'88% dell'energia solare\nBuona schermatura solare lasciando quasi inalterata la trasparenza\nProdotto unico con brevetto esclusivo\nDoppio strato antigraffio\nTrasforma la vetrata in vetro di sicurezza UNI EN 12600 classe 3B3")),

        array('title' => 'Madico SB 35 E PS SR 75 micron', 'slug' => 'madico-sb-35-e-ps-sr',
            'content' => 'Le pellicole sputtered Madico SB 35 E PS SR vengono utilizzate dove si deve schermare l\'irraggiamento solare con esigenza di maggiore luminosita. Ideali per ambienti che richiedono alta trasmissione luminosa con ottima protezione solare.',
            'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Sputtered — Serie SB', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera basso emissivo 6 mm', 'specifiche_tecniche' => 'Base di poliestere trasparente trattata con processo sputtering. Elevata trasmissione luminosa con maggiore riflessione energetica.', 'energia_trasmessa' => '13', 'energia_riflessa' => '41', 'energia_assorbita' => '46', 'vlt' => '26', 'vlr_esterno' => '26', 'riduzione_abbaglio' => '64', 'ir_respinti' => '89', 'uv_trasmessi' => '1', 'energia_respinta' => '80', 'caratteristiche' => "Resistenza e durata nel tempo grazie alla tecnologia sputtering\nRiflettono fino all'88% dell'energia solare\nElevata trasmissione luminosa\nProdotto unico con brevetto esclusivo\nDoppio strato antigraffio\nVetro di sicurezza UNI EN 12600 classe 3B3")),

        array('title' => 'Tecnosolar NT 20 E PS SR', 'slug' => 'tecnosolar-nt-20-e-ps-sr',
            'content' => 'Le pellicole antisolari NT 20 E PS SR vengono utilizzate dove si deve schermare l\'irraggiamento solare ed eliminare i problemi di abbagliamento senza provocare l\'effetto riflettente caratteristico di altri tipi di pellicole. Questa pellicola e molto scura e garantisce discrezione nelle ore diurne.',
            'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Oscuranti — Serie NT', 'applicazione' => 'Esterno', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 6 mm', 'specifiche_tecniche' => 'Pellicola antisolare oscurante per applicazione esterna. Elimina problemi di abbagliamento senza effetto riflettente.', 'energia_trasmessa' => '19', 'energia_riflessa' => '24', 'energia_assorbita' => '57', 'vlt' => '20', 'vlr_esterno' => '18', 'riduzione_abbaglio' => '62', 'ir_respinti' => '77', 'uv_trasmessi' => '1', 'energia_respinta' => '100', 'caratteristiche' => "Eccellente filtraggio raggi UV che riduce lo sbiadimento\nEccellente riduzione dell'abbagliamento\nPellicola a controllo solare non riflettente\nGarantisce discrezione nelle ore diurne")),

        array('title' => 'Madico SG 20 E PS SR 75 micron', 'slug' => 'madico-sg-20-e-ps-sr',
            'content' => 'Le pellicole sputtered Madico SG 20 E PS SR vengono utilizzate dove si deve schermare l\'irraggiamento solare con esigenza di maggiore luminosita. Il tono neutro grigio fume si abbina perfettamente a qualsiasi arredamento.',
            'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Sputtered — Serie SG', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera basso emissivo 6 mm', 'specifiche_tecniche' => 'Base di poliestere trasparente con processo sputtering. Tono neutro grigio fume.', 'energia_trasmessa' => '9', 'energia_riflessa' => '30', 'energia_assorbita' => '61', 'vlt' => '16', 'vlr_esterno' => '31', 'riduzione_abbaglio' => '82', 'ir_respinti' => '84', 'uv_trasmessi' => '1', 'energia_respinta' => '84', 'caratteristiche' => "Resistenza e durata grazie alla tecnologia sputtering\nRiflettono fino all'88% dell'energia solare\nTono neutro grigio fume adatto a qualsiasi arredamento\nProdotto unico con brevetto esclusivo\nDoppio strato antigraffio\nVetro di sicurezza UNI EN 12600 classe 3B3")),

        array('title' => 'Madico SL 8 E PS SR 75 Micron', 'slug' => 'madico-sl-8-e-ps-sr',
            'content' => 'Le pellicole antisolari Madico SL 8 sono consigliate per il rivestimento di grandi superfici vetrate che richiedono una elevata riflessione dell\'irraggiamento solare e protezione dall\'abbaglio. Effetto estetico speculare colore argento verso l\'esterno e colore fume all\'interno.',
            'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Sunscape', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera basso emissivo 6 mm', 'specifiche_tecniche' => 'Pellicola Sunscape con avanzato processo di metallizzazione sputtering. Effetto speculare argento esterno, fume interno.', 'energia_trasmessa' => '3', 'energia_riflessa' => '63', 'energia_assorbita' => '34', 'vlt' => '6', 'vlr_esterno' => '61', 'vlr_interno' => '30', 'riduzione_abbaglio' => '92', 'ir_respinti' => '98', 'uv_trasmessi' => '1', 'energia_respinta' => '94', 'caratteristiche' => "Respingono fino al 94% dell'irraggiamento solare\nEffetto estetico speculare argento esterno, fume interno\nRiduce notevolmente i costi energetici\nProdotto unico con brevetto esclusivo e doppio strato antigraffio\nVetro di sicurezza UNI EN 12600 classe 3B3")),

        array('title' => 'Tecnosolar SSN 50 TE SR', 'slug' => 'tecnosolar-ssn-50-te-sr',
            'content' => 'Le pellicole antisolari spettro-selettive Hi-Tec-Clear SSN 50 TE SR sono consigliate per vetrate che fanno entrare molto calore negli ambienti interni, ma si ha l\'esigenza di mantenere inalterata la trasparenza e l\'aspetto estetico delle vetrate. Ideali per edifici con vincoli storici, paesaggistici o ambientali.',
            'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Spettro-selettive — Serie Hi-Tec-Clear', 'applicazione' => 'Esterno', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetrocamera 4 mm', 'specifiche_tecniche' => 'Tecnologia pionieristica che abbina efficacia nel respingere l\'irraggiamento solare ad alto grado di trasparenza. Rivestimento esterno con tecnologia brevettata antigraffio.', 'energia_trasmessa' => '25', 'energia_riflessa' => '23', 'energia_assorbita' => '52', 'vlt' => '45', 'vlr_esterno' => '23', 'vlr_interno' => '26', 'riduzione_abbaglio' => '48', 'ir_respinti' => '84', 'uv_trasmessi' => '1', 'energia_respinta' => '69', 'caratteristiche' => "Elegante aspetto neutro ed elevata trasparenza ottica\nElevata trasmissione della luce visibile\nScherma il 56% del calore solare\nBlocca oltre il 99% dei raggi UV\nBassa riflessione interna ed esterna")),

        array('title' => 'Madico RS 20 E PS SR 75 Micron', 'slug' => 'madico-rs-20-e-ps-sr',
            'content' => 'La pellicola antisolare riflettente RS 20 E PS SR e consigliata per vetrate con grossi problemi di insolazione, abbaglio e conseguente surriscaldamento degli ambienti interni. Finitura riflettente argento forte per discrezione diurna.',
            'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Riflettenti — Serie RS', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 6 mm', 'specifiche_tecniche' => 'Base di poliestere trasparente con rivestimento sottile di alluminio vaporizzato a densita controllata. Effetto esterno speculare argento.', 'energia_trasmessa' => '12', 'energia_riflessa' => '64', 'energia_assorbita' => '24', 'vlt' => '16', 'vlr_esterno' => '63', 'riduzione_abbaglio' => '82', 'ir_respinti' => '91', 'uv_trasmessi' => '1', 'energia_respinta' => '81', 'caratteristiche' => "Riduzione ingresso di calore fino all'89%\nNotevole risparmio energetico\nRiduzione dell'abbaglio per maggior comfort visivo\nPrivacy diurna grazie all'effetto specchio\nMaggiore eleganza estetica dell'edificio\nDoppio strato antigraffio, vetro di sicurezza UNI EN 12600 classe 3B3")),

        array('title' => 'Madico RS 40 E PS SR 75 Micron', 'slug' => 'madico-rs-40-e-ps-sr',
            'content' => 'Le pellicole antisolari riflettenti Madico RS 40 E PS SR sono consigliate per vetrate con grossi problemi di insolazione e surriscaldamento. Versione a maggiore trasmissione luminosa della serie RS.',
            'meta' => array('categoria' => 'Antisolari', 'sottocategoria' => 'Riflettenti — Serie RS', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 3B3', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 6 mm', 'specifiche_tecniche' => 'Base di poliestere trasparente con rivestimento di alluminio vaporizzato. Effetto speculare argento.', 'energia_trasmessa' => '28', 'energia_riflessa' => '36', 'energia_assorbita' => '36', 'vlt' => '40', 'vlr_esterno' => '63', 'riduzione_abbaglio' => '54', 'ir_respinti' => '78', 'uv_trasmessi' => '1', 'energia_respinta' => '61', 'caratteristiche' => "Riduzione ingresso di calore fino all'89%\nNotevole risparmio energetico\nRiduzione abbaglio e maggior comfort visivo\nPrivacy diurna con effetto specchio\nMaggiore eleganza estetica all'edificio\nDoppio strato antigraffio, vetro di sicurezza UNI EN 12600 classe 3B3")),

        // === SICUREZZA RS ===
        array('title' => 'Madico RS 20 PS SR 4 MIL', 'slug' => 'madico-rs-20-ps-sr-4mil',
            'content' => 'La pellicola antisolare di sicurezza Madico RS 20 PS SR 4 Mil e testata e certificata in conformita alla Norma europea EN 12600, classe 2B2. Le proprieta riflettenti la rendono ideale per vetrate con grossi problemi di insolazione e surriscaldamento.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Antisolari di Sicurezza — Serie RS', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'specifiche_tecniche' => 'Base di poliestere con rivestimento di alluminio vaporizzato. Aspetto specchiato argento. Struttura multistrato laminato.', 'energia_trasmessa' => '13', 'energia_riflessa' => '53', 'energia_assorbita' => '34', 'vlt' => '18', 'vlr_esterno' => '57', 'riduzione_abbaglio' => '80', 'ir_respinti' => '94', 'uv_trasmessi' => '1', 'energia_respinta' => '78', 'caratteristiche' => "Certificata EN 12600 classe 2B2 su lastra singola da 3, 4 e 6 mm\nProtezione antinfortunistica in caso di rottura del vetro\nRiduzione significativa dei costi di condizionamento estivo\nPerfetta trasparenza senza distorsioni ottiche\nConforme al Testo Unico D.Lgs. 81/2008\nSchermatura oltre il 99% dei raggi UV")),

        array('title' => 'Madico RS 20 PS SR 8 MIL', 'slug' => 'madico-rs-20-ps-sr-8mil',
            'content' => 'La pellicola antisolare di sicurezza Madico RS 20 PS SR 8 Mil e la versione a maggior spessore della serie RS 20. Testata e certificata EN 12600 classe 2B2.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Antisolari di Sicurezza — Serie RS', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '13', 'energia_riflessa' => '52', 'energia_assorbita' => '35', 'vlt' => '17', 'vlr_esterno' => '57', 'riduzione_abbaglio' => '81', 'ir_respinti' => '94', 'uv_trasmessi' => '1', 'energia_respinta' => '81', 'caratteristiche' => "Certificata EN 12600 classe 2B2\nMaggiore spessore per protezione rinforzata\nProtezione antinfortunistica in caso di rottura\nAmbiente di lavoro piu sicuro, fresco e confortevole\nConforme al D.Lgs. 81/2008\nStruttura multistrato laminato")),

        array('title' => 'Madico RS 40 PS SR 4 MIL', 'slug' => 'madico-rs-40-ps-sr-4mil',
            'content' => 'La pellicola antisolare di sicurezza Madico RS 40 PS SR 4 Mil e testata e certificata EN 12600, classe 2B2. Versione a maggiore trasmissione luminosa.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Antisolari di Sicurezza — Serie RS', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '34', 'energia_riflessa' => '28', 'energia_assorbita' => '38', 'vlt' => '44', 'vlr_esterno' => '28', 'riduzione_abbaglio' => '51', 'ir_respinti' => '79', 'uv_trasmessi' => '1', 'energia_respinta' => '55', 'caratteristiche' => "Certificata EN 12600 classe 2B2\nMaggiore trasmissione luminosa rispetto alla RS 20\nProtezione antinfortunistica in caso di rottura\nPerfetta trasparenza senza distorsioni ottiche\nConforme al D.Lgs. 81/2008")),

        array('title' => 'Madico RS 40 PS SR 8 MIL', 'slug' => 'madico-rs-40-ps-sr-8mil',
            'content' => 'La pellicola antisolare di sicurezza Madico RS 40 PS SR 8 Mil e la versione a maggior spessore della serie RS 40. Certificata EN 12600 classe 2B2.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Antisolari di Sicurezza — Serie RS', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '13', 'energia_riflessa' => '52', 'energia_assorbita' => '35', 'vlt' => '17', 'vlr_esterno' => '57', 'riduzione_abbaglio' => '81', 'ir_respinti' => '94', 'uv_trasmessi' => '1', 'energia_respinta' => '78', 'caratteristiche' => "Certificata EN 12600 classe 2B2\nMaggiore spessore per protezione rinforzata\nProtezione antinfortunistica in caso di rottura\nAmbiente di lavoro sicuro, fresco e confortevole\nConforme al D.Lgs. 81/2008")),

        // === SICUREZZA CL ===
        array('title' => 'Madico CL 400 PS SR', 'slug' => 'madico-cl-400-ps-sr',
            'content' => 'La pellicola di sicurezza Madico CL 400 PS SR e testata e certificata in conformita alla Norma Europea EN 12600, classe 2B2. Trasparenza totale e protezione antinfortunistica senza alterare l\'aspetto estetico del vetro.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Sicurezza Neutre — Serie CL', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'specifiche_tecniche' => 'Pellicola di sicurezza neutra e totalmente trasparente. Singolo strato con adesivo acrilico sensibile alla pressione.', 'energia_trasmessa' => '89', 'energia_riflessa' => '8', 'energia_assorbita' => '9', 'vlt' => '89', 'vlr_esterno' => '9', 'riduzione_abbaglio' => '1', 'ir_respinti' => '20', 'uv_trasmessi' => '1', 'energia_respinta' => '15', 'caratteristiche' => "Certificata EN 12600 classe 2B2 su lastra da 3, 4 e 6 mm\nProtezione antinfortunistica in caso di rottura del vetro\nApplicazione semplice, veloce, sicura ed economica\nPerfetta trasparenza senza distorsioni ottiche\nConforme al D.Lgs. 81/2008")),

        array('title' => 'Madico CL 400 E PS SR', 'slug' => 'madico-cl-400-e-ps-sr',
            'content' => 'La pellicola di sicurezza Madico CL 400 E PS SR e la versione per esterno della CL 400. Certificata EN 12600, classe 2B2. Totalmente trasparente.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Sicurezza Neutre — Serie CL', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '82', 'energia_riflessa' => '8', 'energia_assorbita' => '9', 'vlt' => '89', 'vlr_esterno' => '9', 'riduzione_abbaglio' => '1', 'ir_respinti' => '31', 'uv_trasmessi' => '1', 'energia_respinta' => '15', 'caratteristiche' => "Certificata EN 12600 classe 2B2\nVersione per applicazione esterna\nProtezione antinfortunistica in caso di rottura\nApplicazione senza modificare gli infissi\nConforme al D.Lgs. 81/2008")),

        array('title' => 'Madico CL 700 PS SR', 'slug' => 'madico-cl-700-ps-sr',
            'content' => 'La pellicola di sicurezza Madico CL 700 PS SR e certificata EN 12600, classe 2B2. Maggiore spessore (175 micron) per protezione piu ampia, con perfetta trasparenza.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Sicurezza Neutre — Serie CL', 'applicazione' => 'Interno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '80', 'energia_riflessa' => '7', 'energia_assorbita' => '13', 'vlt' => '90', 'vlr_esterno' => '8', 'riduzione_abbaglio' => '1', 'ir_respinti' => '19', 'uv_trasmessi' => '1', 'energia_respinta' => '16', 'caratteristiche' => "Certificata EN 12600 classe 2B2\nMaggiore spessore per protezione rinforzata\nPerfetta trasparenza cristallina\nNessuna distorsione ottica\nConforme al D.Lgs. 81/2008")),

        array('title' => 'Madico CL 700 E PS SR', 'slug' => 'madico-cl-700-e-ps-sr',
            'content' => 'La pellicola di sicurezza Madico CL 700 E PS SR e la versione per esterno della CL 700. Certificata EN 12600, classe 2B2. Protezione rinforzata per esterno.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Sicurezza Neutre — Serie CL', 'applicazione' => 'Esterno', 'certificazione' => 'UNI EN 12600 classe 2B2', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'energia_trasmessa' => '80', 'energia_riflessa' => '7', 'energia_assorbita' => '13', 'vlt' => '90', 'vlr_esterno' => '8', 'riduzione_abbaglio' => '1', 'ir_respinti' => '19', 'uv_trasmessi' => '1', 'energia_respinta' => '16', 'caratteristiche' => "Certificata EN 12600 classe 2B2\nVersione per applicazione esterna\nProtezione antinfortunistica rinforzata\nPerfetta trasparenza senza distorsioni\nConforme al D.Lgs. 81/2008")),

        // === SAFETYSHIELD ===
        array('title' => 'Madico SafetyShield 800', 'slug' => 'madico-safetyshield-800',
            'content' => 'La pellicola di sicurezza SafetyShield 800 trasforma un normale vetro monolitico in un vetro antieffrazione e antiesplosione. Testata e certificata EN 13123, EN 13124, US-GSA e ISO 16933 classe EXV 33C su lastra singola da 6 mm.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Anti-Esplosione — SafetyShield', 'applicazione' => 'Interno', 'certificazione' => 'EN 13123 / EN 13124 / ISO 16933 / US-GSA', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'specifiche_tecniche' => 'Con sistema di ancoraggio GullWing applicato ai 4 lati raggiunge livello 2 della norma antiesplosione GSA e UK PSDB.', 'energia_trasmessa' => '79', 'energia_riflessa' => '8', 'energia_assorbita' => '13', 'vlt' => '87', 'vlr_esterno' => '10', 'riduzione_abbaglio' => '3', 'uv_trasmessi' => '1', 'energia_respinta' => '17', 'caratteristiche' => "Certificata EN 13123, EN 13124, US-GSA\nCertificata ISO 16933 classe EXV 33C\nTrasforma vetro normale in vetro antieffrazione\nProtezione anti-esplosione\nCompatibile con sistema di ancoraggio GullWing")),

        array('title' => 'Madico SafetyShield 1500', 'slug' => 'madico-safetyshield-1500',
            'content' => 'La pellicola di sicurezza SafetyShield 1500 rende un normale vetro monolitico in un vetro antieffrazione. Certificata EN 356 classe P2A su vetro da 3 mm e classe P3A su vetro stratificato da 6 mm.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Anti-Esplosione — SafetyShield', 'applicazione' => 'Interno', 'certificazione' => 'EN 356 P2A/P3A / GSA', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'specifiche_tecniche' => 'Pellicola ad alto spessore per protezione anti-intrusione e anti-esplosione.', 'energia_trasmessa' => '82', 'energia_riflessa' => '10', 'energia_assorbita' => '8', 'vlt' => '88', 'vlr_esterno' => '10', 'riduzione_abbaglio' => '3', 'uv_trasmessi' => '1', 'energia_respinta' => '17', 'caratteristiche' => "Certificata EN 356 classe P2A su vetro 3 mm\nCertificata EN 356 classe P3A su vetro stratificato 6 mm\nCertificata antiesplosione GSA\nTrasforma vetro normale in vetro antieffrazione\nProtezione anti-intrusione e anti-vandalismo")),

        array('title' => 'Sistema di Ancoraggio GullWing', 'slug' => 'madico-gullwing',
            'content' => 'Il sistema di ancoraggio GullWing, in combinazione con le pellicole Madico SafetyShield, assorbe e disperde l\'energia incidente trattenendo il vetro nel proprio vano in caso di rottura, riducendo la proiezione di schegge e detriti. A differenza dei sistemi di contenimento, GullWing evita che il vetro trattato fuoriesca dal proprio vano. Disponibile in tre diversi profili per vari tipi di infissi, in nero, grigio e bianco.',
            'meta' => array('categoria' => 'Sicurezza', 'sottocategoria' => 'Accessori — Ancoraggio', 'applicazione' => 'Interno/Esterno', 'caratteristiche' => "Assorbe e distribuisce il carico in caso di esplosione\nTrattiene il vetro nel proprio vano\nRaggiunge livello 2 norma antiesplosione GSA e UK PSDB\nDisponibile in tre diversi profili per vari tipi di infissi\nDisponibile in nero, grigio e bianco")),

        // === PRIVACY ===
        array('title' => 'Madico MT 200 XW', 'slug' => 'madico-mt-200-xw',
            'content' => 'La pellicola privacy Madico MT 200 XW tutela la privacy preservando la luminosita, riduce l\'abbaglio, migliora l\'estetica degli ambienti e blocca il 99% dei raggi UV. Effetto vetro smerigliato professionale.',
            'meta' => array('categoria' => 'Privacy', 'sottocategoria' => 'Privacy', 'applicazione' => 'Interno', 'garanzia' => '10 anni', 'tipo_vetro' => 'Vetro singolo 3 mm', 'specifiche_tecniche' => 'Pellicola privacy con effetto vetro smerigliato. Garantisce privacy mantenendo elevata trasmissione luminosa.', 'energia_trasmessa' => '66', 'energia_riflessa' => '16', 'energia_assorbita' => '14', 'vlt' => '68', 'vlr_esterno' => '19', 'riduzione_abbaglio' => '24', 'ir_respinti' => '33', 'uv_trasmessi' => '1', 'energia_respinta' => '29', 'caratteristiche' => "Tutela la privacy\nPreserva la luminosita\nRiduce l'abbaglio\nMigliora l'estetica degli ambienti\nBlocca il 99% dei raggi UV")),

        array('title' => 'Vetrofanie', 'slug' => 'vetrofanie',
            'content' => 'Le vetrofanie sono sottili fogli di materiale stampato a colori con decorazioni o scritte che si applicano con modalita adesiva o elettrostatica sulle vetrine. Possibilita di stampare su materiale trasparente con protezione UV. Disponibili in due tecnologie di stampa: UV (rapida essiccazione con lampade LED UV) e EcoSolvent (alta qualita su grandi superfici, resistente ai raggi UV e agenti atmosferici).',
            'meta' => array('categoria' => 'Privacy', 'sottocategoria' => 'Decorative — Vetrofanie', 'applicazione' => 'Interno/Esterno', 'caratteristiche' => "Soluzione rapida ed economica\nRimozione semplice\nDesign accattivante e personalizzabile\nGrande varieta di soluzioni\nStampa su materiale trasparente con protezione UV\nDisponibili stampa UV ed EcoSolvent")),
    );

    foreach ($prodotti as $p) {
        if (get_page_by_path($p['slug'], OBJECT, 'prodotto')) continue;
        $id = wp_insert_post(array(
            'post_type'    => 'prodotto',
            'post_title'   => $p['title'],
            'post_name'    => $p['slug'],
            'post_content' => $p['content'],
            'post_status'  => 'publish',
        ));
        if ($id && !is_wp_error($id) && isset($p['meta'])) {
            foreach ($p['meta'] as $key => $val) {
                update_post_meta($id, $key, $val);
            }
            $count++;
        }
    }
    return $count;
}

function solaris_import_citta() {
    $count = 0;
    $citta = array(
        array('Roma', 'roma', 'Lazio', 'Solaris Films offre servizi professionali di installazione pellicole per vetri MADICO a Roma e in tutto il Lazio. Pellicole antisolari per uffici, negozi ed edifici residenziali nel centro storico e zone limitrofe. Sopralluogo e preventivo gratuiti.'),
        array('Milano', 'milano', 'Lombardia', 'Solaris Films opera a Milano e in tutta la Lombardia con installatori certificati MADICO. Soluzioni per grattacieli, uffici e abitazioni. Pellicole antisolari, di sicurezza e privacy.'),
        array('Firenze', 'firenze', 'Toscana', 'Installazione pellicole per vetri MADICO a Firenze e in Toscana. Soluzioni speciali per edifici storici con vincoli architettonici. Pellicole spettro-selettive invisibili.'),
        array('Torino', 'torino', 'Piemonte', 'Servizi di installazione pellicole MADICO a Torino e in Piemonte. Protezione solare, sicurezza e privacy per edifici residenziali e commerciali.'),
        array('Napoli', 'napoli', 'Campania', 'Pellicole per vetri MADICO a Napoli e in Campania. Protezione dal calore estivo, sicurezza antinfortunistica e privacy per abitazioni e uffici.'),
        array('Bologna', 'bologna', 'Emilia-Romagna', 'Installazione pellicole per vetri a Bologna. Solaris Films offre soluzioni MADICO per risparmio energetico e sicurezza in tutta l\'Emilia-Romagna.'),
        array('Genova', 'genova', 'Liguria', 'Pellicole per vetri MADICO a Genova e in Liguria. Protezione solare per edifici esposti, pellicole di sicurezza certificate.'),
        array('Venezia', 'venezia', 'Veneto', 'Installazione pellicole MADICO a Venezia e nel Veneto. Soluzioni conservative per edifici storici e protezione UV per opere d\'arte.'),
        array('Palermo', 'palermo', 'Sicilia', 'Pellicole antisolari MADICO a Palermo e in Sicilia. Protezione dal forte irraggiamento solare mediterraneo. Risparmio energetico garantito.'),
        array('Verona', 'verona', 'Veneto', 'Installazione pellicole per vetri a Verona. Soluzioni MADICO per edifici storici, commerciali e residenziali in tutto il Veneto.'),
        array('Parma', 'parma', 'Emilia-Romagna', 'Pellicole MADICO a Parma. Protezione solare, sicurezza e privacy per aziende e abitazioni in Emilia-Romagna.'),
        array('Padova', 'padova', 'Veneto', 'Installazione pellicole per vetri MADICO a Padova e provincia. Sopralluogo gratuito e preventivo senza impegno.'),
        array('Brescia', 'brescia', 'Lombardia', 'Pellicole per vetri MADICO a Brescia. Protezione solare per industrie, uffici e abitazioni in Lombardia.'),
        array('Modena', 'modena', 'Emilia-Romagna', 'Installazione pellicole MADICO a Modena. Soluzioni per risparmio energetico e sicurezza negli edifici.'),
        array('Prato', 'prato', 'Toscana', 'Pellicole per vetri a Prato e provincia. Installatori certificati MADICO per edifici industriali e commerciali.'),
        array('Reggio Emilia', 'reggio-emilia', 'Emilia-Romagna', 'Servizi di installazione pellicole MADICO a Reggio Emilia. Protezione solare e sicurezza per ogni tipo di edificio.'),
        array('Perugia', 'perugia', 'Umbria', 'Pellicole per vetri MADICO a Perugia e in Umbria. Soluzioni per edifici storici e moderni. Preventivo gratuito.'),
        array('Rimini', 'rimini', 'Emilia-Romagna', 'Installazione pellicole MADICO a Rimini. Protezione solare per hotel, ristoranti e strutture turistiche sulla riviera.'),
        array('Cagliari', 'cagliari', 'Sardegna', 'Pellicole antisolari MADICO a Cagliari e in Sardegna. Protezione dal sole mediterraneo per edifici residenziali e commerciali.'),
        array('Bergamo', 'bergamo', 'Lombardia', 'Pellicole per vetri MADICO a Bergamo. Installazione professionale per uffici, abitazioni e edifici industriali.'),
        array('Vicenza', 'vicenza', 'Veneto', 'Installazione pellicole MADICO a Vicenza e provincia. Soluzioni per ville palladiane e edifici moderni.'),
        array('Trieste', 'trieste', 'Friuli-Venezia Giulia', 'Pellicole per vetri MADICO a Trieste e in Friuli-Venezia Giulia. Protezione solare e sicurezza per ogni esigenza.'),
    );

    foreach ($citta as $c) {
        if (get_page_by_path($c[1], OBJECT, 'servizio_locale')) continue;
        $id = wp_insert_post(array(
            'post_type'    => 'servizio_locale',
            'post_title'   => $c[0],
            'post_name'    => $c[1],
            'post_content' => $c[3],
            'post_status'  => 'publish',
        ));
        if ($id && !is_wp_error($id)) {
            update_post_meta($id, 'regione', $c[2]);
            update_post_meta($id, 'servizi_disponibili', "Pellicole antisolari per uffici e abitazioni\nPellicole di sicurezza certificate EN 12600\nPellicole anti-esplosione SafetyShield\nPellicole privacy e decorative\nVetrofanie personalizzate\nSopralluogo e preventivo gratuiti");
            update_post_meta($id, 'vantaggi', "Installatori certificati MADICO\nGaranzia fino a 10 anni\nOltre 40 anni di esperienza\nAssistenza post-vendita dedicata\nPreventivo entro 24 ore");
            $count++;
        }
    }
    return $count;
}

function solaris_import_focus_tecnici() {
    $count = 0;
    $focus = array(
        array('Pellicole Antisolari Sputtered', 'pellicole-antisolari-sputtered', 'Antisolari', 'Le pellicole antisolari sputtered MADICO rappresentano il top della tecnologia nella protezione solare dei vetri. Il processo sputtering permette di incorporare atomi di metallo nella superficie della pellicola, garantendo prestazioni superiori e durata nel tempo. Disponibili nelle serie SB (Silver Bronze) e SG (Silver Grey), offrono diverse opzioni di trasmissione luminosa e riflessione energetica.', "Tecnologia sputtering per massime prestazioni\nDoppio strato antigraffio brevettato\nVetro di sicurezza UNI EN 12600\nGaranzia 10 anni MADICO"),
        array('Pellicole Antisolari Sunscape', 'pellicole-antisolari-sunscape', 'Antisolari', 'Le pellicole Sunscape sono progettate per grandi superfici vetrate che richiedono la massima riflessione solare. Con un\'energia respinta fino al 94%, sono la soluzione ideale per edifici commerciali e industriali esposti a forte irraggiamento. Effetto estetico speculare argento all\'esterno.', "Fino al 94% di energia solare respinta\nEffetto speculare argento\nIdeali per grandi superfici vetrate\nRiduzione drastica costi energetici"),
        array('Pellicole Oscuranti per Vetri', 'pellicole-oscuranti-per-vetri', 'Antisolari', 'Le pellicole oscuranti della serie NT eliminano i problemi di abbagliamento senza provocare l\'effetto riflettente. Molto scure, garantiscono discrezione nelle ore diurne e sono ideali per ambienti dove si lavora con schermi e monitor.', "Eliminano l'abbagliamento\nNessun effetto riflettente\nDiscrezione diurna\nIdeali per ambienti con monitor"),
        array('Pellicole Spettro-Selettive', 'pellicole-spettro-selettive', 'Antisolari', 'Le pellicole spettro-selettive Hi-Tec-Clear rappresentano la soluzione ideale quando si vuole mantenere inalterata la trasparenza delle vetrate. Selezionano le lunghezze d\'onda della luce solare, bloccando il calore infrarosso ma lasciando passare la luce visibile. Perfette per edifici storici con vincoli architettonici.', "Elevata trasparenza ottica mantenuta\nBlocco selettivo del calore infrarosso\nIdeali per edifici storici\nTecnologia brevettata antigraffio"),
        array('Pellicole Riflettenti', 'pellicole-riflettenti', 'Antisolari', 'Le pellicole riflettenti della serie RS offrono la massima protezione per vetrate con grossi problemi di insolazione. Il rivestimento di alluminio vaporizzato crea un effetto specchio che riflette la radiazione solare e garantisce privacy diurna.', "Effetto specchio per massima protezione\nPrivacy diurna garantita\nRiduzione calore fino all'89%\nRisparmio energetico significativo"),
        array('Pellicole Antisolari Stampabili e Vetrofanie', 'pellicole-antisolari-stampabili-e-vetrofanie', 'Privacy', 'Le vetrofanie e le pellicole stampabili offrono soluzioni creative e funzionali per vetrine, uffici e spazi commerciali. Disponibili in stampa UV e EcoSolvent, permettono personalizzazione completa con protezione UV integrata.', "Personalizzazione completa\nStampa UV e EcoSolvent\nProtezione UV integrata\nRimozione semplice"),
        array('Pellicole Decorative e Privacy', 'pellicole-decorative-privacy', 'Privacy', 'Le pellicole privacy e decorative MADICO tutelano la riservatezza degli ambienti mantenendo la luminosita. Effetto vetro smerigliato professionale, ideale per uffici, sale riunioni, bagni e qualsiasi spazio che richieda privacy.', "Effetto vetro smerigliato professionale\nPrivacy senza perdere luminosita\nBlocco 99% raggi UV\nMigliora l'estetica degli ambienti"),
        array('Pellicole Antisolari di Sicurezza — Serie RS', 'pellicole-antisolari-di-sicurezza-la-serie-rs', 'Sicurezza', 'La serie RS di sicurezza combina le proprieta antisolari con la protezione antinfortunistica. Certificate EN 12600 classe 2B2, trasformano il vetro normale in vetro di sicurezza conforme al D.Lgs. 81/2008. Disponibili in spessori 4 e 8 mil.', "Protezione solare + sicurezza in un'unica pellicola\nCertificazione EN 12600 classe 2B2\nConformita D.Lgs. 81/2008\nDisponibili in 4 e 8 mil"),
        array('Pellicole di Sicurezza Neutre — Serie CL', 'pellicole-di-sicurezza-neutre-la-serie-cl', 'Sicurezza', 'La serie CL offre sicurezza senza alterare l\'aspetto del vetro. Totalmente trasparenti, queste pellicole proteggono dalla frantumazione senza modificare estetica o luminosita. Ideali per scuole, ospedali e edifici pubblici.', "Totalmente trasparenti\nNessuna alterazione estetica\nCertificazione EN 12600\nIdeali per edifici pubblici"),
        array('Pellicole Anti-Esplosione — SafetyShield', 'pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield', 'Sicurezza', 'Le pellicole SafetyShield rappresentano il massimo della protezione anti-esplosione e anti-intrusione. Certificate secondo le norme piu severe (EN 13123, EN 356, ISO 16933, US-GSA), trasformano vetri ordinari in barriere di sicurezza.', "Certificazione anti-esplosione GSA\nProtezione anti-intrusione EN 356\nCompatibili con sistema GullWing\nMassima sicurezza certificata"),
        array('Pellicole Anti-UV', 'pellicole-anti-uv', 'Antisolari', 'Le pellicole anti-UV MADICO bloccano oltre il 99% della radiazione ultravioletta, proteggendo tessuti, mobili, opere d\'arte e pavimenti dallo sbiadimento. Essenziali per musei, gallerie, showroom e abitazioni con arredi di pregio.', "Blocco oltre 99% raggi UV\nProtezione da sbiadimento\nIdeali per musei e gallerie\nPreservano arredi di pregio"),
        array('Pellicole Anti-Graffiti', 'pellicole-anti-graffiti', 'Sicurezza', 'Le pellicole anti-graffiti proteggono le superfici vetrate da graffi, incisioni e atti vandalici. Facilmente sostituibili, permettono di mantenere i vetri sempre puliti e integri senza costose sostituzioni.', "Protezione da graffi e vandalismo\nFacilmente sostituibili\nEvitano costose sostituzioni vetro\nIdeali per trasporti e negozi"),
        array('Pellicole Basso-Emissive', 'pellicole-basso-emissive', 'Antisolari', 'Le pellicole basso-emissive migliorano l\'isolamento termico dei vetri esistenti, riducendo la dispersione di calore in inverno e l\'ingresso in estate. Soluzione economica alternativa alla sostituzione dei serramenti.', "Isolamento termico migliorato\nRiduzione dispersione calore invernale\nAlternativa alla sostituzione serramenti\nEcobonus applicabile"),
        array('Pellicole Anti-Piccioni', 'pellicole-anti-piccioni', 'Sicurezza', 'Soluzioni con pellicole per prevenire la collisione di uccelli con le vetrate. Pellicole con pattern visibili agli uccelli ma quasi invisibili all\'occhio umano, per edifici in zone con elevata presenza di avifauna.', "Prevengono collisioni uccelli\nQuasi invisibili all'occhio umano\nPattern studiati scientificamente\nIdeali per edifici in zone naturali"),
        array('Pellicole per Serre', 'pellicole-per-serre', 'Antisolari', 'Pellicole specializzate per serre e strutture agricole. Controllano la trasmissione luminosa e termica per ottimizzare la crescita delle piante e ridurre i costi energetici delle serre.', "Controllo trasmissione luminosa\nOttimizzazione crescita piante\nRiduzione costi energetici serre\nProtezione UV per colture"),
    );

    foreach ($focus as $f) {
        if (get_page_by_path($f[1], OBJECT, 'focus_tecnico')) continue;
        $id = wp_insert_post(array(
            'post_type'    => 'focus_tecnico',
            'post_title'   => $f[0],
            'post_name'    => $f[1],
            'post_content' => $f[3],
            'post_status'  => 'publish',
        ));
        if ($id && !is_wp_error($id)) {
            update_post_meta($id, 'categoria', $f[2]);
            update_post_meta($id, 'caratteristiche', $f[4]);
            $count++;
        }
    }
    return $count;
}

function solaris_import_pagine_info() {
    $count = 0;
    $info = array(
        array('Norme EN 12600 — Sicurezza Vetri', 'norme-en-12600', 'La norma europea EN 12600 classifica le prestazioni di sicurezza dei vetri e delle pellicole applicate. Definisce tre classi di resistenza all\'impatto: 3B3, 2B2 e 1B1. Le pellicole MADICO sono certificate secondo questa norma, garantendo la trasformazione di vetri ordinari in vetri di sicurezza conformi.', "Classificazione prestazioni di sicurezza vetri\nTre classi di resistenza: 3B3, 2B2, 1B1\nTutte le pellicole MADICO certificate\nObbligatoria per edifici pubblici"),
        array('Testo Unico Sicurezza D.Lgs. 81/2008', 'testo-unico-sicurezza', 'Il D.Lgs. 81/2008 (Testo Unico sulla Sicurezza sul Lavoro) impone obblighi specifici riguardo la sicurezza delle superfici vetrate nei luoghi di lavoro. Le pellicole di sicurezza MADICO rappresentano la soluzione piu semplice, veloce ed economica per adeguare i vetri esistenti alla normativa.', "Obblighi di sicurezza per vetrate nei luoghi di lavoro\nPellicole come soluzione di adeguamento\nApplicazione semplice senza sostituire i vetri\nConformita certificata"),
        array('DPR 59/09 — Efficienza Energetica', 'dpr-59-09', 'Il DPR 59/09 stabilisce i criteri per l\'efficienza energetica degli edifici. Le pellicole antisolari contribuiscono significativamente alla riduzione del fabbisogno energetico per il raffrescamento estivo, migliorando la classe energetica dell\'edificio.', "Criteri efficienza energetica edifici\nPellicole riducono fabbisogno energetico\nMiglioramento classe energetica\nContributo agli obiettivi green"),
        array('Ecobonus Pellicole per Vetri', 'ecobonus-pellicole', 'L\'installazione di pellicole antisolari puo beneficiare delle detrazioni fiscali previste dall\'Ecobonus. Le pellicole che migliorano le prestazioni termiche dei vetri esistenti rientrano tra gli interventi di riqualificazione energetica degli edifici.', "Detrazioni fiscali per pellicole antisolari\nRientrano nell'Ecobonus\nRiqualificazione energetica edifici\nRisparmio fiscale significativo"),
        array('Certificazione BRC — British Retail Consortium', 'certificazione-brc', 'La certificazione BRC garantisce che le pellicole MADICO sono prodotte secondo i piu elevati standard di qualita internazionali. Questo standard e riconosciuto a livello mondiale e assicura tracciabilita, sicurezza e conformita dei prodotti.', "Standard di qualita internazionale\nTracciabilita completa dei prodotti\nSicurezza e conformita garantite\nRiconoscimento mondiale"),
        array('Garanzia MADICO — 10 Anni', 'garanzia-madico', 'Tutte le pellicole MADICO distribuite da Solaris Films sono coperte da garanzia del produttore fino a 10 anni. La garanzia copre difetti di fabbricazione, delaminazione, cambio colore e bolle d\'aria. Installazione professionale richiesta per validare la garanzia.', "Garanzia produttore fino a 10 anni\nCopre difetti di fabbricazione\nCopre delaminazione e cambio colore\nInstallazione professionale richiesta"),
        array('Normativa Pellicole Auto', 'normativa-pellicole-auto', 'La normativa italiana regola l\'applicazione di pellicole sui vetri delle automobili. E consentita l\'applicazione su lunotto e vetri posteriori senza limitazioni di trasmissione luminosa. Per il parabrezza e i vetri anteriori laterali valgono limiti specifici di VLT.', "Regolamentazione vetri auto\nLiberta per lunotto e vetri posteriori\nLimiti VLT per parabrezza e anteriori\nControlli in sede di revisione"),
        array('Come Funzionano le Pellicole per Vetri', 'come-funzionano-pellicole', 'Le pellicole per vetri funzionano attraverso diversi meccanismi: riflessione, assorbimento e trasmissione selettiva della radiazione solare. A seconda della tecnologia (metallizzata, sputtered, spettro-selettiva), le pellicole selezionano quali lunghezze d\'onda far passare e quali bloccare.', "Riflessione della radiazione solare\nAssorbimento selettivo\nTrasmissione controllata\nDiverse tecnologie per diverse esigenze"),
        array('Vantaggi delle Pellicole Antisolari', 'vantaggi-pellicole-antisolari', 'Le pellicole antisolari offrono numerosi vantaggi: riduzione del calore fino al 94%, blocco dei raggi UV oltre il 99%, risparmio energetico significativo, protezione degli arredi dallo sbiadimento, riduzione dell\'abbagliamento e miglioramento del comfort visivo.', "Riduzione calore fino al 94%\nBlocco UV oltre il 99%\nRisparmio energetico significativo\nProtezione arredi dallo sbiadimento"),
        array('Manutenzione Pellicole per Vetri', 'manutenzione-pellicole', 'La manutenzione delle pellicole MADICO e semplice: pulizia con acqua e detergente neutro, panno morbido non abrasivo. Evitare prodotti aggressivi o pagliette. Le pellicole con trattamento antigraffio richiedono ancora meno manutenzione. La corretta manutenzione garantisce prestazioni ottimali per tutta la durata della garanzia.', "Pulizia con acqua e detergente neutro\nPanno morbido non abrasivo\nEvitare prodotti aggressivi\nManutenzione minima garantisce lunga durata"),
    );

    foreach ($info as $i) {
        if (get_page_by_path($i[1], OBJECT, 'pagina_info')) continue;
        $id = wp_insert_post(array(
            'post_type'    => 'pagina_info',
            'post_title'   => $i[0],
            'post_name'    => $i[1],
            'post_content' => $i[2],
            'post_status'  => 'publish',
        ));
        if ($id && !is_wp_error($id)) {
            update_post_meta($id, 'punti_chiave', $i[3]);
            $count++;
        }
    }
    return $count;
}

function solaris_import_pagine_statiche() {
    $count = 0;
    $pages = array(
        array('Home', 'home', '', 'front-page.php'),
        array('Servizi', 'servizi', 'Solaris Films offre una gamma completa di servizi professionali per la protezione dei vetri. Installazione di pellicole antisolari, di sicurezza, anti-esplosione, privacy e decorative MADICO. Sopralluogo gratuito in tutta Italia.', ''),
        array('Chi Siamo', 'chi-siamo', 'Solaris Films e il distributore esclusivo MADICO USA per l\'Italia dal 1985. Con oltre 40 anni di esperienza e piu di 45.000 edifici trattati, siamo il punto di riferimento nazionale per le pellicole per vetri professionali. Certificazione ISO 9001, installatori formati direttamente da MADICO.', ''),
        array('Contatti', 'contatti', '', 'page-contatti.php'),
        array('Preventivo', 'preventivo', '', 'page-preventivo.php'),
        array('Guida Tecnica', 'guida-tecnica', 'Guida completa alle pellicole per vetri: tipologie, tecnologie, normative e vantaggi. Tutto quello che devi sapere per scegliere la pellicola giusta per le tue esigenze.', ''),
        array('Profilo Aziendale', 'profilo-solaris', 'Solaris Films S.r.l. e stata fondata nel 1985 con la missione di portare in Italia la tecnologia MADICO per la protezione dei vetri. Oggi siamo il distributore esclusivo per Italia e Spagna.', ''),
        array('Privacy Policy', 'privacy-policy', 'Informativa sulla privacy ai sensi del Regolamento UE 2016/679 (GDPR). Solaris Films S.r.l. tratta i dati personali nel rispetto della normativa vigente.', ''),
    );

    foreach ($pages as $pg) {
        if (get_page_by_path($pg[1])) continue;
        $id = wp_insert_post(array(
            'post_type'    => 'page',
            'post_title'   => $pg[0],
            'post_name'    => $pg[1],
            'post_content' => $pg[2],
            'post_status'  => 'publish',
        ));
        if ($id && !is_wp_error($id)) {
            if (!empty($pg[3])) {
                update_post_meta($id, '_wp_page_template', $pg[3]);
            }
            $count++;
        }
    }
    return $count;
}
