# Epoch Press — SEO Implementation Plan
## From Keyword Map to Live Pages

| | |
|---|---|
| **Date** | March 2026 |
| **Site** | epochpress.com |
| **Reference** | EpochPress_Keyword_Map.md, BAAM Master Plan V3.9, SEO SOP Parts 1-2 |

---

## Phase Overview

| Phase | What | Pages / Actions | Timeline |
|-------|------|----------------|----------|
| **Phase 0** | Validate keywords + audit existing pages + add seo to LPs | 0 new (17 seo.json entries + 4 LPs) | Week 1 |
| **Phase 1** | Build state/regional landings + offset page + optimize 8 product pages | 4 new + 8 optimized | Week 2–3 |
| **Phase 1.5** | Multi-language LP SEO (ES, YI, ZH-HANT seo objects + hreflang) | 3 LP optimizations | Week 3 |
| **Phase 2** | Build P2 pages (remaining services + resources) | 7 new pages | Week 4–5 |
| **Phase 3** | Near-location pages + language-specific service pages | 4+ new pages | Week 6+ |
| **Phase 4** | Backlink building (directories, client asks, industry associations) | 15–20 links target | Week 4 → ongoing |
| **Phase 5** | Content marketing / blog SEO (2 EN posts/month + multi-language) | 6+ blog posts | Week 5 → ongoing |
| **Phase 6** | Review & reputation system (email/SMS automation, QR cards) | 25+ reviews target | Week 4 setup → ongoing |
| **Phase 7** | Technical SEO (Core Web Vitals, crawl errors, speed) | Audit + fixes | Week 2, then quarterly |
| **Phase 8** | AI Search / AEO (content structure, schema expansion, monitoring) | All money pages | Week 3 → monthly |

---

## Architecture Findings (Pre-Implementation Review)

> **Reviewed March 2026.** These findings affect the implementation approach.

### Key Findings

| Finding | Impact |
|---------|--------|
| **8 product pages already exist** at `/products/[slug]` (newspaper, magazine, book, calendar, marketing, menu, business-cards, large-format) | Do NOT create duplicate service pages — optimize existing product pages instead |
| **Standalone Next.js app** — not multi-site like TCM | Use static route folders, not dynamic `[slug]` route |
| **Content is file-based** (`/data/pages/` and `/content/epoch-press/en/`) with DB fallback | Create content JSON files + add to seo.json |
| **No seo objects** on any product page or landing page | Phase 0 priority |
| **seo.json** only covers home, about, contact, products, portfolio | Need to add entries for all product pages + LPs + new pages |
| **4 landing pages** exist at `/lp/es`, `/lp/yi`, `/lp/zh-hant` (no seo objects) | Phase 0 priority |
| **Two locations**: Wayne NJ (primary) + Middletown NY | Need 2 core landing pages |

### Revised Page Strategy

| Page Type | Approach | Route |
|-----------|----------|-------|
| Core local landing (Wayne) | **Create new** | `/printing-wayne-nj` |
| Core local landing (Middletown) | **Create new** | `/printing-middletown-ny` |
| Service pages (newspaper, magazine, etc.) | **Optimize existing** `/products/[slug]` | Already at `/products/*` |
| Offset printing | **Create new** (not in products) | `/offset-printing` |
| Resource: cost | **Create new** | `/printing-cost` |
| Resource: rush printing | **Create new** | `/rush-printing` |
| Resource: file guidelines | **Optimize existing** | `/file-guidelines` (exists) |
| Near-location pages | **Create new** (Phase 3) | `/printing-passaic-county-nj` etc. |

### What This Means

- **Fewer new pages needed** than originally planned — product pages cover most services
- **Focus shifts** to: 2 core landing pages + 2-3 resource pages + SEO optimization of 8 existing product pages
- **Architecture**: static routes + file-based content (simple, matches existing pattern)

---

## Phase 0 — Validate & Audit (Week 1)

### 0.1 Keyword Validation (Human — before pipeline)
- [ ] Run top 30 keywords through Google Keyword Planner → get actual search volumes
- [ ] Identify any keywords with 0 volume → remove or replace
- [ ] Confirm top 10 keywords by volume × intent match
- [ ] Complete 3 competitor audits (Evergreen Printing + 2 more NJ printers)

### 0.2 Existing Page SEO Audit
Add SEO entries to `seo.json` for all pages that are missing:

