# Handoff Solarisfilms.es

Data: 2026-08-05
Branch: `agent/solaris-es-draft`
Stato: preparazione WordPress `.es`, nessuna pubblicazione live.

## Regole operative

- Non toccare `solarisfilms.it`.
- Non pubblicare `solarisfilms.es` finche il gate non e verde.
- Non caricare robots/sitemap preview su WordPress prima del QA.
- Non hardcodare il badge AEO Orchestra nel tema: deve restare funzione/plugin Orchestra.
- Non scrivere su FilmOps: un altro agente gestisce l'app. Qui restano solo requisiti e mapping.
- Import WordPress solo come `draft`; publish manuale e separato.

## Stato sintetico

Ultimo gate locale:

```txt
repo_ready: true
launch_ready: false
```

Il repository e pronto lato strumenti: payload, tema, mu-plugin, import, QA, normalizzazione spagnola, SEO preview, batch plan e launch gate esistono.

Il sito non e pronto per il live per questi blocchi:

- `/contacto/` contiene ancora `[TELEFONO_ES]`, `[WHATSAPP_ES]`, `[EMAIL_ES]`, `[DIRECCION_ES]`;
- tutte le 78 URL sono ancora `publish_blocked_until_review`;
- dominio/HTTPS/WordPress REST devono passare preflight;
- serve readiness WordPress con CPT attivi;
- serve QA live post-import.

## Payload contenuti

File:

```txt
docs/solaris-es/solarisfilms-es-wp-import-payload-2026-08-05.json
```

Conteggi:

| Tipo | Totale |
| --- | ---: |
| `page` | 23 |
| `producto` | 21 |
| `pagina_info` | 10 |
| `servicio_local` | 14 |
| `articulo` | 10 |
| Totale | 78 |

Fonte contenuti:

| Fonte | Totale |
| --- | ---: |
| `content_seed` | 7 |
| `template_generated` | 71 |

Tutte le 78 voci sono `draft_import_ready: true` e `publish_blocked_until_review: true`.

## WordPress foundation

Mu-plugin CPT:

```txt
wordpress/mu-plugins/solaris-es-content-types.php
```

Registra:

- `producto` -> `/productos/`
- `pagina_info` -> `/info/`
- `servicio_local` -> `/servicio-local/`

Le pagine focus tecniche sono WordPress Pages top-level, non CPT, per URL come:

```txt
/peliculas-antisolares/
/peliculas-antisolares-sputtered/
/peliculas-de-seguridad/
/safetyshield/
```

Tema:

```txt
wordpress/solaris-es-theme/
```

Supporta:

- `page`
- `post` usato come `articulo`
- `producto`
- `pagina_info`
- `servicio_local`

Il tema nasconde telefono, WhatsApp e indirizzo se non configurati con dati reali.

## Kit installazione

Generazione:

```powershell
node scripts\solaris-es-package-wp-kit.js
```

Output locale:

```txt
wordpress/solaris-es-install-kit/
```

Contiene:

- `wp-content/themes/solaris-es-theme/`
- `wp-content/mu-plugins/solaris-es-content-types.php`
- `manifest.json` con checksum SHA-256.

Nota: la cartella kit e ignorata da git; rigenerarla quando serve.

## Asset SEO preview

Generazione:

```powershell
node scripts\solaris-es-build-seo-assets.js
```

Output:

```txt
docs/solaris-es/generated/solarisfilms-es-sitemap-candidate.xml
docs/solaris-es/generated/solarisfilms-es-robots-staging-preview.txt
docs/solaris-es/generated/solarisfilms-es-robots-production-preview.txt
docs/solaris-es/generated/solarisfilms-es-url-publication-preview.csv
docs/solaris-es/generated/solarisfilms-es-seo-assets-summary.json
```

Stato attuale:

- 78 URL totali;
- 77 URL candidate per sitemap;
- 1 URL esclusa: `/contacto/` per placeholder;
- robots staging preview: `Disallow: /`;
- robots production preview: `Allow: /` + sitemap `.es`.

Sono preview locali, non file da caricare ora.

