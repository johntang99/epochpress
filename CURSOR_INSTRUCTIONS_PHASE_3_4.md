# Cursor Instructions — Phase 3 & 4: Admin Wiring + SEO & Launch Prep

> **How to use this document:**
> Each section below is a separate Cursor conversation/prompt.
> Do NOT paste everything at once. Work through them one at a time.
> Always reference: `@PRINTING_SYSTEM_IMPLEMENTATION_PLAN.md`
> Reference existing medical system files when Cursor needs patterns to follow.

---

## Phase 3: Admin Wiring (Week 4)

The goal: take the working frontend with hardcoded JSON and connect it to the existing admin CMS so all content is editable through the admin dashboard.

---

### Prompt 1 — Extract Content Contracts from Frontend

```
We've built the complete Epoch Press printing frontend with hardcoded JSON data files in `/data/`. Now we need to formalize these as content contracts that our admin CMS can manage.

Look at ALL the JSON data files we created:
- /data/home.json
- /data/products.json
- /data/pages/newspaper-printing.json
- /data/pages/magazine-printing.json
- /data/pages/book-printing.json
- /data/pages/marketing-print.json
- /data/pages/menu-printing.json
- /data/pages/business-cards.json
- /data/pages/large-format.json
- /data/pages/about.json
- /data/pages/contact.json
- /data/pages/file-guidelines.json
- /data/pages/faq.json
- /data/portfolio.json
- /data/quote-config.json

And any global data files (site.json, header.json, footer.json, theme.json, seo.json, navigation.json).

For each file, create a corresponding content contract document at `/docs/contracts/` that defines:

1. **File path** — where it lives in the content system (e.g., `pages/home.json`)
2. **Schema** — TypeScript interface for every field with types, required vs optional, defaults
3. **Section breakdown** — which sections exist, their variant options, and their field definitions
4. **Layout file** — corresponding `.layout.json` defining section order and visibility (following the medical system pattern)

Also create a master contract index at `/docs/contracts/INDEX.md` that lists every content file, its purpose, and its editable fields count.

Reference the medical system's content structure:
@[path to medical content directory or a sample medical page JSON]

The output should make it crystal clear what the admin CMS needs to manage for every page.
```

### Prompt 2 — Create Content Entry Migration

```
Now we need to move the hardcoded JSON data into the Supabase content_entries table, following the same pattern our medical sites use.

Look at how the medical system stores content:
@[path to medical system's content loading/fetching code]
@[path to any API routes that read content_entries]

For the printing site, create:

1. **A seed script** at `/scripts/seed-printing-content.ts` (or .js) that:
   - Reads all JSON files from `/data/`
   - Inserts them into the `content_entries` table with the correct structure:
     - `site_id`: the Epoch Press site UUID (use a placeholder/env variable)
     - `path`: the content file path (e.g., `pages/home.json`, `pages/newspaper-printing.json`)
     - `locale`: `en` (default)
     - `content`: the full JSON content
   - Also seeds the global settings files: site.json, header.json, footer.json, seo.json, theme.json, navigation.json
   - Handles both insert (first run) and update (re-run) via upsert

2. **Update the frontend data loading** to read from Supabase instead of local JSON files:
   - Create a `lib/content.ts` utility that fetches content by path and locale
   - It should try Supabase first, fall back to local JSON files if DB is unavailable (development convenience)
   - Follow the same fetching pattern the medical system uses
   - Cache appropriately for production (ISR revalidation)

3. **Create layout files** for each page:
   - `pages/home.layout.json` — defines which sections are visible and in what order
   - Same for every other page
   - These also go into content_entries

Do NOT change any frontend components or styling. Only change where the data comes from.

After this, the site should look identical but now reads from the database.
```

### Prompt 3 — Register Printing Variants

