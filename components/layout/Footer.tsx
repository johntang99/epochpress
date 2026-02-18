import Link from 'next/link';
import { Phone, Mail, MapPin, PrinterIcon } from 'lucide-react';

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

export function Footer() {
  const year = new Date().getFullYear();

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
                EPOCH PRESS
              </span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed mb-6">
              Premium commercial printing for businesses, publishers, and agencies. Quality that speaks for itself.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+12125550100"
                className="flex items-center gap-2 text-sm text-blue-100 hover:text-[var(--gold-light)] transition-colors"
              >
                <Phone className="w-4 h-4 text-[var(--gold)]" />
                (212) 555-0100
              </a>
              <a
                href="mailto:info@epochpress.com"
                className="flex items-center gap-2 text-sm text-blue-100 hover:text-[var(--gold-light)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--gold)]" />
                info@epochpress.com
              </a>
              <div className="flex items-start gap-2 text-sm text-blue-100">
                <MapPin className="w-4 h-4 text-[var(--gold)] mt-0.5 flex-shrink-0" />
                <span>123 Press Way, New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-serif font-semibold text-white mb-5 text-sm tracking-wider uppercase">
              Products
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200 hover:text-[var(--gold-light)] transition-colors"
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
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200 hover:text-[var(--gold-light)] transition-colors"
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
              <p className="text-sm text-white">Mon–Fri: 8:00 AM – 6:00 PM</p>
              <p className="text-sm text-white">Sat: 9:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-content py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-blue-300">
              © {year} Epoch Press. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="text-xs text-blue-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-blue-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/file-guidelines" className="text-xs text-blue-300 hover:text-white transition-colors">
                File Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
