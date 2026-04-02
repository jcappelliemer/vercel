<?php
/**
 * Solaris Films — SEO Agent Orchestra (WP Admin Dashboard)
 * Dashboard multi-agente AI per ottimizzazione SEO, integrata nel pannello admin WP.
 */

// Aggiungi voce menu admin
function solaris_seo_menu() {
    add_menu_page(
        'SEO Orchestra',
        'SEO Orchestra',
        'manage_options',
        'solaris-seo',
        'solaris_seo_page',
        'dashicons-chart-area',
        30
    );
}
add_action('admin_menu', 'solaris_seo_menu');

// Registra setting per API URL
function solaris_seo_register_settings() {
    register_setting('solaris_seo_group', 'solaris_seo_api_url', 'esc_url_raw');
}
add_action('admin_init', 'solaris_seo_register_settings');

// Enqueue scripts per la pagina SEO
function solaris_seo_enqueue($hook) {
    if ($hook !== 'toplevel_page_solaris-seo') return;
    wp_enqueue_style('solaris-seo-css', get_template_directory_uri() . '/css/seo-dashboard.css', array(), '1.0.0');
    wp_enqueue_script('solaris-seo-js', get_template_directory_uri() . '/js/seo-dashboard.js', array('jquery'), '1.0.0', true);
    wp_localize_script('solaris-seo-js', 'solarisSEO', array(
        'apiUrl' => get_option('solaris_seo_api_url', ''),
        'nonce'  => wp_create_nonce('solaris_seo_nonce'),
    ));
}
add_action('admin_enqueue_scripts', 'solaris_seo_enqueue');

