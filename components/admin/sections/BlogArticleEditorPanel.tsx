'use client';

import ReactMarkdown from 'react-markdown';

interface BlogCategoryOption {
  slug: string;
  name: string;
}

interface BlogProductOption {
  slug: string;
  name: string;
}

interface BlogArticleEditorPanelProps {
  formData: Record<string, any>;
  blogCategorySelectOptions: BlogCategoryOption[];
  blogProductOptions: BlogProductOption[];
  selectedRelatedProducts: string[];
  markdownPreview: Record<string, boolean>;
  updateFormValue: (path: string[], value: any) => void;
  openImagePicker: (path: string[]) => void;
  toggleMarkdownPreview: (key: string) => void;
  normalizeMarkdown: (text: string) => string;
}

export function BlogArticleEditorPanel({
  formData,
  blogCategorySelectOptions,
  blogProductOptions,
  selectedRelatedProducts,
  markdownPreview,
  updateFormValue,
  openImagePicker,
  toggleMarkdownPreview,
  normalizeMarkdown,
}: BlogArticleEditorPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
        Blog Article
      </div>
      <input
        className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        placeholder="Title"
        value={formData.title || ''}
        onChange={(event) => updateFormValue(['title'], event.target.value)}
      />
      <textarea
        className="mb-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        placeholder="Excerpt"
        value={formData.excerpt || ''}
        onChange={(event) => updateFormValue(['excerpt'], event.target.value)}
      />
      <div className="flex gap-2 mb-2">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Image"
          value={formData.image || ''}
          onChange={(event) => updateFormValue(['image'], event.target.value)}
        />
        <button
          type="button"
          onClick={() => openImagePicker(['image'])}
          className="px-3 rounded-md border border-gray-200 text-xs"
        >
          Choose
        </button>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Author"
          value={formData.author || ''}
          onChange={(event) => updateFormValue(['author'], event.target.value)}
        />
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          placeholder="Publish Date (YYYY-MM-DD)"
          value={formData.publishDate || ''}
          onChange={(event) => updateFormValue(['publishDate'], event.target.value)}
        />
      </div>
      <select
        className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        value={formData.category || ''}
        onChange={(event) => updateFormValue(['category'], event.target.value)}
      >
        <option value="">Select category</option>
        {blogCategorySelectOptions.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="mt-3 flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={Boolean(formData.featured)}
          onChange={(event) => updateFormValue(['featured'], event.target.checked)}
        />
        <label htmlFor="featured" className="text-sm text-gray-700">
          Featured article
        </label>
      </div>
      <div className="mt-4 rounded-md border border-gray-200 p-3">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Related Products
        </div>
        {blogProductOptions.length === 0 ? (
          <p className="text-xs text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {blogProductOptions.map((product) => {
              const checked = selectedRelatedProducts.includes(product.slug);
              return (
                <label
                  key={product.slug}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? selectedRelatedProducts.filter(
                            (slug: string) => slug !== product.slug
                          )
                        : [...selectedRelatedProducts, product.slug];
                      updateFormValue(['relatedProducts'], Array.from(new Set(next)));
                    }}
                  />
                  {product.name}
                </label>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Body (Markdown)</span>
          <button
            type="button"
            onClick={() => toggleMarkdownPreview('blog-article-body')}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            {markdownPreview['blog-article-body'] ? 'Edit' : 'Preview'}
          </button>
        </div>
        {markdownPreview['blog-article-body'] ? (
          <div className="prose prose-sm max-w-none rounded-md border border-gray-200 px-3 py-2">
            <ReactMarkdown
              components={{
                ul: (props) => <ul className="list-disc pl-5" {...props} />,
                ol: (props) => (
                  <ol className="list-decimal pl-5" {...props} />
                ),
                li: (props) => <li className="mb-1" {...props} />,
              }}
            >
              {normalizeMarkdown(formData.contentMarkdown || '')}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="w-full min-h-[220px] rounded-md border border-gray-200 px-3 py-2 text-sm"
            placeholder="Write the article body in Markdown"
            value={formData.contentMarkdown || ''}
            onChange={(event) =>
              updateFormValue(['contentMarkdown'], event.target.value)
            }
          />
        )}
      </div>
    </div>
  );
}