```
Our admin has a Variants panel that lets editors browse and apply layout variants to sections. We need to register the printing-specific variants.

Look at how the medical system defines variants:
@[path to medical variant definition files, e.g., hero.variant, services.variant, etc.]

Create variant definition files for the printing system. For each section component we built, define the available variants:

1. **hero.variant** — Variants: centered, split-image, video-bg, carousel
   Show the JSON structure for each (e.g., `{ "hero": { "variant": "split-image" } }`)

2. **productGrid.variant** — Variants: grid-3, grid-4, masonry, horizontal-scroll

3. **productSpecs.variant** — Variants: tabs, accordion, side-by-side, table
   (This is NEW — doesn't exist in medical)

4. **priceTiers.variant** — Variants: simple-table, card-tiers, slider-calculator
   (This is NEW)

5. **portfolio.variant** — Variants: grid, masonry, featured-large, carousel

6. **trustStrip.variant** — Variants: icon-row, stat-counter, logo-strip

7. **equipment.variant** — Variants: grid-cards, timeline, photo-gallery
   (This is NEW)

8. **process.variant** — Variants: horizontal, vertical, numbered-steps

9. **cta.variant** — Variants: centered, split, full-bleed, minimal

10. **faq.variant** — Variants: simple, grouped, search-enabled

11. **quoteForm.variant** — Variants: multi-step, single-page, sidebar-sticky
    (This is NEW)

12. **fileGuide.variant** — Variants: checklist, visual-guide, interactive
    (This is NEW)

Each variant file should include:
- Section name and description
- Each variant with: name, description, and the JSON snippet to apply it
- A preview description (what changes visually)

Place these in the same directory structure the medical system uses for variants.
```

### Prompt 4 — Admin Form Field Definitions

```
The admin Content Editor uses form field definitions to render editable fields for each section. We need to add printing-specific form fields.

Look at how the medical system defines form fields for its sections:
@[path to medical admin ContentEditor or form field definition files]

Create form field definitions for each printing section. These tell the admin UI what fields to show in Form mode (as opposed to raw JSON mode).

For each section, define fields with:
- Field name (key in JSON)
- Label (human-readable)
- Field type (text, textarea, richtext, image, select, number, array, boolean)
- Required vs optional
- Default value
- For select fields: list of options
- For array fields: the sub-field structure

Priority sections to define (these are the most-edited):

**Product Detail Hero:**
- title (text, required)
- subtitle (text, optional)
- description (textarea, required)
- image (image, required)
- cta.label (text, default: "Get a Quote")
- cta.href (text, default: "/quote")
- ctaSecondary.label (text, default: "Call Us")
- ctaSecondary.href (text)

**Product Specs Block:**
- variant (select: tabs/accordion/side-by-side/table)
- categories (array):
  - name (text)
  - sizes (array of text)
  - paperOptions (array of text)
  - colorOptions (array of text)
  - bindingOptions (array of text)
  - minQuantity (number)
  - turnaround (text)

**Price Tier Table:**
- variant (select: simple-table/card-tiers/slider)
- tiers (array):
  - range (text, e.g., "100-499")
  - label (text, e.g., "Small Run")
  - startingPrice (text, e.g., "Starting from $0.45/unit")
- customNote (text, default: "Contact us for custom quotes on larger runs")

**Trust Strip:**
- stats (array):
  - value (text, e.g., "25+")
  - label (text, e.g., "Years Experience")
  - icon (text/select, optional)

**Equipment Showcase:**
- items (array):
  - name (text, e.g., "Web Offset Press")
  - description (textarea)
  - capability (text, e.g., "Up to 50,000 impressions/hour")
  - image (image, optional)

**Quote Form Config:**
- products (array):
  - slug (text)
  - name (text)
  - specFields (array of field definitions)

Place these definitions where the medical system stores its form field configs. The admin ContentEditor should be able to load these and render the appropriate form for printing pages.
```

### Prompt 5 — Site Configuration & Domain Setup

