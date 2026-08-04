# Solarisfilms.es - Inventario lancio

Data: 2026-08-05  
Stato: preparazione non distruttiva. Nessun deploy, nessun DNS, nessun impatto su `solarisfilms.it`.

## Sintesi

Pacchetto iniziale consigliato per lanciare `www.solarisfilms.es` come sito autonomo:

- 8 pagine core;
- 15 focus tecnici;
- 21 prodotti;
- 10 pagine info;
- 14 pagine locali iniziali;
- 10 articoli starter;
- totale: 78 URL iniziali.

Il sito spagnolo non deve nascere come copia indicizzabile automatica dell'italiano. Le pagine devono usare lo stesso impianto grafico, ma testi e riferimenti devono essere localizzati.

## Bloccanti prima del go-live

- Ragione sociale spagnola.
- CIF/NIF.
- Indirizzo sede o sede operativa.
- Telefono.
- WhatsApp.
- Email.
- Privacy/cookie policy `.es`.
- Condizioni commerciali e garanzia per mercato spagnolo.
- Conferma se usare WP separato o multisite.
- Conferma se il brand resta `Solaris Films` o diventa variante locale.

## Priorita 1 - Core

| URL | Tipo | Stato contenuto | Note |
| --- | --- | --- | --- |
| `/` | page | bozza pronta | home completa in spagnolo |
| `/servicios/` | page | bozza pronta | hub esigenze |
| `/productos/` | page | bozza pronta | catalogo famiglie |
| `/company-profile/` | page | bozza pronta | richiede dati societari |
| `/presupuesto/` | page | bozza pronta | richiede integrazione CRM/form |
| `/contacto/` | page | bozza pronta | richiede contatti reali |
| `/lo-sabias/` | page | bozza pronta | hub articoli |
| `/certificado-de-seguridad/` | page | bozza pronta | richiede validazione normativa Spagna |

## Priorita 2 - Focus tecnici

| URL | Fonte italiana | Stato |
| --- | --- | --- |
| `/peliculas-antisolares/` | `/pellicole-antisolari/` | da localizzare |
| `/peliculas-antisolares-sputtered/` | `/pellicole-antisolari-sputtered/` | da localizzare |
| `/peliculas-antisolares-sunscape/` | `/pellicole-antisolari-sunscape/` | da localizzare |
| `/peliculas-reflectantes/` | `/pellicole-riflettenti/` | da localizzare |
| `/peliculas-espectro-selectivas/` | `/pellicole-spettro-selettive/` | da localizzare |
| `/peliculas-de-seguridad/` | `/pellicole-di-sicurezza/` | da localizzare |
| `/peliculas-de-seguridad-neutras-serie-cl/` | `/pellicole-di-sicurezza-neutre-la-serie-cl/` | da localizzare |
| `/peliculas-antisolares-de-seguridad-serie-rs/` | `/pellicole-antisolari-di-sicurezza-la-serie-rs/` | da localizzare |
| `/safetyshield/` | `/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/` | da localizzare con attenzione |
| `/peliculas-decorativas/` | `/pellicole-decorative/` | da localizzare |
| `/peliculas-decorativas-privacidad/` | `/pellicole-decorative-privacy/` | da localizzare |
| `/peliculas-antisolares-imprimibles-y-vetrofanias/` | `/pellicole-antisolari-stampabili-e-vetrofanie/` | da localizzare |
| `/peliculas-antigraffiti/` | `/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/` | da localizzare |
| `/peliculas-termoaislantes/` | `/pellicole-termoisolanti/` | da validare se commercialmente utile |
| `/peliculas-oscurantes-para-cristales/` | `/pellicole-oscuranti-per-vetri/` | da valutare per contenuto/priorita |

## Priorita 3 - Prodotti

I prodotti possono mantenere i codici MADICO invariati. Lo slug puo restare quasi identico, traducendo solo contesto e testo.

| Famiglia | Prodotti |
| --- | --- |
| Decorative | Vetrofanias, Madico MT 200 XW |
| SafetyShield | Madico SafetyShield 800, 1500, GullWing |
| Sicurezza CL | CL 400 PS SR, CL 400 E PS SR, CL 700 PS SR, CL 700 E PS SR |
| RS sicurezza | RS 20/40 PS SR 4 Mil e 8 Mil |
| Riflettenti | RS 20 E PS SR, RS 30 E PS SR, RS 40 E PS SR |
| Spettro selettive | SSN 70 TE SR |
| Sputtered/Sunscape | SL 8, SG 20, SB 35, SB 20 |

## Priorita 4 - Local pages

Prima release locale consigliata:

- Tenerife;
- Adeje;
- Costa Adeje;
- Los Cristianos;
- Arona;
- Santa Cruz de Tenerife;
- La Laguna;
- Las Palmas;
- Canarias.

Seconda ondata:

- Madrid;
- Barcelona;
- Valencia;
- Malaga;
- Sevilla.

## Priorita 5 - Articoli starter

I 10 articoli starter non devono essere traduzioni automatiche. Devono essere riscritti in spagnolo per intenti locali.

Cluster:

- scelta interno/esterno;
- privacy;
- calore;
- sicurezza/UNE EN 12600;
- spettro selettive vs riflettenti;
- manutenzione;
- anti UV;
- durata;
- antigraffiti;
- SafetyShield.

## Go/no-go contenuti

Go:

- testi core revisionati;
- dati societari completati;
- normativa spagnola validata;
- form preventivo funzionante;
- sitemap e robots corretti;
- Search Console pronta;
- analytics separati;
- zero contenuti eliminati dal sito italiano reintrodotti su `.es`.

No-go:

- placeholder visibili;
- privacy/cookie assenti;
- canonical verso `.it`;
- normativa italiana usata come normativa spagnola;
- pagine local create senza area commerciale reale;
- prodotti con schede tecniche non coerenti.

