# Solaris Films - PRD

## Problema Originale
Sito web moderno per Solaris Films (solarisfilms.it), distributore esclusivo MADICO USA. Design luxury hi-tech, chatbot AI, form lead generation. Replica completa pagine sito originale.

## Architettura
- **Frontend**: React, Tailwind CSS, Framer Motion, @phosphor-icons/react
- **Backend**: FastAPI, Motor (MongoDB async), emergentintegrations (Claude Sonnet 4.5)
- **Database**: MongoDB

## Design System
- **Tema**: Dark Navy (#0A0F1C) + alternanze bianco freddo (#F1F5F9)
- **Accenti**: Blu (#2563EB) + Giallo Solaris (#EAB308)
- **Font**: Outfit (headings) + Manrope (body)

## Prodotti (4)
1. Pellicole Antisolari (principale)
2. Safety Shield Anti-Esplosione (MADICO SafetyShield G2)
3. Pellicole di Sicurezza (UNI EN 12600)
4. Pellicole Privacy/Design

## Pagine Implementate (50+)

### Pagine Principali
- [x] Homepage (12 sezioni: Hero, TrustBar, Services, FocusTecnici, Process, LoSapeviChe, CaseStudy, Gallery, References, Testimonials, FAQ, CTA)
- [x] Servizi (/servizi)
- [x] Chi Siamo (/chi-siamo)
- [x] Contatti (/contatti)
- [x] Preventivo (/preventivo)
- [x] Blog (/blog)
- [x] Guida Tecnica (/guida-tecnica)
- [x] Profilo Solaris (/profilo-solaris)
- [x] Privacy Policy (/privacy-policy)

### Servizio Locale (22 città)
- [x] Index (/servizio-locale) + pagine per: Roma, Milano, Firenze, Napoli, Torino, Bologna, Venezia, Genova, Bari, Palermo, Ancona, Aosta, Campobasso, Catanzaro, Cosenza, L'Aquila, Perugia, Potenza, Romagna, Trento, Trieste, Udine

### Pagine Info (10)
- [x] Index (/info) + pagine per: Norme, Norma BRC, Sicurezza a norma di legge, Testo unico sicurezza, Sistemi filtranti DPR 59/09, Istruzioni e manutenzione, Garanzie, Certificazione NFRC, Punti di forza, Glossario termini

### Focus Tecnico (15)
- [x] Index (/focus-tecnico) + pagine per: Sputtered, Sunscape, Oscuranti, Riflettenti, Spettro-selettive, Antigraffiti, Termoisolanti, Sicurezza, Decorative, Antisolari, Serie RS, Privacy, Stampabili/Vetrofanie, SafetyShield, Serie CL

### Funzionalità
- [x] Chatbot AI (Claude Sonnet 4.5) con sessioni multi-turno
- [x] Form Preventivo → MongoDB
- [x] Form Contatti → MongoDB
- [x] Gallery con filtri e lightbox
- [x] FAQ Accordion
- [x] Header CTA: telefono cyan + WhatsApp verde

## API Endpoints
- GET /api/health, GET /api/services, GET /api/stats, GET /api/blog
- POST /api/quote, GET /api/quotes
- POST /api/contact
- POST /api/chat

## Backlog
### P1
- SEO metadata, Open Graph tags, sitemap.xml
- Configurare numeri telefono/WhatsApp reali
### P2
- Integrazioni email per notifiche form
- Blog CMS/admin
- Pagine prodotto singolo (schede tecniche per ogni pellicola)
