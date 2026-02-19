'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  PrinterIcon,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import clsx from 'clsx';
import type { SiteInfo } from '@/lib/types';

const products = [
  { name: 'Newspapers', slug: 'newspaper-printing', desc: 'Broadsheet, tabloid, inserts' },
  { name: 'Magazines', slug: 'magazine-printing', desc: 'Perfect bind, saddle stitch' },
  { name: 'Books', slug: 'book-printing', desc: 'Offset, digital, print-on-demand' },
  { name: 'Marketing Print', slug: 'marketing-print', desc: 'Flyers, brochures, postcards' },
  { name: 'Menus', slug: 'menu-printing', desc: 'Dine-in, takeout, laminated' },
  { name: 'Business Cards', slug: 'business-cards', desc: 'Standard, premium, luxury' },
  { name: 'Large Format', slug: 'large-format', desc: 'Banners, signage, displays' },
];

const fallbackNavLinks = [
  { name: 'Products', href: '/products', hasDropdown: true },
  { name: 'About', href: '/about', hasDropdown: false },
  { name: 'Portfolio', href: '/portfolio', hasDropdown: false },
  { name: 'Blog', href: '/blog', hasDropdown: false },
  { name: 'Contact', href: '/contact', hasDropdown: false },
];

type HeaderConfig = {
  menu?: {
    logo?: { text?: string; subtext?: string };
    items?: Array<{ text?: string; url?: string }>;
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logoText = config?.menu?.logo?.text || 'EPOCH PRESS';
  const logoSubtext = config?.menu?.logo?.subtext || 'Commercial Printing';
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
  const navLinks =
    config?.menu?.items?.length
      ? config.menu.items
          .filter((item) => Boolean(item?.text && item?.url))
          .map((item) => ({
            name: item.text as string,
            href: item.url as string,
            hasDropdown: (item.url || '').toLowerCase() === '/products',
          }))
      : fallbackNavLinks;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white shadow-md border-b border-[var(--border)]'
          : 'bg-white/95 backdrop-blur-sm'
      )}
    >
      {hasTopbar && (
        <div className="hidden md:block border-b border-white/10 bg-[var(--primary-dark)] text-white">
          <div className="container-content">
            <div className="flex min-h-10 items-center justify-between gap-4 py-1.5 text-xs">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-blue-100">
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
              <div className="flex items-center gap-3 text-blue-100">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="hover:text-[var(--gold-light)] transition-colors"
                  >
                    <Facebook className="h-3.5 w-3.5" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="hover:text-[var(--gold-light)] transition-colors"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-[var(--gold-light)] transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="hover:text-[var(--gold-light)] transition-colors"
                  >
                    <Youtube className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container-content">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-navy-gradient rounded-lg flex items-center justify-center flex-shrink-0">
              <PrinterIcon className="w-5 h-5 text-[var(--gold-light)]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif font-700 text-[var(--navy)] text-lg tracking-wide">
                {logoText}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] tracking-widest uppercase">
                {logoSubtext}
              </span>
            </div>
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
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--charcoal)] hover:text-[var(--navy)] transition-colors rounded-lg hover:bg-[var(--surface)]">
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
                  className="px-4 py-2 text-sm font-medium text-[var(--charcoal)] hover:text-[var(--navy)] transition-colors rounded-lg hover:bg-[var(--surface)]"
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
            className="lg:hidden p-2 rounded-lg text-[var(--navy)] hover:bg-[var(--surface)] transition-colors"
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
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <nav
        className={clsx(
          'lg:hidden fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-40 overflow-y-auto shadow-2xl transition-transform duration-300',
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

        <div className="p-4 space-y-1">
          <a
            href={phoneHref}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[var(--charcoal)] bg-[var(--surface)] rounded-xl mb-3"
          >
            <Phone className="w-4 h-4 text-[var(--gold)]" />
            {phoneText}
          </a>

          {navLinks.map((link) => (
            <div key={link.name}>
              <Link
                href={link.href}
                className="flex items-center px-4 py-3 text-base font-semibold text-[var(--navy)] hover:bg-[var(--surface)] rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
              {link.hasDropdown && (
                <div className="ml-3 mb-2 space-y-0.5">
                  {products.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--charcoal)] hover:text-[var(--navy)] hover:bg-[var(--surface)] rounded-xl transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="text-base">→</span>
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-[var(--border)] mt-2">
            <Link
              href={ctaHref}
              className="flex items-center justify-center bg-gold-gradient text-white font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
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
