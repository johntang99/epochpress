'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowLeft, CheckCircle, Upload, X, Phone } from 'lucide-react';
import Link from 'next/link';
import quoteConfig from '@/data/quote-config.json';

const products = [
  { id: 'newspaper-printing', label: 'Newspapers', icon: '📰', desc: 'Broadsheet, tabloid, inserts' },
  { id: 'magazine-printing', label: 'Magazines', icon: '📖', desc: 'Perfect bind, saddle stitch' },
  { id: 'book-printing', label: 'Books', icon: '📚', desc: 'Offset, digital, print-on-demand' },
  { id: 'marketing-print', label: 'Marketing Print', icon: '📄', desc: 'Flyers, brochures, postcards' },
  { id: 'menu-printing', label: 'Menus', icon: '🍽️', desc: 'Dine-in, takeout, laminated' },
  { id: 'business-cards', label: 'Business Cards', icon: '💳', desc: 'Standard to luxury finishes' },
  { id: 'large-format', label: 'Large Format', icon: '🖼️', desc: 'Banners, signage, displays' },
  { id: 'other', label: 'Other / Not Sure', icon: '❓', desc: 'Tell us about your project' },
];

const steps = ['Select Product', 'Specifications', 'Upload Files', 'Contact & Submit'];

type ProductConfig = {
  label: string;
  fields: Array<{
    id: string;
    label: string;
    type: string;
    options?: string[];
    placeholder?: string;
  }>;
};

