import Link from 'next/link';
import { ArrowRight, Phone, CheckCircle, ChevronRight } from 'lucide-react';
import { loadPageContent, getRequestSiteId } from '@/lib/content';
import homeDataFallback from '@/data/home.json';

type HomeData = typeof homeDataFallback;

const categoryIcons: Record<string, string> = {
  'newspaper-printing': '📰',
  'magazine-printing': '📖',
  'book-printing': '📚',
  'marketing-print': '📄',
  'menu-printing': '🍽️',
  'business-cards': '💳',
  'large-format': '🖼️',
};

export default async function HomePage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<HomeData>('home', 'en', siteId);
  const { hero, categories, stats, portfolio, process, cta } = dbContent ?? homeDataFallback;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-gradient min-h-[90vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-[var(--gold)] rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="container-content relative z-10 py-20">
          <div className="max-w-3xl">
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
        </div>
      </section>

      {/* Product Category Grid */}
      <section className="section-padding bg-[var(--surface)]">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              Our Printing Services
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              From daily newspapers to luxury business cards, we handle every print project with precision and care.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-[var(--border)] hover:border-[var(--gold)] hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{categoryIcons[cat.slug]}</div>
                <h3 className="font-serif font-semibold text-[var(--navy)] text-lg mb-2 group-hover:text-[var(--gold)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  {cat.desc}
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-[var(--gold)] group-hover:gap-2 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
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
            {portfolio.map((item, index) => (
              <div key={index} className="group rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-[var(--border)]">
                <div className="h-48 bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)] flex items-center justify-center">
                  <span className="text-4xl opacity-30">
                    {categoryIcons[item.category === 'Newspapers' ? 'newspaper-printing' : item.category === 'Magazines' ? 'magazine-printing' : item.category === 'Books' ? 'book-printing' : 'menu-printing']}
                  </span>
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