```
Set up the Epoch Press site configuration in the admin system.

Look at how medical sites are configured:
@[path to site configuration, site_domains handling, middleware for domain routing]

Create the following:

1. **Site entry** — Add Epoch Press to the sites table (or create seed data):
   - name: "Epoch Press"
   - slug: "epoch-press"
   - default_locale: "en"
   - supported_locales: ["en", "zh"]
   - status: "active"
   - industry: "printing"

2. **Domain aliases** — Configure in site_domains:
   - Production: epochpress.com (environment: prod)
   - Dev/local: epochpress.local (environment: dev)
   - Add to /etc/hosts for local development: `127.0.0.1 epochpress.local`

3. **Global settings files** — Ensure these are populated in content_entries:
   - site.json: company name, phone, email, address, social links, business hours
   - header.json: logo, navigation structure, CTA button config
   - footer.json: columns, links, contact info, copyright
   - seo.json: default title template, meta descriptions, OG image
   - theme.json: color variables, font families, spacing scale
   - navigation.json: main nav items with Products dropdown structure

4. **Middleware update** — Ensure the host routing middleware can resolve epochpress.local and epochpress.com to the correct site_id and serve the printing frontend.

5. **Test the full flow:**
   - Access epochpress.local:3000 in browser
   - Verify it loads the printing frontend (not medical)
   - Go to localhost:3003/admin/sites — verify Epoch Press appears
   - Select Epoch Press in admin — verify content editing works
   - Edit a field in admin → save → verify change appears on frontend

This is the critical integration test. If this works end-to-end, the admin wiring is complete.
```

### Prompt 6 — Media Library Setup

```
Set up the media library for Epoch Press printing assets.

Look at how the medical system handles media:
@[path to media manager, media_assets table usage]

1. **Create placeholder media structure:**
   Organize media assets into folders/categories:
   - /printing/products/ — product category images (newspaper, magazine, book, etc.)
   - /printing/portfolio/ — portfolio/case study images
   - /printing/facility/ — facility photos, equipment images
   - /printing/icons/ — product icons, spec icons
   - /printing/general/ — hero backgrounds, CTA backgrounds, team photos

2. **Create a download/placeholder script** at `/scripts/setup-printing-media.ts`:
   - Downloads high-quality placeholder images from Unsplash or Pexels API
   - OR generates placeholder image entries in media_assets table
   - Tags each image with appropriate category and alt text
   - Associates images with the Epoch Press site_id

3. **Update content JSON** to reference media library paths instead of local placeholder paths:
   - hero images → media library references
   - product images → media library references
   - portfolio images → media library references
   - Make sure the frontend image components resolve media library URLs correctly

4. **Verify in admin:**
   - Go to Media manager in admin
   - Select Epoch Press site
   - Confirm media assets are organized and browsable
   - Test: select an image from media library in a content form field
```

### Prompt 7 — End-to-End Admin Testing

```
Run a comprehensive test of the admin ↔ frontend integration for Epoch Press.

Test checklist — verify each of these works:

1. **Site Settings editing:**
   - Edit footer.json → save → check footer updates on frontend
   - Edit header.json → save → check navigation updates
   - Edit seo.json → save → check page title/meta changes
   - Edit theme.json → save → check color/font changes (if applicable)

2. **Content editing (Form mode):**
   - Edit Home page hero title → save → verify on frontend
   - Change a product detail page spec → save → verify
   - Add a new FAQ item → save → verify it appears
   - Change a section variant (e.g., hero from centered to split-image) → save → verify layout changes

3. **Content editing (JSON mode):**
   - Switch to JSON tab → make an edit → save → verify
   - Ensure Form mode and JSON mode stay in sync

4. **Import/Export:**
   - Export the Epoch Press content as JSON
   - Verify the export includes all pages and settings
   - Test import on a fresh/test site (if possible)

5. **Media integration:**
   - Choose a new image from media library for a hero section
   - Save → verify new image appears on frontend

6. **Layout editing:**
   - Change section order in a .layout.json → save → verify sections reorder on frontend
   - Hide a section (set visible: false) → save → verify it disappears
   - Show it again → verify it returns

Fix any issues found. Document any known limitations or admin UI adjustments needed for printing-specific fields.

Create a brief test report at `/docs/ADMIN_INTEGRATION_TEST.md` noting what passed, what needs attention, and any workarounds.
```

