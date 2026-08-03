# Deep 404 browser check - piano d'azione

Data verifica: 2026-07-15
Dominio verificato: https://solarisfilms.vercel.app

## Metodo

Verifica eseguita con browser headless Chromium via Puppeteer, aprendo i candidati pagina per pagina e controllando:

- status HTTP della navigazione;
- URL finale dopo eventuali redirect;
- presenza nel DOM di soft-404 come "Pagina non trovata" o "Prodotto non trovato";
- provenienza del path: sitemap staging, live-pages-index, url-map legacy.

Report tecnico completo: `docs/reports/deep-404-browser-check-2026-07-15.json`.

## Risultato

Le URL canoniche presenti nella sitemap staging risultano raggiungibili.

I 404 rimasti non sono pagine canoniche del sito attuale, ma alias legacy derivati da `route.newPath` / `url-map` che erano stati scartati nella strategia SEO path-preserving.

Conteggio pulito, senza doppioni slash/no-slash:

- 88 alias articolo sotto `/lo-sapevi-che/<slug>`;
- 22 alias local abbreviati sotto `/servizio-locale/<citta>`;
- 1 pagina utility `/grazie`;
- totale: 111 path unici, pari a 222 varianti con/senza slash.

## Famiglia 1 - alias articoli `/lo-sapevi-che/<slug>`

Esempi:

- `/lo-sapevi-che/pellicole-vetri-fake-news`
- `/lo-sapevi-che/pellicole-spettroselettive-facciate-vetrate`
- `/lo-sapevi-che/guida-pellicole-vetri-per-negozi`

Stato attuale:

- le pagine canoniche esistono sotto `/approfondimenti/<slug>/`;
- gli alias `/lo-sapevi-che/<slug>` rispondono 404;
- l'indice `/lo-sapevi-che/` va mantenuto.

Azione consigliata:

- aggiungere redirect server-side 301 da `/lo-sapevi-che/:slug` e `/lo-sapevi-che/:slug/` a `/approfondimenti/:slug/`;
- non redirectare l'indice `/lo-sapevi-che/`.

Motivo:

- evita duplicazioni di contenuto;
- conserva la strategia path-preserving;
- chiude gli alias creati dal vecchio `newPath` senza cambiare le pagine vere.

## Famiglia 2 - alias local brevi `/servizio-locale/<citta>`

Esempi:

- `/servizio-locale/milano`
- `/servizio-locale/roma`
- `/servizio-locale/firenze`

Stato attuale:

- le pagine canoniche esistono sotto `/servizio-locale/pellicole-per-vetri-<citta>/`;
- gli alias abbreviati rispondono 404.

Azione consigliata:

- aggiungere 22 redirect espliciti, non catch-all generico.

Esempio:

- `/servizio-locale/milano/` -> `/servizio-locale/pellicole-per-vetri-milano/`
- `/servizio-locale/roma/` -> `/servizio-locale/pellicole-per-vetri-roma/`

Motivo:

- gli alias sono puliti e prevedibili;
- il redirect esplicito evita il rischio di intercettare pagine locali gia canoniche.

## Famiglia 3 - utility `/grazie`

Stato attuale:

- `/grazie` deriva dal vecchio mapping di `/pellicole-per-vetri/thank-you/`;
- non e contenuto editoriale;
- risponde 404.

Azione consigliata primaria:

- trasformare `/grazie` e `/grazie/` in 410 Gone.

Alternativa se il tool SEO richiede zero 4xx:

- redirect 301 verso `/preventivo/`.

Raccomandazione SEO:

- 410 e piu corretto per una thank-you page non indicizzabile;
- 301 a `/preventivo/` e piu "pulito" per audit automatici, ma meno semanticamente corretto.

## Sequenza operativa proposta

1. Aggiungere in `frontend/next.config.js`:
   - redirect 301 `/lo-sapevi-che/:slug` -> `/approfondimenti/:slug/`;
   - redirect 301 espliciti per le 22 local abbreviate;
   - gestione `/grazie` come 410 oppure 301 a `/preventivo/` dopo scelta.

2. Build locale:
   - `yarn build` da `frontend`.

3. Deploy staging:
   - deploy Vercel sul progetto root `solarisfilms`, non dal progetto `frontend`.

4. Post-deploy:
   - rieseguire `deep-404-browser-check`;
   - atteso: 0 HTTP 404 sugli alias testati;
   - confermare che `/lo-sapevi-che/` indice resta 200;
   - confermare che le pagine canoniche `/approfondimenti/*` e `/servizio-locale/pellicole-per-vetri-*` restano 200.

## Rischi

- Un redirect catch-all troppo largo su `/servizio-locale/:slug` potrebbe intercettare pagine canoniche gia valide: per questo conviene usare 22 redirect espliciti.
- Redirectare l'indice `/lo-sapevi-che/` sarebbe sbagliato: va mantenuto 200.
- `/grazie` richiede decisione: 410 corretto per SEO, 301 utile se si vuole azzerare ogni errore nei tool automatici.