**Pages needing seo.json entries:**
- [ ] homepage (exists — verify title ≤60, desc ≤155)
- [ ] about (exists — verify)
- [ ] contact (exists — verify)
- [ ] products (exists — verify)
- [ ] quote (exists — verify)
- [ ] portfolio (exists — verify)
- [ ] faq (missing — add)
- [ ] file-guidelines (missing — add)
- [ ] blog (missing — add)
- [ ] case-studies (missing — add)

**Product pages needing seo.json entries (8 pages):**
- [ ] newspaper-printing: "Newspaper Printing Services | Epoch Press"
- [ ] magazine-printing: "Magazine Printing Services | Epoch Press"
- [ ] book-printing: "Book Printing Services | Epoch Press"
- [ ] calendar-printing: "Calendar Printing | Epoch Press"
- [ ] marketing-print: "Marketing Print Services | Epoch Press"
- [ ] menu-printing: "Menu Printing for Restaurants | Epoch Press"
- [ ] business-cards: "Business Card Printing | Epoch Press"
- [ ] large-format: "Large Format Printing | Epoch Press"

### 0.3 Multi-Language LP SEO
- [ ] Add `seo` objects to all 4 landing page JSON files
- [ ] EN LP: "Commercial Printing Wayne NJ | Epoch Press"
- [ ] ES LP: "Imprenta Comercial NJ | Epoch Press — Impresión Profesional"
- [ ] YI LP: "Yiddish Printing Services | Epoch Press — דרוקעריי"
- [ ] ZH-HANT LP: "商業印刷服務 | Epoch Press 紐約新澤西專業印刷"
- [ ] Add `hreflang` tags linking all 4 LPs
- [ ] Add `og:locale` tags per language

### 0.4 GBP Setup (Human)
- [ ] Verify GBP listing for Wayne, NJ location
- [ ] Create/verify GBP listing for Middletown, NY location (if applicable)
- [ ] Ensure NAP consistency across both listings

---

## Phase 1 — P1 Pages (Week 2–3)

### 1.1 State/Regional Landing Pages (3 NEW pages)

| Page | URL | Target Keyword | H1 |
|------|-----|----------------|-----|
| New Jersey | `/commercial-printing-new-jersey` | commercial printing company NJ | Commercial Printing Company in New Jersey |
| New York | `/commercial-printing-new-york` | commercial printing New York | Commercial Printing Services in New York |
| Tri-State | `/commercial-printing-tri-state` | printing company NJ NY tri-state | Commercial Printing for the Tri-State Area |

**Layout for state/regional landing pages:**
1. Hero — H1 + state/region, subheading, 2-sentence intro, CTA "Request a Quote"
2. What We Print — services grid linking to `/products/*` pages
3. Industries We Serve — publishers, agencies, brands, restaurants, schools, nonprofits
4. Our Facilities — Wayne NJ (primary) + Middletown NY, equipment highlights, capacity
5. Why Choose Epoch Press — turnaround, quality, experience, service area coverage
6. FAQ accordion (4–6 questions) — FAQPage schema
7. CTA — "Get a Custom Quote" → /quote

**Key content differences per page:**
- **NJ page:** Emphasize Wayne facility, serve all of NJ, proximity to NYC
- **NY page:** Emphasize Middletown facility, serve NYC metro + Hudson Valley + upstate
- **Tri-State page:** Both facilities, full regional coverage, logistics advantage

### 1.2 Offset Printing Page (1 NEW page)

| Page | URL | Target Keyword |
|------|-----|----------------|
| Offset Printing | `/offset-printing` | offset printing services NJ NY |

> This service doesn't have an existing `/products/*` page. Follows the product page layout pattern.

### 1.3 Optimize Existing Product Pages (8 pages — SEO only, no new routes)

Product pages already exist at `/products/[slug]`. Optimization means:
- [ ] Verify seo.json entries are applied as `<title>` and `<meta description>`
- [ ] Ensure each product page H1 contains the target keyword
- [ ] Add FAQ schema (JSON-LD) to product pages that have FAQ sections
- [ ] Add internal links from product pages → state landing pages
- [ ] Add "Request a Quote" CTA if missing

### 1.4 Phase 1 Done-Gate
- [ ] All 4 new pages return HTTP 200 (3 landings + 1 offset)
- [ ] All title tags ≤ 60 chars, descriptions ≤ 155 chars
- [ ] All H1s unique and contain target keyword
- [ ] FAQ schema present on all landing pages
- [ ] Homepage links to state landing pages
- [ ] State landing pages link to all product/service pages
- [ ] All pages have "Request a Quote" CTA → /quote
- [ ] Product pages have internal links to state landing pages
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

