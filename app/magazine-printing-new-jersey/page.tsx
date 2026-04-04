import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, MapPin, Phone, Clock, BookOpen, CheckCircle, ChevronDown, Award, Shield, Palette } from 'lucide-react';
import { loadPageContent, getRequestSiteId } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Magazine Printing in New Jersey | Epoch Press Wayne, NJ',
  description: 'Professional magazine printing in New Jersey. Saddle stitch & perfect bound, 8–324 pages. G7 color certified. ISO 9001. 48-hour rush available. Wayne, NJ facility.',
  alternates: { canonical: '/magazine-printing-new-jersey' },
};

// Data interface matching geo page pattern
interface ProductGeoPageData {
  hero: { h1: string; subheading: string; intro: string };
  specs: Array<{ label: string; value: string }>;
  caseStudy: { client: string; challenge: string; result: string; quote: string };
  certifications: Array<{ name: string; description: string }>;
  citiesServed: string[];
  faq: Array<{ question: string; answer: string }>;
}

const defaultData: ProductGeoPageData = {
  hero: {
    h1: 'Magazine Printing Services in New Jersey',
    subheading: 'Epoch Press — G7 Color Certified Magazine Production in Wayne, NJ',
    intro: 'Epoch Press has printed magazines for New Jersey publishers, brands, and agencies for over 25 years. Our 60,000 sq ft Wayne, NJ facility runs sheet-fed offset and digital presses producing saddle-stitched and perfect-bound magazines at any volume — from 250-copy short runs to 100,000+ print runs. ISO 9001 certified. G7 color matched. 48-hour rush available.',
  },
  specs: [
    { label: 'Binding Options', value: 'Perfect bound (52–324 pages), Saddle stitch (8–164 pages)' },
    { label: 'Trim Sizes', value: '5×7, 5.5×8.5, 6×9, 8.5×11, 8.25×10.75, 9×12 and more' },
    { label: 'Cover Stocks', value: '80–120 lb gloss/silk/offset, 8PT–24PT cardstock' },
    { label: 'Text Stocks', value: '40–100 lb gloss, silk, offset, uncoated, high bright' },
    { label: 'Cover Finishes', value: 'Gloss/matte/soft-touch lamination, foil stamping, embossing, spot UV, AQ coating' },
    { label: 'Color', value: '4/4 CMYK full color, Pantone matching available' },
    { label: 'Minimum Order', value: '250 copies (digital short run)' },
    { label: 'Turnaround', value: '7–10 business days standard; 48-hour rush available' },
  ],
  caseStudy: {
    client: 'Avenue Living Magazine',
    challenge: 'Inconsistent brand tones across monthly issues reduced visual continuity and impacted ad client confidence.',
    result: 'G7-calibrated color controls and tighter proofing checkpoints eliminated brand color variance. Ad client satisfaction scores increased.',
    quote: '"The consistency is obvious issue to issue. It elevated our brand instantly."',
  },
  certifications: [
    { name: 'ISO 9001:2015', description: 'Certified quality management — every magazine follows documented production standards.' },
    { name: 'G7 Color Certified', description: 'Industry-standard color calibration ensures consistent brand colors across every print run.' },
    { name: 'FSC Certified', description: 'Chain-of-custody certification for sustainably sourced paper stocks.' },
  ],
  citiesServed: [
    'Wayne', 'Paterson', 'Newark', 'Jersey City', 'Hoboken', 'Morristown',
    'Hackensack', 'Paramus', 'Fort Lee', 'Clifton', 'Passaic', 'East Orange',
    'New Brunswick', 'Edison', 'Woodbridge', 'Trenton', 'Princeton', 'Cherry Hill',
    'Camden', 'Atlantic City',
  ],
  faq: [
    { question: 'What is the minimum order for magazine printing in New Jersey?', answer: 'Our minimum order is 250 copies for digital short-run magazine printing. For offset printing, we recommend 500+ copies for the best per-unit economics. We can print as few as 50 copies for proofs or test runs.' },
    { question: 'How fast can you print magazines in NJ?', answer: 'Standard turnaround is 7–10 business days from approved proof. Rush service is available with 48-hour turnaround for most magazine formats. Contact us at 973.694.3600 for rush availability.' },
    { question: 'Can I visit the Wayne, NJ facility for a press check?', answer: 'Yes. We welcome press checks at our Wayne, NJ facility at 7 Highpoint Drive. Schedule in advance so we can coordinate your visit with your print run.' },
    { question: 'What binding options do you offer for magazines?', answer: 'We offer saddle stitch (8–164 pages) and perfect binding (52–324 pages). Saddle stitch is ideal for thinner publications; perfect binding creates a flat spine suitable for thicker magazines and catalogs.' },
    { question: 'Do you handle magazine mailing and distribution from NJ?', answer: 'We are a USPS Certified Mailer. We can handle addressing, sorting, and postal logistics for direct mail distribution of your magazines throughout New Jersey and nationwide.' },
    { question: 'What paper stocks work best for magazine printing?', answer: 'For covers, we recommend 80–100 lb gloss or silk with lamination. For interior pages, 60–80 lb gloss or silk provides excellent print quality. We carry a full range from economy to premium stocks.' },
  ],
};

