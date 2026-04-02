/**
 * Solaris Films — SEO Dashboard (WP Admin)
 */
jQuery(document).ready(function($) {
    var apiUrl = solarisSEO.apiUrl;

    // Tabs
    $('.seo-tab').on('click', function() {
        var tab = $(this).data('tab');
        $('.seo-tab').removeClass('active');
        $(this).addClass('active');
        $('.seo-panel').removeClass('active');
        $('#panel-' + tab).addClass('active');
        // Clear results when switching
        $('#seo-results').html('<div class="seo-empty"><span class="dashicons dashicons-chart-area"></span><p>Compila il form e premi il pulsante per attivare gli agenti AI</p></div>');
        $('#seo-error').hide();
    });

    // Copy to clipboard
    $(document).on('click', '.seo-copy-btn', function() {
        var text = $(this).data('text');
        navigator.clipboard.writeText(text).then(function() {
            var btn = $(this);
            btn.text('Copiato!');
            setTimeout(function() { btn.text('Copia'); }, 1500);
        }.bind(this));
    });

    // Submit
    $('.seo-submit').on('click', function(e) {
        e.preventDefault();
        var action = $(this).data('action');

        if (!apiUrl && action !== 'reports') {
            $('#seo-error').html('<strong>Errore:</strong> Configura l\'API URL Backend prima di usare gli agenti.').show();
            return;
        }

        var body = {};
        var endpoint = '';

        switch(action) {
            case 'orchestrate':
                endpoint = '/api/seo/orchestrate';
                body = { request_type: $('#orch-type').val(), details: $('#orch-details').val() };
                if (!body.details) { alert('Inserisci una descrizione'); return; }
                break;
            case 'analyze':
                endpoint = '/api/seo/analyze';
                body = { content: $('#analyze-content').val(), url: $('#analyze-url').val(), page_type: 'generic' };
                if (!body.content) { alert('Inserisci il contenuto da analizzare'); return; }
                break;
            case 'meta':
                endpoint = '/api/seo/generate-meta';
                var kw = $('#meta-keywords').val();
                body = { 
                    page_type: $('#meta-type').val(), 
                    page_title: $('#meta-title').val(),
                    keywords: kw ? kw.split(',').map(function(k) { return k.trim(); }) : null 
                };
                if (!body.page_title) { alert('Inserisci il titolo della pagina'); return; }
                break;
            case 'local':
                endpoint = '/api/seo/local';
                body = { city: $('#local-city').val() };
                if (!body.city) { alert('Inserisci il nome della città'); return; }
                break;
            case 'content':
                endpoint = '/api/seo/generate-content';
                var ckw = $('#content-keywords').val();
                body = { 
                    topic: $('#content-topic').val(), 
                    page_type: 'articolo',
                    target_keywords: ckw ? ckw.split(',').map(function(k) { return k.trim(); }) : null 
                };
                if (!body.topic) { alert('Inserisci l\'argomento'); return; }
                break;
            case 'reports':
                loadReports();
                return;
        }

        // Show loading
        $('#seo-loading').show();
        $('#seo-results').html('');
        $('#seo-error').hide();

        $.ajax({
            url: apiUrl + endpoint,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(body),
            timeout: 120000,
            success: function(data) {
                $('#seo-loading').hide();
                var result = data.result || data;
                renderResult(action, result);
            },
            error: function(xhr) {
                $('#seo-loading').hide();
                var msg = 'Errore nella comunicazione con il backend.';
                try { msg = JSON.parse(xhr.responseText).detail || msg; } catch(e) {}
                $('#seo-error').html('<strong>Errore:</strong> ' + msg).show();
            }
        });
    });

    function renderResult(action, result) {
        var html = '';

        if (result.error) {
            $('#seo-error').html('<strong>Errore agente:</strong> ' + result.error).show();
            return;
        }

        switch(action) {
            case 'orchestrate':
                html = renderOrchestrate(result);
                break;
            case 'analyze':
                html = renderAnalyze(result);
                break;
            case 'meta':
            case 'local':
            case 'content':
                html = renderGeneric(result);
                break;
        }

        $('#seo-results').html(html);
    }

    function renderOrchestrate(r) {
        var html = '';
        if (r.plan) {
            html += card('Strategia', '<p>' + (r.plan.strategy || '') + '</p>' +
                '<p style="margin-top:8px;"><span class="seo-tag gold">Impatto: ' + (r.plan.expected_impact || '').toUpperCase() + '</span></p>');
        }
        if (r.agent_results) {
            r.agent_results.forEach(function(ar) {
                html += '<div class="seo-agent-block">' +
                    '<div class="seo-agent-header"><strong>Agente: ' + ar.agent + '</strong><span>' + ar.task + '</span></div>' +
                    '<div class="seo-agent-body"><pre>' + JSON.stringify(ar.result, null, 2) + '</pre></div></div>';
            });
        }
        return html;
    }

    function renderAnalyze(r) {
        var html = '';
        // Score
        var scoreClass = r.score >= 70 ? 'high' : r.score >= 40 ? 'mid' : 'low';
        html += card('Punteggio SEO', 
            '<span class="seo-score ' + scoreClass + '">' + r.score + '/100</span>' +
            '<span style="margin-left:15px;color:rgba(255,255,255,0.5);font-size:13px;">Leggibilità: ' + (r.readability || '-') + ' | Lunghezza: ' + (r.content_length || '-') + '</span>'
        );
        // Issues
        if (r.issues && r.issues.length > 0) {
            var issuesHtml = '';
            r.issues.forEach(function(i) {
                issuesHtml += '<div class="seo-issue ' + i.severity + '">' +
                    '<div class="issue-text">' + i.issue + '</div>' +
                    '<div class="issue-fix">Fix: ' + i.fix + '</div></div>';
            });
            html += card('Problemi (' + r.issues.length + ')', issuesHtml);
        }
        // Missing keywords
        if (r.keywords_missing && r.keywords_missing.length > 0) {
            var tagsHtml = '<div class="seo-tags">';
            r.keywords_missing.forEach(function(kw) { tagsHtml += '<span class="seo-tag red">' + kw + '</span>'; });
            tagsHtml += '</div>';
            html += card('Keywords Mancanti', tagsHtml);
        }
        if (r.summary) {
            html += card('Riassunto', '<p>' + r.summary + '</p>');
        }
        return html;
    }

    function renderGeneric(r) {
        var html = '';
        if (r.meta_title) {
            html += card('Meta Title', 
                '<p>' + r.meta_title + ' <button class="seo-copy-btn" data-text="' + esc(r.meta_title) + '">Copia</button></p>' +
                '<p class="char-count">' + r.meta_title.length + ' caratteri</p>');
        }
        if (r.meta_description) {
            html += card('Meta Description', 
                '<p>' + r.meta_description + ' <button class="seo-copy-btn" data-text="' + esc(r.meta_description) + '">Copia</button></p>' +
                '<p class="char-count">' + r.meta_description.length + ' caratteri</p>');
        }
        if (r.h1) {
            html += card('H1', '<p><strong>' + r.h1 + '</strong> <button class="seo-copy-btn" data-text="' + esc(r.h1) + '">Copia</button></p>');
        }
        if (r.keywords && r.keywords.length > 0) {
            var khtml = '<div class="seo-tags">';
            r.keywords.forEach(function(k) { khtml += '<span class="seo-tag gold">' + k + '</span>'; });
            khtml += '</div>';
            html += card('Keywords', khtml);
        }
        if (r.og_title) {
            html += card('Open Graph', '<p><strong>OG Title:</strong> ' + r.og_title + '</p><p><strong>OG Description:</strong> ' + (r.og_description || '') + '</p>');
        }
        if (r.introduzione) {
            html += card('Introduzione', '<p>' + r.introduzione + '</p>');
        }
        if (r.sezioni && r.sezioni.length > 0) {
            var secHtml = '';
            r.sezioni.forEach(function(s) {
                secHtml += '<div style="margin-bottom:12px;"><h5 style="color:#fff;margin:0 0 4px;">' + s.h2 + '</h5><p style="font-size:12px;">' + (s.contenuto || '').substring(0, 300) + '...</p></div>';
            });
            html += card('Sezioni Contenuto (' + r.sezioni.length + ')', secHtml);
        }
        if (r.faq_locali || r.faq) {
            var faqs = r.faq_locali || r.faq;
            var fhtml = '';
            faqs.forEach(function(f) {
                fhtml += '<div class="seo-faq"><div class="faq-q">' + f.domanda + '</div><div class="faq-a">' + f.risposta + '</div></div>';
            });
            html += card('FAQ (' + faqs.length + ')', fhtml);
        }
        if (r.servizi_locali && r.servizi_locali.length > 0) {
            var slHtml = '<div class="seo-tags">';
            r.servizi_locali.forEach(function(s) { slHtml += '<span class="seo-tag blue">' + s + '</span>'; });
            slHtml += '</div>';
            html += card('Servizi Locali', slHtml);
        }
        if (r.schema_local_business) {
            html += card('Schema LocalBusiness', '<pre style="color:rgba(255,255,255,0.6);font-size:12px;">' + JSON.stringify(r.schema_local_business, null, 2) + '</pre>');
        }
        return html;
    }

    function loadReports() {
        if (!apiUrl) { 
            $('#seo-error').html('<strong>Errore:</strong> Configura l\'API URL Backend.').show(); 
            return; 
        }
        $('#seo-loading').show();
        $('#seo-results').html('');
        $.get(apiUrl + '/api/seo/reports?limit=20', function(data) {
            $('#seo-loading').hide();
            if (!data.reports || data.reports.length === 0) {
                $('#seo-results').html('<div class="seo-empty"><p>Nessun report ancora generato</p></div>');
                return;
            }
            var html = '';
            data.reports.forEach(function(r) {
                var date = r.created_at ? new Date(r.created_at).toLocaleString('it-IT') : '-';
                html += '<div class="seo-report-item">' +
                    '<span class="seo-report-type">' + (r.type || '?') + '</span>' +
                    '<span style="color:rgba(255,255,255,0.7);font-size:13px;">' + getReportTitle(r) + '</span>' +
                    '<span class="seo-report-date">' + date + '</span></div>';
            });
            $('#seo-results').html(card('Ultimi ' + data.reports.length + ' Report', html));
        }).fail(function() {
            $('#seo-loading').hide();
            $('#seo-error').html('<strong>Errore:</strong> Impossibile caricare i report.').show();
        });
    }

    function getReportTitle(r) {
        if (r.input) {
            return r.input.page_title || r.input.city || r.input.topic || r.input.request_type || r.type;
        }
        return r.type || '?';
    }

    function card(title, content) {
        return '<div class="seo-result-card"><h4>' + title + '</h4>' + content + '</div>';
    }

    function esc(str) {
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
});
