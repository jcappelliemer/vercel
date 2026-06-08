# Solaris pre-live readiness - 2026-06-08

## Stato attuale

- Staging pubblico verificato: `https://solarisfilms.vercel.app`
- Deploy Vercel attuale: `5fe79dd` - `Mount GA4 analytics script`
- Sitemap staging: 156 URL
- URL in sitemap con 404/500: 0
- URL in sitemap con redirect intermedi: 0
- Riferimenti vietati nel crawl sitemap: 0
- Redirect principali verificati: ok
- Percorsi esclusi/410 verificati: ok

## Nota GA4

Il commit `5fe79dd` e stato mantenuto per consentire all'altro agente di lavorare su tag, monitoraggio conversioni e GA4. Non va sovrascritto con commit precedenti.

## Robots

Robots e stato reso dinamico:

- su `solarisfilms.vercel.app` risponde `Disallow: /`;
- su `www.solarisfilms.it` e `solarisfilms.it` risponde `Allow: /`;
- la sitemap viene dichiarata sul dominio coerente con l'host.

Questo riduce il rischio di lasciare per errore il sito live bloccato dopo lo switch.

## Prima dello switch

1. Confermare in Vercel:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Install Command: `yarn install`
   - Build Command: `node fetch-wp-data.js && node fetch-live-site.js && GENERATE_SOURCEMAP=false yarn build`
   - Output Directory: Next.js default
   - Node.js Version: 24.x
2. Impostare o confermare `NEXT_PUBLIC_SITE_ORIGIN=https://www.solarisfilms.it`.
3. Non modificare ancora DNS/dominio live finche non si decide lo switch.
4. Al momento dello switch, collegare il dominio e fare deploy production.

## Check immediato post-switch

Verificare:

- `https://www.solarisfilms.it/robots.txt` contiene `Allow: /`;
- `https://www.solarisfilms.it/sitemap.xml` contiene URL su `www.solarisfilms.it`;
- home, prodotto, articolo, info e pagina locale hanno canonical su `www.solarisfilms.it`;
- vecchi URL principali rispondono 308 verso la nuova destinazione;
- percorsi esclusi rispondono 410;
- nessun riferimento a NT, fotocromatiche, cromia, Tecnosolar, Stratum/Startum, false-parent, zoho-callback, llms-txt.

## Decisione NFRC

`/info/certificazione-nfrc` resta pagina autonoma. E preferibile al redirect su Garanzie per conservare il contenuto storico specifico e ridurre perdita SEO su query legate a certificazioni NFRC.
