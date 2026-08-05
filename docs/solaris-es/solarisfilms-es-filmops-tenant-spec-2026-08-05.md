# Solarisfilms.es - Specifica tenant FilmOps

Data: 2026-08-05  
Stato: specifica preparatoria. Nessun tenant creato da questo documento.

## Obiettivo

Creare un tenant separato su `filmops.app` per gestire i lead di `solarisfilms.es` senza mischiarli con il flusso Italia.

Il tenant `.es` deve supportare:

- richieste preventivo dal sito;
- lead WhatsApp/telefono tracciabili;
- provenienza pagina/campagna;
- consenso privacy;
- marker test eliminabili;
- eventuale estensione commerciale da Canarie a Spagna.

## Decisioni ricevute

- Tenant: nuovo tenant dedicato `.es`.
- Brand commerciale: `solarisfilms`.
- Societa prevista: `Solaris Code SL`, da costituire.
- Email pubblica: `info@solarisfilms.es`.
- Area: Canarie come partenza, poi Spagna.
- Catalogo: tutti i prodotti.

## Nome tenant consigliato

```txt
solarisfilms-es
```

Alternative accettabili:

```txt
solaris-code-sl
solarisfilms-canarias
```

Scelta consigliata: `solarisfilms-es`, per lasciare il tenant legato al dominio e non alla sola fase Canarie.

## Canali lead

| Canale | Stato | Note |
| --- | --- | --- |
| Form preventivo sito | Da creare | `/presupuesto/` |
| WhatsApp | Numero da definire | Tracciare click con source URL |
| Telefono | Numero da definire | Tracciare click tel se possibile |
| Email | `info@solarisfilms.es` | Può essere canale fallback |
| Import manuale | Utile | Per lead arrivati da rete commerciale |

## Campi minimi lead

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `tenant` | hidden | si | `solarisfilms-es` |
| `country` | hidden/select | si | `ES` |
| `market` | hidden/select | si | `canarias` iniziale, poi `spain` |
| `lead_source` | hidden | si | `website_form`, `whatsapp`, `phone`, `manual` |
| `source_url` | hidden | si | URL pagina di provenienza |
| `utm_source` | hidden | no | Se presente |
| `utm_medium` | hidden | no | Se presente |
| `utm_campaign` | hidden | no | Se presente |
| `name` | text | si | Nome referente |
| `company` | text | no | Azienda/ente |
| `email` | email | si | Per risposta |
| `phone` | tel | si | Telefono o WhatsApp |
| `city` | text | si | Citta/intervento |
| `island_or_province` | select/text | si | Tenerife, Gran Canaria, altro |
| `address_or_area` | text | no | Non obbligare indirizzo completo in prima richiesta |
| `building_type` | select | no | vivienda, oficina, hotel, local, escuela, hospital, otro |
| `need` | select | si | solar, seguridad, safetyshield, privacidad, decorativo, no_lo_se |
| `glass_context` | textarea/select | no | tipo vetro se noto |
| `message` | textarea | si | descrizione caso reale |
| `photos` | upload | no | utile per valutazione |
| `privacy_consent` | checkbox | si | testo privacy `.es` |
| `marketing_consent` | checkbox | no | separato dal consenso form |
| `test_marker` | hidden | no | solo per test eliminabili |

## Valori consigliati per `need`

```txt
control_solar
seguridad_vidrio
safetyshield
privacidad_diseno
decorativo_vetrofania
producto_madico
no_lo_se
```

## Stati lead

| Stato | Uso |
| --- | --- |
| `new` | appena arrivato |
| `to_qualify` | da capire bisogno/area |
| `needs_photos` | servono foto o misure |
| `technical_review` | serve verifica vetro/prodotto |
| `quote_ready` | pronto per preventivo |
| `quoted` | preventivo inviato |
| `won` | lavoro acquisito |
| `lost` | perso |
| `out_of_area` | fuori area servita |
| `spam_or_test` | test/spam da eliminare |

## Regole routing

### Prima fase - Canarie

- Lead Canarie/Tenerife: assegnare al flusso commerciale `.es`.
- Lead fuori Canarie: stato `to_qualify` o `out_of_area`, in base alla decisione commerciale.
- Lead Italia arrivato per errore: non inserirlo nel tenant Italia automaticamente; marcare `wrong_market` o reinoltrare manualmente.

### Estensione Spagna

Quando la rete commerciale e operativa e pronta:

- passare `market` da `canarias` a `spain`;
- aggiungere province/aree servite;
- aggiornare local page e CTA;
- aggiornare routing automatico.

## Privacy e consenso

Prima di attivare il form serve testo privacy `.es`.

Formula campo consenso provvisoria da validare:

```txt
Acepto que Solaris Films trate mis datos para responder a mi solicitud de presupuesto, de acuerdo con la politica de privacidad.
```

Non usare questo testo come definitivo senza privacy policy spagnola.

## Marker test eliminabili

Per i test usare sempre:

```txt
test_marker=SOLARIS_ES_TEST_DELETE
```

Regole:

- ogni test deve avere `test_marker`;
- i lead test vanno eliminati prima del go-live;
- non usare dati personali reali nei test;
- non inviare email automatiche a clienti reali.

## Eventi tracking consigliati

| Evento | Trigger |
| --- | --- |
| `es_quote_form_start` | apertura/interazione form |
| `es_quote_form_submit` | invio valido |
| `es_quote_form_error` | errore validazione |
| `es_whatsapp_click` | click WhatsApp |
| `es_phone_click` | click telefono |
| `es_pdf_download` | download scheda prodotto |
| `es_product_cta_click` | CTA prodotto |

## Payload esempio

```json
{
  "tenant": "solarisfilms-es",
  "country": "ES",
  "market": "canarias",
  "lead_source": "website_form",
  "source_url": "https://www.solarisfilms.es/presupuesto/",
  "name": "Nombre Apellido",
  "company": "",
  "email": "cliente@example.com",
  "phone": "+34...",
  "city": "Adeje",
  "island_or_province": "Tenerife",
  "building_type": "hotel",
  "need": "control_solar",
  "message": "Cristales con exceso de calor y deslumbramiento.",
  "privacy_consent": true,
  "test_marker": "SOLARIS_ES_TEST_DELETE"
}
```

## Go/no-go CRM

Go:

- tenant creato;
- endpoint testato;
- lead test ricevuto;
- lead test eliminabile;
- email notifica corretta;
- privacy consent salvato;
- routing separato da Italia.

No-go:

- endpoint assente;
- lead `.es` finisce in tenant Italia senza scelta esplicita;
- consenso privacy non salvato;
- telefono/WhatsApp non definiti;
- impossibile eliminare i marker test.

## Dipendenze

- Telefono e WhatsApp definitivi.
- Privacy policy `.es`.
- Creazione tenant `filmops.app`.
- Regole commerciali fuori Canarie.
- Eventuale integrazione GA4/GTM.
