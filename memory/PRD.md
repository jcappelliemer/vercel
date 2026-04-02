# Solaris Films - PRD

## Architettura
```
Utente compila form → React Frontend → FastAPI Backend → MongoDB (salvataggio)
                                                        → WP REST Endpoint (email relay)
                                                        → wp_mail() → Aruba SMTP → info@solarisfilms.it
```

## Form Contatti & Preventivo (02/04/2026)
- [x] Form Contatti (`/contatti`) — nome, cognome, email, telefono, messaggio
- [x] Form Preventivo (`/preventivo`) — + ragione sociale, città, tipo pellicola
- [x] Salvataggio MongoDB (collections: `contacts`, `quotes`)
- [x] Invio email via WP Relay (aggira blacklist IP cloud)
- [x] Email HTML formattate con tutti i dati del form
- [x] Reply-To impostato sull'email del mittente

## Numeri Reali Configurati
- [x] Telefono: +39 055 910 7621 (tutti i componenti aggiornati)
- [x] WhatsApp: +39 392 546 6518 (tutti i link wa.me aggiornati)
- [x] Pulsante WhatsApp fisso in basso a destra su tutte le pagine

## Email Relay WP — Setup Richiesto
Per attivare l'invio email, l'utente deve:
1. Caricare il tema ZIP su WP
2. In Impostazioni Solaris → campo "Chiave Segreta Email Relay" → inserire: `sf-relay-2026-x7k9m`
3. Il backend FastAPI (su Vercel) ha la stessa chiave in .env (`WP_EMAIL_RELAY_KEY`)
4. WP_URL nel backend .env deve puntare al sito WP (http://solarisfilms.it)

## SEO Agent Orchestra
- Dashboard integrata in WP Admin (non pubblica)
- 5 agenti AI: Orchestratore, Analisi, Generatore Meta, Contenuto, Local SEO
- LLM: Gemini 2.5 Flash via Emergent Universal Key

## Collegamento WP ↔ React
- [x] Tutti i CPT + Settings + Case Studies + Gallery + Referenze + Media Picker

## Task Prossimi
- P2: Collegare dominio solarisfilms.it
- P2: AI Chatbot con chiave OpenAI utente
