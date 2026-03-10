import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, Clock, Mail, MapPin, Phone, Quote } from 'lucide-react';
import esData from '@/data/landing/es.json';
import zhData from '@/data/landing/zh.json';
import heData from '@/data/landing/he.json';
import productsData from '@/data/products.json';
import { AutoScrollGallery } from '@/components/landing/AutoScrollGallery';
import { getRequestSiteId } from '@/lib/content';
import { canUseContentDb, fetchContentEntry } from '@/lib/contentDb';

const caseStudyTone: Record<string, string> = {
  Newspapers: 'bg-blue-100 text-blue-800',
  Magazines: 'bg-purple-100 text-purple-800',
  Books: 'bg-green-100 text-green-800',
  'Marketing Print': 'bg-orange-100 text-orange-800',
  'Direct Mail': 'bg-rose-100 text-rose-800',
  'Multi-Location Rollout': 'bg-teal-100 text-teal-800',
};

type LandingData = typeof zhData;
const LANDINGS: Record<string, LandingData> = {
  es: esData,
  zh: zhData,
  he: heData,
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
const CONTACT_COPY: Record<
  string,
  {
    formTitle: string;
    infoTitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    company: string;
    companyPlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    productInterest: string;
    productPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    sendButton: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    hoursLabel: string;
  }
> = {
  es: {
    formTitle: 'Envianos un mensaje',
    infoTitle: 'Informacion de contacto',
    fullName: 'Nombre completo',
    fullNamePlaceholder: 'Tu nombre',
    company: 'Empresa',
    companyPlaceholder: 'Nombre de la empresa',
    email: 'Correo electronico',
    emailPlaceholder: 'tu@email.com',
    phone: 'Telefono',
    phonePlaceholder: '(212) 000-0000',
    productInterest: 'Interes de producto',
    productPlaceholder: 'Selecciona un producto...',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntanos sobre tu proyecto...',
    sendButton: 'Enviar mensaje',
    phoneLabel: 'Telefono',
    emailLabel: 'Correo',
    addressLabel: 'Direccion',
    hoursLabel: 'Horario',
  },
  zh: {
    formTitle: '给我们留言',
    infoTitle: '联系信息',
    fullName: '姓名',
    fullNamePlaceholder: '您的姓名',
    company: '公司',
    companyPlaceholder: '公司名称',
    email: '邮箱',
    emailPlaceholder: 'your@email.com',
    phone: '电话',
    phonePlaceholder: '(212) 000-0000',
    productInterest: '产品需求',
    productPlaceholder: '请选择产品...',
    message: '留言',
    messagePlaceholder: '请告诉我们您的项目需求...',
    sendButton: '发送消息',
    phoneLabel: '电话',
    emailLabel: '邮箱',
    addressLabel: '地址',
    hoursLabel: '营业时间',
  },
  he: {
    formTitle: 'שלחו לנו הודעה',
    infoTitle: 'פרטי יצירת קשר',
    fullName: 'שם מלא',
    fullNamePlaceholder: 'השם שלך',
    company: 'חברה',
    companyPlaceholder: 'שם החברה',
    email: 'אימייל',
    emailPlaceholder: 'your@email.com',
    phone: 'טלפון',
    phonePlaceholder: '(212) 000-0000',
    productInterest: 'תחום עניין',
    productPlaceholder: 'בחרו מוצר...',
    message: 'הודעה',
    messagePlaceholder: 'ספרו לנו על הפרויקט שלכם...',
    sendButton: 'שלח הודעה',
    phoneLabel: 'טלפון',
    emailLabel: 'אימייל',
    addressLabel: 'כתובת',
    hoursLabel: 'שעות פעילות',
  },
};

export function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'zh' }, { lang: 'he' }];
}

async function loadLandingData(lang: string): Promise<LandingData | null> {
  const fallback = LANDINGS[lang];
  if (!fallback) return null;
  if (!canUseContentDb()) return fallback;

  const siteId = await getRequestSiteId();
  const path = `landing/${lang}.json`;
  // Landing files are site-scoped; admin/import currently writes them under canonical locale.
  // Prefer canonical 'en' row for determinism, then allow locale row only if it is newer.
  const [canonicalEntry, localeEntry] = await Promise.all([
    fetchContentEntry(siteId, 'en', path),
    lang !== 'en' ? fetchContentEntry(siteId, lang, path) : Promise.resolve(null),
  ]);

  const canonicalData =
    canonicalEntry?.data && typeof canonicalEntry.data === 'object'
      ? (canonicalEntry.data as LandingData)
      : null;
  const localeData =
    localeEntry?.data && typeof localeEntry.data === 'object'
      ? (localeEntry.data as LandingData)
      : null;

  if (localeData && canonicalData) {
    const localeUpdatedAt = localeEntry?.updated_at
      ? new Date(localeEntry.updated_at).getTime()
      : 0;
    const canonicalUpdatedAt = canonicalEntry?.updated_at
      ? new Date(canonicalEntry.updated_at).getTime()
      : 0;
    return localeUpdatedAt > canonicalUpdatedAt ? localeData : canonicalData;
  }

  if (canonicalData) return canonicalData;
  if (localeData) return localeData;
  return fallback;
}

