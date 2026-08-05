# Solarisfilms.es - Preflight pubblicazione live WP integrale

Data: 2026-08-05  
Ambito: `solarisfilms.es` / `www.solarisfilms.es`  
Esito: **NO-GO temporaneo** per pubblicazione live.

## Sintesi

La pubblicazione live WordPress integrale non va eseguita adesso. Il dominio `.es` risulta in blocco registrar per verifica contatto, HTTPS non risponde e non esiste un endpoint WordPress raggiungibile sul dominio. Il payload WordPress preparato contiene 78 URL, ma tutti sono marcati come bloccati prima della pubblicazione e solo 7 hanno HTML seed importabile subito come bozza.

Questa verifica non ha toccato `solarisfilms.it`, DNS, WordPress live, Vercel o FilmOps.

## Verifiche eseguite

### DNS

Record osservati:

| Host | Tipo | Valore |
| --- | --- | --- |
| `solarisfilms.es` | A | `212.123.41.108` |
| `www.solarisfilms.es` | A | `212.123.41.108` |
| `crm.solarisfilms.es` | A | `212.123.41.108` |

Note:

- `crm.solarisfilms.es` non punta ancora al tenant FilmOps.
- Apex e `www` puntano allo stesso IP.

### HTTP / HTTPS

`http://solarisfilms.es/` e `http://www.solarisfilms.es/` rispondono con una pagina di blocco:

> Verification of Contact Information

Il testo indica che il dominio è temporaneamente in hold per mancata o incompleta verifica dell'email del registrante secondo regole ICANN.

`https://solarisfilms.es/` e `https://www.solarisfilms.es/` non rispondono entro timeout: SSL/live HTTPS non è utilizzabile ora.

### WordPress REST

`/wp-json/` su apex e `www` non espone WordPress:

- `http://solarisfilms.es/wp-json/` => 404
- `http://www.solarisfilms.es/wp-json/` => 404

Conclusione: il dominio non sta servendo un WordPress pronto.

### Payload contenuti WP

File verificato:

- `docs/solaris-es/solarisfilms-es-wp-import-payload-2026-08-05.json`

Conteggi:

| Tipo | Conteggio |
| --- | ---: |
| `page` | 8 |
| `focus_tecnico` | 15 |
| `producto` | 21 |
| `pagina_info` | 10 |
| `servicio_local` | 14 |
| `articulo` | 10 |
| **Totale** | **78** |

Stato:

- `publish_blocked_until_review`: 78/78
- `draft_import_ready`: 7/78

Le 7 pagine importabili subito come bozze sono:

- `/`
- `/servicios/`
- `/productos/`
- `/company-profile/`
- `/presupuesto/`
- `/contacto/`
- `/certificado-de-seguridad/`

Lo script di import è sicuro per impostazione:

- dry-run di default;
- con `--apply` crea solo `draft`;
- non pubblica mai;
- salta slug esistenti;
- lascia vuoti i campi Orchestra.

### Credenziali import

Variabili ambiente richieste dallo script:

- `SOLARIS_ES_WP_URL`
- `SOLARIS_ES_WP_USER`
- `SOLARIS_ES_WP_APP_PASSWORD`

Stato attuale: non impostate.

### CRM

Tenant FilmOps `.es` già documentato:

- `https://solarisfilm-es.app.filmops.app/`

Form pubblici verificati in precedenza:

- preventivo: `https://solarisfilm-es.app.filmops.app/forms/film-quote-request`
- visita tecnica: `https://solarisfilm-es.app.filmops.app/forms/site-survey-request`
- ficha cliente: `https://solarisfilm-es.app.filmops.app/forms/billing-profile`

Da completare prima del live:

- `crm.solarisfilms.es` verso tenant FilmOps;
- i18n cornice pubblica form FilmOps;
- test invio lead con marker eliminabile;
- consenso privacy `.es`.

## Bloccanti live

1. Dominio in hold per verifica registrante.
2. HTTPS non funzionante.
3. Nessun WordPress raggiungibile su `solarisfilms.es`.
4. Credenziali WP REST non disponibili.
5. Dati societari definitivi mancanti: ragione sociale costituita, CIF/NIF, indirizzo.
6. Telefono e WhatsApp `.es` mancanti.
7. Privacy/cookie policy `.es` non pronte.
8. Normativa spagnola non validata sulle pagine sicurezza, garanzia e QR.
9. 71 contenuti su 78 non hanno HTML seed pronto.
10. Tutti i 78 contenuti sono marcati come bloccati prima della pubblicazione.

## Sequenza corretta per andare live

### Fase 1 - Sblocco dominio

1. Completare verifica email registrante presso provider/registrar.
2. Confermare che la pagina ICANN hold sparisca.
3. Fare snapshot DNS completo.
4. Decidere canonical: consigliato `https://www.solarisfilms.es/`.

### Fase 2 - WordPress

1. Creare o confermare installazione WordPress `.es` separata.
2. Impostare lingua `es_ES`, timezone, permalink.
3. Tenere staging/noindex finché non si chiude QA.
4. Registrare CPT richiesti:
   - `producto`
   - `focus_tecnico`
   - `pagina_info`
   - `servicio_local`
5. Verificare REST API e Application Password.

### Fase 3 - Import controllato

1. Eseguire dry-run.
2. Import pilota di 1-2 pagine come draft.
3. Verificare editor, permalink, template, noindex.
4. Importare le 7 pagine core pronte come draft.
5. Completare o generare HTML seed per i restanti 71 contenuti.
6. Importare i restanti contenuti sempre come draft.

### Fase 4 - Revisione

1. Sostituire tutti i placeholder.
2. Completare dati società, contatti e footer.
3. Validare testi normativi spagnoli.
4. Collegare CRM `.es`.
5. Verificare prodotti, immagini, schede tecniche e download.
6. Controllare link interni e CTA.
7. Generare sitemap solo con pagine pubblicabili.

### Fase 5 - Go-live

1. Backup files/database.
2. SSL per apex e `www`.
3. Redirect apex -> `www`.
4. Robots produzione indicizzabile solo al momento del live.
5. Sitemap inviata a Search Console `.es`.
6. Crawl post-live.
7. Monitor 404/500 per 72 ore.

## Dati necessari da James

- Conferma avvenuto sblocco dominio.
- Hosting WP finale o accesso admin WP `.es`.
- Application Password WP REST.
- Conferma canonical `www`.
- Dati societari definitivi o placeholder da non pubblicare.
- Telefono e WhatsApp `.es`.
- Decisione se pubblicare MVP di 7 pagine core o aspettare tutti i 78 contenuti.
- Conferma legale/privacy/cookie per Spagna.

## Decisione consigliata

Non andare live oggi. Usare il tempo per:

1. sbloccare dominio;
2. predisporre WordPress `.es` in noindex;
3. importare bozze;
4. completare i contenuti principali;
5. pubblicare solo quando 0 placeholder, 0 problemi SSL, 0 link rotti e form testati.

