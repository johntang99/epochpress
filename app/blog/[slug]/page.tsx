import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, ArrowLeft, ArrowRight, Tag as TagIcon } from 'lucide-react';
import blogData from '@/data/blog.json';
import { loadAllItems, getRequestSiteId } from '@/lib/content';

const categoryColors: Record<string, string> = {
  'industry-trends': 'bg-blue-100 text-blue-800',
  'print-tips': 'bg-green-100 text-green-800',
  'our-services': 'bg-purple-100 text-purple-800',
  'case-studies': 'bg-orange-100 text-orange-800',
  'sustainability': 'bg-teal-100 text-teal-800',
};

export async function generateStaticParams() {
  return blogData.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogData.posts.find((p) => p.slug === params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const siteId = await getRequestSiteId();
  const dbPosts = await loadAllItems<typeof blogData.posts[0]>(siteId, 'en', 'blog');
  const posts = dbPosts.length > 0 ? dbPosts : blogData.posts;
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const category = blogData.categories.find((c) => c.id === post.category);
  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient pt-28 pb-16">
        <div className="container-content max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-1 text-blue-300 text-sm hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColors[post.category] || 'bg-white/10 text-white'}`}>
              {category?.name}
            </span>
            <span className="text-blue-300 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.readTime}
            </span>
          </div>
          <h1 className="font-serif text-white leading-tight mb-5" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
            {post.title}
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">{post.excerpt}</p>
          <p className="text-blue-300 text-sm mt-5">
            {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Hero Image placeholder */}
      <div className="bg-gradient-to-b from-[var(--navy)] to-white">
        <div className="container-content max-w-3xl">
          <div className="h-64 bg-[var(--charcoal)] rounded-2xl -mt-8 relative overflow-hidden flex items-center justify-center mb-0">
            <span className="text-8xl opacity-10">✍️</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <section className="section-padding bg-white">
        <div className="container-content max-w-3xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <p className="text-[var(--text-secondary)] leading-relaxed text-lg mb-6">
              {post.excerpt} This is where the full article content will be displayed. In Phase 3 (admin wiring), this content will be loaded from the CMS database and support rich text, images, embedded videos, and related product callouts.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
              The article body supports headers, pull quotes, numbered lists, code blocks for spec references, and inline product CTAs. When admin is wired, editors will write directly in the admin CMS editor.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
              For now, this is a placeholder layout that demonstrates the full article page design — hero, tags, body, sidebar suggestions, and CTA — so we can refine the UX before connecting to the backend.
            </p>
          </article>

          {/* Tags */}
          {post.tags && (
            <div className="mt-8 pt-8 border-t border-[var(--border)]">
              <div className="flex items-center gap-3 flex-wrap">
                <TagIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--charcoal)] px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-[var(--surface)] py-14 border-t border-[var(--border)]">
          <div className="container-content max-w-4xl mx-auto">
            <h2 className="font-serif text-[var(--navy)] mb-7 text-xl">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group bg-white rounded-2xl border border-[var(--border)] p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[rel.category] || 'bg-gray-100 text-gray-700'}`}>
                    {blogData.categories.find((c) => c.id === rel.category)?.name}
                  </span>
                  <h3 className="font-serif font-semibold text-[var(--navy)] text-sm mt-3 mb-2 group-hover:text-[var(--gold)] transition-colors leading-snug">
                    {rel.title}
                  </h3>
                  <span className="text-xs text-[var(--text-secondary)]">{rel.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy-gradient py-14">
        <div className="container-content text-center">
          <h2 className="font-serif text-white mb-4 text-xl">Ready to start your print project?</h2>
          <p className="text-blue-200 mb-7 text-sm">Get a custom quote from our printing team.</p>
          <Link href="/quote" className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
