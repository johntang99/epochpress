'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { SiteInfo } from '@/lib/types';

type SiteChromeProps = {
  children: React.ReactNode;
  headerConfig: Record<string, unknown> | null;
  footerConfig: Record<string, unknown> | null;
  siteInfo: SiteInfo | null;
};

export function SiteChrome({
  children,
  headerConfig,
  footerConfig,
  siteInfo,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header config={headerConfig} siteInfo={siteInfo} />
      <main className="min-h-screen overflow-x-hidden">{children}</main>
      <Footer config={footerConfig} siteInfo={siteInfo} />
    </>
  );
}
