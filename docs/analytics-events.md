# Solaris Films Analytics Events

This file is the operational map for GA4 lead tracking on the new Solaris Films site.

## Current GA4 Setup

- Measurement ID: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, fallback `G-JVXJ62Q76Z`
- Runtime component: `frontend/src/components/Analytics.jsx`
- App mount: `frontend/pages/_app.js`
- Transport: direct `gtag.js`, not Google Tag Manager

## Lead Events

| Event name | Source | Meaning | GA4 key event |
| --- | --- | --- | --- |
| `click_tel` | Global click listener on `tel:` links | User clicked a phone CTA | Recommended |
| `click_email` | Global click listener on `mailto:` links | User clicked an email CTA | Optional |
| `click_whatsapp` | Global click listener on WhatsApp/fast-contact links | User clicked a WhatsApp CTA | Recommended |
| `form_contatti_submit` | `frontend/src/pages/ContattiPagina.jsx` | Contact form submitted successfully to CRM API | Recommended |
| `form_preventivo_submit` | `frontend/src/components/QuoteForm.jsx` | Quote request form submitted successfully to CRM API | Recommended |

## Shared Parameters

Click events send:

- `event_category`: `lead`
- `method`: `phone`, `email`, or `whatsapp`
- `link_type`: neutral CTA type, for example `phone_cta`, `email_cta`, or `whatsapp_cta`
- `page_path`: current page path

Form events send:

- `event_category`: `lead`
- `form_id`: `contact-form` or `quote-form`
- `page_path`: current page path

## Where To See Results

- GA4 Realtime: fast smoke check after clicking a CTA or submitting a test form.
- GA4 Admin -> Data display -> Events: event list after GA4 has received data.
- GA4 Admin -> Data display -> Key events: mark lead events as conversions/key events.
- GA4 DebugView or Google Tag Assistant: detailed live validation while testing.

## Monitoring

Run the local monitor from the frontend folder:

```bash
yarn monitor:analytics
```

Optional target:

```bash
SITE_URL=https://www.solarisfilms.it yarn monitor:analytics
```

The monitor checks key public pages for the GA4 script and lead CTA markers. It does not verify GA4 server-side ingestion; use GA4 DebugView for that.

## Reporting Goal

Use GA4 to understand pages and sources that perform well in aggregate:

- traffic by page
- landing page quality
- source / medium performance
- lead events and key event rate by page

See `docs/analytics-reporting.md`.

## Next Event Candidates

- `form_contatti_error`: CRM submission failed.
- `form_preventivo_error`: quote submission failed.
- `form_contatti_start`: user begins filling contact form.
- `form_preventivo_start`: user begins filling quote form.
- `file_attachment_added`: user adds one or more files to a form.
- `chatbot_lead_start`: user opens or starts a lead-oriented chatbot flow.
