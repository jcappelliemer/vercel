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

    // ===== IMPORT FOCUS TECNICI =====
    $focus_tecnici = array(
        array('title' => 'Pellicole Antisolari Sputtered', 'slug' => 'pellicole-antisolari-sputtered', 'content' => 'Le pellicole sputtered sono prodotte con la tecnica della polverizzazione catodica (sputtering). Questa tecnologia permette di depositare metalli nobili in strati sottilissimi sulla superficie del poliestere, ottenendo prestazioni superiori in termini di riflessione solare e trasmissione luminosa.', 'meta' => array('categoria' => 'Antisolari', 'caratteristiche' => "Massime prestazioni di riflessione solare\nAspetto neutro o semi-riflettente\nGaranzia 10 anni per installazione esterna\nStruttura a 75 micron con protezione antigraffio a 2 strati")),
        array('title' => 'Pellicole Antisolari Sunscape', 'slug' => 'pellicole-antisolari-sunscape', 'content' => 'Le pellicole Sunscape sono tinte nella massa con pigmenti colorati. Offrono un aspetto piu naturale rispetto alle sputtered, ideali per applicazioni residenziali dove si desidera un effetto discreto.', 'meta' => array('categoria' => 'Antisolari', 'caratteristiche' => "Aspetto naturale e discreto\nIdeali per residenziale\nGaranzia 10 anni per installazione esterna\nAmpia gamma di tonalita disponibili")),
        array('title' => 'Pellicole Oscuranti per Vetri', 'slug' => 'pellicole-oscuranti-per-vetri', 'content' => 'Le pellicole oscuranti hanno un alto fattore di riduzione luminosa. Sono ideali per ambienti che necessitano di oscuramento come sale proiezione, sale server, laboratori e ambienti medicali.', 'meta' => array('categoria' => 'Antisolari', 'caratteristiche' => "Alto fattore di oscuramento\nIdeali per sale proiezione e laboratori\nProtezione UV 99%\nRiduzione abbagliamento totale")),
        array('title' => 'Pellicole Riflettenti', 'slug' => 'pellicole-riflettenti', 'content' => "Le pellicole riflettenti hanno una superficie metallizzata che riflette la radiazione solare, riducendo drasticamente il calore trasmesso. Offrono anche privacy diurna grazie all'effetto specchio.", 'meta' => array('categoria' => 'Antisolari', 'caratteristiche' => "Massima riflessione solare\nEffetto specchio per privacy diurna\nRiduzione calore fino all'85%\nDisponibili in argento, bronzo e neutro")),
        array('title' => 'Pellicole Spettro-selettive', 'slug' => 'pellicole-spettro-selettive', 'content' => "Le pellicole spettro-selettive rappresentano l'ultima frontiera della tecnologia antisolare. Riflettono selettivamente la componente IR senza alterare significativamente la trasmissione luminosa visibile.", 'meta' => array('categoria' => 'Antisolari', 'caratteristiche' => "Massima luce naturale mantenuta\nRiflessione selettiva IR\nAspetto quasi invisibile\nIdeali per edifici storici e musei")),
        array('title' => 'Pellicole Antigraffiti — Serie Graffiti Free', 'slug' => 'pellicole-antigraffiti-per-vetri', 'content' => 'Le pellicole antigraffiti della serie Graffiti Free proteggono le vetrate da graffi, incisioni e atti vandalici. In caso di danno, la pellicola viene semplicemente rimossa e sostituita, preservando il vetro sottostante.', 'meta' => array('categoria' => 'Speciali', 'caratteristiche' => "Protezione da graffi e incisioni\nSostituibile senza danni al vetro\nTrasparenza totale\nIdeale per vetrine, mezzi pubblici e ascensori")),
        array('title' => 'Pellicole Termoisolanti', 'slug' => 'pellicole-termoisolanti', 'content' => "Le pellicole termoisolanti migliorano l'isolamento termico dei vetri sia in estate che in inverno. Riducono la dispersione di calore in inverno e il surriscaldamento in estate.", 'meta' => array('categoria' => 'Antisolari', 'caratteristiche' => "Isolamento invernale ed estivo\nRiduzione dispersione termica\nMiglioramento classe energetica\nIdeali per vetri singoli non performanti")),
        array('title' => 'Pellicole di Sicurezza', 'slug' => 'pellicole-di-sicurezza', 'content' => 'Le pellicole di sicurezza rinforzano il vetro per impedirne la frantumazione. Certificate UNI EN 12600, trasformano qualsiasi vetro in vetro di sicurezza conforme al D.Lgs. 81/2008.', 'meta' => array('categoria' => 'Sicurezza', 'caratteristiche' => "Certificazione UNI EN 12600\nClasse 1B1 e 2B2\nConformita D.Lgs. 81/2008\nInstallazione non invasiva")),
        array('title' => 'Pellicole Decorative', 'slug' => 'pellicole-decorative', 'content' => 'Le pellicole decorative permettono di personalizzare le superfici vetrate con motivi grafici, geometrici o floreali. Disponibili in numerose varianti per adattarsi a qualsiasi stile architettonico.', 'meta' => array('categoria' => 'Privacy', 'caratteristiche' => "Personalizzazione illimitata\nStampabili in alta risoluzione\nFacile sostituzione\nNumerose finiture disponibili")),
        array('title' => 'Pellicole Antisolari', 'slug' => 'pellicole-antisolari', 'content' => "Le pellicole antisolari MADICO riducono il calore trasmesso attraverso il vetro fino a 7-8 gradi, bloccano il 99% dei raggi UV e offrono un risparmio energetico del 30-50% sui costi di climatizzazione.", 'meta' => array('categoria' => 'Antisolari', 'caratteristiche' => "Riduzione temperatura fino a 8 gradi\nProtezione UV 99%\nRisparmio energetico 30-50%\nGaranzia fino a 10 anni")),
        array('title' => 'Pellicole Antisolari di Sicurezza — Serie RS', 'slug' => 'pellicole-antisolari-di-sicurezza-la-serie-rs', 'content' => 'La serie RS combina le prestazioni antisolari con quelle di sicurezza in un unico prodotto. Ideale quando serve contemporaneamente controllo solare e protezione anti-sfondamento.', 'meta' => array('categoria' => 'Antisolari + Sicurezza', 'caratteristiche' => "Doppia funzione: antisolare + sicurezza\nCertificazione UNI EN 12600\nProtezione UV e IR\nDisponibili in 4 e 8 mil")),
        array('title' => 'Pellicole Decorative Privacy', 'slug' => 'pellicole-decorative-privacy', 'content' => "Le pellicole privacy satinate rendono opachi i vetri impedendo la visione dall'esterno mantenendo la luminosita interna. Effetto vetro smerigliato professionale e duraturo.", 'meta' => array('categoria' => 'Privacy', 'caratteristiche' => "Effetto vetro smerigliato\nPrivacy garantita\nLuminosita mantenuta\nFacile manutenzione")),
        array('title' => 'Pellicole Stampabili e Vetrofanie', 'slug' => 'pellicole-antisolari-stampabili-e-vetrofanie', 'content' => 'Le pellicole stampabili e le vetrofanie permettono di comunicare, decorare e brandizzare le superfici vetrate. Ideali per vetrine, uffici, sale meeting e showroom.', 'meta' => array('categoria' => 'Privacy', 'caratteristiche' => "Stampa in alta risoluzione\nPersonalizzazione completa\nIdeali per branding e comunicazione\nFacile applicazione e rimozione")),
        array('title' => 'SafetyShield — Anti-Esplosione', 'slug' => 'pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield', 'content' => "SafetyShield by MADICO e il sistema di pellicole di sicurezza piu rigorosamente testato al mondo. Protezione contro esplosioni, intrusioni e disastri naturali con il sistema FrameGard brevettato.", 'meta' => array('categoria' => 'Sicurezza', 'caratteristiche' => "Blast Mitigation GSA 3A/3B\nAnti-intrusione ASTM F3561\nSistema FrameGard brevettato\nTestato con cariche fino a 1.100 kg")),
        array('title' => 'Pellicole di Sicurezza Neutre — Serie CL', 'slug' => 'pellicole-di-sicurezza-neutre-la-serie-cl', 'content' => "La serie CL e composta da pellicole di sicurezza neutre e trasparenti. Proteggono il vetro dalla frantumazione senza alterarne l'aspetto estetico. Ideali quando serve sicurezza senza modificare la trasparenza.", 'meta' => array('categoria' => 'Sicurezza', 'caratteristiche' => "Totalmente trasparenti\nCertificazione UNI EN 12600\nNessun impatto estetico\nDisponibili in spessori 4 e 7 mil")),
    );

    foreach ($focus_tecnici as $ft) {
        if (get_page_by_path($ft['slug'], OBJECT, 'focus_tecnico')) continue;
        $id = wp_insert_post(array(
            'post_type' => 'focus_tecnico',
            'post_title' => $ft['title'],
            'post_name' => $ft['slug'],
            'post_content' => $ft['content'],
            'post_status' => 'publish',
        ));
        if ($id && !is_wp_error($id) && isset($ft['meta'])) {
            foreach ($ft['meta'] as $key => $val) {
                update_post_meta($id, $key, $val);
            }
            $results['focus']++;
        }
    }

    // ===== IMPORT PAGINE INFO =====
    $pagine_info = array(
        array('title' => 'Norme', 'slug' => 'norme', 'content' => "<h2>Quali sono le norme delle vetrate?</h2>\n<p>Il professionista del vetro, aiutato dalle normative e dagli standard nazionali ed internazionali procede per fasi, esso valutera prima le cause di potenziale pericolo, individuera i rischi, definira la tipologia di vetro piu idonea ad evitarli ed infine elaborera misure e spessori piu adatti.</p>\n<p>Partendo dalla norma UNI 7697, mediante il quale stabilira il tipo di vetro da impiegare nel caso si voglia garantire la sicurezza delle persone, successivamente fara riferimento ad altre normative che stabiliscono determinate prestazioni in base allo specifico pericolo che il vetro stesso e soggetto.</p>\n<h3>Norme di riferimento</h3>\n<ul>\n<li><strong>UNI EN 7697</strong> — Norma cogente, prescrive le tipologie di vetro da adottare</li>\n<li><strong>UNI EN 12600</strong> — Resistenza all'impatto</li>\n<li><strong>UNI EN 356</strong> — Resistenza contro l'attacco manuale</li>\n<li><strong>UNI EN 1063</strong> — Resistenza ai proiettili</li>\n<li><strong>UNI EN 13123-1</strong> — Requisiti e classificazioni sulla resistenza all'esplosione</li>\n<li><strong>UNI EN 13124-1</strong> — Metodi di prova di resistenza all'esplosione</li>\n<li><strong>UNI EN 13541</strong> — Prove e classificazione della resistenza alla pressione causata da esplosioni</li>\n</ul>"),
        array('title' => 'Norma BRC', 'slug' => 'norma-brc', 'content' => "<h2>British Retail Consortium</h2>\n<p>La norma BRC (British Retail Consortium) e uno standard globale per la sicurezza alimentare. Richiede che le aree di produzione alimentare proteggano i prodotti dalla contaminazione da rottura del vetro.</p>\n<p>Le pellicole di sicurezza MADICO applicate sulle vetrate delle aree di produzione garantiscono la conformita alla norma BRC trattenendo i frammenti di vetro in caso di rottura.</p>"),
        array('title' => 'Sicurezza a Norma di Legge', 'slug' => 'sicurezza-a-norma-di-legge', 'content' => "<h2>D.Lgs. 81/2008 — Testo Unico sulla Sicurezza</h2>\n<p>Il D.Lgs. 81/2008 (Testo Unico sulla Sicurezza sul Lavoro) impone al datore di lavoro l'obbligo di valutare tutti i rischi per la sicurezza dei lavoratori, compreso il rischio derivante dalle superfici vetrate.</p>\n<p>Le pellicole di sicurezza rappresentano la soluzione piu rapida, economica e non invasiva per mettere a norma le vetrate, trasformando qualsiasi vetro in vetro di sicurezza certificato UNI EN 12600.</p>\n<p>L'installazione non richiede lavori strutturali, non interrompe le attivita produttive e ha un costo significativamente inferiore alla sostituzione dei vetri.</p>"),
        array('title' => 'Testo Unico sulla Salute e Sicurezza sul Lavoro', 'slug' => 'testo-unico-sulla-salute-e-sicurezza-sul-lavoro', 'content' => "<h2>D.Lgs. 81/2008</h2>\n<p>Il Testo Unico sulla Salute e Sicurezza sul Lavoro (D.Lgs. 81/2008) e la principale normativa italiana in materia di sicurezza nei luoghi di lavoro.</p>\n<p>L'articolo 64 impone che i luoghi di lavoro siano conformi ai requisiti di sicurezza, inclusa la protezione dalle superfici vetrate che possono causare lesioni in caso di rottura.</p>\n<p>Le pellicole di sicurezza certificate UNI EN 12600 sono la soluzione piu efficiente per ottemperare a questo obbligo normativo.</p>"),
        array('title' => 'Sistemi Filtranti DPR 59/09', 'slug' => 'sistemi-filtranti-dpr-59-09', 'content' => "<h2>Regolamento attuativo in materia di rendimento energetico</h2>\n<p>Il DPR 59/09 regolamenta le metodologie di calcolo e i requisiti minimi per la prestazione energetica degli edifici.</p>\n<p>Le pellicole antisolari sono classificate come \"sistemi filtranti\" e contribuiscono al miglioramento della prestazione energetica dell'edificio riducendo il carico termico estivo.</p>\n<p>L'applicazione di pellicole antisolari puo contribuire al raggiungimento dei requisiti minimi di prestazione energetica previsti dalla normativa, senza interventi strutturali.</p>"),
        array('title' => 'Istruzioni e Manutenzione', 'slug' => 'istruzioni-e-manutenzione', 'content' => "<h2>Pulizia e Manutenzione delle Pellicole per Vetri MADICO</h2>\n<p>Le pellicole Madico sono riconosciute come prodotti di alta qualita. Lo strato protettivo antigraffio superficiale protegge la pellicola dall'abrasione.</p>\n<p>Non pulire il vetro trattato con pellicola prima di 30/40 giorni dall'applicazione. Al termine dell'installazione si puo manifestare una leggera opacizzazione che puo durare circa 20/40 giorni — questo fa parte del normale processo di adesivizzazione al vetro.</p>\n<h3>Istruzioni di pulizia</h3>\n<ul>\n<li>Per eliminare impurita o granelli di polvere, lavare con getto d'acqua e leggera soluzione saponosa.</li>\n<li>Pulire con spugna sintetica non abrasiva.</li>\n<li>Usare normali soluzioni detergenti neutre a base di acqua e shampoo.</li>\n<li>Per rimuovere il detergente usare solo tergivetro morbido evitando forti pressioni.</li>\n<li>Non usare spazzole, carta o prodotti abrasivi.</li>\n<li>Non usare acetone, benzina, diluenti, acidi e solventi.</li>\n<li>Non attaccare adesivi, etichette o nastri adesivi sulla pellicola.</li>\n</ul>"),
        array('title' => 'Garanzie', 'slug' => 'garanzie', 'content' => "<h2>Garanzia Prodotti MADICO</h2>\n<p>Tutte le pellicole MADICO sono coperte da garanzia del produttore. La garanzia copre screpolature, demetalizzazioni e delaminazioni.</p>\n<h3>Durata garanzie</h3>\n<ul>\n<li><strong>Pellicole per esterno Sputtered</strong> — 10 anni</li>\n<li><strong>Pellicole per esterno Sunscape</strong> — 10 anni</li>\n<li><strong>Pellicole per interno</strong> — 10 anni</li>\n<li><strong>Pellicole SafetyShield</strong> — 10 anni</li>\n<li><strong>Pellicole di sicurezza CL</strong> — Standard</li>\n</ul>"),
        array('title' => 'Certificazione NFRC', 'slug' => 'certificazione-nfrc', 'content' => "<h2>National Fenestration Rating Council</h2>\n<p>L'NFRC (National Fenestration Rating Council) e un ente statunitense che certifica le prestazioni energetiche dei prodotti per serramenti.</p>\n<p>Le pellicole MADICO sono certificate NFRC, garantendo prestazioni energetiche verificate e certificate da un ente indipendente.</p>\n<p>La certificazione NFRC attesta valori di SHGC (Solar Heat Gain Coefficient), VT (Visible Transmittance) e U-Factor testati in laboratorio.</p>"),
        array('title' => 'I Punti di Forza', 'slug' => 'i-punti-di-forza', 'content' => "<h2>Trasparenza, Comfort e Risparmio Energetico</h2>\n<p>La trasparenza assoluta e uno dei principali punti di forza delle pellicole antisolari. Garantiscono un'elevata trasparenza evitando distorsioni ottiche poiche il loro adesivo, estremamente sottile e perfettamente uniforme, crea un corpo unico tra vetro e pellicola.</p>\n<h3>I nostri punti di forza</h3>\n<ul>\n<li><strong>Trasparenza</strong> — Elevata trasparenza senza distorsioni ottiche.</li>\n<li><strong>Comfort</strong> — Respingono fino al 94% dell'irraggiamento solare, limitando l'incremento del calore.</li>\n<li><strong>Risparmio Energetico</strong> — Consentono un risparmio del 30-50% sui costi di condizionamento.</li>\n<li><strong>Protezione</strong> — Filtrano piu del 99% dei raggi UV, proteggendo arredi e superfici.</li>\n<li><strong>Estetica</strong> — Offrono maggiore eleganza all'edificio.</li>\n<li><strong>Durata</strong> — Struttura da 75 micron con protezione antigraffio a 2 strati. Garanzia fino a 10 anni.</li>\n<li><strong>Semplicita</strong> — Non necessitano di manutenzione.</li>\n<li><strong>Praticita</strong> — Si installano rapidamente senza disturbare l'attivita lavorativa.</li>\n</ul>"),
        array('title' => 'Glossario Termini', 'slug' => 'glossario-termini', 'content' => "<h2>Terminologia Tecnica delle Pellicole per Vetri</h2>\n<p>Un glossario dei termini tecnici piu utilizzati nel settore delle pellicole per vetri.</p>\n<ul>\n<li><strong>VLT (Visible Light Transmittance)</strong> — Percentuale di luce visibile che passa attraverso il vetro trattato.</li>\n<li><strong>VLR (Visible Light Reflectance)</strong> — Percentuale di luce visibile riflessa dal vetro trattato.</li>\n<li><strong>SHGC (Solar Heat Gain Coefficient)</strong> — Frazione di energia solare che passa attraverso il vetro (valore 0-1, piu basso = migliore).</li>\n<li><strong>U-Factor</strong> — Misura della trasmissione termica attraverso il vetro. Piu basso = migliore isolamento.</li>\n<li><strong>IR (Infrarossi)</strong> — Componente invisibile della radiazione solare responsabile del trasferimento di calore.</li>\n<li><strong>UV (Ultravioletti)</strong> — Radiazione invisibile che causa sbiadimento, degrado e danni alla pelle.</li>\n<li><strong>Sputtered</strong> — Tecnica di deposizione catodica per la produzione di pellicole ad alte prestazioni.</li>\n<li><strong>Emissivita</strong> — Capacita di una superficie di emettere energia sotto forma di radiazione termica.</li>\n<li><strong>UNI EN 12600</strong> — Norma europea per la classificazione della resistenza all'impatto dei vetri.</li>\n<li><strong>Classe 1B1</strong> — Massimo livello di sicurezza. Il vetro si frattura ma la pellicola trattiene tutti i frammenti.</li>\n</ul>"),
    );

    foreach ($pagine_info as $pi) {
        if (get_page_by_path($pi['slug'], OBJECT, 'pagina_info')) continue;
        $id = wp_insert_post(array(
            'post_type' => 'pagina_info',
            'post_title' => $pi['title'],
            'post_name' => $pi['slug'],
            'post_content' => $pi['content'],
            'post_status' => 'publish',
        ));
        if ($id && !is_wp_error($id)) {
            $results['info']++;
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
        printf('Import completato: %d prodotti, %d citta, %d focus tecnici, %d pagine info, %d pagine.', $results['prodotti'], $results['citta'], $results['focus'], $results['info'], $results['pagine']);
        echo '</p></div>';
    }
    echo '<form method="post">';
    wp_nonce_field('solaris_import');
    echo '<p>Clicca per importare tutti i dati del sito (prodotti, citta, focus tecnici, pagine info, pagine). Lo script e idempotente: non crea duplicati.</p>';
    echo '<p><input type="submit" name="solaris_run_import" class="button button-primary" value="Importa Dati"></p>';
    echo '</form></div>';
}
