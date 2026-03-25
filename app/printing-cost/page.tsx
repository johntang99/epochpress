import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Printing Costs & Pricing',
  description: 'How much does commercial printing cost? See Epoch Press pricing for newspapers, magazines, books, marketing materials. Request a custom quote.',
  alternates: { canonical: '/printing-cost' },
};

const pricingTiers = [
  { product: 'Newspaper (tabloid, 16pp)', shortRun: '$0.35–$0.60/copy', midRun: '$0.15–$0.30/copy', longRun: '$0.08–$0.15/copy' },
  { product: 'Magazine (saddle stitch, 32pp)', shortRun: '$1.50–$3.00/copy', midRun: '$0.75–$1.50/copy', longRun: '$0.40–$0.80/copy' },
  { product: 'Magazine (perfect bound, 64pp)', shortRun: '$3.00–$5.00/copy', midRun: '$1.50–$3.00/copy', longRun: '$0.80–$1.50/copy' },
  { product: 'Book (softcover, 200pp)', shortRun: '$5.00–$8.00/copy', midRun: '$2.50–$4.50/copy', longRun: '$1.50–$3.00/copy' },
  { product: 'Flyers/Brochures (full color)', shortRun: '$0.15–$0.40/piece', midRun: '$0.06–$0.15/piece', longRun: '$0.03–$0.08/piece' },
  { product: 'Business Cards (500 qty)', shortRun: '$40–$80', midRun: '—', longRun: '—' },
];

const factors = [
  { title: 'Quantity', description: 'The biggest cost driver. Offset printing has a high initial setup cost (plates, makeready) but very low per-unit cost at volume. Digital has no setup cost but higher per-unit cost. The crossover point is usually around 1,000–2,000 copies.' },
  { title: 'Page Count & Size', description: 'More pages = more paper + more press time. A 64-page magazine costs roughly 2x a 32-page magazine. Larger trim sizes (tabloid vs letter) use more paper per copy.' },
  { title: 'Paper Stock', description: 'Standard uncoated or newsprint is cheapest. Coated stock adds 20–40%. Premium or specialty papers (textured, recycled, heavy cover stock) add more. Paper is typically 30–50% of total job cost.' },
  { title: 'Color', description: 'Full CMYK color is standard. Adding PMS spot colors or metallic inks increases cost. Black-and-white interiors with color covers is a common cost-saving approach for books.' },
  { title: 'Finishing', description: 'Saddle stitching (stapled) is cheapest. Perfect binding adds $0.15–$0.40/copy. Lamination, UV coating, die cutting, and foil stamping add to finishing costs.' },
  { title: 'Turnaround', description: 'Standard 5–7 day turnaround is included in base pricing. Rush (48-hour) service typically adds 15–30% to the total cost.' },
];

const faq = [
  { question: 'How much does commercial printing cost?', answer: 'Costs vary widely by product, quantity, and specifications. A 16-page tabloid newspaper costs $0.08–$0.60 per copy depending on run length. A 200-page softcover book ranges from $1.50–$8.00 per copy. The best way to get an accurate price is to request a quote with your exact specs.' },
  { question: 'What is the minimum order quantity?', answer: 'For digital printing, there\'s no practical minimum — we can print as few as 25 copies. For offset printing, the minimum is typically 1,000 copies to be cost-effective. The per-unit price drops significantly as quantity increases.' },
  { question: 'Is offset or digital printing cheaper?', answer: 'It depends on quantity. Digital is cheaper for runs under 500. Offset becomes cheaper at 1,000–2,000+ copies and the savings increase with volume. At 10,000+ copies, offset is typically 40–60% cheaper per unit than digital.' },
  { question: 'Do you offer discounts for recurring orders?', answer: 'Yes. We offer volume commitments and recurring order agreements for publications and repeat clients. If you print monthly or quarterly, ask about our standing order pricing when you request a quote.' },
  { question: 'What payment methods do you accept?', answer: 'We accept company checks, wire transfers, and major credit cards. Net-30 terms are available for established accounts. A 50% deposit is typically required for new clients on the first order.' },
];

export default function PrintingCostPage() {
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

      {/* Hero — Direct Answer Above Fold */}
      <section className="bg-navy-gradient text-white pt-36 md:pt-40 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-amber-400 font-medium mb-4 tracking-wide uppercase text-sm">Pricing Guide</p>
          <h1 className="font-serif text-[var(--gold-light)] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>How Much Does Commercial Printing Cost?</h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-6 leading-relaxed">
            Commercial printing costs range from <strong className="text-white">$0.03 per piece</strong> for high-volume flyers to <strong className="text-white">$5–$8 per copy</strong> for short-run books. The three biggest factors are quantity, paper stock, and finishing. At Epoch Press, we provide detailed quotes within 24 hours — with no hidden fees.
          </p>
          <Link href="/quote" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors text-lg">
            Get Your Custom Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Price Table */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Epoch Press Pricing Ranges</h2>
          <p className="text-gray-500 text-center mb-10 text-sm">Approximate ranges — actual pricing depends on exact specifications. Request a quote for accurate pricing.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Short Run<br /><span className="font-normal text-gray-500">(250–1,000)</span></th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Mid Run<br /><span className="font-normal text-gray-500">(1,000–10,000)</span></th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Long Run<br /><span className="font-normal text-gray-500">(10,000+)</span></th>
                </tr>
              </thead>
              <tbody>
                {pricingTiers.map((tier, i) => (
                  <tr key={tier.product} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-3 font-medium text-gray-800">{tier.product}</td>
                    <td className="px-4 py-3 text-gray-600">{tier.shortRun}</td>
                    <td className="px-4 py-3 text-gray-600">{tier.midRun}</td>
                    <td className="px-4 py-3 text-amber-700 font-medium">{tier.longRun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What Affects Cost */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">What Affects Printing Costs?</h2>
          <div className="space-y-6">
            {factors.map((factor) => (
              <div key={factor.title} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2">{factor.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Is It Worth It */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Is Professional Printing Worth the Cost?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            For publishers producing newspapers, magazines, and books, professional offset printing delivers the quality and consistency that readers and advertisers expect. The per-unit economics at volume are unmatched — a 10,000-copy newspaper run costs a fraction of what digital on-demand would charge.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            For businesses using print for marketing, the tangible impact of a well-printed brochure or direct mail piece consistently outperforms digital-only campaigns in response rates. Print isn't cheap — but for the right applications, the ROI justifies the investment.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <blockquote className="text-gray-700 italic mb-3">
              "We switched to Epoch Press for our monthly magazine and cut our per-issue printing cost by 35% while improving paper quality. The combination of competitive pricing and consistent output has been exactly what we needed."
            </blockquote>
            <p className="text-sm font-semibold text-gray-900">— Regional publisher, Northern NJ</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Printing Cost — Common Questions</h2>
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
          <h2 className="font-serif text-3xl font-bold mb-4 text-[var(--gold-light)]">Get Your Exact Price</h2>
          <p className="text-gray-300 mb-4">Every project is different. Send us your specs and we'll provide a detailed, no-obligation quote within 24 hours.</p>
          <p className="text-gray-400 mb-8 text-sm">
            See our <Link href="/products" className="text-amber-400 hover:underline">full product catalog</Link> | <Link href="/file-guidelines" className="text-amber-400 hover:underline">File preparation guidelines</Link> | <Link href="/rush-printing" className="text-amber-400 hover:underline">Rush printing options</Link>
          </p>
          <Link href="/quote" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-10 py-4 rounded-lg transition-colors text-lg">
            Request a Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
