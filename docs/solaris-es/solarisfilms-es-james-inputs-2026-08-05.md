# Solarisfilms.es - Dati richiesti da James

Data: 2026-08-05  
Stato: raccolta dati. Nessuna pubblicazione autorizzata.

## Scopo

Questo documento raccoglie i dati che servono per trasformare la bozza `solarisfilms.es` in un progetto realmente lavorabile.

La priorita e chiudere i blocchi P0 emersi nella board editoriale:

- dati societari;
- contatti;
- form e CRM;
- testi sicurezza/garanzia/norme;
- pagine SafetyShield e sicurezza.

Finche questi dati non sono confermati, le pagine restano in bozza o noindex.

## Dati societari minimi

Compilare prima di lavorare su home e company profile.

| Campo | Valore da fornire | Dove serve |
| --- | --- | --- |
| Ragione sociale spagnola |  | Home, company, footer, privacy |
| CIF/NIF |  | Footer, privacy, fatturazione, documenti |
| Indirizzo legale |  | Company, privacy, contatti |
| Indirizzo operativo |  | Contatti, LocalBusiness schema |
| Nome commerciale |  | Header, footer, Organization schema |
| Responsabile privacy |  | Privacy, form, cookie |
| Area servita reale |  | Home, servizi, local page |
| Rapporto con Solaris Italia |  | Company, trust, footer |

## Contatti Spagna

| Campo | Valore da fornire | Note |
| --- | --- | --- |
| Telefono principale |  | Formato internazionale consigliato |
| WhatsApp |  | Decidere se uguale al telefono |
| Email |  | Es. `info@solarisfilms.es` o alias |
| Orari/SLA risposta |  | Da usare nei testi CTA |
| Indirizzo mostrato al pubblico |  | Se diverso dall'indirizzo legale |
| Lingue gestite |  | Spagnolo, italiano, inglese, altro |

## Form e CRM

La pagina `/presupuesto/` resta bloccata finche il flusso lead non e chiaro.

| Punto | Decisione richiesta |
| --- | --- |
| Endpoint form |  |
| Destinatari email |  |
| CRM usato |  |
| Lead separati da Italia? |  |
| Campo paese obbligatorio? |  |
| Consenso privacy |  |
| Marker test eliminabili |  |
| Notifica WhatsApp/telefono |  |

## Revisione normativa

Queste pagine non devono promettere conformita automatica. Serve una revisione prima della pubblicazione.

Pagine P0:

- `/certificado-de-seguridad/`
- `/peliculas-de-seguridad/`
- `/peliculas-de-seguridad-neutras-serie-cl/`
- `/peliculas-antisolares-de-seguridad-serie-rs/`
- `/safetyshield/`
- `/info/normativa-y-seguridad/`
- `/info/seguridad-conforme-a-la-ley/`
- `/info/seguridad-y-salud-en-el-trabajo/`
- `/info/sistemas-filtrantes/`
- `/info/garantias/`
- `/info/norma-brc/`
- `/lo-sabias/peliculas-de-seguridad-une-en-12600/`
- `/lo-sabias/peliculas-safetyshield-para-cristales/`

Decisioni richieste:

| Tema | Da confermare |
| --- | --- |
| Norma urto pendolo | Formula corretta per citare UNE EN 12600 |
| Criteri sicurezza edificio | Se e come citare CTE DB-SUA |
| Lavoro/sicurezza | Se e come citare normativa spagnola sul lavoro |
| Garanzia | Quanto dire senza esporre il documento completo |
| QR certificato | Testo corretto per vetro trattato con CL 400 / CL 700 |
| SafetyShield | Limiti comunicativi su antiesplosione, uragani, terrorismo |
| BRC | Verificare se ha senso nel mercato spagnolo iniziale |

## Decisioni commerciali

| Tema | Decisione |
| --- | --- |
| Partenza geografica | Tenerife Sud, Canarie, tutta Spagna o solo aree selezionate |
| Installazione fuori Canarie | Diretta, partner o non disponibile |
| Preventivi fuori zona | Accettati, filtrati o rimandati |
| Prodotti da mostrare subito | Tutti i 21 o solo catalogo iniziale |
| Famiglie da rimandare | Termoaislanti, oscuranti, altre |
| Immagini local | Servono foto reali Spagna/Canarie o si parte con asset Solaris |

## Schede prodotto

I 21 prodotti sono presenti nel payload, ma restano bloccati come P1 finche i dati non sono validati.

Per ogni prodotto servono:

- nome commerciale definitivo;
- scheda tecnica PDF in spagnolo o inglese;
- dati tecnici verificati;
- immagine prodotto corretta;
- indicazione interno/esterno;
- download visibile si/no;
- FAQ prodotto in spagnolo;
- eventuale esclusione dal catalogo `.es`.

## Output operativo

La matrice compilabile e:

- `docs/solaris-es/solarisfilms-es-james-inputs-2026-08-05.csv`

Usarla come lista di raccolta: ogni riga ha owner, priorita, cosa blocca e stato.

## Dopo la compilazione

Quando i dati P0 sono disponibili:

1. aggiornare il payload `.es`;
2. importare solo bozze WordPress;
3. lasciare i campi Orchestra vuoti;
4. revisionare testi e normative;
5. controllare preview pagina per pagina;
6. solo dopo generare sitemap e preparare go-live.

## Cosa non fare

- Non pubblicare pagine con placeholder.
- Non usare dati italiani nel footer `.es`.
- Non creare canonical verso `.it`.
- Non indicizzare staging.
- Non reintrodurre contenuti esclusi dal sito italiano.
- Non esporre il documento garanzia completo come contenuto pubblico.