## Phase 4 — Backlink Building (Ongoing from Week 4)

> **Why this matters:** Backlinks are Google's #1 ranking factor. Without external links, even perfectly optimized pages won't reach page 1. One quality backlink from an industry site is worth more than 10 on-page optimizations.

### 4.1 Low-Hanging Fruit (Week 4–6)

| Action | Target | Expected Links | Effort |
|--------|--------|---------------|--------|
| **Business directories** | Yelp, BBB, Yellow Pages, Manta | 4–5 links | Low — submit and verify |
| **Industry directories** | PrintingIndustry.com, PrintAccess, PrintingNews | 2–3 links | Low — submit listing |
| **Local chambers** | Wayne Area Chamber, Middletown Chamber of Commerce | 2 links | Low — membership + listing |
| **Client websites** | Ask top 10 clients to add "Printed by Epoch Press" with link | 3–5 links | Low — email request |
| **Supplier directories** | Paper/ink suppliers often list their print partners | 1–2 links | Low — contact suppliers |

### 4.2 Medium-Effort Link Building (Month 2–3)

| Action | Target | Expected Links | Effort |
|--------|--------|---------------|--------|
| **Press releases** | New equipment, milestones, community involvement | 2–3 links per release | Medium — write + distribute |
| **Guest posts** | Publishing industry blogs, local business blogs | 1–2 links/month | Medium — pitch + write |
| **Case studies on client sites** | Co-publish case study: "How [Client] Improved Their Publication with Epoch Press" | 1 link per case study | Medium — collaborate |
| **Local news** | Sponsor local event, get coverage in Wayne/Middletown newspapers | 1–2 links | Medium — outreach |
| **Industry associations** | Printing Industries Alliance, PINE (Printing Industries of New England) | 1–2 links | Medium — membership |

### 4.3 Link Building Targets

| Month | New Links Target | Cumulative | Focus |
|-------|-----------------|-----------|-------|
| Month 1 | 8–10 | 8–10 | Directories + chambers + client asks |
| Month 2 | 5–7 | 13–17 | Industry directories + first guest post |
| Month 3 | 4–6 | 17–23 | Case studies + press release + associations |
| Month 4+ | 3–5/month | 20–28+ | Ongoing guest posts + client links |

> **Rule:** Quality over quantity. One link from PrintingIndustry.com is worth 50 links from random directories. Focus on relevance (printing industry + local NJ/NY sites).

---

## Phase 5 — Content Marketing / Blog SEO (Ongoing from Week 5)

> **Why this matters:** Blog posts target long-tail keywords that service pages can't. They build topical authority, create internal link opportunities, and drive organic traffic that converts over time.

### 5.1 Content Calendar — First 3 Months

| Month | Post 1 | Post 2 | Target Keyword |
|-------|--------|--------|---------------|
| **Month 1** | "Offset vs Digital Printing: Which Is Right for Your Project?" | "How to Prepare Print-Ready Files (Complete Guide)" | `offset vs digital printing`, `print ready files` |
| **Month 2** | "Newspaper Printing Costs: What Publishers Need to Know in 2026" | "5 Questions to Ask Before Choosing a Commercial Printer" | `newspaper printing cost`, `how to choose commercial printer` |
| **Month 3** | "Magazine Binding Options: Saddle Stitch vs Perfect Bound" | "Rush Printing: How Fast Turnaround Actually Works" | `saddle stitch vs perfect bound`, `rush printing service` |

### 5.2 Blog SEO Rules

- Every post targets 1 primary long-tail keyword (check volume first)
- Every post links to 1–2 service pages (internal link juice)
- Every post has a CTA: "Need [service]? Request a Quote →"
- Word count: 800–1,500 words (not fluff — real value)
- Include images with descriptive alt text
- Add FAQ schema to posts with Q&A content

### 5.3 Multi-Language Blog Content

| Language | Frequency | Topics |
|----------|-----------|--------|
| English | 2 posts/month | Full range — industry guides, cost breakdowns, process explanations |
| Spanish | 1 post/month | Focus on: "Cómo preparar archivos para impresión", "Costos de impresión comercial" |
| Chinese | 1 post/quarter | Focus on: community newspaper printing, Chinese-language typesetting tips |
| Yiddish | 1 post/quarter | Focus on: community event printing, book printing for schools |

