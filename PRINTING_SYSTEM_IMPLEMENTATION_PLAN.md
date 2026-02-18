# Epoch Press — Implementation Plan (BAAM System C)

> **Business:** Epoch Press — Full-service commercial printing
> **Market:** US nationwide, primarily Northeast coast
> **Positioning:** Premium quality, competitive pricing
> **Conversion:** Mix of Quote (RFQ) + Direct call depending on product
> **Languages:** English primary, Chinese secondary/optional
> **BAAM System:** System C (Printing)
> **Date:** February 2026

---

## Strategic Approach

**Frontend-first, then wire admin.** Build the complete printing frontend with mock/static JSON data. Once pixel-perfect and content structure proven, map to existing admin system.

The admin backend already handles: multi-site management, content editing (Form + JSON), site settings, media, variants, domain aliases, audit logs, and content revisions. No backend duplication needed.

### System Classification

| System | Industry | Status | Frontend Focus |
|--------|----------|--------|----------------|
| System A | Chinese Medicine (TCM) | Live — 3+ sites | Service + Practitioner |
| **System C** | **Printing (Epoch Press)** | **Building now** | **Product catalog + Quote** |
| System B | Restaurant | Planned | Menu + Ordering |
| System D | Home/Office Decor | Planned | Gallery + E-commerce |

---

## Product Catalog Architecture

### Primary Product Categories

| Category | Products | Key Specs |
|----------|----------|-----------|
| Newspapers | Broadsheet, tabloid, community papers, inserts | Run size, paper stock, color/BW, frequency, turnaround |
| Magazines | High-end (perfect bind, UV coat), standard (saddle stitch) | Page count, paper weight, binding, finish, print run |
| Books | Traditional offset, digital, print-on-demand | Format, page count, binding type, cover finish, POD min qty |
| Marketing Print | Flyers, brochures, postcards, posters, banners | Size, paper stock, fold type, quantity tiers, turnaround |
| Menus | Dine-in, takeout, trifold, laminated, oversized | Size, lamination, fold, paper type, quantity |
| Business Cards | Standard, premium, foil, embossed, spot UV | Stock weight, finish, special effects, quantity, turnaround |
| Large Format | Banners, signage, trade show displays, wall graphics | Material, size, mounting, indoor/outdoor, durability |

### Conversion Path Per Category

| Product Type | Primary CTA | Reason |
|-------------|-------------|--------|
| Newspapers & Magazines | Call / Consultation form | Complex specs, recurring contracts, custom pricing |
| Books (offset) | Quote request form (RFQ) | Variable specs, needs review before pricing |
| Books (POD) | Self-serve calculator + Order | Standardized specs, predictable pricing |
| Flyers / Postcards / Cards | Quick quote + Call option | Simple specs, fast turnaround expected |
| Menus | Quote form with upload | Restaurant-specific needs, often custom |
| Large Format | Call / Consultation | Site survey may be needed, high-value |

---

## Page Map & Information Architecture

### Tier 1 — Core Pages (Must Have for Launch)

1. **Home** — Premium hero, product category grid, trust indicators, featured portfolio, CTA
2. **Products** (hub page) — Visual category grid with descriptions
3. **Product Detail Pages** (one per category, 7 total) — Specs, gallery, pricing guidance, CTA
4. **About / Facility** — Equipment list, certifications, team, history, facility photos
5. **Portfolio / Case Studies** — Filterable gallery of past work
6. **Request a Quote (RFQ)** — Multi-step form with product selection and file upload
7. **File Guidelines** — Upload specs, bleed, DPI, color profiles, templates
8. **Contact** — Phone, email, address, map, hours, form

### Tier 2 — Growth Pages (Post-Launch)

1. Blog / Resources — Print tips, industry guides (SEO content)
2. Turnaround & Shipping — Timelines, rush options, shipping zones
3. FAQ — General and per-product sections
4. Sustainability — Eco-friendly options, certifications

### Tier 3 — Programmatic SEO Pages (Automated)

- **Service × Location:** /newspaper-printing/new-york, /book-printing/new-jersey
- **Comparison:** /offset-vs-digital-printing, /saddle-stitch-vs-perfect-binding
- **Use case:** /restaurant-menu-printing, /church-bulletin-printing

