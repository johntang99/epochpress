# Epoch Press


lsof -ti:3010 | xargs kill -9
rm -rf .next
npm run dev

npm install
npm run build

git add .
git commit -m "Update: describe your changes"
git push


curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_8fXhdR9AePN4VgAiqsDwZjxnPw1Y/odb8Ikwerb



> Full-service commercial printing platform built with Next.js 14 App Router, Supabase, and Tailwind CSS.

**Live site:** https://epochpress.vercel.app  
**Admin:** https://epochpress.vercel.app/admin  
**GitHub:** https://github.com/johntang99/epochpress

---

## Overview

Epoch Press is a standalone printing business platform built as part of the BAAM multi-industry system (System C — Printing). It combines a premium public-facing frontend with a full CMS admin backend. Content is DB-first (Supabase) with local file fallback for development.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS with custom design system |
| Database | Supabase (PostgreSQL) |
| Auth | JWT cookies (custom, no Supabase Auth) |
| Email | Resend |
| Deployment | Vercel |
| Fonts | Playfair Display (headings) + Inter (body) |

---

## Design System

| Token | Value |
|-------|-------|
| Primary (navy) | `#0F1B2D` |
| Secondary (gold) | `#B8860B` |
| Gold light | `#D4A843` |
| Surface | `#F8F9FA` |
| Text primary | `#1A1A2E` |
| Text secondary | `#5A6977` |
| Border | `#E2E8F0` |

---

## Project Structure

```
epoch-press/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout — header, footer, theme CSS vars
│   ├── page.tsx                # Home page
│   ├── about/                  # About / Facility
│   ├── blog/
│   │   ├── page.tsx            # Blog listing (filterable by category)
│   │   └── [slug]/             # Blog article detail
│   ├── contact/                # Contact page + form
│   ├── faq/                    # FAQ accordion grouped by category
│   ├── file-guidelines/        # File prep guide (formats, bleed, DPI, CMYK)
│   ├── portfolio/              # Portfolio gallery (filterable)
│   ├── products/
│   │   ├── page.tsx            # Products hub (all 7 categories)
│   │   └── [slug]/             # Product detail pages (dynamic)
│   ├── quote/                  # Multi-step RFQ quote form
│   └── admin/                  # Admin dashboard (see below)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky nav, Products dropdown, mobile drawer
│   │   └── Footer.tsx          # Multi-column footer with contact info
│   ├── admin/                  # All admin UI components
│   └── ui/                     # Shared UI: Button, Input, Badge, Card, etc.
│
├── lib/
│   ├── content.ts              # DB-first content loader (Supabase → file fallback)
│   ├── contentDb.ts            # Supabase content_entries adapters
│   ├── sites.ts                # Multi-site management utilities
│   ├── sitesDb.ts              # Supabase sites table adapters
│   ├── siteDomainsDb.ts        # Domain alias adapters (prod/dev per site)
│   ├── supabase/server.ts      # Supabase client (env-aware: dev/staging/prod)
│   ├── types.ts                # TypeScript types for all content schemas
│   ├── admin/
│   │   ├── auth.ts             # JWT auth, login, session management
│   │   ├── audit.ts            # Admin audit log writer
│   │   ├── permissions.ts      # RBAC: super_admin, site_admin, editor
│   │   ├── usersDb.ts          # Admin user table adapters
│   │   ├── media.ts            # Media library helpers
│   │   ├── mediaDb.ts          # media_assets table adapters
│   │   ├── content.ts          # Content file helpers
│   │   └── templates.ts        # Content template definitions
│   ├── booking/                # Booking engine (appointment/order system)
│   │   ├── db.ts               # Supabase booking adapters
│   │   ├── storage.ts          # DB-first booking storage
│   │   ├── availability.ts     # Slot generation logic
│   │   └── email.ts            # Booking email notifications (Resend)
│   ├── footer.ts               # Default footer content generator
│   ├── i18n.ts                 # Locale config (en primary)
│   ├── seo.ts                  # SEO utilities and metadata helpers
│   ├── siteInfo.ts             # Site display name resolution
│   ├── section-variants.ts     # Layout variant definitions
│   └── utils.ts                # General utilities (cn, formatDate, slugify)
│
├── data/                       # Local JSON fallbacks (used when DB unavailable)
│   ├── home.json
│   ├── products.json
│   ├── portfolio.json
│   ├── blog.json
│   ├── quote-config.json       # Per-product RFQ form field definitions
│   └── pages/
│       ├── newspaper-printing.json
│       ├── magazine-printing.json
│       ├── book-printing.json
│       ├── marketing-print.json
│       ├── menu-printing.json
│       ├── business-cards.json
│       └── large-format.json
│
├── content/                    # Authoritative content files (imported to DB)
│   ├── _sites.json             # Site registry (id, name, domain, locales)
│   ├── _site-domains.json      # Domain alias map (prod/dev per site)
│   ├── _admin/
│   │   └── users.json          # Admin user seed (excluded from git)
│   └── epoch-press/
│       ├── theme.json          # Color palette + typography scale
│       └── en/
│           ├── site.json       # NAP: name, address, phone, email
│           ├── header.json     # Nav logo, menu items, topbar, CTA
│           ├── footer.json     # Footer columns, contact, copyright
│           ├── navigation.json # Main nav structure with children
│           ├── seo.json        # Default meta title, description, OG
│           ├── pages/
│           │   ├── home.json             # Home page sections + content
│           │   ├── products.json         # Products hub page
│           │   ├── newspaper-printing.json
│           │   ├── magazine-printing.json
│           │   ├── book-printing.json
│           │   ├── marketing-print.json
│           │   ├── menu-printing.json
│           │   ├── business-cards.json
│           │   ├── large-format.json
│           │   ├── about.json
│           │   ├── portfolio.json
│           │   └── quote-config.json
│           └── blog/
│               ├── offset-vs-digital-printing-2025.json
│               ├── preparing-files-for-newspaper-printing.json
│               ├── magazine-cover-design-trends-2026.json
│               ├── restaurant-menu-printing-guide.json
│               ├── metro-daily-herald-case-study.json
│               └── fsc-certified-paper-printing.json
│
├── supabase/
│   ├── admin-schema.sql        # All table definitions (run first)
│   └── rls.sql                 # Row-level security policies (run second)
│
├── middleware.ts               # Admin auth gate — redirects to /admin/login
├── tailwind.config.ts          # Tailwind + custom tokens
├── next.config.js              # Next.js config
├── .env.local.example          # Environment variable template
└── package.json
```

