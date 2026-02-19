import Link from 'next/link';
import { Phone, Mail, MapPin, PrinterIcon } from 'lucide-react';
import type { FooterSection, SiteInfo } from '@/lib/types';

const productLinks = [
  { name: 'Newspaper Printing', href: '/products/newspaper-printing' },
  { name: 'Magazine Printing', href: '/products/magazine-printing' },
  { name: 'Book Printing', href: '/products/book-printing' },
  { name: 'Marketing Print', href: '/products/marketing-print' },
  { name: 'Menu Printing', href: '/products/menu-printing' },
  { name: 'Business Cards', href: '/products/business-cards' },
  { name: 'Large Format', href: '/products/large-format' },
];

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'File Guidelines', href: '/file-guidelines' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

const fallbackFooter: FooterSection = {
  brand: {
    name: 'Epoch Press',
    logoText: 'EP',
    description: 'Premium commercial printing for businesses, publishers, and agencies.',
  },
  contact: {
    phone: '(212) 555-0100',
    phoneLink: 'tel:+12125550100',
    email: 'info@epochpress.com',
    emailLink: 'mailto:info@epochpress.com',
    addressLines: ['123 Press Way', 'New York, NY 10001'],
  },
  hours: ['Mon–Fri: 8:00 AM – 6:00 PM', 'Sat: 9:00 AM – 2:00 PM'],
  services: productLinks.map((item) => ({ text: item.name, url: item.href })),
  quickLinks: companyLinks.map((item) => ({ text: item.name, url: item.href })),
  legalLinks: [
    { text: 'Privacy Policy', url: '/privacy' },
    { text: 'Terms of Service', url: '/terms' },
  ],
  copyright: '© {year} Epoch Press. All rights reserved.',
};

export function Footer({
  config,
  siteInfo,
}: {
  config?: Record<string, unknown> | null;
  siteInfo?: SiteInfo | null;
}) {
  const year = new Date().getFullYear();
  const footer = (config as FooterSection | null) ?? fallbackFooter;
  const brandName = footer.brand?.name || fallbackFooter.brand.name;
  const brandDescription = footer.brand?.description || fallbackFooter.brand.description;
  const phone = siteInfo?.phone || footer.contact?.phone || fallbackFooter.contact.phone;
  const phoneLink = footer.contact?.phoneLink || `tel:${phone.replace(/[^\d+]/g, '')}`;
  const email = siteInfo?.email || footer.contact?.email || fallbackFooter.contact.email;
  const emailLink = footer.contact?.emailLink || `mailto:${email}`;
  const siteAddressLine = [siteInfo?.address, [siteInfo?.city, siteInfo?.state, siteInfo?.zip].filter(Boolean).join(' ')]
    .filter(Boolean) as string[];
  const address =
    siteAddressLine.length > 0
      ? siteAddressLine
      : footer.contact?.addressLines || fallbackFooter.contact.addressLines;
  const footerHours = footer.hours?.length ? footer.hours : fallbackFooter.hours;
  const quickLinks = footer.quickLinks?.length
    ? footer.quickLinks.map((item) => ({ name: item.text, href: item.url }))
    : companyLinks;
  const services = footer.services?.length
    ? footer.services.map((item) => ({ name: item.text, href: item.url }))
    : productLinks;
  const legalLinks = footer.legalLinks?.length
    ? footer.legalLinks.map((item) => ({ name: item.text, href: item.url }))
    : [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
      ];
  const copyright = (footer.copyright || fallbackFooter.copyright).replace(
    '{year}',
    String(year)
  );

  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="container-content py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gold-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                <PrinterIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-bold text-lg text-white tracking-wide">
                {brandName.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed mb-6">
              {brandDescription}
            </p>
            <div className="space-y-3">
              <a
                href={phoneLink}
                className="flex items-center gap-2 text-sm text-blue-100 hover:text-[var(--gold-light)] transition-colors"
              >
                <Phone className="w-4 h-4 text-[var(--gold)]" />
                {phone}
              </a>
              <a
                href={emailLink}
                className="flex items-center gap-2 text-sm text-blue-100 hover:text-[var(--gold-light)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--gold)]" />
                {email}
              </a>
              <div className="flex items-start gap-2 text-sm text-blue-100">
                <MapPin className="w-4 h-4 text-[var(--gold)] mt-0.5 flex-shrink-0" />
                <span>{address.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-5 text-sm tracking-wider uppercase">
              Products
            </h4>
            <ul className="space-y-1.5">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-0 py-0.5 text-sm text-blue-200 hover:text-[var(--gold-light)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-5 text-sm tracking-wider uppercase">
              Company
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-0 py-0.5 text-sm text-blue-200 hover:text-[var(--gold-light)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-5 text-sm tracking-wider uppercase">
              Start a Project
            </h4>
            <p className="text-sm text-blue-200 leading-relaxed mb-5">
              Ready to bring your print project to life? Get a custom quote today.
            </p>
            <Link
              href="/quote"
              className="inline-block bg-gold-gradient text-white font-semibold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-gold"
            >
              Request a Quote →
            </Link>
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-xs text-blue-200 mb-1">Business Hours</p>
              {footerHours.map((line) => (
                <p key={line} className="text-sm text-white">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-content py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-blue-300">
              {copyright}
            </p>
            <div className="flex items-center gap-5">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-blue-300 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
