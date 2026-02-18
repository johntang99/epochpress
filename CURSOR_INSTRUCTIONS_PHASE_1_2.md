# Cursor Instructions — Phase 1 & 2: Frontend Build

> **How to use this document:**
> Each section below is a separate Cursor conversation/prompt.
> Do NOT paste everything at once. Work through them one at a time.
> Start a new Cursor Agent conversation for each major section.
> Always reference the plan: `@PRINTING_SYSTEM_IMPLEMENTATION_PLAN.md`

---

## Before You Start: Project Setup

### Prompt 0 — Project Initialization

```
I'm building a premium printing company website called "Epoch Press" using Next.js App Router + TypeScript + Tailwind CSS.

Look at the existing medical-clinic/chinese-medicine project structure for reference — we use the same framework, routing patterns, and content model (JSON-based pages with layout variants).

For the printing site, create the project structure under the `printing` directory (or in the appropriate location matching how medical-clinic is organized).

Set up:
- Next.js App Router with TypeScript
- Tailwind CSS with a custom theme config
- The following color palette as CSS variables and Tailwind config:
  - Primary: deep navy (#0F1B2D)
  - Secondary: charcoal (#2C3E50)  
  - Accent: warm gold (#B8860B)
  - Accent light: (#D4A843)
  - Background: white (#FFFFFF)
  - Surface: light gray (#F8F9FA)
  - Text primary: (#1A1A2E)
  - Text secondary: (#5A6977)
  - Success: (#1B7340)
  - Border: (#E2E8F0)

- Typography setup:
  - Headings: Playfair Display (serif) — import from Google Fonts
  - Body: Inter or DM Sans (sans-serif) — clean, modern
  - Mono: JetBrains Mono (for spec tables if needed)

- Base layout component with Header and Footer
- A `/data` directory for mock JSON content files
- A `/components` directory organized by type (layout, ui, sections, forms)

Reference @PRINTING_SYSTEM_IMPLEMENTATION_PLAN.md for the full project context.
```

---

## Phase 1: Frontend Build (Week 1-2)

### Prompt 1 — Home Page

```
Build the Epoch Press Home page. This is a premium commercial printing company serving the US (mainly Northeast). They offer: newspapers, magazines, books, marketing print (flyers/brochures/postcards), menus, business cards, and large format printing. High quality, competitive pricing.

The Home page needs these sections in order:

1. **Hero** — Full-width, premium feel. Headline like "Premium Printing. Exceptional Results." with subline about full-service commercial printing. Two CTAs: "Get a Quote" (primary, links to /quote) and "Call Us: (XXX) XXX-XXXX" (secondary). Background: either a dark overlay on a press/printing image, or a clean split layout with image on one side. Must feel like a high-end manufacturing partner, NOT a local copy shop.

2. **Product Category Grid** — 7 cards in a responsive grid. Each card: image, product name, brief 1-line description, "Learn More" link. Categories: Newspapers, Magazines, Books, Marketing Print, Menus, Business Cards, Large Format. Use placeholder images for now. Link each to /products/[slug].

3. **Trust Strip** — Horizontal section with key stats: "25+ Years Experience", "50M+ Pages Printed Annually", "500+ Business Clients", "48-Hour Rush Available". Use clean icons or numbers. Dark background to contrast.

4. **Featured Portfolio** — 3-4 portfolio items showing best work. Image + project name + brief description. "View All Work" link to /portfolio. Use placeholder images.

5. **Process Overview** — Simple 4-step visual: Submit Files → Proof Review → Production → Delivery. Clean horizontal timeline or step cards.

6. **CTA Banner** — "Ready to Start Your Project?" with Get a Quote button and phone number. Full-width, gold accent or dark navy background.

7. **Footer** — Company info, quick links (Products, About, Portfolio, Quote, Contact), contact details, social links placeholder.

Create mock JSON data in `/data/home.json` following the same content model pattern as the medical site. Every section should read its content from this JSON.

Design must be premium, authoritative, generous whitespace. Playfair Display for headings, clean sans-serif for body. Navy + gold palette.

Reference @PRINTING_SYSTEM_IMPLEMENTATION_PLAN.md for full context.
```