---

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, product category grid, trust stats, portfolio preview, process steps, CTA |
| `/products` | Products Hub | All 7 product categories in a card grid |
| `/products/newspaper-printing` | Product Detail | Specs, price tiers, process, FAQ, CTA |
| `/products/magazine-printing` | Product Detail | Same template, different content |
| `/products/book-printing` | Product Detail | Same template, different content |
| `/products/marketing-print` | Product Detail | Same template, different content |
| `/products/menu-printing` | Product Detail | Same template, different content |
| `/products/business-cards` | Product Detail | Same template, different content |
| `/products/large-format` | Product Detail | Same template, different content |
| `/about` | About / Facility | Company story, equipment showcase, certifications |
| `/portfolio` | Portfolio | Filterable project gallery (client-side filter) |
| `/blog` | Blog Listing | Filterable by category (articles + videos) |
| `/blog/[slug]` | Blog Article | Article detail, related posts, tags |
| `/contact` | Contact | Split form + contact info cards |
| `/file-guidelines` | File Guidelines | Formats, bleed, DPI, CMYK, pre-flight checklist |
| `/faq` | FAQ | Grouped accordion with 20+ questions |
| `/quote` | Request a Quote | 4-step RFQ: product → specs → file upload → contact |

---

## Content Loading Architecture

Content is loaded **DB-first** with local file fallback:

```
Request comes in
       ↓
SUPABASE_SERVICE_ROLE_KEY present?
       ↓ yes                   ↓ no
Fetch from                Use local
content_entries            /content/
(Supabase DB)             JSON files
       ↓                       ↓
       └──────── merge ─────────┘
                  ↓
          Render page
```

The loader in `lib/content.ts` handles:
- `loadPageContent(slug, locale, siteId)` — single page
- `loadAllItems(siteId, locale, directory)` — collections (blog posts)
- `loadTheme(siteId)` — CSS variable injection
- `loadSeo(siteId, locale)` — metadata generation

---

## Admin Dashboard

Access: `/admin` — requires login via JWT cookie.

Default credentials (file fallback, no DB):
- Email: `admin@epochpress.com`
- Password: `password`

### Admin Sections

| Section | Route | Purpose |
|---------|-------|---------|
| Dashboard | `/admin` | Overview and quick links |
| Sites | `/admin/sites` | Manage sites, create, edit domain aliases |
| Site Settings | `/admin/site-settings` | Edit header, footer, nav, SEO, theme, site info |
| Content | `/admin/content` | Edit all page JSON files (Form + JSON dual mode) |
| Blog Posts | `/admin/blog-posts` | Create and edit blog articles |
| Bookings | `/admin/bookings` | View and manage booking records |
| Booking Settings | `/admin/booking-settings` | Configure services, hours, capacity |
| Media | `/admin/media` | Upload and organize media assets |
| Users | `/admin/users` | Manage admin users and roles |
| Settings | `/admin/settings` | Account settings and password change |

### Admin Content Editor

