import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Phone, CheckCircle, ChevronDown, Clock } from 'lucide-react';
import blogData from '@/data/blog.json';
import { loadPageContent, getRequestSiteId, loadAllItems } from '@/lib/content';
import { resolveRenderableImageUrl } from '@/lib/renderableImage';
import fs from 'fs';
import path from 'path';

const productFiles: Record<string, () => Promise<{ default: ProductData }>> = {
  'newspaper-printing': () => import('@/data/pages/newspaper-printing.json'),
  'magazine-printing': () => import('@/data/pages/magazine-printing.json'),
  'book-printing': () => import('@/data/pages/book-printing.json'),
  'calendar-printing': () => import('@/data/pages/calendar-printing.json'),
  'marketing-print': () => import('@/data/pages/marketing-print.json'),
  'menu-printing': () => import('@/data/pages/menu-printing.json'),
  'business-cards': () => import('@/data/pages/business-cards.json'),
  'large-format': () => import('@/data/pages/large-format.json'),
};

interface SpecTab {
  tab: string;
  items: { label: string; value: string; pdfHref?: string }[];
}

interface ProductHero {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  backgroundImage?: string;
  headline?: string;
  subheadline?: string;
  variants?: string[];
  variant?: string;
}

interface ProductData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  detailSheet?: {
    text: string;
    href: string;
  };
  rulesNotes?: string[];
  image?: string;
  backgroundImage?: string;
  hero?: ProductHero;
  pageHero?: ProductHero;
  heroSection?: ProductHero;
  specs: SpecTab[];
  priceTiers: { qty: string; note: string }[];
  process: { step: number; title: string; desc: string }[];
  faq: { q: string; a: string }[];
  cta: {
    headline: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
  };
}

