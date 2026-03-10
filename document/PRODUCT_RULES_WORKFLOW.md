# Epochpress Product Rules Workflow

## Source Of Truth

Use the client workbook as the factual source for supported product rules:

- `document/Epoch-press website.xlsx`

Generated rule outputs live here:

- `data/product-rules.generated.json`
- `public/spec-sheets/*.xlsx`
- `public/spec-sheets/*.pdf`

Synced content/config targets:

- `content/epoch-press/en/pages/*.json`
- `data/pages/*.json`
- `data/quote-config.json`
- `content/epoch-press/en/pages/quote-config.json`

## Field Ownership

- Product marketing copy stays in per-product page JSON:
  - `name`
  - `tagline`
  - `description`
  - `hero`
  - `faq`
  - `process`
  - `cta`

- Workbook-backed factual sections are synced from the generator:
  - `specs`
  - `detailSheet`
  - `rulesNotes`
  - quote field options for supported workbook-backed products

## Supported Workbook-Backed Slugs

- `magazine-printing`
- `book-printing`
- `calendar-printing`
- `marketing-print`
- `menu-printing`
- `business-cards`

Notes:

- `book-printing` combines workbook sheets `Paper Book`, `Hard Cover Book`, `NoteBook`, and `Album`.
- `calendar-printing` combines workbook sheets `Desk Cal` and `Wal Cal`.
- `marketing-print` combines workbook sheets `Flyer`, `Brochures`, `Poster`, and `Post Card`.
- `business-cards` is only partially workbook-backed because the workbook sheet is incomplete for some stock/quantity cells.
- `newspaper-printing` and `large-format` still rely on existing hand-maintained content/config until workbook-backed rules are available for them.

## Update Procedure

1. Update the client workbook:
   - `document/Epoch-press website.xlsx`

2. Run the sync command:

```bash
npm run product-rules:sync
```

3. Review generated outputs:
   - `data/product-rules.generated.json`
   - `public/spec-sheets/*.xlsx`
   - `public/spec-sheets/*.pdf`

4. Spot-check synced content:
   - product detail pages under `content/epoch-press/en/pages/`
   - quote fields in `data/quote-config.json`

5. QA in browser:
   - `/products/magazine-printing`
   - `/products/book-printing`
- `/products/calendar-printing`
   - `/products/marketing-print`
   - `/products/menu-printing`
   - `/products/business-cards`
   - `/quote`

## What The Sync Script Does

Script:

- `scripts/sync-product-rules-from-workbook.mjs`

Responsibilities:

- reads workbook sheets
- normalizes workbook-backed rules into `data/product-rules.generated.json`
- updates supported product page JSON `specs` and `detailSheet`
- updates quote field options for supported products
- generates customer-facing Excel spec sheets into `public/spec-sheets/`
- also generates PDF companions into `public/spec-sheets/`

## Cautions

- Do not manually edit `data/product-rules.generated.json`; regenerate it.
- If workbook structure changes significantly, update `scripts/sync-product-rules-from-workbook.mjs`.
- If a workbook tab is incomplete, preserve existing marketing copy and avoid inventing unsupported operational claims.