---

## Phase 6 — Review & Reputation System (Week 4 setup, ongoing)

> **Why this matters:** For local pack (map results), Google weighs review count, average rating, and recency heavily. A business with 5 reviews loses to one with 50 reviews even with better on-page SEO.

### 6.1 Review Collection System Setup

| Step | Action | Timeline |
|------|--------|----------|
| 1 | Create Google review link shortcut (search "Google review link generator") | Day 1 |
| 2 | Draft email template: "Thank you for choosing Epoch Press — would you share your experience?" | Day 1 |
| 3 | Draft SMS template (shorter version) | Day 1 |
| 4 | Set up automated email trigger: send review request 3 days after job delivery | Week 1 |
| 5 | Add review link to email signatures, invoices, and delivery confirmations | Week 1 |
| 6 | Print QR code card with Google review link — include in delivered packages | Week 2 |

### 6.2 Review Targets

| Timeline | Target Reviews | Expected Rating |
|----------|---------------|----------------|
| Current | ~5 reviews | Unknown |
| Month 1 | 10+ reviews | 4.8+ |
| Month 3 | 25+ reviews | 4.8+ |
| Month 6 | 50+ reviews | 4.7+ |
| Month 12 | 80+ reviews | 4.7+ |

### 6.3 Review Response Protocol

- **All reviews** get a response within 48 hours
- **Positive reviews:** Thank by name, mention the specific service ("Glad the magazine printing turned out great!")
- **Negative reviews:** Acknowledge, apologize, offer to resolve offline ("We'd love to make this right — please call us at 973.694.3600")
- **Never:** Argue, get defensive, or offer incentives for review changes

### 6.4 Multi-Platform Reviews

| Platform | Priority | Action |
|----------|----------|--------|
| Google Business Profile | **#1** | Primary review target — affects local pack directly |
| Yelp | #2 | Claim listing, respond to reviews, don't solicit (Yelp penalizes) |
| BBB | #3 | Get accredited, encourage BBB reviews |
| Industry-specific (PrintingIndustry.com) | #4 | If available, get listed + reviewed |
| Facebook | #5 | Enable reviews on business page |

---

## Phase 7 — Technical SEO Fixes (Week 2, then quarterly)

### 7.1 Immediate Fixes

- [ ] **Core Web Vitals audit** — run PageSpeed Insights on all key pages
- [ ] **Fix LCP (Largest Contentful Paint)** — optimize hero images, use Next.js `<Image>` with `priority`
- [ ] **Fix CLS (Cumulative Layout Shift)** — set explicit width/height on images, avoid layout-shifting ads
- [ ] **Mobile responsiveness** — test all pages at 375px width
- [ ] **Crawl errors** — check GSC Coverage report, fix any 404s
- [ ] **robots.txt** — ensure SEO pages are not blocked
- [ ] **Sitemap** — verify all pages are included, submit to GSC
- [ ] **HTTPS** — confirm all pages redirect HTTP → HTTPS
- [ ] **Page speed** — target <3s load time on mobile for all money pages

### 7.2 Quarterly Technical Audit

- [ ] Re-run PageSpeed Insights on top 10 pages
- [ ] Check GSC for new crawl errors
- [ ] Verify sitemap is current
- [ ] Check for broken internal links
- [ ] Review Core Web Vitals trends
- [ ] Test mobile rendering on new pages

---

## Phase 8 — AI Search Optimization / AEO (Week 3, then ongoing)

> **Why this matters:** AI-powered search (ChatGPT Search, Google AI Overviews, Perplexity) is rapidly taking search share. By 2026, 40%+ of Google queries trigger an AI Overview. Sites that structure content for AI citation get referenced in answers — sites that don't become invisible. AEO is not separate from SEO — it's the next layer on top of it.

### 8.1 The AI Search Landscape

| AI Search Engine | How It Cites Sources | What It Prefers |
|-----------------|---------------------|-----------------|
| **Google AI Overviews** | Pulls from top-ranked pages, shows source links below summary | Structured data, direct answers, FAQ schema, E-E-A-T |
| **ChatGPT Search** | Cites sources inline with clickable links | Clear H2 headings, direct Q&A format, tables, recent content |
| **Perplexity** | Full citation model with numbered references | Factual density, structured data, authority signals |
| **Bing Copilot** | Cites Bing-indexed sources | Schema markup, Bing Webmaster Tools submission |

