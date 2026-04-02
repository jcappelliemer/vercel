# Solaris Films - PRD

## Architettura: WordPress Headless + React + Vercel
```
VPS (utente)        →  WordPress (backoffice contenuti)
                         ↓ REST API
Vercel (staging)    →  Sito React (frontend pubblico)
                         ↓ FastAPI Backend
                    →  SEO Agent Orchestra (AI multi-agente)
```

## Collegamento WP ↔ React Completato
- [x] Prodotti, Focus Tecnici, Pagine Info, Servizi Locali (CPTs)
- [x] Header, Footer, Hero, Stats (WP Settings)
- [x] Case Studies (6), Gallery (12), Referenze (WP Settings, con fallback statico)
- [x] Media Picker integrato nel pannello WP
- [x] SettingsProvider, wpApi.js, useWPData hook

## SEO Agent Orchestra (02/04/2026)
Sistema multi-agente AI per SEO automatica:
- [x] **Agente Analisi**: Analizza contenuti e identifica gap SEO (score, issues, keywords mancanti)
- [x] **Agente Generatore Meta**: Genera meta title, description, h1, keywords, og tags
- [x] **Agente Generatore Contenuto**: Crea contenuti SEO completi (sezioni, FAQ, meta)
- [x] **Agente Local SEO**: Ottimizza per città (meta, intro, servizi locali, FAQ, schema)
- [x] **Orchestratore**: Coordina agenti in workflow automatico
- [x] **Bulk Meta**: Genera meta tags per più pagine in batch
- [x] **Dashboard Frontend**: `/seo` con tabs, form, risultati formattati, copia
- [x] **Persistenza**: Tutti i report salvati in MongoDB `seo_reports`
- LLM: Gemini 2.5 Flash via Emergent Universal Key

## Altre Modifiche (02/04/2026)
- [x] Badge "Made with Emergent" ELIMINATO (non nascosto)
- [x] Titolo/meta description aggiornati a Solaris Films
- [x] Testi homepage corretti (LoSapeviChe, CaseStudy, FocusTecnici, Process)
- [x] Leggibilità "Soluzioni Premium" migliorata (overlay + text-shadow)
- [x] CTA "Inizia Ora" giallo ad alta visibilità

## API Endpoints SEO
- POST `/api/seo/analyze` — Analisi SEO contenuti
- POST `/api/seo/generate-meta` — Genera meta tags
- POST `/api/seo/generate-content` — Genera contenuto completo
- POST `/api/seo/local` — Local SEO per città
- POST `/api/seo/orchestrate` — Workflow multi-agente
- POST `/api/seo/bulk-meta` — Meta tags in batch
- GET `/api/seo/reports` — Storico report

## Task Prossimi
- P1: Form contatti/preventivo funzionanti su Vercel
- P2: Collegare dominio solarisfilms.it
- P2: Integrazioni email/WhatsApp reali