Target: ~150-175 programmatic pages across 7 products × 15-20 locations + comparisons + use cases.

---

## Component System

| Component | Description | Variants | Reuse? |
|-----------|-------------|----------|--------|
| PrintHero | Premium hero with headline, CTA, press imagery/video | centered, split-image, video-bg, carousel | Adapts Hero |
| ProductCategoryGrid | Visual grid of product categories | grid-3, grid-4, masonry | Adapts Services |
| ProductSpecBlock | Product specifications: paper, size, finish, binding, quantities | tabs, accordion, side-by-side, table | NEW |
| PriceTierTable | Quantity-based pricing tiers with custom quote note | simple-table, card-tiers, slider | NEW |
| QuoteForm | Multi-step RFQ: product → specs → file upload → contact | multi-step, single-page, sidebar | NEW |
| FileUploadGuide | Visual checklist of file requirements and templates | checklist, visual-guide | NEW |
| PortfolioGallery | Filterable gallery of completed work | grid, masonry, featured-large | Adapts Gallery |
| TrustStrip | Trust signals: years, equipment, certifications, SLA | icon-row, stat-counter, logo-strip | Adapts Stats |
| EquipmentShowcase | Printing equipment capabilities showcase | grid-cards, timeline, photo-gallery | NEW |
| ProcessTimeline | Print production process visualization | horizontal, vertical, numbered | Adapts HowItWorks |
| CTABanner | Conversion banner with dual CTA (Quote + Call) | centered, split, full-bleed | Adapts CTA |
| FAQAccordion | Expandable FAQ, supports per-product grouping | simple, grouped, search | Adapts FAQ |

**7 of 12 components reuse existing medical system patterns. 5 are genuinely new.**

---

## Content Contract Model

Each page uses JSON content following the same pattern as the medical system:
- `pages/<slug>.json` for content
- `pages/<slug>.layout.json` for section visibility/ordering
- Global files: `site.json`, `header.json`, `footer.json`, `seo.json`, `theme.json`

### Principles
- Every field has a sensible default — no page breaks if a field is empty
- Variant selection controls layout, not content
- Arrays are always optional — components handle 0, 1, or many items
- Image paths reference the media library
- CTA objects include both primary (quote) and secondary (call) options

---

## Admin Integration Strategy

### Already Works (No Changes Needed)
- Site management, domain routing, environment flags
- Content editing: Form + JSON dual mode, Import/Export
- Site Settings: Footer, Header, Navigation, SEO, Site Info, Theme
- Media management, variant system, content revisions, audit logs

### Needs Addition (Minimal)
- New variant definitions for printing-specific sections
- Form field templates for printing content types
- Product category taxonomy in site.json or products.json
- Quote form configuration per product type

### Integration Sequence
1. Build frontend with hardcoded JSON → proves data shape
2. Move JSON into content_entries table → existing pattern
3. Add form field definitions → enables Form mode editing
4. Register new variants → enables layout switching

---

## Quote / RFQ System

### Multi-Step Flow
1. **Product Selection** — User selects category, pre-fill common specs for simple products
2. **Specifications** — Dynamic fields per product: quantity, size, paper, finish, binding, color
3. **File Upload (Optional)** — Drag-and-drop, format validation, inline guidelines. Accepts: PDF, AI, INDD, PSD, TIFF
4. **Contact & Submit** — Name, company, email, phone, deadline, notes → email via Resend + Supabase storage

### Technical
- React multi-step form with per-step validation
- File upload to Supabase Storage
- Submission via Supabase Edge Function → Resend email
- Optional n8n workflow for automated acknowledgment
- No shopping cart — RFQ-based, not e-commerce

---

## SEO Strategy

### Programmatic Page Types

| Type | URL Pattern | Examples |
|------|-------------|----------|
| Service × Location | /[service]-printing/[city] | newspaper-printing-new-york |
| Comparison | /[a]-vs-[b] | offset-vs-digital-printing |
| Use Case | /[industry]-printing | restaurant-menu-printing |
| Spec Guide | /guides/[topic] | cmyk-vs-rgb-for-print |

### Target Locations (Northeast Focus)
- New York City (Manhattan, Brooklyn, Queens, Flushing)
- New Jersey (Newark, Jersey City, Edison)
- Connecticut, Pennsylvania, Massachusetts
- Broader: DC, Baltimore, Virginia

