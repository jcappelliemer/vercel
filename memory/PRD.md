# Solaris Films - PRD (Product Requirements Document)

## Problema Originale
Creazione di un sito web moderno, dinamico e competitivo per sostituire il sito WordPress solarisfilms.it. Design "luxury hi-tech" con base scura e colori del brand (Solaris Yellow #EAB308). Conversione in architettura WordPress Headless + React su Vercel.

## Architettura Finale: WordPress Headless
```
VPS (utente)        →  WordPress (backoffice, gestione contenuti)
                         ↓ REST API (/wp-json/wp/v2/ + /wp-json/solaris/v1/)
Vercel (gratis)     →  Sito React (frontend pubblico, animazioni, SEO)
                         ↓
Dominio             →  solarisfilms.it punta a Vercel
```

## Stack Tecnologico
- **Frontend**: React + Tailwind CSS + Framer Motion + react-helmet-async
- **Backend locale**: FastAPI (chatbot, forms, sitemap)
- **CMS**: WordPress (Custom Post Types, REST API, Theme Settings)
- **Deploy frontend**: Vercel (con vercel.json configurato)
- **Integrazioni**: OpenAI (Chatbot)

## Funzionalita Implementate

### Fase 1-3 — Core + Contenuti + SEO (COMPLETATA)
- [x] Design luxury hi-tech, 80+ pagine, animazioni Framer Motion
- [x] 21 prodotti, 22 citta, 15 focus tecnici, 10 pagine info
- [x] SEO: meta tag, sitemap.xml (81 URL), robots.txt, JSON-LD
- [x] Chatbot AI, Form preventivo/contatti

### Fase 4 — Tema WordPress (COMPLETATA)
- [x] Tema WP custom con CPTs, ACF, import dati, pannello impostazioni
- [x] Fix fatal error, menu, widget, CSS

### Fase 5 — Headless Architecture (COMPLETATA - Apr 2026)
- [x] REST API per WordPress (`inc/rest-api.php`)
  - Espone meta fields per tutti i CPT via `solaris_meta`
  - CORS abilitato per frontend su dominio diverso
  - Endpoint custom `/wp-json/solaris/v1/settings` per impostazioni tema
  - `register_post_meta` per prodotti, focus tecnici, servizi locali
- [x] WP API Service (`frontend/src/data/wpApi.js`)
  - Fetch con cache (5 min TTL)
  - Fallback ai dati statici se WP non raggiungibile
  - Mapper per tutti i tipi di contenuto
- [x] React Hook `useWPData` (`frontend/src/hooks/useWPData.js`)
- [x] Vercel config (`vercel.json`) con SPA rewrites e caching
- [x] Build verificato con successo

## Contenuti nel CMS WordPress
- 21 Prodotti MADICO (con dati tecnici completi)
- 22 Servizi Locali (citta)
- 15 Focus Tecnici
- 10 Pagine Info (norme, garanzie, glossario, ecc.)
- 7 Pagine standard

## API Endpoints
- POST /api/chat, POST /api/contact, POST /api/quote
- GET /api/health, GET /api/sitemap.xml, GET /api/robots.txt
- WP: GET /wp-json/wp/v2/{prodotto|focus_tecnico|pagina_info|servizio_locale}
- WP: GET /wp-json/solaris/v1/settings

## Task Completati Oggi
- Fix fatal error PHP (funzione duplicata)
- Pannello impostazioni tema (dati aziendali, contatti, social)
- Import 15 focus tecnici + 10 pagine info
- REST API per headless
- wpApi.js + useWPData hook
- vercel.json configurazione

## Task Prossimi
- **P0**: Utente deve aggiornare tema WP con REST API e configurare Vercel
- **P1**: Deploy su Vercel con dominio solarisfilms.it
- **P2**: Integrazioni email/WhatsApp reali per form
- **P2**: Agente AI per SEO automatica
