# Epoch Press — SEO Implementation Plan
## From Keyword Map to Live Pages

| | |
|---|---|
| **Date** | March 2026 |
| **Site** | epochpress.com |
| **Reference** | EpochPress_Keyword_Map.md, BAAM Master Plan V3.9, SEO SOP Parts 1-2 |

---

## Phase Overview

| Phase | What | Pages | Timeline |
|-------|------|-------|----------|
| **Phase 0** | Validate keywords + audit existing pages + add seo to LPs | 0 new (4 LP audits) | Week 1 |
| **Phase 1** | Build P1 pages (core landings + top 4 services) | 6 new | Week 2–3 |
| **Phase 1.5** | Multi-language LP SEO (ES, YI, ZH-HANT seo objects + meta) | 3 LP optimizations | Week 3 |
| **Phase 2** | Build P2 pages (remaining services + resources) | 7 new | Week 4–5 |
| **Phase 3** | Near-location pages + language-specific service pages | 4+ new | Week 6+ |

---

## Phase 0 — Validate & Audit (Week 1)

### 0.1 Keyword Validation
- [ ] Run top 30 keywords through Google Keyword Planner → get actual search volumes
- [ ] Identify any keywords with 0 volume → remove or replace
- [ ] Confirm top 10 keywords by volume × intent match
- [ ] Complete 3 competitor audits (Evergreen Printing + 2 more NJ printers)

### 0.2 Existing Page SEO Audit
- [ ] Add `seo` objects to existing pages: homepage, about, contact, products, quote, faq, file-guidelines
- [ ] Fix any title tags > 60 chars
- [ ] Fix any meta descriptions > 155 chars
- [ ] Ensure homepage H1 contains "printing" + "Wayne" or "NJ"
- [ ] Verify NAP in footer matches GBP exactly
- [ ] Submit current sitemap to Google Search Console

### 0.3 Multi-Language LP Audit
- [ ] Add `seo` objects to all 4 landing pages: `/lp/en`, `/lp/es`, `/lp/yi`, `/lp/zh-hant`
- [ ] ES LP: title in Spanish, description in Spanish, `lang="es"` meta
- [ ] YI LP: title in Yiddish+English, description targeting English searchers + Yiddish community
- [ ] ZH-HANT LP: title in Chinese, description in Chinese, target 法拉盛/紐約 keywords
- [ ] Verify `hreflang` tags link all 4 LPs together for language alternates
- [ ] Add `og:locale` tags: `en_US`, `es_US`, `yi`, `zh_TW`

### 0.3 Architecture Decision
- [ ] Decide: adapt the TCM dynamic `[slug]` route pattern, or use static route folders?
  - **Recommendation:** If epochpress is a standalone Next.js app (not multi-site), static route folders are simpler. If it will become multi-site later, use the `[slug]` pattern.
- [ ] Set up `site_seo_pages` table if using dynamic routing
- [ ] Create layout components (or adapt from TCM system)

### 0.4 GBP Setup
- [ ] Verify GBP listing for Wayne, NJ location
- [ ] Create/verify GBP listing for Middletown, NY location (if applicable)
- [ ] Ensure NAP consistency across both listings

---

## Phase 1 — P1 Pages (Week 2–3)

### 1.1 Core Local Landing Pages (2 pages)

| Page | URL | Target Keyword |
|------|-----|----------------|
| Wayne NJ | `/printing-wayne-nj` | commercial printing Wayne NJ |
| Middletown NY | `/printing-middletown-ny` | printing company Middletown NY |

**Layout (per BAAM SOP `seo-local-landing`):**
1. Hero — H1 + city, subheading, intro, CTA "Request a Quote"
2. Services grid — links to each service page
3. Why Choose Us — equipment, turnaround, client logos
4. FAQ accordion (4–6 questions) — FAQPage schema
5. Location + map — NAP block, hours, directions

### 1.2 Top 4 Service Pages (4 pages)

| Page | URL | Target Keyword |
|------|-----|----------------|
| Newspaper Printing | `/newspaper-printing` | newspaper printing services |
| Magazine Printing | `/magazine-printing` | magazine printing services |
| Book Printing | `/book-printing` | book printing services |
| Offset Printing | `/offset-printing` | offset printing services |

**Layout (per BAAM SOP `seo-service`):**
1. Hero — H1 + service name, description, CTA
2. What is it — process explanation, paper types, binding options
3. Specifications — sizes, page counts, paper stock, finishes
4. Who it's for — target customers, use cases
5. FAQ accordion (4 questions) — FAQPage schema
6. CTA — "Request a Quote for [Service]"

### 1.3 Phase 1 Done-Gate
- [ ] All 6 pages return HTTP 200
- [ ] All title tags ≤ 60 chars, descriptions ≤ 155 chars
- [ ] All H1s unique and contain target keyword
- [ ] FAQ schema present on all pages
- [ ] Homepage links to both core landing pages
- [ ] Core landing pages link to all 4 service pages
- [ ] All pages have "Request a Quote" CTA
- [ ] Sitemap updated, GSC notified

---

## Phase 1.5 — Multi-Language LP SEO (Week 3)

### 1.5.1 Add SEO Objects to All Landing Pages

