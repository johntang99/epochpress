interface PortfolioModuleListProps {
  isPortfolioCategorySelected: boolean;
  isPortfolioItemSelected: boolean;
  activePortfolioCategoryIndex: number;
  activePortfolioItemIndex: number;
  setActivePortfolioCategoryIndex: (index: number) => void;
  setActivePortfolioItemIndex: (index: number) => void;
  addPortfolioCategory: () => void;
  removePortfolioCategory: (index: number) => void;
  portfolioCategoryOptions: string[];
  addPortfolioItem: () => void;
  removePortfolioItem: (index: number) => void;
  portfolioItems: any[];
}

export function PortfolioModuleList(props: PortfolioModuleListProps) {
  return (
    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
      <button
        type="button"
        onClick={() => {
          props.setActivePortfolioCategoryIndex(-1);
          props.setActivePortfolioItemIndex(-1);
        }}
        className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs ${
          !props.isPortfolioCategorySelected && !props.isPortfolioItemSelected
            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
            : 'border-gray-100 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Page Settings
      </button>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[11px] font-semibold uppercase text-gray-500">Categories</div>
          <button
            type="button"
            onClick={props.addPortfolioCategory}
            className="px-1.5 py-0.5 rounded-md border border-gray-200 text-xs"
          >
            Add
          </button>
        </div>
        <button
          type="button"
          onClick={() => props.removePortfolioCategory(props.activePortfolioCategoryIndex)}
          disabled={props.activePortfolioCategoryIndex < 0}
          className="w-full mb-1 px-1.5 py-0.5 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete Selected Category
        </button>
        <div className="space-y-0.5">
          {props.portfolioCategoryOptions.map((category: string, index: number) => (
            <button
              type="button"
              onClick={() => {
                props.setActivePortfolioCategoryIndex(index);
                props.setActivePortfolioItemIndex(-1);
              }}
              key={`${category}-${index}`}
              className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs ${
                props.isPortfolioCategorySelected && props.activePortfolioCategoryIndex === index
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                  : 'border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{category}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[11px] font-semibold uppercase text-gray-500">Portfolio Items</div>
          <button
            type="button"
            onClick={props.addPortfolioItem}
            className="px-1.5 py-0.5 rounded-md border border-gray-200 text-xs"
          >
            Add
          </button>
        </div>
        <button
          type="button"
          onClick={() => props.removePortfolioItem(props.activePortfolioItemIndex)}
          disabled={props.activePortfolioItemIndex < 0}
          className="w-full mb-1 px-1.5 py-0.5 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete Selected Item
        </button>
        <div className="space-y-0.5 max-h-52 overflow-auto pr-1">
          {props.portfolioItems.map((item: any, index: number) => (
            <button
              type="button"
              onClick={() => {
                props.setActivePortfolioItemIndex(index);
                props.setActivePortfolioCategoryIndex(-1);
              }}
              key={item.id || index}
              className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs ${
                props.isPortfolioItemSelected && props.activePortfolioItemIndex === index
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                  : 'border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{item.title || `Item ${index + 1}`}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
