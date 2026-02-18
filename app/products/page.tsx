import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { loadPageContent, getRequestSiteId } from '@/lib/content';
import productsDataFallback from '@/data/products.json';

type ProductsData = typeof productsDataFallback;

export const metadata = {
  title: 'Printing Services',
  description: 'Full-service commercial printing: newspapers, magazines, books, marketing, menus, business cards, and large format.',
};

export default async function ProductsPage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<ProductsData>('products', 'en', siteId);
  const { hero, categories } = dbContent ?? productsDataFallback;

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--surface)] pt-28 pb-16 border-b border-[var(--border)]">
        <div className="container-content text-center">
          <h1 className="font-serif text-[var(--navy)] mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {hero.headline}
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
            {hero.subline}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="group bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image placeholder */}
                <div className="h-52 bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)] flex items-center justify-center relative overflow-hidden">
                  <span className="text-7xl opacity-25">{cat.icon}</span>
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