| LP | Route | Title Tag | Description |
|----|-------|-----------|-------------|
| EN | `/lp/en` | `Commercial Printing Wayne NJ | Epoch Press` | English — general market |
| ES | `/lp/es` | `Imprenta Comercial NJ | Epoch Press` | Spanish — NJ/NYC Hispanic market |
| YI | `/lp/yi` | `Yiddish Printing Services | Epoch Press — דרוקעריי` | Yiddish — Orthodox community |
| ZH | `/lp/zh-hant` | `商業印刷服務 | Epoch Press 紐約新澤西` | Chinese — Flushing/Chinatown |

### 1.5.2 hreflang Tags (Cross-Language Linking)
Add to all 4 LPs so Google knows they're language alternatives of the same page:
```html
<link rel="alternate" hreflang="en" href="https://epoch-press.com/lp/en" />
<link rel="alternate" hreflang="es" href="https://epoch-press.com/lp/es" />
<link rel="alternate" hreflang="yi" href="https://epoch-press.com/lp/yi" />
<link rel="alternate" hreflang="zh-Hant" href="https://epoch-press.com/lp/zh-hant" />
<link rel="alternate" hreflang="x-default" href="https://epoch-press.com/lp/en" />
```

### 1.5.3 Language-Specific GBP Considerations
- [ ] GBP primary listing (Wayne NJ) should mention multilingual service in description
- [ ] Consider GBP posts in Spanish and Chinese (1/month each)
- [ ] Add Yiddish community keywords to GBP Q&A section

### 1.5.4 Phase 1.5 Done-Gate
- [ ] All 4 LPs have populated `seo` objects (title ≤60, description ≤155)
- [ ] `hreflang` tags present on all 4 LPs
- [ ] `og:locale` set correctly per language
- [ ] All 4 LPs submitted to GSC for indexing
- [ ] No duplicate content flags between language versions

---

## Phase 2 — P2 Pages (Week 4–5)

### 2.1 Remaining Service Pages (4 pages)

| Page | URL |
|------|-----|
| Large Format Printing | `/large-format-printing` |
| Brochure & Flyer Printing | `/brochure-flyer-printing` |
| Direct Mail Printing | `/direct-mail-printing` |
| Menu Printing | `/menu-printing` |

### 2.2 Resource Pages (2 new + 1 existing)

| Page | URL | Notes |
|------|-----|-------|
| Printing Cost | `/printing-cost` | Direct answer format — price ranges above fold |
| Rush Printing | `/rush-printing` | 48-hour turnaround, pricing, process |
| File Guidelines | `/file-guidelines` | Already exists — add seo object + optimize |

### 2.3 Phase 2 Done-Gate
- [ ] All 6 new pages return HTTP 200
- [ ] All service pages linked from core landing pages
- [ ] Cost page has prices above fold
- [ ] Rush page mentions 48-hour turnaround in H1
- [ ] File guidelines page optimized with seo object

---

## Phase 3 — Near-Location + Ongoing (Week 6+)

### 3.1 Near-Location Pages (4 pages)

| Page | URL |
|------|-----|
| Passaic County NJ | `/printing-passaic-county-nj` |
| Orange County NY | `/printing-orange-county-ny` |
| Hudson Valley NY | `/printing-hudson-valley-ny` |
| Near NYC | `/printing-near-nyc` |

### 3.2 Language-Specific Service Pages (data-driven)

After EN service pages are live and GSC data shows which services each language community searches for, build the top 2–3 per language:

| Language | Likely Top Pages | Route Pattern |
|----------|-----------------|---------------|
| Spanish | Newspaper printing, Flyer/brochure | `/es/impresion-periodicos`, `/es/volantes-folletos` |
| Yiddish | Book printing, Newspaper printing | `/yi/book-printing`, `/yi/newspaper-printing` |
| Chinese | Newspaper printing, Menu printing | `/zh-hant/報紙印刷`, `/zh-hant/菜單印刷` |

> **Decision rule:** Only build a language-specific service page when GSC shows ≥50 impressions/month for that keyword in that language.

### 3.3 Ongoing SEO Work
- [ ] Monthly GSC review — identify rising queries per language
- [ ] Blog posts targeting long-tail keywords (2/month EN, 1/month per other language)
- [ ] GBP posts (weekly EN, 1/month ES + ZH)
- [ ] Review collection system (email/SMS after job completion)
- [ ] Citation building (Yelp, BBB, industry directories)
- [ ] Quarterly keyword map refresh — include multi-language performance data

---

## SEO Score Targets

| Date | Target Score | Key Milestone |
|------|-------------|---------------|
| Before (current) | ~40/102 | No SEO pages, no seo objects on LPs |
| After Phase 0 | ~48/102 | seo objects on all existing pages + 4 LPs |
| After Phase 1 | ~65/102 | Core landings + top 4 services live |
| After Phase 1.5 | ~70/102 | All 4 LPs SEO-optimized + hreflang |
| After Phase 2 | ~80/102 | All services + resources live |
| After Phase 3 | ~90/102 | Near-location + language service pages + GBP |
| 90-day target | ~94/102 | Full multi-language SEO system operational |

---

## Key Differences from TCM Implementation

| Aspect | What to adapt |
|--------|--------------|
| CTA | "Request a Quote" instead of "Book Appointment" |
| Schema | `LocalBusiness` + `Product` instead of `MedicalClinic` |
| No condition pages | Printing has no "condition" equivalent — service pages are the main SEO driver |
| Two locations | Need 2 core landing pages (Wayne NJ + Middletown NY) |
| B2B focus | Trust signals = client logos, equipment specs, case studies (not patient testimonials) |
| National service | Service pages are NOT city-specific — they target national keywords |
| Quote form | All CTAs point to `/quote` (not `/contact`) |
