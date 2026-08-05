# Solarisfilms.es - Runbook operativo WP live

Data: 2026-08-05  
Ambito: pubblicazione `solarisfilms.es` come sito WordPress integrale.  
Stato: preparato, non eseguito.

## Regola principale

Non pubblicare pagine vuote, skeleton, placeholder o contenuti non revisionati. Il sito `.es` deve nascere come WordPress autonomo, noindex durante lavorazione, indicizzabile solo dopo QA.

## Stato di partenza verificato

- Dominio attualmente in hold registrar per verifica contatto.
- HTTP mostra pagina `Verification of Contact Information`.
- HTTPS non risponde.
- `/wp-json/` non espone WordPress.
- Payload WP pronto: 78 URL.
- Import ready senza skeleton: 78 URL.
- 7 URL hanno contenuto seed manuale.
- 71 URL hanno bozza generata da template editoriale e richiedono revisione prima del publish.
- Tutti i contenuti sono marcati `publish_blocked_until_review: true`.
- Nessuna occorrenza contenuto di LCD, fotocromatiche o Tecnosolar nel payload `.es`.
- Unico placeholder rilevato nel payload: pagina `/contacto/` con telefono, WhatsApp, email, indirizzo.

## Pista A - MVP pubblicabile

Obiettivo: andare online con un sito piccolo ma corretto.

Include solo quando revisionate:

- `/`
- `/servicios/`
- `/productos/`
- `/company-profile/`
- `/presupuesto/`
- `/contacto/`
- `/certificado-de-seguridad/`
- `/lo-sabias/` solo se popolata con almeno articoli starter revisionati.

Condizioni minime:

- dominio sbloccato;
- WordPress raggiungibile;
- SSL valido;
- dati società definitivi o testi senza dati societari non confermati;
- telefono/WhatsApp/email reali;
- privacy e cookie policy pubblicabili;
- form FilmOps `.es` testato;
- robots aperto solo dopo QA;
- sitemap con sole pagine pubblicate.

## Pista B - WP integrale completo

Obiettivo: pubblicare tutti i 78 URL iniziali.

Richiede completamento prima del publish:

- 15 focus tecnici con copy spagnolo naturale;
- 21 prodotti con dati tecnici, immagini e schede verificati;
- 10 pagine info con normativa spagnola validata;
- 14 pagine locali con aree realmente servite;
- 10 articoli starter scritti per intenti locali;
- link interni e CTA coerenti;
- schema/metadata separati per `.es`;
- nessun contenuto italiano residuo;
- zero placeholder.

Le 78 URL possono essere importate in WordPress come bozze. Questo non equivale a publish: le bozze template-generated sono un punto di partenza editoriale, non contenuto finale.

## Passo 1 - Sblocco dominio

Il provider/registrar deve rimuovere l'hold ICANN.

Verifica:

```powershell
curl.exe -I http://solarisfilms.es/
curl.exe -I http://www.solarisfilms.es/
```

Stop se compare ancora:

```txt
Verification of Contact Information
```

## Passo 2 - WordPress separato

Configurazione consigliata:

- installazione WordPress dedicata a `.es`;
- lingua `es_ES`;
- timezone Spagna/Canarie da decidere;
- permalink post name;
- staging/noindex fino al go-live;
- tema Solaris 1:1 adattato;
- plugin minimi;
- Orchestra come plugin/funzione, non badge hardcoded nel tema.

Tema preparato nel repo:

```txt
wordpress/solaris-es-theme/
```

Installazione prevista:

1. comprimere o copiare `wordpress/solaris-es-theme/` in `wp-content/themes/solaris-es-theme/`;
2. attivare il tema `Solaris Films ES`;
3. creare il menu principale da Aspetto > Menu oppure usare il fallback del tema;
4. dopo import della pagina `/`, andare in Impostazioni > Lettura e impostare la pagina `home` come homepage statica;
5. configurare solo dati reali per telefono, WhatsApp e indirizzo. Se non sono presenti, il tema li nasconde;
6. non inserire badge AEO Orchestra nel tema: deve arrivare dal plugin Orchestra.

REST deve rispondere:

```powershell
curl.exe -I https://www.solarisfilms.es/wp-json/
```

Atteso:

- 200 o 401 se protetto, ma non 404 statico e non timeout.

## Passo 3 - CPT

Devono esistere prima dell'import:

| Post type | Endpoint REST atteso |
| --- | --- |
| `page` | `/wp-json/wp/v2/pages` |
| `articulo` | `/wp-json/wp/v2/posts` |
| `producto` | `/wp-json/wp/v2/producto` |
| `pagina_info` | `/wp-json/wp/v2/pagina_info` |
| `servicio_local` | `/wp-json/wp/v2/servicio_local` |

Le 15 pagine focus tecniche sono importate come Pages top-level, non come CPT, per mantenere URL come `/peliculas-antisolares/`.

Se gli endpoint hanno nomi diversi, impostare `SOLARIS_ES_CPT_ENDPOINTS`.

Mu-plugin preparato nel repo:

```txt
wordpress/mu-plugins/solaris-es-content-types.php
```

Installazione prevista:

1. copiare il file in `wp-content/mu-plugins/` del WordPress `.es`;
2. aprire una volta Permalink in WP admin e salvare, oppure eseguire `wp rewrite flush`;
3. verificare gli endpoint REST dei CPT.

## Passo 3B - Kit installazione locale

Per preparare una cartella installabile con tema e mu-plugin:

```powershell
node scripts\solaris-es-package-wp-kit.js
```

Output locale:

```txt
wordpress/solaris-es-install-kit/
```

La cartella contiene:

- `wp-content/themes/solaris-es-theme/`
- `wp-content/mu-plugins/solaris-es-content-types.php`
- `manifest.json` con checksum SHA-256 dei file.

Il kit e solo un artefatto locale di installazione. Non pubblica, non scrive su WordPress e non modifica DNS.

## Passo 4 - Credenziali import

Impostare solo nella shell locale, senza committarle:

```powershell
$env:SOLARIS_ES_WP_URL="https://www.solarisfilms.es"
$env:SOLARIS_ES_WP_USER="admin-user"
$env:SOLARIS_ES_WP_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
```

## Passo 5 - Dry-run

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js
```

Atteso oggi:

- `mode: dry-run`;
- `total: 78`;
- nessuna scrittura.

Preflight completo prima del dry-run su WordPress:

```powershell
node scripts\solaris-es-preflight-check.js
```

Lo script deve tornare `go: true` prima di qualunque pubblicazione. Durante la fase dominio bloccato e staging incompleto e normale che segnali blocker.

Il payload attuale contiene 78 bozze import-ready. Non usare `--include-skeletons` come flusso standard: serve solo per debug su payload futuri incompleti.

## Passo 5B - Readiness WordPress

Prima di qualunque import con `--apply`, verificare che WordPress `.es` esponga REST, CPT e slug senza collisioni:

```powershell
node scripts\solaris-es-wp-readiness-check.js
```

Con credenziali configurate, il controllo collisioni include anche bozze e contenuti privati:

```powershell
$env:SOLARIS_ES_WP_URL="https://www.solarisfilms.es"
$env:SOLARIS_ES_WP_USER="admin-user"
$env:SOLARIS_ES_WP_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
node scripts\solaris-es-wp-readiness-check.js
```

Acceptance prima dell'import:

- `wp-json` raggiungibile;
- tipi `page`, `post`, `producto`, `pagina_info`, `servicio_local` disponibili;
- endpoint REST coerenti;
- 0 collisioni slug, salvo skip intenzionali documentati;
- `go: true`.

## Passo 6 - Import pilota bozze

Solo dopo REST e credenziali valide:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --apply --type page --limit 2
```

Verifica in WordPress:

- stato `draft`;
- permalink corretto;
- editor leggibile;
- noindex/staging attivo;
- campi Orchestra vuoti;
- nessuna pagina in sitemap.

## Passo 7 - Import core bozze

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --apply --type page
```

Non pubblicare ancora.

## Passo 8 - Import completo

Da fare solo dopo completamento contenuti. Il comando crea comunque bozze: la pubblicazione resta manuale e separata.

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --apply
```

Nota: questo comando prepara l'editor WordPress, non manda live il sito.

## Passo 9 - QA pre-live

Obbligatorio:

- crawl link interni;
- controllo 404;
- controllo placeholder;
- controllo canonical `.es`;
- controllo sitemap;
- controllo robots;
- controllo form CRM;
- controllo mobile;
- controllo pagine sicurezza/garanzia/QR;
- controllo pagine prodotto;
- controllo footer e contatti.

Asset SEO preview:

```powershell
node scripts\solaris-es-build-seo-assets.js
```

Output locale:

```txt
docs/solaris-es/generated/solarisfilms-es-sitemap-candidate.xml
docs/solaris-es/generated/solarisfilms-es-robots-staging-preview.txt
docs/solaris-es/generated/solarisfilms-es-robots-production-preview.txt
docs/solaris-es/generated/solarisfilms-es-url-publication-preview.csv
docs/solaris-es/generated/solarisfilms-es-seo-assets-summary.json
```

Questi file sono preview: non vanno caricati su WordPress finche il QA non e verde e James non approva il go-live. La sitemap candidate esclude automaticamente URL con placeholder o termini esclusi rilevati dal payload.

QA automatizzato preparato:

```powershell
node scripts\solaris-es-post-import-qa.js
```

Questo controllo e offline: legge il payload, segnala duplicati, placeholder, termini esclusi e contenuti non pronti. Non visita il sito e non scrive su WordPress.

Dopo installazione WordPress, import bozze e pubblicazione controllata su staging `.es`, usare:

```powershell
node scripts\solaris-es-post-import-qa.js --live --base https://www.solarisfilms.es --out docs\solaris-es\solarisfilms-es-post-import-qa-latest.json
```

Acceptance prima del go-live pubblico:

- `go: true`;
- 0 URL con status diverso da 200;
- 0 placeholder;
- 0 termini esclusi;
- 0 pagine che mostrano hold registrar, 404 o copia "pagina non trovata";
- ogni pagina pubblicata ha almeno `<title>` e `<h1>`.

## Passo 10 - Go-live

Solo dopo QA:

1. backup database e files;
2. snapshot DNS;
3. SSL valido;
4. redirect apex -> `www`;
5. robots indicizzabile;
6. sitemap inviata;
7. Search Console verificata;
8. monitor errori 72 ore.

## Stop immediato

Fermarsi se:

- dominio ancora in hold;
- HTTPS non funziona;
- WP REST non risponde;
- pagine draft entrano in sitemap;
- placeholder visibili;
- pagine normative non revisionate;
- form CRM non testato;
- contenuti italiani residui;
- pagine LCD/fotocromatiche/Tecnosolar rientrano nel sito.