Per la versione effettivamente da usare dopo la configurazione dei contatti, rigenerare gli asset SEO dal payload spagnolo normalizzato:

```powershell
node scripts\solaris-es-build-seo-assets.js --payload docs\solaris-es\generated\solarisfilms-es-wp-import-payload-spanish-normalized.json --out-dir docs\solaris-es\generated\spanish-normalized-seo
```

Output normalizzato:

```txt
docs/solaris-es/generated/spanish-normalized-seo/solarisfilms-es-sitemap-candidate.xml
docs/solaris-es/generated/spanish-normalized-seo/solarisfilms-es-robots-staging-preview.txt
docs/solaris-es/generated/spanish-normalized-seo/solarisfilms-es-robots-production-preview.txt
docs/solaris-es/generated/spanish-normalized-seo/solarisfilms-es-url-publication-preview.csv
docs/solaris-es/generated/spanish-normalized-seo/solarisfilms-es-seo-assets-summary.json
```

Stato preview normalizzata: 78 URL totali, 77 candidate sitemap, `/contacto/` esclusa finche contiene placeholder.

## QA editoriale payload

Generazione:

```powershell
node scripts\solaris-es-content-qa.js
```

Output:

```txt
docs/solaris-es/generated/solarisfilms-es-content-qa-report.json
docs/solaris-es/generated/solarisfilms-es-content-qa-report.csv
docs/solaris-es/generated/solarisfilms-es-content-qa-report.md
```

Stato ultimo report:

- 78 URL analizzate;
- 1 errore bloccante: `/contacto/` contiene placeholder;
- 61 warning di contenuto breve;
- 78 note di revisione accenti spagnoli;
- 71 bozze `template_generated` da revisionare prima del publish.

Il controllo non scrive su WordPress. Serve a preparare la revisione editoriale prima dell'import o prima del publish.

## Normalizzazione spagnola

Generazione:

```powershell
node scripts\solaris-es-normalize-spanish.js
```

Output:

```txt
docs/solaris-es/generated/solarisfilms-es-wp-import-payload-spanish-normalized.json
docs/solaris-es/generated/solarisfilms-es-spanish-normalization-report.json
docs/solaris-es/generated/solarisfilms-es-spanish-normalization-report.csv
docs/solaris-es/generated/solarisfilms-es-spanish-normalization-report.md
```

Stato ultimo report:

- 78 URL modificate;
- 401 sostituzioni;
- solo campi `post_title` e `post_content_html`;
- placeholder, tag HTML, href, slug, path e codici prodotto protetti;
- QA sul payload normalizzato: note accenti ridotte da 78 a 0. Restano i blocker reali: `/contacto/` e contenuti brevi/review.

Quando esiste il payload configurato con i contatti reali, rigenerare il normalizzato partendo da quello, non dal payload base.

## Pacchetti revisione

Generazione:

```powershell
node scripts\solaris-es-build-review-packets.js
```

Output:

```txt
docs/solaris-es/generated/solarisfilms-es-review-packets.json
docs/solaris-es/generated/solarisfilms-es-review-packets.csv
docs/solaris-es/generated/solarisfilms-es-review-packets.md
```

Stato ultimo pacchetto:

- 78 URL organizzate;
- P0: 17;
- P1: 34;
- P2: 25;
- P2-hold: 2;
- 1 pagina con errore QA;
- 61 pagine con warning QA.

I pacchetti uniscono owner, blocker, azione raccomandata, keyword, fonte italiana, conteggio parole e issue QA. Sono strumenti di review, non importano e non pubblicano.

## Configurazione contatti

La pagina `/contacto/` resta bloccata finche telefono, WhatsApp e indirizzo non sono reali.

Template committato:

```txt
docs/solaris-es/solarisfilms-es-launch-config-template-2026-08-05.json
```

File locale da creare, ignorato da git:

```txt
docs/solaris-es/solarisfilms-es-launch-config.local.json
```

Generazione payload configurato:

```powershell
node scripts\solaris-es-apply-launch-config.js --config docs\solaris-es\solarisfilms-es-launch-config.local.json
```

Output locale ignorato:

