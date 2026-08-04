# Solaris rollback plan - 2026-08-04

Questo documento serve solo se, dopo il cutover, emergono problemi critici. Non eseguire questi passaggi durante la preparazione.

## Obiettivo rollback

Riportare `solarisfilms.it` e `www.solarisfilms.it` al vecchio live senza lasciare pagine non raggiungibili, certificati errati o indicizzazione incoerente sullo staging.

## Trigger di rollback

Rollback immediato se si verifica uno di questi casi:

- HTTPS non valido sul dominio finale e non risolvibile rapidamente.
- Home o pagine principali non rispondono 200.
- Crawl post-switch con 404 diffusi su URL indicizzate.
- `robots.txt` o sitemap generano stato incoerente e non correggibile subito.
- WordPress staging diventa instabile o non accessibile.

## Dati noti prima del cutover

- Vecchio live attuale: `89.46.109.70`
- Nuovo WP staging: `187.124.168.153`
- Live non ancora spostato al momento della preparazione.
- Staging ancora noindex.
- Certificato Solaris non ancora presente sul VPS staging.

## Backup da avere prima dello switch

1. Screenshot DNS attuale.
2. Export zona DNS o valori A/AAAA/CNAME attuali.
3. Backup database vecchio live.
4. Backup file vecchio live.
5. Backup nginx nuovo VPS:
   - `/etc/nginx/sites-available/wordpress-jc4e`
6. Backup plugin replica attivo:
   - `wp-content/plugins/solaris-static-replica/solaris-static-replica.php`

Backup gia creati durante la preparazione:

- `/tmp/ROLLBACK-nginx-wordpress-jc4e-pre-solaris-staging-.conf`
- `/tmp/ROLLBACK-nginx-wordpress-jc4e-http-live-host-*.conf`

## Rollback DNS

1. Ripristinare i record DNS di `solarisfilms.it` e `www.solarisfilms.it` verso il vecchio live:
   - IPv4 precedente: `89.46.109.70`
   - IPv6 precedente, se ancora usato: `2a00:6d40:4:1::c300:70`
2. Lasciare TTL basso finche il rollback non e stabilizzato.
3. Verificare propagazione da piu risolutori.

Nota: se durante il cutover gli AAAA vengono rimossi invece che aggiornati, nel rollback ripristinare anche quelli solo se il vecchio live continua a usarli correttamente.

## Rollback WordPress staging

Se lo staging non deve restare pubblico dopo rollback:

1. Rimettere blocco indicizzazione:
   - `wp option update blog_public 0 --allow-root`
2. Se `home` e `siteurl` erano stati cambiati al dominio finale, riportarli allo staging:
   - `wp option update home https://wordpress-jc4e.srv1502079.hstgr.cloud --allow-root`
   - `wp option update siteurl https://wordpress-jc4e.srv1502079.hstgr.cloud --allow-root`
3. Verificare:
   - `/robots.txt` con `Disallow: /`
   - staging accessibile dal suo hostname tecnico

## Rollback nginx

Se la modifica nginx crea problemi:

1. Ripristinare il backup:
   - `cp /tmp/ROLLBACK-nginx-wordpress-jc4e-pre-solaris-staging-.conf /etc/nginx/sites-available/wordpress-jc4e`
2. Validare:
   - `nginx -t`
3. Ricaricare nginx:
   - `systemctl reload nginx`

Se il backup con wildcard timestamp e quello corretto, usare il file piu recente:

- `/tmp/ROLLBACK-nginx-wordpress-jc4e-http-live-host-*.conf`

## Verifiche dopo rollback

1. `https://www.solarisfilms.it/` torna al vecchio live.
2. Il certificato mostrato dal browser e quello coerente con il vecchio live.
3. Le pagine principali del vecchio sito rispondono.
4. Lo staging torna noindex.
5. Nessun redirect permanente resta puntato al nuovo staging in modo involontario.
6. Annotare ora di rollback e motivo.

## Cosa non fare durante rollback

- Non cancellare il nuovo WP staging.
- Non cancellare Vercel finche il nuovo live non e stabile.
- Non eliminare backup nginx o database.
- Non cambiare contenuti durante la fase di emergenza: prima ripristinare disponibilita, poi analizzare.
