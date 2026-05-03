# Solaris Films - Note Operative

Aggiornato: 2026-05-03

## Stato repo

- Sito staging: `C:\Users\Utente\Documents\Codex\vercel`
- Repo GitHub sito: `https://github.com/jcappelliemer/vercel`
- Branch sito: `main`
- Ultimo commit codice verificato: `938306d Fix staging sitemap and asset aliases`
- Ultimo deploy staging verificato: `dpl_96WTyuW89vXgEX7ujwi7A3iRdogB`, `Ready`, 2026-05-03 10:47 Europe/London
- CRM: `C:\Users\Utente\Documents\Codex\crm-github-check`
- Repo GitHub CRM: `https://github.com/jcappelliemer/crm`
- Backend CRM: `https://crm.solarisfilms.it`
- Sito staging pubblico: `https://solarisfilms.vercel.app`

## Regole operative

- Non toccare `solarisfilms.it` finche il sito rimane in staging.
- Non fare redirect verso il live durante la fase attuale.
- Non salvare credenziali, token, API key o password nel repo.
- Mantenere su GitHub codice, dati headless e asset necessari.
- Escludere da deploy Vercel cartelle locali, report, screenshot e backend legacy tramite `.vercelignore`.

## Integrazioni attive

- Il chatbot del sito chiama `/api/chat`.
- `/api/chat` interroga la knowledge base pubblica del CRM:
  `https://crm.solarisfilms.it/api/public/chatbot/knowledge/search`
- I lead chatbot passano da `/api/chat/lead`.
- Il canale WhatsApp ha endpoint staging `/api/whatsapp/lead`, in attesa delle credenziali Meta Cloud API.
- I dati live/headless sono in `frontend/public/wp-data`.

## Verifiche recenti

- Build frontend passata con `npm run build`.
- Home staging: `200 OK`.
- Chatbot API: `knowledge_status: ok`.
- Asset principali reali: `/wp-data/images/logo.png`, `/wp-data/images/hero.jpg`, `/assets/solaris-logo.png`: `200 OK`.
- Alias asset radice `/logo.png` e `/hero.jpg`: `200 OK`, content-type immagine.
- Sitemap staging pubblica: `200 OK`, contiene solo URL `https://solarisfilms.vercel.app`.
- Il mirror SEO continua a leggere il live come fonte, ma `frontend/fetch-live-site.js` usa `SITE_ORIGIN` separato per l'output sitemap.
- Knowledge CRM pubblica: `POST /api/public/chatbot/knowledge/search` richiede campo `message`, non `query`.

## Prossimi blocchi

1. QA staging completo: home, menu, pagine importate, link interni, mobile, form e chatbot.
2. Allineamento lead: distinguere origine `sito`, `chatbot`, `email`, `whatsapp`.
3. Espansione knowledge base chatbot: Solaris, prodotti, normative, FAQ, obiezioni, settore.
4. Test SEO staging con Orchestra, senza redirect e senza migrazione live.
