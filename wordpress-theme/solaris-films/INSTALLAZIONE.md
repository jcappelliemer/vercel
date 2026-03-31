# Solaris Films — Guida Installazione Tema WordPress

## Requisiti
- WordPress 6.0+
- PHP 8.0+
- Plugin consigliati: **ACF** (Advanced Custom Fields), **Yoast SEO**

---

## Installazione Rapida

### 1. Carica il tema
- Comprimi la cartella `solaris-films/` in un file `.zip`
- Vai su **Aspetto > Temi > Aggiungi nuovo > Carica tema**
- Carica il file `.zip` e attiva il tema

### 2. Installa i plugin consigliati
- **Advanced Custom Fields (ACF)** — per i campi prodotto editabili
- **Yoast SEO** — per gestione SEO completa
- **WP Mail SMTP** — per invio email form (opzionale)

### 3. Importa i dati
- Vai su **Strumenti > Solaris Import**
- Clicca "Importa Dati"
- Questo crea automaticamente: 21 prodotti, 22 citta, 7 pagine statiche

### 4. Configura menu
- Vai su **Aspetto > Menu**
- Crea menu "Menu Principale" con: Home, Prodotti, Servizi, Guida Tecnica, Chi Siamo, Contatti
- Assegna a posizione "Menu Principale"

### 5. Imposta homepage
- Vai su **Impostazioni > Lettura**
- "La homepage mostra" > "Una pagina statica"
- Homepage: (crea una pagina vuota "Home" con template "Homepage")

### 6. Configura Permalink
- Vai su **Impostazioni > Permalink**
- Seleziona "Nome articolo" (/%postname%/)
- Salva — IMPORTANTE per far funzionare gli URL puliti

---

## Struttura Contenuti nel Pannello Admin

### Prodotti (Custom Post Type)
- **Menu laterale > Prodotti**
- Ogni prodotto ha campi editabili:
  - Categoria (Antisolari/Sicurezza/Privacy)
  - Sottocategoria
  - Applicazione (Interno/Esterno)
  - Certificazione, Garanzia
  - Dati Tecnici (VLT, IR, UV, Energia, ecc.)
  - Caratteristiche (lista)
  - Focus Tecnico collegato

### Servizi Locali (Citta)
- **Menu laterale > Servizi Locali**
- Ogni citta ha: Regione, Servizi disponibili, Vantaggi

### Focus Tecnici
- **Menu laterale > Focus Tecnici**
- Approfondimenti per tipologia di pellicola

### Pagine Info
- **Menu laterale > Pagine Info**
- Norme, garanzie, certificazioni

### Contatti/Preventivi Ricevuti
- **Menu laterale > Contatti / Preventivi**
- Tutti i messaggi ricevuti dai form vengono salvati qui

---

## Compatibilita Yoast SEO

Il tema e **100% compatibile con Yoast**. Quando Yoast e attivo:
- I meta tag del tema vengono automaticamente disattivati
- Yoast gestisce: title, description, Open Graph, sitemap.xml, robots.txt
- JSON-LD Schema del tema viene disattivato (Yoast usa il suo)
- Puoi modificare il SEO di ogni singola pagina dal box Yoast sotto l'editor

---

## Come Modificare i Contenuti

| Cosa modificare | Dove |
|---|---|
| Testi homepage (hero, stats, FAQ, testimonials) | Modifica pagina Home > campi ACF |
| Aggiungere un prodotto | Prodotti > Aggiungi nuovo |
| Modificare dati tecnici prodotto | Modifica prodotto > tab "Dati Tecnici" |
| Aggiungere una citta | Servizi Locali > Aggiungi nuovo |
| Modificare menu navigazione | Aspetto > Menu |
| Logo e colori | Aspetto > Personalizza |
| Form contatti | I form sono integrati nel tema (AJAX) |

---

## File del Tema

```
solaris-films/
├── style.css                    # Dichiarazione tema
├── functions.php                # Setup tema, CPT, form AJAX
├── header.php                   # Header + navigazione
├── footer.php                   # Footer
├── front-page.php               # Homepage
├── page.php                     # Template pagina generica
├── index.php                    # Fallback / blog
├── single-prodotto.php          # Scheda prodotto singolo
├── archive-prodotto.php         # Catalogo prodotti
├── single-servizio_locale.php   # Pagina citta
├── archive-servizio_locale.php  # Elenco citta
├── single-focus_tecnico.php     # Focus tecnico singolo
├── archive-focus_tecnico.php    # Elenco focus tecnici
├── single-pagina_info.php       # Pagina info singola
├── archive-pagina_info.php      # Elenco pagine info
├── page-contatti.php            # Template contatti (con form)
├── page-preventivo.php          # Template preventivo (con form)
├── css/
│   └── theme.css                # CSS completo del tema
├── js/
│   └── main.js                  # JavaScript (menu, AOS, form)
├── inc/
│   ├── custom-post-types.php    # Registrazione CPT
│   ├── acf-fields.php           # Campi ACF (o meta box fallback)
│   ├── theme-helpers.php        # Funzioni helper
│   └── import-data.php          # Script importazione dati
└── template-parts/
    ├── trust-bar.php
    ├── services.php
    ├── process.php
    ├── gallery.php
    ├── testimonials.php
    ├── faq.php
    └── cta-section.php
```
