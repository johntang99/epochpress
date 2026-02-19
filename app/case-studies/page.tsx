import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import { getRequestSiteId, loadPageContent } from '@/lib/content';
import caseStudiesFallback from '@/data/pages/case-studies.json';
import { resolveRenderableImageUrl } from '@/lib/renderableImage';

type CaseStudiesData = typeof caseStudiesFallback;

const categoryTone: Record<string, string> = {
  Newspapers: 'bg-blue-100 text-blue-800',
  Magazines: 'bg-purple-100 text-purple-800',
  Books: 'bg-green-100 text-green-800',
  'Marketing Print': 'bg-orange-100 text-orange-800',
  'Direct Mail': 'bg-rose-100 text-rose-800',
  'Multi-Location Rollout': 'bg-teal-100 text-teal-800',
};

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<CaseStudiesData>('case-studies', 'en', siteId);
  const data = dbContent ?? caseStudiesFallback;
  const heroBackgroundImage = resolveRenderableImageUrl(
    (data.hero as Record<string, unknown>)?.backgroundImage
  );
  const heroImage = resolveRenderableImageUrl((data.hero as Record<string, unknown>)?.image);
  const hasHeroMedia = Boolean(heroBackgroundImage || heroImage);
  const selectedCategory = searchParams?.category || 'All Cases';
  const filteredStories =
    selectedCategory === 'All Cases'
      ? data.stories
      : data.stories.filter((item) => item.category === selectedCategory);

  return (
    <>
      <section
        className={`relative pt-28 pb-14 border-b border-[var(--border)] overflow-hidden ${
          hasHeroMedia ? 'bg-[var(--navy)]' : 'bg-[var(--surface)]'
        }`}
      >
        {heroBackgroundImage && (
          <>
            <img
              src={heroBackgroundImage}
              alt="Case studies hero background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[var(--navy)]/70" />
          </>
        )}

        <div className="container-content relative z-10">
          <div className={heroImage ? 'grid gap-8 lg:grid-cols-2 items-center' : 'max-w-3xl mx-auto text-center'}>
            <div className={heroImage ? '' : ''}>
              <h1
                className={`font-serif mb-4 ${hasHeroMedia ? 'text-white' : 'text-[var(--navy)]'} ${
                  heroImage ? '' : 'text-center'
                }`}
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {data.hero.title}
              </h1>
              <p
                className={`text-lg mb-8 ${hasHeroMedia ? 'text-blue-100' : 'text-[var(--text-secondary)]'} ${
                  heroImage ? '' : 'text-center'
                }`}
              >
                {data.hero.subtitle}
              </p>
            </div>
            {heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20">
                <img src={heroImage} alt={data.hero.title} className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto bg-white/95 border border-[var(--border)] rounded-xl px-5 py-4">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {data.hero.disclaimer}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-6 border-b border-[var(--border)]">
        <div className="container-content">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {data.categories.map((category) => {
              const isActive = category === selectedCategory;
              const href = category === 'All Cases' ? '/case-studies' : `/case-studies?category=${encodeURIComponent(category)}`;
              return (
                <Link
                  key={category}
                  href={href}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--navy)] text-white'
                      : 'bg-[var(--surface)] text-[var(--charcoal)] hover:bg-[var(--border)]'
                  }`}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-[var(--surface)]">
        <div className="container-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                className="bg-white rounded-2xl border border-[var(--border)] shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 border-b border-[var(--border)]">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        categoryTone[story.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {story.category}
                    </span>
                    {story.featured && (
                      <span className="inline-flex rounded-full bg-[var(--gold-50)] text-[var(--gold)] px-2.5 py-1 text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-[var(--navy)] text-2xl mb-1">{story.title}</h2>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">{story.client}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--navy)] mb-1">
                      Challenge
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{story.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--navy)] mb-1">
                      Solution
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{story.solution}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--navy)] mb-1">
                      Result
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{story.result}</p>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 mt-0.5 text-[var(--gold)] flex-shrink-0" />
                      <div>
                        <p className="text-sm text-[var(--navy)] leading-relaxed mb-2">"{story.quote}"</p>
                        <p className="text-xs font-semibold text-[var(--text-secondary)]">{story.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-12 text-[var(--text-secondary)]">No case studies in this category yet.</div>
          )}
        </div>
      </section>

      <section className="bg-[var(--navy)] py-16">
        <div className="container-content text-center">
          <h2 className="font-serif text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            {data.cta.title}
          </h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">{data.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={data.cta.primary.href}
              className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold"
            >
              {data.cta.primary.text} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={data.cta.secondary.href}
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:border-white/60 transition-colors"
            >
              {data.cta.secondary.text}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
