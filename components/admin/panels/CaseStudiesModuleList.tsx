interface CaseStudiesModuleListProps {
  isCaseStudyCategorySelected: boolean;
  isCaseStudyItemSelected: boolean;
  activeCaseStudyCategoryIndex: number;
  activeCaseStudyItemIndex: number;
  setActiveCaseStudyCategoryIndex: (index: number) => void;
  setActiveCaseStudyItemIndex: (index: number) => void;
  addCaseStudyCategory: () => void;
  removeCaseStudyCategory: (index: number) => void;
  caseStudyCategories: any[];
  addCaseStudyEntry: () => void;
  removeCaseStudyEntry: (index: number) => void;
  caseStudiesItems: any[];
}

export function CaseStudiesModuleList(props: CaseStudiesModuleListProps) {
  return (
    <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
      <button
        type="button"
        onClick={() => {
          props.setActiveCaseStudyCategoryIndex(-1);
          props.setActiveCaseStudyItemIndex(-1);
        }}
        className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs ${
          !props.isCaseStudyCategorySelected && !props.isCaseStudyItemSelected
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
            onClick={props.addCaseStudyCategory}
            className="px-1.5 py-0.5 rounded-md border border-gray-200 text-xs"
          >
            Add
          </button>
        </div>
        <button
          type="button"
          onClick={() => props.removeCaseStudyCategory(props.activeCaseStudyCategoryIndex)}
          disabled={props.activeCaseStudyCategoryIndex < 0}
          className="w-full mb-1 px-1.5 py-0.5 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete Selected Category
        </button>
        <div className="space-y-0.5">
          {props.caseStudyCategories.map((category: any, index: number) => (
            <button
              type="button"
              onClick={() => {
                props.setActiveCaseStudyCategoryIndex(index);
                props.setActiveCaseStudyItemIndex(-1);
              }}
              key={`${category.id}-${index}`}
              className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs ${
                props.isCaseStudyCategorySelected && props.activeCaseStudyCategoryIndex === index
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                  : 'border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[11px] font-semibold uppercase text-gray-500">Case Studies</div>
          <button
            type="button"
            onClick={props.addCaseStudyEntry}
            className="px-1.5 py-0.5 rounded-md border border-gray-200 text-xs"
          >
            Add
          </button>
        </div>
        <button
          type="button"
          onClick={() => props.removeCaseStudyEntry(props.activeCaseStudyItemIndex)}
          disabled={props.activeCaseStudyItemIndex < 0}
          className="w-full mb-1 px-1.5 py-0.5 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete Selected Case Study
        </button>
        <div className="space-y-0.5 max-h-52 overflow-auto pr-1">
          {props.caseStudiesItems.map((item: any, index: number) => (
            <button
              type="button"
              onClick={() => {
                props.setActiveCaseStudyItemIndex(index);
                props.setActiveCaseStudyCategoryIndex(-1);
              }}
              key={item.id || index}
              className={`w-full text-left rounded-md border px-1.5 py-0.5 text-xs ${
                props.isCaseStudyItemSelected && props.activeCaseStudyItemIndex === index
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                  : 'border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{item.title || item.condition || `Case ${index + 1}`}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
