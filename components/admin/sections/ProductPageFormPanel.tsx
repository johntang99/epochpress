'use client';

interface ProductPageFormPanelProps {
  isProductPageFile: boolean;
  formData: Record<string, any> | null;
  productHero: any;
  productHeroKey: string;
  heroVariantOptions: string[];
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function ProductPageFormPanel({
  isProductPageFile,
  formData,
  productHero,
  productHeroKey,
  heroVariantOptions,
  updateFormValue,
  openImagePicker,
}: ProductPageFormPanelProps) {
  if (!isProductPageFile || !formData) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="text-xs font-semibold text-gray-500 uppercase">Product Page</div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs text-gray-500">Slug</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.slug || ''}
            onChange={(event) => updateFormValue(['slug'], event.target.value)}
          />
        </div>
        {!productHero && (
          <div>
            <label className="block text-xs text-gray-500">Name</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.name || ''}
              onChange={(event) => updateFormValue(['name'], event.target.value)}
            />
          </div>
        )}
      </div>
      {!productHero && (
        <>
          <div>
            <label className="block text-xs text-gray-500">Tagline</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.tagline || ''}
              onChange={(event) => updateFormValue(['tagline'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Description</label>
            <textarea
              className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={formData.description || ''}
              onChange={(event) => updateFormValue(['description'], event.target.value)}
            />
          </div>
        </>
      )}

      <div className="rounded-md border border-gray-200 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase">Page Hero</div>
          {!productHero && (
            <button
              type="button"
              onClick={() =>
                updateFormValue([productHeroKey], {
                  title: formData.name || '',
                  subtitle: formData.tagline || '',
                  description: formData.description || '',
                  image: '',
                  backgroundImage: '',
                  variants: ['split-photo-right'],
                })
              }
              className="px-2 py-1 rounded border border-gray-200 text-xs"
            >
              Add Hero
            </button>
          )}
        </div>
        {productHero && (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500">Title</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={productHero.title || ''}
                  onChange={(event) =>
                    updateFormValue([productHeroKey, 'title'], event.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Subtitle</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={productHero.subtitle || ''}
                  onChange={(event) =>
                    updateFormValue([productHeroKey, 'subtitle'], event.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Description</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={productHero.description || ''}
                onChange={(event) =>
                  updateFormValue([productHeroKey, 'description'], event.target.value)
                }
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500">Hero Image</label>
                <div className="mt-1 flex gap-2">
                  <input
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    value={productHero.image || ''}
                    onChange={(event) =>
                      updateFormValue([productHeroKey, 'image'], event.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => openImagePicker([productHeroKey, 'image'])}
                    className="px-3 rounded-md border border-gray-200 text-xs"
                  >
                    Choose
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Background Image</label>
                <div className="mt-1 flex gap-2">
                  <input
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    value={productHero.backgroundImage || ''}
                    onChange={(event) =>
                      updateFormValue([productHeroKey, 'backgroundImage'], event.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => openImagePicker([productHeroKey, 'backgroundImage'])}
                    className="px-3 rounded-md border border-gray-200 text-xs"
                  >
                    Choose
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hero Variant</label>
              <select
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
                value={String(
                  productHero.variant ||
                    (Array.isArray(productHero.variants) ? productHero.variants[0] : '') ||
                    ''
                )}
                onChange={(event) => {
                  const selectedVariant = event.target.value;
                  updateFormValue([productHeroKey, 'variant'], selectedVariant);
                  updateFormValue(
                    [productHeroKey, 'variants'],
                    selectedVariant ? [selectedVariant] : []
                  );
                }}
              >
                <option value="">Default</option>
                {heroVariantOptions.map((option) => (
                  <option key={`product-hero-variant-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      <div className="rounded-md border border-gray-200 p-3">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Specifications Tabs
        </div>
        <div className="space-y-3">
          {(Array.isArray(formData.specs) ? formData.specs : []).map((spec: any, specIndex: number) => (
            <div key={`spec-${specIndex}`} className="rounded border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Tab name"
                  value={spec?.tab || ''}
                  onChange={(event) =>
                    updateFormValue(['specs', String(specIndex), 'tab'], event.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = [...(Array.isArray(formData.specs) ? formData.specs : [])];
                    next.splice(specIndex, 1);
                    updateFormValue(['specs'], next);
                  }}
                  className="px-3 py-2 rounded-md border border-red-200 text-red-600 text-xs"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-2">
                {(Array.isArray(spec?.items) ? spec.items : []).map((item: any, itemIndex: number) => (
                  <div
                    key={`spec-item-${specIndex}-${itemIndex}`}
                    className="grid gap-2 md:grid-cols-[1fr_2fr_2fr_auto]"
                  >
                    <input
                      className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                      placeholder="Label"
                      value={item?.label || ''}
                      onChange={(event) =>
                        updateFormValue(
                          ['specs', String(specIndex), 'items', String(itemIndex), 'label'],
                          event.target.value
                        )
                      }
                    />
                    <input
                      className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                      placeholder="Value"
                      value={item?.value || ''}
                      onChange={(event) =>
                        updateFormValue(
                          ['specs', String(specIndex), 'items', String(itemIndex), 'value'],
                          event.target.value
                        )
                      }
                    />
                    <input
                      className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                      placeholder="PDF href (optional)"
                      value={item?.pdfHref || ''}
                      onChange={(event) =>
                        updateFormValue(
                          ['specs', String(specIndex), 'items', String(itemIndex), 'pdfHref'],
                          event.target.value
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const items = [...(Array.isArray(spec?.items) ? spec.items : [])];
                        items.splice(itemIndex, 1);
                        updateFormValue(['specs', String(specIndex), 'items'], items);
                      }}
                      className="px-3 py-2 rounded-md border border-red-200 text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const items = [...(Array.isArray(spec?.items) ? spec.items : [])];
                    items.push({ label: '', value: '', pdfHref: '' });
                    updateFormValue(['specs', String(specIndex), 'items'], items);
                  }}
                  className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
                >
                  Add Item
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const next = [...(Array.isArray(formData.specs) ? formData.specs : [])];
              next.push({ tab: '', items: [{ label: '', value: '', pdfHref: '' }] });
              updateFormValue(['specs'], next);
            }}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
          >
            Add Specs Tab
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-gray-200 p-3 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase">Price Tiers</div>
          {(Array.isArray(formData.priceTiers) ? formData.priceTiers : []).map((item: any, index: number) => (
            <div key={`tier-${index}`} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Qty"
                value={item?.qty || ''}
                onChange={(event) =>
                  updateFormValue(['priceTiers', String(index), 'qty'], event.target.value)
                }
              />
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Note"
                value={item?.note || ''}
                onChange={(event) =>
                  updateFormValue(['priceTiers', String(index), 'note'], event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => {
                  const next = [...(Array.isArray(formData.priceTiers) ? formData.priceTiers : [])];
                  next.splice(index, 1);
                  updateFormValue(['priceTiers'], next);
                }}
                className="px-3 py-2 rounded-md border border-red-200 text-red-600 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const next = [...(Array.isArray(formData.priceTiers) ? formData.priceTiers : [])];
              next.push({ qty: '', note: '' });
              updateFormValue(['priceTiers'], next);
            }}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
          >
            Add Tier
          </button>
        </div>

        <div className="rounded-md border border-gray-200 p-3 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase">Detail Sheet</div>
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Link text"
            value={formData.detailSheet?.text || ''}
            onChange={(event) => updateFormValue(['detailSheet', 'text'], event.target.value)}
          />
          <input
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Href"
            value={formData.detailSheet?.href || ''}
            onChange={(event) => updateFormValue(['detailSheet', 'href'], event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-200 p-3 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase">Process</div>
        {(Array.isArray(formData.process) ? formData.process : []).map((item: any, index: number) => (
          <div key={`process-${index}`} className="rounded border border-gray-200 p-2 space-y-2">
            <div className="grid gap-2 md:grid-cols-[120px_1fr_auto]">
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Step"
                type="number"
                value={String(item?.step ?? index + 1)}
                onChange={(event) =>
                  updateFormValue(['process', String(index), 'step'], Number(event.target.value))
                }
              />
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Title"
                value={item?.title || ''}
                onChange={(event) =>
                  updateFormValue(['process', String(index), 'title'], event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => {
                  const next = [...(Array.isArray(formData.process) ? formData.process : [])];
                  next.splice(index, 1);
                  updateFormValue(['process'], next);
                }}
                className="px-3 py-2 rounded-md border border-red-200 text-red-600 text-xs"
              >
                Remove
              </button>
            </div>
            <textarea
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Description"
              value={item?.desc || ''}
              onChange={(event) =>
                updateFormValue(['process', String(index), 'desc'], event.target.value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const next = [...(Array.isArray(formData.process) ? formData.process : [])];
            next.push({ step: next.length + 1, title: '', desc: '' });
            updateFormValue(['process'], next);
          }}
          className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
        >
          Add Step
        </button>
      </div>

      <div className="rounded-md border border-gray-200 p-3 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase">FAQ</div>
        {(Array.isArray(formData.faq) ? formData.faq : []).map((item: any, index: number) => (
          <div key={`faq-${index}`} className="rounded border border-gray-200 p-2 space-y-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Question"
              value={item?.q || ''}
              onChange={(event) =>
                updateFormValue(['faq', String(index), 'q'], event.target.value)
              }
            />
            <textarea
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Answer"
              value={item?.a || ''}
              onChange={(event) =>
                updateFormValue(['faq', String(index), 'a'], event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => {
                const next = [...(Array.isArray(formData.faq) ? formData.faq : [])];
                next.splice(index, 1);
                updateFormValue(['faq'], next);
              }}
              className="px-3 py-1.5 rounded-md border border-red-200 text-red-600 text-xs"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const next = [...(Array.isArray(formData.faq) ? formData.faq : [])];
            next.push({ q: '', a: '' });
            updateFormValue(['faq'], next);
          }}
          className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
        >
          Add FAQ
        </button>
      </div>

      <div className="rounded-md border border-gray-200 p-3 space-y-3">
        <div className="text-xs font-semibold text-gray-500 uppercase">Call To Action</div>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Headline"
          value={formData.cta?.headline || ''}
          onChange={(event) => updateFormValue(['cta', 'headline'], event.target.value)}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs text-gray-500">Primary CTA</div>
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Text"
              value={formData.cta?.primaryCta?.text || ''}
              onChange={(event) =>
                updateFormValue(['cta', 'primaryCta', 'text'], event.target.value)
              }
            />
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Href"
              value={formData.cta?.primaryCta?.href || ''}
              onChange={(event) =>
                updateFormValue(['cta', 'primaryCta', 'href'], event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-gray-500">Secondary CTA</div>
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Text"
              value={formData.cta?.secondaryCta?.text || ''}
              onChange={(event) =>
                updateFormValue(['cta', 'secondaryCta', 'text'], event.target.value)
              }
            />
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Href"
              value={formData.cta?.secondaryCta?.href || ''}
              onChange={(event) =>
                updateFormValue(['cta', 'secondaryCta', 'href'], event.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 p-3 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase">Rules Notes</div>
        {(Array.isArray(formData.rulesNotes) ? formData.rulesNotes : []).map((note: string, index: number) => (
          <div key={`rule-note-${index}`} className="grid gap-2 md:grid-cols-[1fr_auto]">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={note || ''}
              onChange={(event) =>
                updateFormValue(['rulesNotes', String(index)], event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => {
                const next = [...(Array.isArray(formData.rulesNotes) ? formData.rulesNotes : [])];
                next.splice(index, 1);
                updateFormValue(['rulesNotes'], next);
              }}
              className="px-3 py-2 rounded-md border border-red-200 text-red-600 text-xs"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const next = [...(Array.isArray(formData.rulesNotes) ? formData.rulesNotes : [])];
            next.push('');
            updateFormValue(['rulesNotes'], next);
          }}
          className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
        >
          Add Note
        </button>
      </div>
    </div>
  );
}
