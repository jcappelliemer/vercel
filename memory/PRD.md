# Solaris Films - PRD

## Architettura: WordPress Headless + React + Vercel
```
VPS (utente)        →  WordPress (backoffice contenuti)
                         ↓ REST API
Vercel (staging)    →  Sito React (frontend pubblico)
```

## Collegamento WP ↔ React Completato
Tutte le pagine React ora leggono da WordPress con fallback statico:
- [x] Prodotti (21) — ProdottoPagina + ProdottiIndexPagina
- [x] Focus Tecnici (15) — FocusTecnicoPagina + FocusTecnicoIndexPagina
- [x] Pagine Info (10) — PaginaInfoPagina + PaginaInfoIndexPagina
- [x] Servizi Locali (22) — ServizioLocalePagina + ServizioLocaleIndexPagina
- [x] Header — telefono, WhatsApp dinamici da WP Settings
- [x] Footer — email, indirizzo, P.IVA, testo dinamici da WP Settings
- [x] Hero — titolo e sottotitolo dinamici da WP Settings
- [x] SettingsProvider (React Context) per dati condivisi
- [x] wpApi.js — fetch con cache 5min + fallback statico
- [x] useWPData hook — per tutti i CPT
- [x] REST API WP — solaris_meta, CORS, /solaris/v1/settings

## Task Prossimi
- P0: Push su GitHub + Redeploy su Vercel per attivare collegamento WP
- P1: Collegare dominio solarisfilms.it quando pronto
- P2: Form contatti/preventivo funzionanti su Vercel
- P2: Agente AI per SEO automatica
- P2: Integrazioni email/WhatsApp reali
