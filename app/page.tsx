import Link from 'next/link';
import { ArrowRight, Phone, CheckCircle, ChevronRight, Newspaper, BookOpen, BookMarked, FileText, UtensilsCrossed, CreditCard, MonitorPlay } from 'lucide-react';
import { loadAllItems, loadPageContent, getRequestSiteId } from '@/lib/content';
import homeDataFallback from '@/data/home.json';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import { resolveRenderableImageUrl } from '@/lib/renderableImage';

type HomeData = typeof homeDataFallback;
type BlogPreviewPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime?: string;
  publishDate?: string;
  image?: string;
  coverImage?: string;
  thumbnail?: string;
};

type PortfolioItem = {
  id?: string | number;
  title: string;
  category: string;
  desc: string;
  featured?: boolean;
  image?: string;
};

type PortfolioPageData = {
  items?: PortfolioItem[];
};

const categoryIcons: Record<string, { Icon: LucideIcon; color: string; bg: string }> = {
  'newspaper-printing':  { Icon: Newspaper,       color: 'text-blue-600',   bg: 'bg-blue-50'   },
  'magazine-printing':   { Icon: BookOpen,         color: 'text-purple-600', bg: 'bg-purple-50' },
  'book-printing':       { Icon: BookMarked,       color: 'text-green-600',  bg: 'bg-green-50'  },
  'marketing-print':     { Icon: FileText,         color: 'text-orange-600', bg: 'bg-orange-50' },
  'menu-printing':       { Icon: UtensilsCrossed,  color: 'text-rose-600',   bg: 'bg-rose-50'   },
  'business-cards':      { Icon: CreditCard,       color: 'text-yellow-700', bg: 'bg-yellow-50' },
  'large-format':        { Icon: MonitorPlay,      color: 'text-teal-600',   bg: 'bg-teal-50'   },
};

const serviceImages: Record<string, string> = {
  'newspaper-printing': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
  'magazine-printing': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80',
  'book-printing': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80',
  'marketing-print': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80',
  'menu-printing': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  'business-cards': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80',
  'large-format': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80',
};

const blogPreviewImages: Record<string, string> = {
  'offset-vs-digital-printing-2025': 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80',
  'preparing-files-for-newspaper-printing': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  'magazine-cover-design-trends-2026': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80',
  'metro-daily-herald-case-study': 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=1200&q=80',
  'restaurant-menu-printing-guide': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  'fsc-certified-paper-printing': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
};

