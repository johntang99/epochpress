import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ChevronDown, Clock, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rush Printing | 48-Hour Turnaround',
  description: 'Need printing fast? Epoch Press offers 48-hour rush printing for newspapers, magazines, flyers, and marketing materials. NJ & NY facilities. Call now.',
  alternates: { canonical: '/rush-printing' },
};

const turnaroundTimes = [
  { product: 'Flyers / Brochures', standard: '5 business days', rush: '48 hours', express: '24 hours (limited)' },
  { product: 'Business Cards', standard: '5 business days', rush: '48 hours', express: '24 hours' },
  { product: 'Newspapers', standard: '5–7 business days', rush: '72 hours', express: 'Contact us' },
  { product: 'Magazines (saddle stitch)', standard: '7 business days', rush: '3–4 business days', express: 'Contact us' },
  { product: 'Books (softcover)', standard: '10 business days', rush: '5–7 business days', express: 'Contact us' },
  { product: 'Large Format / Posters', standard: '5 business days', rush: '48 hours', express: '24 hours' },
];

const rushRequirements = [
  'Print-ready PDF files (no design revisions included in rush timeline)',
  'Approved proof — we proceed immediately upon approval',
  'Standard paper stocks (specialty papers may add time)',
  'Order confirmed by 10 AM for same-day production start',
  'Rush surcharge: typically 15–30% over standard pricing',
];

const faq = [
  { question: 'How fast can you print my job?', answer: 'Our fastest turnaround is 24 hours for select products (flyers, business cards, posters). Most products qualify for 48-hour rush service. Newspapers and bound publications typically need 3–5 days even on rush. Contact us with your specs for an exact timeline.' },
  { question: 'How much extra does rush printing cost?', answer: 'Rush printing typically adds 15–30% to the standard price, depending on the product and how fast you need it. 48-hour service is usually 15–20% more. 24-hour service (where available) is 25–30% more. We always quote the rush price upfront — no surprises.' },
  { question: 'Do you guarantee the rush deadline?', answer: 'Yes — once we confirm a rush timeline and receive your approved files, we guarantee delivery within the agreed timeframe. If we can\'t meet your deadline, we\'ll tell you upfront before you commit. We don\'t promise what we can\'t deliver.' },
  { question: 'What do I need to provide for rush printing?', answer: 'Print-ready PDF files meeting our file guidelines, an approved proof, and confirmation of paper stock and quantity. The more complete your files are when you submit, the faster we can start production. Files that need corrections or design changes will delay the rush timeline.' },
];

export default function RushPrintingPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-navy-gradient text-white pt-36 md:pt-40 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" /> Fast Turnaround Available
          </div>
          <h1 className="font-serif text-[var(--gold-light)] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>Rush Printing &amp; Fast Turnaround</h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6 leading-relaxed">
            When deadlines can't move, Epoch Press delivers. Our 48-hour rush printing service covers flyers, brochures, business cards, posters, and more. For newspapers and magazines, we offer accelerated schedules that cut standard timelines in half. Two production facilities in NJ and NY give us the capacity to prioritize your job without sacrificing quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/quote" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors text-lg">
              Request Rush Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="tel:9736943600" className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg transition-colors">
              <Clock className="w-5 h-5" /> Call Now: 973.694.3600
            </Link>
          </div>
        </div>
      </section>

      {/* Turnaround Times Table */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Turnaround Times by Product</h2>
          <p className="text-gray-500 text-center mb-10 text-sm">Times start from approved proof + print-ready files received.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Standard</th>
                  <th className="text-left px-4 py-3 font-semibold text-amber-700">Rush</th>
                  <th className="text-left px-4 py-3 font-semibold text-amber-700">Express</th>
                </tr>
              </thead>
              <tbody>
                {turnaroundTimes.map((row, i) => (
                  <tr key={row.product} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.product}</td>
                    <td className="px-4 py-3 text-gray-600">{row.standard}</td>
                    <td className="px-4 py-3 text-amber-700 font-medium">{row.rush}</td>
                    <td className="px-4 py-3 text-amber-700">{row.express}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Rush Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What You Need for Rush Printing</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="space-y-4">
              {rushRequirements.map((req, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Files that need corrections, revisions, or design changes will delay the rush timeline. Use our <Link href="/file-guidelines" className="font-semibold underline">file guidelines</Link> to ensure your files are print-ready before submitting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Rush Printing — Common Questions</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="group border border-gray-200 rounded-lg overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-gradient text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4 text-[var(--gold-light)]">Need It Fast? Let's Talk.</h2>
          <p className="text-gray-300 mb-4">Call us or submit a quote request with your deadline. We'll confirm whether we can meet it before you commit.</p>
          <p className="text-gray-400 mb-8 text-sm">
            See our <Link href="/printing-cost" className="text-amber-400 hover:underline">pricing guide</Link> | <Link href="/file-guidelines" className="text-amber-400 hover:underline">File preparation guidelines</Link> | <Link href="/products" className="text-amber-400 hover:underline">All printing services</Link>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-10 py-4 rounded-lg transition-colors text-lg">
              Request Rush Quote <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="tel:9736943600" className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg transition-colors">
              Call: 973.694.3600
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
