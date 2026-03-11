'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  PrinterIcon,
  Mail,
  MapPin,
} from 'lucide-react';
import clsx from 'clsx';
import type { SiteInfo } from '@/lib/types';
import { PUBLIC_PRODUCT_CATALOG } from '@/lib/productTaxonomy';

const products = PUBLIC_PRODUCT_CATALOG.filter((item) => item.id !== 'other').map((item) => ({
  name: item.label,
  slug: item.slug,
  desc: item.desc,
}));

const fallbackNavLinks = [
  { name: 'Products', href: '/products', hasDropdown: true },
  { name: 'About', href: '/about', hasDropdown: false },
  { name: 'Portfolio', href: '/portfolio', hasDropdown: false },
  { name: 'Blog', href: '/blog', hasDropdown: false },
  { name: 'Contact', href: '/contact', hasDropdown: false },
];
const landingNavLinksByLocale: Record<string, Array<{ name: string; href: string; hasDropdown: boolean }>> = {
  es: [
    { name: 'Por que nosotros', href: '#why-us', hasDropdown: false },
    { name: 'Productos', href: '#products', hasDropdown: false },
    { name: 'Proceso', href: '#process', hasDropdown: false },
    { name: 'Casos de exito', href: '#case-studies', hasDropdown: false },
    { name: 'Galeria', href: '#gallery', hasDropdown: false },
    { name: 'Contacto', href: '#contact', hasDropdown: false },
  ],
  zh: [
    { name: '为什么选择我们', href: '#why-us', hasDropdown: false },
    { name: '产品', href: '#products', hasDropdown: false },
    { name: '流程', href: '#process', hasDropdown: false },
    { name: '案例', href: '#case-studies', hasDropdown: false },
    { name: '图片展示', href: '#gallery', hasDropdown: false },
    { name: '联系', href: '#contact', hasDropdown: false },
  ],
  he: [
    { name: 'למה אנחנו', href: '#why-us', hasDropdown: false },
    { name: 'מוצרים', href: '#products', hasDropdown: false },
    { name: 'תהליך', href: '#process', hasDropdown: false },
    { name: 'סיפורי הצלחה', href: '#case-studies', hasDropdown: false },
    { name: 'גלריה', href: '#gallery', hasDropdown: false },
    { name: 'צור קשר', href: '#contact', hasDropdown: false },
  ],
};

type HeaderConfig = {
  menu?: {
    logo?: { text?: string; subtext?: string; image?: { src?: string; alt?: string } };
    items?: Array<{ text?: string; url?: string }>;
    variant?: 'default' | 'centered' | 'transparent' | 'stacked';
    fontWeight?: 'regular' | 'semibold';
  };
  cta?: { text?: string; link?: string };
  topbar?: {
    phone?: string;
    phoneHref?: string;
    email?: string;
    emailHref?: string;
    address?: string;
    addressHref?: string;
    social?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
    };
  };
};