---

## Phase 4: SEO + Launch Prep (Week 5)

---

### Prompt 8 — Programmatic SEO: Service × Location Pages

```
Build the programmatic SEO page system for service × location pages.

These pages target searches like "newspaper printing new york", "book printing new jersey", etc.

1. **Create dynamic route:** `/products/[slug]/[location]/page.tsx`
   This renders a location-specific version of the product detail page.

2. **Location data file** at `/data/locations.json`:
   ```json
   [
     { "slug": "new-york", "name": "New York", "state": "NY", "region": "Northeast" },
     { "slug": "manhattan", "name": "Manhattan", "state": "NY", "region": "Northeast" },
     { "slug": "brooklyn", "name": "Brooklyn", "state": "NY", "region": "Northeast" },
     { "slug": "flushing", "name": "Flushing", "state": "NY", "region": "Northeast" },
     { "slug": "queens", "name": "Queens", "state": "NY", "region": "Northeast" },
     { "slug": "newark", "name": "Newark", "state": "NJ", "region": "Northeast" },
     { "slug": "jersey-city", "name": "Jersey City", "state": "NJ", "region": "Northeast" },
     { "slug": "edison", "name": "Edison", "state": "NJ", "region": "Northeast" },
     { "slug": "philadelphia", "name": "Philadelphia", "state": "PA", "region": "Northeast" },
     { "slug": "boston", "name": "Boston", "state": "MA", "region": "Northeast" },
     { "slug": "hartford", "name": "Hartford", "state": "CT", "region": "Northeast" },
     { "slug": "stamford", "name": "Stamford", "state": "CT", "region": "Northeast" },
     { "slug": "washington-dc", "name": "Washington DC", "state": "DC", "region": "Mid-Atlantic" },
     { "slug": "baltimore", "name": "Baltimore", "state": "MD", "region": "Mid-Atlantic" },
     { "slug": "pittsburgh", "name": "Pittsburgh", "state": "PA", "region": "Northeast" }
   ]
   ```

3. **Page content strategy:** Each location page should NOT be a thin duplicate. It should include:
   - H1: "[Product] Printing in [Location]" (e.g., "Newspaper Printing in New York")
   - Intro paragraph mentioning the location and Epoch Press's service to that area
   - Same product specs as the main product page (shared component)
   - Location-specific CTA: "Get a quote for [product] printing in [location]"
   - A "Why choose Epoch Press for [location]?" section with:
     - Proximity/shipping advantages
     - Serving [location] businesses for X years
     - Fast turnaround for [region] clients
   - Link back to main product page and other nearby locations

4. **Generate static paths** using `generateStaticParams()`:
   - Generate all combinations: 7 products × 15 locations = 105 pages
   - Use ISR with revalidation for future updates

5. **Unique meta titles and descriptions per page:**
   - Title: "[Product] Printing in [City], [State] | Epoch Press"
   - Description: "Professional [product] printing services in [city]. High quality, competitive pricing. Get a free quote from Epoch Press."

6. **Internal linking:**
   - Each location page links to: the main product page, other products in same location, same product in nearby locations
   - Add a "Serving the [Region]" section at bottom with links to all locations

Reference @PRINTING_SYSTEM_IMPLEMENTATION_PLAN.md for the full SEO strategy.
```

### Prompt 9 — Programmatic SEO: Comparison & Use Case Pages

