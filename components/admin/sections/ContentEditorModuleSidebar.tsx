import { BlogModuleList } from '@/components/admin/panels/BlogModuleList';
import { PortfolioModuleList } from '@/components/admin/panels/PortfolioModuleList';
import { CaseStudiesModuleList } from '@/components/admin/panels/CaseStudiesModuleList';

interface ContentFileItem {
  id: string;
  label: string;
  path: string;
  scope: 'locale' | 'site';
  publishDate?: string;
}

interface ContentEditorModuleSidebarProps {
  filesTitle: string;
  loading: boolean;
  files: ContentFileItem[];
  activeFile: ContentFileItem | null;
  fileFilter: 'all' | 'blog' | 'siteSettings' | 'portfolio' | 'caseStudies';
  locale: string;
  setActiveFile: (file: ContentFileItem) => void;

  isPortfolioPageFile: boolean;
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

  isCaseStudiesPageFile: boolean;
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

  isBlogPageFile: boolean;
  isBlogCategorySelected: boolean;
  activeBlogCategoryIndex: number;
  setActiveBlogCategoryIndex: (index: number) => void;
  addBlogCategory: () => void;
  removeBlogCategory: (index: number) => void;
  blogPageCategories: string[];
  blogPageFile: ContentFileItem | null;
  blogArticleFiles: ContentFileItem[];
  activeBlogArticlePath: string | null;
  addBlogArticle: () => void;
  deleteSelectedBlogArticle: () => void;
  canDeleteSelectedBlogArticle: boolean;
}

export function ContentEditorModuleSidebar(props: ContentEditorModuleSidebarProps) {
  const showDefaultFileList =
    props.fileFilter !== 'blog' &&
    props.fileFilter !== 'portfolio' &&
    props.fileFilter !== 'caseStudies';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <div className="text-xs font-semibold text-gray-500 uppercase mb-3">{props.filesTitle}</div>
      {showDefaultFileList && props.loading && props.files.length === 0 ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : showDefaultFileList ? (
        <div className="space-y-2">
          {props.files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => props.setActiveFile(file)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                props.activeFile?.id === file.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="font-medium">{file.label}</div>
              <div className="text-xs opacity-70">{file.path}</div>
              {props.fileFilter === 'blog' && file.publishDate && (
                <div className="text-[11px] text-gray-500 mt-1">
                  {new Date(file.publishDate).toLocaleDateString(
                    props.locale === 'zh' ? 'zh-CN' : 'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric' }
                  )}
                </div>
              )}
            </button>
          ))}
          {props.files.length === 0 && (
            <div className="text-sm text-gray-500">
              {props.fileFilter === 'blog'
                ? 'No blog posts found for this locale.'
                : props.fileFilter === 'portfolio'
                  ? 'Portfolio page file not found for this locale.'
                  : props.fileFilter === 'caseStudies'
                    ? 'Case studies page file not found for this locale.'
                    : 'No content files found for this locale.'}
            </div>
          )}
        </div>
      ) : null}

      {props.fileFilter === 'portfolio' && props.isPortfolioPageFile && (
        <PortfolioModuleList
          isPortfolioCategorySelected={props.isPortfolioCategorySelected}
          isPortfolioItemSelected={props.isPortfolioItemSelected}
          activePortfolioCategoryIndex={props.activePortfolioCategoryIndex}
          activePortfolioItemIndex={props.activePortfolioItemIndex}
          setActivePortfolioCategoryIndex={props.setActivePortfolioCategoryIndex}
          setActivePortfolioItemIndex={props.setActivePortfolioItemIndex}
          addPortfolioCategory={props.addPortfolioCategory}
          removePortfolioCategory={props.removePortfolioCategory}
          portfolioCategoryOptions={props.portfolioCategoryOptions}
          addPortfolioItem={props.addPortfolioItem}
          removePortfolioItem={props.removePortfolioItem}
          portfolioItems={props.portfolioItems}
        />
      )}

      {props.fileFilter === 'caseStudies' && props.isCaseStudiesPageFile && (
        <CaseStudiesModuleList
          isCaseStudyCategorySelected={props.isCaseStudyCategorySelected}
          isCaseStudyItemSelected={props.isCaseStudyItemSelected}
          activeCaseStudyCategoryIndex={props.activeCaseStudyCategoryIndex}
          activeCaseStudyItemIndex={props.activeCaseStudyItemIndex}
          setActiveCaseStudyCategoryIndex={props.setActiveCaseStudyCategoryIndex}
          setActiveCaseStudyItemIndex={props.setActiveCaseStudyItemIndex}
          addCaseStudyCategory={props.addCaseStudyCategory}
          removeCaseStudyCategory={props.removeCaseStudyCategory}
          caseStudyCategories={props.caseStudyCategories}
          addCaseStudyEntry={props.addCaseStudyEntry}
          removeCaseStudyEntry={props.removeCaseStudyEntry}
          caseStudiesItems={props.caseStudiesItems}
        />
      )}

      {props.fileFilter === 'blog' && (
        <BlogModuleList
          blogPageFile={props.blogPageFile}
          blogArticleFiles={props.blogArticleFiles}
          activeBlogArticlePath={props.activeBlogArticlePath}
          setActiveFile={props.setActiveFile}
          addBlogArticle={props.addBlogArticle}
          deleteSelectedBlogArticle={props.deleteSelectedBlogArticle}
          canDeleteSelectedBlogArticle={props.canDeleteSelectedBlogArticle}
          isBlogCategorySelected={props.isBlogCategorySelected}
          activeBlogCategoryIndex={props.activeBlogCategoryIndex}
          setActiveBlogCategoryIndex={props.setActiveBlogCategoryIndex}
          addBlogCategory={props.addBlogCategory}
          removeBlogCategory={props.removeBlogCategory}
          blogPageCategories={props.blogPageCategories}
        />
      )}
    </div>
  );
}
