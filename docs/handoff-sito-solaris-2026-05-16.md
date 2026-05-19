# Handoff sito Solaris - 2026-05-16

## Obiettivo prossimo

Ripartire da una chat pulita per fare il check pagina per pagina del sito Solaris in staging, con correzioni in tempo reale insieme all'utente.

Non fare ancora go-live e non switchare il dominio `solarisfilms.it`.

## Repo e URL

- Repo sito locale: `C:\Users\Utente\Documents\Codex\vercel`
- Repo CRM locale: `C:\Users\Utente\Documents\Codex\crm-github-check`
- Staging locale abituale: `http://127.0.0.1:4173/`
- Staging pubblico Vercel: `https://solarisfilms.vercel.app`
- Dominio live da non toccare: `https://solarisfilms.it`
- Note operative complete: `C:\Users\Utente\Documents\Codex\vercel\docs\operative-notes.md`

## Stato attuale sito

- Il sito React/headless e' deployato su Vercel staging pubblico.
- Ultimo deploy staging verificato: `dpl_6m6XqNbtr7T21TSs7Yf4N3MKzM3c`
- Bundle remoto ultimo deploy: `main.69d235c7.js`
- `robots.txt` staging pubblico resta bloccato ai motori:
  - `User-agent: *`
  - `Disallow: /`
- Nessuno switch del dominio live `solarisfilms.it` e' stato fatto.

## Cose gia sistemate

- Mappa sito ripulita:
  - rimossi archivi WordPress autore/categoria
  - rimossi conteggi URL visibili dalle sezioni
  - esclusi `false-parent`, `zoho-callback`, `llms-txt`
- Esclusi dal nuovo sito e dai prossimi import:
  - LCD
  - Stratum
  - Startum
  - pagine tecniche WordPress non pubbliche
- Servizi/prodotti/focus hanno template Solaris dedicati, non piu mirror grezzo del live.
- Immagini principali portate su asset locali Solaris dove possibile.
- Pagine conversione rifinite:
  - `/contatti/`
  - `/preventivo/`
  - `/grazie/`
- Pagine istituzionali rifinite:
  - `/profilo-solaris/`
  - `/faq/`
  - `/privacy-policy/`
  - `/info/norme/`
- Import live normalizzato per diversi refusi WordPress e HTML sporco:
  - `strong` annidati/sbilanciati
  - `vetrate ?` -> `vetrate?`
  - `Un eccellente riduzione` -> `Un'eccellente riduzione`
  - `MT 200 VX` -> `MT 200 XW`
  - `Ecosaving` -> `EcoSaving`
  - link legacy `/contact/` -> `/contatti/`

## Verifiche recenti

Build locale passata:

```powershell
cd C:\Users\Utente\Documents\Codex\vercel\frontend
npm run build
```

Verifiche staging pubblico 2026-05-16:

- `https://solarisfilms.vercel.app/servizi/` -> `200`
- `https://solarisfilms.vercel.app/prodotti/` -> `200`
- `https://solarisfilms.vercel.app/focus-tecnico/pellicole-oscuranti-per-vetri/` -> `200`
- `https://solarisfilms.vercel.app/prodotti/madico-rs-40-e-ps-sr/` -> `200`
- `https://solarisfilms.vercel.app/robots.txt` -> `200`, `Disallow: /`

Controlli negativi passati sulle pagine campione:

- nessun `LCD`
- nessun `Stratum`
- nessun `Startum`
- nessun `false-parent`
- nessun `zoho-callback`
- nessun `llms-txt`
- nessuna copy interna tipo `importato dal live`, `staging`, `redirect 301`, `Live:`

`live-pages-index.json` pubblico:

- contiene 147 pagine
- non contiene voci escluse

## Form e CRM

I form del sito sono collegati al CRM:

- Form contatti:
  - frontend: `/contatti/`
  - endpoint CRM: `https://crm.solarisfilms.it/api/public/forms/contact/plain`
- Form preventivo:
  - frontend: `/preventivo/`
  - endpoint CRM: `https://crm.solarisfilms.it/api/public/forms/quote-request/plain`
- Lead chatbot:
  - frontend chiama `/api/chat/lead`
  - serverless inoltra al CRM webhook
- Lead WhatsApp staging:
  - endpoint `/api/whatsapp/lead`
  - inoltra al CRM webhook

I form inviano anche:

- `form_code`
- `source_page`
- `source_site`
- allegati come `attachment_image`

QA precedente con marker eliminabile ha confermato creazione lead CRM e cancellazione successiva:

- contatti
- preventivo
- chatbot
- WhatsApp staging

## CRM

Repo CRM:

`C:\Users\Utente\Documents\Codex\crm-github-check`

Ultimo problema affrontato:

- template PDF preventivo: descrizioni articoli che salivano sul footer
- richiesta utente: il footer deve rimanere su ogni pagina
- stato percepito dall'utente: "sembra fixato"

Non riprendere il CRM salvo nuova richiesta esplicita.

## Regole operative da rispettare

- Non switchare `solarisfilms.it`.
- Non collegare o modificare dominio live.
- Non rimuovere `Disallow: /` dallo staging.
- Non fare redirect dallo staging al live.
- Non eliminare modifiche locali non proprie: il repo e' molto dirty da lavoro precedente.
- Usare marker eliminabili per eventuali test form/CRM.
- Per test form usare email non riservata, preferibilmente dominio Solaris, per evitare validazioni CRM.
- Non reintrodurre LCD/Stratum/Startum.
- Mantenere la knowledge Solaris-oriented: valorizza Solaris e spinge per la nostra azienda.

## Metodo consigliato per la prossima chat

1. Leggere questo handoff.
2. Leggere `docs/operative-notes.md` solo se serve dettaglio storico.
3. Avviare o verificare il server locale:

```powershell
cd C:\Users\Utente\Documents\Codex\vercel\frontend
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

4. Fare check insieme all'utente nell'in-app browser, pagina per pagina.
5. Per ogni pagina:
   - osservare layout desktop/mobile se richiesto
   - controllare testi visibili
   - controllare CTA
   - controllare immagini
   - correggere subito
   - rebuild
   - verificare localmente
6. Deployare su `https://solarisfilms.vercel.app` solo quando il gruppo di correzioni e' stabile.
7. Aggiornare `docs/operative-notes.md` dopo ogni blocco importante.

## Pagine da riprendere nel check assistito

Priorita alta:

- `/`
- `/servizi/`
- `/prodotti/`
- `/focus-tecnico/`
- `/contatti/`
- `/preventivo/`
- `/mappa-sito/`

Poi pagine template:

- servizi principali
- prodotti principali Madico
- focus tecnici
- pagine locali
- blog/articoli importati
- info/faq/profilo/privacy/grazie

## Ultima posizione del lavoro

L'utente vuole fare personalmente il check live/staging con correzioni in tempo reale insieme a Codex.

Frase utente finale:

> prima di andare avanti, vorrei fare check live personalmente con correzioni in tempo reale con te, mi fai un doc handoff cosi ripartiamo da una chat pulita?