export function Header({
  config,
  siteInfo,
}: {
  config?: HeaderConfig | null;
  siteInfo?: SiteInfo | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoImageFailed, setLogoImageFailed] = useState(false);
  const pathname = usePathname();

  const rawLogoText = config?.menu?.logo?.text;
  const rawLogoSubtext = config?.menu?.logo?.subtext;
  const logoText = rawLogoText ?? 'EPOCH PRESS';
  const logoSubtext = rawLogoSubtext ?? 'Commercial Printing';
  const logoImageSrc = config?.menu?.logo?.image?.src?.trim() || '';
  const logoImageAlt = config?.menu?.logo?.image?.alt || logoText;
  const shouldShowLogoImage = Boolean(logoImageSrc) && !logoImageFailed;
  const shouldShowLogoText = Boolean((logoText || '').trim() || (logoSubtext || '').trim());
  const phoneText = siteInfo?.phone || config?.topbar?.phone || '(212) 555-0100';
  const phoneHref =
    config?.topbar?.phoneHref ||
    (phoneText ? `tel:${phoneText.replace(/[^\d+]/g, '')}` : 'tel:+12125550100');
  const ctaText = config?.cta?.text || 'Get a Quote';
  const ctaHref = config?.cta?.link || '/quote';
  const emailText = config?.topbar?.email || siteInfo?.email || '';
  const emailHref = config?.topbar?.emailHref || (emailText ? `mailto:${emailText}` : '');
  const addressText =
    config?.topbar?.address ||
    [siteInfo?.address, [siteInfo?.city, siteInfo?.state, siteInfo?.zip].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', ');
  const addressHref = config?.topbar?.addressHref || siteInfo?.addressMapUrl || '';
  const socialLinks = {
    facebook: config?.topbar?.social?.facebook || siteInfo?.social?.facebook || '',
    instagram: config?.topbar?.social?.instagram || siteInfo?.social?.instagram || '',
    linkedin: config?.topbar?.social?.linkedin || '',
    youtube: config?.topbar?.social?.youtube || siteInfo?.social?.youtube || '',
  };
  const hasTopbar =
    Boolean(phoneText) ||
    Boolean(emailText) ||
    Boolean(addressText) ||
    Boolean(socialLinks.facebook || socialLinks.instagram || socialLinks.linkedin || socialLinks.youtube);
  const isLandingPage = pathname?.startsWith('/lp/');
  const landingLang = isLandingPage ? pathname.split('/')[2] || '' : '';
  const navLinks = isLandingPage
    ? landingNavLinksByLocale[landingLang] || landingNavLinksByLocale.es
    : config?.menu?.items?.length
      ? config.menu.items
          .filter((item) => Boolean(item?.text && item?.url))
          .map((item) => ({
            name: item.text as string,
            href: item.url as string,
            hasDropdown: (item.url || '').toLowerCase() === '/products',
          }))
      : fallbackNavLinks;
  const menuVariant = (config?.menu?.variant || siteInfo?.headerVariant || 'default').toLowerCase();
  const isTransparentVariant = menuVariant === 'transparent';
  const isTransparentHeader = isTransparentVariant && !scrolled;
  const landingLanguages = [
    { id: 'en', label: 'EN' },
    { id: 'es', label: 'ES' },
    { id: 'zh', label: '中文' },
    { id: 'he', label: 'עברית' },
  ];
  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href.startsWith('#')) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const isProductsActive = pathname === '/products' || pathname?.startsWith('/products/');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = '';
      setMobileProductsOpen(false);
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileProductsOpen(false);
  }, [pathname]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        mobileOpen
          ? 'bg-white shadow-md border-b border-[var(--border)]'
          : scrolled
          ? 'bg-white shadow-md border-b border-[var(--border)]'
          : isTransparentHeader
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-sm'
      )}
    >
      {hasTopbar && (
        <div
          className={clsx(
            'hidden md:block text-white',
            isTransparentHeader ? 'bg-black/30 backdrop-blur-sm' : 'bg-[var(--primary-dark)]'
          )}
        >
          <div className="container-content">
            <div className="flex min-h-10 items-center justify-between gap-4 py-1.5 text-xs">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-on-primary-muted">
                {addressText && (
                  <a
                    href={addressHref || '#'}
                    target={addressHref ? '_blank' : undefined}
                    rel={addressHref ? 'noreferrer' : undefined}
                    className="inline-flex items-center gap-1.5 hover:text-[var(--gold-light)] transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" />
                    {addressText}
                  </a>
                )}
                {phoneText && (
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-1.5 hover:text-[var(--gold-light)] transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-[var(--gold)]" />
                    {phoneText}
                  </a>
                )}
                {emailText && (
                  <a
                    href={emailHref}
                    className="inline-flex items-center gap-1.5 hover:text-[var(--gold-light)] transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-[var(--gold)]" />
                    {emailText}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {landingLanguages.map((lang) => {
                  const langHref = lang.id === 'en' ? '/' : `/lp/${lang.id}`;
                  const isActiveLang = lang.id === 'en' ? !isLandingPage : landingLang === lang.id;
                  return (
                    <Link
                      key={lang.id}
                      href={langHref}
                      className={clsx(
                        'rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide transition-all',
                        isActiveLang
                          ? 'bg-gold-gradient text-white shadow-gold'
                          : 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
                      )}
                    >
                      {lang.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container-content">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {shouldShowLogoImage ? (
              <div className="relative h-10 w-40 flex-shrink-0">
                <Image
                  src={logoImageSrc}
                  alt={logoImageAlt}
                  fill
                  sizes="160px"
                  className="object-contain object-left"
                  onError={() => setLogoImageFailed(true)}
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-9 h-9 bg-navy-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                <PrinterIcon className="w-5 h-5 text-[var(--gold-light)]" />
              </div>
            )}
            {shouldShowLogoText && (
              <div className="flex flex-col leading-tight">
                {logoText ? (
                  <span
                    className={clsx(
                      'font-serif font-700 text-lg tracking-wide',
                      isTransparentHeader ? 'text-white' : 'text-[var(--navy)]'
                    )}
                  >
                    {logoText}
                  </span>
                ) : null}
                {logoSubtext ? (
                  <span
                    className={clsx(
                      'text-[10px] tracking-widest uppercase',
                      isTransparentHeader ? 'text-on-primary-muted' : 'text-[var(--text-secondary)]'
                    )}
                  >
                    {logoSubtext}
                  </span>
                ) : null}
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className={clsx(
                      'flex items-center gap-1 px-4 py-2 text-sm transition-colors rounded-lg',
                      isProductsActive
                        ? isTransparentHeader
                          ? 'font-semibold text-white bg-white/15'
                          : 'font-semibold text-[var(--navy)] bg-[var(--surface)]'
                        : isTransparentHeader
                          ? 'font-medium text-on-primary-muted hover:text-white hover:bg-white/10'
                          : 'font-medium text-[var(--charcoal)] hover:text-[var(--navy)] hover:bg-[var(--surface)]'
                    )}
                  >
                    {link.name}
                    <ChevronDown className={clsx('w-4 h-4 transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                  </button>

                  {/* Invisible bridge fills the gap so mouse doesn't leave the wrapper */}
                  <div className="absolute top-full left-0 h-2 w-full" />

                  <div
                    className={clsx(
                      'absolute top-[calc(100%+0.5rem)] left-0 w-72 bg-white border border-[var(--border)] rounded-xl shadow-card overflow-hidden transition-all duration-150 origin-top',
                      dropdownOpen
                        ? 'opacity-100 scale-y-100 pointer-events-auto'
                        : 'opacity-0 scale-y-95 pointer-events-none'
                    )}
                  >
                    <div className="p-2">
                      {products.map((product) => (
                        <Link
                          key={product.slug}
                          href={`/products/${product.slug}`}
                          className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-[var(--surface)] transition-colors group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="text-sm font-semibold text-[var(--navy)] group-hover:text-[var(--gold)]">
                            {product.name}
                          </span>
                          <span className="text-xs text-[var(--text-secondary)]">{product.desc}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-[var(--border)] p-2">
                      <Link
                        href="/products"
                        className="flex items-center justify-center px-3 py-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        View All Products →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    'px-4 py-2 text-sm transition-colors rounded-lg',
                    isLinkActive(link.href)
                      ? isTransparentHeader
                        ? 'font-semibold text-white bg-white/15'
                        : 'font-semibold text-[var(--navy)] bg-[var(--surface)]'
                      : isTransparentHeader
                        ? 'font-medium text-on-primary-muted hover:text-white hover:bg-white/10'
                        : 'font-medium text-[var(--charcoal)] hover:text-[var(--navy)] hover:bg-[var(--surface)]'
                  )}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          {/* Right: CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={ctaHref}
              className="bg-gold-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-gold"
            >
              {ctaText}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={clsx(
              'lg:hidden p-2 rounded-lg transition-colors',
              isTransparentHeader
                ? 'text-white hover:bg-white/10'
                : 'text-[var(--navy)] hover:bg-[var(--surface)]'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <nav
        className={clsx(
          'lg:hidden fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-[70] overflow-y-auto shadow-2xl transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <span className="font-serif font-bold text-[var(--navy)]">{logoText}</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-[var(--surface)] text-[var(--navy)]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-1">
          <div className="mb-2 grid grid-cols-4 gap-1.5">
            {landingLanguages.map((lang) => {
              const langHref = lang.id === 'en' ? '/' : `/lp/${lang.id}`;
              const isActiveLang = lang.id === 'en' ? !isLandingPage : landingLang === lang.id;
              return (
                <Link
                  key={lang.id}
                  href={langHref}
                  className={clsx(
                    'rounded-lg px-2 py-1.5 text-center text-[11px] font-bold tracking-wide transition-all',
                    isActiveLang
                      ? 'bg-gold-gradient text-white shadow-gold'
                      : 'bg-[var(--surface)] text-[var(--navy)] border border-[var(--border)]'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {lang.label}
                </Link>
              );
            })}
          </div>
          <a
            href={phoneHref}
            className="mb-2.5 flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--charcoal)]"
          >
            <Phone className="w-4 h-4 text-[var(--gold)]" />
            {phoneText}
          </a>

          {navLinks.map((link) => (
            <div key={link.name}>
              {link.hasDropdown ? (
                <>
                  <button
                    type="button"
                    className={clsx(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors',
                      isProductsActive
                        ? 'bg-[var(--surface)] font-bold text-[var(--navy)]'
                        : 'font-semibold text-[var(--navy)] hover:bg-[var(--surface)]'
                    )}
                    onClick={() => setMobileProductsOpen((prev) => !prev)}
                    aria-expanded={mobileProductsOpen}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={clsx(
                        'h-4 w-4 text-[var(--text-secondary)] transition-transform',
                        mobileProductsOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  {mobileProductsOpen && (
                    <div className="mb-1 ml-1.5 mt-1 space-y-0.5">
                      <Link
                        href="/products"
                        className="flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold text-[var(--navy)] hover:bg-[var(--surface)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        View All Products
                      </Link>
                      {products.map((product) => (
                        <Link
                          key={product.slug}
                          href={`/products/${product.slug}`}
                          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[var(--charcoal)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--navy)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="text-sm">→</span>
                          {product.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  className={clsx(
                    'flex items-center rounded-xl px-3 py-2.5 text-[15px] transition-colors',
                    isLinkActive(link.href)
                      ? 'bg-[var(--surface)] font-bold text-[var(--navy)]'
                      : 'font-semibold text-[var(--navy)] hover:bg-[var(--surface)]'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          <div className="mt-2 border-t border-[var(--border)] pt-3">
            <Link
              href={ctaHref}
              className="flex items-center justify-center rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              onClick={() => setMobileOpen(false)}
            >
              {ctaText} →
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
