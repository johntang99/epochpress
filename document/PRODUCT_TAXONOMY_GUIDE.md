# Epochpress Product Taxonomy Guide

## Public Taxonomy Decision

The website should stay curated and customer-facing, not mirror the workbook one sheet at a time.

Keep these as the public product families:

- `newspaper-printing`
- `magazine-printing`
- `book-printing`
- `calendar-printing`
- `marketing-print`
- `menu-printing`
- `business-cards`
- `large-format`

## Workbook To Public Slug Mapping

| Workbook sheet | Public website slug | Public strategy |
|---|---|---|
| `Magazine` | `magazine-printing` | standalone |
| `Catalogue` | `magazine-printing` | internal subtype / shared family |
| `Paper Book` | `book-printing` | grouped |
| `Hard Cover Book` | `book-printing` | grouped |
| `NoteBook` | `book-printing` | grouped |
| `Album` | `book-printing` | grouped |
| `Desk Cal` | `calendar-printing` | grouped |
| `Wal Cal` | `calendar-printing` | grouped |
| `Flyer` | `marketing-print` | grouped |
| `Brochures` | `marketing-print` | grouped |
| `Poster` | `marketing-print` | grouped |
| `Post Card` | `marketing-print` | grouped |
| `Menu` | `menu-printing` | standalone |
| `Business Card` | `business-cards` | standalone |
| `Mailing` | quote/add-on logic only | internal |
| `Bookmark` | not public yet | internal |

## Ownership Rules

### Public product pages own

- positioning
- hero content
- marketing description
- FAQ
- production-process narrative
- CTA language

### Workbook-backed rule layer owns

- factual spec tabs
- supported stock lists
- trim/flat size options
- page-count ranges
- finish/color option lists
- product subtype mapping
- spec-sheet downloads

### Quote config owns

- the actual customer input fields
- field order
- subtype-first intake for grouped products
- user-facing labels and placeholders

## Grouped Product Policy

### Keep grouped

`marketing-print` should remain grouped because:

- customers often compare flyers, brochures, posters, and postcards together
- these share many paper/finish/turnaround rules
- the navigation stays cleaner and easier to browse

`book-printing` should also stay grouped because:

- paperback vs hardcover is a format decision inside one buying journey
- both use overlapping trim/page/paper logic
- separate top-level pages would be too thin right now

`calendar-printing` should be grouped because:

- desk and wall calendars share a similar seasonal/planning buyer intent
- both rely on overlapping cover, finishing, and interior page rules
- one public family keeps the catalog broader without overloading the navigation

## Criteria For Future Split

A workbook subtype should become its own public product page only when most of these are true:

1. It has a distinct customer buying intent, not just a production variation.
2. It needs different SEO targeting or sales messaging.
3. It requires different quote questions than the grouped family.
4. It has enough content depth to support a standalone page.
5. The client wants it marketed separately, not only priced separately.

## Examples

### Good candidates for future split

- `catalog-printing`
  - if client wants Catalogues marketed separately from Magazines
- `postcard-printing`
  - if postcard/direct-mail demand becomes a major category
- `hardcover-book-printing`
  - if premium hardcover becomes a dedicated sales path

### Keep internal only for now

- `Mailing`
- `Bookmark`

These are either incomplete in the workbook, operationally specialized, or not yet strong enough as public navigation categories.
