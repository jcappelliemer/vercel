# Solaris DNS snapshot - 2026-08-04

Snapshot read-only dei record DNS prima del cutover. Il live non e stato modificato.

## Dominio apex

`solarisfilms.it`

- A: `89.46.109.70`
- TTL A osservato: `300`
- AAAA: `2a00:6d40:4:1::c300:70`
- TTL AAAA osservato: `3600`

## WWW

`www.solarisfilms.it`

- A: `89.46.109.70`
- TTL A osservato: `3600`
- AAAA: `2a00:6d40:4:1::c300:70`
- TTL AAAA osservato: `3244`

## Nuovo target previsto solo al cutover

VPS WordPress staging:

- IPv4: `187.124.168.153`
- Host tecnico: `wordpress-jc4e.srv1502079.hstgr.cloud`

## Nota IPv6

Prima dello switch verificare se il VPS nuovo deve ricevere anche un record AAAA. Se non viene configurato IPv6 per Solaris sul nuovo VPS, rimuovere o aggiornare i record AAAA esistenti; lasciarli puntati al vecchio live creerebbe traffico misto tra vecchio e nuovo sito.

## Uso rollback

In caso di rollback DNS, ripristinare almeno:

- `solarisfilms.it` A -> `89.46.109.70`
- `www.solarisfilms.it` A -> `89.46.109.70`
- record AAAA ai valori originali se erano stati cambiati/rimossi

Tenere TTL basso durante cutover e rollback.