```
Build two more programmatic page types for SEO:

**A) Comparison Pages** at `/guides/[slug]`

Create 8-10 comparison/guide pages:
1. /guides/offset-vs-digital-printing
2. /guides/saddle-stitch-vs-perfect-binding
3. /guides/cmyk-vs-rgb-for-print
4. /guides/matte-vs-gloss-finish
5. /guides/coated-vs-uncoated-paper
6. /guides/hardcover-vs-softcover-books
7. /guides/print-on-demand-vs-offset
8. /guides/tabloid-vs-broadsheet-newspaper

Each comparison page:
- H1: "[Option A] vs [Option B]: Which is Right for Your Project?"
- Introduction paragraph
- Side-by-side comparison table (feature, Option A, Option B)
- "When to choose [A]" section with bullet points
- "When to choose [B]" section with bullet points
- "Our recommendation" paragraph
- CTA: "Not sure which is right? Get a free consultation"
- Related products section linking to relevant product pages

Create data in `/data/guides/` with one JSON file per guide.

**B) Use Case Pages** at `/industries/[slug]`

Create 6-8 industry-specific use case pages:
1. /industries/restaurant-printing — menus, table tents, loyalty cards, flyers
2. /industries/real-estate-printing — brochures, postcards, signage, business cards
3. /industries/nonprofit-printing — newsletters, annual reports, event programs, donor cards
4. /industries/church-printing — bulletins, programs, banners, booklets
5. /industries/education-printing — textbooks, workbooks, course catalogs, diplomas
6. /industries/corporate-printing — annual reports, marketing collateral, business cards, presentations

Each use case page:
- H1: "Printing Solutions for [Industry]"
- Introduction about printing needs specific to this industry
- Product recommendations grid (which Epoch Press products serve this industry, with links)
- Case study / example (placeholder content)
- Industry-specific trust signals
- CTA: "Get a quote for your [industry] printing needs"

Create data in `/data/industries/` with one JSON file per industry.

Both page types should have proper meta titles, descriptions, and schema.org structured data.
```

### Prompt 10 — Schema.org Structured Data

```
Add comprehensive schema.org structured data to all pages for rich search results.

1. **Site-wide (in layout):**
   - LocalBusiness schema:
     ```json
     {
       "@type": "LocalBusiness",
       "name": "Epoch Press",
       "description": "Full-service commercial printing company",
       "telephone": "+1-XXX-XXX-XXXX",
       "address": { ... },
       "geo": { "latitude": ..., "longitude": ... },
       "openingHours": "Mo-Fr 08:00-18:00",
       "priceRange": "$$",
       "image": "...",
       "url": "https://epochpress.com"
     }
     ```
   - Organization schema with logo, social profiles

2. **Product pages** — each product detail page:
   - Product schema with name, description, category
   - Offer schema with price range indication
   - AggregateRating placeholder (for future reviews)

3. **FAQ pages** — FAQPage schema:
   - Each question/answer pair as Question/Answer schema
   - Apply to both /faq page AND per-product FAQ sections

4. **Portfolio/Case Studies** — CreativeWork schema per item

5. **Comparison/Guide pages** — Article schema with:
   - headline, datePublished, author (Epoch Press), description
   - BreadcrumbList for navigation path

6. **Service × Location pages:**
   - Service schema with areaServed set to the specific location
   - BreadcrumbList: Home > Products > [Product] > [Location]

Implement using Next.js metadata API and JSON-LD script tags.
Create a utility at `/lib/schema.ts` with helper functions:
- `generateLocalBusinessSchema(siteData)`
- `generateProductSchema(product)`
- `generateFAQSchema(faqItems)`
- `generateArticleSchema(article)`
- `generateServiceSchema(product, location)`
- `generateBreadcrumbSchema(items)`

Each page should call the appropriate helpers and inject the JSON-LD.
```

### Prompt 11 — Sitemap & IndexNow Integration

