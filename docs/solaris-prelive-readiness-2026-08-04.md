# Solaris pre-live readiness - 2026-08-04

Stato: preparazione non distruttiva completata. Il dominio live `solarisfilms.it` non e stato spostato.

## Branch e PR

- PR: https://github.com/jcappelliemer/vercel/pull/14
- Branch: `agent/static-replica-cutover-routing`
- Ultimo commit PR: `5ed24a7`
- Stato GitHub: `CLEAN`
- Check Vercel: `SUCCESS`
- Stato PR: draft, non mergiata

File nella PR:

- `wordpress/solaris-static-replica/solaris-static-replica.php`
- `docs/solaris-cutover-checklist-2026-08-04.md`

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

Risultato:

- 48 URL presenti nel vecchio live e non nella sitemap staging sono tutte gestite
- 31 redirect 301
- 17 risposte 410 intenzionali
- 0 URL residue in 404

## Encoding e accenti

Verifica diretta su staging simulato:

- URL: `/certificato-di-sicurezza/`
- H1 servito: `Questo vetro e stato trasformato in vetro di sicurezza` con accento corretto nell'HTML
- Nessun carattere sostitutivo `�`
- Nessun mojibake `Ã` / `Â`

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
