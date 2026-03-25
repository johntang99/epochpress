import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.epoch-press.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core pages
  const corePages = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/products`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/quote`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/portfolio`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/case-studies`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/file-guidelines`, changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  // Product pages
  const productSlugs = [
    'newspaper-printing',
    'magazine-printing',
    'book-printing',
    'calendar-printing',
    'marketing-print',
    'menu-printing',
    'business-cards',
    'large-format',
  ];
  const productPages = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // SEO landing pages
  const seoPages = [
    { url: `${BASE_URL}/commercial-printing-new-jersey`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/commercial-printing-new-york`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/commercial-printing-tri-state`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/offset-printing`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/printing-cost`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/rush-printing`, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  // Multi-language landing pages
  const lpPages = [
    { url: `${BASE_URL}/lp/es`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/lp/yi`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/lp/zh-hant`, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  return [
    ...corePages,
    ...productPages,
    ...seoPages,
    ...lpPages,
  ].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
