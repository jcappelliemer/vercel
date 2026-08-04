# Solaris cutover checklist - 2026-08-04

Stato: staging WP statico pronto. Non eseguire questi passaggi finche James non conferma lo switch live.

## Stato verificato

- Live attuale ancora su `89.46.109.70`.
- Staging WP statico su `187.124.168.153`.
- Simulazione host finale con `www.solarisfilms.it` su IP staging: OK.
- `blog_public=0` su staging: indicizzazione bloccata.
- `robots.txt` staging: `Disallow: /`.
- Crawl host simulato: 203 URL controllate, 0 pagine rotte, 0 link interni rotti.
- HTML 200: 193 pagine.
- Canonical, title e H1 presenti sulle 193 pagine HTML.
- Redirect previsti: 7.
- Gone previsti: 3.
- Certbot presente sul VPS, ma non esiste ancora un certificato per `solarisfilms.it` / `www.solarisfilms.it`.

Report crawl:

`test_reports/wp-staging-host-sim-final-crawl-2026-08-04T11-48-16-267Z.json`

Zip plugin replica aggiornato:

`wordpress/solaris-static-replica-cutover-ready-20260804-131210.zip`

## Prima dello switch

1. Backup DNS attuale e screenshot pannello DNS.
   - riferimento: `docs/solaris-dns-snapshot-2026-08-04.md`
   - attenzione ai record AAAA: se il nuovo VPS non serve Solaris anche su IPv6, rimuovere o aggiornare gli AAAA esistenti durante il cutover.
2. Backup database e file del vecchio sito live.
3. Backup configurazione nginx staging:
   - `/etc/nginx/sites-available/wordpress-jc4e`
4. Verificare che `nginx -t` sia pulito.
5. Verificare che il plugin `solaris-static-replica` sia attivo.
6. Verificare che `solarisfilms.it` e `www.solarisfilms.it` siano nel vhost staging.
7. Preparare certificato SSL valido per:
   - `solarisfilms.it`
   - `www.solarisfilms.it`
8. Solo al cutover, aggiornare dominio WordPress:
   - `wp option update home https://www.solarisfilms.it`
   - `wp option update siteurl https://www.solarisfilms.it`
9. Solo al cutover, rimuovere blocco indicizzazione:
   - `wp option update blog_public 1`
10. Solo al cutover, verificare:
   - `/robots.txt` con `Allow: /`
   - sitemap con URL `https://www.solarisfilms.it/...`
   - home 200
   - pagine focus 200
   - prodotti 200
   - redirect Tecnosolar 301
   - URL LCD/fotocromatiche/llms-txt 410

## Switch DNS

Aggiornare DNS solo dopo conferma esplicita di James.

- `www.solarisfilms.it` -> IP staging WP
- `solarisfilms.it` -> IP staging WP

TTL consigliato prima dello switch: basso.

Nota IPv6: il live attuale ha record AAAA. Non lasciare gli AAAA puntati al vecchio live se gli A puntano al nuovo VPS, altrimenti alcuni utenti e crawler potrebbero raggiungere ancora il vecchio sito.

## SSL per dominio finale

Stato attuale: Certbot e presente sul VPS, ma non esiste ancora un certificato per `solarisfilms.it` / `www.solarisfilms.it`. Il vhost staging riconosce gia i due host, ma finche il certificato non viene emesso l'HTTPS non e pronto per il dominio finale.

Opzione preferita se si vuole ridurre la finestra di rischio: certificato DNS challenge prima del cambio DNS.

1. Creare il certificato con challenge DNS:
   - `certbot certonly --manual --preferred-challenges dns -d solarisfilms.it -d www.solarisfilms.it`
2. Inserire i record TXT richiesti nel DNS e attendere la propagazione.
3. Agganciare il certificato emesso al vhost nginx di `wordpress-jc4e`.
4. Verificare:
   - `nginx -t`
   - reload nginx
   - test HTTPS con host simulato, se tecnicamente possibile.

Opzione alternativa: HTTP challenge dopo cambio DNS.

1. Puntare `solarisfilms.it` e `www.solarisfilms.it` al VPS staging WP.
2. Attendere la propagazione DNS.
3. Emettere il certificato:
   - `certbot --nginx -d solarisfilms.it -d www.solarisfilms.it`
4. Verificare che Certbot abbia installato il certificato corretto e non quello staging:
   - `certbot certificates`
   - `nginx -t`
   - reload nginx

Note operative:

- Non lasciare il dominio finale in HTTPS con certificato `wordpress-jc4e.srv1502079.hstgr.cloud`.
- Non impostare `blog_public=1` finche HTTPS, canonical e sitemap non sono corretti sul dominio finale.
- Se l'emissione SSL fallisce dopo il cambio DNS, rollback DNS immediato verso il vecchio live.

## Verifica post-switch

1. `https://www.solarisfilms.it/` risponde 200.
2. `http://www.solarisfilms.it/` risponde 301 verso HTTPS.
3. Certificato SSL valido e non staging.
4. `robots.txt` consente indicizzazione.
5. `sitemap.xml` usa solo dominio `https://www.solarisfilms.it`.
6. Crawl completo: 0 404, 0 link interni rotti.
7. Search Console:
   - invio sitemap
   - controllo copertura
   - controllo pagine indicizzate principali
8. Log server: monitorare 404 reali per 48-72 ore.

## Rollback

Se emergono problemi critici:

1. Ripristinare DNS verso il vecchio live.
2. Ripristinare `blog_public=0` sullo staging se torna non pubblico.
3. Tenere Vercel come ulteriore fallback tecnico finche il live WP non e stabile.