export default async function LandingPage({ params }: { params: { lang: string } }) {
  if (params.lang === 'en') redirect('/');
  const data = await loadLandingData(params.lang);
  if (!data) notFound();
  const contactCopy = CONTACT_COPY[params.lang] || CONTACT_COPY.es;
  const contactData = (data as Record<string, any>).contact || {};
  const contact = {
    formTitle: contactData.formTitle || contactCopy.formTitle,
    infoTitle: contactData.infoTitle || contactCopy.infoTitle,
    fullNameLabel: contactData.fullNameLabel || contactCopy.fullName,
    fullNamePlaceholder: contactData.fullNamePlaceholder || contactCopy.fullNamePlaceholder,
    companyLabel: contactData.companyLabel || contactCopy.company,
    companyPlaceholder: contactData.companyPlaceholder || contactCopy.companyPlaceholder,
    emailLabel: contactData.emailLabel || contactCopy.email,
    emailPlaceholder: contactData.emailPlaceholder || contactCopy.emailPlaceholder,
    phoneLabel: contactData.phoneLabel || contactCopy.phone,
    phonePlaceholder: contactData.phonePlaceholder || contactCopy.phonePlaceholder,
    productInterestLabel: contactData.productInterestLabel || contactCopy.productInterest,
    productInterestPlaceholder:
      contactData.productInterestPlaceholder || contactCopy.productPlaceholder,
    messageLabel: contactData.messageLabel || contactCopy.message,
    messagePlaceholder: contactData.messagePlaceholder || contactCopy.messagePlaceholder,
    sendButtonText: contactData.sendButtonText || contactCopy.sendButton,
    phoneValue: contactData.phoneValue || '(212) 555-0100',
    emailValue: contactData.emailValue || 'info@epochpress.com',
    addressLine1: contactData.addressLine1 || '123 Press Way',
    addressLine2: contactData.addressLine2 || 'New York, NY 10001',
    hoursLines:
      Array.isArray(contactData.hoursLines) && contactData.hoursLines.length > 0
        ? contactData.hoursLines
        : ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM', 'Sun: Closed'],
  };

  const isRtl = Boolean(data.meta.rtl);
  const align = isRtl ? 'text-right' : 'text-left';
  const heroVariant = String((data.hero as Record<string, unknown>)?.variant || 'split-photo-right');
  const heroCentered = heroVariant === 'centered';
  const heroImageRight = heroVariant !== 'split-photo-left';
  const productCatalogBySlug = new Map(
    (productsData.categories || []).map((item) => [item.slug, item] as const)
  );
  const productItems = data.productGallery.items.map((item) => {
    const slug = (item.href || '').split('/').pop() || '';
    const source = productCatalogBySlug.get(slug);
    const detailLines =
      Array.isArray(item.highlights) && item.highlights.length > 0
        ? item.highlights.map((point) => `- ${point}`)
        : Array.isArray(source?.highlights) && source.highlights.length > 0
          ? source.highlights.map((point) => `- ${point}`)
          : ['- High quality output', '- Flexible quantities', '- Reliable turnaround'];
    return {
      name: item.name || source?.name || slug,
      descParagraphs: [item.desc || source?.desc || '', ...detailLines],
      href: item.href || `/products/${slug}`,
      image: item.image || '',
    };
  });

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'}>
      <section className="relative min-h-[88vh] overflow-hidden bg-navy-gradient pt-40 md:pt-44 pb-20">
        <div className="container-content relative z-10">
          <div className={heroCentered ? 'mx-auto max-w-4xl text-center' : 'grid gap-10 lg:grid-cols-2 items-center'}>
            <div className={heroCentered ? '' : align}>
              <span className="inline-block rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-[var(--gold-light)]">
                {data.hero.badge}
              </span>
              <h1 className="mt-5 font-serif text-white" style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)' }}>
                {data.hero.headline}
              </h1>
              <p className={`mt-5 text-lg text-blue-100 ${heroCentered ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>{data.hero.subline}</p>
              <div
                className={`mt-8 flex flex-wrap gap-3 ${
                  heroCentered ? 'justify-center' : isRtl ? 'justify-end' : 'justify-start'
                }`}
              >
                <Link
                  href={data.hero.primaryCta.href}
                  className="rounded-xl bg-gold-gradient px-6 py-3 font-semibold text-white shadow-gold"
                >
                  {data.hero.primaryCta.text}
                </Link>
                <a
                  href={data.hero.secondaryCta.href}
                  className="rounded-xl border border-white/35 px-6 py-3 font-semibold text-white hover:bg-white/10"
                >
                  {data.hero.secondaryCta.text}
                </a>
              </div>
            </div>
            {!heroCentered && (
              <div
                className={`relative aspect-video overflow-hidden rounded-2xl border border-white/20 ${
                  heroImageRight ? '' : 'lg:order-first'
                }`}
              >
                <img src={data.hero.image} alt={data.hero.headline} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white py-5">
        <div className="container-content">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {data.trustBar.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--navy)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="why-us" className="section-padding scroll-mt-32 bg-[var(--surface)]">
        <div className="container-content">
          <h2 className={`font-serif text-[var(--navy)] ${align}`} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            {data.capabilities.title}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.capabilities.items.map((item) => (
              <article key={item.title} className={`rounded-2xl border border-[var(--border)] bg-white p-6 ${align}`}>
                <h3 className="font-serif text-xl text-[var(--navy)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="section-padding scroll-mt-32 bg-white">
        <div className="container-content">
          <h2 className={`font-serif text-[var(--navy)] ${align}`} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            {data.productGallery.title}
          </h2>
          {data.productGallery.variant === 'detail-alternating' ? (
            <div className="mt-8 space-y-6">
              {productItems.map((item, index) => (
                <article
                  key={item.name}
                  className="grid overflow-hidden rounded-2xl border border-[var(--border)] bg-white md:grid-cols-2"
                >
                  <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover min-h-60" />
                  </div>
                  <div className={`p-6 md:p-8 ${align}`}>
                    <h3 className="font-serif text-2xl text-[var(--navy)]">{item.name}</h3>
                    <div className="mt-3 space-y-2">
                      {item.descParagraphs.map((line, lineIndex) => (
                        <p
                          key={`${item.name}-desc-${lineIndex}`}
                          className={`text-sm leading-relaxed ${
                            lineIndex === 0 ? 'text-[var(--text-secondary)]' : 'text-[var(--charcoal)]'
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className="mt-5">
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                      >
                        {isRtl ? 'למידע נוסף' : 'Learn More'} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : data.productGallery.variant === 'grid-3x' ? (
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {productItems.map((item) => (
                <article
                  key={item.name}
                  className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className={`flex h-full flex-col p-7 ${align}`}>
                    <h3 className="font-serif text-xl font-semibold text-[var(--navy)]">{item.name}</h3>
                    <div className="mt-3 flex-1 space-y-2">
                      {item.descParagraphs.map((line, lineIndex) => (
                        <p
                          key={`${item.name}-desc-${lineIndex}`}
                          className={`text-sm leading-relaxed ${
                            lineIndex === 0 ? 'text-[var(--text-secondary)]' : 'text-[var(--charcoal)]'
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-gold-gradient"
                    >
                      {isRtl ? 'למידע נוסף' : 'Learn More'} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {productItems.map((item) => (
                <article
                  key={item.name}
                  className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[var(--navy)] to-[var(--charcoal)]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className={`flex h-full flex-col p-7 ${align}`}>
                    <h3 className="font-serif text-xl font-semibold text-[var(--navy)]">{item.name}</h3>
                    <div className="mt-3 flex-1 space-y-2">
                      {item.descParagraphs.map((line, lineIndex) => (
                        <p
                          key={`${item.name}-desc-${lineIndex}`}
                          className={`text-sm leading-relaxed ${
                            lineIndex === 0 ? 'text-[var(--text-secondary)]' : 'text-[var(--charcoal)]'
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-gold-gradient"
                    >
                      {isRtl ? 'למידע נוסף' : 'Learn More'} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-[var(--surface)]">
        <div className="container-content">
          <h2 className={`font-serif text-[var(--navy)] ${align}`} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            {data.proof.title}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {data.proof.items.map((item) => (
              <article key={item.metric + item.label} className={`rounded-2xl border border-[var(--border)] bg-white p-6 ${align}`}>
                <div className="font-serif text-4xl text-[var(--gold)]">{item.metric}</div>
                <div className="mt-2 text-base font-semibold text-[var(--navy)]">{item.label}</div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="section-padding scroll-mt-32 bg-white">
        <div className="container-content">
          <h2 className={`font-serif text-[var(--navy)] ${align}`} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            {data.process.title}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data.process.steps.map((step, idx) => (
              <article key={step.title} className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 ${align}`}>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--navy)] text-sm font-bold text-[var(--gold-light)]">
                  {idx + 1}
                </div>
                <h3 className="mt-4 font-serif text-xl text-[var(--navy)]">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="case-studies" className="section-padding scroll-mt-32 bg-[var(--primary)]">
        <div className="container-content">
          <h2 className={`font-serif text-white ${align}`} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            {data.caseStudies.title}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.caseStudies.items.map((item) => (
              <article
                key={item.title}
                className={`overflow-hidden rounded-2xl border border-white/20 bg-white/95 ${align}`}
              >
                <div className="border-b border-[var(--border)] p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        caseStudyTone[item.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="inline-flex rounded-full bg-[var(--gold-50)] px-2.5 py-1 text-xs font-semibold text-[var(--gold)]">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl text-[var(--navy)]">{item.title}</h3>
                  <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">{item.client}</p>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                      Challenge
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{item.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                      Solution
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{item.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                      Result
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{item.result}</p>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <div className="flex items-start gap-3">
                      <Quote className="mt-0.5 h-5 w-5 text-[var(--gold)] flex-shrink-0" />
                      <div>
                        <p className="text-sm leading-relaxed text-[var(--navy)]">"{item.quote}"</p>
                        <p className="mt-1 text-xs font-semibold text-[var(--text-secondary)]">{item.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-32 bg-gray-100 py-14">
        <div className={`container-content ${align}`}>
          <h2 className="font-serif text-[var(--navy)]" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            {data.galleryRail.title}
          </h2>
        </div>
        <div className="mt-6 px-4 md:px-8">
          <AutoScrollGallery items={data.galleryRail.items} />
        </div>
      </section>

      <section className="section-padding bg-[var(--surface)]">
        <div className="container-content max-w-4xl">
          <h2 className={`font-serif text-[var(--navy)] ${align}`} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            {data.faq.title}
          </h2>
          <div className="mt-8 space-y-4">
            {data.faq.items.map((item) => (
              <article key={item.q} className={`rounded-2xl border border-[var(--border)] bg-white p-5 ${align}`}>
                <h3 className="font-semibold text-[var(--navy)]">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-padding scroll-mt-32 bg-white">
        <div className="container-content">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-[var(--navy)]" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
                {contact.formTitle}
              </h2>
              <form className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                      {contact.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={contact.fullNamePlaceholder}
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                      {contact.companyLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={contact.companyPlaceholder}
                      className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                    {contact.emailLabel}
                  </label>
                  <input
                    type="email"
                    placeholder={contact.emailPlaceholder}
                    className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                    {contact.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    placeholder={contact.phonePlaceholder}
                    className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                    {contact.productInterestLabel}
                  </label>
                  <select className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]">
                    <option>{contact.productInterestPlaceholder}</option>
                    {productItems.map((item) => (
                      <option key={`contact-${item.name}`}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--navy)]">
                    {contact.messageLabel}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={contact.messagePlaceholder}
                    className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex rounded-xl bg-gold-gradient px-6 py-3 text-sm font-semibold text-white shadow-gold hover:opacity-90"
                >
                  {contact.sendButtonText}
                </button>
              </form>
            </div>

            <div>
              <h2 className="font-serif text-[var(--navy)]" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
                {contact.infoTitle}
              </h2>
              <div className="mt-6 space-y-4">
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--gold-light)]">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{contactCopy.phoneLabel}</p>
                      <p className="text-lg font-semibold text-[var(--navy)]">{contact.phoneValue}</p>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--gold-light)]">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{contactCopy.emailLabel}</p>
                      <p className="text-lg font-semibold text-[var(--gold)]">{contact.emailValue}</p>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--gold-light)]">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{contactCopy.addressLabel}</p>
                      <p className="text-lg font-semibold text-[var(--navy)]">{contact.addressLine1}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{contact.addressLine2}</p>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--gold-light)]">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{contactCopy.hoursLabel}</p>
                      {contact.hoursLines.map((line: string) => (
                        <p key={line} className="text-sm text-[var(--navy)]">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-gradient py-20">
        <div className={`container-content max-w-3xl ${align}`}>
          <h2 className="font-serif text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {data.finalCta.title}
          </h2>
          <p className="mt-4 text-blue-100">{data.finalCta.subline}</p>
          <div className={`mt-8 flex flex-wrap gap-3 ${isRtl ? 'justify-end' : 'justify-start'}`}>
            <Link href={data.finalCta.primaryHref} className="rounded-xl bg-gold-gradient px-6 py-3 font-semibold text-white">
              {data.finalCta.primaryText}
            </Link>
            <a href={data.finalCta.secondaryHref} className="rounded-xl border border-white/35 px-6 py-3 font-semibold text-white">
              {data.finalCta.secondaryText}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
