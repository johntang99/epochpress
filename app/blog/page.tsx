import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import blogData from '@/data/blog.json';
import blogPageFallback from '@/data/pages/blog.json';
import { getRequestSiteId, loadAllItems, loadPageContent } from '@/lib/content';
import fs from 'fs';
import path from 'path';
import { resolveRenderableImageUrl } from '@/lib/renderableImage';

const categoryColors: Record<string, string> = {
  'industry-trends': 'bg-blue-100 text-blue-800',
  'print-tips': 'bg-green-100 text-green-800',
  'our-services': 'bg-purple-100 text-purple-800',
  'case-studies': 'bg-orange-100 text-orange-800',
  'sustainability': 'bg-teal-100 text-teal-800',
};

const blogPreviewImages: Record<string, string> = {
  'offset-vs-digital-printing-2025': 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80',
  'preparing-files-for-newspaper-printing': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  'magazine-cover-design-trends-2026': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80',
  'metro-daily-herald-case-study': 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=1200&q=80',
  'restaurant-menu-printing-guide': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  'fsc-certified-paper-printing': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
};

function resolvePostImage(post: Record<string, unknown>): string | null {
  const candidates = [
    post.image,
    post.coverImage,
    post.featuredImage,
    post.heroImage,
    post.cover,
    post.thumbnail,
    post.imageUrl,
    blogPreviewImages[String(post.slug || '')],
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }
  return null;
}

function resolveRenderableImage(post: Record<string, unknown>): string | null {
  const resolved = resolvePostImage(post);
  if (!resolved) return null;
  if (!resolved.startsWith('/uploads/')) return resolved;

  const localPath = path.join(process.cwd(), 'public', resolved.replace(/^\//, ''));
  return fs.existsSync(localPath) ? resolved : blogPreviewImages[String(post.slug || '')] || null;
}

function toCategoryLabel(value: string): string {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

type BlogPost = (typeof blogData.posts)[number] & {
  image?: string;
  coverImage?: string;
  thumbnail?: string;
  imageUrl?: string;
};
type BlogPageContent = typeof blogPageFallback;

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const siteId = await getRequestSiteId();
  const [dbPosts, blogPageContent] = await Promise.all([
    loadAllItems<BlogPost>(siteId, 'en', 'blog'),
    loadPageContent<BlogPageContent>('blog', 'en', siteId),
  ]);
  const pageContent = blogPageContent ?? blogPageFallback;
  const heroBackgroundImage = resolveRenderableImageUrl(
    (pageContent as Record<string, any>)?.hero?.backgroundImage
  );
  const heroImage = resolveRenderableImageUrl(
    (pageContent as Record<string, any>)?.hero?.image
  );
  const hasHeroMedia = Boolean(heroBackgroundImage || heroImage);
  const posts = dbPosts.length > 0 ? dbPosts : (blogData.posts as BlogPost[]);
  const categories =
    dbPosts.length > 0
      ? [{ id: 'all', name: pageContent.labels.allPosts }, ...Array.from(new Set(posts.map((post) => post.category))).map((id) => ({ id, name: toCategoryLabel(id) }))]
      : blogData.categories;

  const active = searchParams?.category || 'all';
  const filtered = active === 'all' ? posts : posts.filter((post) => post.category === active);
  const featured = posts.find((post) => post.featured) || posts[0];
  const displayPosts = active === 'all' ? filtered.filter((post) => post.slug !== featured?.slug) : filtered;

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
              alt="Blog hero background"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-[var(--navy)]/70" />
          </>
        )}

        <div className="container-content relative z-10">
          <div className={heroImage ? 'grid gap-8 lg:grid-cols-2 items-center' : 'max-w-2xl'}>
            <div>
              <h1
                className={`font-serif mb-4 ${hasHeroMedia ? 'text-white' : 'text-[var(--navy)]'}`}
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {pageContent.hero.title}
              </h1>
              <p
                className={`text-lg leading-relaxed ${
                  hasHeroMedia ? 'text-blue-100' : 'text-[var(--text-secondary)]'
                }`}
              >
                {pageContent.hero.subtitle}
              </p>
            </div>
            {heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20">
                <img
                  src={heroImage}
                  alt="Blog hero image"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featured && active === 'all' && (
        <section className="bg-white py-12 border-b border-[var(--border)]">
          <div className="container-content">
            <p className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest mb-4">
              {pageContent.labels.featuredArticle}
            </p>
            <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--gold)] transition-colors">
              <div className="relative aspect-[3/2]">
                {resolveRenderableImage(featured as unknown as Record<string, unknown>) ? (
                  <img
                    src={resolveRenderableImage(featured as unknown as Record<string, unknown>) as string}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="h-full bg-navy-gradient flex items-center justify-center">
                    <span className="text-8xl opacity-20">📰</span>
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${categoryColors[featured.category] || 'bg-gray-100 text-gray-700'}`}>
                  {categories.find((c) => c.id === featured.category)?.name || toCategoryLabel(featured.category)}
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
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/blog' : `/blog?category=${encodeURIComponent(cat.id)}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active === cat.id
                    ? 'bg-[var(--navy)] text-white'
                    : 'bg-[var(--surface)] text-[var(--charcoal)] hover:bg-[var(--border)]'
                }`}
              >
                {cat.name}
              </Link>
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
                <div className="relative aspect-video w-full overflow-hidden">
                  {resolveRenderableImage(post as unknown as Record<string, unknown>) ? (
                    <img
                      src={resolveRenderableImage(post as unknown as Record<string, unknown>) as string}
                      alt={post.title}
                      className="block h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)] flex items-center justify-center">
                      <span className="text-5xl opacity-20">✍️</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                      {categories.find((c) => c.id === post.category)?.name || toCategoryLabel(post.category)}
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
            <div className="text-center py-12 text-[var(--text-secondary)]">
              {pageContent.labels.noPosts}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--surface)] py-14 border-t border-[var(--border)]">
        <div className="container-content text-center">
          <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
            {pageContent.cta.title}
          </h2>
          <p className="text-[var(--text-secondary)] mb-7 max-w-md mx-auto">{pageContent.cta.subtitle}</p>
          <Link
            href={pageContent.cta.buttonHref}
            className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold"
          >
            {pageContent.cta.buttonText} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
