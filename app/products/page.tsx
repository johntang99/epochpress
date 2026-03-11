import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { loadPageContent, getRequestSiteId } from '@/lib/content';
import productsDataFallback from '@/data/products.json';
import { resolveRenderableImageUrl } from '@/lib/renderableImage';

type ProductsData = typeof productsDataFallback;

interface ProductHeroLike {
  image?: string;
  backgroundImage?: string;
}

interface ProductPageLike {
  image?: string;
  backgroundImage?: string;
  hero?: ProductHeroLike;
  pageHero?: ProductHeroLike;
  heroSection?: ProductHeroLike;
}

const productCardFallbackImages: Record<string, string> = {
  'newspaper-printing':
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
  'magazine-printing':
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1400&q=80',
  'book-printing':
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1400&q=80',
  'calendar-printing':
    'https://images.unsplash.com/photo-1506784693919-ef06d93c28d2?auto=format&fit=crop&w=1400&q=80',
  'marketing-print':
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80',
  'menu-printing':
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  'business-cards':
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80',
  'large-format':
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80',
};

export const metadata = {
  title: 'Printing Services',
  description: 'Full-service commercial printing: newspapers, magazines, books, marketing, menus, business cards, and large format.',
};

export default async function ProductsPage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<ProductsData>('products', 'en', siteId);
  const { hero, categories } = dbContent ?? productsDataFallback;
  const categoriesWithHeroImage = await Promise.all(
    categories.map(async (category) => {
      const productPage = await loadPageContent<ProductPageLike>(category.slug, 'en', siteId);
      const heroBlock =
        productPage?.pageHero || productPage?.heroSection || productPage?.hero || null;
      const heroImage =
        resolveRenderableImageUrl(heroBlock?.image) ||
        resolveRenderableImageUrl(productPage?.image) ||
        resolveRenderableImageUrl(heroBlock?.backgroundImage) ||
        resolveRenderableImageUrl(productPage?.backgroundImage) ||
        productCardFallbackImages[category.slug] ||
        '';
      return {
        ...category,
        heroImage,
      };
    })
  );
  const heroBackgroundImage = resolveRenderableImageUrl(
    (hero as Record<string, unknown>)?.backgroundImage
  );
  const heroImage = resolveRenderableImageUrl((hero as Record<string, unknown>)?.image);
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
              alt="Products hero background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[var(--navy)]/70" />
          </>
        )}

        <div className="container-content relative z-10">
          <div className={heroImage ? 'grid gap-8 lg:grid-cols-2 items-center' : 'text-center'}>
            <div className={heroImage ? '' : 'max-w-2xl mx-auto'}>
              <h1
                className={`font-serif mb-5 ${hasHeroMedia ? 'text-white' : 'text-[var(--navy)]'}`}
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {hero.headline}
              </h1>
              <p
                className={`max-w-2xl text-lg leading-relaxed ${
                  hasHeroMedia ? 'text-on-primary-muted' : 'text-[var(--text-secondary)]'
                } ${heroImage ? '' : 'mx-auto'}`}
              >
                {hero.subline}
              </p>
            </div>
            {heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20">
                <img src={heroImage} alt={hero.headline} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {categoriesWithHeroImage.map((cat) => (
              <div
                key={cat.slug}
                className="group bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="h-52 bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)] flex items-center justify-center relative overflow-hidden">
                  {cat.heroImage ? (
                    <img
                      src={cat.heroImage}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-7xl opacity-25">{cat.icon}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <h2 className="font-serif font-semibold text-[var(--navy)] text-xl mb-3 group-hover:text-[var(--gold)] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-5 text-sm flex-1">
                    {cat.desc}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-6">
                    {cat.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-[var(--charcoal)]">
                        <CheckCircle className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/products/${cat.slug}`}
                    className="inline-flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[var(--navy-light)] transition-colors group-hover:bg-gold-gradient"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--surface)] py-16 border-t border-[var(--border)]">
        <div className="container-content text-center">
          <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            Not Sure Which Product Fits?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
            Tell us about your project and we'll recommend the right solution and provide a custom quote.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold"
          >
            Get a Custom Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
