'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CaseStudiesFormPanelsProps {
  isCaseStudyCategorySelected: boolean;
  selectedCaseStudyCategory: any;
  activeCaseStudyCategoryIndex: number;
  removeCaseStudyCategory: (index: number) => void;
  setActiveCaseStudyCategoryIndex: (index: number) => void;
  updateFormValue: (path: string[], value: any) => void;
  isCaseStudyItemSelected: boolean;
  selectedCaseStudyItem: any;
  caseStudiesKey: string | null;
  activeCaseStudyItemIndex: number;
  removeCaseStudyEntry: (index: number) => void;
  setActiveCaseStudyItemIndex: (index: number) => void;
  isCaseStudiesModuleMode: boolean;
  caseStudiesItems: any[];
  addCaseStudyEntry: () => void;
  formData: Record<string, any> | null;
  caseStudyCategories: any[];
  markdownPreview: Record<string, boolean>;
  toggleMarkdownPreview: (key: string) => void;
  normalizeMarkdown: (text: string) => string;
  openImagePicker: (path: string[]) => void;
}

export function CaseStudiesFormPanels(props: CaseStudiesFormPanelsProps) {
  const {
    isCaseStudyCategorySelected,
    selectedCaseStudyCategory,
    activeCaseStudyCategoryIndex,
    removeCaseStudyCategory,
    setActiveCaseStudyCategoryIndex,
    updateFormValue,
    isCaseStudyItemSelected,
    selectedCaseStudyItem,
    caseStudiesKey,
    activeCaseStudyItemIndex,
    removeCaseStudyEntry,
    setActiveCaseStudyItemIndex,
    isCaseStudiesModuleMode,
    caseStudiesItems,
    addCaseStudyEntry,
    formData,
    caseStudyCategories,
    markdownPreview,
    toggleMarkdownPreview,
    normalizeMarkdown,
    openImagePicker,
  } = props;

  return (
    <>
      {isCaseStudyCategorySelected && selectedCaseStudyCategory && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-gray-500 uppercase">
              Edit Case Study Category
            </div>
            <button
              type="button"
              onClick={() => {
                removeCaseStudyCategory(activeCaseStudyCategoryIndex);
                setActiveCaseStudyCategoryIndex(-1);
              }}
              className="px-2 py-1 rounded-md border border-red-200 text-red-600 text-xs"
            >
              Delete
            </button>
          </div>
          <input
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={selectedCaseStudyCategory.name || ''}
            onChange={(event) =>
              updateFormValue(
                ['categories', String(activeCaseStudyCategoryIndex)],
                event.target.value
              )
            }
          />
        </div>
      )}

      {isCaseStudyItemSelected && selectedCaseStudyItem && caseStudiesKey && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-500 uppercase">
              Edit Case Study
            </div>
            <button
              type="button"
              onClick={() => {
                removeCaseStudyEntry(activeCaseStudyItemIndex);
                setActiveCaseStudyItemIndex(-1);
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
              value={selectedCaseStudyItem.title || ''}
              onChange={(event) =>
                updateFormValue(
                  [caseStudiesKey, String(activeCaseStudyItemIndex), 'title'],
                  event.target.value
                )
              }
            />
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Client"
              value={selectedCaseStudyItem.client || ''}
              onChange={(event) =>
                updateFormValue(
                  [caseStudiesKey, String(activeCaseStudyItemIndex), 'client'],
                  event.target.value
                )
              }
            />
          </div>
          <textarea
            className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Challenge"
            value={selectedCaseStudyItem.challenge || ''}
            onChange={(event) =>
              updateFormValue(
                [caseStudiesKey, String(activeCaseStudyItemIndex), 'challenge'],
                event.target.value
              )
            }
          />
          <textarea
            className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Solution"
            value={selectedCaseStudyItem.solution || ''}
            onChange={(event) =>
              updateFormValue(
                [caseStudiesKey, String(activeCaseStudyItemIndex), 'solution'],
                event.target.value
              )
            }
          />
          <textarea
            className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Result"
            value={selectedCaseStudyItem.result || ''}
            onChange={(event) =>
              updateFormValue(
                [caseStudiesKey, String(activeCaseStudyItemIndex), 'result'],
                event.target.value
              )
            }
          />
        </div>
      )}

      {caseStudiesKey &&
        Array.isArray(caseStudiesItems) &&
        (!isCaseStudiesModuleMode ||
          (!isCaseStudyCategorySelected && !isCaseStudyItemSelected)) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 uppercase">
                Case Studies
              </div>
              <button
                type="button"
                onClick={addCaseStudyEntry}
                className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
              >
                Add Case Study
              </button>
            </div>
            <div className="space-y-4">
              {caseStudiesItems.map((item: any, index: number) => (
                <div key={item.id || index} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">
                      {item.title || item.condition || `Case ${index + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCaseStudyEntry(index)}
                      className="px-2 py-1 rounded-md border border-red-200 text-red-600 text-xs"
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
                        updateFormValue(
                          [caseStudiesKey, String(index), 'title'],
                          event.target.value
                        )
                      }
                    />
                    <input
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      placeholder="Client"
                      value={item.client || ''}
                      onChange={(event) =>
                        updateFormValue(
                          [caseStudiesKey, String(index), 'client'],
                          event.target.value
                        )
                      }
                    />
                  </div>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <input
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      placeholder="Author"
                      value={item.author || ''}
                      onChange={(event) =>
                        updateFormValue(
                          [caseStudiesKey, String(index), 'author'],
                          event.target.value
                        )
                      }
                    />
                    <input
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      placeholder="ID"
                      value={item.id || ''}
                      onChange={(event) =>
                        updateFormValue(
                          [caseStudiesKey, String(index), 'id'],
                          event.target.value
                        )
                      }
                    />
                  </div>
                  <input
                    className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Headline"
                    value={item.condition || item.title || ''}
                    onChange={(event) =>
                      updateFormValue(
                        [caseStudiesKey, String(index), 'condition'],
                        event.target.value
                      )
                    }
                  />
                  <div className="mb-2">
                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                    <select
                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      value={item.category || ''}
                      onChange={(event) =>
                        updateFormValue(
                          [caseStudiesKey, String(index), 'category'],
                          event.target.value
                        )
                      }
                    >
                      <option value="">Select category</option>
                      {caseStudyCategories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Summary (Markdown)</span>
                    <button
                      type="button"
                      onClick={() => toggleMarkdownPreview(`caseStudies-${index}-summary`)}
                      className="text-xs text-gray-600 hover:text-gray-900"
                    >
                      {markdownPreview[`caseStudies-${index}-summary`] ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                  {markdownPreview[`caseStudies-${index}-summary`] ? (
                    <div className="prose prose-sm max-w-none rounded-md border border-gray-200 px-3 py-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: (props) => <ul className="list-disc pl-5" {...props} />,
                          ol: (props) => <ol className="list-decimal pl-5" {...props} />,
                          li: (props) => <li className="mb-1" {...props} />,
                        }}
                      >
                        {normalizeMarkdown(item.summary || '')}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                      placeholder="Summary (Markdown supported)"
                      value={item.summary || ''}
                      onChange={(event) =>
                        updateFormValue(
                          [caseStudiesKey, String(index), 'summary'],
                          event.target.value
                        )
                      }
                    />
                  )}
                  <textarea
                    className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Challenge"
                    value={item.challenge || ''}
                    onChange={(event) =>
                      updateFormValue(
                        [caseStudiesKey, String(index), 'challenge'],
                        event.target.value
                      )
                    }
                  />
                  <textarea
                    className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Solution"
                    value={item.solution || ''}
                    onChange={(event) =>
                      updateFormValue(
                        [caseStudiesKey, String(index), 'solution'],
                        event.target.value
                      )
                    }
                  />
                  <textarea
                    className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Result"
                    value={item.result || ''}
                    onChange={(event) =>
                      updateFormValue(
                        [caseStudiesKey, String(index), 'result'],
                        event.target.value
                      )
                    }
                  />
                  <textarea
                    className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Quote"
                    value={item.quote || ''}
                    onChange={(event) =>
                      updateFormValue(
                        [caseStudiesKey, String(index), 'quote'],
                        event.target.value
                      )
                    }
                  />
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        placeholder="Image"
                        value={item.image || ''}
                        onChange={(event) =>
                          updateFormValue(
                            [caseStudiesKey, String(index), 'image'],
                            event.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openImagePicker([caseStudiesKey, String(index), 'image'])
                        }
                        className="px-3 rounded-md border border-gray-200 text-xs"
                      >
                        Choose
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        placeholder="Before image"
                        value={item.beforeImage || ''}
                        onChange={(event) =>
                          updateFormValue(
                            [caseStudiesKey, String(index), 'beforeImage'],
                            event.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openImagePicker([caseStudiesKey, String(index), 'beforeImage'])
                        }
                        className="px-3 rounded-md border border-gray-200 text-xs"
                      >
                        Choose
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                        placeholder="After image"
                        value={item.afterImage || ''}
                        onChange={(event) =>
                          updateFormValue(
                            [caseStudiesKey, String(index), 'afterImage'],
                            event.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openImagePicker([caseStudiesKey, String(index), 'afterImage'])
                        }
                        className="px-3 rounded-md border border-gray-200 text-xs"
                      >
                        Choose
                      </button>
                    </div>
                  </div>
                  <label className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={Boolean(item.featured)}
                      onChange={(event) =>
                        updateFormValue(
                          [caseStudiesKey, String(index), 'featured'],
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
