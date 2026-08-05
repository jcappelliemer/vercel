# Solarisfilms.es - Editorial board

Data: 2026-08-05  
Fonte: dry-run import, SEO metadata, hreflang map e route manifest in `docs/solaris-es`.

## Scopo

Questa board serve a decidere cosa si puo scrivere, revisionare e importare in WordPress per `solarisfilms.es` senza pubblicare nulla per errore.

Tutte le pagine restano in bozza finche il relativo gate non e chiuso. Nessuna voce di questa board autorizza DNS, indicizzazione o pubblicazione.

## Conteggi

- Totale righe: 78
- Per priorita: P0 17, P1 34, P2 25, P2-hold 2
- Per post type: page 8, pagina_info 10, articulo 10, focus_tecnico 15, producto 21, servicio_local 14
- Per gate: legal_data 2, legal_review 13, contact_data 1, form_crm 1, technical_sheet 20, local_review 14, copy_review 25, commercial_review 2

## P0 - blocchi da chiudere prima di qualsiasi go-live

| Path | Gate | Owner | Azione |
| --- | --- | --- | --- |
| `/` | `legal_data` | James + consulente legale/societario | Inserire dati societari definitivi. |
| `/certificado-de-seguridad/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/company-profile/` | `legal_data` | James + consulente legale/societario | Inserire dati societari definitivi. |
| `/contacto/` | `contact_data` | James + commerciale Spagna | Inserire contatti definitivi. |
| `/info/garantias/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/info/norma-brc/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/info/normativa-y-seguridad/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/info/seguridad-conforme-a-la-ley/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/info/seguridad-y-salud-en-el-trabajo/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/info/sistemas-filtrantes/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/lo-sabias/peliculas-de-seguridad-une-en-12600/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/lo-sabias/peliculas-safetyshield-para-cristales/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/peliculas-antisolares-de-seguridad-serie-rs/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/peliculas-de-seguridad-neutras-serie-cl/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/peliculas-de-seguridad/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |
| `/presupuesto/` | `form_crm` | James + CRM | Configurare e testare form senza lead reali. |
| `/safetyshield/` | `legal_review` | legale/normativo | Revisionare testo prima di pubblicare. |

## File operativo

La matrice completa e in:

- `docs/solaris-es/solarisfilms-es-editorial-board-2026-08-05.csv`

Colonne principali:

- `priority`: P0, P1, P2, P2-hold;
- `review_gate`: motivo del blocco;
- `owner`: chi deve validare;
- `blocker`: cosa manca;
- `recommended_action`: prossimo passo concreto;
- `it_reference`: pagina italiana di riferimento, se presente;
- `hreflang_status`: stato della mappatura lingua, se gia definito.

## Regole

- Non pubblicare pagine con placeholder societari o contatti non definitivi.
- Non generare sitemap indicizzabile finche i P0 non sono chiusi.
- Non aggiungere hreflang a pagine non equivalenti.
- Non reintrodurre contenuti esclusi dal progetto italiano.
- I campi Orchestra restano vuoti: Orchestra deve intervenire dopo l'import bozza e la review contenuto.
