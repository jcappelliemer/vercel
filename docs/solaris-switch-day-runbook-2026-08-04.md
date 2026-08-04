# Solaris switch day runbook - 2026-08-04

Usare solo quando James conferma lo switch live. Non eseguire prima.

## 0. Stop modifiche

- Bloccare modifiche contenuti durante lo switch.
- Tenere aperti:
  - pannello DNS Aruba/Technorail
  - SSH VPS `187.124.168.153`
  - WordPress staging `wordpress-jc4e.srv1502079.hstgr.cloud`
  - PR/checklist GitHub

## 1. Backup immediati

- Screenshot DNS attuale.
- Confermare snapshot: `docs/solaris-dns-snapshot-2026-08-04.md`.
- Backup nginx:

```bash
cp /etc/nginx/sites-available/wordpress-jc4e /tmp/ROLLBACK-nginx-wordpress-jc4e-pre-live-$(date +%Y%m%d-%H%M%S).conf
```

- Backup database/file WordPress se non gia disponibile.

## 2. SSL

Scelta preferita: certificato prima del DNS con DNS challenge.

```bash
certbot certonly --manual --preferred-challenges dns -d solarisfilms.it -d www.solarisfilms.it
```

- Inserire i TXT richiesti nel DNS.
- Verificare propagazione:

```bash
dig TXT _acme-challenge.solarisfilms.it +short
dig TXT _acme-challenge.www.solarisfilms.it +short
```

- Completare Certbot.
- Verificare certificato:

```bash
certbot certificates
```

Il certificato atteso deve coprire:

- `solarisfilms.it`
- `www.solarisfilms.it`

## 3. Nginx canonical host

- Applicare la struttura dello snippet:

```text
docs/solaris-nginx-cutover-snippet-2026-08-04.conf
```

Requisiti:

- `https://www.solarisfilms.it/` -> 200
- `https://solarisfilms.it/` -> 301 a `https://www.solarisfilms.it/`
- `http://www.solarisfilms.it/` -> 301 a `https://www.solarisfilms.it/`
- `http://solarisfilms.it/` -> 301 a `https://www.solarisfilms.it/`

Validare:

```bash
nginx -t
systemctl reload nginx
```

## 4. DNS

Aggiornare solo i record web:

- `solarisfilms.it` A -> `187.124.168.153`
- `www.solarisfilms.it` A -> `187.124.168.153`

Record AAAA:

- se il nuovo VPS non ha IPv6 configurato per Solaris, rimuovere temporaneamente gli AAAA o aggiornarli al nuovo IPv6 corretto;
- non lasciare AAAA puntati al vecchio live.

Non modificare:

- MX
- SPF/TXT mail
- Zoho TXT
- Facebook/Apple verification TXT

## 5. WordPress dominio finale

Eseguire solo quando DNS/SSL sono corretti o quando il test con host finale e pronto:

```bash
wp option update home https://www.solarisfilms.it --allow-root
wp option update siteurl https://www.solarisfilms.it --allow-root
```

Controllare:

```bash
wp option get home --allow-root
wp option get siteurl --allow-root
wp option get blog_public --allow-root
```

`blog_public` deve restare `0` finche i controlli HTTPS/canonical non sono verdi.

## 6. Verifica pre-index

Lanciare:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/solaris-prelive-verify.ps1
```

Prima di aprire indicizzazione devono essere verdi:

- home `www` 200
- apex 301 a `www`
- sitemap solo `https://www.solarisfilms.it`
- pagine chiave 200
- Tecnosolar 301
- LCD/fotocromatiche/llms-txt 410

Se fallisce qualcosa di critico, non aprire indicizzazione.

## 7. Aprire indicizzazione

Solo dopo verifica verde:

```bash
wp option update blog_public 1 --allow-root
```

Verificare:

```bash
curl -I https://www.solarisfilms.it/robots.txt
curl https://www.solarisfilms.it/robots.txt
```

Poi rilanciare:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/solaris-prelive-verify.ps1 -ExpectIndexable
```

## 8. Crawl finale

Controllare:

- 0 404 su sitemap e link interni principali.
- `/sitemap.xml` contiene solo `https://www.solarisfilms.it`.
- Nessun termine vietato in sitemap:
  - lcd
  - fotocromatiche
  - tecnosolar
  - zoho-callback
  - false-parent
  - llms-txt

## 9. Search Console

- Inviare `https://www.solarisfilms.it/sitemap.xml`.
- Controllare copertura.
- Controllare pagine principali:
  - home
  - prodotti
  - focus tecnici
  - pagina garanzie
  - certificato di sicurezza
  - servizio locale Milano

## 10. Monitoraggio 48-72 ore

- Monitorare log 404.
- Controllare redirect piu importanti.
- Non cancellare Vercel finche il nuovo live non e stabile.
- Non cancellare backup nginx/database.

## Rollback rapido

Rollback se:

- HTTPS non valido e non risolvibile rapidamente;
- home o pagine principali non rispondono;
- 404 diffusi;
- robots/sitemap incoerenti;
- apex e `www` restano entrambi 200.

Azioni:

1. Ripristinare DNS verso vecchio live:
   - A `89.46.109.70`
   - AAAA `2a00:6d40:4:1::c300:70` se era stato rimosso/modificato.
2. Rimettere staging noindex:

```bash
wp option update blog_public 0 --allow-root
```

3. Se necessario ripristinare nginx dal backup:

```bash
cp /tmp/ROLLBACK-nginx-wordpress-jc4e-pre-live-*.conf /etc/nginx/sites-available/wordpress-jc4e
nginx -t
systemctl reload nginx
```

4. Annotare ora e motivo rollback.
