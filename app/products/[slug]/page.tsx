import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Phone, CheckCircle, ChevronDown } from 'lucide-react';
import { loadPageContent, getRequestSiteId } from '@/lib/content';

const productFiles: Record<string, () => Promise<{ default: ProductData }>> = {
  'newspaper-printing': () => import('@/data/pages/newspaper-printing.json'),
  'magazine-printing': () => import('@/data/pages/magazine-printing.json'),
  'book-printing': () => import('@/data/pages/book-printing.json'),
  'marketing-print': () => import('@/data/pages/marketing-print.json'),
  'menu-printing': () => import('@/data/pages/menu-printing.json'),
  'business-cards': () => import('@/data/pages/business-cards.json'),
  'large-format': () => import('@/data/pages/large-format.json'),
};

interface SpecTab {
  tab: string;
  items: { label: string; value: string }[];
}

interface ProductData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image?: string;
  backgroundImage?: string;
  hero?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    backgroundImage?: string;
  };
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

const productHeroFallbackImages: Record<string, string> = {
  'newspaper-printing':
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1800&q=80',
  'magazine-printing':
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1800&q=80',
  'book-printing':
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1800&q=80',
  'marketing-print':
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80',
  'menu-printing':
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80',
  'business-cards':
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1800&q=80',
  'large-format':
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1800&q=80',
};

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
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
  const dbProduct = await loadPageContent<ProductData>(params.slug, 'en', siteId);
  const product = dbProduct ?? fallbackProduct;
  const heroTitle = product.hero?.title || product.name;
  const heroSubtitle = product.hero?.subtitle || product.tagline;
  const heroDescription = product.hero?.description || product.description;
  const heroBackgroundImage =
    normalizeImageUrl(product.hero?.backgroundImage) ||
    normalizeImageUrl(product.backgroundImage) ||
    null;
  const heroImage =
    normalizeImageUrl(product.hero?.image) ||
    normalizeImageUrl(product.image) ||
    productHeroFallbackImages[product.slug] ||
    null;
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
          <div className={heroImage ? 'grid gap-8 lg:grid-cols-2 items-center' : 'max-w-3xl'}>
            <div>
              <Link href="/products" className="inline-flex items-center gap-1 text-blue-300 text-sm hover:text-white transition-colors mb-6">
                ← All Products
              </Link>
              <h1 className="font-serif text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {heroTitle}
              </h1>
              <p className="text-[var(--gold-light)] text-lg font-medium mb-4">{heroSubtitle}</p>
              <p className="text-blue-200 leading-relaxed mb-8 max-w-2xl">{heroDescription}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={product.cta.primaryCta.href} className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
                  {product.cta.primaryCta.text} <ArrowRight className="w-4 h-4" />
                </Link>
                <a href={product.cta.secondaryCta.href} className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:border-white/60 transition-all">
                  <Phone className="w-4 h-4 text-[var(--gold-light)]" /> {product.cta.secondaryCta.text}
                </a>
              </div>
            </div>
            {heroImage && (
              <div className="relative w-full overflow-hidden rounded-2xl border border-white/20">
                <img
                  src={heroImage}
                  alt={heroTitle}
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
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
