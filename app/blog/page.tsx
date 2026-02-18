'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import blogData from '@/data/blog.json';

const categoryColors: Record<string, string> = {
  'industry-trends': 'bg-blue-100 text-blue-800',
  'print-tips': 'bg-green-100 text-green-800',
  'our-services': 'bg-purple-100 text-purple-800',
  'case-studies': 'bg-orange-100 text-orange-800',
  'sustainability': 'bg-teal-100 text-teal-800',
};

export default function BlogPage() {
  const [active, setActive] = useState('all');
  const { categories, posts } = blogData;

  const filtered = active === 'all' ? posts : posts.filter((p) => p.category === active);
  const featured = posts.find((p) => p.featured);
  const listPosts = filtered.filter((p) => !p.featured || active !== 'all');
  const displayPosts = active === 'all' ? filtered.filter((p) => p.slug !== featured?.slug) : filtered;

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--surface)] pt-28 pb-16 border-b border-[var(--border)]">
        <div className="container-content">
          <div className="max-w-2xl">
            <h1 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Insights & Resources
            </h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Industry trends, print tips, case studies, and behind-the-scenes at Epoch Press. Everything you need to make smarter printing decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featured && active === 'all' && (
        <section className="bg-white py-12 border-b border-[var(--border)]">
          <div className="container-content">
            <p className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest mb-4">Featured Article</p>
            <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--gold)] transition-colors">
              <div className="h-64 lg:h-auto bg-navy-gradient flex items-center justify-center min-h-[220px]">
                <span className="text-8xl opacity-20">📰</span>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${categoryColors[featured.category] || 'bg-gray-100 text-gray-700'}`}>
                  {categories.find((c) => c.id === featured.category)?.name}
                </span>
                <h2 className="font-serif text-[var(--navy)] text-2xl mb-3 group-hover:text-[var(--gold)] transition-colors leading-snug">
                  {featured.title}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {featured.readTime}</span>
                  <span>{new Date(featured.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="bg-white py-5 border-b border-[var(--border)] sticky top-[72px] z-10">
        <div className="container-content">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active === cat.id
                    ? 'bg-[var(--navy)] text-white'
                    : 'bg-[var(--surface)] text-[var(--charcoal)] hover:bg-[var(--border)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="h-48 bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)] flex items-center justify-center">
                  <span className="text-5xl opacity-20">✍️</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {categories.find((c) => c.id === post.category)?.name}
                    </span>
                    {post.type === 'video' && (
                      <span className="text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">Video</span>
                    )}
                  </div>
                  <h2 className="font-serif font-semibold text-[var(--navy)] text-lg mb-3 group-hover:text-[var(--gold)] transition-colors leading-snug flex-1">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border)]">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                    <span className="flex items-center gap-1 text-[var(--gold)] font-semibold group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {displayPosts.length === 0 && (
            <div className="text-center py-12 text-[var(--text-secondary)]">No posts in this category yet.</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--surface)] py-14 border-t border-[var(--border)]">
        <div className="container-content text-center">
          <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            Ready to Start Printing?
          </h2>
          <p className="text-[var(--text-secondary)] mb-7 max-w-md mx-auto">From a single business card run to a full newspaper contract — we handle it all.</p>
          <Link href="/quote" className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
            Request a Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
