'use client';

interface BlogCategoryOption {
  slug: string;
  name: string;
}

interface BlogCategoryEditorPanelProps {
  selectedBlogCategory: BlogCategoryOption;
  activeBlogCategoryIndex: number;
  removeBlogCategory: (index: number) => void;
  setActiveBlogCategoryIndex: (index: number) => void;
  updateBlogCategory: (index: number, patch: Partial<BlogCategoryOption>) => void;
}

export function BlogCategoryEditorPanel({
  selectedBlogCategory,
  activeBlogCategoryIndex,
  removeBlogCategory,
  setActiveBlogCategoryIndex,
  updateBlogCategory,
}: BlogCategoryEditorPanelProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-500 uppercase">
          Edit Blog Category
        </div>
        <button
          type="button"
          onClick={() => {
            removeBlogCategory(activeBlogCategoryIndex);
            setActiveBlogCategoryIndex(-1);
          }}
          className="px-2 py-1 rounded-md border border-red-200 text-red-600 text-xs"
        >
          Delete
        </button>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Category Name</label>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={selectedBlogCategory.name}
          onChange={(event) =>
            updateBlogCategory(activeBlogCategoryIndex, {
              name: event.target.value,
            })
          }
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Category Slug</label>
        <input
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          value={selectedBlogCategory.slug}
          onChange={(event) =>
            updateBlogCategory(activeBlogCategoryIndex, {
              slug: event.target.value,
            })
          }
        />
      </div>
    </div>
  );
}