### 8.2 Content Structure Rules for AI Citation

**Every money page (service, landing, resource) must follow these rules:**

| Rule | What to do | Why AI picks it up |
|------|-----------|-------------------|
| **Direct answer in first paragraph** | Answer the page's core question in the first 2 sentences | AI extracts the first clear answer it finds |
| **"What is [X]?" section** | Add an H2 with a definitional paragraph | AI loves citing definitions — highest citation rate |
| **FAQ with schema** | Use FAQPage JSON-LD — already doing this | AI reads schema before body content |
| **Short paragraphs** | Max 3-4 sentences per paragraph | AI truncates long blocks — short = higher citation chance |
| **Tables for comparisons** | Use markdown/HTML tables for pricing, specs, comparisons | AI presents tables directly in answers |
| **Bullet lists for steps/features** | Use ordered lists for processes, unordered for features | AI prefers scannable formats over prose |
| **H2 = question format** | "How Much Does Newspaper Printing Cost?" not "Pricing" | Matches how users ask AI questions |
| **Stats and numbers** | Include specific numbers: "48-hour turnaround", "$X per 1,000 copies" | AI prefers concrete facts over vague claims |

### 8.3 Schema Markup Expansion for AI

Add these schema types beyond what traditional SEO requires:

| Schema Type | Where to Add | AI Benefit |
|-------------|-------------|-----------|
| `FAQPage` | All service + resource pages | Already implemented — AI reads FAQ schema directly |
| `HowTo` | Process pages (file prep, how printing works) | Cited in "how to" AI answers |
| `Product` | Each service page (treat services as products) | Cited in comparison/shopping queries |
| `Organization` | Site-wide | Establishes entity identity for AI knowledge |
| `LocalBusiness` | Core landing pages | Local AI answers cite this |
| `Article` | Blog posts | Blog content gets cited in informational queries |
| `Review` / `AggregateRating` | Pages with testimonials | AI shows ratings in answers |

### 8.4 AI-Specific Monitoring

| Tool | What to Track | Frequency |
|------|--------------|-----------|
| **Google Search Console** | "AI Overviews" appearance (GSC now reports this) | Weekly |
| **Perplexity** | Search your brand + key services, check if cited | Monthly |
| **ChatGPT** | Ask ChatGPT your target questions, check if your site appears | Monthly |
| **Bing Webmaster Tools** | Submit sitemap, monitor Copilot citations | Monthly |

**Monthly AEO check — ask these questions in ChatGPT + Perplexity:**
1. "Best commercial printing company in Wayne NJ"
2. "Newspaper printing services near New York"
3. "How much does magazine printing cost?"
4. "Offset vs digital printing for newspapers"

Track: Are we cited? If not, what source IS cited and what do they do differently?

### 8.5 AI-Optimized Content Templates

**For each service page, add this block structure:**

```
H2: What Is [Service Name]?
→ 2-3 sentence definition. Factual, authoritative, no fluff.

H2: How Much Does [Service] Cost?
→ Direct price range in first sentence. Table breakdown below.

H2: How Does [Service] Work?
→ Numbered steps (1. Submit files → 2. Proof review → 3. Print → 4. Delivery)

H2: [Service] vs [Alternative]
→ Comparison table. AI loves presenting these.

H2: Frequently Asked Questions
→ FAQ with schema. 4-6 questions.
```

This structure maps exactly to how AI search engines parse and cite content.

### 8.6 Epoch Press AEO Action Items

| Week | Action | Pages Affected |
|------|--------|---------------|
| Week 3 | Add "What is [X]?" H2 section to all service pages | 8 service pages |
| Week 3 | Add `Product` schema to all service pages | 8 service pages |
| Week 3 | Add `HowTo` schema to file guidelines page | 1 page |
| Week 4 | Ensure first paragraph of every page directly answers the core question | All money pages |
| Week 5 | Convert long prose paragraphs to short paragraphs + bullet lists | All pages |
| Week 5 | Add comparison tables where applicable (offset vs digital, binding options) | 3-4 pages |
| Week 6 | First AEO monitoring check — search brand + services in ChatGPT/Perplexity | — |
| Monthly | Repeat AEO monitoring, adjust content based on what gets cited | — |

### 8.7 AEO vs Traditional SEO — What Changes

