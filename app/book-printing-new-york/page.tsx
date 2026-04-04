import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, MapPin, Phone, Clock, BookMarked, CheckCircle, ChevronDown, Award, Shield, Palette } from 'lucide-react';
import { loadPageContent, getRequestSiteId } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Book Printing in New York | Epoch Press',
  description: 'Professional book printing in New York. Perfect bound, hardcover, saddle stitch, sewn bound. Print-on-demand from 1 copy. ISO 9001. Middletown NY & Wayne NJ facilities.',
  alternates: { canonical: '/book-printing-new-york' },
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
    h1: 'Book Printing Services in New York',
    subheading: 'Epoch Press — Professional Book Production Serving New York',
    intro: 'Epoch Press has printed books for New York publishers, self-publishers, and authors for over 25 years. Our Middletown, NY regional facility and Wayne, NJ primary production plant run sheet-fed offset and digital presses producing perfect-bound, hardcover, and saddle-stitched books at any volume — from print-on-demand single copies to long production runs. ISO 9001 certified.',
  },
  specs: [
    { label: 'Binding Options', value: 'Perfect bound, Saddle stitch, Sewn bound, Hard cover (Smyth sewn), Hard cover with fabric/jacket' },
    { label: 'Page Range', value: '8–148 pages' },
    { label: 'Formats', value: 'Paperback, Hardcover, Notebooks, Albums' },
    { label: 'Cover Materials', value: 'Cardstock, Fabric covers, Dust jackets' },
    { label: 'Text Stocks', value: '40–100 lb gloss, silk, offset, uncoated, cream' },
    { label: 'Finishing', value: 'Lamination, foil stamping, embossing, UV, AQ coating' },
    { label: 'Minimum Order', value: '1 copy (print-on-demand)' },
    { label: 'Turnaround', value: '5–7 days standard; 2–3 days POD; 48-hour rush available' },
  ],
  caseStudy: {
    client: 'Independent Education Publisher',
    challenge: 'Frequent content revisions made large runs risky and costly.',
    result: 'Epoch Press structured a hybrid short-run program with staged quantities and repeatable finishing specs. Inventory waste reduced by 32% while maintaining launch schedules.',
    quote: '"We moved faster with less risk and better unit economics."',
  },
  certifications: [
    { name: 'ISO 9001:2015', description: 'Certified quality management — every book follows documented production standards.' },
    { name: 'G7 Color Certified', description: 'Industry-standard color calibration ensures consistent reproduction across every print run.' },
    { name: 'FSC Certified', description: 'Chain-of-custody certification for sustainably sourced paper stocks.' },
  ],
  citiesServed: [
    'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Yonkers',
    'White Plains', 'New Rochelle', 'Middletown', 'Newburgh', 'Poughkeepsie',
    'Kingston', 'Albany', 'Syracuse', 'Buffalo', 'Rochester', 'Long Island',
    'Westchester', 'Rockland County', 'Orange County',
  ],
  faq: [
    { question: 'What is the minimum order for book printing in New York?', answer: 'We offer print-on-demand starting at just 1 copy for digital book printing. For offset printing, we recommend 500+ copies for the best per-unit economics. Short runs of any quantity are available.' },
    { question: 'How fast can you print books in NY?', answer: 'Print-on-demand orders ship in 2–3 business days. Standard production turnaround is 5–7 business days from approved proof. Rush service is available with 48-hour turnaround for most book formats. Contact us at 973.694.3600 for rush availability.' },
    { question: 'Do you have a facility in New York?', answer: 'Yes. Our Middletown, NY facility provides regional production capacity for New York clients. Our primary production plant is in Wayne, NJ — just across the border — with 60,000 sq ft of offset, digital, and finishing capabilities.' },
    { question: 'What binding options do you offer for books?', answer: 'We offer perfect binding, saddle stitch, sewn binding, Smyth sewn hardcover, and hardcover with fabric or dust jacket. We can help you choose the right binding for your format, page count, and budget.' },
    { question: 'Can you print hardcover books with dust jackets?', answer: 'Yes. We produce full case-bound hardcovers with Smyth sewn binding, fabric covers, and printed dust jackets. Foil stamping and embossing on covers are also available.' },
    { question: 'What paper stocks work best for book printing?', answer: 'For text pages, we offer 40–100 lb options in gloss, silk, offset, uncoated, and cream stocks. Cream uncoated is popular for novels and trade books. Gloss or silk works well for photo books and art books. We carry a full range from economy to premium stocks.' },
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

export default async function BookPrintingNYPage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<ProductGeoPageData>('book-printing-new-york', 'en', siteId);
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
    name: 'Book Printing in New York',
    description: 'Professional book printing services including perfect binding, hardcover, saddle stitch, and print-on-demand production.',
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
    areaServed: { '@type': 'State', name: 'New York' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Book Printing Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Perfect Bound Book Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hardcover Book Printing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Print-on-Demand Books' } },
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
    areaServed: { '@type': 'State', name: 'New York' },
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
            <BookMarked className="w-5 h-5 text-amber-400" />
            <p className="text-amber-400 font-medium tracking-wide uppercase text-sm">Book Printing</p>
          </div>
          <h1 className="font-serif text-[var(--gold-light)] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            {data.hero.h1}
          </h1>
          <p className="text-xl text-amber-200 font-medium mb-4">{data.hero.subheading}</p>
          <p className="text-lg text-gray-300 max-w-3xl mb-10 leading-relaxed">{data.hero.intro}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote?product=book-printing" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors text-lg">
              Get a Book Printing Quote <ArrowRight className="w-5 h-5" />
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Book Specifications</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Full range of binding, paper, and finishing options for any book format.
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
            <Link href="/products/book-printing" className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:underline">
              View full book product details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Proven Results for Book Publishers</h2>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Facilities Serving New York</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-8 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Epoch Press — Middletown, NY</h3>
              <p className="text-gray-600 mb-4">Regional production facility — additional press capacity and distribution serving New York clients.</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /><span>Middletown, NY</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" /><a href="tel:9736943600" className="hover:text-amber-600">973.694.3600</a></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><span>Mon–Fri 8AM–6PM</span></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-8 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Epoch Press — Wayne, NJ</h3>
              <p className="text-gray-600 mb-4">Primary production facility — 60,000 sq ft with sheet-fed offset, digital presses, prepress, and full finishing capabilities.</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /><span>7 Highpoint Drive, Wayne, NJ 07470</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" /><a href="tel:9736943600" className="hover:text-amber-600">973.694.3600</a></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><span>Mon–Fri 8AM–6PM, Sat 9AM–2PM</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Served */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Book Printing Across New York</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            We serve book publishers and authors throughout New York from our Middletown, NY and Wayne, NJ facilities.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {data.citiesServed.map((city) => (
              <span key={city} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">{city}, NY</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Book Printing in NY — Common Questions</h2>
          <FAQSection items={data.faq} />
        </div>
      </section>

      {/* Cross Links */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Printing Services</h2>
          <p className="text-gray-600 mb-6 text-sm">Epoch Press offers a full range of commercial printing serving New York.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products/book-printing" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              All Book Specs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/book-printing-new-jersey" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Book Printing in NJ <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/magazine-printing-new-york" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Magazine Printing in NY <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/marketing-printing-new-york" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              Marketing Print in NY <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/commercial-printing-new-york" className="inline-flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-5 py-3 text-sm font-semibold text-gray-900 hover:border-amber-300 hover:text-amber-600 transition-all">
              All NY Printing Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-gradient text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4 text-[var(--gold-light)]">Ready to Print Your Book?</h2>
          <p className="text-gray-300 mb-8 text-lg">Tell us about your book project and we'll send a detailed quote within 24 hours.</p>
          <Link href="/quote?product=book-printing" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-10 py-4 rounded-lg transition-colors text-lg">
            Get a Book Printing Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
