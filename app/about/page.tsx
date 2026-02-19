import Link from 'next/link';
import { Award, CheckCircle, ArrowRight } from 'lucide-react';
import { loadPageContent, getRequestSiteId } from '@/lib/content';
import aboutDataFallback from '@/data/pages/about.json';
import { resolveRenderableImageUrl } from '@/lib/renderableImage';

type AboutData = typeof aboutDataFallback;

function getString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export const metadata = {
  title: 'About Epoch Press',
  description: '25 years of commercial printing excellence. Serving publishers, businesses, and agencies nationwide.',
};

export default async function AboutPage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<AboutData>('about', 'en', siteId);
  const { hero, headline, subline, story, equipment, certifications, stats } =
    dbContent ?? aboutDataFallback;
  const heroTitle = getString((hero as Record<string, unknown> | undefined)?.title) || headline || 'About Epoch Press';
  const heroSubtitle = getString((hero as Record<string, unknown> | undefined)?.subtitle) || subline || '';
  const heroBackgroundImage = resolveRenderableImageUrl(
    (hero as Record<string, unknown> | undefined)?.backgroundImage
  );
  const heroImage = resolveRenderableImageUrl(
    (hero as Record<string, unknown> | undefined)?.image
  );
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
              alt="About hero background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[var(--navy)]/70" />
          </>
        )}

        <div className="container-content relative z-10">
          <div className={heroImage ? 'grid gap-8 lg:grid-cols-2 items-center' : 'max-w-3xl'}>
            <div>
              <h1 className="font-serif text-white mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {heroTitle}
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed">{heroSubtitle}</p>
            </div>
            {heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20">
                <img src={heroImage} alt={heroTitle} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[var(--border)]">
        <div className="container-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--border)]">
            {stats.map((s) => (
              <div key={s.label} className="py-10 text-center">
                <div className="font-serif font-bold text-[var(--gold)] mb-1" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}>
                  {s.value}
                </div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-[var(--surface)]">
        <div className="container-content max-w-3xl mx-auto">
          <h2 className="font-serif text-[var(--navy)] mb-8" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            Our Story
          </h2>
          <div className="space-y-5">
            {story.map((para, i) => (
              <p key={i} className="text-[var(--text-secondary)] leading-relaxed text-base">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="section-padding bg-white border-t border-[var(--border)]">
        <div className="container-content">
          <h2 className="font-serif text-[var(--navy)] mb-3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            Our Equipment
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 max-w-2xl">
            State-of-the-art printing technology for every product type and volume.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <div key={item.name} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-card">
                <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-[var(--gold-light)]" />
                </div>
                <h3 className="font-serif font-semibold text-[var(--navy)] text-base mb-2">{item.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{item.capability}</p>
                <span className="text-xs font-semibold text-[var(--gold)] bg-[var(--gold-50)] px-3 py-1 rounded-full">
                  {item.stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-[var(--navy)]">
        <div className="container-content">
          <h2 className="font-serif text-white mb-10 text-center" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            Certifications & Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certifications.map((cert) => (
              <div key={cert.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <Award className="w-8 h-8 text-[var(--gold)] mx-auto mb-3" />
                <h3 className="font-serif font-semibold text-white text-sm mb-2">{cert.name}</h3>
                <p className="text-xs text-blue-200">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 border-t border-[var(--border)]">
        <div className="container-content text-center">
          <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            See What We Can Do for Your Next Project
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
            From concept to delivery, we're your trusted print production partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
              Request a Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/portfolio" className="inline-flex items-center gap-2 border-2 border-[var(--border)] text-[var(--navy)] font-semibold px-8 py-4 rounded-xl hover:border-[var(--navy)] transition-colors">
              View Our Portfolio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
