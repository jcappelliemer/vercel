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
- Import ready senza skeleton: 7 URL.
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
| `focus_tecnico` | `/wp-json/wp/v2/focus_tecnico` |
| `pagina_info` | `/wp-json/wp/v2/pagina_info` |
| `servicio_local` | `/wp-json/wp/v2/servicio_local` |

Se gli endpoint hanno nomi diversi, impostare `SOLARIS_ES_CPT_ENDPOINTS`.

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
- `total: 7`;
- nessuna scrittura.

Per vedere tutto il pacchetto anche con skeleton:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --include-skeletons
```

Questo comando deve restare dry-run finché i contenuti non sono revisionati.

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

Da fare solo dopo completamento contenuti. Non usare `--include-skeletons` per pubblicare.

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --apply --include-skeletons
```

Nota: questo comando crea bozze anche per pagine incomplete. Va usato solo per preparare editor WordPress, non per andare live.

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