### Prompt 2 — Header / Navigation

```
Build the site-wide Header/Navigation for Epoch Press.

Requirements:
- Logo area (text "EPOCH PRESS" or placeholder for logo image) on the left
- Main navigation links: Products (with dropdown showing 7 categories), About, Portfolio, Resources, Contact
- Right side: Phone number display + "Get a Quote" button (gold/accent color, prominent)
- Sticky header on scroll with subtle background blur/shadow
- Mobile: hamburger menu with full-screen overlay navigation
- Products dropdown on desktop: show 7 product categories with small icons or descriptions
- Active state for current page
- Clean, premium feel — not cluttered

The header should be a shared layout component used across all pages.
```

### Prompt 3 — Products Hub Page

```
Build the Products hub page at /products.

This is the main product catalog page showing all 7 printing categories.

Layout:
- Page hero: "Our Printing Services" headline, brief description about comprehensive printing capabilities
- Product grid: 7 product category cards, larger than the homepage grid
- Each card should have:
  - Large image area (placeholder for now)
  - Product category name (e.g., "Newspaper Printing")
  - 2-3 sentence description of what Epoch Press offers in this category
  - Key highlights (e.g., "Web offset & digital", "500 to 500,000+ copies", "3-5 day turnaround")
  - "Learn More" button linking to /products/[slug]
- Below the grid: CTA section with quote prompt

Create mock data in `/data/products.json`.

The 7 categories and their slugs:
1. newspaper-printing
2. magazine-printing
3. book-printing
4. marketing-print (flyers, brochures, postcards, posters)
5. menu-printing
6. business-cards
7. large-format

Design: Clean grid layout, generous card spacing, premium imagery placeholders.
```

### Prompt 4 — Product Detail Template + First 3 Products

```
Build the Product Detail page template and create the first 3 product pages:
- /products/newspaper-printing
- /products/magazine-printing
- /products/book-printing

Each product detail page uses the SAME template with DIFFERENT content from JSON data files:
- `/data/pages/newspaper-printing.json`
- `/data/pages/magazine-printing.json`
- `/data/pages/book-printing.json`

The product detail template sections:

1. **Product Hero** — Product name, description, hero image, primary CTA (Get a Quote for this product), secondary CTA (Call Us). The CTA should link to /quote?product=[slug].

2. **Product Specs Block** — This is the KEY printing-specific component.
   Show specifications in tabs or accordion format:
   - Available sizes/formats
   - Paper options (stock types and weights)
   - Color options (full color, BW, spot color)
   - Binding/finishing options
   - Minimum quantities
   - Standard turnaround times
   
   For newspapers: broadsheet vs tabloid formats, newsprint grades, insert options
   For magazines: saddle stitch vs perfect binding, cover finishes (UV, matte, gloss), page count ranges
   For books: hardcover vs softcover vs POD, binding types, cover finishes, ISBN/barcode services

3. **Price Guidance** — NOT exact pricing (this varies by spec). Show quantity tier guidance:
   "100-499: Starting from $X" / "500-999" / "1000-4999" / "5000+" / "Custom quote for larger runs"
   Include a note: "Every project is unique. Get an exact quote for your specifications."
   With prominent Get a Quote CTA.

4. **Portfolio Samples** — 2-3 examples of completed work in this category. Image + brief description. Placeholder images fine.

5. **Production Process** — How this specific product type is produced. 3-5 steps specific to the product.

6. **FAQ** — 4-6 frequently asked questions specific to this product type. Accordion format.

7. **CTA Banner** — "Ready to print your [product]?" with quote link and phone.

Use dynamic routing: /products/[slug]/page.tsx that reads from the appropriate JSON file.

Design: Clean, informative, spec-heavy but well-organized. The specs section is the most important — it needs to feel professional and comprehensive, like a real printing company catalog.
```

### Prompt 5 — About / Facility Page

