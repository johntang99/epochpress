'use client';

interface LandingPageFormPanelProps {
  isLandingFile: boolean;
  formData: Record<string, any> | null;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const HERO_VARIANTS = ['default', 'split-photo-right', 'split-photo-left', 'centered'];
const PRODUCT_VARIANTS = ['grid-2x', 'grid-3x', 'detail-alternating'];

export function LandingPageFormPanel({
  isLandingFile,
  formData,
  updateFormValue,
  openImagePicker,
}: LandingPageFormPanelProps) {
  if (!isLandingFile || !formData) return null;

  const trustBar = Array.isArray(formData.trustBar) ? formData.trustBar : [];
  const capabilitiesItems = Array.isArray(formData.capabilities?.items) ? formData.capabilities.items : [];
  const productItems = Array.isArray(formData.productGallery?.items) ? formData.productGallery.items : [];
  const proofItems = Array.isArray(formData.proof?.items) ? formData.proof.items : [];
  const processSteps = Array.isArray(formData.process?.steps) ? formData.process.steps : [];
  const caseStudyItems = Array.isArray(formData.caseStudies?.items) ? formData.caseStudies.items : [];
  const galleryItems = Array.isArray(formData.galleryRail?.items) ? formData.galleryRail.items : [];
  const faqItems = Array.isArray(formData.faq?.items) ? formData.faq.items : [];

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Meta</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Locale</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.meta?.locale || ''}
              onChange={(event) => updateFormValue(['meta', 'locale'], event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="landing-rtl"
              type="checkbox"
              checked={Boolean(formData.meta?.rtl)}
              onChange={(event) => updateFormValue(['meta', 'rtl'], event.target.checked)}
            />
            <label htmlFor="landing-rtl" className="text-xs text-gray-600">
              RTL
            </label>
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">SEO Title</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.meta?.title || ''}
            onChange={(event) => updateFormValue(['meta', 'title'], event.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">SEO Description</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            rows={2}
            value={formData.meta?.description || ''}
            onChange={(event) => updateFormValue(['meta', 'description'], event.target.value)}
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Hero</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Hero Variant</label>
            <select
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
              value={formData.hero?.variant || 'default'}
              onChange={(event) => updateFormValue(['hero', 'variant'], event.target.value)}
            >
              {HERO_VARIANTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Badge</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.hero?.badge || ''}
              onChange={(event) => updateFormValue(['hero', 'badge'], event.target.value)}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Headline</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.hero?.headline || ''}
            onChange={(event) => updateFormValue(['hero', 'headline'], event.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500">Subline</label>
          <textarea
            rows={2}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.hero?.subline || ''}
            onChange={(event) => updateFormValue(['hero', 'subline'], event.target.value)}
          />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Background Image</label>
            <div className="mt-1 flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.hero?.backgroundImage || ''}
                onChange={(event) => updateFormValue(['hero', 'backgroundImage'], event.target.value)}
              />
              <button
                type="button"
                onClick={() => openImagePicker(['hero', 'backgroundImage'])}
                className="px-3 rounded-md border border-gray-200 text-xs"
              >
                Choose
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Hero Image</label>
            <div className="mt-1 flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.hero?.image || ''}
                onChange={(event) => updateFormValue(['hero', 'image'], event.target.value)}
              />
              <button
                type="button"
                onClick={() => openImagePicker(['hero', 'image'])}
                className="px-3 rounded-md border border-gray-200 text-xs"
              >
                Choose
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Primary CTA Text</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.hero?.primaryCta?.text || ''}
              onChange={(event) => updateFormValue(['hero', 'primaryCta', 'text'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Primary CTA Href</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.hero?.primaryCta?.href || ''}
              onChange={(event) => updateFormValue(['hero', 'primaryCta', 'href'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Secondary CTA Text</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.hero?.secondaryCta?.text || ''}
              onChange={(event) => updateFormValue(['hero', 'secondaryCta', 'text'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Secondary CTA Href</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.hero?.secondaryCta?.href || ''}
              onChange={(event) => updateFormValue(['hero', 'secondaryCta', 'href'], event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Trust Strip</div>
        <div className="space-y-2">
          {trustBar.map((item: string, idx: number) => (
            <input
              key={`trust-${idx}`}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={item || ''}
              onChange={(event) => updateFormValue(['trustBar', String(idx)], event.target.value)}
            />
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Capabilities</div>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={formData.capabilities?.title || ''}
          onChange={(event) => updateFormValue(['capabilities', 'title'], event.target.value)}
          placeholder="Section title"
        />
        <div className="mt-3 space-y-3">
          {capabilitiesItems.map((item: any, idx: number) => (
            <div key={`cap-${idx}`} className="rounded-md border border-gray-200 p-3">
              <input
                className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.title || ''}
                onChange={(event) => updateFormValue(['capabilities', 'items', String(idx), 'title'], event.target.value)}
                placeholder="Item title"
              />
              <textarea
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                rows={2}
                value={item?.desc || ''}
                onChange={(event) => updateFormValue(['capabilities', 'items', String(idx), 'desc'], event.target.value)}
                placeholder="Item description"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Products</div>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.productGallery?.title || ''}
            onChange={(event) => updateFormValue(['productGallery', 'title'], event.target.value)}
            placeholder="Section title"
          />
          <select
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
            value={formData.productGallery?.variant || 'grid-3x'}
            onChange={(event) => updateFormValue(['productGallery', 'variant'], event.target.value)}
          >
            {PRODUCT_VARIANTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 space-y-3">
          {productItems.map((item: any, idx: number) => (
            <div key={`product-${idx}`} className="rounded-md border border-gray-200 p-3">
              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={item?.name || ''}
                  onChange={(event) => updateFormValue(['productGallery', 'items', String(idx), 'name'], event.target.value)}
                  placeholder="Name"
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={item?.href || ''}
                  onChange={(event) => updateFormValue(['productGallery', 'items', String(idx), 'href'], event.target.value)}
                  placeholder="Href"
                />
              </div>
              <textarea
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                rows={2}
                value={item?.desc || ''}
                onChange={(event) => updateFormValue(['productGallery', 'items', String(idx), 'desc'], event.target.value)}
                placeholder="Description"
              />
              <div className="mt-2 flex gap-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={item?.image || ''}
                  onChange={(event) => updateFormValue(['productGallery', 'items', String(idx), 'image'], event.target.value)}
                  placeholder="Image URL"
                />
                <button
                  type="button"
                  onClick={() => openImagePicker(['productGallery', 'items', String(idx), 'image'])}
                  className="px-3 rounded-md border border-gray-200 text-xs"
                >
                  Choose
                </button>
              </div>
              <textarea
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                rows={3}
                value={Array.isArray(item?.highlights) ? item.highlights.join('\n') : ''}
                onChange={(event) =>
                  updateFormValue(
                    ['productGallery', 'items', String(idx), 'highlights'],
                    event.target.value
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="One highlight per line"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Proof</div>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={formData.proof?.title || ''}
          onChange={(event) => updateFormValue(['proof', 'title'], event.target.value)}
          placeholder="Section title"
        />
        <div className="mt-3 space-y-3">
          {proofItems.map((item: any, idx: number) => (
            <div key={`proof-${idx}`} className="grid gap-2 md:grid-cols-3">
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.metric || ''}
                onChange={(event) => updateFormValue(['proof', 'items', String(idx), 'metric'], event.target.value)}
                placeholder="Metric"
              />
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.label || ''}
                onChange={(event) => updateFormValue(['proof', 'items', String(idx), 'label'], event.target.value)}
                placeholder="Label"
              />
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.detail || ''}
                onChange={(event) => updateFormValue(['proof', 'items', String(idx), 'detail'], event.target.value)}
                placeholder="Detail"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Process</div>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={formData.process?.title || ''}
          onChange={(event) => updateFormValue(['process', 'title'], event.target.value)}
          placeholder="Section title"
        />
        <div className="mt-3 space-y-3">
          {processSteps.map((item: any, idx: number) => (
            <div key={`step-${idx}`} className="rounded-md border border-gray-200 p-3">
              <input
                className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.title || ''}
                onChange={(event) => updateFormValue(['process', 'steps', String(idx), 'title'], event.target.value)}
                placeholder="Step title"
              />
              <textarea
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                rows={2}
                value={item?.desc || ''}
                onChange={(event) => updateFormValue(['process', 'steps', String(idx), 'desc'], event.target.value)}
                placeholder="Step description"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Case Studies</div>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={formData.caseStudies?.title || ''}
          onChange={(event) => updateFormValue(['caseStudies', 'title'], event.target.value)}
          placeholder="Section title"
        />
        <div className="mt-3 space-y-3">
          {caseStudyItems.map((item: any, idx: number) => (
            <div key={`case-${idx}`} className="rounded-md border border-gray-200 p-3">
              <div className="grid gap-2 md:grid-cols-3">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={item?.title || ''}
                  onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'title'], event.target.value)}
                  placeholder="Title"
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={item?.category || ''}
                  onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'category'], event.target.value)}
                  placeholder="Category"
                />
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={item?.client || ''}
                  onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'client'], event.target.value)}
                  placeholder="Client"
                />
              </div>
              <textarea
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                rows={2}
                value={item?.challenge || ''}
                onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'challenge'], event.target.value)}
                placeholder="Challenge"
              />
              <textarea
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                rows={2}
                value={item?.solution || ''}
                onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'solution'], event.target.value)}
                placeholder="Solution"
              />
              <textarea
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                rows={2}
                value={item?.result || ''}
                onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'result'], event.target.value)}
                placeholder="Result"
              />
              <input
                className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.quote || ''}
                onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'quote'], event.target.value)}
                placeholder="Quote"
              />
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <input
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={item?.author || ''}
                  onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'author'], event.target.value)}
                  placeholder="Author"
                />
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={Boolean(item?.featured)}
                    onChange={(event) => updateFormValue(['caseStudies', 'items', String(idx), 'featured'], event.target.checked)}
                  />
                  Featured
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Gallery</div>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={formData.galleryRail?.title || ''}
          onChange={(event) => updateFormValue(['galleryRail', 'title'], event.target.value)}
          placeholder="Section title"
        />
        <div className="mt-3 space-y-3">
          {galleryItems.map((item: any, idx: number) => (
            <div key={`gallery-${idx}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.image || ''}
                onChange={(event) => updateFormValue(['galleryRail', 'items', String(idx), 'image'], event.target.value)}
                placeholder="Image URL"
              />
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.alt || ''}
                onChange={(event) => updateFormValue(['galleryRail', 'items', String(idx), 'alt'], event.target.value)}
                placeholder="Alt text"
              />
              <button
                type="button"
                onClick={() => openImagePicker(['galleryRail', 'items', String(idx), 'image'])}
                className="px-3 rounded-md border border-gray-200 text-xs"
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">FAQ</div>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={formData.faq?.title || ''}
          onChange={(event) => updateFormValue(['faq', 'title'], event.target.value)}
          placeholder="Section title"
        />
        <div className="mt-3 space-y-3">
          {faqItems.map((item: any, idx: number) => (
            <div key={`faq-${idx}`} className="rounded-md border border-gray-200 p-3">
              <input
                className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={item?.q || ''}
                onChange={(event) => updateFormValue(['faq', 'items', String(idx), 'q'], event.target.value)}
                placeholder="Question"
              />
              <textarea
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                rows={2}
                value={item?.a || ''}
                onChange={(event) => updateFormValue(['faq', 'items', String(idx), 'a'], event.target.value)}
                placeholder="Answer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Contact</div>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.formTitle || ''}
            onChange={(event) => updateFormValue(['contact', 'formTitle'], event.target.value)}
            placeholder="Form title"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.infoTitle || ''}
            onChange={(event) => updateFormValue(['contact', 'infoTitle'], event.target.value)}
            placeholder="Info title"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.fullNameLabel || ''}
            onChange={(event) => updateFormValue(['contact', 'fullNameLabel'], event.target.value)}
            placeholder="Full name label"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.fullNamePlaceholder || ''}
            onChange={(event) => updateFormValue(['contact', 'fullNamePlaceholder'], event.target.value)}
            placeholder="Full name placeholder"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.companyLabel || ''}
            onChange={(event) => updateFormValue(['contact', 'companyLabel'], event.target.value)}
            placeholder="Company label"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.companyPlaceholder || ''}
            onChange={(event) => updateFormValue(['contact', 'companyPlaceholder'], event.target.value)}
            placeholder="Company placeholder"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.emailLabel || ''}
            onChange={(event) => updateFormValue(['contact', 'emailLabel'], event.target.value)}
            placeholder="Email label"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.emailPlaceholder || ''}
            onChange={(event) => updateFormValue(['contact', 'emailPlaceholder'], event.target.value)}
            placeholder="Email placeholder"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.phoneLabel || ''}
            onChange={(event) => updateFormValue(['contact', 'phoneLabel'], event.target.value)}
            placeholder="Phone label"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.phonePlaceholder || ''}
            onChange={(event) => updateFormValue(['contact', 'phonePlaceholder'], event.target.value)}
            placeholder="Phone placeholder"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.productInterestLabel || ''}
            onChange={(event) => updateFormValue(['contact', 'productInterestLabel'], event.target.value)}
            placeholder="Product interest label"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.productInterestPlaceholder || ''}
            onChange={(event) => updateFormValue(['contact', 'productInterestPlaceholder'], event.target.value)}
            placeholder="Product interest placeholder"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.messageLabel || ''}
            onChange={(event) => updateFormValue(['contact', 'messageLabel'], event.target.value)}
            placeholder="Message label"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.messagePlaceholder || ''}
            onChange={(event) => updateFormValue(['contact', 'messagePlaceholder'], event.target.value)}
            placeholder="Message placeholder"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.sendButtonText || ''}
            onChange={(event) => updateFormValue(['contact', 'sendButtonText'], event.target.value)}
            placeholder="Send button text"
          />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.phoneValue || ''}
            onChange={(event) => updateFormValue(['contact', 'phoneValue'], event.target.value)}
            placeholder="Phone value"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.emailValue || ''}
            onChange={(event) => updateFormValue(['contact', 'emailValue'], event.target.value)}
            placeholder="Email value"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.addressLine1 || ''}
            onChange={(event) => updateFormValue(['contact', 'addressLine1'], event.target.value)}
            placeholder="Address line 1"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.contact?.addressLine2 || ''}
            onChange={(event) => updateFormValue(['contact', 'addressLine2'], event.target.value)}
            placeholder="Address line 2"
          />
        </div>
        <textarea
          className="mt-3 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          rows={3}
          value={Array.isArray(formData.contact?.hoursLines) ? formData.contact.hoursLines.join('\n') : ''}
          onChange={(event) =>
            updateFormValue(
              ['contact', 'hoursLines'],
              event.target.value
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
            )
          }
          placeholder="One hours line per row"
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Final CTA</div>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.finalCta?.title || ''}
            onChange={(event) => updateFormValue(['finalCta', 'title'], event.target.value)}
            placeholder="Title"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.finalCta?.subline || ''}
            onChange={(event) => updateFormValue(['finalCta', 'subline'], event.target.value)}
            placeholder="Subline"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.finalCta?.primaryText || ''}
            onChange={(event) => updateFormValue(['finalCta', 'primaryText'], event.target.value)}
            placeholder="Primary text"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.finalCta?.primaryHref || ''}
            onChange={(event) => updateFormValue(['finalCta', 'primaryHref'], event.target.value)}
            placeholder="Primary href"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.finalCta?.secondaryText || ''}
            onChange={(event) => updateFormValue(['finalCta', 'secondaryText'], event.target.value)}
            placeholder="Secondary text"
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.finalCta?.secondaryHref || ''}
            onChange={(event) => updateFormValue(['finalCta', 'secondaryHref'], event.target.value)}
            placeholder="Secondary href"
          />
        </div>
      </div>
    </div>
  );
}
