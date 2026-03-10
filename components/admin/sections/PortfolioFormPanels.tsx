'use client';

interface PortfolioFormPanelsProps {
  isPortfolioCategorySelected: boolean;
  isPortfolioItemSelected: boolean;
  selectedPortfolioCategory: string;
  selectedPortfolioItem: any;
  activePortfolioCategoryIndex: number;
  activePortfolioItemIndex: number;
  isPortfolioPageFile: boolean;
  isPortfolioModuleMode: boolean;
  portfolioCategoryOptions: string[];
  formData: Record<string, any> | null;
  removePortfolioCategory: (index: number) => void;
  setActivePortfolioCategoryIndex: (index: number) => void;
  updateFormValue: (path: string[], value: any) => void;
  removePortfolioItem: (index: number) => void;
  setActivePortfolioItemIndex: (index: number) => void;
  openImagePicker: (path: string[]) => void;
  addPortfolioCategory: () => void;
  addPortfolioItem: () => void;
}

export function PortfolioFormPanels(props: PortfolioFormPanelsProps) {
  return (
    <>
      {props.isPortfolioCategorySelected && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-500 uppercase">
              Edit Portfolio Category
            </div>
            <button
              type="button"
              onClick={() => {
                props.removePortfolioCategory(props.activePortfolioCategoryIndex);
                props.setActivePortfolioCategoryIndex(-1);
              }}
              className="px-2 py-1 rounded-md border border-red-200 text-red-600 text-xs"
            >
              Delete
            </button>
          </div>
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={props.selectedPortfolioCategory}
            onChange={(event) =>
              props.updateFormValue(
                ['categories', String(props.activePortfolioCategoryIndex)],
                event.target.value
              )
            }
          />
        </div>
      )}

      {props.isPortfolioItemSelected && props.selectedPortfolioItem && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-500 uppercase">
              Edit Portfolio Item
            </div>
            <button
              type="button"
              onClick={() => {
                props.removePortfolioItem(props.activePortfolioItemIndex);
                props.setActivePortfolioItemIndex(-1);
              }}
              className="px-2 py-1 rounded-md border border-red-200 text-red-600 text-xs"
            >
              Delete
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Title"
              value={props.selectedPortfolioItem.title || ''}
              onChange={(event) =>
                props.updateFormValue(
                  ['items', String(props.activePortfolioItemIndex), 'title'],
                  event.target.value
                )
              }
            />
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Client"
              value={props.selectedPortfolioItem.client || ''}
              onChange={(event) =>
                props.updateFormValue(
                  ['items', String(props.activePortfolioItemIndex), 'client'],
                  event.target.value
                )
              }
            />
          </div>
          <select
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={props.selectedPortfolioItem.category || ''}
            onChange={(event) =>
              props.updateFormValue(
                ['items', String(props.activePortfolioItemIndex), 'category'],
                event.target.value
              )
            }
          >
            <option value="">Select category</option>
            {props.portfolioCategoryOptions.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <textarea
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Description"
            value={props.selectedPortfolioItem.desc || ''}
            onChange={(event) =>
              props.updateFormValue(
                ['items', String(props.activePortfolioItemIndex), 'desc'],
                event.target.value
              )
            }
          />
          <div className="flex gap-2">
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Image"
              value={props.selectedPortfolioItem.image || ''}
              onChange={(event) =>
                props.updateFormValue(
                  ['items', String(props.activePortfolioItemIndex), 'image'],
                  event.target.value
                )
              }
            />
            <button
              type="button"
              onClick={() =>
                props.openImagePicker(['items', String(props.activePortfolioItemIndex), 'image'])
              }
              className="px-3 rounded-md border border-gray-200 text-xs"
            >
              Choose
            </button>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              checked={Boolean(props.selectedPortfolioItem.featured)}
              onChange={(event) =>
                props.updateFormValue(
                  ['items', String(props.activePortfolioItemIndex), 'featured'],
                  event.target.checked
                )
              }
            />
            Featured
          </label>
        </div>
      )}

      {props.isPortfolioPageFile &&
        (!props.isPortfolioModuleMode ||
          (!props.isPortfolioCategorySelected && !props.isPortfolioItemSelected)) && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            {!props.formData?.hero && (
              <div className="rounded-md border border-dashed border-gray-300 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-600">
                    Portfolio hero is not set in this JSON yet.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      props.updateFormValue(['hero'], {
                        title: '',
                        subtitle: '',
                        backgroundImage: '',
                        image: '',
                      })
                    }
                    className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                  >
                    Add Hero
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-500 uppercase">
                Portfolio Categories
              </div>
              <button
                type="button"
                onClick={props.addPortfolioCategory}
                className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                Add Category
              </button>
            </div>
            <div className="space-y-2">
              {Array.isArray(props.formData?.categories) &&
                props.formData.categories.map((category: any, index: number) => (
                  <div key={`${category}-${index}`} className="flex gap-2">
                    <input
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      value={typeof category === 'string' ? category : ''}
                      onChange={(event) =>
                        props.updateFormValue(
                          ['categories', String(index)],
                          event.target.value
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => props.removePortfolioCategory(index)}
                      className="px-3 rounded-md border border-gray-200 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase">
                Portfolio Items
              </div>
              <button
                type="button"
                onClick={props.addPortfolioItem}
                className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                Add Item
              </button>
            </div>
            <div className="space-y-4">
              {Array.isArray(props.formData?.items) &&
                props.formData.items.map((item: any, index: number) => (
                  <div key={item.id || index} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-500">
                        {item.title || `Item ${index + 1}`}
                      </div>
                      <button
                        type="button"
                        onClick={() => props.removePortfolioItem(index)}
                        className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        placeholder="Title"
                        value={item.title || ''}
                        onChange={(event) =>
                          props.updateFormValue(
                            ['items', String(index), 'title'],
                            event.target.value
                          )
                        }
                      />
                      <input
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        placeholder="Client"
                        value={item.client || ''}
                        onChange={(event) =>
                          props.updateFormValue(
                            ['items', String(index), 'client'],
                            event.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs text-gray-500 mb-1">Category</label>
                      <select
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        value={item.category || ''}
                        onChange={(event) =>
                          props.updateFormValue(
                            ['items', String(index), 'category'],
                            event.target.value
                          )
                        }
                      >
                        <option value="">Select category</option>
                        {props.portfolioCategoryOptions.map((category: string) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      placeholder="Description"
                      value={item.desc || ''}
                      onChange={(event) =>
                        props.updateFormValue(
                          ['items', String(index), 'desc'],
                          event.target.value
                        )
                      }
                    />
                    <div className="mt-2 flex gap-2">
                      <input
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        placeholder="Image"
                        value={item.image || ''}
                        onChange={(event) =>
                          props.updateFormValue(
                            ['items', String(index), 'image'],
                            event.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => props.openImagePicker(['items', String(index), 'image'])}
                        className="px-3 rounded-md border border-gray-200 text-xs"
                      >
                        Choose
                      </button>
                    </div>
                    <label className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={Boolean(item.featured)}
                        onChange={(event) =>
                          props.updateFormValue(
                            ['items', String(index), 'featured'],
                            event.target.checked
                          )
                        }
                      />
                      Featured
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}
    </>
  );
}
