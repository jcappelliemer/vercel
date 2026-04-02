# Solaris Films - PRD

## Architettura: WordPress Headless + React + Vercel
```
VPS (utente)        →  WordPress (backoffice contenuti + SEO Dashboard admin)
                         ↓ REST API                    ↓ AJAX
Vercel (staging)    →  Sito React (frontend pubblico)
                         ↓ 
                    →  FastAPI Backend (SEO Agent Orchestra API)
```

## SEO Agent Orchestra — Dentro WP Admin
Dashboard SEO integrata nel pannello WordPress admin (voce menu "SEO Orchestra"):
- **5 Agenti AI**: Orchestratore, Analisi, Generatore Meta, Generatore Contenuto, Local SEO
- **Tab Storico**: visualizza tutti i report generati
- **LLM**: Gemini 2.5 Flash via Emergent Universal Key
- **Protetta**: accessibile SOLO da admin WP (non pubblica)
- **Configurazione**: campo "API URL Backend" per collegare al backend FastAPI
- **File**: `inc/seo-dashboard.php`, `js/seo-dashboard.js`, `css/seo-dashboard.css`

## Collegamento WP ↔ React
- [x] Tutti i CPT (Prodotti, Focus, Info, Servizi Locali)
- [x] Settings (Header, Footer, Hero, Stats, Case Studies, Gallery, Referenze)
- [x] Media Picker integrato per tutti i campi immagine
- [x] Badge Emergent eliminato dal codice

## API Endpoints SEO (Backend FastAPI)
- POST `/api/seo/analyze` — Analisi contenuti
- POST `/api/seo/generate-meta` — Genera meta tags  
- POST `/api/seo/generate-content` — Genera contenuto completo
- POST `/api/seo/local` — Local SEO per città
- POST `/api/seo/orchestrate` — Workflow multi-agente
- POST `/api/seo/bulk-meta` — Batch meta tags
- GET `/api/seo/reports` — Storico report

## Task Prossimi
- P1: Form contatti/preventivo funzionanti su Vercel
- P2: Collegare dominio solarisfilms.it
- P2: Integrazioni email/WhatsApp reali