### Structured Data
- Schema.org: LocalBusiness, Product, FAQ, Service
- Sitemap auto-generation + IndexNow integration

---

## Frontend Design Direction

### Visual Identity
- **Palette:** Deep navy/charcoal primary + warm gold accent. Clean white for product pages.
- **Typography:** Authoritative serif headlines (Playfair Display or similar) + clean sans-serif body.
- **Photography:** Real facility photos, actual equipment, real print output. Stock only as supplement.
- **Layout:** Generous whitespace, clear hierarchy, full-width product imagery. Premium portfolio feel.
- **Interactions:** Subtle hover states, smooth scrolling, tasteful transitions. No gimmicks.

### Design References
- MOO.com — Premium print, excellent product photography
- Newspaper Club — Clean modern newspaper printing site
- Mixam.com — Good product configurator UX
- Lulu.com — Book printing / POD self-serve flow

---

## Phase-by-Phase Plan

### Phase 1: Frontend Build (Week 1-2)
Build complete printing frontend with pixel-perfect design using mock JSON data.

1. Set up Next.js project (fork from medical system framework)
2. Build Home page: hero, product grid, trust strip, portfolio preview, CTA
3. Build Products hub page with visual category navigation
4. Build 3 key product detail pages: Newspapers, Magazines, Books
5. Build About / Facility page with equipment showcase
6. Build Portfolio page with filterable gallery
7. Build Contact page with dual CTA
8. Build File Guidelines page
9. Lock typography, color system, spacing, interaction patterns
10. All pages use hardcoded JSON — no backend dependency

**Deliverable:** Pixel-perfect frontend, 8+ pages, core components built

### Phase 2: Quote System + Remaining Pages (Week 3)
Build RFQ system and complete all product detail pages.

1. Build multi-step Quote/RFQ form with per-product spec fields
2. Implement file upload with validation and preview
3. Build remaining 4 product pages: Marketing Print, Menus, Business Cards, Large Format
4. Build FAQ page with per-product sections
5. Responsive polish and mobile optimization
6. Quote submission handler (Supabase Edge Function + Resend)
7. Test complete journey: Home → Product → Quote → Confirmation

**Deliverable:** Complete frontend with working quote system, all pages, mobile-ready

### Phase 3: Admin Wiring (Week 4)
Extract content contracts and wire to admin system.

1. Extract JSON contracts from each page
2. Move content to Supabase content_entries
3. Add printing variant definitions
4. Create admin form templates for printing sections
5. Configure site_domains for Epoch Press
6. Test admin editing flow end-to-end
7. Set up media library with printing assets

**Deliverable:** Admin-editable printing site

### Phase 4: SEO + Launch Prep (Week 5)
Programmatic pages, search optimization, production prep.

1. Build programmatic page templates (service × location, comparison, use case)
2. Generate initial 30-50 programmatic pages
3. Add schema.org structured data
4. Configure sitemap + IndexNow
5. Performance audit (Core Web Vitals)
6. Chinese language content for key pages
7. Final review

**Deliverable:** SEO-optimized, production-ready site

### Phase 5: Launch + Growth (Week 6+)
Go live and begin growth operations.

1. Deploy to production domain
2. Configure production domain aliases
3. Submit to Google Search Console
4. Begin content publishing (2 posts/week)
5. Monitor rankings, indexation, conversions
6. Generate remaining programmatic pages (150+ total)
7. Document SOPs for BAAM printing template

**Deliverable:** Live site, growth engine running, BAAM System C template ready

---

## Cost & Timeline

| Phase | Timeline | Primary Tool |
|-------|----------|-------------|
| Phase 1: Frontend Build | Week 1-2 | Cursor (Sonnet 4.6 Agent) |
| Phase 2: Quote + Pages | Week 3 | Cursor (Sonnet 4.6 Agent) |
| Phase 3: Admin Wiring | Week 4 | Cursor (admin extensions) |
| Phase 4: SEO + Prep | Week 5 | Claude Teams (content) + scripts |
| Phase 5: Launch | Week 6+ | Vercel + n8n + growth tools |
| **Total to Launch** | **5-6 weeks** | |
