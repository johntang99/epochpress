import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, MapPin, Phone, Clock, UtensilsCrossed, CheckCircle, ChevronDown, Award, Shield, Palette } from 'lucide-react';
import { loadPageContent, getRequestSiteId } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Menu Printing in New Jersey | Restaurant Menus, Laminated & Folded',
  description: 'Professional menu printing in New Jersey. Laminated, folded, and multi-page restaurant menus. Wipe-clean finishes. Bilingual support. Minimum 25 copies. 48-hour rush available. Wayne, NJ facility.',
  alternates: { canonical: '/menu-printing-new-jersey' },
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
    h1: 'Restaurant Menu Printing in New Jersey',
    subheading: 'Epoch Press — Professional Menu Production in Wayne, NJ',
    intro: 'Epoch Press serves NJ restaurants, hospitality groups, and cafés with professionally printed menus. We produce laminated, folded, and multi-page menus with durable wipe-clean finishes built for restaurant use. Bilingual and multilingual support available. Minimum 25 copies. 48-hour rush available.',
  },
  specs: [
    { label: 'Formats', value: 'Bi-fold, Tri-fold, Multi-panel, Single-sheet flat, Placemat' },
    { label: 'Page Counts', value: '4, 8, 12, 16, 20, 24 pages' },
    { label: 'Paper', value: '60–100 lb gloss, silk, offset' },
    { label: 'Finishing', value: 'Gloss/matte/soft-touch lamination, wipe-clean durable design' },
    { label: 'Color', value: 'Full 4-color CMYK' },
    { label: 'Languages', value: 'Bilingual and multilingual support' },
    { label: 'Minimum Order', value: '25 copies' },
    { label: 'Turnaround', value: '3–5 days standard; 48-hour rush available' },
  ],
  caseStudy: {
    client: 'Hospitality Franchise Group',
    challenge: 'Store-level print quality varied by market, weakening brand presentation across 40+ locations.',
    result: 'Standardized templates, controlled production specs, and synchronized fulfillment achieved visual consistency across all locations within one rollout cycle.',
    quote: '"Epoch Press turned a fragmented print operation into a reliable system."',
  },
  certifications: [
    { name: 'ISO 9001:2015', description: 'Certified quality management — every menu follows documented production standards.' },
    { name: 'FSC Certified', description: 'Chain-of-custody certification for sustainably sourced paper stocks.' },
    { name: 'Food-Safe Lamination', description: 'Durable, wipe-clean laminated finishes suitable for restaurant environments — spill-resistant and long-lasting.' },
  ],
  citiesServed: [
    'Wayne', 'Paterson', 'Newark', 'Jersey City', 'Hoboken', 'Morristown',
    'Hackensack', 'Paramus', 'Fort Lee', 'Clifton', 'Passaic', 'East Orange',
    'New Brunswick', 'Edison', 'Woodbridge', 'Trenton', 'Princeton', 'Cherry Hill',
    'Camden', 'Atlantic City',
  ],
  faq: [
    { question: 'What is the minimum order for restaurant menu printing?', answer: 'Our minimum order for restaurant menu printing is 25 copies. This makes it easy for individual restaurants, cafés, and small chains to get professionally printed menus without large commitments.' },
    { question: 'Do you offer laminated menus?', answer: 'Yes. We offer gloss, matte, and soft-touch lamination — all with wipe-clean finishes designed for restaurant use. Laminated menus are spill-resistant and built to last in high-traffic dining environments.' },
    { question: 'Can you print bilingual menus?', answer: 'Yes. We offer full bilingual and multilingual support for restaurant menus. Our prepress team handles multi-language layouts to ensure clean typography and correct formatting across all languages.' },
    { question: 'How fast can you print menus in NJ?', answer: 'Standard turnaround is 3–5 business days from approved proof. 48-hour rush service is available for most menu formats. Contact us at 973.694.3600 for rush availability.' },
    { question: 'Do you handle multi-location restaurant menu rollouts?', answer: 'Yes. We produce standardized templates with controlled production specs and synchronized delivery to ensure brand consistency across all locations — whether you have 5 or 50+ restaurants.' },
    { question: 'What size menus do you print?', answer: 'We print bi-fold, tri-fold, and multi-page menus from 4 to 24 pages, as well as single-sheet flat menus and placemats. Custom sizes and formats are available on request.' },
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

export default async function MenuPrintingNJPage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<ProductGeoPageData>('menu-printing-new-jersey', 'en', siteId);
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
    name: 'Menu Printing in New Jersey',
    description: 'Professional menu printing services including laminated menus, multi-page menus, and restaurant menu design production.',
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
      name: 'Menu Printing Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Laminated Menu Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Multi-Page Menu Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Restaurant Menu Design Production' } },
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
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
            <p className="text-amber-400 font-medium tracking-wide uppercase text-sm">Menu Printing</p>
          </div>
          <h1 className="font-serif text-[var(--gold-light)] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            {data.hero.h1}
          </h1>
          <p className="text-xl text-amber-200 font-medium mb-4">{data.hero.subheading}</p>
          <p className="text-lg text-gray-300 max-w-3xl mb-10 leading-relaxed">{data.hero.intro}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote?product=menu-printing" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors text-lg">
              Get a Menu Quote <ArrowRight className="w-5 h-5" />
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Menu Specifications</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Full range of formats, paper, and finishing options for any restaurant menu.
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
            <Link href="/products/menu-printing" className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:underline">
              View full menu product details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Proven Results for Restaurants</h2>
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">Equipment for Menu Production</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Sheet-fed offset presses — up to 18,000 sheets/hour</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Digital presses — 1,200 DPI for short-run menus</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Inline lamination for wipe-clean durable finishes</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Folding and scoring for bi-fold and tri-fold menus</li>
                <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />Color management system for consistent brand reproduction</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Served */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Menu Printing Across New Jersey</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            We serve restaurants and hospitality groups throughout the state from our Wayne, NJ facility.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Menu Printing in NJ — Common Questions</h2>
          <FAQSection items={data.faq} />
        </div>
      </section>

      {/* Cross Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Printing Services</h2>
          <p className="text-gray-600 mb-6 text-sm">Epoch Press offers a full range of commercial printing in New Jersey.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products/menu-printing" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              All Menu Specs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/menu-printing-new-york" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Menu Printing in NY <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/magazine-printing-new-jersey" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Magazine Printing in NJ <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/marketing-printing-new-jersey" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Marketing Print in NJ <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/commercial-printing-new-jersey" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              All NJ Printing Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-gradient text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4 text-[var(--gold-light)]">Ready to Print Your Menus?</h2>
          <p className="text-gray-300 mb-8 text-lg">Tell us about your menu project and we'll send a detailed quote within 24 hours.</p>
          <Link href="/quote?product=menu-printing" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-10 py-4 rounded-lg transition-colors text-lg">
            Get a Menu Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
