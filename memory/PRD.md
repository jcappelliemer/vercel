# Solaris Films - PRD

## Architettura: WordPress Headless + React + Vercel
```
VPS (utente)        →  WordPress (backoffice contenuti + SEO Dashboard + Email Relay)
                         ↓ REST API
Vercel (staging)    →  Sito React (frontend pubblico)
                         ↓ 
                    →  FastAPI Backend (SEO Agents + Chatbot + Form)
```

## Completato
- [x] Architettura Headless WP + React + Vercel con deploy automatico (webhook)
- [x] Build-time data fetching (fetch-wp-data.js) per aggirare mixed content HTTP/HTTPS
- [x] Tutti i CPT collegati: Prodotti, Focus Tecnici, Pagine Info, Servizi Locali
- [x] WP Settings: Hero, Stats, Footer, Header, Case Studies (6), Gallery (12), Referenze (20 con logo)
- [x] Media Picker integrato per tutti i campi immagine
- [x] Logo personalizzabile da WP (sostituisce SF + SOLARISFILMS)
- [x] Referenze con Nome + Logo + marquee scorrevole
- [x] SEO Agent Orchestra (5 agenti AI, dashboard in WP admin, Gemini 2.5 Flash)
- [x] AI Chatbot (Claude Sonnet 4.5, sessioni multi-turno, MongoDB)
- [x] Form Contatti + Preventivo con email relay via WP REST → Aruba SMTP
- [x] Numeri reali: Tel +39 055 910 7621, WhatsApp +39 392 546 6518
- [x] Pulsante WhatsApp fisso (basso sinistra)
- [x] Badge "Made with Emergent" eliminato
- [x] Testi homepage aggiornati (LoSapeviChe, CaseStudy, FocusTecnici, Process, Services)
- [x] Fix leggibilità "Soluzioni Premium" (overlay scuro + text-shadow)

## Setup Richiesto dall'Utente
1. Caricare tema ZIP su WP
2. WP Mail SMTP configurato con Aruba (FATTO)
3. Chiave Email Relay: `sf-relay-2026-x7k9m` in Impostazioni Solaris
4. SEO Orchestra: configurare API URL Backend in WP admin

## Task Futuri
- P2: Collegamento dominio solarisfilms.it
- P3: Prodotto SaaS vendibile (plugin SEO Orchestra + pacchetto agenzia)
