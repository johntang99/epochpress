import Link from 'next/link';
import { CheckCircle, XCircle, ArrowRight, Download } from 'lucide-react';

export const metadata = {
  title: 'File Preparation Guidelines',
  description: 'Learn how to prepare print-ready files for Epoch Press. Resolution, bleed, color profiles, and accepted formats.',
};

const accepted = ['PDF (preferred)', 'Adobe Illustrator (.ai)', 'Adobe InDesign (.indd)', 'Photoshop (.psd)', 'TIFF (.tiff)', 'ZIP archive'];
const notAccepted = ['Microsoft Word / PowerPoint', 'JPEG below 300 DPI', 'RGB color mode files', 'Files without bleed', 'Google Slides / Docs', 'Website screenshots'];

const checklist = [
  'File is PDF format (preferred)',
  'Resolution is 300 DPI or higher',
  'Color mode is CMYK',
  'Bleed is 0.125" on all sides',
  'Fonts are embedded or outlined',
  'Images are high resolution',
  'No RGB or unintended spot colors',
  'Trim marks are NOT included in the file',
  'Text is at least 0.25" from trim edge',
];

const templates = [
  { name: 'Business Card Template', format: 'PDF + AI', desc: 'Standard 3.5" × 2"' },
  { name: 'Flyer Template — Letter', format: 'PDF + AI', desc: '8.5" × 11"' },
  { name: 'Brochure Template — Tri-fold', format: 'PDF + AI', desc: '8.5" × 11" folded' },
  { name: 'Postcard Template — 4×6', format: 'PDF + AI', desc: '4" × 6"' },
];

export default function FileGuidelinesPage() {
  return (
    <>
      <section className="bg-[var(--surface)] pt-28 pb-16 border-b border-[var(--border)]">
        <div className="container-content text-center">
          <h1 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            File Preparation Guidelines
          </h1>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            Prepare your files correctly to ensure the best print quality and avoid costly reprints.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-content max-w-4xl mx-auto space-y-14">
          {/* Accepted Formats */}
          <div>
            <h2 className="font-serif text-[var(--navy)] mb-6" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
              Accepted File Formats
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-[var(--success)] mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Accepted
                </h3>
                <ul className="space-y-2">
                  {accepted.map((f) => (
                    <li key={f} className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-medium text-green-800">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Not Accepted
                </h3>
                <ul className="space-y-2">
                  {notAccepted.map((f) => (
                    <li key={f} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium text-red-800">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bleed & Safety */}
          <div>
            <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
              Bleed & Safety Zone
            </h2>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                {[
                  { label: 'Bleed', value: '0.125"', color: 'bg-red-100 border-red-300 text-red-800', desc: 'Extend background/images beyond trim' },
                  { label: 'Trim Line', value: '0"', color: 'bg-blue-100 border-blue-300 text-blue-800', desc: 'Where the paper will be cut' },
                  { label: 'Safety Zone', value: '0.25"', color: 'bg-green-100 border-green-300 text-green-800', desc: 'Keep text/logos inside this area' },
                ].map((zone) => (
                  <div key={zone.label} className={`border rounded-xl p-5 text-center ${zone.color}`}>
                    <div className="text-2xl font-bold mb-1">{zone.value}</div>
                    <div className="font-semibold text-sm mb-1">{zone.label}</div>
                    <div className="text-xs">{zone.desc}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Any background colors or images that touch the edge of your design must extend 0.125" beyond the trim line. Keep all important text and logos at least 0.25" inside the trim.
              </p>
            </div>
          </div>

          {/* Resolution */}
          <div>
            <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
              Resolution Requirements
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { type: 'Standard Print', dpi: '300 DPI', note: 'Business cards, flyers, brochures, books, menus', color: 'bg-[var(--navy)] text-white' },
                { type: 'Large Format (close view)', dpi: '150–200 DPI', note: 'Retail signage, displays viewed within 6 feet', color: 'bg-[var(--charcoal)] text-white' },
                { type: 'Large Format (distance)', dpi: '75–100 DPI', note: 'Banners and signage viewed 6+ feet away', color: 'bg-[var(--gold)] text-white' },
              ].map((item) => (
                <div key={item.type} className={`rounded-2xl p-6 ${item.color}`}>
                  <div className="text-2xl font-bold mb-2">{item.dpi}</div>
                  <div className="font-semibold text-sm mb-2 opacity-90">{item.type}</div>
                  <div className="text-xs opacity-75">{item.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
              Color Profiles
            </h2>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-7 space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-5 h-5 text-[var(--success)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--navy)]">Use CMYK color mode</p>
                  <p className="text-sm text-[var(--text-secondary)]">All files must be in CMYK. RGB files will be converted, which may cause color shifts.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-5 h-5 text-[var(--success)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--navy)]">Rich Black for large text/shapes</p>
                  <p className="text-sm text-[var(--text-secondary)]">Use: C60 M40 Y40 K100. For small text, use K100 only to avoid registration issues.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--navy)]">Avoid RGB and Pantone without conversion</p>
                  <p className="text-sm text-[var(--text-secondary)]">RGB looks vibrant on screen but prints dull. Convert Pantone colors to CMYK equivalents in your design software.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Templates */}
          <div>
            <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
              Downloadable Templates
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {templates.map((t) => (
                <div key={t.name} className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                  <div className="w-10 h-10 bg-navy-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5 text-[var(--gold-light)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--navy)] text-sm">{t.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{t.desc} — {t.format}</p>
                  </div>
                  <button className="text-xs font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors flex-shrink-0">
                    Download
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Need a custom template? <Link href="/contact" className="text-[var(--gold)] font-semibold hover:text-[var(--gold-light)]">Contact us</Link> and we'll help you set up the correct document.
            </p>
          </div>

          {/* Preflight Checklist */}
          <div>
            <h2 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
              Pre-flight Checklist
            </h2>
            <div className="bg-[var(--gold-50)] border border-[var(--gold)] rounded-2xl p-7">
              <p className="text-sm font-semibold text-[var(--navy)] mb-5">Before submitting your file, confirm all of the following:</p>
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[var(--charcoal)]">
                    <div className="w-5 h-5 border-2 border-[var(--gold)] rounded flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-navy-gradient rounded-2xl p-8 text-center">
            <h2 className="font-serif text-white text-xl mb-3">Files Ready? Let's Print.</h2>
            <p className="text-blue-200 text-sm mb-6">Submit your project details and files through our quote form.</p>
            <Link href="/quote" className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
