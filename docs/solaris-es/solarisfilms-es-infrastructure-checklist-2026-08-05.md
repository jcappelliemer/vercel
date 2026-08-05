# Solarisfilms.es - Checklist infrastruttura

Data: 2026-08-05  
Stato: checklist preparatoria. Nessuna modifica DNS/live eseguita.

## Dominio

- [ ] Verificare proprietario `solarisfilms.es`.
- [ ] Decidere host finale.
- [ ] Decidere se usare `www` come canonical.
- [ ] Impostare redirect apex -> `www`.
- [ ] Non collegare il dominio al sito italiano.

Canonical consigliato:

```txt
https://www.solarisfilms.es/
```

## DNS

Prima di modificare:

- [ ] snapshot A/AAAA/CNAME/MX/TXT;
- [ ] TTL;
- [ ] provider DNS;
- [ ] eventuali record email.

Da non toccare senza motivo:

- MX;
- SPF;
- DKIM;
- DMARC;
- TXT servizi terzi.

## SSL

- [ ] certificato per `solarisfilms.es`;
- [ ] certificato per `www.solarisfilms.es`;
- [ ] redirect HTTP -> HTTPS;
- [ ] redirect apex -> `www`;
- [ ] rinnovo automatico testato.

## Hosting

Scelte possibili:

### VPS WordPress separato

Pro:

- pieno controllo;
- costi prevedibili;
- isolamento da `.it` se installazione separata.

Contro:

- gestione cache, sicurezza, backup, update.

### Multisite

Pro:

- gestione centralizzata;
- tema unico.

Contro:

- piu rischio operativo;
- attenzione a domini e utenti.

## WordPress

- [ ] `siteurl` corretto.
- [ ] `home` corretto.
- [ ] lingua `es_ES`.
- [ ] timezone corretta.
- [ ] permalink configurati.
- [ ] CPT registrati.
- [ ] REST API accessibile.
- [ ] application password creata.
- [ ] staging noindex.

## Privacy e cookie

- [ ] privacy policy `.es`.
- [ ] cookie policy `.es`.
- [ ] banner cookie se necessario.
- [ ] moduli con consenso.
- [ ] analytics con configurazione Spagna.

## Analytics e tracking

- [ ] GA4 separato o stream separato.
- [ ] Search Console `solarisfilms.es`.
- [ ] Tag Manager se necessario.
- [ ] eventi form.
- [ ] eventi WhatsApp.
- [ ] eventi telefono.
- [ ] conversioni definite.

## CRM / lead

- [x] tenant FilmOps `.es` creato: `https://solarisfilm-es.app.filmops.app/`.
- [x] form preventivo pubblico: `https://solarisfilm-es.app.filmops.app/forms/film-quote-request`.
- [x] form visita tecnica pubblico: `https://solarisfilm-es.app.filmops.app/forms/site-survey-request`.
- [x] form ficha cliente pubblico: `https://solarisfilm-es.app.filmops.app/forms/billing-profile`.
- [ ] dominio CRM `crm.solarisfilms.es`.
- [ ] canale separato da Italia o campo `country=ES`.
- [ ] marker test eliminabili.
- [ ] email notifica corretta.
- [ ] privacy consent registrato.
- [ ] test invio preventivo.
- [ ] fix i18n della cornice pubblica dei form FilmOps.
- [ ] supporto `source_url` / UTM / `test_marker` se richiesto dal sito.

## Email

- [ ] casella `info@solarisfilms.es` o alias deciso.
- [ ] SPF/DKIM/DMARC.
- [ ] mittente form autorizzato.
- [ ] reply-to funzionante.

## Sicurezza

- [ ] backup giornaliero.
- [ ] plugin minimi.
- [ ] aggiornamenti controllati.
- [ ] utenti amministratori ridotti.
- [ ] 2FA se disponibile.
- [ ] WAF/cache se necessario.

## SEO tecnico

- [ ] robots noindex in staging.
- [ ] robots aperto solo al go-live.
- [ ] sitemap finale.
- [ ] canonical self.
- [ ] hreflang validato.
- [ ] zero pagine placeholder pubbliche.
- [ ] zero draft in sitemap.
- [ ] zero 404 interni.

## Go-live tecnico

- [ ] backup pre-go-live.
- [ ] DNS TTL ridotto.
- [ ] SSL attivo.
- [ ] crawl pre-pubblicazione.
- [ ] apertura robots.
- [ ] invio sitemap.
- [ ] controllo Search Console.
- [ ] monitor 404/500 per 72 ore.

## Rollback

Preparare prima del go-live:

- [ ] snapshot DNS;
- [ ] backup database;
- [ ] backup files;
- [ ] export contenuti;
- [ ] piano rollback DNS;
- [ ] contatto hosting.
