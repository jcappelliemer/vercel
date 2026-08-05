# Solarisfilms.es - Mappa integrazione CRM

Data: 2026-08-05  
Stato: tenant FilmOps creato e form pubblici configurati. Nessuna modifica al codice FilmOps da questo documento.

## Tenant

| Campo | Valore |
| --- | --- |
| CRM tenant | `Solaris Film Espana CRM` |
| URL tenant | `https://solarisfilm-es.app.filmops.app/` |
| Brand pubblico | `Solaris Film Espana` |
| Email pubblica prevista | `info@solarisfilms.es` |
| Dominio CRM previsto | `crm.solarisfilms.es` |
| Stato DNS CRM | in registrazione/configurazione esterna |

## Form pubblici disponibili

| Uso | Titolo form | URL pubblico | Stato |
| --- | --- | --- | --- |
| Richiesta preventivo | `Solicitud de presupuesto peliculas para cristales` | `https://solarisfilm-es.app.filmops.app/forms/film-quote-request` | pronto lato campi |
| Richiesta visita tecnica / sopralluogo | `Solicitud de visita tecnica` | `https://solarisfilm-es.app.filmops.app/forms/site-survey-request` | pronto lato campi |
| Scheda cliente / fatturazione | `Ficha cliente` | `https://solarisfilm-es.app.filmops.app/forms/billing-profile` | pronto, ma da usare dopo qualifica |

Nota: la form pubblica mostra ancora alcune stringhe generiche in italiano nella cornice applicativa (`Richiesta online`, `Invia richiesta`, riga finale privacy/dati). La correzione e in carico all'agente FilmOps. I campi del tenant sono gia in spagnolo.

## Regola CTA sito

| Punto del sito `.es` | CTA consigliata | Destinazione CRM |
| --- | --- | --- |
| Home hero | `Solicitar presupuesto` | `film-quote-request` |
| Home secondaria | `Solicitar visita tecnica` | `site-survey-request` |
| Pagina `/presupuesto/` | form principale / bottone primario | `film-quote-request` |
| Pagine prodotto | `Solicitar verificacion` / `Pedir presupuesto` | `film-quote-request` |
| Pagine SafetyShield / sicurezza | `Solicitar evaluacion tecnica` | `site-survey-request` |
| Pagine locali Tenerife/Adeje/Canarias | `Solicitar visita tecnica` | `site-survey-request` |
| Contatti | `Escribenos` + link email; CTA form preventivo | `film-quote-request` |
| Dopo primo contatto / amministrazione | richiesta dati cliente | `billing-profile` |

## Uso dei tre moduli

### Preventivo

Da usare per le CTA commerciali standard. Campi configurati:

- Nombre y apellidos
- Email
- Telefono / WhatsApp
- Ciudad / zona
- Tipo de cristal
- Necesidad principal
- Describe el caso real
- Acepto la politica de privacidad

### Visita tecnica

Da usare dove serve valutazione preliminare, foto o contesto edificio. Campi configurati:

- Nombre y apellidos
- Empresa
- Email
- Telefono / WhatsApp
- Ciudad / zona
- Necesidad principal
- Fotos de los cristales
- Acepto la politica de privacidad

### Ficha cliente

Non usarla come CTA primaria pubblica. E una form di secondo passaggio, da inviare quando il lead e gia qualificato e servono dati amministrativi.

Campi configurati:

- Razon social o nombre completo
- NIF / CIF
- Documento fiscal adicional
- Direccion
- Ciudad / provincia
- Codigo postal
- Email administrativo
- Email de facturacion / referencia interna

## Tracking e dati tecnici da completare

La configurazione UI dei form non espone ancora, dal pannello, campi hidden per:

- `source_url`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `test_marker`

Se questi dati devono arrivare automaticamente nel CRM, l'agente FilmOps deve aggiungere supporto applicativo o un metodo documentato per passare query param/hidden fields dal sito.

## Marker test

Quando si testeranno invii reali, usare sempre dati eliminabili e questo marker, se/quanto supportato dal form:

```txt
SOLARIS_ES_TEST_DELETE
```

Fino a quando il marker hidden non e supportato, non fare test con dati reali e cancellare manualmente eventuali richieste di prova.

## Blocco da passare all'agente FilmOps

```txt
Nel tenant Solaris Film Espana le form pubbliche hanno i campi gia configurati in spagnolo, ma la cornice della pagina pubblica resta parzialmente in italiano.

URL di test:
https://solarisfilm-es.app.filmops.app/forms/film-quote-request
https://solarisfilm-es.app.filmops.app/forms/site-survey-request
https://solarisfilm-es.app.filmops.app/forms/billing-profile

Da correggere:
- "Richiesta online" -> "Solicitud online"
- "Invia richiesta" -> "Enviar solicitud"
- "Invio..." -> "Enviando..."
- "I dati restano nell'ambiente riservato..." -> "Los datos permanecen en el entorno reservado..."
- "Sito web" hidden honeypot e "Seleziona" nei select devono usare i18n
- verificare che la form pubblica usi lingua tenant/default anche senza utente loggato
- se possibile, supportare source_url/UTM/test_marker da query string o hidden fields controllati

Acceptance:
- le tre form pubbliche sono interamente in spagnolo;
- nessun testo italiano visibile nella pagina pubblica;
- submit non testato con dati reali, solo render/UX;
- eventuale tracking source/UTM documentato.
```