```
Set up automated sitemap generation and search engine notification.

1. **Dynamic sitemap** at `/app/sitemap.ts`:
   Using Next.js built-in sitemap generation, create a comprehensive sitemap that includes:
   
   - All core pages (home, products, about, portfolio, contact, faq, file-guidelines, quote)
   - All 7 product detail pages
   - All service × location pages (7 products × 15 locations = 105 URLs)
   - All comparison/guide pages (8-10 URLs)
   - All industry/use-case pages (6-8 URLs)
   - Blog posts (when they exist, query from content_entries)
   
   Each URL should include:
   - `url`: full URL
   - `lastModified`: from content_entries updated_at or current date
   - `changeFrequency`: 'weekly' for product pages, 'monthly' for guides, 'daily' for blog
   - `priority`: 1.0 for home, 0.9 for products, 0.8 for locations, 0.7 for guides

   Total expected URLs: ~140-170

2. **Robots.txt** at `/app/robots.ts`:
   ```
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /api/admin/
   Sitemap: https://epochpress.com/sitemap.xml
   ```

3. **IndexNow integration** at `/lib/indexnow.ts`:
   - Create a utility function `notifyIndexNow(urls: string[])`
   - It sends HTTP POST to IndexNow API endpoints (Bing, Yandex, etc.)
   - API key stored as environment variable
   - Create the key file at `/public/[key].txt`

4. **Auto-notification hook:**
   - After content is saved/published via admin, trigger IndexNow for the affected URLs
   - This can be a Supabase database webhook or an API route called by the admin after save
   - Create `/api/reindex/route.ts` that accepts a list of paths and notifies IndexNow

5. **Google Search Console preparation:**
   - Add verification meta tag or file method in `/app/layout.tsx` or `/public/`
   - Document the steps to verify in Search Console (in a brief /docs/SEARCH_CONSOLE_SETUP.md)
```

### Prompt 12 — Performance Optimization

```
Run a performance optimization pass to ensure the site meets production standards.

1. **Image optimization:**
   - All images use next/image with explicit width/height
   - Implement responsive srcset for different breakpoints
   - Use WebP format where possible
   - Lazy load all below-fold images
   - Hero images: use priority={true} for LCP optimization
   - Portfolio gallery: implement virtual scrolling or pagination for large sets

2. **Font optimization:**
   - Preload Playfair Display and body font
   - Use `next/font` for automatic optimization
   - Ensure font-display: swap to prevent FOIT
   - Subset fonts if possible (Latin only for English)

3. **JavaScript optimization:**
   - Minimize client-side JS — most pages should be server-rendered
   - Quote form: ensure it's code-split (dynamic import)
   - Portfolio filter: use client component only for the interactive filter, server-render the grid
   - No unnecessary third-party scripts

4. **Caching strategy:**
   - ISR revalidation: 3600 seconds (1 hour) for product pages
   - ISR revalidation: 86400 seconds (24 hours) for programmatic SEO pages
   - Static generation for guides and comparisons
   - Dynamic for quote form submission

5. **Core Web Vitals targets:**
   - LCP < 2.5s (optimize hero image loading)
   - FID/INP < 200ms (minimize main thread blocking)
   - CLS < 0.1 (set explicit dimensions on all images and dynamic content)

6. **Meta and social:**
   - Every page has unique title and description
   - Open Graph tags with og:image for all pages (use product image or default)
   - Twitter card tags
   - Canonical URLs on all pages (especially important for programmatic pages)

Run a Lighthouse audit on the Home page and one product detail page. Fix any issues scoring below 90 in Performance, Accessibility, Best Practices, or SEO.
```

### Prompt 13 — Chinese Language Foundation (Secondary)

```
Add basic Chinese language support for key pages. This is secondary priority — English is primary.

Following the same i18n pattern as the medical system:
@[path to medical system's locale handling, middleware, content loading by locale]

1. **Locale routing:** Ensure the middleware and routing supports /zh/ prefix or locale parameter.

2. **Translate these pages only (minimum viable):**
   - Home page (hero, product categories, trust strip, CTA)
   - About page (company story, key sections)
   - Contact page (form labels, contact info)
   - Quote page (form labels, step instructions, product names)

3. **Create Chinese content files:**
   - Store as separate locale entries in content_entries (locale: 'zh')
   - OR as parallel JSON files following the medical system's pattern

4. **UI translations:**
   - Navigation items
   - Footer content
   - Button labels (Get a Quote → 获取报价, Call Us → 致电我们, etc.)
   - Form field labels and validation messages
   - Common UI strings

5. **Language switcher:**
   - Add EN/中文 toggle in the header (same position as medical system)
   - Persists language preference

Do NOT translate:
   - Product spec technical terms (keep in English, they're industry standard)
   - Blog/guide content (English only for now)
   - Programmatic SEO pages (English only)

Keep this lightweight. The Chinese content can be refined later.
```

