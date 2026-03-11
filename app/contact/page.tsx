import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { getRequestSiteId, loadPageContent } from '@/lib/content';
import contactDataFallback from '@/data/pages/contact.json';
import { resolveRenderableImageUrl } from '@/lib/renderableImage';

export const metadata = {
  title: 'Contact Epoch Press',
  description: 'Get in touch with our printing team. Request a quote, ask a question, or visit our facility.',
};

type ContactData = typeof contactDataFallback;

export default async function ContactPage() {
  const siteId = await getRequestSiteId();
  const dbContent = await loadPageContent<ContactData>('contact', 'en', siteId);
  const data = dbContent ?? contactDataFallback;
  const heroBackgroundImage = resolveRenderableImageUrl(
    (data.hero as Record<string, unknown>)?.backgroundImage
  );
  const heroImage = resolveRenderableImageUrl((data.hero as Record<string, unknown>)?.image);
  const hasHeroMedia = Boolean(heroBackgroundImage || heroImage);
  const primaryPhone = data.phone?.number || '(212) 555-0100';
  const phoneHref = `tel:${primaryPhone.replace(/[^\d+]/g, '')}`;
  const emailAddress = data.email?.address || 'info@epochpress.com';
  const emailHref = `mailto:${emailAddress}`;
  const addressLine = data.location?.address || '123 Press Way';
  const cityLine = data.location?.city || 'New York, NY 10001';

  return (
    <>
      <section
        className={`relative pt-36 md:pt-40 pb-16 border-b border-[var(--border)] overflow-hidden ${
          hasHeroMedia ? 'bg-[var(--navy)]' : 'bg-[var(--surface)]'
        }`}
      >
        {heroBackgroundImage && (
          <>
            <img
              src={heroBackgroundImage}
              alt="Contact hero background"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[var(--navy)]/70" />
          </>
        )}
        <div className="container-content relative z-10">
          <div className={heroImage ? 'grid gap-8 lg:grid-cols-2 items-center' : 'text-center'}>
            <div className={heroImage ? '' : 'max-w-2xl mx-auto'}>
              <h1
                className={`font-serif mb-4 ${hasHeroMedia ? 'text-white' : 'text-[var(--navy)]'}`}
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                {data.hero?.title || 'Get in Touch'}
              </h1>
              <p
                className={`max-w-xl text-lg ${
                  hasHeroMedia ? 'text-on-primary-muted' : 'text-[var(--text-secondary)]'
                } ${heroImage ? '' : 'mx-auto'}`}
              >
                {data.hero?.subtitle ||
                  'Our team is ready to help with your print project. Reach out by phone, email, or the form below.'}
              </p>
            </div>
            {heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20">
                <img
                  src={heroImage}
                  alt={data.hero?.title || 'Contact hero image'}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="font-serif text-[var(--navy)] text-xl mb-6">
                {data.form?.title || 'Send Us a Message'}
              </h2>
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
                    {(Array.isArray(data.form?.reasonOptions) ? data.form.reasonOptions : []).map(
                      (option) => (
                        <option key={option}>{option}</option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Message</label>
                  <textarea rows={5} className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent resize-none" placeholder="Tell us about your project..." />
                </div>
                <button type="submit" className="w-full bg-gold-gradient text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
                  {data.form?.submitButton?.text || 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-[var(--navy)] text-xl mb-6">Contact Information</h2>
                <div className="space-y-5">
                  <a href={phoneHref} className="flex items-start gap-4 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)] hover:border-[var(--gold)] transition-colors group">
                    <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[var(--gold-light)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5 font-medium">
                        {data.phone?.title || 'Phone'}
                      </p>
                      <p className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">
                        {primaryPhone}
                      </p>
                    </div>
                  </a>
                  <a href={emailHref} className="flex items-start gap-4 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)] hover:border-[var(--gold)] transition-colors group">
                    <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[var(--gold-light)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5 font-medium">
                        {data.email?.title || 'Email'}
                      </p>
                      <p className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">
                        {emailAddress}
                      </p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
                    <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--gold-light)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5 font-medium">
                        {data.location?.title || 'Address'}
                      </p>
                      <p className="font-semibold text-[var(--navy)]">{addressLine}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{cityLine}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
                    <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[var(--gold-light)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] mb-0.5 font-medium">
                        {data.hours?.title || 'Hours'}
                      </p>
                      {Array.isArray(data.hours?.schedule) && data.hours.schedule.length > 0 ? (
                        <>
                          {data.hours.schedule.map((row) => (
                            <p key={`${row.day}-${row.time}`} className="text-sm text-[var(--text-secondary)]">
                              {row.day}: {row.time}
                            </p>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm text-[var(--text-secondary)]">Mon-Fri: 8:00 AM - 6:00 PM</p>
                      )}
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
                  <p className="mb-4 text-xs text-on-primary-muted">Call us directly — we respond fast.</p>
                  <a href={phoneHref} className="inline-flex items-center gap-1 bg-white text-[var(--navy)] text-sm font-semibold px-4 py-2.5 rounded-xl">
                    <Phone className="w-4 h-4" /> {primaryPhone}
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
