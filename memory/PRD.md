# Solaris Films - PRD (Product Requirements Document)

## Problema Originale
Creazione di un sito web moderno, dinamico e competitivo per sostituire il sito WordPress solarisfilms.it. Design "luxury hi-tech" con base scura e colori del brand (Solaris Yellow #EAB308). Il sito deve duplicare i contenuti esistenti, avere form di lead generation, chatbot AI e essere SEO-friendly.

## Architettura
- **Frontend**: React + Tailwind CSS + Framer Motion + React Router
- **Backend**: FastAPI + Python + MongoDB (Motor)
- **Integrazioni**: OpenAI (Chatbot), react-helmet-async (SEO)

## Funzionalita Implementate

### Fase 1 - Core (COMPLETATA)
- [x] Design luxury hi-tech, dark theme con Solaris Yellow (#EAB308)
- [x] Header con logo, navigazione, CTA Telefono (Cyan) e WhatsApp (Verde)
- [x] Hero section animata
- [x] Sezioni Trust Bar, Services, Process, References, Testimonials, FAQ
- [x] Form preventivo e contatti (backend API)
- [x] Chatbot AI integrato con OpenAI (sessioni multi-turn)
- [x] Gallery con filtri Before/After
- [x] Case Study section
- [x] Alternanza sezioni chiare/scure ("bianco freddo")

### Fase 2 - Contenuti Dinamici (COMPLETATA)
- [x] 22 pagine Servizio Locale (citta italiane)
- [x] 10 pagine Info (norme, certificazioni, garanzie)
- [x] 15 pagine Focus Tecnico (tipologie pellicole)
- [x] Routing dinamico completo via siteContent.js

### Fase 3 - Prodotti & SEO (COMPLETATA - Feb 2026)
- [x] 21 pagine prodotto individuali (Schede Prodotto MADICO)
  - 8 Antisolari (SB 20, SB 35, NT 20, SG 20, SL 8, SSN 50, RS 20 E, RS 40 E)
  - 10 Sicurezza (RS 20/40 4mil/8mil, CL 400/700 int/ext, SafetyShield 800/1500, GullWing)
  - 2 Privacy (MT 200 XW, Vetrofanie)
- [x] Catalogo prodotti /prodotti con filtro per categoria
- [x] Template prodotto con dati tecnici animati (barre energia, stat cards)
- [x] Navigazione Prodotti nel Header
- [x] SEO dinamico con react-helmet-async su tutte le 80+ pagine
- [x] Sitemap.xml dinamica (81 URL) via /api/sitemap.xml
- [x] Meta title, description, Open Graph per ogni pagina

## Totale Pagine Dinamiche: 80+
- Home, Servizi, Chi Siamo, Contatti, Preventivo, Guida Tecnica, Blog, Profilo, Privacy Policy
- 22 Servizio Locale
- 10 Info
- 15 Focus Tecnico
- 21 Prodotti

## API Endpoints
- `POST /api/chat` - Chatbot OpenAI
- `POST /api/contact` - Form contatti
- `POST /api/quote` - Form preventivo
- `GET /api/health` - Health check
- `GET /api/sitemap.xml` - Sitemap XML dinamica

## Task Futuri
- **P1**: Strategia/script per conversione WordPress
- **P2**: Integrazioni email/WhatsApp reali per form
- **P2**: Robots.txt, structured data (JSON-LD)
