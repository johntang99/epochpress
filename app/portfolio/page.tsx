import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRequestSiteId, loadPageContent } from '@/lib/content';
import portfolioData from '@/data/portfolio.json';
import fs from 'fs';
import path from 'path';

type PortfolioData = typeof portfolioData & {
  hero?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    image?: string;
  };
  cta?: {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonHref?: string;
  };
  items: Array<
    (typeof portfolioData.items)[number] & {
      image?: string;
    }
  >;
};

const categoryColors: Record<string, string> = {
  Newspapers: 'bg-blue-100 text-blue-800',
  Magazines: 'bg-purple-100 text-purple-800',
  Books: 'bg-green-100 text-green-800',
  'Marketing Print': 'bg-orange-100 text-orange-800',
  Menus: 'bg-rose-100 text-rose-800',
  'Business Cards': 'bg-yellow-100 text-yellow-800',
  'Large Format': 'bg-teal-100 text-teal-800',
};

const categoryIcons: Record<string, string> = {
  Newspapers: '📰',
  Magazines: '📖',
  Books: '📚',
  'Marketing Print': '📄',
  Menus: '🍽️',
  'Business Cards': '💳',
  'Large Format': '🖼️',
};

const portfolioFallbackImages: Record<string, string> = {
  Newspapers:
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
  Magazines:
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1400&q=80',
  Books:
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80',
  'Marketing Print':
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80',
  Menus:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  'Business Cards':
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80',
  'Large Format':
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80',
};

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function resolveRenderableImage(item: { image?: string; category: string }): string | null {
  const image = normalizeImageUrl(item.image);
  if (image && !image.startsWith('/uploads/')) return image;
  if (image && image.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), 'public', image.replace(/^\//, ''));
    if (fs.existsSync(localPath)) return image;
  }
  return portfolioFallbackImages[item.category] || null;
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<PortfolioData>('portfolio', 'en', siteId);
  const data = dbContent ?? (portfolioData as PortfolioData);
  const active = searchParams?.category || 'All';
  const { items, categories } = data;
  const filtered = active === 'All' ? items : items.filter((i) => i.category === active);
  const heroBackgroundImage = normalizeImageUrl(data.hero?.backgroundImage);
  const heroImage = normalizeImageUrl(data.hero?.image);
  const hasHeroMedia = Boolean(heroBackgroundImage || heroImage);

  return (
    <>
      {/* Hero */}
      <section
        className={`relative pt-36 md:pt-40 pb-16 border-b border-[var(--border)] overflow-hidden ${
          hasHeroMedia ? 'bg-[var(--navy)]' : 'bg-[var(--surface)]'
        }`}
      >
        {heroBackgroundImage && (
          <>
            <img
              src={heroBackgroundImage}
              alt="Portfolio hero background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[var(--navy)]/70" />
          </>
        )}
        <div className="container-content relative z-10">
          <div className={heroImage ? 'grid gap-8 lg:grid-cols-2 items-center' : 'text-center'}>
            <div className={heroImage ? '' : 'max-w-2xl mx-auto'}>
              <h1
                className={`font-serif mb-4 ${hasHeroMedia ? 'text-white' : 'text-[var(--navy)]'}`}
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {data.hero?.title || 'Our Work'}
              </h1>
              <p
                className={`max-w-2xl text-lg mx-auto ${
                  hasHeroMedia ? 'text-blue-100' : 'text-[var(--text-secondary)]'
                }`}
              >
                {data.hero?.subtitle ||
                  "500+ clients served across every industry. Here's a sample of projects we're proud to have delivered."}
              </p>
            </div>
            {heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20">
                <img src={heroImage} alt={data.hero?.title || 'Portfolio hero'} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white py-6 border-b border-[var(--border)] sticky top-[72px] z-10">
        <div className="container-content">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/portfolio' : `/portfolio?category=${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active === cat
                    ? 'bg-[var(--navy)] text-white'
                    : 'bg-[var(--surface)] text-[var(--charcoal)] hover:bg-[var(--border)]'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-52">
                  {resolveRenderableImage(item) ? (
                    <img
                      src={resolveRenderableImage(item) as string}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)] flex items-center justify-center">
                      <span className="text-6xl opacity-20">{categoryIcons[item.category]}</span>
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-[var(--gold)] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${categoryColors[item.category] || 'bg-gray-100 text-gray-700'}`}>
                    {item.category}
                  </span>
                  <h3 className="font-serif font-semibold text-[var(--navy)] text-lg mb-1 group-hover:text-[var(--gold)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-3 font-medium">{item.client}</p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              No items found in this category.
            </div>
          )}
        </div>
      </section>

      {/* Stats + CTA */}
      <section className="bg-[var(--navy)] py-16">
        <div className="container-content text-center">
          <h2 className="font-serif text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            {data.cta?.title || "Let's create something great together."}
          </h2>
          <p className="text-blue-200 mb-8">
            {data.cta?.subtitle || "Tell us about your project and we'll provide a custom quote."}
          </p>
          <Link
            href={data.cta?.buttonHref || '/quote'}
            className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold"
          >
            {data.cta?.buttonText || 'Get a Quote'} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