| Aspect | Traditional SEO | AEO (AI Search) |
|--------|----------------|-----------------|
| **Goal** | Rank on page 1 of Google | Get **cited** in AI-generated answers |
| **Content format** | Long-form, keyword-dense | Short paragraphs, tables, direct answers |
| **Schema** | Title, meta, FAQPage | FAQPage + HowTo + Product + Article + Review |
| **Keyword targeting** | Exact match + variations | **Question-format** queries ("how much", "what is", "best for") |
| **Freshness** | Important but not critical | **Very important** — AI prefers recent content |
| **Authority signals** | Backlinks, domain age | E-E-A-T: author expertise, credentials, real data, citations |
| **Monitoring** | GSC, rank tracking | GSC + manually check AI answers + citation tracking |
| **Update cycle** | Quarterly refresh | **Monthly content freshness** — update stats, prices, dates |

> **Key insight:** AEO doesn't replace SEO — it layers on top. A page that ranks well in Google AND is structured for AI citation captures both channels. The work we're already doing (FAQ schema, direct answers, structured headings) is 70% of AEO. The remaining 30% is schema expansion, question-format H2s, and AI monitoring.

---

## SEO Score Targets

| Date | Target Score | Key Milestone |
|------|-------------|---------------|
| Before (current) | ~35/102 | No SEO pages, no seo objects on LPs, no review system |
| After Phase 0 | ~45/102 | seo objects on all existing pages + 4 LPs |
| After Phase 1 | ~58/102 | Core landings + top 4 services live |
| After Phase 1.5 | ~62/102 | All 4 LPs SEO-optimized + hreflang |
| After Phase 2 | ~70/102 | All services + resources live |
| After Phase 3 | ~76/102 | Near-location + language service pages |
| After Phase 4 (backlinks) | ~82/102 | 15+ quality backlinks acquired |
| After Phase 5 (content) | ~86/102 | 6+ blog posts live, internal link network |
| After Phase 6 (reviews) | ~92/102 | 25+ Google reviews, GBP optimized |
| After Phase 7 (technical) | ~96/112 | Core Web Vitals green, no crawl errors |
| After Phase 8 (AEO) | ~106/112 | AI citation structure + monitoring active |

### What Drives the Score (Approximate Breakdown)

| Category | Points | What Earns Them |
|----------|--------|----------------|
| Page architecture (service + condition + resource pages) | 22 | All SEO pages built + registered in DB |
| On-page SEO (titles, meta, H1, schema, content) | 20 | Proper seo objects + word count + FAQ schema |
| Technical SEO (speed, mobile, crawlability) | 20 | Core Web Vitals green + no errors |
| Google Business Profile | 15 | Complete listing + services + photos + posts |
| Reviews & reputation | 10 | 25+ reviews, 4.7+ rating, response protocol |
| Citations & off-page (backlinks) | 10 | 15+ quality links from directories + industry |
| Search Console & analytics | 5 | Verified, monitored monthly, keyword map refreshed |
| **AI Search / AEO** | **10** | **Direct-answer structure, expanded schema, AI monitoring** |
| **Total** | **112** | |

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

---

## Full Timeline Summary

```
Week 1    Phase 0 — Keyword validation, existing page audit, LP seo objects
Week 2-3  Phase 1 — Build 2 core landings + 4 service pages
Week 3    Phase 1.5 — Multi-language LP SEO + hreflang
Week 4    Phase 6 setup — Review collection system live
Week 4    Phase 4 start — Directory submissions, client link asks
Week 4-5  Phase 2 — Build 4 more service pages + 2 resource pages
Week 5    Phase 5 start — First 2 blog posts published
Week 6+   Phase 3 — Near-location pages + language service pages
Ongoing   Phase 4 — Link building (3-5 links/month)
Ongoing   Phase 5 — Blog content (2 EN + 1 ES/month)
Ongoing   Phase 6 — Review collection (target 25 by month 3)
Quarterly Phase 7 — Technical SEO audit
```

### 90-Day Expected Outcomes

| Metric | Before | After 90 Days |
|--------|--------|--------------|
| SEO pages | 0 | 16+ (EN + multi-language) |
| Blog posts | 0 SEO-targeted | 6+ |
| Google reviews | ~5 | 25+ |
| Backlinks | Unknown | 15–20 quality links |
| GSC impressions | Unknown | Track from Week 1 |
| Organic traffic | Baseline | Expect 30-50% increase |
| Quote requests from organic | Baseline | Track from Week 1 |
