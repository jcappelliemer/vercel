# Solaris SSL runbook - 2026-08-04

Questo runbook non va eseguito ora. Serve per il momento in cui James conferma il cutover.

## Stato verificato

- VPS: `187.124.168.153`
- Certbot: `2.9.0`
- Plugin Certbot disponibili:
  - `nginx`
  - `standalone`
  - `webroot`
- Plugin DNS Aruba automatico: non presente
- Certificato Solaris: non ancora presente
- Certificato attuale del vhost HTTPS: `wordpress-jc4e.srv1502079.hstgr.cloud`

## Opzione A - Certificato prima dello switch DNS

Questa e la strada piu pulita se si vuole arrivare allo switch con HTTPS gia pronto sul VPS nuovo. Richiede inserimento manuale di record TXT nel DNS.

1. Avviare la richiesta certificato sul VPS:

   ```bash
   certbot certonly --manual --preferred-challenges dns -d solarisfilms.it -d www.solarisfilms.it
   ```

2. Certbot mostrera uno o piu record TXT da creare:

   ```text
   _acme-challenge.solarisfilms.it
   _acme-challenge.www.solarisfilms.it
   ```

3. Inserire i TXT nel pannello DNS Aruba/Technorail.

4. Verificare propagazione TXT prima di premere invio su Certbot:

   ```bash
   dig TXT _acme-challenge.solarisfilms.it +short
   dig TXT _acme-challenge.www.solarisfilms.it +short
   ```

5. Completare Certbot. Il certificato atteso dovrebbe finire in:

   ```text
   /etc/letsencrypt/live/solarisfilms.it/
   ```

6. Agganciare il certificato Solaris al vhost nginx `wordpress-jc4e` sostituendo le righe certificate staging:

   ```nginx
   ssl_certificate /etc/letsencrypt/live/solarisfilms.it/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/solarisfilms.it/privkey.pem;
   ```

7. Preparare il canonical host nel vhost nginx: il dominio apex deve andare in 301 a `www`.

   Esempio di assetto desiderato:

   ```nginx
   server {
       listen 443 ssl http2;
       server_name solarisfilms.it;
       ssl_certificate /etc/letsencrypt/live/solarisfilms.it/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/solarisfilms.it/privkey.pem;
       return 301 https://www.solarisfilms.it$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name www.solarisfilms.it;
       ssl_certificate /etc/letsencrypt/live/solarisfilms.it/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/solarisfilms.it/privkey.pem;
       # WordPress proxy/app config esistente
   }
   ```

   Anche HTTP deve chiudere in un solo hop verso `https://www.solarisfilms.it$request_uri`.

8. Validare e ricaricare:

   ```bash
   nginx -t
   systemctl reload nginx
   ```

9. Testare HTTPS prima del cambio DNS usando resolve locale:

   ```bash
   curl -I --resolve www.solarisfilms.it:443:187.124.168.153 https://www.solarisfilms.it/
   curl -I --resolve solarisfilms.it:443:187.124.168.153 https://solarisfilms.it/
   ```

   Il primo deve rispondere 200, il secondo 301 verso `https://www.solarisfilms.it/`.

10. Solo se il certificato e valido e il canonical host e corretto, procedere al cambio DNS.

## Opzione B - Certificato dopo lo switch DNS

Questa strada e piu semplice, ma apre una finestra in cui il dominio e gia puntato al nuovo VPS e il certificato va emesso subito.

1. Aggiornare DNS:

   - `solarisfilms.it` A -> `187.124.168.153`
   - `www.solarisfilms.it` A -> `187.124.168.153`
   - gestire anche AAAA: aggiornare al nuovo IPv6 se disponibile oppure rimuovere gli AAAA temporaneamente

2. Attendere propagazione DNS.

3. Emettere e installare certificato con plugin nginx:

   ```bash
   certbot --nginx -d solarisfilms.it -d www.solarisfilms.it
   ```

4. Validare:

   ```bash
   certbot certificates
   nginx -t
   systemctl reload nginx
   curl -I https://www.solarisfilms.it/
   curl -I https://solarisfilms.it/
   ```

   `https://www.solarisfilms.it/` deve rispondere 200. `https://solarisfilms.it/` deve rispondere 301 verso `https://www.solarisfilms.it/`.

## Regole operative

- Non lasciare il dominio finale servito con il certificato `wordpress-jc4e.srv1502079.hstgr.cloud`.
- Non impostare `blog_public=1` prima che HTTPS e canonical siano corretti.
- Non lasciare apex e `www` entrambi in 200: genera sitemap diverse per host e crea duplicazione SEO.
- Non cambiare MX o TXT non collegati alla challenge ACME.
- Dopo emissione certificato, rimuovere i TXT `_acme-challenge` solo quando il certificato e stato verificato e il rinnovo e pianificato.

## Nota rinnovo

Un certificato ottenuto con `--manual --preferred-challenges dns` non si rinnova automaticamente senza intervento manuale o senza plugin DNS/API. Se si usa Opzione A, dopo il cutover valutare:

- passare a challenge HTTP gestita da nginx per rinnovi automatici, se il dominio punta stabilmente al VPS;
- oppure configurare automazione DNS se disponibile.