function resolveDetailSheet(detailSheet?: ProductData['detailSheet']) {
  if (!detailSheet?.href) return detailSheet;

  const href = String(detailSheet.href);
  if (!/\.xlsx$/i.test(href)) {
    return detailSheet;
  }

  const pdfHref = href.replace(/\.xlsx$/i, '.pdf');
  const pdfPath = path.join(process.cwd(), 'public', pdfHref.replace(/^\//, ''));
  if (!fs.existsSync(pdfPath)) {
    return detailSheet;
  }

  return {
    href: pdfHref,
    text: 'View Full Spec Sheet (PDF)',
  };
}

const productHeroFallbackImages: Record<string, string> = {
  'newspaper-printing':
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1800&q=80',
  'magazine-printing':
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1800&q=80',
  'book-printing':
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1800&q=80',
  'calendar-printing':
    'https://images.unsplash.com/photo-1506784693919-ef06d93c28d2?auto=format&fit=crop&w=1800&q=80',
  'marketing-print':
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80',
  'menu-printing':
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80',
  'business-cards':
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1800&q=80',
  'large-format':
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1800&q=80',
};

const blogPreviewImages: Record<string, string> = {
  'offset-vs-digital-printing-2025':
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80',
  'preparing-files-for-newspaper-printing':
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  'magazine-cover-design-trends-2026':
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80',
  'metro-daily-herald-case-study':
    'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=1200&q=80',
  'restaurant-menu-printing-guide':
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  'fsc-certified-paper-printing':
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
};

type BlogPost = (typeof blogData.posts)[number] & {
  relatedProducts?: string[];
  image?: string;
  coverImage?: string;
  featuredImage?: string;
  heroImage?: string;
  cover?: string;
  thumbnail?: string;
  imageUrl?: string;
  contentMarkdown?: string;
};

function resolvePostImage(post: Record<string, unknown>): string | null {
  const candidates = [
    post.image,
    post.coverImage,
    post.featuredImage,
    post.heroImage,
    post.cover,
    post.thumbnail,
    post.imageUrl,
    blogPreviewImages[String(post.slug || '')],
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }
  return null;
}

function resolveRenderableBlogImage(post: Record<string, unknown>): string | null {
  const resolved = resolvePostImage(post);
  if (!resolved) return null;
  if (!resolved.startsWith('/uploads/')) return resolved;

  const localPath = path.join(process.cwd(), 'public', resolved.replace(/^\//, ''));
  return fs.existsSync(localPath) ? resolved : blogPreviewImages[String(post.slug || '')] || null;
}

function getRelatedProductSlugs(post: Record<string, unknown>): string[] {
  if (!Array.isArray(post.relatedProducts)) return [];
  return Array.from(
    new Set(
      post.relatedProducts
        .map((item: unknown) =>
          typeof item === 'string'
            ? item.trim()
            : typeof (item as { slug?: unknown })?.slug === 'string'
              ? ((item as { slug: string }).slug || '').trim()
              : ''
        )
        .filter((slug): slug is string => Boolean(slug))
    )
  );
}

export async function generateStaticParams() {
  return Object.keys(productFiles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const loader = productFiles[params.slug];
  if (!loader) return { title: 'Product Not Found' };
  const { default: data } = await loader();
  return {
    title: data.name,
    description: data.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const loader = productFiles[params.slug];
  if (!loader) notFound();
  const { default: fallbackProduct } = await loader();
  // Try DB first, fall back to local JSON
  const siteId = await getRequestSiteId();
  const [dbProduct, dbPosts] = await Promise.all([
    loadPageContent<ProductData>(params.slug, 'en', siteId),
    loadAllItems<BlogPost>(siteId, 'en', 'blog'),
  ]);
  const product = dbProduct ?? fallbackProduct;
  const blogPosts = dbPosts.length > 0 ? dbPosts : (blogData.posts as BlogPost[]);
  const relatedArticles = blogPosts
    .filter((post) =>
      getRelatedProductSlugs(post as unknown as Record<string, unknown>).includes(params.slug)
    )
    .sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''))
    .slice(0, 6);
  const detailSheet = resolveDetailSheet(product.detailSheet);
  const heroBlock: ProductHero = product.pageHero || product.heroSection || product.hero || {};
  const heroTitle = heroBlock.title || heroBlock.headline || product.name;
  const heroSubtitle = heroBlock.subtitle || heroBlock.subheadline || product.tagline;
  const heroDescription = heroBlock.description || product.description;
  const heroBackgroundImage =
    resolveRenderableImageUrl(heroBlock.backgroundImage) ||
    resolveRenderableImageUrl(product.backgroundImage) ||
    null;
  const heroImage =
    resolveRenderableImageUrl(heroBlock.image) ||
    resolveRenderableImageUrl(product.image) ||
    productHeroFallbackImages[product.slug] ||
    null;
  const heroVariant =
    heroBlock.variant ||
    (Array.isArray(heroBlock.variants) && heroBlock.variants.length > 0
      ? heroBlock.variants[0]
      : '') ||
    'split-photo-right';
  const isSplitLeft = heroVariant === 'split-photo-left';
  const isCenteredVariant = heroVariant === 'centered';
  const useBackgroundOnlyVariant =
    heroVariant === 'photo-background' ||
    heroVariant === 'gallery-background' ||
    heroVariant === 'video-background';
  const showSideImage = Boolean(heroImage) && !isCenteredVariant && !useBackgroundOnlyVariant;
  const hasHeroMedia = Boolean(heroBackgroundImage || heroImage);

  return (
    <>
      {/* Hero */}
      <section
        className={`relative pt-36 md:pt-40 pb-16 overflow-hidden ${
          hasHeroMedia ? 'bg-[var(--navy)]' : 'bg-navy-gradient'
        }`}
      >
        {heroBackgroundImage && (
          <>
            <img
              src={heroBackgroundImage}
              alt={`${product.name} background`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[var(--navy)]/70" />
          </>
        )}

        <div className="container-content relative z-10">
          <div
            className={
              showSideImage
                ? 'grid gap-8 lg:grid-cols-2 items-center'
                : isCenteredVariant || useBackgroundOnlyVariant
                  ? 'max-w-4xl mx-auto text-center'
                  : 'max-w-3xl'
            }
          >
            <div className={showSideImage && isSplitLeft ? 'lg:order-2' : ''}>
              <Link href="/products" className="inline-flex items-center gap-1 text-blue-300 text-sm hover:text-white transition-colors mb-6">
                ← All Products
              </Link>
              <h1 className="font-serif text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {heroTitle}
              </h1>
              <p className="text-[var(--gold-light)] text-lg font-medium mb-4">{heroSubtitle}</p>
              <p className="text-blue-200 leading-relaxed mb-8 max-w-2xl">{heroDescription}</p>
              <div
                className={`flex flex-col sm:flex-row gap-4 ${
                  isCenteredVariant || useBackgroundOnlyVariant ? 'justify-center' : ''
                }`}
              >
                <Link href={product.cta.primaryCta.href} className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
                  {product.cta.primaryCta.text} <ArrowRight className="w-4 h-4" />
                </Link>
                <a href={product.cta.secondaryCta.href} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:border-white/60 transition-all">
                  <Phone className="w-4 h-4 text-[var(--gold-light)]" /> {product.cta.secondaryCta.text}
                </a>
              </div>
              {detailSheet?.href && detailSheet?.text && (
                <div className="mt-4">
                  <Link
                    href={detailSheet.href}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold-light)] hover:text-white transition-colors"
                  >
                    {detailSheet.text} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
            {showSideImage && (
              <div className={`relative w-full overflow-hidden rounded-2xl border border-white/20 ${isSplitLeft ? 'lg:order-1' : ''}`}>
                <img
                  src={heroImage || undefined}
                  alt={heroTitle || product.name || 'Product image'}
                  className="block w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Specs Block */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <h2 className="font-serif text-[var(--navy)] mb-8" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            Product Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.specs.map((spec) => (
              <div key={spec.tab} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
                <h3 className="font-serif font-semibold text-[var(--navy)] text-base mb-4 pb-3 border-b border-[var(--border)]">
                  {spec.tab}
                </h3>
                <ul className="space-y-3">
                  {spec.items.map((item) => (
                    <li key={item.label} className="flex gap-3">
                      <CheckCircle className="w-4 h-4 text-[var(--gold)] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-[var(--navy)]">{item.label}:</span>{' '}
                        <span className="text-sm text-[var(--text-secondary)]">{item.value}</span>
                        {spec.tab === 'Product Types' && item.pdfHref && (
                          <span className="ml-3 inline-block">
                            <Link
                              href={item.pdfHref}
                              target="_blank"
                              className="inline-flex items-center rounded-md border border-[var(--gold)] bg-[var(--gold-50)] px-3 py-1 text-xs font-semibold text-[var(--navy)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--gold)] hover:text-white"
                            >
                              View PDF File
                            </Link>
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {detailSheet?.href && detailSheet?.text && (
            <div className="mt-8 flex justify-center">
              <Link
                href={detailSheet.href}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold)] bg-white px-6 py-3 text-sm font-semibold text-[var(--navy)] shadow-sm transition-colors hover:bg-[var(--gold-50)]"
              >
                {detailSheet.text} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Price Guidance */}
      <section className="section-padding-sm bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-[var(--navy)] mb-3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
              Pricing Guidance
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Every project is unique. Get an exact quote for your specifications.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {product.priceTiers.map((tier, index) => (
                <div key={index} className="bg-white rounded-xl border border-[var(--border)] p-5 shadow-card text-center">
                  <div className="font-serif font-bold text-[var(--navy)] text-lg mb-1">{tier.qty}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{tier.note}</div>
                </div>
              ))}
            </div>
            <div className="bg-[var(--gold-50)] border border-[var(--gold)] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[var(--navy)] mb-1">Need an exact price?</p>
                <p className="text-sm text-[var(--text-secondary)]">We'll review your specs and respond within 24 hours.</p>
              </div>
              <Link href={product.cta.primaryCta.href} className="flex-shrink-0 bg-gold-gradient text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-gold text-sm">
                Request a Quote →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-white">
        <div className="container-content max-w-4xl mx-auto">
          <h2 className="font-serif text-[var(--navy)] mb-8" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            Production Process
          </h2>
          <div className="space-y-4">
            {product.process.map((step) => (
              <div key={step.step} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-navy-gradient flex items-center justify-center flex-shrink-0">
                  <span className="font-serif font-bold text-[var(--gold-light)] text-sm">{step.step}</span>
                </div>
                <div className="bg-[var(--surface)] rounded-xl p-5 flex-1 border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--navy)] mb-1">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {relatedArticles.length > 0 && (
        <section className="section-padding-sm bg-white border-t border-[var(--border)]">
          <div className="container-content">
            <h2 className="font-serif text-[var(--navy)] mb-6" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)' }}>
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] w-full shrink-0 bg-[var(--surface)] overflow-hidden">
                    {resolveRenderableBlogImage(article as unknown as Record<string, unknown>) ? (
                      <img
                        src={resolveRenderableBlogImage(
                          article as unknown as Record<string, unknown>
                        ) as string}
                        alt={article.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-navy-gradient" />
                    )}
                  </div>
                  <div className="p-4 flex-1">
                    <div className="font-serif text-[var(--navy)] text-lg leading-snug group-hover:text-[var(--gold)] transition-colors">
                      {article.title}
                    </div>
                    <div className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-3">
                      {article.excerpt}
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime || '5 min read'}
                      </span>
                      <span>
                        {article.publishDate
                          ? new Date(article.publishDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="container-content max-w-3xl mx-auto">
          <h2 className="font-serif text-[var(--navy)] mb-8" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {product.faq.map((item, index) => (
              <details key={index} className="group bg-white rounded-xl border border-[var(--border)] overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[var(--navy)] hover:text-[var(--gold)] transition-colors list-none">
                  {item.q}
                  <ChevronDown className="w-5 h-5 flex-shrink-0 group-open:rotate-180 transition-transform text-[var(--text-secondary)]" />
                </summary>
                <div className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-gradient py-16">
        <div className="container-content text-center">
          <h2 className="font-serif text-white mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            {product.cta.headline}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={product.cta.primaryCta.href} className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
              {product.cta.primaryCta.text} <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={product.cta.secondaryCta.href} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:border-white/60 transition-all">
              <Phone className="w-5 h-5 text-[var(--gold-light)]" /> {product.cta.secondaryCta.text}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
