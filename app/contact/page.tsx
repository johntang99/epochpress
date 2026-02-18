import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Contact Epoch Press',
  description: 'Get in touch with our printing team. Request a quote, ask a question, or visit our facility.',
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[var(--surface)] pt-28 pb-16 border-b border-[var(--border)]">
        <div className="container-content text-center">
          <h1 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Get in Touch
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-lg">
            Our team is ready to help with your print project. Reach out by phone, email, or the form below.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="font-serif text-[var(--navy)] text-xl mb-6">Send Us a Message</h2>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Full Name *</label>
                    <input type="text" required className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Company</label>
                    <input type="text" className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent" placeholder="Company name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Email *</label>
                  <input type="email" required className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Phone</label>
                  <input type="tel" className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent" placeholder="(212) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Product Interest</label>
                  <select className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent bg-white">
                    <option value="">Select a product...</option>
                    <option>Newspapers</option>
                    <option>Magazines</option>
                    <option>Books</option>
                    <option>Marketing Print</option>
                    <option>Menu Printing</option>
                    <option>Business Cards</option>
                    <option>Large Format</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Message</label>
                  <textarea rows={5} className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent resize-none" placeholder="Tell us about your project..." />
                </div>
                <button type="submit" className="w-full bg-gold-gradient text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-[var(--navy)] text-xl mb-6">Contact Information</h2>
                <div className="space-y-5">
                  <a href="tel:+12125550100" className="flex items-start gap-4 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)] hover:border-[var(--gold)] transition-colors group">
                    <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[var(--gold-light)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5 font-medium">Phone</p>
                      <p className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">(212) 555-0100</p>
                    </div>
                  </a>
                  <a href="mailto:info@epochpress.com" className="flex items-start gap-4 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)] hover:border-[var(--gold)] transition-colors group">
                    <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[var(--gold-light)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5 font-medium">Email</p>
                      <p className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">info@epochpress.com</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
                    <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--gold-light)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5 font-medium">Address</p>
                      <p className="font-semibold text-[var(--navy)]">123 Press Way</p>
                      <p className="text-sm text-[var(--text-secondary)]">New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
                    <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[var(--gold-light)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5 font-medium">Hours</p>
                      <p className="font-semibold text-[var(--navy)]">Mon–Fri: 8:00 AM – 6:00 PM</p>
                      <p className="text-sm text-[var(--text-secondary)]">Sat: 9:00 AM – 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--gold-50)] border border-[var(--gold)] rounded-2xl p-5 text-center">
                  <p className="font-serif font-semibold text-[var(--navy)] mb-2">Need a Quote?</p>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">Get a custom price for your project in minutes.</p>
                  <Link href="/quote" className="inline-flex items-center gap-1 bg-gold-gradient text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
                    Request a Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-[var(--navy)] rounded-2xl p-5 text-center">
                  <p className="font-serif font-semibold text-white mb-2">Prefer to Talk?</p>
                  <p className="text-xs text-blue-200 mb-4">Call us directly — we respond fast.</p>
                  <a href="tel:+12125550100" className="inline-flex items-center gap-1 bg-white text-[var(--navy)] text-sm font-semibold px-4 py-2.5 rounded-xl">
                    <Phone className="w-4 h-4" /> (212) 555-0100
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