// Pagina admin
function solaris_seo_page() {
    ?>
    <div class="wrap solaris-seo-wrap">
        <div class="seo-header">
            <h1><span class="dashicons dashicons-chart-area"></span> SEO Agent Orchestra</h1>
            <p class="seo-subtitle">Sistema multi-agente AI per ottimizzazione SEO automatica</p>
        </div>

        <!-- Config Bar -->
        <div class="seo-config-bar">
            <form method="post" action="options.php" class="seo-config-form">
                <?php settings_fields('solaris_seo_group'); ?>
                <label for="solaris_seo_api_url"><strong>API URL Backend:</strong></label>
                <input type="url" id="solaris_seo_api_url" name="solaris_seo_api_url" 
                       value="<?php echo esc_attr(get_option('solaris_seo_api_url', '')); ?>" 
                       class="regular-text" placeholder="https://tuodominio.com">
                <?php submit_button('Salva', 'secondary', 'submit', false); ?>
                <span class="seo-config-hint">L'URL del backend FastAPI dove girano gli agenti SEO</span>
            </form>
        </div>

        <!-- Tabs -->
        <div class="seo-tabs" id="seo-tabs">
            <button class="seo-tab active" data-tab="orchestrate">
                <span class="dashicons dashicons-networking"></span> Orchestra AI
            </button>
            <button class="seo-tab" data-tab="analyze">
                <span class="dashicons dashicons-search"></span> Analisi SEO
            </button>
            <button class="seo-tab" data-tab="meta">
                <span class="dashicons dashicons-tag"></span> Genera Meta
            </button>
            <button class="seo-tab" data-tab="local">
                <span class="dashicons dashicons-location"></span> Local SEO
            </button>
            <button class="seo-tab" data-tab="content">
                <span class="dashicons dashicons-edit-large"></span> Genera Contenuto
            </button>
            <button class="seo-tab" data-tab="reports">
                <span class="dashicons dashicons-clipboard"></span> Storico
            </button>
        </div>

        <div class="seo-main">
            <!-- Form Panel -->
            <div class="seo-form-panel">

                <!-- Orchestra AI -->
                <div class="seo-panel active" id="panel-orchestrate">
                    <h2>Orchestra AI</h2>
                    <p class="description">L'orchestratore analizza la tua richiesta e attiva automaticamente gli agenti necessari.</p>
                    <table class="form-table">
                        <tr>
                            <th><label>Tipo richiesta</label></th>
                            <td><input type="text" id="orch-type" class="regular-text" placeholder="nuova_pagina_citta, ottimizzazione_prodotto, audit_seo..."></td>
                        </tr>
                        <tr>
                            <th><label>Descrizione</label></th>
                            <td><textarea id="orch-details" rows="4" style="width:100%;" placeholder="Descrivi cosa vuoi ottenere..."></textarea></td>
                        </tr>
                    </table>
                    <button class="button button-primary button-hero seo-submit" data-action="orchestrate">
                        <span class="dashicons dashicons-controls-play"></span> Esegui Orchestra
                    </button>
                </div>

                <!-- Analisi SEO -->
                <div class="seo-panel" id="panel-analyze">
                    <h2>Analisi SEO</h2>
                    <p class="description">Analizza il contenuto di una pagina e ricevi un punteggio SEO con problemi e suggerimenti.</p>
                    <table class="form-table">
                        <tr>
                            <th><label>URL pagina</label></th>
                            <td><input type="text" id="analyze-url" class="regular-text" placeholder="/prodotti/antisolari"></td>
                        </tr>
                        <tr>
                            <th><label>Contenuto</label></th>
                            <td><textarea id="analyze-content" rows="6" style="width:100%;" placeholder="Incolla il testo della pagina..."></textarea></td>
                        </tr>
                    </table>
                    <button class="button button-primary button-hero seo-submit" data-action="analyze">
                        <span class="dashicons dashicons-search"></span> Analizza
                    </button>
                </div>

                <!-- Genera Meta -->
                <div class="seo-panel" id="panel-meta">
                    <h2>Genera Meta Tags</h2>
                    <p class="description">Genera meta title, description, keywords e Open Graph tags ottimizzati.</p>
                    <table class="form-table">
                        <tr>
                            <th><label>Titolo pagina</label></th>
                            <td><input type="text" id="meta-title" class="regular-text" placeholder="Pellicole Antisolari MADICO"></td>
                        </tr>
                        <tr>
                            <th><label>Tipo pagina</label></th>
                            <td>
                                <select id="meta-type">
                                    <option value="prodotto">Prodotto</option>
                                    <option value="servizio">Servizio</option>
                                    <option value="focus_tecnico">Focus Tecnico</option>
                                    <option value="pagina_info">Pagina Informativa</option>
                                    <option value="blog">Blog / Articolo</option>
                                    <option value="homepage">Homepage</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th><label>Keywords target</label></th>
                            <td><input type="text" id="meta-keywords" class="regular-text" placeholder="pellicole antisolari, risparmio energetico, MADICO"></td>
                        </tr>
                    </table>
                    <button class="button button-primary button-hero seo-submit" data-action="meta">
                        <span class="dashicons dashicons-tag"></span> Genera Meta
                    </button>
                </div>

                <!-- Local SEO -->
                <div class="seo-panel" id="panel-local">
                    <h2>Local SEO</h2>
                    <p class="description">Genera contenuto SEO ottimizzato per una specifica città.</p>
                    <table class="form-table">
                        <tr>
                            <th><label>Città</label></th>
                            <td><input type="text" id="local-city" class="regular-text" placeholder="Roma, Milano, Firenze..."></td>
                        </tr>
                    </table>
                    <button class="button button-primary button-hero seo-submit" data-action="local">
                        <span class="dashicons dashicons-location"></span> Genera Local SEO
                    </button>
                </div>

                <!-- Genera Contenuto -->
                <div class="seo-panel" id="panel-content">
                    <h2>Genera Contenuto</h2>
                    <p class="description">Genera un articolo/pagina SEO completo con sezioni, FAQ e meta tags.</p>
                    <table class="form-table">
                        <tr>
                            <th><label>Argomento</label></th>
                            <td><input type="text" id="content-topic" class="regular-text" placeholder="Vantaggi delle pellicole antisolari per uffici"></td>
                        </tr>
                        <tr>
                            <th><label>Keywords target</label></th>
                            <td><input type="text" id="content-keywords" class="regular-text" placeholder="pellicole uffici, risparmio energetico"></td>
                        </tr>
                    </table>
                    <button class="button button-primary button-hero seo-submit" data-action="content">
                        <span class="dashicons dashicons-edit-large"></span> Genera Contenuto
                    </button>
                </div>

                <!-- Storico -->
                <div class="seo-panel" id="panel-reports">
                    <h2>Storico Report</h2>
                    <p class="description">Ultimi report SEO generati dagli agenti.</p>
                    <button class="button button-primary seo-submit" data-action="reports">
                        <span class="dashicons dashicons-update"></span> Carica Storico
                    </button>
                </div>

            </div>

            <!-- Results Panel -->
            <div class="seo-results-panel">
                <div id="seo-loading" style="display:none;">
                    <div class="seo-spinner"></div>
                    <p>Gli agenti AI stanno lavorando...</p>
                </div>
                <div id="seo-error" style="display:none;"></div>
                <div id="seo-results">
                    <div class="seo-empty">
                        <span class="dashicons dashicons-chart-area"></span>
                        <p>Compila il form e premi il pulsante per attivare gli agenti AI</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
}
