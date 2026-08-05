# Solarisfilms.es - Runbook import bozze WordPress

Data: 2026-08-05  
Stato: preparazione. Non eseguire su produzione senza conferma esplicita.

## Scopo

Questo runbook serve a trasformare il pacchetto `.es` in bozze WordPress, senza pubblicare nulla.

Lo script collegato e:

- `scripts/solaris-es-wp-rest-import-drafts.js`

Payload:

- `docs/solaris-es/solarisfilms-es-wp-import-payload-2026-08-05.json`

## Regole di sicurezza

- Lo script e in dry-run di default.
- Scrive solo con `--apply`.
- Crea solo `draft`.
- Non pubblica mai.
- Salta gli slug gia esistenti.
- Lascia vuoti i campi Orchestra.
- Tutti gli item hanno `publish_blocked_until_review: true`.

## Dry-run

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js
```

Output atteso:

- `mode: dry-run`
- riepilogo per `post_type`;
- nessuna scrittura WordPress.

## Dry-run filtrato

Solo pagine core:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --type page
```

Solo primi 3 item:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --limit 3
```

Includere anche skeleton senza contenuto completo:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --include-skeletons
```

## Apply controllato

Prima servono credenziali WordPress Application Password del sito `.es`.

```powershell
$env:SOLARIS_ES_WP_URL="https://www.solarisfilms.es"
$env:SOLARIS_ES_WP_USER="admin-user"
$env:SOLARIS_ES_WP_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
```

Pilot consigliato:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --apply --type page --limit 2
```

Solo dopo verifica dei primi post:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --apply --include-skeletons
```

## Endpoint CPT

Default usati dallo script:

| target_post_type | endpoint REST |
| --- | --- |
| `page` | `pages` |
| `articulo` | `posts` |
| `producto` | `producto` |
| `pagina_info` | `pagina_info` |
| `servicio_local` | `servicio_local` |

Nota: nel payload `.es` corrente le pagine focus tecniche top-level hanno `route_type=focus_tecnico`, ma `target_post_type=page`. Questo preserva URL come `/peliculas-antisolares/` senza introdurre un prefisso WordPress.

Se il WordPress `.es` usa endpoint diversi, impostare:

```powershell
$env:SOLARIS_ES_CPT_ENDPOINTS='{"producto":"producto","servicio_local":"servicio-local"}'
```

## Controlli dopo import

Per ogni item creato:

- stato `draft`;
- slug corretto;
- nessun placeholder pubblicato;
- contenuto visibile in editor;
- nessun campo Orchestra precompilato;
- nessuna sitemap generata se il sito non e pronto.

## Go/no-go

Go import bozze:

- WP `.es` esiste;
- REST API attiva;
- CPT registrati;
- credenziali Application Password funzionanti;
- import pilota testato con 1-2 pagine;
- contenuti restano in `draft`.

No-go:

- sito indicizzabile;
- dati societari mancanti su pagine pubbliche;
- CPT assenti;
- privacy/cookie assenti;
- intenzione di pubblicare direttamente.

## Rollback import bozze

Lo script salta gli slug esistenti ma non cancella nulla.

Per rollback:

- filtrare i post creati per data/autore;
- spostarli nel cestino da WP admin;
- oppure usare WP-CLI se disponibile:

```bash
wp post list --post_status=draft --date_query_column=post_date --format=ids
```

Verificare sempre manualmente prima di cancellare.