```txt
docs/solaris-es/generated/solarisfilms-es-wp-import-payload-configured.json
```

Lo script non scrive su WordPress e non modifica il payload originale. Se mancano telefono, WhatsApp, email o indirizzo pubblici, fallisce senza produrre output.

## Batch plan

Generazione:

```powershell
node scripts\solaris-es-build-import-batches.js
```

Output:

```txt
docs/solaris-es/generated/solarisfilms-es-import-batches.json
docs/solaris-es/generated/solarisfilms-es-import-batches.csv
```

Batch:

| Batch | Totale | Uso |
| --- | ---: | --- |
| `pilot_draft_import` | 3 | prima prova REST/editor |
| `mvp_review_set` | 8 | set minimo da revisionare |
| `seed_content_review` | 7 | contenuti seed prioritari |
| `full_draft_import` | 78 | import completo come bozze |
| `template_generated_review` | 71 | bozze generate da revisionare |
| `publish_blockers` | 78 | lista blocchi publish |

Nessun batch autorizza la pubblicazione automatica.

Per i batch allineati al payload spagnolo normalizzato:

```powershell
node scripts\solaris-es-build-import-batches.js --payload docs\solaris-es\generated\solarisfilms-es-wp-import-payload-spanish-normalized.json --out-dir docs\solaris-es\generated\spanish-normalized-import-batches
```

Output normalizzato:

```txt
docs/solaris-es/generated/spanish-normalized-import-batches/solarisfilms-es-import-batches.json
docs/solaris-es/generated/spanish-normalized-import-batches/solarisfilms-es-import-batches.csv
```

## Comandi in ordine corretto

Quando WordPress `.es` sara raggiungibile:

```powershell
node scripts\solaris-es-preflight-check.js
node scripts\solaris-es-wp-readiness-check.js
node scripts\solaris-es-wp-rest-import-drafts.js --apply --type page --limit 2
node scripts\solaris-es-post-import-qa.js --live --base https://www.solarisfilms.es
```

Dopo avere creato il payload configurato, rigenerare prima il payload spagnolo normalizzato. Usare poi `docs\solaris-es\generated\solarisfilms-es-wp-import-payload-spanish-normalized.json` per QA, SEO preview, batch e import.

Solo dopo pilota ok:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --apply
```

Questo crea bozze, non pubblica.

## Gate unico

```powershell
node scripts\solaris-es-launch-gate.js
```

Per salvare report:

```powershell
node scripts\solaris-es-launch-gate.js --out docs\solaris-es\solarisfilms-es-launch-gate-latest.json
```

Interpretazione:

- `repo_ready: true` = repo preparato;
- `launch_ready: true` = pubblicazione possibile;
- oggi `launch_ready` deve restare `false`.

## Credenziali richieste per import

Da impostare solo nella shell locale, mai committare:

```powershell
$env:SOLARIS_ES_WP_URL="https://www.solarisfilms.es"
$env:SOLARIS_ES_WP_USER="admin-user"
$env:SOLARIS_ES_WP_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
```

## Stop immediato

Fermarsi se:

- dominio ancora in hold registrar;
- HTTPS non risponde;
- `/wp-json/` non e WordPress;
- CPT REST non presenti;
- collisioni slug non documentate;
- placeholder visibili;
- bozze entrano in sitemap;
- contenuti template-generated vengono pubblicati senza revisione;
- pagine normative non validate per Spagna/Canarie;
- form/CRM `.es` non testato;
- compaiono LCD, fotocromatiche, Tecnosolar, NT, false-parent, zoho-callback o llms-txt.

## Ultimi commit rilevanti

```txt
5a26f74 Add Solaris ES import batch plan
5d895e3 Add Solaris ES launch gate
1d2be64 Add Solaris ES WordPress readiness check
a05a176 Add Solaris ES SEO asset previews
5e909aa Add Solaris ES post-import QA
a2f065b Add Solaris ES WordPress install kit tooling
b083281 Add Solaris ES WordPress theme
df0ba41 Prepare Solaris ES WordPress foundation
502147d Generate Solaris ES draft content payload
0e76cf0 Add Solaris ES live preflight runbook
```
