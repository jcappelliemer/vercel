# Solaris Films Analytics Reporting

Goal: understand which pages generate traffic and which pages produce useful lead actions, without tracking personal behavior.

## What To Measure

Use aggregate page metrics:

- Views by page path
- Users by page path
- Engagement rate by page path
- Lead events by page path
- Key events by page path
- Traffic source / medium by landing page

Use lead events only as business outcomes:

- `click_tel`
- `click_email`
- `click_whatsapp`
- `form_contatti_submit`
- `form_preventivo_submit`

Do not send personal data to GA4. No names, email addresses, phone numbers, form text, address details, or uploaded file names.

## Recommended GA4 Views

### Pages That Generate Traffic

GA4 path:

Reports -> Engagement -> Pages and screens

Useful dimensions:

- Page path and screen class
- Page title

Useful metrics:

- Views
- Users
- Average engagement time
- Key events

### Landing Pages That Work

GA4 path:

Reports -> Engagement -> Landing page

Useful metrics:

- Sessions
- Engaged sessions
- Engagement rate
- Key events
- Session key event rate

### Source / Medium Performance

GA4 path:

Reports -> Acquisition -> Traffic acquisition

Add or compare:

- Landing page
- Session source / medium
- Session campaign

This shows whether traffic from Google organic, Ads, direct, referral, or social produces lead actions.

## Key Events To Mark In GA4

Recommended:

- `form_preventivo_submit`
- `form_contatti_submit`
- `click_whatsapp`
- `click_tel`

Optional:

- `click_email`

## Reading Page Performance

A page is working well when it has at least one of these:

- High organic traffic and acceptable engagement
- High lead event count
- High key event rate
- Strong landing page performance from qualified sources
- Strategic value even with low traffic, for example technical or compliance content

Avoid ranking pages only by raw traffic. A technical product page with fewer visits can be better than a high-traffic article if it generates quote requests.

## Privacy Position

This setup measures page performance and lead intent at aggregate level. It does not record form contents, session replay, screen recordings, or individual browsing paths.

