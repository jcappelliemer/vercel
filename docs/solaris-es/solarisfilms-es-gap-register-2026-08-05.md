# Solarisfilms.es - Gap register

Data: 2026-08-05  
Fonte: dry-run import e payload WP generati in `docs/solaris-es`.

## Stato attuale

Il pacchetto `.es` e pronto come base di lavoro, ma non e pronto per pubblicazione.

Payload:

- 78 URL totali;
- 23 page, incluse le 15 pagine focus tecniche top-level;
- 21 prodotti;
- 10 pagina_info;
- 14 servizio_locale;
- 10 articoli;
- 78/78 bloccati prima della pubblicazione;
- 78/78 hanno HTML importabile come bozza;
- 7/78 hanno contenuto seed manuale;
- 71/78 hanno bozza generata da template e richiedono revisione prima della pubblicazione.

## Regola di sicurezza

Tutto cio che viene creato su `solarisfilms.es` deve partire in `draft` o `noindex` finche non sono chiusi dati societari, revisione normativa, contatti e contenuti.

Non pubblicare pagine con placeholder tipo:

- `[RAZON_SOCIAL_ES]`
- `[CIF_NIF_ES]`
- `[DIRECCION_ES]`
- `[TELEFONO_ES]`
- `[WHATSAPP_ES]`
- `[EMAIL_ES]`

## Gap per categoria

### Legal data

Pagine coinvolte: 2

- `/`
- `/company-profile/`

Serve:

- ragione sociale spagnola;
- CIF/NIF;
- indirizzo;
- titolare privacy;
- eventuale sede operativa;
- testo societario corretto.

### Contact data

Pagine coinvolte: 1

- `/contacto/`

Serve:

- telefono;
- WhatsApp;
- email;
- indirizzo;
- orari o SLA risposta;
- eventuale area geografica servita.

### Form / CRM

Pagine coinvolte: 1

- `/presupuesto/`

Serve:

- endpoint form;
- campi obbligatori;
- consenso privacy;
- destinazione lead;
- marker test eliminabili;
- conferma che i lead `.es` non si mescolino ai lead Italia se non voluto.

### Legal review

Pagine coinvolte: 13

Priorita alta:

- `/certificado-de-seguridad/`
- `/peliculas-de-seguridad/`
- `/peliculas-de-seguridad-neutras-serie-cl/`
- `/peliculas-antisolares-de-seguridad-serie-rs/`
- `/safetyshield/`
- `/info/normativa-y-seguridad/`
- `/info/seguridad-conforme-a-la-ley/`
- `/info/garantias/`
- `/info/norma-brc/`
- `/info/sistemas-filtrantes/`
- `/info/seguridad-y-salud-en-el-trabajo/`
- `/lo-sabias/peliculas-de-seguridad-une-en-12600/`
- `/lo-sabias/peliculas-safetyshield-para-cristales/`

Serve:

- verifica riferimenti `UNE EN 12600:2003`;
- verifica riferimenti `CTE DB-SUA`;
- verifica formule su sicurezza nei luoghi di lavoro in Spagna;
- evitare promesse assolute;
- evitare dettagli di garanzia esposti in modo usabile dai concorrenti.

### Technical sheet

Pagine coinvolte: 20

Serve:

- scheda tecnica collegata;
- dati tecnici verificati;
- immagini prodotto corrette;
- testi spagnoli coerenti con layout prodotti;
- FAQ prodotto contestualizzate;
- download scheda se previsto.

### Local review

Pagine coinvolte: 14

Serve:

- conferma aree realmente servite;
- priorita Canarie/Tenerife;
- eventuali foto/loghi local;
- telefono e CTA corretti;
- evitare local page nazionali se non c'e capacita commerciale reale.

### Commercial review

Pagine coinvolte: 2

- `/peliculas-termoaislantes/`
- `/peliculas-oscurantes-para-cristales/`

Serve decidere se queste famiglie hanno senso nel catalogo spagnolo iniziale o se rimandarle.

### Copy review

Pagine coinvolte: 25

Serve:

- spagnolo naturale;
- tono Solaris-oriented;
- niente note tecniche interne;
- CTA coerenti;
- internal link corretti;
- immagini coerenti.

## Ordine consigliato

1. Dati societari e contatti.
2. Home, servizi, prodotti, company, contatto, presupuesto.
3. SafetyShield e sicurezza, con revisione normativa.
4. Prodotti principali.
5. Focus tecnici.
6. Pagine locali Canarie/Tenerife.
7. Articoli starter.
8. Hreflang e sitemap.
9. Orchestra `.es`.

## Import bozza

Il file tecnico da usare per un import controllato e:

- `docs/solaris-es/solarisfilms-es-wp-import-payload-2026-08-05.json`

Regole:

- importare solo come `draft`;
- non pubblicare direttamente;
- lasciare vuoti i campi Orchestra;
- non indicizzare finche i gate non sono chiusi;
- generare sitemap solo dopo revisione.

## Criteri go/no-go

Go:

- 0 placeholder visibili;
- 0 pagine senza contatto coerente;
- 0 canonical verso `.it`;
- `hreflang` solo sulle corrispondenze reali;
- sitemap `.es` autonoma;
- Search Console `.es`;
- privacy/cookie validi;
- contenuti sicurezza/garanzia revisionati.

No-go:

- contenuto legale non validato;
- prodotti senza dati tecnici verificati;
- pagine local non servite davvero;
- form non testato;
- articoli generati automaticamente senza controllo;
- dati Italia lasciati nel footer o nei contatti.