The `ContentEditor` component supports:
- **Form mode** — structured field-by-field editing
- **JSON mode** — direct raw JSON editing
- **Import JSON** — seed missing DB entries from local files
- **Export JSON** — sync DB content back to local files
- **Overwrite import** — force-update DB from local files
- **Revision history** — previous versions stored in `content_revisions`

### RBAC Roles

| Role | Permissions |
|------|------------|
| `super_admin` | Full access to all sites and admin functions |
| `site_admin` | Manage content, media, bookings for assigned sites |
| `editor` | Edit content and media only |

---

## Database Schema

Tables in Supabase (`supabase/admin-schema.sql`):

| Table | Purpose |
|-------|---------|
| `sites` | Site registry (id, name, domain, locales) |
| `site_domains` | Domain aliases per site per environment (prod/dev) |
| `admin_users` | Admin accounts with hashed passwords and RBAC roles |
| `content_entries` | All JSON page/settings content (site_id, locale, path, data) |
| `content_revisions` | Historical versions of content entries |
| `media_assets` | Media library records (site_id, path, url) |
| `booking_services` | Configurable service catalog per site |
| `booking_settings` | Business hours, capacity, notification config |
| `bookings` | Individual booking records |
| `admin_audit_logs` | Audit trail for all sensitive admin actions |

All tables have RLS enabled with deny-public policies. Access is via service role key only.

---

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Purpose |
|----------|---------|
| `APP_ENV` | Runtime environment: `dev`, `staging`, or `prod` |
| `NEXT_PUBLIC_APP_ENV` | Same, exposed to client |
| `NEXT_PUBLIC_DEFAULT_SITE` | Default site ID for localhost (`epoch-press`) |
| `SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Same, exposed to client |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key for DB-first mode |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket for media (`media` recommended) |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | Optional client-side bucket identifier |
| `JWT_SECRET` | Admin session signing key |
| `RESEND_API_KEY` | Email delivery (resend.com) |
| `RESEND_FROM` | From address for contact/notification emails |
| `CONTACT_FALLBACK_TO` | Email address for contact form submissions |
| `UNSPLASH_ACCESS_KEY` | Optional Unsplash search/import key |
| `PEXELS_API_KEY` | Optional Pexels search/import key |

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (port 3010)
npm run dev

# Type check
npm run type-check

# Production build
npm run build

# Run all CI checks
npm run ci:check

# Dry-run media migration to Supabase Storage
npm run media:migrate -- --sites epoch-press --dry-run

# Dry-run content image URL normalization
npm run content:normalize-media-urls -- --sites epoch-press --dry-run
```

### First-time DB bootstrap

After creating a new Supabase project and filling in `.env.local`:

1. Run `supabase/admin-schema.sql` in Supabase SQL editor
2. Run the content tables SQL (see docs)
3. Run `supabase/rls.sql`
4. Start dev server
5. `curl -X POST http://localhost:3010/api/admin/sites/import`
6. `curl -X POST http://localhost:3010/api/admin/users/import`
7. Open `localhost:3010/admin` and log in
8. In admin → Site Settings → Import JSON
9. In admin → Content → Import JSON
10. In admin → Blog Posts → Import JSON

### Local domain routing (optional)

To test with a local domain instead of `localhost`:

```
# Add to /etc/hosts
127.0.0.1 epochpress.local
```

```bash
# Flush DNS cache
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

Then open `http://epochpress.local:3010`.

---

## Deployment

Deployed to Vercel. On each push to `main`, Vercel rebuilds and deploys automatically.

Required Vercel environment variables (set in Vercel project settings):
- All variables from `.env.local.example`
- Set `APP_ENV=prod` and `NEXT_PUBLIC_APP_ENV=prod`

---

## Content Management Workflow

### Edit existing content
1. Open `/admin/site-settings` or `/admin/content`
2. Select site and locale
3. Edit in Form mode or JSON mode
4. Save — changes write to `content_entries` in DB immediately
5. Reload frontend to see changes

### Add a new blog post
1. Open `/admin/blog-posts`
2. Click New Post
3. Fill in title, excerpt, content, category, publish date
4. Save — auto-appears in blog listing

### Change theme colors or typography
1. Open `/admin/site-settings` → Theme
2. Adjust color values or font settings
3. Save — CSS variables are injected at runtime from `theme.json`

### Add a new product page
1. Create `content/epoch-press/en/pages/<slug>.json`
2. In admin → Content → Import JSON (missing mode)
3. The product detail page (`/products/[slug]`) renders it automatically

---

## System Classification

Epoch Press is **System C** in the BAAM multi-industry platform:

| System | Industry | Repo |
|--------|----------|------|
| System A | Chinese Medicine (TCM) | medical-clinic/chinese-medicine |
| **System C** | **Printing** | **epochpress (this repo)** |
| System B | Restaurant | Planned |
| System D | Home/Office Decor | Planned |

Each system is a fully standalone Next.js + Supabase deployment sharing the same admin architecture pattern.
