# Guida Installazione Tema Solaris Films per WordPress

## Requisiti
- WordPress 6.0+
- PHP 8.0+
- Plugin ACF (opzionale ma consigliato per gestione campi avanzata)

## Step 1 — Installa il Tema
1. Vai su **Aspetto > Temi > Aggiungi nuovo > Carica tema**
2. Seleziona il file `solaris-films.zip`
3. Clicca **Installa ora** e poi **Attiva**

## Step 2 — Importa i Contenuti
1. Vai su **Strumenti > Solaris Import** (nel menu WP Admin)
2. Clicca **Importa Dati**
3. Verranno creati automaticamente:
   - 21 prodotti MADICO con schede tecniche complete
   - 22 citta (servizi locali)
   - 7 pagine standard (Contatti, Preventivo, Servizi, Chi Siamo, ecc.)

## Step 3 — Configura la Homepage
1. Vai su **Impostazioni > Lettura**
2. Seleziona "**Una pagina statica**"
3. Come "Pagina iniziale" scegli una qualsiasi pagina (il tema usa `front-page.php` automaticamente)

## Step 4 — Configura i Menu
1. Vai su **Aspetto > Menu**
2. Crea un nuovo menu chiamato "Menu Principale"
3. Aggiungi le pagine:
   - Home
   - Prodotti (link personalizzato a `/prodotti/`)
   - Servizi Locali (link personalizzato a `/servizio-locale/`)
   - Focus Tecnici (link personalizzato a `/focus-tecnico/`)
   - Chi Siamo
   - Contatti
4. In **Posizioni del menu**, seleziona "Menu Principale"
5. Salva il menu

## Step 5 — Aggiorna i Permalink
1. Vai su **Impostazioni > Permalink**
2. Seleziona "**Nome articolo**" (post name)
3. Salva le modifiche

## Struttura del Tema
```
solaris-films/
  functions.php          — Setup tema, menu, widget, form AJAX
  header.php             — Header con navigazione e CTA
  footer.php             — Footer con link e contatti
  front-page.php         — Homepage completa
  style.css              — Metadati tema WP
  css/theme.css          — Tutti gli stili (dark theme, responsive)
  js/main.js             — Animazioni AOS, menu mobile, form AJAX
  inc/
    custom-post-types.php — CPT e tassonomie
    acf-fields.php        — Campi ACF (con fallback meta box)
    theme-helpers.php     — Funzioni helper
    import-data.php       — Script import dati
  template-parts/        — Sezioni riutilizzabili
  single-*.php           — Template singoli per CPT
  archive-*.php          — Template archivio per CPT
  page-contatti.php      — Pagina contatti con form
  page-preventivo.php    — Pagina preventivo con form
```

## Note
- Il tema include un menu di fallback automatico se non ne viene configurato uno
- I form di contatto e preventivo funzionano via AJAX e salvano i dati nel DB di WP
- Il tema e compatibile con Yoast SEO (disattiva schema/meta quando Yoast e attivo)
- I dati tecnici dei prodotti si visualizzano con barre animate (AOS)
