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

## Aggiornamenti Homepage (02/04/2026)
- [x] LoSapeviChe Card 2: testo aggiornato con "diverse tipologie di pellicole"
- [x] Case Study sottotitolo: "nell'ultimo anno"
- [x] FocusTecnici: testi Riduzione Temperatura e Riflessione IR corretti
- [x] Process: 6 step esatti (Richiesta → Garanzia) + CTA giallo
- [x] Services (Soluzioni Premium): overlay scuro + text-shadow per leggibilità
- [x] Process CTA: pulsante giallo ad alta visibilità

## Tema WP Aggiornato
Il tema `solaris-films` include ora:
- Sezione Case Studies nel pannello Impostazioni Solaris (fino a 6)
- Sezione Gallery/Lavori nel pannello Impostazioni Solaris (fino a 12)
- Sezione Referenze nel pannello Impostazioni Solaris (lista testo)
- REST API espone `case_studies`, `gallery_items`, `references` come array strutturati
- ZIP disponibile in: `/app/frontend/public/solaris-films-theme.zip`

## Task Prossimi
- P1: Form contatti/preventivo funzionanti su Vercel (email via WP REST o FastAPI)
- P2: Collegare dominio solarisfilms.it quando pronto
- P2: Agente AI per SEO automatica
- P2: Integrazioni email/WhatsApp reali
