'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

// Note: metadata must be in a server component. Since this is 'use client',
// handle SEO via parent layout or a separate metadata.ts file.

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

export default function PortfolioPage() {
  const [active, setActive] = useState('All');
  const { items, categories } = portfolioData;
  const filtered = active === 'All' ? items : items.filter((i) => i.category === active);

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--surface)] pt-28 pb-16 border-b border-[var(--border)]">
        <div className="container-content text-center">
          <h1 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Our Work
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            500+ clients served across every industry. Here's a sample of projects we're proud to have delivered.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white py-6 border-b border-[var(--border)] sticky top-[72px] z-10">
        <div className="container-content">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active === cat
                    ? 'bg-[var(--navy)] text-white'
                    : 'bg-[var(--surface)] text-[var(--charcoal)] hover:bg-[var(--border)]'
                }`}
              >
                {cat}
              </button>
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
                <div className="h-52 bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)] flex items-center justify-center relative">
                  <span className="text-6xl opacity-20">{categoryIcons[item.category]}</span>
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
            Let's create something great together.
          </h2>
          <p className="text-blue-200 mb-8">Tell us about your project and we'll provide a custom quote.</p>
          <Link href="/quote" className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
            Get a Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
