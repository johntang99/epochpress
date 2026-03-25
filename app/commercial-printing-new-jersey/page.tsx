import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, MapPin, Phone, Clock, Printer, BookOpen, BookMarked, Newspaper, FileText, Image, CreditCard, UtensilsCrossed, CheckCircle, ChevronDown, type LucideIcon } from 'lucide-react';

const serviceIconMap: Record<string, LucideIcon> = {
  'Newspaper Printing': Newspaper,
  'Magazine Printing': BookOpen,
  'Book Printing': BookMarked,
  'Marketing Print': FileText,
  'Menu Printing': UtensilsCrossed,
  'Large Format': Image,
  'Business Cards': CreditCard,
  'Offset Printing': Printer,
};
import { loadPageContent, getRequestSiteId } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Commercial Printing in New Jersey',
  description: 'Full-service commercial printing in New Jersey. Newspapers, magazines, books, marketing materials. Two NJ/NY facilities, fast turnaround. Request a quote.',
  alternates: { canonical: '/commercial-printing-new-jersey' },
};

interface LandingPageData {
  hero: {
    h1: string;
    subheading: string;
    intro: string;
  };
  services: Array<{
    name: string;
    slug: string;
    description: string;
    icon: string;
  }>;
  industries: Array<{
    name: string;
    description: string;
  }>;
  facilities: Array<{
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    role: string;
  }>;
  whyChooseUs: Array<{
    title: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

const defaultData: LandingPageData = {
  hero: {
    h1: 'Commercial Printing Company in New Jersey',
    subheading: 'Epoch Press — Full-Service Printing for Publishers, Brands & Agencies',
    intro: 'Epoch Press has served New Jersey publishers, businesses, and organizations for over 25 years. Our Wayne, NJ production facility runs advanced offset and digital presses capable of printing newspapers, magazines, books, catalogs, and marketing materials at any volume — with turnaround times that keep your deadlines on track.',
  },
  services: [
    { name: 'Newspaper Printing', slug: '/products/newspaper-printing', description: 'Tabloid, broadsheet, and community newspaper production. Offset quality at competitive rates.', icon: 'Newspaper' },
    { name: 'Magazine Printing', slug: '/products/magazine-printing', description: 'Saddle-stitch and perfect-bound magazines. Full color, premium paper options.', icon: 'BookOpen' },
    { name: 'Book Printing', slug: '/products/book-printing', description: 'Softcover and hardcover book production. Short runs to high-volume publishing.', icon: 'BookMarked' },
    { name: 'Marketing Print', slug: '/products/marketing-print', description: 'Flyers, brochures, postcards, and direct mail for campaigns and events.', icon: 'FileText' },
    { name: 'Menu Printing', slug: '/products/menu-printing', description: 'Restaurant menus — laminated, folded, multi-page. Durable finishes.', icon: 'UtensilsCrossed' },
    { name: 'Large Format', slug: '/products/large-format', description: 'Banners, posters, signage, and trade show graphics. High-resolution output.', icon: 'MonitorPlay' },
    { name: 'Business Cards', slug: '/products/business-cards', description: 'Premium business cards — standard, thick stock, specialty finishes.', icon: 'CreditCard' },
    { name: 'Offset Printing', slug: '/offset-printing', description: 'High-volume offset printing with precise color control and fast makeready.', icon: 'Printer' },
  ],
  industries: [
    { name: 'Publishers & Media', description: 'Newspapers, magazines, journals, and periodicals. Weekly to monthly schedules.' },
    { name: 'Agencies & Brands', description: 'Marketing collateral, catalogs, and direct mail campaigns.' },
    { name: 'Restaurants & Hospitality', description: 'Menus, table tents, promotional materials. Multi-location support.' },
    { name: 'Schools & Nonprofits', description: 'Yearbooks, event programs, fundraising materials. Competitive pricing.' },
    { name: 'Authors & Self-Publishers', description: 'Short-run and high-volume book printing. Fulfillment support available.' },
    { name: 'Government & Institutions', description: 'Compliance printing, forms, reports. Secure handling available.' },
  ],
  facilities: [
    { name: 'Epoch Press — Wayne, NJ', address: '7 Highpoint Drive', city: 'Wayne', state: 'NJ', zip: '07470', phone: '973.694.3600', role: 'Primary production facility — offset & digital presses, prepress, finishing, and fulfillment' },
    { name: 'Epoch Press — Middletown, NY', address: '', city: 'Middletown', state: 'NY', zip: '', phone: '', role: 'Secondary production facility — additional press capacity and regional distribution' },
  ],
  whyChooseUs: [
    { title: '25+ Years of Experience', description: 'Serving New Jersey publishers, brands, and organizations since 1999. We understand the printing needs of the tri-state market.' },
    { title: 'Two Production Facilities', description: 'Our Wayne, NJ and Middletown, NY plants give us the capacity and geographic reach to handle large and time-sensitive projects.' },
    { title: 'Fast Turnaround', description: '48-hour rush service available. Standard projects typically ship within 5–7 business days. We hit deadlines consistently.' },
    { title: 'Offset + Digital Capability', description: 'From 500-copy short runs to 100,000+ print runs, we match the right press technology to your project for optimal quality and cost.' },
  ],
  faq: [
    { question: 'What types of printing does Epoch Press handle?', answer: 'We print newspapers, magazines, books, marketing materials (flyers, brochures, postcards), menus, business cards, calendars, and large-format signage. Both offset and digital printing available.' },
    { question: 'How fast can you turn around a print job?', answer: 'Standard turnaround is 5–7 business days from approved proofs. Rush service is available with 48-hour turnaround for most products. Contact us for specific timelines on your project.' },
    { question: 'Do you serve all of New Jersey?', answer: 'Yes. Our Wayne, NJ facility serves clients throughout New Jersey, from North Jersey and the NYC metro area to Central and South Jersey. We also serve New York and the broader tri-state region from our Middletown, NY facility.' },
    { question: 'How do I get a quote?', answer: 'Use our online quote form at epochpress.com/quote or call us at 973.694.3600. We typically respond within 24 hours with a detailed estimate. Include your specs, quantity, paper preference, and desired turnaround.' },
    { question: 'What file formats do you accept?', answer: 'We accept print-ready PDFs (preferred), Adobe InDesign, Illustrator, and Photoshop files. See our file guidelines page for detailed specs on resolution, bleed, color profiles, and submission requirements.' },
    { question: 'Do you offer design services?', answer: 'We focus on production printing. We work with your existing files or your designer\'s files. If you need design help, we can recommend trusted partners in the NJ/NY area.' },
  ],
};

function FAQSection({ items }: { items: LandingPageData['faq'] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
          <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors">
            <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
            <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
          </summary>
          <div className="px-5 pb-5 text-gray-600 leading-relaxed">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

export default async function CommercialPrintingNJPage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<LandingPageData>('commercial-printing-new-jersey', 'en', siteId);
  const data = dbContent ?? defaultData;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Epoch Press',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '7 Highpoint Drive',
      addressLocality: 'Wayne',
      addressRegion: 'NJ',
      postalCode: '07470',
    },
    telephone: '973.694.3600',
    url: 'https://epoch-press.com',
    areaServed: { '@type': 'State', name: 'New Jersey' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      {/* Hero */}
      <section className="bg-navy-gradient text-white pt-36 md:pt-40 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-amber-400 font-medium mb-4 tracking-wide uppercase text-sm">Full-Service Commercial Printer</p>
          <h1 className="font-serif text-[var(--gold-light)] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            {data.hero.h1}
          </h1>
          <p className="text-xl text-amber-200 font-medium mb-4">{data.hero.subheading}</p>
          <p className="text-lg text-gray-300 max-w-3xl mb-10 leading-relaxed">{data.hero.intro}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors text-lg">
              Request a Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="tel:9736943600" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg transition-colors">
              <Phone className="w-5 h-5" /> 973.694.3600
            </Link>
          </div>
        </div>
      </section>

      {/* What We Print */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">What We Print</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            From short-run digital to high-volume offset, Epoch Press produces a full range of commercial print products for New Jersey businesses and beyond.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.services.map((service) => (
              <Link
                key={service.name}
                href={service.slug}
                className="group flex flex-col items-center text-center border border-gray-200 rounded-lg p-6 hover:border-amber-300 hover:shadow-lg transition-all"
              >
                {(() => { const Icon = serviceIconMap[service.name] || Printer; return (
                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
                ); })()}
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">{service.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Industries We Serve in New Jersey</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.industries.map((industry) => (
              <div key={industry.name} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Facilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Production Facilities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.facilities.map((facility) => (
              <div key={facility.name} className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{facility.name}</h3>
                <p className="text-gray-600 mb-4">{facility.role}</p>
                <div className="space-y-2 text-sm text-gray-700">
                  {facility.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{facility.address}, {facility.city}, {facility.state} {facility.zip}</span>
                    </div>
                  )}
                  {facility.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <a href={`tel:${facility.phone.replace(/\./g, '')}`} className="hover:text-amber-600">{facility.phone}</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-8">
            Also serving clients in <Link href="/commercial-printing-new-york" className="text-amber-600 font-medium hover:underline">New York</Link> and the <Link href="/commercial-printing-tri-state" className="text-amber-600 font-medium hover:underline">tri-state area</Link>.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why New Jersey Businesses Choose Epoch Press</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {data.whyChooseUs.map((item) => (
              <div key={item.title} className="flex gap-4">
                <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Commercial Printing in NJ — Common Questions</h2>
          <FAQSection items={data.faq} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-gradient text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4 text-[var(--gold-light)]">Ready to Start Your Print Project?</h2>
          <p className="text-gray-300 mb-8 text-lg">Tell us about your project and we'll send you a detailed quote within 24 hours.</p>
          <Link href="/quote" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-10 py-4 rounded-lg transition-colors text-lg">
            Get a Custom Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
