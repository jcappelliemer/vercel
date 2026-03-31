# Solaris Films - PRD

## Problema Originale
Creare un sito web moderno, dinamico e competitivo per Solaris Films (solarisfilms.it), azienda distributrice esclusiva MADICO USA per pellicole per vetri in Italia. Design "luxury hi-tech", SEO-friendly, chatbot AI, form di lead generation.

## Architettura
- **Frontend**: React, Tailwind CSS, Framer Motion, Shadcn UI, @phosphor-icons/react
- **Backend**: FastAPI, Motor (MongoDB async), emergentintegrations (LLM)
- **Database**: MongoDB
- **AI Chatbot**: Claude Sonnet 4.5 via Emergent LLM Key

## Design System
- **Tema**: Dark Navy (#0A0F1C) con alternanze bianco freddo (#F1F5F9) + accenti blu (#2563EB) e giallo Solaris (#EAB308)
- **Font**: Outfit (headings) + Manrope (body)
- **Stile**: Luxury hi-tech, glassmorphism, gradient accents, Framer Motion animations
- **Alternanza**: Services, Process, CaseStudy, Testimonials su bianco freddo; Hero, FocusTecnici, LoSapeviChe, Gallery su dark

## Prodotti (aggiornato)
1. **Pellicole Antisolari** — Prodotto principale. -8°C, UV 99%, risparmio 30-50%
2. **Safety Shield Anti-Esplosione** — MADICO SafetyShield G2. Anti-blast, anti-intrusione. Certificazioni GSA, ASTM, EN 356
3. **Pellicole di Sicurezza** — UNI EN 12600, D.Lgs. 81/2008
4. **Pellicole Privacy/Design** — Satinate, decorative, personalizzabili

**RIMOSSI**: LCD Switch, Fotocromatiche

## Funzionalità Implementate
### Homepage
- [x] Hero con CTA e badge flottanti
- [x] TrustBar (ISO 9001, MADICO, UNI EN 12600, Green)
- [x] Sezione Servizi (4 prodotti)
- [x] Focus Tecnici (6 dati tecnici)
- [x] Processo (4 step)
- [x] Lo Sapevi Che (6 facts educativi)
- [x] Case Study (3 progetti: Banca d'Italia, EUR Spa, Università Bologna)
- [x] Gallery "I nostri lavori" (8 progetti, filtri per categoria, lightbox)
- [x] Carosello Referenze (marquee animato)
- [x] Testimonials (3 reviews)
- [x] FAQ Accordion (8 domande)
- [x] CTA finale

### Header
- [x] Navigazione responsive + menu mobile
- [x] CTA Telefono (icona cornetta cyan)
- [x] CTA WhatsApp (logo WhatsApp verde)
- [x] CTA Preventivo (bottone giallo)

### Pagine
- [x] Servizi — 4 prodotti dettagliati con Safety Shield + certificazioni
- [x] Chi Siamo — Storia, Mission, Vision, Sostenibilità, Referenze
- [x] Blog — 4 articoli con filtro categorie
- [x] Contatti — Form + link tel/WA/email/mappa
- [x] Preventivo — Form completo con dropdown prodotti aggiornato
- [x] Guida Tecnica — Guida completa alle pellicole (antisolari, sicurezza, SafetyShield, privacy)
- [x] Privacy Policy — Informativa GDPR completa

### Backend
- [x] Chatbot AI (Claude Sonnet 4.5) con sessioni multi-turno
- [x] Form Preventivo → MongoDB
- [x] Form Contatti → MongoDB
- [x] API Servizi (4 prodotti)

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/quote` - Invia preventivo
- `GET /api/quotes` - Lista preventivi
- `POST /api/contact` - Invia contatto
- `POST /api/chat` - Chatbot AI
- `GET /api/services` - Lista servizi (4)
- `GET /api/stats` - Statistiche azienda
- `GET /api/blog` - Lista articoli blog

## Backlog
### P1
- Verificare corrispondenza testi con solarisfilms.it originale
- SEO metadata, Open Graph tags, sitemap
- Componenti Stats e WhyUs nella homepage

### P2
- Configurare numeri telefono/WhatsApp reali
- Integrazioni email per notifiche form
- Blog con CMS/admin per gestione articoli
