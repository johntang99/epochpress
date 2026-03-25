import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { getRequestSiteId, loadTheme, loadSeo, loadContent, loadFooter, loadSiteInfo } from '@/lib/content';
import type { SeoConfig, SiteInfo } from '@/lib/types';
import { SiteChrome } from '@/components/layout/SiteChrome';

const SITE_URL = 'https://www.epoch-press.com';

export async function generateMetadata(): Promise<Metadata> {
  const siteId = await getRequestSiteId();
  const seo = await loadSeo(siteId, 'en') as SeoConfig | null;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo?.home?.title || seo?.title || 'Epoch Press — Full-Service Commercial Printing in Wayne, NJ',
      template: `%s | ${seo?.title || 'Epoch Press'}`,
    },
    description:
      seo?.home?.description || seo?.description ||
      'Full-service commercial printing in Wayne, NJ. Newspapers, magazines, books, marketing materials, and more.',
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      siteName: 'Epoch Press',
      url: SITE_URL,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteId = await getRequestSiteId();
  const [theme, headerConfig, footerConfig, siteInfo] = await Promise.all([
    loadTheme(siteId),
    loadContent(siteId, 'en', 'header.json'),
    loadFooter(siteId, 'en'),
    loadSiteInfo(siteId, 'en'),
  ]);

  const cssVars = `
    :root {
      --primary: ${theme?.colors?.primary?.DEFAULT || '#0F1B2D'};
      --primary-dark: ${theme?.colors?.primary?.dark || '#080F1A'};
      --primary-light: ${theme?.colors?.primary?.light || '#1A2E4A'};
      --primary-50: ${theme?.colors?.primary?.['50'] || '#EEF1F5'};
      --primary-100: ${theme?.colors?.primary?.['100'] || '#D0D9E6'};
      --secondary: ${theme?.colors?.secondary?.DEFAULT || '#B8860B'};
      --secondary-dark: ${theme?.colors?.secondary?.dark || '#8B6508'};
      --secondary-light: ${theme?.colors?.secondary?.light || '#D4A843'};
      --secondary-50: ${theme?.colors?.secondary?.['50'] || '#FDF8EC'};
      --gold: ${theme?.colors?.secondary?.DEFAULT || '#B8860B'};
      --gold-light: ${theme?.colors?.secondary?.light || '#D4A843'};
      --gold-50: ${theme?.colors?.secondary?.['50'] || '#FDF8EC'};
      --backdrop-primary: ${theme?.colors?.backdrop?.primary || '#F8F9FA'};
      --backdrop-secondary: ${theme?.colors?.backdrop?.secondary || '#FDF8EC'};
      --hero-overlay-from: ${theme?.heroOverlay?.from || '#080F1A'};
      --hero-overlay-to: ${theme?.heroOverlay?.to || '#0F1B2D'};
      --hero-overlay-opacity: ${theme?.heroOverlay?.opacity ?? 0.7};
      --text-on-primary: ${theme?.colors?.primary?.['50'] || '#EEF1F5'};
      --text-on-primary-muted: ${theme?.colors?.primary?.['100'] || '#D0D9E6'};
      --text-on-primary-subtle: ${theme?.colors?.primary?.['100'] || '#D0D9E6'};
      --tag-bg: ${theme?.colors?.primary?.['50'] || '#EEF1F5'};
      --tag-text: ${theme?.colors?.primary?.dark || '#080F1A'};
      --status-positive-bg: ${theme?.colors?.primary?.['50'] || '#EEF1F5'};
      --status-positive-border: ${theme?.colors?.primary?.['100'] || '#D0D9E6'};
      --status-positive-text: ${theme?.colors?.primary?.dark || '#080F1A'};
      --status-negative-bg: ${theme?.colors?.secondary?.['50'] || '#FDF8EC'};
      --status-negative-border: ${theme?.colors?.secondary?.DEFAULT || '#B8860B'};
      --status-negative-text: ${theme?.colors?.secondary?.dark || '#8B6508'};
      --status-danger: ${theme?.colors?.secondary?.dark || '#8B6508'};
      --radius-card: ${theme?.radii?.card || '1rem'};
      --radius-photo: ${theme?.radii?.photo || '1.25rem'};
      --radius-button: ${theme?.radii?.button || '0.75rem'};
      --radius-pill: ${theme?.radii?.pill || '9999px'};

      /* Canonical site tokens are now driven by theme.json only */
      --navy: ${theme?.colors?.primary?.DEFAULT || '#0F1B2D'};
      --navy-dark: ${theme?.colors?.primary?.dark || '#080F1A'};
      --navy-light: ${theme?.colors?.primary?.light || '#1A2E4A'};
      --surface: ${theme?.colors?.backdrop?.primary || '#F8F9FA'};
      --border: ${theme?.colors?.primary?.['100'] || '#E2E8F0'};
    }
  `;

  return (
    <html lang="en">
      <head>
        {cssVars && <style dangerouslySetInnerHTML={{ __html: cssVars }} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Epoch Press',
              url: 'https://epoch-press.com',
              logo: 'https://epoch-press.com/logo.png',
              description: 'Full-service commercial printing company in Wayne, NJ. Newspapers, magazines, books, marketing materials.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '7 Highpoint Drive',
                addressLocality: 'Wayne',
                addressRegion: 'NJ',
                postalCode: '07470',
                addressCountry: 'US',
              },
              telephone: '+19736943600',
              email: 'info@epochpress.com',
              areaServed: [
                { '@type': 'State', name: 'New Jersey' },
                { '@type': 'State', name: 'New York' },
              ],
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="bg-white text-[var(--text-primary)] font-sans antialiased">
        <SiteChrome
          headerConfig={headerConfig as Record<string, unknown> | null}
          footerConfig={footerConfig as Record<string, unknown> | null}
          siteInfo={siteInfo as SiteInfo | null}
        >
          <Suspense>{children}</Suspense>
        </SiteChrome>
      </body>
    </html>
  );
}
