# Solarisfilms.es - Piano di implementazione

Data: 2026-08-04  
Stato: preparazione non distruttiva. Nessun DNS, live o staging italiano modificato.

## Obiettivo

Creare `www.solarisfilms.es` come sito spagnolo autonomo, graficamente coerente con Solaris Italia ma con contenuti, dati aziendali, CTA, SEO e riferimenti locali propri.

Il sito spagnolo deve poter crescere senza dipendere dal dominio italiano:

- dominio separato: `www.solarisfilms.es`;
- canonical autonomi su `.es`;
- sitemap dedicata;
- Search Console dedicata;
- dati societari spagnoli;
- contatti spagnoli;
- contenuti localizzati, non tradotti parola per parola.

## Architettura consigliata

### Opzione A - WordPress separato

Consigliata se la societa spagnola ha ragione sociale, privacy, CRM, numeri e gestione commerciale separati.

Vantaggi:

- isolamento legale e tecnico;
- meno rischio di mescolare Italia/Spagna;
- gestione autonoma di privacy, cookie, analytics, CRM;
- contenuti Orchestra separati per mercato spagnolo.

Svantaggi:

- doppia manutenzione;
- tema/plugin da aggiornare su due installazioni.

### Opzione B - WordPress multisite

Consigliata se vuoi gestire Italia e Spagna dallo stesso pannello.

Vantaggi:

- stesso tema;
- stessi plugin;
- gestione centralizzata;
- duplicazione contenuti piu rapida.

Svantaggi:

- piu attenzione a permessi, domini e configurazione;
- rischio operativo maggiore se un aggiornamento impatta entrambi.

### Scelta pragmatica

Per Solaris consiglierei:

1. `solarisfilms.it`: chiudere prima il live italiano.
2. `solarisfilms.es`: partire come installazione separata o multisite isolato, usando stesso tema/CSS.
3. Orchestra: abilitare `.es` come progetto/sorgente distinta, non come appendice del sito italiano.

## Struttura dati

Tipi contenuto consigliati:

- `page`: home, servizi, prodotti, company, preventivo, contatto, certificato QR.
- `producto`: schede prodotto MADICO.
- `focus_tecnico`: pagine di famiglia prodotto.
- `pagina_info`: garanzie, normativa, manutenzione, glossario.
- `servicio_local`: pagine locali Spagna/Canarie.
- `articulo`: sezione `Lo sabias?`.

Nota: se si usa WordPress integrale, i rewrite devono essere spagnoli e stabili da subito. Non c'e storico SEO da preservare su `.es`, quindi conviene usare URL puliti in spagnolo.

## URL base

Pagine principali:

- `/`
- `/servicios/`
- `/productos/`
- `/company-profile/`
- `/presupuesto/`
- `/contacto/`
- `/lo-sabias/`
- `/certificado-de-seguridad/`

Focus:

- `/peliculas-antisolares/`
- `/peliculas-antisolares-sputtered/`
- `/peliculas-antisolares-sunscape/`
- `/peliculas-reflectantes/`
- `/peliculas-espectro-selectivas/`
- `/peliculas-de-seguridad/`
- `/peliculas-de-seguridad-neutras-serie-cl/`
- `/peliculas-antisolares-de-seguridad-serie-rs/`
- `/safetyshield/`
- `/peliculas-decorativas/`
- `/peliculas-decorativas-privacidad/`
- `/peliculas-antisolares-imprimibles-y-vetrofanias/`

Local:

- `/servicio-local/peliculas-para-cristales-tenerife/`
- `/servicio-local/peliculas-para-cristales-adeje/`
- `/servicio-local/peliculas-para-cristales-costa-adeje/`
- `/servicio-local/peliculas-para-cristales-los-cristianos/`
- `/servicio-local/peliculas-para-cristales-canarias/`

## Hreflang

Ogni pagina `.es` deve dichiarare se stessa e, solo quando esiste una vera corrispondenza, la pagina italiana.

Esempio:

```html
<link rel="canonical" href="https://www.solarisfilms.es/peliculas-antisolares/" />
<link rel="alternate" hreflang="es-ES" href="https://www.solarisfilms.es/peliculas-antisolares/" />
<link rel="alternate" hreflang="it-IT" href="https://www.solarisfilms.it/pellicole-antisolari/" />
```

Regole:

- no canonical verso `.it`;
- no redirect automatico per lingua;
- no traduzioni parziali indicizzabili;
- no `hreflang` se la pagina spagnola non e realmente equivalente.

## SEO e AEO

Prima release:

- title e description per tutte le pagine principali;
- Organization schema con societa spagnola;
- LocalBusiness schema se ci sono sede/telefono reali;
- Product schema solo dove ci sono dati prodotto validati;
- FAQPage schema solo con FAQ reali;
- sitemap `.es`;
- robots indexabile solo al go-live.

Orchestra:

- progetto separato o chiave separata per `.es`;
- contenuti analizzabili in spagnolo;
- manifest distinto da quello italiano;
- badge come funzione Orchestra, non come parte fissa del tema.

## Normativa

Da validare prima della pubblicazione:

- riferimenti a `UNE EN 12600:2003`;
- riferimenti al `CTE DB-SUA`;
- eventuali riferimenti a obblighi di sicurezza sul lavoro in Spagna;
- privacy/cookie secondo normativa spagnola e GDPR.

Non pubblicare frasi assolute tipo:

- "certifica qualsiasi vetro";
- "garantisce sempre la conformita";
- "sostituisce il vetro di sicurezza";
- "valido per ogni edificio".

Formula consigliata:

> La soluzione deve essere valutata in base al tipo di vidrio, al uso del espacio, alla documentacion tecnica del producto y a los requisitos aplicables al edificio.

## Dati aziendali da ricevere

Bloccanti prima di pubblicare:

- ragione sociale spagnola;
- CIF/NIF;
- indirizzo;
- telefono;
- WhatsApp;
- email;
- titolare privacy;
- eventuale sede operativa;
- provincia/area di servizio prioritaria;
- condizioni commerciali e garanzie per Spagna;
- se si usa lo stesso marchio Solaris Films o variante locale.

## Piano operativo

### Fase 0 - Preparazione

- confermare ragione sociale;
- confermare dominio `solarisfilms.es`;
- decidere WP separato vs multisite;
- confermare hosting;
- confermare lingua principale `es-ES`;
- confermare contatti e CRM.

### Fase 1 - Skeleton

- installazione WordPress/tema;
- menu;
- footer;
- home;
- servizi;
- prodotti;
- contatto;
- preventivo;
- privacy/cookie provvisorie non indicizzate.

### Fase 2 - Contenuti prioritari

- 15 focus tecnici adattati;
- 21 prodotti;
- SafetyShield;
- 10 info/FAQ;
- 10 articoli iniziali;
- 5/10 pagine locali Canarie/Spagna.

### Fase 3 - Verifica SEO

- sitemap;
- robots;
- canonical;
- hreflang;
- schema;
- internal link;
- 404;
- mobile;
- Core Web Vitals;
- Search Console.

### Fase 4 - Go-live `.es`

- DNS;
- SSL;
- robots indexabile;
- sitemap inviata;
- tracking;
- monitor 404 e query Search Console.

## Cosa non fare

- Non copiare automaticamente tutto il sito italiano.
- Non importare contenuti eliminati o 410.
- Non usare URL italiani su `.es`.
- Non pubblicare normativa italiana come se valesse in Spagna.
- Non usare canonical verso `.it`.
- Non fare redirect lingua automatici.
- Non pubblicare articoli generati automaticamente senza revisione.

## Output gia preparati

- `docs/solaris-es/solarisfilms-es-draft-2026-08-04.md`
- `docs/solaris-es/solarisfilms-es-route-manifest-2026-08-04.json`
- `docs/solaris-es/solarisfilms-es-implementation-plan-2026-08-04.md`
- `docs/solaris-es/solarisfilms-es-content-seed-2026-08-04.json`
- `docs/solaris-es/solarisfilms-es-launch-inventory-2026-08-05.md`
- `docs/solaris-es/solarisfilms-es-hreflang-map-2026-08-05.csv`
- `docs/solaris-es/solarisfilms-es-wp-import-dryrun-2026-08-05.csv`
- `docs/solaris-es/solarisfilms-es-wp-import-payload-2026-08-05.json`
- `docs/solaris-es/solarisfilms-es-gap-register-2026-08-05.md`
- `scripts/solaris-es-build-wp-payload.js`
- `docs/solaris-es/solarisfilms-es-import-runbook-2026-08-05.md`
- `scripts/solaris-es-wp-rest-import-drafts.js`
- `docs/solaris-es/solarisfilms-es-template-copy-2026-08-05.md`
- `docs/solaris-es/solarisfilms-es-prepublish-qa-2026-08-05.md`
- `docs/solaris-es/solarisfilms-es-keyword-taxonomy-2026-08-05.md`
- `docs/solaris-es/solarisfilms-es-seo-metadata-2026-08-05.csv`
- `scripts/solaris-es-build-seo-metadata.js`
