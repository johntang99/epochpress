import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Suspense } from 'react';
import { getRequestSiteId, loadTheme, loadSeo } from '@/lib/content';
import type { SeoConfig } from '@/lib/types';

export async function generateMetadata(): Promise<Metadata> {
  const siteId = await getRequestSiteId();
  const seo = await loadSeo(siteId, 'en') as SeoConfig | null;

  return {
    title: {
      default: seo?.title || 'Epoch Press — Premium Commercial Printing',
      template: `%s | ${seo?.title || 'Epoch Press'}`,
    },
    description:
      seo?.description ||
      'Full-service commercial printing. Newspapers, magazines, books, marketing print, menus, business cards, and large format.',
    openGraph: {
      type: 'website',
      siteName: seo?.title || 'Epoch Press',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteId = await getRequestSiteId();
  const theme = await loadTheme(siteId);

  const cssVars = theme?.colors
    ? `
    :root {
      --primary: ${theme.colors.primary?.DEFAULT || '#0F1B2D'};
      --primary-dark: ${theme.colors.primary?.dark || '#080F1A'};
      --primary-light: ${theme.colors.primary?.light || '#1A2E4A'};
      --secondary: ${theme.colors.secondary?.DEFAULT || '#B8860B'};
      --secondary-light: ${theme.colors.secondary?.light || '#D4A843'};
      --gold: ${theme.colors.secondary?.DEFAULT || '#B8860B'};
      --gold-light: ${theme.colors.secondary?.light || '#D4A843'};
      --gold-50: ${theme.colors.secondary?.['50'] || '#FDF8EC'};
      --backdrop-primary: ${theme.colors.backdrop?.primary || '#F8F9FA'};
      --backdrop-secondary: ${theme.colors.backdrop?.secondary || '#FDF8EC'};
    }
  `
    : '';

  return (
    <html lang="en">
      <head>{cssVars && <style dangerouslySetInnerHTML={{ __html: cssVars }} />}</head>
      <body className="bg-white text-[var(--text-primary)] font-sans antialiased">
        <Header />
        <main className="min-h-screen overflow-x-hidden">
          <Suspense>{children}</Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
