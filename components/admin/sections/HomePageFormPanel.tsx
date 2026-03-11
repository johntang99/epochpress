'use client';

interface HomePageFormPanelProps {
  isHomePageFile: boolean;
  formData: Record<string, any> | null;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

const HOME_PRODUCT_VARIANTS = [
  'featured-large',
  'grid-2x',
  'grid-3x',
  'detail-alternating',
] as const;

function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function HomePageFormPanel({
  isHomePageFile,
  formData,
  updateFormValue,
  openImagePicker,
}: HomePageFormPanelProps) {
  if (!isHomePageFile || !formData) return null;

  const categories = ensureArray<Record<string, any>>(formData.categories);
  const whyPoints = ensureArray<Record<string, any>>(formData?.whyChooseUs?.points);
  const stats = ensureArray<Record<string, any>>(formData.stats);
  const portfolio = ensureArray<Record<string, any>>(formData.portfolio);
  const process = ensureArray<Record<string, any>>(formData.process);

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">Hero</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Badge</label>
            <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.badge || '')} onChange={(event) => updateFormValue(['hero', 'badge'], event.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Hero Variant</label>
            <select className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white" value={String(formData?.hero?.variant || '')} onChange={(event) => updateFormValue(['hero', 'variant'], event.target.value)}>
              <option value="">Default</option>
              <option value="photo-background">photo-background</option>
              <option value="centered">centered</option>
              <option value="split-photo-right">split-photo-right</option>
              <option value="split-photo-left">split-photo-left</option>
              <option value="overlap">overlap</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500">Headline</label>
          <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.headline || '')} onChange={(event) => updateFormValue(['hero', 'headline'], event.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Subline</label>
          <textarea className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.subline || '')} onChange={(event) => updateFormValue(['hero', 'subline'], event.target.value)} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Background Image</label>
            <div className="mt-1 flex gap-2">
              <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.backgroundImage || '')} onChange={(event) => updateFormValue(['hero', 'backgroundImage'], event.target.value)} />
              <button type="button" onClick={() => openImagePicker(['hero', 'backgroundImage'])} className="px-3 rounded-md border border-gray-200 text-xs">Choose</button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Hero Image</label>
            <div className="mt-1 flex gap-2">
              <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.image || '')} onChange={(event) => updateFormValue(['hero', 'image'], event.target.value)} />
              <button type="button" onClick={() => openImagePicker(['hero', 'image'])} className="px-3 rounded-md border border-gray-200 text-xs">Choose</button>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Primary CTA Text</label>
            <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.primaryCta?.text || '')} onChange={(event) => updateFormValue(['hero', 'primaryCta', 'text'], event.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Primary CTA Href</label>
            <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.primaryCta?.href || '')} onChange={(event) => updateFormValue(['hero', 'primaryCta', 'href'], event.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Secondary CTA Text</label>
            <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.secondaryCta?.text || '')} onChange={(event) => updateFormValue(['hero', 'secondaryCta', 'text'], event.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Secondary CTA Href</label>
            <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.hero?.secondaryCta?.href || '')} onChange={(event) => updateFormValue(['hero', 'secondaryCta', 'href'], event.target.value)} />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">Products Section</div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Badge</label>
            <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.servicesSection?.badge || '')} onChange={(event) => updateFormValue(['servicesSection', 'badge'], event.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Featured Slug</label>
            <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.servicesSection?.featuredSlug || '')} onChange={(event) => updateFormValue(['servicesSection', 'featuredSlug'], event.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Display Variant</label>
            <select className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white" value={String(formData?.servicesSection?.variant || 'featured-large')} onChange={(event) => updateFormValue(['servicesSection', 'variant'], event.target.value)}>
              {HOME_PRODUCT_VARIANTS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500">Title</label>
          <input className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.servicesSection?.title || '')} onChange={(event) => updateFormValue(['servicesSection', 'title'], event.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Subtitle</label>
          <textarea className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={String(formData?.servicesSection?.subtitle || '')} onChange={(event) => updateFormValue(['servicesSection', 'subtitle'], event.target.value)} />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">Products List (categories)</div>
          <button type="button" onClick={() => updateFormValue(['categories'], [...categories, { name: '', slug: '', desc: '' }])} className="px-3 py-1.5 rounded-md border border-gray-200 text-xs">Add Product</button>
        </div>
        <div className="space-y-3">
          {categories.map((item, index) => (
            <div key={`category-${index}`} className="rounded-md border border-gray-200 p-3 space-y-2">
              <div className="grid gap-2 md:grid-cols-3">
                <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Name" value={String(item?.name || '')} onChange={(event) => updateFormValue(['categories', String(index), 'name'], event.target.value)} />
                <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Slug" value={String(item?.slug || '')} onChange={(event) => updateFormValue(['categories', String(index), 'slug'], event.target.value)} />
                <button type="button" onClick={() => updateFormValue(['categories'], categories.filter((_, i) => i !== index))} className="rounded-md border border-red-200 px-3 py-2 text-xs text-red-600">Remove</button>
              </div>
              <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Description" value={String(item?.desc || '')} onChange={(event) => updateFormValue(['categories', String(index), 'desc'], event.target.value)} />
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">Why Choose Us</div>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Badge" value={String(formData?.whyChooseUs?.badge || '')} onChange={(event) => updateFormValue(['whyChooseUs', 'badge'], event.target.value)} />
          <input className="rounded-md border border-gray-200 px-3 py-2 text-sm md:col-span-2" placeholder="Title" value={String(formData?.whyChooseUs?.title || '')} onChange={(event) => updateFormValue(['whyChooseUs', 'title'], event.target.value)} />
        </div>
        <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Subtitle" value={String(formData?.whyChooseUs?.subtitle || '')} onChange={(event) => updateFormValue(['whyChooseUs', 'subtitle'], event.target.value)} />
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">Points</div>
          <button type="button" onClick={() => updateFormValue(['whyChooseUs', 'points'], [...whyPoints, { title: '', description: '' }])} className="px-3 py-1.5 rounded-md border border-gray-200 text-xs">Add Point</button>
        </div>
        <div className="space-y-2">
          {whyPoints.map((item, index) => (
            <div key={`why-${index}`} className="rounded-md border border-gray-200 p-3 space-y-2">
              <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Point title" value={String(item?.title || '')} onChange={(event) => updateFormValue(['whyChooseUs', 'points', String(index), 'title'], event.target.value)} />
              <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Point description" value={String(item?.description || '')} onChange={(event) => updateFormValue(['whyChooseUs', 'points', String(index), 'description'], event.target.value)} />
              <button type="button" onClick={() => updateFormValue(['whyChooseUs', 'points'], whyPoints.filter((_, i) => i !== index))} className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-500 uppercase">Stats</div>
            <button type="button" onClick={() => updateFormValue(['stats'], [...stats, { value: '', label: '' }])} className="px-3 py-1.5 rounded-md border border-gray-200 text-xs">Add Stat</button>
          </div>
          {stats.map((item, index) => (
            <div key={`stat-${index}`} className="grid gap-2 md:grid-cols-3">
              <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Value" value={String(item?.value || '')} onChange={(event) => updateFormValue(['stats', String(index), 'value'], event.target.value)} />
              <input className="rounded-md border border-gray-200 px-3 py-2 text-sm md:col-span-2" placeholder="Label" value={String(item?.label || '')} onChange={(event) => updateFormValue(['stats', String(index), 'label'], event.target.value)} />
            </div>
          ))}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase">Blog Preview</div>
          <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Badge" value={String(formData?.blogPreview?.badge || '')} onChange={(event) => updateFormValue(['blogPreview', 'badge'], event.target.value)} />
          <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Title" value={String(formData?.blogPreview?.title || '')} onChange={(event) => updateFormValue(['blogPreview', 'title'], event.target.value)} />
          <textarea className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Subtitle" value={String(formData?.blogPreview?.subtitle || '')} onChange={(event) => updateFormValue(['blogPreview', 'subtitle'], event.target.value)} />
          <div className="grid gap-2 md:grid-cols-2">
            <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="CTA text" value={String(formData?.blogPreview?.ctaText || '')} onChange={(event) => updateFormValue(['blogPreview', 'ctaText'], event.target.value)} />
            <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="CTA href" value={String(formData?.blogPreview?.ctaHref || '')} onChange={(event) => updateFormValue(['blogPreview', 'ctaHref'], event.target.value)} />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">Portfolio Highlights</div>
          <button type="button" onClick={() => updateFormValue(['portfolio'], [...portfolio, { title: '', category: '', desc: '', image: '' }])} className="px-3 py-1.5 rounded-md border border-gray-200 text-xs">Add Item</button>
        </div>
        {portfolio.map((item, index) => (
          <div key={`portfolio-${index}`} className="rounded-md border border-gray-200 p-3 space-y-2">
            <div className="grid gap-2 md:grid-cols-3">
              <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Title" value={String(item?.title || '')} onChange={(event) => updateFormValue(['portfolio', String(index), 'title'], event.target.value)} />
              <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Category" value={String(item?.category || '')} onChange={(event) => updateFormValue(['portfolio', String(index), 'category'], event.target.value)} />
              <button type="button" onClick={() => updateFormValue(['portfolio'], portfolio.filter((_, i) => i !== index))} className="rounded-md border border-red-200 px-3 py-2 text-xs text-red-600">Remove</button>
            </div>
            <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Description" value={String(item?.desc || '')} onChange={(event) => updateFormValue(['portfolio', String(index), 'desc'], event.target.value)} />
            <div className="flex gap-2">
              <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Image URL (optional)" value={String(item?.image || '')} onChange={(event) => updateFormValue(['portfolio', String(index), 'image'], event.target.value)} />
              <button type="button" onClick={() => openImagePicker(['portfolio', String(index), 'image'])} className="px-3 rounded-md border border-gray-200 text-xs">Choose</button>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">Process Steps</div>
          <button type="button" onClick={() => updateFormValue(['process'], [...process, { step: process.length + 1, title: '', desc: '' }])} className="px-3 py-1.5 rounded-md border border-gray-200 text-xs">Add Step</button>
        </div>
        {process.map((item, index) => (
          <div key={`process-${index}`} className="grid gap-2 md:grid-cols-[100px_1fr_1fr_auto]">
            <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Step" value={String(item?.step || '')} onChange={(event) => updateFormValue(['process', String(index), 'step'], Number(event.target.value) || 0)} />
            <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Title" value={String(item?.title || '')} onChange={(event) => updateFormValue(['process', String(index), 'title'], event.target.value)} />
            <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Description" value={String(item?.desc || '')} onChange={(event) => updateFormValue(['process', String(index), 'desc'], event.target.value)} />
            <button type="button" onClick={() => updateFormValue(['process'], process.filter((_, i) => i !== index))} className="rounded-md border border-red-200 px-3 py-2 text-xs text-red-600">Remove</button>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">Final CTA</div>
        <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Headline" value={String(formData?.cta?.headline || '')} onChange={(event) => updateFormValue(['cta', 'headline'], event.target.value)} />
        <textarea className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Subline" value={String(formData?.cta?.subline || '')} onChange={(event) => updateFormValue(['cta', 'subline'], event.target.value)} />
        <div className="grid gap-2 md:grid-cols-2">
          <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Primary CTA text" value={String(formData?.cta?.primaryCta?.text || '')} onChange={(event) => updateFormValue(['cta', 'primaryCta', 'text'], event.target.value)} />
          <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Primary CTA href" value={String(formData?.cta?.primaryCta?.href || '')} onChange={(event) => updateFormValue(['cta', 'primaryCta', 'href'], event.target.value)} />
          <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Secondary CTA text" value={String(formData?.cta?.secondaryCta?.text || '')} onChange={(event) => updateFormValue(['cta', 'secondaryCta', 'text'], event.target.value)} />
          <input className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Secondary CTA href" value={String(formData?.cta?.secondaryCta?.href || '')} onChange={(event) => updateFormValue(['cta', 'secondaryCta', 'href'], event.target.value)} />
        </div>
      </div>
    </div>
  );
}
