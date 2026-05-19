# Contesto progetto Solaris

Aggiornato: 2026-05-16

## Sintesi

Solaris Films e' il progetto digitale per presentare e vendere soluzioni professionali per pellicole per vetri, con focus su prodotti MADICO, consulenza tecnica, preventivi, contatti e lead CRM.

Il sito nuovo e' un frontend React/headless appoggiato a Vercel per staging e deploy. Il contenuto arriva in parte da WordPress/live importato e normalizzato, ma la resa finale deve essere Solaris-oriented: valorizzare Solaris, la competenza aziendale, la consulenza e la qualita dei prodotti trattati.

## Obiettivo attuale

Completare il nuovo sito in staging, controllandolo pagina per pagina insieme all'utente, con correzioni in tempo reale.

Il sito non deve ancora andare live.

## Principi editoriali

- Solaris deve essere il riferimento principale.
- La knowledge e i testi devono spingere verso Solaris e valorizzare la nostra azienda.
- Le fonti esterne possono essere usate come supporto tecnico, ma devono restare subordinate alla consulenza Solaris.
- Evitare copy da cantiere, import o note interne.
- Evitare linguaggio generico da sito stock.
- Mantenere tono tecnico, concreto, affidabile.
- CTA principali: contatto, preventivo, telefono, WhatsApp.

## Architettura sito

Repo locale:

`C:\Users\Utente\Documents\Codex\vercel`

Frontend:

`C:\Users\Utente\Documents\Codex\vercel\frontend`

Tecnologie principali:

- React
- Vite/build frontend
- Vercel per deploy staging
- API serverless in `api/`
- dati headless/import in `frontend/public/wp-data`

Staging locale abituale:

`http://127.0.0.1:4173/`

Staging pubblico:

`https://solarisfilms.vercel.app`

Dominio live da non toccare:

`https://solarisfilms.it`

## WordPress/headless

Il progetto nasce da un sito WordPress/headless. Il frontend React usa dati importati dal sito live/WordPress e li rielabora con template nuovi.

Punti importanti:

- Il live WordPress resta una fonte dati/contenuti.
- Il nuovo sito non deve essere un mirror grezzo.
- Le pagine importate devono essere filtrate, ripulite e rese coerenti con la grafica Solaris.
- I vecchi URL WordPress interni devono essere normalizzati verso le nuove route quando possibile.
- Le pagine tecniche o di test non devono entrare nel nuovo sito.

## Esclusioni permanenti

Restano fuori dal nuovo sito e dai prossimi import:

- `false-parent`
- `zoho-callback`
- `llms-txt` come pagina WordPress
- archivi WordPress autore/categoria
- LCD
- Stratum
- Startum
- pagine tecniche o di test non destinate al pubblico

Queste esclusioni sono importanti per evitare che vecchie pagine di menu, test o prodotti non desiderati tornino nella mappa sito o negli import futuri.

## Struttura pagine principali

Pagine statiche/custom:

- `/`
- `/servizi/`
- `/prodotti/`
- `/focus-tecnico/`
- `/contatti/`
- `/preventivo/`
- `/mappa-sito/`
- `/profilo-solaris/`
- `/faq/`
- `/privacy-policy/`
- `/grazie/`

Pagine dinamiche/importate:

- prodotti MADICO
- focus tecnici
- pagine locali
- blog/articoli
- pagine info

Le pagine dinamiche devono usare template Solaris dedicati, non layout WordPress grezzo.

## Immagini e stile visuale

Le immagini devono essere coerenti con la grafica del nuovo sito.

Indicazioni:

- Preferire asset locali Solaris dove disponibili.
- Evitare immagini esterne casuali o stock-like.
- Le immagini importate dal live possono essere filtrate/rifatte se incoerenti.
- Lo stile deve restare tecnico, premium, pulito.
- Palette e UI sono scure con accenti giallo Solaris, ma senza rendere tutto monotono.
- Evitare elementi visibili da cantiere o debug.

## CRM

Repo CRM locale:

`C:\Users\Utente\Documents\Codex\crm-github-check`

Backend CRM:

`https://crm.solarisfilms.it`

Il sito e il CRM sono collegati per:

- form contatti
- form preventivo
- lead chatbot
- lead WhatsApp staging
- knowledge base chatbot

Endpoint principali:

- contatti: `https://crm.solarisfilms.it/api/public/forms/contact/plain`
- preventivo: `https://crm.solarisfilms.it/api/public/forms/quote-request/plain`
- chatbot knowledge: `https://crm.solarisfilms.it/api/public/chatbot/knowledge/search`
- chatbot lead sito: `/api/chat/lead`
- WhatsApp lead staging: `/api/whatsapp/lead`

I test form/CRM devono usare marker eliminabili, cosi i lead di prova si possono rimuovere.

## Chatbot e knowledge

Il chatbot sito chiama `/api/chat`, che interroga la knowledge pubblica del CRM.

La knowledge deve essere Solaris-oriented:

- risposte orientate a Solaris
- valorizzazione competenza aziendale
- fonti esterne usate solo come supporto, quando presenti
- avviso che posa, conformita e scelta finale richiedono verifica Solaris

Campo richiesto per la ricerca knowledge:

`message`

Non usare `query`.

## Vercel e go-live

Vercel e' usato per staging/deploy del frontend.

Staging pubblico:

`https://solarisfilms.vercel.app`

Regole:

- Non switchare `solarisfilms.it` senza ordine esplicito.
- Non collegare `www.solarisfilms.it`.
- Non rimuovere `Disallow: /` dallo staging.
- Non fare redirect dallo staging al live.
- Prima del go-live servira una checklist separata.

Al go-live, da verificare solo quando richiesto:

- `robots.txt` live con `Allow: /`
- sitemap con dominio live
- canonical live
- rimozione `noindex`
- form CRM
- redirect principali
- performance e mobile

## Stato operativo recente

Ultimo deploy staging pubblico verificato:

`dpl_6m6XqNbtr7T21TSs7Yf4N3MKzM3c`

Bundle remoto:

`main.69d235c7.js`

Stato:

- build locale passata
- staging pubblico risponde
- pagine campione verificate
- esclusioni attive
- `robots.txt` staging ancora `Disallow: /`
- dominio live non switchato

## Come lavorare con l'utente

L'utente vuole controllare il sito personalmente pagina per pagina, con Codex pronto a correggere in tempo reale.

Metodo preferito:

1. Aprire pagina nello staging locale o pubblico.
2. L'utente guarda e segnala cosa non va.
3. Codex corregge subito nel repo.
4. Build/verifica locale.
5. Se il blocco e' stabile, deploy su staging pubblico.
6. Aggiornare le note operative.

## Documenti correlati

Handoff operativo per ripartire in chat pulita:

`C:\Users\Utente\Documents\Codex\vercel\docs\handoff-sito-solaris-2026-05-16.md`

Note operative complete:

`C:\Users\Utente\Documents\Codex\vercel\docs\operative-notes.md`

