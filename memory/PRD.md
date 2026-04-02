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
- [x] Hero — titolo, sottotitolo e immagine dinamici da WP Settings
- [x] SettingsProvider (React Context) per dati condivisi
- [x] wpApi.js — fetch con cache 5min + fallback statico
- [x] useWPData hook — per tutti i CPT
- [x] REST API WP — solaris_meta, CORS, /solaris/v1/settings
- [x] Case Studies — editabili da WP Settings (fino a 6, con fallback statico)
- [x] Gallery — editabile da WP Settings (fino a 12, con filtri dinamici, fallback statico)
- [x] Referenze — editabili da WP Settings (lista testo, fallback statico)

## Aggiornamenti (02/04/2026)
- [x] LoSapeviChe Card 2: testo aggiornato
- [x] Case Study sottotitolo: "nell'ultimo anno"
- [x] FocusTecnici: testi corretti
- [x] Process: 6 step + CTA giallo
- [x] Services: overlay scuro + text-shadow
- [x] Badge "Made with Emergent" rimosso
- [x] Titolo pagina e meta description aggiornati a Solaris Films
- [x] Media Picker WP: pulsante "Seleziona Immagine" + anteprima per tutti i campi immagine
- [x] ZIP tema aggiornato: /app/frontend/public/solaris-films-theme.zip

## Task Prossimi
- P1: Form contatti/preventivo funzionanti su Vercel
- P2: Collegare dominio solarisfilms.it
- P2: Agente AI per SEO automatica
- P2: Integrazioni email/WhatsApp reali