### Prompt 14 — Pre-Launch Checklist & Final Review

```
Run through a comprehensive pre-launch checklist and fix any remaining issues.

Create a checklist file at `/docs/LAUNCH_CHECKLIST.md` and verify each item:

**Content:**
- [ ] All 7 product detail pages have complete, accurate content
- [ ] Home page all sections populated with real or high-quality placeholder content
- [ ] About page reflects Epoch Press accurately
- [ ] Portfolio has 12+ items across categories
- [ ] FAQ has 20+ questions covering common topics
- [ ] File Guidelines page is technically accurate
- [ ] Contact info (phone, email, address) is correct or placeholder-marked for replacement
- [ ] All CTAs link to correct destinations (/quote, /contact, tel:)

**Technical:**
- [ ] All pages render without errors (check browser console)
- [ ] No broken links (run a link checker)
- [ ] All images load correctly
- [ ] Forms submit without errors (quote form, contact form)
- [ ] 404 page exists and is styled
- [ ] Favicon and app icons set
- [ ] Robots.txt accessible
- [ ] Sitemap.xml generates correctly with all URLs
- [ ] Schema.org JSON-LD validates (test with Google Rich Results Test)
- [ ] Canonical URLs are correct on all pages

**Performance:**
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 90
- [ ] Lighthouse SEO score > 95
- [ ] All images optimized (WebP, appropriate sizes)
- [ ] No render-blocking resources

**Admin:**
- [ ] Epoch Press site appears in admin dashboard
- [ ] Content editing works in both Form and JSON mode
- [ ] Media library has organized printing assets
- [ ] Domain aliases configured (prod + dev)
- [ ] Import/Export works for Epoch Press content

**Responsive:**
- [ ] All pages tested on mobile (375px width)
- [ ] All pages tested on tablet (768px width)
- [ ] All pages tested on desktop (1440px width)
- [ ] Navigation works on all sizes
- [ ] Quote form is usable on mobile

**SEO:**
- [ ] Every page has unique meta title and description
- [ ] H1 tags present and unique on every page
- [ ] Alt text on all images
- [ ] Internal linking between related pages
- [ ] Programmatic pages have unique content (not thin duplicates)

Mark each item as passed, failed, or N/A. Fix all failed items before launch.
```

---

## Tips for Phase 3 & 4

1. **Phase 3 is the riskiest phase.** Admin wiring touches the database and existing systems. Commit to git before every prompt. Test after every change.

2. **For Prompt 2 (migration)**, point Cursor at your medical system's content loading code so it follows the exact same pattern. The less custom code, the better.

3. **For Prompt 5 (domain setup)**, you may need to manually add the site entry in Supabase first, then use Cursor for the code changes. The admin UI for adding sites might be easier than scripting it.

4. **Programmatic SEO pages (Prompts 8-9)** will generate the most URLs. Start with 5 locations instead of 15 to test the pattern, then expand.

5. **Performance optimization (Prompt 12)** — run Lighthouse in an incognito window to avoid extension interference. Fix the biggest issues first (usually images and fonts).

6. **Don't skip the checklist (Prompt 14).** It catches issues that are easy to miss but embarrassing in production.

7. **Git discipline:** Commit after each successful prompt. Tag the commit after Phase 3 is complete (`v0.3-admin-wired`) and after Phase 4 (`v0.4-launch-ready`).