const portfolioCategoryFallbackImages: Record<string, string> = {
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

function toCategoryLabel(value: string): string {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function resolveRenderableBlogImage(post: BlogPreviewPost): string {
  const candidate = normalizeImageUrl(post.image) || normalizeImageUrl(post.coverImage) || normalizeImageUrl(post.thumbnail);
  if (candidate && !candidate.startsWith('/uploads/')) {
    return candidate;
  }
  if (candidate && candidate.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), 'public', candidate.replace(/^\//, ''));
    if (fs.existsSync(localPath)) {
      return candidate;
    }
  }
  return blogPreviewImages[post.slug] || serviceImages['marketing-print'];
}

function resolveRenderablePortfolioImage(item: PortfolioItem): string {
  const candidate = normalizeImageUrl(item.image);
  if (candidate && !candidate.startsWith('/uploads/')) {
    return candidate;
  }
  if (candidate && candidate.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), 'public', candidate.replace(/^\//, ''));
    if (fs.existsSync(localPath)) {
      return candidate;
    }
  }
  return portfolioCategoryFallbackImages[item.category] || serviceImages['marketing-print'];
}

export default async function HomePage() {
  const siteId = await getRequestSiteId();
  const [dbContent, blogItems, portfolioPage] = await Promise.all([
    loadPageContent<HomeData>('home', 'en', siteId),
    loadAllItems<BlogPreviewPost>(siteId, 'en', 'blog'),
    loadPageContent<PortfolioPageData>('portfolio', 'en', siteId),
  ]);
  const { hero, categories, servicesSection, whyChooseUs, stats, portfolio, process, blogPreview, cta } = dbContent ?? homeDataFallback;
  const heroBackgroundImage = resolveRenderableImageUrl(
    (hero as Record<string, unknown>)?.backgroundImage
  );
  const heroImage = resolveRenderableImageUrl((hero as Record<string, unknown>)?.image);
  const hasHeroMedia = Boolean(heroBackgroundImage || heroImage);
  const featuredServiceSlug = servicesSection?.featuredSlug || categories?.[0]?.slug;
  const featuredService = categories.find((cat) => cat.slug === featuredServiceSlug) || categories[0];
  const secondaryServices = categories.filter((cat) => cat.slug !== featuredService?.slug);
  const featuredBlogPosts = [...blogItems]
    .sort((a, b) => {
      const aTime = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const bTime = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);
  const portfolioPageItems = Array.isArray(portfolioPage?.items) ? portfolioPage.items : [];
  const featuredPortfolioItems =
    portfolioPageItems.filter((item) => item.featured).slice(0, 4).length > 0
      ? portfolioPageItems.filter((item) => item.featured).slice(0, 4)
      : portfolioPageItems.slice(0, 4);
  const homePortfolioItems = Array.isArray(portfolio) ? portfolio : [];
  const displayedPortfolioItems =
    featuredPortfolioItems.length > 0 ? featuredPortfolioItems : homePortfolioItems;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-gradient min-h-[90vh] flex items-center overflow-hidden pt-20">
        {heroBackgroundImage ? (
          <>
            <img
              src={heroBackgroundImage}
              alt="Home hero background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[var(--navy)]/70" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-[var(--gold)] rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
          </div>
        )}
        <div className="container-content relative z-10 py-20">
          <div className={heroImage ? 'grid gap-8 lg:grid-cols-2 items-center' : 'max-w-3xl'}>
            <div>
              <span className="inline-block bg-white/10 border border-white/20 text-[var(--gold-light)] text-sm font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
                {hero.badge}
              </span>
              <h1 className="font-serif text-white leading-[1.1] mb-8" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 700 }}>
                {hero.headline}
              </h1>
              <p className="text-blue-200 leading-relaxed mb-10" style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)', maxWidth: '600px' }}>
                {hero.subline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={hero.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold text-base"
                >
                  {hero.primaryCta.text}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={hero.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:border-white/60 hover:bg-white/5 transition-all text-base"
                >
                  <Phone className="w-5 h-5 text-[var(--gold-light)]" />
                  {hero.secondaryCta.text}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10">
                {['Print-ready proofing', '48-hour rush options', 'Nationwide delivery'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-blue-200">
                    <CheckCircle className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20">
                <img src={heroImage} alt={hero.headline} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services: Featured Large Layout */}
      <section className="section-padding bg-[var(--surface)]">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="inline-block bg-[var(--gold-50)] text-[var(--gold)] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              {servicesSection?.badge || 'Core Capabilities'}
            </span>
            <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              {servicesSection?.title || 'Our Printing Services'}
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              {servicesSection?.subtitle || 'From daily newspapers to luxury business cards, we handle every print project with precision and care.'}
            </p>
          </div>

          {featuredService && (
            <div className="grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden bg-white border border-[var(--border)] shadow-card mb-7">
              <div className="relative lg:col-span-3 aspect-video">
                <Image
                  src={serviceImages[featuredService.slug] || serviceImages['marketing-print']}
                  alt={featuredService.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <div className="lg:col-span-2 p-8 flex flex-col justify-center">
                <span className="inline-block w-fit bg-[var(--gold-50)] text-[var(--gold)] text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  Featured Service
                </span>
                <h3 className="font-serif text-[var(--navy)] mb-3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                  {featuredService.name}
                </h3>
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">{featuredService.desc}</p>
                <Link
                  href={`/products/${featuredService.slug}`}
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {secondaryServices.map((cat) => {
              const meta = categoryIcons[cat.slug];
              const IconComponent = meta?.Icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-[var(--border)] hover:border-[var(--gold)] hover:-translate-y-1 flex flex-col"
                >
                  {IconComponent && (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 ${meta.bg}`}>
                      <IconComponent className={`w-6 h-6 ${meta.color}`} />
                    </div>
                  )}
                  <h3 className="font-serif font-semibold text-[var(--navy)] text-lg mb-2 group-hover:text-[var(--gold)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">
                    {cat.desc}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-[var(--gold)] group-hover:gap-2 transition-all mt-auto">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white border-t border-[var(--border)]">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="inline-block bg-[var(--gold-50)] text-[var(--gold)] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              {whyChooseUs?.badge || 'Why Choose Us'}
            </span>
            <h2 className="font-serif text-[var(--navy)] mb-3" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              {whyChooseUs?.title || 'Experience the Difference'}
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              {whyChooseUs?.subtitle || 'What sets us apart'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {(whyChooseUs?.points || []).map((point) => (
              <div
                key={point.title}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-card"
              >
                <h3 className="font-serif text-[var(--navy)] text-xl mb-3">{point.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-[var(--navy)] py-14">
        <div className="container-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif font-bold text-[var(--gold-light)] mb-2" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-blue-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-[var(--navy)] mb-3" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                Featured Work
              </h2>
              <p className="text-[var(--text-secondary)]">A sample of projects we're proud to have delivered.</p>
            </div>
            <Link href="/portfolio" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors">
              View All Work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedPortfolioItems.map((item, index) => (
              <div key={index} className="group rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-[var(--border)]">
                <div className="relative h-48">
                  <img
                    src={resolveRenderablePortfolioImage(item)}
                    alt={item.title}
                    className="block h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="font-serif font-semibold text-[var(--navy)] text-base mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/portfolio" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--gold)]">
              View All Work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-[var(--surface)]">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              How It Works
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              From file submission to your door — a streamlined process built around your deadlines.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <div key={step.step} className="relative">
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-[var(--border)] z-0" />
                )}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-[var(--border)] relative z-10 text-center">
                  <div className="w-14 h-14 bg-navy-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif font-bold text-[var(--gold-light)] text-xl">{step.step}</span>
                  </div>
                  <h3 className="font-serif font-semibold text-[var(--navy)] text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from Blog */}
      <section className="section-padding bg-white border-t border-[var(--border)]">
        <div className="container-content">
          <div className="text-center mb-12">
            <span className="inline-block bg-[var(--gold-50)] text-[var(--gold)] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              {blogPreview?.badge || 'Insights'}
            </span>
            <h2 className="font-serif text-[var(--navy)] mb-3" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              {blogPreview?.title || 'Latest from Our Blog & Media'}
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              {blogPreview?.subtitle || 'Educational resources and updates from our team.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={resolveRenderableBlogImage(post)}
                    alt={post.title}
                    className="block h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--gold-50)] text-[var(--gold)]">
                      {toCategoryLabel(post.category)}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">{post.readTime || 'Article'}</span>
                  </div>
                  <h3 className="font-serif text-[var(--navy)] text-lg mb-2 leading-snug group-hover:text-[var(--gold)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={blogPreview?.ctaHref || '/blog'}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
            >
              {blogPreview?.ctaText || 'Explore All Articles'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-navy-gradient py-20">
        <div className="container-content text-center">
          <h2 className="font-serif text-white mb-5" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
            {cta.headline}
          </h2>
          <p className="text-blue-200 mb-10 max-w-xl mx-auto">{cta.subline}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={cta.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold"
            >
              {cta.primaryCta.text}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={cta.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:border-white/60 transition-all"
            >
              <Phone className="w-5 h-5 text-[var(--gold-light)]" />
              {cta.secondaryCta.text}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
