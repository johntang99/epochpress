'use client';

interface GenericPageFormPanelsProps {
  formData: Record<string, any> | null;
  isProductPageFile: boolean;
  variantSections: Array<[string, string[]]>;
  toTitleCase: (value: string) => string;
  getPathValue: (path: string[]) => any;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
}

export function GenericPageFormPanels({
  formData,
  isProductPageFile,
  variantSections,
  toTitleCase,
  getPathValue,
  updateFormValue,
  openImagePicker,
}: GenericPageFormPanelsProps) {
  return (
    <>
      {formData && variantSections.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Section Variants
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {variantSections.map(([sectionKey, options]) => (
              <div key={`variant-${sectionKey}`}>
                <label className="block text-xs text-gray-500">
                  {toTitleCase(sectionKey)} Variant
                </label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white"
                  value={String(getPathValue([sectionKey, 'variant']) || '')}
                  onChange={(event) =>
                    updateFormValue([sectionKey, 'variant'], event.target.value)
                  }
                >
                  <option value="">Default</option>
                  {options.map((option) => (
                    <option key={`${sectionKey}-${option}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {formData?.hero && !isProductPageFile && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Hero
          </div>
          {'title' in formData.hero && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500">Title</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.hero.title || ''}
                onChange={(event) => updateFormValue(['hero', 'title'], event.target.value)}
              />
            </div>
          )}
          {'subtitle' in formData.hero && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500">Subtitle</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.hero.subtitle || ''}
                onChange={(event) => updateFormValue(['hero', 'subtitle'], event.target.value)}
              />
            </div>
          )}
          {'tagline' in formData.hero && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500">Tagline</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.hero.tagline || ''}
                onChange={(event) => updateFormValue(['hero', 'tagline'], event.target.value)}
              />
            </div>
          )}
          {'description' in formData.hero && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500">Description</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.hero.description || ''}
                onChange={(event) =>
                  updateFormValue(['hero', 'description'], event.target.value)
                }
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500">Background Image</label>
            <div className="mt-1 flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.hero.backgroundImage || ''}
                onChange={(event) =>
                  updateFormValue(['hero', 'backgroundImage'], event.target.value)
                }
                placeholder="/uploads/..."
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
          <div className="mt-3">
            <label className="block text-xs text-gray-500">Hero Image</label>
            <div className="mt-1 flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.hero.image || ''}
                onChange={(event) => updateFormValue(['hero', 'image'], event.target.value)}
                placeholder="/uploads/..."
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
      )}

      {formData?.cta && !isProductPageFile && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            CTA
          </div>
          {'title' in formData.cta && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500">Title</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.cta.title || ''}
                onChange={(event) => updateFormValue(['cta', 'title'], event.target.value)}
              />
            </div>
          )}
          {'description' in formData.cta && (
            <div className="mb-3">
              <label className="block text-xs text-gray-500">Description</label>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={formData.cta.description || ''}
                onChange={(event) =>
                  updateFormValue(['cta', 'description'], event.target.value)
                }
              />
            </div>
          )}
          {formData.cta?.primaryCta && (
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Primary CTA</div>
              <input
                className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Text"
                value={formData.cta.primaryCta.text || ''}
                onChange={(event) =>
                  updateFormValue(['cta', 'primaryCta', 'text'], event.target.value)
                }
              />
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Link"
                value={formData.cta.primaryCta.link || ''}
                onChange={(event) =>
                  updateFormValue(['cta', 'primaryCta', 'link'], event.target.value)
                }
              />
            </div>
          )}
          {formData.cta?.secondaryCta && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Secondary CTA</div>
              <input
                className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Text"
                value={formData.cta.secondaryCta.text || ''}
                onChange={(event) =>
                  updateFormValue(['cta', 'secondaryCta', 'text'], event.target.value)
                }
              />
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Link"
                value={formData.cta.secondaryCta.link || ''}
                onChange={(event) =>
                  updateFormValue(['cta', 'secondaryCta', 'link'], event.target.value)
                }
              />
            </div>
          )}
        </div>
      )}

      {formData?.featuredPost && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Featured Post
          </div>
          <input
            className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Title"
            value={formData.featuredPost.title || ''}
            onChange={(event) => updateFormValue(['featuredPost', 'title'], event.target.value)}
          />
          <textarea
            className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Excerpt"
            value={formData.featuredPost.excerpt || ''}
            onChange={(event) =>
              updateFormValue(['featuredPost', 'excerpt'], event.target.value)
            }
          />
          <div className="flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Image"
              value={formData.featuredPost.image || ''}
              onChange={(event) =>
                updateFormValue(['featuredPost', 'image'], event.target.value)
              }
            />
            <button
              type="button"
              onClick={() => openImagePicker(['featuredPost', 'image'])}
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
        </div>
      )}

      {Array.isArray(formData?.posts) && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Blog Posts
          </div>
          <div className="space-y-4">
            {formData.posts.map((post: any, index: number) => (
              <div key={post.slug || index} className="border rounded-md p-3">
                <div className="text-xs text-gray-500 mb-2">
                  {post.title || `Post ${index + 1}`}
                </div>
                <input
                  className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Title"
                  value={post.title || ''}
                  onChange={(event) =>
                    updateFormValue(['posts', String(index), 'title'], event.target.value)
                  }
                />
                <textarea
                  className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Excerpt"
                  value={post.excerpt || ''}
                  onChange={(event) =>
                    updateFormValue(['posts', String(index), 'excerpt'], event.target.value)
                  }
                />
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Image"
                    value={post.image || ''}
                    onChange={(event) =>
                      updateFormValue(['posts', String(index), 'image'], event.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => openImagePicker(['posts', String(index), 'image'])}
                    className="px-3 rounded-md border border-gray-200 text-xs"
                  >
                    Choose
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
