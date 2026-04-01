# Solaris Films - PRD (Product Requirements Document)

## Problema Originale
Creazione di un sito web moderno, dinamico e competitivo per sostituire il sito WordPress solarisfilms.it. Design "luxury hi-tech" con base scura e colori del brand (Solaris Yellow #EAB308). Il sito deve duplicare i contenuti esistenti, avere form di lead generation, chatbot AI e essere SEO-friendly. L'utente vuole convertire il tutto in un sito WordPress interamente modificabile.

## Architettura
- **Frontend React (preview)**: React + Tailwind CSS + Framer Motion + React Router
- **Backend**: FastAPI + Python + MongoDB (Motor)
- **Integrazioni**: OpenAI (Chatbot), react-helmet-async (SEO)
- **Tema WordPress**: Custom theme PHP con ACF, Custom Post Types, AOS animations

## Funzionalita Implementate

### Fase 1 - Core (COMPLETATA)
- [x] Design luxury hi-tech, dark theme con Solaris Yellow (#EAB308)
- [x] Header con logo, navigazione, CTA Telefono (Cyan) e WhatsApp (Verde)
- [x] Hero section animata, Trust Bar, Services, Process, References, Testimonials, FAQ
- [x] Form preventivo e contatti (backend API)
- [x] Chatbot AI integrato con OpenAI (sessioni multi-turn)
- [x] Gallery con filtri Before/After, Case Study section
- [x] Alternanza sezioni chiare/scure ("bianco freddo")

### Fase 2 - Contenuti Dinamici (COMPLETATA)
- [x] 22 pagine Servizio Locale, 10 Info, 15 Focus Tecnico
- [x] Routing dinamico completo via siteContent.js

### Fase 3 - Prodotti & SEO (COMPLETATA - Feb 2026)
- [x] 21 pagine prodotto individuali (Schede Prodotto MADICO)
- [x] Catalogo prodotti /prodotti con filtro per categoria
- [x] SEO dinamico con react-helmet-async su 80+ pagine
- [x] Sitemap.xml dinamica (81 URL), robots.txt
- [x] JSON-LD Schema (Product, Organization, LocalBusiness)

### Fase 4 - Tema WordPress Custom (COMPLETATA - Feb 2026, FIX Apr 2026)
- [x] Tema WP completo con 33 file (48KB zippato)
- [x] 6 Custom Post Types (Prodotto, Servizio Locale, Focus Tecnico, Pagina Info, Contatto, Preventivo)
- [x] ACF field groups programmatici + fallback meta box
- [x] 4 archive templates, 4 single templates, 7 template parts
- [x] Script import dati (21 prodotti + 22 citta + 7 pagine)
- [x] Form contatti/preventivo con AJAX
- [x] CSS completo (luxury hi-tech dark theme, responsive, form styles)
- [x] JS: AOS animations, mobile menu, FAQ accordion, scroll effects
- [x] Compatibilita Yoast SEO (disattivazione automatica meta/schema tema)
- [x] Admin columns per prodotti, Gutenberg disabilitato per CPT
- [x] Menu di navigazione e widget registrati correttamente
- [x] FIX: Rimossa funzione duplicata solaris_is_yoast_active() (causa fatal error)
- [x] FIX: Spostata solaris_fallback_menu() da header.php a functions.php
- [x] FIX: Form CSS spostato da inline a theme.css

### Fase 5 - Pannello Impostazioni Tema (COMPLETATA - Apr 2026)
- [x] Pannello "Impostazioni Solaris" in Aspetto > Impostazioni Solaris
- [x] Campi: Nome Azienda, Sottotitolo, Indirizzo, P.IVA
- [x] Campi: Telefono (link + display), WhatsApp, Email
- [x] Campi: Titolo Hero, Sottotitolo Hero, Testo Footer
- [x] Campi: Social Media (Facebook, Instagram, LinkedIn, YouTube)
- [x] Tutti i template aggiornati per usare solaris_option() dinamicamente
- [x] JSON-LD schema aggiornato con dati dinamici
- [x] Footer con link social dinamici (visibili solo se configurati)

## Totale Pagine: 80+
## API Endpoints
- POST /api/chat, POST /api/contact, POST /api/quote
- GET /api/health, GET /api/sitemap.xml, GET /api/robots.txt

## Task Futuri
- **P1**: Verificare che lo script import dati funzioni correttamente su WP dell'utente
- **P2**: Integrazioni email/WhatsApp reali per form
- **P2**: Configurazione hosting WP e deployment tema