```
Build the About / Facility page at /about.

Epoch Press is a full-service commercial printing company. This page must build trust and show manufacturing capability.

Sections:

1. **Hero** — "About Epoch Press" with a compelling subtitle about decades of printing excellence. Split layout with facility photo placeholder.

2. **Company Story** — Brief history, mission, values. 2-3 paragraphs. Professional tone.

3. **Equipment Showcase** — This is a NEW component specific to printing.
   Show printing equipment capabilities in a grid or card layout:
   - Web offset presses (for newspapers, high-volume)
   - Sheet-fed offset presses (for magazines, books, marketing)
   - Digital presses (for POD, short runs, variable data)
   - Large format printers (for banners, signage)
   - Finishing equipment (cutting, folding, binding, laminating)
   
   Each item: equipment type, brief capability description, key stat (e.g., "Up to 50,000 impressions/hour")

4. **Certifications & Quality** — ISO certifications, FSC certification, color management standards, quality control process. Use icon + text cards.

5. **Team** — Optional section for key team members or department leads. Can be placeholder.

6. **Facility Gallery** — Image grid showing the facility, equipment in action, warehouse. Placeholder images.

7. **CTA** — "See what we can do for your next project" with quote and portfolio links.

Create mock data in `/data/pages/about.json`.
```

### Prompt 6 — Portfolio Page

```
Build the Portfolio / Case Studies page at /portfolio.

This showcases Epoch Press's completed work and builds credibility.

Sections:

1. **Hero** — "Our Work" with subtitle about serving hundreds of clients across industries.

2. **Filter Bar** — Filter portfolio items by product category:
   All | Newspapers | Magazines | Books | Marketing | Menus | Business Cards | Large Format
   Clicking a filter shows only items in that category. Smooth transition.

3. **Portfolio Grid** — Masonry or responsive grid of portfolio items.
   Each item:
   - Large image (placeholder)
   - Project name
   - Client name (or "Client" placeholder)
   - Product category tag
   - Brief description (1-2 sentences)
   - Click opens detail view or modal with more info

4. **Stats Bar** — "500+ clients served", "25+ years", "Millions of pages", etc.

5. **CTA** — "Let's create something great together" with quote button.

Create mock data in `/data/portfolio.json` with 12-16 sample portfolio items across all categories.
```

### Prompt 7 — Contact Page

```
Build the Contact page at /contact.

Sections:

1. **Hero** — "Get in Touch" with subtitle.

2. **Contact Split Layout**:
   Left side: Contact form (Name, Company, Email, Phone, Product interest dropdown, Message, Submit)
   Right side: Direct contact info:
   - Phone number (prominent, clickable)
   - Email address
   - Physical address
   - Business hours
   - Google Maps embed placeholder

3. **Dual CTA Cards** — Two cards side by side:
   "Need a Quick Quote?" → links to /quote
   "Prefer to Talk?" → shows phone number prominently

Create mock data in `/data/pages/contact.json`.
```

### Prompt 8 — File Guidelines Page

```
Build the File Guidelines page at /file-guidelines.

This is a printing-specific page that helps customers prepare files correctly. It's critical for reducing back-and-forth and showing professionalism.

Sections:

1. **Hero** — "File Preparation Guidelines" with subtitle about ensuring the best print quality.

2. **Accepted Formats** — Visual card grid showing:
   - PDF (preferred) ✓
   - Adobe Illustrator (.ai) ✓
   - Adobe InDesign (.indd) ✓
   - Photoshop (.psd) ✓
   - TIFF (.tiff) ✓
   - NOT accepted: Word docs, PowerPoint, low-res JPEGs ✗
   Use green checkmarks and red X marks.

3. **Bleed & Safety** — Visual diagram explaining:
   - Bleed area (0.125" standard)
   - Trim line
   - Safety zone (keep text/important elements 0.25" from trim)
   Use a simple visual or illustrated example.

4. **Resolution Requirements** — 
   - Print: minimum 300 DPI
   - Large format: minimum 150 DPI
   - Web graphics are NOT print-ready
   Visual showing the difference.

5. **Color Profiles** —
   - Use CMYK color mode (not RGB)
   - Rich black: C60 M40 Y40 K100
   - Avoid: RGB colors, Pantone without conversion guidance
   Brief, clear explanation.

6. **Downloadable Templates** — Section with template download links (placeholder buttons):
   - Business card template
   - Flyer templates (various sizes)
   - Brochure templates
   - "Need a custom template? Contact us"

7. **Pre-flight Checklist** — Checklist component:
   □ File is PDF format
   □ Resolution is 300 DPI or higher
   □ Color mode is CMYK
   □ Bleed is 0.125" on all sides
   □ Fonts are embedded or outlined
   □ Images are high resolution
   □ No RGB or spot colors unintended

8. **CTA** — "Files ready? Get a quote!" + "Need help? Call us"

Create mock data in `/data/pages/file-guidelines.json`.
```