export default function QuotePage() {
  const searchParams = useSearchParams();
  const preselect = searchParams.get('product') || '';

  const [step, setStep] = useState(preselect ? 1 : 0);
  const [selectedProduct, setSelectedProduct] = useState(preselect);
  const [specs, setSpecs] = useState<Record<string, string | string[]>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [contact, setContact] = useState({ name: '', company: '', email: '', phone: '', deadline: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);

  const productConfig = quoteConfig.products[selectedProduct as keyof typeof quoteConfig.products] as ProductConfig | undefined;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.size < 100 * 1024 * 1024);
    setFiles((prev) => [...prev, ...dropped].slice(0, 5));
  }, []);

  const handleSubmit = () => {
    console.log({ selectedProduct, specs, files: files.map((f) => f.name), contact });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="min-h-screen bg-[var(--surface)] pt-28 pb-16 flex items-center">
        <div className="container-content text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="font-serif text-[var(--navy)] text-2xl mb-4">Thank You!</h1>
          <p className="text-[var(--text-secondary)] mb-4">
            We've received your quote request for{' '}
            <strong>{products.find((p) => p.id === selectedProduct)?.label}</strong>.
          </p>
          <p className="text-[var(--text-secondary)] mb-8">
            Our team will review your project details and get back to you within <strong>24 hours</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-gold-gradient text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Back to Home
            </Link>
            <Link href="/products" className="border-2 border-[var(--border)] text-[var(--navy)] font-semibold px-6 py-3 rounded-xl hover:border-[var(--navy)] transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[var(--surface)] pt-28 pb-10 border-b border-[var(--border)]">
        <div className="container-content text-center">
          <h1 className="font-serif text-[var(--navy)] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            Request a Quote
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            Tell us about your print project and we'll provide a custom price within 24 hours.
          </p>
        </div>
      </section>

      {/* Progress */}
      <div className="bg-white border-b border-[var(--border)] py-5">
        <div className="container-content max-w-3xl mx-auto">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-[var(--navy)]' : 'text-[var(--text-secondary)]'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-[var(--success)] text-white' : i === step ? 'bg-[var(--navy)] text-white' : 'bg-[var(--border)] text-[var(--text-secondary)]'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-xs font-semibold hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-[var(--success)]' : 'bg-[var(--border)]'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-content max-w-3xl mx-auto">
          {/* Step 0: Select Product */}
          {step === 0 && (
            <div>
              <h2 className="font-serif text-[var(--navy)] text-xl mb-7">What would you like to print?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`p-5 rounded-2xl border-2 text-center transition-all ${selectedProduct === product.id ? 'border-[var(--gold)] bg-[var(--gold-50)]' : 'border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--gold-50)]'}`}
                  >
                    <div className="text-3xl mb-2">{product.icon}</div>
                    <div className="font-semibold text-[var(--navy)] text-xs">{product.label}</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1 leading-tight">{product.desc}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  disabled={!selectedProduct}
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next: Specifications <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Specs */}
          {step === 1 && productConfig && (
            <div>
              <h2 className="font-serif text-[var(--navy)] text-xl mb-2">
                {productConfig.label} Specifications
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-7">Provide as much detail as you can. Our team will follow up if needed.</p>
              <div className="space-y-6">
                {productConfig.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-semibold text-[var(--navy)] mb-2">{field.label}</label>
                    {field.type === 'radio' && field.options && (
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setSpecs((prev) => ({ ...prev, [field.id]: opt }))}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${specs[field.id] === opt ? 'border-[var(--gold)] bg-[var(--gold-50)] text-[var(--navy)]' : 'border-[var(--border)] text-[var(--charcoal)] hover:border-[var(--gold)]'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    {field.type === 'checkbox' && field.options && (
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((opt) => {
                          const arr = (specs[field.id] as string[]) || [];
                          const checked = arr.includes(opt);
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                const next = checked ? arr.filter((v) => v !== opt) : [...arr, opt];
                                setSpecs((prev) => ({ ...prev, [field.id]: next }));
                              }}
                              className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${checked ? 'border-[var(--gold)] bg-[var(--gold-50)] text-[var(--navy)]' : 'border-[var(--border)] text-[var(--charcoal)] hover:border-[var(--gold)]'}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {field.type === 'select' && field.options && (
                      <select
                        className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] bg-white"
                        value={(specs[field.id] as string) || ''}
                        onChange={(e) => setSpecs((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      >
                        <option value="">Select...</option>
                        {field.options.map((opt) => <option key={opt}>{opt}</option>)}
                      </select>
                    )}
                    {(field.type === 'number' || field.type === 'text') && (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                        value={(specs[field.id] as string) || ''}
                        onChange={(e) => setSpecs((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      />
                    )}
                    {field.type === 'textarea' && (
                      <textarea
                        rows={5}
                        placeholder={field.placeholder}
                        className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none"
                        value={(specs[field.id] as string) || ''}
                        onChange={(e) => setSpecs((prev) => ({ ...prev, [field.id]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(0)} className="inline-flex items-center gap-2 border-2 border-[var(--border)] text-[var(--navy)] font-semibold px-6 py-3 rounded-xl hover:border-[var(--navy)] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
                  Next: File Upload <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Upload */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-[var(--navy)] text-xl mb-2">Upload Your Files</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-7">
                Optional — you can send files later. Accepted: PDF, AI, INDD, PSD, TIFF, ZIP. Max 100MB per file, up to 5 files.
              </p>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${dragging ? 'border-[var(--gold)] bg-[var(--gold-50)]' : 'border-[var(--border)] bg-[var(--surface)]'}`}
              >
                <Upload className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-4" />
                <p className="font-semibold text-[var(--navy)] mb-1">Drag & drop files here</p>
                <p className="text-sm text-[var(--text-secondary)] mb-5">or click to browse</p>
                <label className="inline-block cursor-pointer bg-[var(--navy)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[var(--navy-light)] transition-colors">
                  Choose Files
                  <input type="file" multiple className="hidden" accept=".pdf,.ai,.indd,.psd,.tiff,.tif,.zip" onChange={(e) => {
                    const selected = Array.from(e.target.files || []).slice(0, 5 - files.length);
                    setFiles((prev) => [...prev, ...selected].slice(0, 5));
                  }} />
                </label>
              </div>
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3">
                      <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                      <span className="text-sm font-medium text-[var(--navy)] flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-[var(--text-secondary)]">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                      <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3">
                <Link href="/file-guidelines" className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] font-medium">
                  View file preparation guidelines →
                </Link>
              </div>
              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 border-2 border-[var(--border)] text-[var(--navy)] font-semibold px-6 py-3 rounded-xl hover:border-[var(--navy)] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="text-sm font-medium text-[var(--text-secondary)] px-4 py-3 hover:text-[var(--navy)] transition-colors">
                    Skip — send files later
                  </button>
                  <button onClick={() => setStep(3)} className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold">
                    Next: Contact <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-[var(--navy)] text-xl mb-7">Your Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">Full Name *</label>
                  <input type="text" required className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">Company</label>
                  <input type="text" className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" value={contact.company} onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">Email *</label>
                  <input type="email" required className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">Phone *</label>
                  <input type="tel" required className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">Project Deadline / Needed By</label>
                <input type="date" className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]" value={contact.deadline} onChange={(e) => setContact((c) => ({ ...c, deadline: e.target.value }))} />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-[var(--navy)] mb-1.5">Special Instructions</label>
                <textarea rows={4} className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] resize-none" placeholder="Any additional details, delivery instructions, or questions..." value={contact.notes} onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))} />
              </div>
              <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 mb-6">
                <p className="text-xs font-semibold text-[var(--navy)] mb-2">Your Summary</p>
                <p className="text-sm text-[var(--text-secondary)]">Product: <strong>{products.find((p) => p.id === selectedProduct)?.label}</strong></p>
                {files.length > 0 && <p className="text-sm text-[var(--text-secondary)]">Files: {files.length} file(s) attached</p>}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 border-2 border-[var(--border)] text-[var(--navy)] font-semibold px-6 py-3 rounded-xl hover:border-[var(--navy)] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!contact.name || !contact.email || !contact.phone}
                  className="inline-flex items-center gap-2 bg-gold-gradient text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-gold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Quote Request <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom bar */}
      <section className="bg-[var(--surface)] py-8 border-t border-[var(--border)]">
        <div className="container-content text-center">
          <p className="text-sm text-[var(--text-secondary)]">Prefer to discuss your project directly?</p>
          <a href="tel:+12125550100" className="inline-flex items-center gap-2 text-[var(--navy)] font-semibold mt-2 hover:text-[var(--gold)] transition-colors">
            <Phone className="w-4 h-4 text-[var(--gold)]" /> Call us at (212) 555-0100
          </a>
        </div>
      </section>
    </>
  );
}
