import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Layers, Zap, Palette, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offset Printing Services NJ & NY',
  description: 'High-volume offset printing at Epoch Press. Superior color accuracy, consistent quality across long runs. Newspapers, magazines, books. NJ & NY facilities.',
  alternates: { canonical: '/offset-printing' },
};

const specs = [
  { label: 'Press Format', value: 'Web offset & sheetfed' },
  { label: 'Max Web Width', value: '22.75"' },
  { label: 'Color', value: 'Full CMYK + PMS spot colors' },
  { label: 'Run Length', value: '1,000 to 500,000+ impressions' },
  { label: 'Paper Stock', value: 'Newsprint, uncoated, coated, specialty' },
  { label: 'Finishing', value: 'Folding, trimming, saddle stitch, perfect bind, shrink wrap' },
];

const advantages = [
  { icon: Palette, title: 'Superior Color Consistency', description: 'Offset delivers exact PMS color matching and consistent ink density across entire print runs — critical for brand-sensitive work.' },
  { icon: BarChart3, title: 'Lowest Cost at Volume', description: 'Per-unit cost drops significantly at 2,000+ copies. For runs above 5,000, offset is typically 30–50% cheaper than digital.' },
  { icon: Layers, title: 'Paper Flexibility', description: 'Print on virtually any stock — newsprint, coated, uncoated, textured, recycled, and specialty papers that digital presses can\'t handle.' },
  { icon: Zap, title: 'Speed at Scale', description: 'Our web offset presses produce thousands of impressions per hour. Large jobs that would take days on digital finish in hours on offset.' },
];

const faq = [
  { question: 'What is offset printing?', answer: 'Offset printing transfers ink from a plate to a rubber blanket, then to the paper. This indirect ("offset") process produces sharp, clean images with precise color control. It\'s the standard for high-volume commercial printing — newspapers, magazines, books, and marketing materials.' },
  { question: 'When should I use offset vs digital printing?', answer: 'Use offset for runs above 1,000–2,000 copies where color consistency and cost-per-unit matter. Use digital for short runs (under 500), variable data printing, or when you need prints within 24–48 hours. Epoch Press runs both — we\'ll recommend the best fit for your project.' },
  { question: 'What is the minimum order for offset printing?', answer: 'While there\'s no hard minimum, offset becomes cost-effective at around 1,000–2,000 copies. Below that, digital printing is usually more economical. For very large runs (50,000+), offset is significantly cheaper per unit.' },
  { question: 'How long does offset printing take?', answer: 'Standard offset jobs take 5–7 business days from approved proofs. This includes plate-making, press setup, printing, and finishing. Rush service is available for time-sensitive projects — contact us for expedited timelines.' },
];

export default function OffsetPrintingPage() {
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
          <p className="text-amber-400 font-medium mb-4 tracking-wide uppercase text-sm">Service</p>
          <h1 className="font-serif text-[var(--gold-light)] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>Offset Printing Services</h1>
          <p className="text-xl text-amber-200 font-medium mb-4">High-Volume, Color-Accurate Printing for Publishers & Brands</p>
          <p className="text-lg text-gray-300 max-w-3xl mb-10 leading-relaxed">
            Offset printing is the backbone of commercial print production. At Epoch Press, our web and sheetfed offset presses deliver the color accuracy, paper flexibility, and per-unit economics that large print runs demand — from 1,000 copies to 500,000+.
          </p>
          <Link href="/quote" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8 py-4 rounded-lg transition-colors text-lg">
            Request an Offset Print Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* What Is Offset Printing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is Offset Printing?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Offset lithography works by transferring an inked image from a metal plate to a rubber blanket, then onto the printing surface. This indirect transfer produces exceptionally sharp images and consistent color across entire print runs — making it the industry standard for newspapers, magazines, books, catalogs, and high-volume marketing materials.
          </p>
          <p className="text-gray-700 leading-relaxed">
            At Epoch Press, we operate both web offset presses (for high-speed, high-volume work like newspapers and magazines) and sheetfed offset presses (for premium work requiring heavier stocks and specialty finishes). Our NJ and NY facilities give us the capacity to handle projects from 1,000 to 500,000+ impressions with consistent quality throughout.
          </p>
        </div>
      </section>

      {/* Why Offset */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Offset Printing?</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {advantages.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offset vs Digital */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Offset vs Digital Printing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Factor</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Offset</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Digital</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100"><td className="px-4 py-3 font-medium">Best for</td><td className="px-4 py-3">1,000+ copies</td><td className="px-4 py-3">Under 500 copies</td></tr>
                <tr className="border-t border-gray-100 bg-gray-50"><td className="px-4 py-3 font-medium">Color accuracy</td><td className="px-4 py-3">Excellent — PMS matching</td><td className="px-4 py-3">Good — CMYK only</td></tr>
                <tr className="border-t border-gray-100"><td className="px-4 py-3 font-medium">Cost per unit</td><td className="px-4 py-3">Lower at volume</td><td className="px-4 py-3">Lower for short runs</td></tr>
                <tr className="border-t border-gray-100 bg-gray-50"><td className="px-4 py-3 font-medium">Setup time</td><td className="px-4 py-3">Plate-making required</td><td className="px-4 py-3">No setup — print from file</td></tr>
                <tr className="border-t border-gray-100"><td className="px-4 py-3 font-medium">Paper options</td><td className="px-4 py-3">Widest range</td><td className="px-4 py-3">Limited stock options</td></tr>
                <tr className="border-t border-gray-100 bg-gray-50"><td className="px-4 py-3 font-medium">Turnaround</td><td className="px-4 py-3">5–7 business days</td><td className="px-4 py-3">1–3 business days</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">Not sure which is right? <Link href="/quote" className="text-amber-600 font-medium hover:underline">Request a quote</Link> — we'll recommend the best option for your project.</p>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Offset Press Specifications</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {specs.map((spec, i) => (
              <div key={spec.label} className={`flex justify-between px-6 py-4 ${i < specs.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="font-medium text-gray-800">{spec.label}</span>
                <span className="text-gray-600">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Offset Printing — Common Questions</h2>
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
          <h2 className="font-serif text-3xl font-bold mb-4 text-[var(--gold-light)]">Ready to Print?</h2>
          <p className="text-gray-300 mb-4">Tell us about your project — quantity, specs, and timeline — and we'll send a detailed quote within 24 hours.</p>
          <p className="text-gray-400 mb-8 text-sm">
            See all our <Link href="/products" className="text-amber-400 hover:underline">printing services</Link> or learn about printing in <Link href="/commercial-printing-new-jersey" className="text-amber-400 hover:underline">New Jersey</Link> and <Link href="/commercial-printing-new-york" className="text-amber-400 hover:underline">New York</Link>.
          </p>
          <Link href="/quote" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-10 py-4 rounded-lg transition-colors text-lg">
            Get a Custom Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
