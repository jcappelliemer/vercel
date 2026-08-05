# Solarisfilms.es - Architettura WordPress proposta

Data: 2026-08-05  
Stato: proposta tecnica. Nessuna installazione eseguita.

## Obiettivo

Creare `www.solarisfilms.es` come sito WordPress autonomo o multisite, con struttura contenuti compatibile con Orchestra e con lo stesso impianto visuale Solaris.

## Scelta consigliata

Per una ragione sociale diversa, la scelta piu pulita e:

> WordPress separato, stesso tema/base UI, dati e SEO autonomi.

Multisite resta possibile, ma richiede piu disciplina per evitare contaminazione tra Italia e Spagna.

## CPT

### `producto`

Uso:

- schede prodotto MADICO;
- download schede tecniche;
- dati tecnici;
- FAQ prodotto;
- immagini prodotto.

Rewrite:

```php
'rewrite' => ['slug' => 'productos', 'with_front' => false]
```

Esempio:

- `/productos/madico-sb-20-e-ps-sr/`

REST:

```php
'show_in_rest' => true
```

### `focus_tecnico`

Uso:

- famiglie tecniche;
- controllo solare;
- sicurezza;
- SafetyShield;
- privacy/design.

Rewrite:

```php
'rewrite' => ['slug' => '', 'with_front' => false]
```

Nota: in WordPress il rewrite top-level vuoto va gestito con attenzione. Alternativa piu stabile:

- usare Pages top-level per i focus principali;
- usare CPT `focus_tecnico` solo se accettiamo prefisso `/soluciones/`.

Per `.es`, non avendo storico SEO, possiamo scegliere:

Opzione pulita:

- `/peliculas-antisolares/` come Page;
- `/peliculas-de-seguridad/` come Page;
- `/safetyshield/` come Page.

Opzione CPT:

- `/soluciones/peliculas-antisolares/`.

Consiglio: usare Pages top-level per i 15 focus iniziali, come gia fatto nel ragionamento path-preserving italiano.

### `pagina_info`

Uso:

- normativa;
- garanzie;
- manutenzione;
- glossario;
- informazioni tecniche.

Rewrite:

```php
'rewrite' => ['slug' => 'info', 'with_front' => false]
```

Esempio:

- `/info/garantias/`

### `servicio_local`

Uso:

- pagine locali Spagna/Canarie;
- Tenerife, Adeje, Costa Adeje, ecc.

Rewrite:

```php
'rewrite' => ['slug' => 'servicio-local', 'with_front' => false]
```

Esempio:

- `/servicio-local/peliculas-para-cristales-tenerife/`

### `articulo`

Uso:

- sezione `Lo sabias?`;
- guide e contenuti editoriali.

Scelta:

- usare il post type nativo `post` con categoria `lo-sabias`;
- oppure CPT `articulo`.

Consiglio:

> Usare `post` nativo per semplificare WordPress, REST, feed, sitemap e gestione editoriale.

Rewrite desiderato:

```php
/lo-sabias/%postname%/
```

Questo richiede permalink custom o rewrite dedicato.

## Campi minimi per Orchestra

Ogni contenuto deve avere:

- `post_title`;
- `post_content`;
- `post_status`;
- `post_type`;
- `slug`;
- `frontend_url` o permalink coerente;
- excerpt o meta description iniziale se disponibile.

Campi Orchestra lasciati vuoti in import:

- `_seo_aeo_meta_title`;
- `_seo_aeo_meta_description`;
- `_seo_aeo_keywords`;
- `_aeo_faq`;
- `_seo_aeo_custom_schema_html`.

Orchestra deve leggere il contenuto reale e ottimizzare dopo.

## Tassonomie

### Product category

Nome: `categoria_producto`

Termini iniziali:

- `control-solar`;
- `sputtered`;
- `sunscape`;
- `reflectantes`;
- `espectro-selectivas`;
- `seguridad`;
- `safetyshield`;
- `decorativas`;
- `privacidad`;
- `vetrofanias`.

### Article category

Usare categorie native:

- `control-solar`;
- `seguridad`;
- `privacidad`;
- `normativa`;
- `mantenimiento`;
- `casos-de-uso`.

### Local area

Nome: `area_servicio`

Termini:

- `tenerife`;
- `canarias`;
- `peninsula`;
- `madrid`;
- `barcelona`;
- `valencia`;
- `andalucia`.

## Template rendering

### Page core

Template:

- hero;
- card/sezioni;
- CTA;
- FAQ;
- authority/trust se gestito da Orchestra;
- footer.

### Product

Template:

- hero prodotto;
- immagine;
- overview;
- contesto d'uso;
- dati tecnici;
- proprieta fisiche;
- download;
- FAQ;
- CTA.

### Local

Template:

- hero local;
- soluzioni disponibili;
- metodo;
- CTA WhatsApp/preventivo;
- FAQ local.

### Article

Template:

- hero;
- corpo articolo;
- link correlati;
- FAQ;
- CTA.

## REST endpoints attesi

| Contenuto | Endpoint |
| --- | --- |
| Pages | `/wp-json/wp/v2/pages` |
| Posts/articoli | `/wp-json/wp/v2/posts` |
| Producto | `/wp-json/wp/v2/producto` |
| Pagina info | `/wp-json/wp/v2/pagina_info` |
| Servizio local | `/wp-json/wp/v2/servicio_local` |

Se i nomi endpoint cambiano, aggiornare:

- `SOLARIS_ES_CPT_ENDPOINTS`;
- `scripts/solaris-es-wp-rest-import-drafts.js`.

## Sitemap

Includere solo:

- published;
- canonical;
- revisionati.

Escludere:

- draft;
- placeholder;
- skeleton;
- pagine legal non validate;
- pagine locali non servite davvero.

## Robots

Prima del go-live:

```txt
User-agent: *
Disallow: /
```

Al go-live:

```txt
User-agent: *
Allow: /

Sitemap: https://www.solarisfilms.es/sitemap.xml
```

## Hreflang

Implementazione consigliata:

- campo metadato per URL italiano equivalente;
- render in `<head>` solo se la pagina `.it` corrispondente esiste;
- self-reference obbligatoria.

Esempio:

```html
<link rel="alternate" hreflang="es-ES" href="https://www.solarisfilms.es/peliculas-antisolares/" />
<link rel="alternate" hreflang="it-IT" href="https://www.solarisfilms.it/pellicole-antisolari/" />
```

## Rischi

- top-level focus come CPT puo confliggere con Pages;
- articoli con rewrite `/lo-sabias/` richiedono configurazione permalink;
- pagine legal non validate possono creare rischio commerciale;
- local page massive possono sembrare doorway page se duplicate;
- canonical errato verso `.it` annulla il valore SEO `.es`.

## Raccomandazione finale

Prima release tecnica:

- WP separato;
- Pages per core e focus top-level;
- CPT `producto`;
- CPT `pagina_info`;
- CPT `servicio_local`;
- post nativi per articoli con permalink `/lo-sabias/%postname%/`;
- tutte le importazioni iniziali in `draft`;
- noindex finche i gate non sono chiusi.

