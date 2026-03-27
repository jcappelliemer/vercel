# Solaris Films - PRD

## Problema Originale
Creare un sito web moderno, dinamico e competitivo per Solaris Films (solarisfilms.it), azienda distributrice esclusiva MADICO USA per pellicole per vetri in Italia. Il sito deve sostituire l'attuale WordPress, con design "luxury hi-tech", SEO-friendly, chatbot AI, e form di lead generation.

## Architettura
- **Frontend**: React, Tailwind CSS, Framer Motion, Shadcn UI, @phosphor-icons/react
- **Backend**: FastAPI, Motor (MongoDB async), emergentintegrations (LLM)
- **Database**: MongoDB
- **AI Chatbot**: Claude Sonnet 4.5 via Emergent LLM Key

## Design System
- **Tema**: Dark Navy (#0A0F1C) con accenti blu (#2563EB) e giallo Solaris (#EAB308)
- **Font**: Outfit (headings) + Manrope (body)
- **Stile**: Luxury hi-tech, glassmorphism cards, gradient accents, Framer Motion animations

## Funzionalità Implementate
- [x] Homepage con Hero, TrustBar, Services, Process, Testimonials, CTA, Footer
- [x] Chatbot AI (Claude Sonnet 4.5) con sessioni multi-turno
- [x] Form Preventivo (/preventivo) → salva in MongoDB
- [x] Form Contatti (/contatti) → salva in MongoDB
- [x] Pagina Servizi con 5 servizi dettagliati
- [x] Pagina Chi Siamo con storia, mission, vision, referenze
- [x] Pagina Blog con filtro categorie
- [x] Header con navigazione responsive + menu mobile
- [x] Footer con link, contatti, social
- [x] Animazioni Framer Motion su tutti i componenti
- [x] Palette giallo Solaris (#EAB308) su tutto il sito

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/quote` - Invia preventivo
- `GET /api/quotes` - Lista preventivi
- `POST /api/contact` - Invia contatto
- `POST /api/chat` - Chatbot AI
- `GET /api/services` - Lista servizi
- `GET /api/stats` - Statistiche azienda
- `GET /api/blog` - Lista articoli blog

## Backlog
### P1
- Verificare che i testi corrispondano esattamente a solarisfilms.it
- SEO metadata, Open Graph tags, sitemap

### P2
- Completare link WhatsApp/telefono con numeri reali
- Integrazioni email per notifiche form
- Aggiungere componente Stats e WhyUs alla homepage
- Blog con CMS/admin per gestione articoli