---

## Phase 2: Quote System + Remaining Pages (Week 3)

### Prompt 9 — Quote / RFQ System

```
Build the Request a Quote page at /quote. This is the primary conversion mechanism for Epoch Press.

It should be a multi-step form with progress indicator at the top.

**Step 1 — Select Product Type**
Show 7 product category cards (same as products page but smaller). User clicks to select. Cards: Newspapers, Magazines, Books, Marketing Print, Menus, Business Cards, Large Format. Also include an "Other / Not Sure" option.

The URL should support pre-selection: /quote?product=newspaper-printing should auto-select Newspapers.

**Step 2 — Project Specifications**
Dynamic form fields that change based on selected product. Examples:

For Newspapers:
- Format: Broadsheet / Tabloid (radio)
- Page count: number input
- Paper stock: dropdown (Newsprint 30# / Improved 35# / Premium 40#)
- Color: Full Color / Black & White / Spot Color (radio)
- Quantity: number input
- Frequency: One-time / Weekly / Monthly / Other (radio)
- Desired turnaround: dropdown

For Business Cards:
- Quantity: 250 / 500 / 1000 / 2500 / Custom (radio + custom input)
- Paper stock: Standard 14pt / Premium 16pt / Ultra 32pt (radio)
- Finish: Matte / Gloss / Silk / Uncoated (radio)
- Special effects: None / Foil / Emboss / Spot UV / Raised (checkboxes)
- Sides: Single / Double (radio)
- Turnaround: Standard 5-7 days / Rush 2-3 days (radio)

For "Other / Not Sure": just a text area for project description.

Store spec field configurations in a JSON config so they can be updated per product.

**Step 3 — File Upload (Optional)**
- Drag-and-drop zone with file type validation
- Accept: PDF, AI, INDD, PSD, TIFF, ZIP
- Show file name + size after upload
- Max file size: 100MB per file, up to 5 files
- Brief inline note about file guidelines with link to /file-guidelines
- "Skip — I'll send files later" option

**Step 4 — Contact Information & Submit**
- Name (required)
- Company name (optional)
- Email (required, validated)
- Phone (required)
- Project deadline / needed by date (date picker)
- Special instructions (textarea)
- Submit button

On submit:
- Show confirmation screen with summary of selections
- For now, console.log the form data (backend wiring comes later)
- Confirmation message: "Thank you! We'll review your project details and get back to you within 24 hours."

Design: Clean, step-by-step flow. Progress bar at top showing current step. Back/Next buttons. Mobile-friendly. Each step should feel lightweight, not overwhelming.

Create the spec field configurations in `/data/quote-config.json` so product-specific fields are data-driven, not hardcoded.
```

### Prompt 10 — Remaining 4 Product Detail Pages

