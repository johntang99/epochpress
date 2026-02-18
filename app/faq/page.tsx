import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const faqData = [
  { category: 'General', items: [
    { q: 'What types of printing do you offer?', a: 'We offer newspapers, magazines, books, marketing print (flyers, brochures, postcards, posters), menus, business cards, and large format printing including banners and signage.' },
    { q: 'What areas do you serve?', a: 'We primarily serve the Northeast US (New York, New Jersey, Connecticut, Pennsylvania, Massachusetts) but ship nationwide.' },
    { q: 'What are your business hours?', a: 'Monday–Friday: 8:00 AM – 6:00 PM. Saturday: 9:00 AM – 2:00 PM. We are closed Sundays.' },
    { q: 'Do you offer rush printing?', a: 'Yes. Rush options (24–72 hours depending on product) are available. Rush fees apply.' },
  ]},
  { category: 'Ordering', items: [
    { q: 'How do I get a quote?', a: 'Use our online quote form, call (212) 555-0100, or email info@epochpress.com. We respond within 24 hours.' },
    { q: 'What is your minimum order quantity?', a: 'Minimums vary by product. Business cards: 250. Menus: 25. Newspapers: 500. Magazines: 250. See each product page for details.' },
    { q: 'Can I see a proof before printing?', a: 'Yes. Digital proofs are standard. Physical proofs available on request for large or complex jobs (additional cost and time).' },
    { q: 'How do I place a reorder?', a: 'Contact us with your original job number and any changes. We keep job records for 12 months.' },
  ]},
  { category: 'File Preparation', items: [
    { q: 'What file formats do you accept?', a: 'We prefer PDF. We also accept Adobe Illustrator (.ai), InDesign (.indd), Photoshop (.psd), and TIFF. We do NOT accept Word, PowerPoint, or low-resolution images.' },
    { q: 'What resolution should my files be?', a: 'Minimum 300 DPI for standard print. 150 DPI for large format viewed close-up. 75 DPI for banners viewed at distance.' },
    { q: 'Do you need bleed on my files?', a: 'Yes. All full-bleed designs require 0.125" (1/8") bleed on all sides. Keep important content 0.25" inside the trim.' },
    { q: 'Do you offer design services?', a: 'We focus on printing, not design. However, we can refer you to trusted design partners. We also offer basic file correction for minor issues.' },
    { q: 'Should I use CMYK or RGB?', a: 'Always use CMYK for print. RGB colors appear vibrant on screen but can look dull when printed. Convert all images and elements to CMYK before submission.' },
  ]},
  { category: 'Pricing', items: [
    { q: 'How is printing priced?', a: 'Pricing depends on product type, quantity, paper stock, finish, and turnaround. Use our quote form for an exact price — we respond within 24 hours.' },
    { q: 'Do you offer volume discounts?', a: 'Yes. Larger quantities have lower unit costs across all products. See price tier guidance on each product page.' },
    { q: 'Is there a rush fee?', a: 'Yes. Rush fees vary by product and timeline. Standard rush surcharge is 25–50% above standard pricing.' },
    { q: 'Do you offer recurring contract pricing?', a: 'Yes. We offer contract pricing for regular print runs (weekly newspapers, monthly publications, quarterly mailings). Contact us to discuss.' },
  ]},
  { category: 'Shipping', items: [
    { q: 'How long does standard shipping take?', a: 'Standard ground shipping within the Northeast is 1–3 business days. Other regions 3–7 business days.' },
    { q: 'Do you offer local pickup?', a: 'Yes. Our facility at 123 Press Way, New York, NY is available for customer pickup by appointment.' },
    { q: 'Can you ship nationwide?', a: 'Yes. We ship via UPS, FedEx, and freight carriers depending on order size and weight.' },
    { q: 'Do you offer freight delivery for large orders?', a: 'Yes. Palletized freight is available for large runs. We coordinate with freight carriers and can arrange liftgate delivery.' },
  ]},
];

export const metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description: 'Answers to common questions about Epoch Press printing services, file preparation, ordering, pricing, and shipping.',
};

export default function FAQPage() {
  return (
    <>
      <section className="bg-[var(--surface)] pt-28 pb-16 border-b border-[var(--border)]">
        <div className="container-content text-center">
          <h1 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg">
            Everything you need to know about working with Epoch Press.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-content max-w-3xl mx-auto space-y-12">
          {faqData.map((section) => (
            <div key={section.category}>
              <h2 className="font-serif text-[var(--navy)] text-xl mb-5 pb-3 border-b border-[var(--border)]">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <details key={item.q} className="group bg-white rounded-xl border border-[var(--border)] overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-[var(--navy)] hover:text-[var(--gold)] transition-colors list-none text-sm">
                      {item.q}
                      <span className="text-lg font-light text-[var(--text-secondary)] group-open:rotate-45 transition-transform inline-block">+</span>
                    </summary>
                    <div className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)]">
                      <div className="pt-4">{item.a}</div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="bg-navy-gradient rounded-2xl p-8 text-center">
            <h2 className="font-serif text-white text-xl mb-3">Still have questions?</h2>
            <p className="text-blue-200 text-sm mb-6">Our team is happy to help with any project-specific questions.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+12125550100" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:border-white/60 transition-all">
                Call (212) 555-0100
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
