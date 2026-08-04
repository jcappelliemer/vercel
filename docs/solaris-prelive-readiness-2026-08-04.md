# Solaris pre-live readiness - 2026-08-04

Stato: preparazione non distruttiva completata. Il dominio live `solarisfilms.it` non e stato spostato.

## Branch e PR

- PR: https://github.com/jcappelliemer/vercel/pull/15
- Branch: `agent/solaris-prelive-cutover-package`
- Ultimo commit PR: verificare direttamente su PR #15.
- Stato GitHub: `CLEAN`
- Check Vercel: `SUCCESS`
- Stato PR: draft, non mergiata

File nella PR:

- `wordpress/solaris-static-replica/solaris-static-replica.php`
- `docs/solaris-cutover-checklist-2026-08-04.md`
- `docs/solaris-prelive-readiness-2026-08-04.md`
- `docs/solaris-rollback-plan-2026-08-04.md`
- `docs/solaris-dns-snapshot-2026-08-04.md`
- `docs/solaris-ssl-runbook-2026-08-04.md`
- `docs/solaris-nginx-cutover-snippet-2026-08-04.conf`
- `docs/solaris-switch-day-runbook-2026-08-04.md`
- `scripts/solaris-prelive-verify.ps1`

## Verifiche staging simulate

Report principale:

- `test_reports/wp-staging-host-sim-post-cutover-routing-2026-08-04T12-24-21-620Z.json`

Risultato:

- 204 URL controllate
- 193 pagine HTML 200
- 11.733 link interni controllati
- 0 pagine rotte
- 0 link interni rotti
- 0 title mancanti
- 0 H1 mancanti
- 0 canonical mancanti
- sitemap 200 con 199 URL
- sitemap senza dominio staging
- sitemap senza termini bloccati
- staging ancora noindex: 193 pagine HTML con noindex

Status gestiti nel crawl:

- 200: 194
- 301: 6
- 302: 1 (`/api/fast-contact/` verso WhatsApp)
- 410: 3

## Parita sitemap live

Report:

- `test_reports/sitemap-live-vs-staging-2026-08-04T12-26-48-846Z-missing-status.json`
- `test_reports/live-vs-wp-staging-fresh-recursive-2026-08-04T13-45-57-462Z.json`

Risultato:

- 48 URL presenti nel vecchio live e non nella sitemap staging sono tutte gestite
- 31 redirect 301
- 17 risposte 410 intenzionali
- 0 URL residue in 404
- controllo ricorsivo aggiornato: live 209 URL, staging 199 URL, nessuna nuova URL live scoperta fuori gestione

## Encoding e accenti

Verifica diretta su staging simulato:

- URL: `/certificato-di-sicurezza/`
- H1 servito: `Questo vetro e stato trasformato in vetro di sicurezza` con accento corretto nell'HTML
- Nessun carattere sostitutivo Unicode visibile.
- Nessun mojibake tipico da UTF-8 mal decodificato.

Nota: alcuni report testuali mostrano caratteri alterati per effetto del parser/output, non per l'HTML servito.

## Check rapido aggiuntivo

Ultimo controllo HTTP mirato su staging simulato con host `www.solarisfilms.it` risolto su `187.124.168.153`:

- pagine principali: 200
- landing focus principali: 200
- prodotti campione: 200
- articolo campione: 200
- pagina info garanzie: 200
- pagina local Milano: 200
- redirect Tecnosolar: 301 verso `/prodotti/madico-sg-20-e-ps-sr/`
- URL rimossi LCD/fotocromatiche/llms-txt: 410
- `/robots.txt`: 200 con `Disallow: /`
- `/sitemap.xml`: 200, 199 URL, nessun dominio staging, nessun termine bloccato

## Check read-only VPS

Verifica read-only su VPS `187.124.168.153`:

- host: `srv1502079`
- Docker presente
- Certbot presente
- nessun certificato Let's Encrypt ancora emesso per `solarisfilms.it` / `www.solarisfilms.it`
- certificati presenti solo per:
  - `aeo-orchestra.com`
  - `cms.aeo-orchestra.com`
  - `tfconcierge.com`
  - `wordpress-jc4e.srv1502079.hstgr.cloud`
- container WordPress staging attivo da settimane
- `home`: `https://wordpress-jc4e.srv1502079.hstgr.cloud`
- `siteurl`: `https://wordpress-jc4e.srv1502079.hstgr.cloud`
- `blog_public`: `0`
- plugin attivi:
  - `seo-aeo-orchestra`
  - `plugin-check`
  - `solaris-static-replica`
  - `wpforms-lite`
  - `wp-mail-smtp`
- must-use plugin:
  - `solaris-headless-seo`
- `nginx -t`: OK
- vhost nginx riconosce gia:
  - `wordpress-jc4e.srv1502079.hstgr.cloud`
  - `solarisfilms.it`
  - `www.solarisfilms.it`
- il vhost HTTPS usa ancora il certificato staging `wordpress-jc4e.srv1502079.hstgr.cloud`; al cutover va sostituito/emesso certificato Solaris.

## Check host canonico apex/www

Verifica con host simulato su `187.124.168.153`:

- `http://solarisfilms.it/` -> 301 a `https://solarisfilms.it/`
- `https://solarisfilms.it/` -> 200
- `http://www.solarisfilms.it/` -> 301 a `https://www.solarisfilms.it/`
- `https://www.solarisfilms.it/` -> 200
- canonical home su entrambi gli host: `https://www.solarisfilms.it/`
- sitemap richiesta da apex: genera URL `https://solarisfilms.it/...`
- sitemap richiesta da `www`: genera URL `https://www.solarisfilms.it/...`

Conclusione: prima di rendere indicizzabile il sito finale bisogna aggiungere una regola server-side 301 apex -> `www` anche su HTTPS. Senza questa regola il canonical pagina resta corretto, ma la sitemap puo duplicarsi per host.

## Script verifica rapida

Creato `scripts/solaris-prelive-verify.ps1`.

Esempio staging simulato:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/solaris-prelive-verify.ps1 -ResolveIp 187.124.168.153
```

Risultato atteso prima del cutover: 1 failure su `apex_redirect_to_www`, perche la regola nginx apex -> `www` non e ancora applicata. Gli altri controlli devono restare verdi.

Esempio post-cutover:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/solaris-prelive-verify.ps1 -ExpectIndexable
```

## Cosa resta prima del live

Questi passaggi non vanno eseguiti ora.

1. Decidere e preparare SSL per `solarisfilms.it` e `www.solarisfilms.it`.
2. Solo al cutover, aggiornare DNS verso il VPS staging WP.
3. Solo dopo SSL corretto, aggiornare WordPress:
   - `home`
   - `siteurl`
   - `blog_public=1`
4. Solo dopo il cambio dominio, verificare:
   - `robots.txt` indicizzabile
   - sitemap con dominio finale
   - canonical sul dominio finale
   - crawl completo post-switch
5. Monitorare log 404 per 48-72 ore.

## Note tecniche

- In questa shell locale non sono disponibili `php` e `docker`; il lint PHP va rilanciato sul VPS prima del cutover.
- Il plugin attivo era gia stato lintato nel container VPS durante la patch precedente.
- Il certificato SSL Solaris non risulta ancora presente sul VPS; non usare in produzione il certificato staging `wordpress-jc4e.srv1502079.hstgr.cloud`.