function FAQSection({ items }: { items: ProductGeoPageData['faq'] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
          <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors">
            <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
            <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
          </summary>
          <div className="px-5 pb-5 text-gray-600 leading-relaxed">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

export default async function MagazinePrintingNJPage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<ProductGeoPageData>('magazine-printing-new-jersey', 'en', siteId);
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

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Magazine Printing in New Jersey',
    description: 'Professional magazine printing services including saddle stitch, perfect binding, and full-color offset production.',
    provider: {
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
    },
    areaServed: { '@type': 'State', name: 'New Jersey' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Magazine Printing Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Saddle Stitch Magazine Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Perfect Bound Magazine Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Short Run Magazines' } },
      ],
    },
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Epoch Press',
    address: { '@type': 'PostalAddress', streetAddress: '7 Highpoint Drive', addressLocality: 'Wayne', addressRegion: 'NJ', postalCode: '07470' },
    telephone: '973.694.3600',
    url: 'https://epoch-press.com',
    areaServed: { '@type': 'State', name: 'New Jersey' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      {/* Hero */}
      <section className="bg-navy-gradient text-white pt-36 md:pt-40 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <p className="text-amber-400 font-medium tracking-wide uppercase text-sm">Magazine Printing</p>
          </div>
          <h1 className="font-serif text-[var(--gold-light)] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            {data.hero.h1}
          </h1>
          <p className="text-xl text-amber-200 font-medium mb-4">{data.hero.subheading}</p>
          <p className="text-lg text-gray-300 max-w-3xl mb-10 leading-relaxed">{data.hero.intro}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote?product=magazine-printing" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors text-lg">
              Get a Magazine Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="tel:9736943600" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg transition-colors">
              <Phone className="w-5 h-5" /> 973.694.3600
            </Link>
          </div>
        </div>
      </section>

      {/* Specs Table */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Magazine Specifications</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Full range of binding, paper, and finishing options for any magazine format.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {data.specs.map((spec) => (
              <div key={spec.label} className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 text-sm">{spec.label}</span>
                  <p className="text-sm text-gray-600 mt-1">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products/magazine-printing" className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:underline">
              View full magazine product details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Proven Results for Magazine Publishers</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-wide mb-2">Case Study</p>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{data.caseStudy.client}</h3>
            <div className="space-y-3 mb-6">
              <p className="text-gray-600"><span className="font-semibold text-gray-900">Challenge:</span> {data.caseStudy.challenge}</p>
              <p className="text-gray-600"><span className="font-semibold text-gray-900">Result:</span> {data.caseStudy.result}</p>
            </div>
            <blockquote className="border-l-4 border-amber-400 pl-4 italic text-gray-700">{data.caseStudy.quote}</blockquote>
            <div className="mt-6">
              <Link href="/case-studies" className="inline-flex items-center gap-2 text-amber-600 font-semibold text-sm hover:underline">
                Read more case studies <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Quality Certifications</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {data.certifications.map((cert) => (
              <div key={cert.name} className="text-center p-6 border border-gray-200 rounded-lg">
                <Award className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our New Jersey Facility</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-8 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Epoch Press — Wayne, NJ</h3>
              <p className="text-gray-600 mb-4">Primary production facility — 60,000 sq ft with sheet-fed offset, digital presses, prepress, and full finishing capabilities.</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /><span>7 Highpoint Drive, Wayne, NJ 07470</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" /><a href="tel:9736943600" className="hover:text-amber-600">973.694.3600</a></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><span>Mon–Fri 8AM–6PM, Sat 9AM–2PM</span></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-8 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Equipment for Magazine Production</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Sheet-fed offset presses — up to 18,000 sheets/hour</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Digital presses — 1,200 DPI for short-run magazines</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Perfect binding and saddle stitch bindery lines</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Inline lamination, UV coating, and foil stamping</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />G7-calibrated color management system</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Served */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Magazine Printing Across New Jersey</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            We serve magazine publishers throughout the state from our Wayne, NJ facility.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {data.citiesServed.map((city) => (
              <span key={city} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">{city}, NJ</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Magazine Printing in NJ — Common Questions</h2>
          <FAQSection items={data.faq} />
        </div>
      </section>

      {/* Cross Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Printing Services</h2>
          <p className="text-gray-600 mb-6 text-sm">Epoch Press offers a full range of commercial printing in New Jersey.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products/magazine-printing" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              All Magazine Specs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/book-printing-new-jersey" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Book Printing in NJ <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/marketing-printing-new-jersey" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Marketing Print in NJ <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/commercial-printing-new-jersey" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              All NJ Printing Services <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/magazine-printing-new-york" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Magazine Printing in NY <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-gradient text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4 text-[var(--gold-light)]">Ready to Print Your Magazine?</h2>
          <p className="text-gray-300 mb-8 text-lg">Tell us about your magazine project and we'll send a detailed quote within 24 hours.</p>
          <Link href="/quote?product=magazine-printing" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-10 py-4 rounded-lg transition-colors text-lg">
            Get a Magazine Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
