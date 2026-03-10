interface BlogModuleListProps {
  blogPageFile: { id: string; path: string; label: string; scope: 'locale' | 'site'; publishDate?: string } | null;
  blogArticleFiles: Array<{ id: string; path: string; label: string; scope: 'locale' | 'site'; publishDate?: string }>;
  activeBlogArticlePath: string | null;
  setActiveFile: (file: { id: string; path: string; label: string; scope: 'locale' | 'site'; publishDate?: string }) => void;
  addBlogArticle: () => void;
  deleteSelectedBlogArticle: () => void;
  canDeleteSelectedBlogArticle: boolean;
  isBlogCategorySelected: boolean;
  activeBlogCategoryIndex: number;
  setActiveBlogCategoryIndex: (index: number) => void;
  addBlogCategory: () => void;
  removeBlogCategory: (index: number) => void;
  blogPageCategories: string[];
}

export function BlogModuleList(props: BlogModuleListProps) {
  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        type="button"
        onClick={() => {
          if (props.blogPageFile) props.setActiveFile(props.blogPageFile);
          props.setActiveBlogCategoryIndex(-1);
        }}
        className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs mb-1.5 ${
          !props.isBlogCategorySelected
            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
            : 'border-gray-100 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Page Settings
      </button>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[11px] font-semibold uppercase text-gray-500">Categories</div>
        <button
          type="button"
          onClick={props.addBlogCategory}
          className="px-1.5 py-0.5 rounded-md border border-gray-200 text-xs"
        >
          Add
        </button>
      </div>
      <button
        type="button"
        onClick={() => props.removeBlogCategory(props.activeBlogCategoryIndex)}
        disabled={props.activeBlogCategoryIndex < 0}
        className="w-full mb-1 px-1.5 py-0.5 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Category
      </button>
      <div className="space-y-0.5">
        {props.blogPageCategories.map((category: string, index: number) => (
          <button
            type="button"
            onClick={() => props.setActiveBlogCategoryIndex(index)}
            key={`${category}-${index}`}
            className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs ${
              props.isBlogCategorySelected && props.activeBlogCategoryIndex === index
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                : 'border-gray-100 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="truncate">{category}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-2 mb-1.5">
        <div className="text-[11px] font-semibold uppercase text-gray-500">Articles</div>
        <button
          type="button"
          onClick={props.addBlogArticle}
          className="px-1.5 py-0.5 rounded-md border border-gray-200 text-xs"
        >
          Add
        </button>
      </div>
      <button
        type="button"
        onClick={props.deleteSelectedBlogArticle}
        disabled={!props.canDeleteSelectedBlogArticle}
        className="w-full mb-1 px-1.5 py-0.5 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete Selected Article
      </button>
      <div className="space-y-0.5">
        {props.blogArticleFiles.map((file) => (
          <button
            type="button"
            key={file.id}
            onClick={() => props.setActiveFile(file)}
            className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs ${
              props.activeBlogArticlePath === file.path
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                : 'border-gray-100 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="truncate">{file.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
