# Solarisfilms.es - blocchi live e prossime azioni

Data: 2026-08-05
Stato: live non ancora autorizzato.

## Blocco 1 - Dominio / authority

Ticket Aruba aperto:

```txt
Codice: 3C1-320604D2-00C1
Oggetto: Dominio solarisfilms.es mostra Verification of Contact Information
Stato: In gestione
```

Situazione rilevata:

```txt
solarisfilms.es      A 212.123.41.108
www.solarisfilms.es  A 212.123.41.108
crm.solarisfilms.es  A 212.123.41.108
```

Il dominio risponde ancora con pagina:

```txt
Verification of Contact Information
```

La diagnostica ticket mostra:

```txt
Puntamento Dominio: solarisfilms.es. 212.123.41.108
Puntamento WWW: www.solarisfilms.es. 212.123.41.108
Puntamento NS:
Stato sull'authority: --
```

Prima del live serve risposta Aruba/registrar e rimozione del blocco registrant/authority.

## Blocco 2 - HTTPS

Attualmente:

```txt
https://solarisfilms.es      timeout
https://www.solarisfilms.es  timeout
```

Prima del live serve certificato valido su apex e www.

## Blocco 3 - WordPress REST

Attualmente:

```txt
https://www.solarisfilms.es/wp-json/  timeout
```

Prima dell'import serve WordPress raggiungibile e REST attivo.

## Blocco 4 - Contatti reali

Il payload contiene ancora placeholder su `/contacto/`:

```txt
[TELEFONO_ES]
[WHATSAPP_ES]
[EMAIL_ES]
[DIRECCION_ES]
```

Email gia prevista:

```txt
info@solarisfilms.es
```

Servono ancora:

```txt
telefono pubblico:
WhatsApp pubblico:
indirizzo pubblico:
```

## Kit pronto

Kit WordPress locale:

```txt
wordpress/solaris-es-install-kit/
wordpress/solaris-es-install-kit-2026-08-05-ready.zip
```

Contiene:

- tema `solaris-es-theme`;
- mu-plugin CPT `solaris-es-content-types.php`;
- manifest checksum.

## Sequenza dopo sblocco dominio

1. Verificare dominio:

```powershell
node scripts\solaris-es-preflight-check.js
```

2. Configurare contatti reali nel file ignorato:

```txt
docs/solaris-es/solarisfilms-es-launch-config.local.json
```

3. Generare payload configurato e normalizzato:

```powershell
node scripts\solaris-es-apply-launch-config.js --config docs\solaris-es\solarisfilms-es-launch-config.local.json
node scripts\solaris-es-normalize-spanish.js --payload docs\solaris-es\generated\solarisfilms-es-wp-import-payload-configured.json
```

4. Verificare WordPress:

```powershell
node scripts\solaris-es-wp-readiness-check.js
```

5. Import pilota come bozze:

```powershell
node scripts\solaris-es-wp-rest-import-drafts.js --payload docs\solaris-es\generated\solarisfilms-es-wp-import-payload-spanish-normalized.json --apply --type page --limit 2
```

6. QA post-import:

```powershell
node scripts\solaris-es-post-import-qa.js --live --base https://www.solarisfilms.es
```

7. Solo dopo QA verde: import completo come bozze. Publish manuale, non automatico.

## Regole

- Non toccare `solarisfilms.it`.
- Non pubblicare contenuti `.es` prima di HTTPS, REST, contatti e QA.
- Non usare `robots production` finche il sito non e davvero pronto.
- Non inserire badge AEO Orchestra nel tema: deve essere funzione/plugin Orchestra.