```
Using the same product detail template we built in Prompt 4, create the remaining 4 product pages:

1. /products/marketing-print — covers flyers, brochures, postcards, posters, banners
   Specs: sizes (letter, tabloid, A4, custom), paper stocks, fold types (bi-fold, tri-fold, z-fold, gate-fold), coating options, quantity tiers
   
2. /products/menu-printing — covers restaurant dine-in, takeout, trifold, laminated
   Specs: sizes, lamination options (gloss, matte, soft-touch), fold types, paper durability, quantity tiers, rush options

3. /products/business-cards — covers standard, premium, luxury finishes
   Specs: standard vs premium vs ultra thick stock, finishes (matte/gloss/silk/uncoated), special effects (foil stamping, embossing, spot UV, raised ink, die-cut), sizes, rounded corners option

4. /products/large-format — covers banners, signage, trade show, wall graphics
   Specs: materials (vinyl, fabric, foam board, acrylic), sizes (standard banner sizes + custom), mounting options, indoor vs outdoor, grommets/poles/stands, durability ratings

Create mock JSON data files for each:
- `/data/pages/marketing-print.json`
- `/data/pages/menu-printing.json`
- `/data/pages/business-cards.json`
- `/data/pages/large-format.json`

Each should follow the same template structure: Hero → Specs → Price Guidance → Portfolio → Process → FAQ → CTA.

Make each page's FAQ section relevant to that specific product (4-6 questions each).
```

### Prompt 11 — FAQ Page

```
Build a comprehensive FAQ page at /faq.

Structure:
1. **Hero** — "Frequently Asked Questions" 
2. **Category Filter** — Tabs or buttons to filter by category:
   General | Ordering | File Prep | Pricing | Shipping | Products
3. **FAQ Accordion** — Grouped by category. Each question expands to show answer.

Include 20-25 questions across categories. Examples:

General:
- What types of printing do you offer?
- What areas do you serve?
- What are your business hours?

Ordering:
- How do I get a quote?
- What is your minimum order quantity?
- Can I see a proof before printing?
- How do I place a reorder?

File Preparation:
- What file formats do you accept?
- What resolution should my files be?
- Do you offer design services?

Pricing:
- How is printing priced?
- Do you offer volume discounts?
- Is there a rush fee?

Shipping:
- How long does standard shipping take?
- Do you offer local pickup?
- Can you ship nationwide?

Create mock data in `/data/pages/faq.json`.
Include a "Still have questions? Contact us" CTA at the bottom.
```

### Prompt 12 — Responsive Polish & Final Review

```
Do a comprehensive responsive and polish pass across ALL pages we've built:

1. **Mobile (< 768px)**:
   - Hamburger navigation works correctly
   - All grids collapse to single column
   - Quote form steps are comfortable on mobile
   - Product spec tables scroll horizontally or reformat
   - CTAs are thumb-friendly (min 44px tap targets)
   - Font sizes are readable
   - No horizontal overflow on any page

2. **Tablet (768px - 1024px)**:
   - 2-column grids where appropriate
   - Navigation works (could be hamburger or condensed)
   - Quote form is comfortable

3. **Desktop (1024px+)**:
   - Max content width of 1280px, centered
   - Generous whitespace maintained
   - Hover states on all interactive elements

4. **Cross-page consistency**:
   - Same header/footer on every page
   - Consistent spacing between sections
   - Consistent heading sizes and styles
   - All CTAs use the same button styles
   - Color usage is consistent (navy primary, gold accent)

5. **Performance**:
   - Images use next/image with proper sizing
   - Lazy loading for below-fold content
   - No unnecessary JS bundles

6. **Accessibility basics**:
   - All images have alt text
   - Form fields have labels
   - Color contrast meets WCAG AA
   - Focus states on interactive elements
   - Semantic HTML (nav, main, section, article, footer)

Fix any issues found across all pages.
```

---

## Tips for Working with Cursor

1. **One prompt = one conversation.** Don't pile up. Each prompt above is its own Cursor Agent session.

2. **Use @ references.** Always include `@PRINTING_SYSTEM_IMPLEMENTATION_PLAN.md` so Cursor has the full context. Also reference existing files: `@components/Header.tsx` when working on navigation, etc.

3. **Review before moving on.** Run the dev server and visually check each page before moving to the next prompt. Fix issues in the same conversation before starting a new one.

4. **If Cursor makes 8 files at once**, use the Review button to check each file. Keep what's good, undo what's wrong, then refine in the same conversation.

5. **For the quote form (Prompt 9)**, this is the most complex component. If Cursor struggles with all 4 steps in one prompt, break it into two: Steps 1-2 first, then Steps 3-4.

6. **Save working state.** After each successful prompt, commit to git. This gives you rollback points if a later prompt breaks something.
