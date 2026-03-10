'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, SiteConfig } from '@/lib/types';
import { Button } from '@/components/ui';
import { CONTENT_TEMPLATES } from '@/lib/admin/templates';
import { ImagePickerModal } from '@/components/admin/ImagePickerModal';
import { ContentEditorModuleSidebar } from '@/components/admin/sections/ContentEditorModuleSidebar';
import { BlogCategoryEditorPanel } from '@/components/admin/sections/BlogCategoryEditorPanel';
import { BlogArticleEditorPanel } from '@/components/admin/sections/BlogArticleEditorPanel';
import { PortfolioFormPanels } from '@/components/admin/sections/PortfolioFormPanels';
import { CaseStudiesFormPanels } from '@/components/admin/sections/CaseStudiesFormPanels';
import { GenericPageFormPanels } from '@/components/admin/sections/GenericPageFormPanels';
import { ProductPageFormPanel } from '@/components/admin/sections/ProductPageFormPanel';
import { SeoFormPanel } from '@/components/admin/sections/SeoFormPanel';
import { HeaderFormPanel } from '@/components/admin/sections/HeaderFormPanel';
import { ThemeFormPanel } from '@/components/admin/sections/ThemeFormPanel';
import { ProfileIntroImagesPanel } from '@/components/admin/sections/ProfileIntroImagesPanel';
import { LandingPageFormPanel } from '@/components/admin/sections/LandingPageFormPanel';

interface ContentFileItem {
  id: string;
  label: string;
  path: string;
  scope: 'locale' | 'site';
  publishDate?: string;
}

interface ContentEditorProps {
  sites: SiteConfig[];
  selectedSiteId: string;
  selectedLocale: string;
  initialFilePath?: string;
  fileFilter?: 'all' | 'blog' | 'siteSettings' | 'portfolio' | 'caseStudies';
  titleOverride?: string;
  basePath?: string;
}
interface BlogCategoryOption {
  slug: string;
  name: string;
}

const SECTION_VARIANT_OPTIONS: Record<string, string[]> = {
  hero: [
    'centered',
    'split-photo-right',
    'split-photo-left',
    'photo-background',
    'overlap',
    'video-background',
    'gallery-background',
  ],
  testimonials: ['carousel', 'grid', 'masonry', 'slider-vertical', 'featured-single'],
  howItWorks: ['horizontal', 'vertical', 'cards', 'vertical-image-right'],
  overview: ['centered', 'left'],
  blog: ['cards-grid', 'featured-side', 'list-detailed', 'carousel'],
  gallery: ['grid-masonry', 'grid-uniform', 'carousel', 'lightbox-grid'],
  cta: ['centered', 'split', 'banner', 'card-elevated'],
  profile: ['split', 'stacked'],
  credentials: ['list', 'grid'],
  specializations: ['grid-2', 'grid-3', 'list'],
  philosophy: ['cards', 'timeline'],
  journey: ['prose', 'card'],
  affiliations: ['compact', 'detailed'],
  continuingEducation: ['compact', 'detailed'],
  introduction: ['centered', 'left'],
  hours: ['grid', 'list'],
  form: ['single-column', 'two-column', 'multi-step', 'modal', 'inline-minimal'],
  map: ['shown', 'hidden'],
  faq: ['accordion', 'simple', 'card'],
  individualTreatments: ['grid-3', 'grid-2', 'list'],
  packages: ['grid-3', 'grid-2', 'list'],
  insurance: ['split', 'stacked'],
  policies: ['grid', 'list'],
  statistics: ['horizontal-row', 'grid-2x2', 'vertical-cards', 'inline-badges'],
};

const toTitleCase = (value: string) =>
  value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (match) => match.toUpperCase());

const slugifyCategoryName = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const SITE_SETTINGS_PATHS = new Set([
  'navigation.json',
  'header.json',
  'footer.json',
  'seo.json',
  'theme.json',
  'site.json',
]);
const BLOG_PAGE_PATH = 'pages/blog.json';
const PORTFOLIO_PAGE_PATH = 'pages/portfolio.json';
const CASE_STUDIES_PAGE_PATH = 'pages/case-studies.json';

const PRODUCT_PAGE_PATHS = new Set([
  'pages/newspaper-printing.json',
  'pages/magazine-printing.json',
  'pages/book-printing.json',
  'pages/calendar-printing.json',
  'pages/marketing-print.json',
  'pages/menu-printing.json',
  'pages/business-cards.json',
  'pages/large-format.json',
]);

export function ContentEditor({
  sites,
  selectedSiteId,
  selectedLocale,
  initialFilePath,
  fileFilter = 'all',
  titleOverride,
  basePath = '/admin/content',
}: ContentEditorProps) {
  const router = useRouter();
  const [siteId, setSiteId] = useState(selectedSiteId);
  const [locale, setLocale] = useState<Locale>(selectedLocale as Locale);
  const [files, setFiles] = useState<ContentFileItem[]>([]);
  const [activeFile, setActiveFile] = useState<ContentFileItem | null>(null);
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageFieldPath, setImageFieldPath] = useState<string[] | null>(null);
  const [markdownPreview, setMarkdownPreview] = useState<Record<string, boolean>>({});
  const [activePortfolioCategoryIndex, setActivePortfolioCategoryIndex] = useState(-1);
  const [activePortfolioItemIndex, setActivePortfolioItemIndex] = useState(-1);
  const [activeCaseStudyCategoryIndex, setActiveCaseStudyCategoryIndex] = useState(-1);
  const [activeCaseStudyItemIndex, setActiveCaseStudyItemIndex] = useState(-1);
  const [activeBlogCategoryIndex, setActiveBlogCategoryIndex] = useState(-1);
  const [cachedBlogPageCategories, setCachedBlogPageCategories] = useState<BlogCategoryOption[]>(
    []
  );
  const [cachedBlogArticleCategories, setCachedBlogArticleCategories] = useState<string[]>([]);
  const [blogProductOptions, setBlogProductOptions] = useState<
    Array<{ slug: string; name: string }>
  >([]);
  const [seoPopulating, setSeoPopulating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const filesTitle =
    fileFilter === 'blog'
      ? 'Blog Posts'
      : fileFilter === 'siteSettings'
        ? 'Site Settings'
        : fileFilter === 'portfolio'
          ? 'Portfolio'
          : fileFilter === 'caseStudies'
            ? 'Case Studies'
        : 'Files';

  const site = useMemo(
    () => sites.find((item) => item.id === siteId),
    [sites, siteId]
  );

  const buildDefaultBlogBodyMarkdown = (excerpt: string) =>
    `${excerpt}

The article body supports headers, pull quotes, numbered lists, code blocks for spec references, and inline product CTAs. When admin is wired, editors will write directly in the admin CMS editor.

For now, this is a starter layout body. Replace it with your full article content.`;

  const sanitizeLegacyBlogPostFields = (
    input: unknown,
    options?: { seedDefaultBody?: boolean; blogSlug?: string }
  ): { sanitized: Record<string, any>; changed: boolean } => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return { sanitized: {}, changed: false };
    }
    const next: Record<string, any> = { ...(input as Record<string, unknown>) };
    let changed = false;
    if ('relatedServices' in next) {
      delete next.relatedServices;
      changed = true;
    }
    if ('relatedConditions' in next) {
      delete next.relatedConditions;
      changed = true;
    }
    const normalizedRelatedProducts = Array.isArray(next.relatedProducts)
      ? Array.from(
          new Set(
            next.relatedProducts
              .map((item: any) =>
                typeof item === 'string'
                  ? item.trim()
                  : typeof item?.slug === 'string'
                    ? item.slug.trim()
                    : ''
              )
              .filter((slug: string) => Boolean(slug))
          )
        )
      : [];
    if (
      !Array.isArray(next.relatedProducts) ||
      JSON.stringify(next.relatedProducts) !== JSON.stringify(normalizedRelatedProducts)
    ) {
      next.relatedProducts = normalizedRelatedProducts;
      changed = true;
    }
    const currentMarkdown =
      typeof next.contentMarkdown === 'string' ? next.contentMarkdown.trim() : '';
    const legacyBodyCandidates = [
      typeof next.content === 'string' ? next.content.trim() : '',
      typeof next.body === 'string' ? next.body.trim() : '',
      typeof next.markdown === 'string' ? next.markdown.trim() : '',
    ].filter((value): value is string => Boolean(value));
    if (!currentMarkdown && legacyBodyCandidates.length > 0) {
      next.contentMarkdown = legacyBodyCandidates[0];
      changed = true;
    }
    if (!currentMarkdown && legacyBodyCandidates.length === 0 && options?.seedDefaultBody) {
      const excerpt = typeof next.excerpt === 'string' ? next.excerpt.trim() : '';
      if (excerpt) {
        next.contentMarkdown = buildDefaultBlogBodyMarkdown(excerpt);
        changed = true;
      }
    }
    if ('content' in next) {
      delete next.content;
      changed = true;
    }
    if ('body' in next) {
      delete next.body;
      changed = true;
    }
    if ('markdown' in next) {
      delete next.markdown;
      changed = true;
    }
    if (options?.blogSlug) {
      if (typeof next.slug !== 'string' || !next.slug.trim()) {
        next.slug = options.blogSlug;
        changed = true;
      }
      if (typeof next.type !== 'string' || !next.type.trim()) {
        next.type = 'article';
        changed = true;
      }
      if (!next.title && typeof next.hero?.title === 'string' && next.hero.title.trim()) {
        next.title = next.hero.title.trim();
        changed = true;
      }
      if (
        !next.excerpt &&
        typeof next.hero?.subtitle === 'string' &&
        next.hero.subtitle.trim()
      ) {
        next.excerpt = next.hero.subtitle.trim();
        changed = true;
      }
      if ('sectionVariants' in next) {
        delete next.sectionVariants;
        changed = true;
      }
      if ('hero' in next) {
        delete next.hero;
        changed = true;
      }
      if ('cta' in next) {
        delete next.cta;
        changed = true;
      }
    }
    return { sanitized: next, changed };
  };

  useEffect(() => {
    if (!site) return;
    if (!site.supportedLocales.includes(locale)) {
      setLocale(site.defaultLocale);
    }
  }, [site, locale]);

  useEffect(() => {
    if (!siteId || !locale) return;
    const params = new URLSearchParams({ siteId, locale });
    router.replace(`${basePath}?${params.toString()}`);
  }, [router, siteId, locale, basePath]);

  const loadFiles = async (preferredPath?: string) => {
    if (!siteId || !locale) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(
        `/api/admin/content/files?siteId=${siteId}&locale=${locale}`
      );
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || 'Failed to load files');
      }
      const payload = await response.json();
      let nextFiles: ContentFileItem[] = payload.files || [];
      if (fileFilter === 'blog') {
        const blogFiles = nextFiles
          .filter((file) => file.path.startsWith('blog/'))
          .sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));
        const blogPageFile = nextFiles.find((file) => file.path === BLOG_PAGE_PATH);
        nextFiles = blogPageFile ? [blogPageFile, ...blogFiles] : blogFiles;
      } else if (fileFilter === 'siteSettings') {
        nextFiles = nextFiles.filter((file) => SITE_SETTINGS_PATHS.has(file.path));
        nextFiles = [...nextFiles].sort((a, b) => a.label.localeCompare(b.label));
      } else if (fileFilter === 'portfolio') {
        nextFiles = nextFiles.filter((file) => file.path === PORTFOLIO_PAGE_PATH);
      } else if (fileFilter === 'caseStudies') {
        nextFiles = nextFiles.filter((file) => file.path === CASE_STUDIES_PAGE_PATH);
      } else {
        nextFiles = nextFiles.filter(
          (file) => !file.path.startsWith('blog/') && !SITE_SETTINGS_PATHS.has(file.path)
        );
        nextFiles = [...nextFiles].sort((a, b) => a.label.localeCompare(b.label));
      }
      setFiles(nextFiles);
      if (preferredPath) {
        const matched = nextFiles.find((file) => file.path === preferredPath);
        setActiveFile(matched || nextFiles[0] || null);
      } else {
        setActiveFile(nextFiles[0] || null);
      }
    } catch (error: any) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(initialFilePath);
  }, [siteId, locale, initialFilePath, fileFilter]);

  useEffect(() => {
    if (!activeFile) return;
    setLoading(true);
    setStatus(null);
    fetch(
      `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
        activeFile.path
      )}`
    )
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.message || 'Failed to load content');
        }
        return response.json();
      })
      .then(async (payload) => {
        const nextContent = payload.content || '';
        try {
          const parsed = JSON.parse(nextContent);
          const isBlogArticle = activeFile.path.startsWith('blog/');
          const blogSlug = isBlogArticle
            ? activeFile.path.replace(/^blog\//, '').replace(/\.json$/, '')
            : undefined;
          const { sanitized, changed } = sanitizeLegacyBlogPostFields(parsed, {
            seedDefaultBody: isBlogArticle,
            blogSlug,
          });
          const normalizedContent =
            isBlogArticle && changed
              ? JSON.stringify(sanitized, null, 2)
              : nextContent;

          setContent(normalizedContent);
          setFormData(sanitized);

          if (isBlogArticle && changed) {
            await fetch('/api/admin/content/file', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                siteId,
                locale,
                path: activeFile.path,
                content: normalizedContent,
              }),
            });
            setStatus('Auto-migrated legacy blog fields and normalized article body content.');
          }
        } catch (error) {
          setContent(nextContent);
          setFormData(null);
        }
      })
      .catch((error) => setStatus(error.message))
      .finally(() => setLoading(false));
  }, [activeFile, siteId, locale]);

  useEffect(() => {
    setActivePortfolioCategoryIndex(-1);
    setActivePortfolioItemIndex(-1);
    setActiveCaseStudyCategoryIndex(-1);
    setActiveCaseStudyItemIndex(-1);
    setActiveBlogCategoryIndex(-1);
  }, [activeFile?.path, fileFilter]);

  useEffect(() => {
    if (activeFile?.path === 'theme.json') {
      setActiveTab('form');
    }
  }, [activeFile?.path]);

  const handleSave = async () => {
    setStatus(null);
    if (!activeFile) return;
    let saveContent = content;
    let removedLegacyFields = false;
    try {
      const parsed = JSON.parse(content);
      if (activeFile.path.startsWith('blog/')) {
        const blogSlug = activeFile.path.replace(/^blog\//, '').replace(/\.json$/, '');
        const { sanitized, changed } = sanitizeLegacyBlogPostFields(parsed, { blogSlug });
        if (changed) {
          saveContent = JSON.stringify(sanitized, null, 2);
          setFormData(sanitized);
          setContent(saveContent);
          removedLegacyFields = true;
        }
      }
    } catch (error) {
      setStatus('Invalid JSON. Please fix before saving.');
      return;
    }

    const response = await fetch('/api/admin/content/file', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        path: activeFile.path,
        content: saveContent,
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Save failed');
      return;
    }

    const payload = await response.json();
    setStatus(
      removedLegacyFields
        ? 'Saved. Normalized legacy blog fields.'
        : payload.message || 'Saved'
    );
  };

  const handleImport = async (
    mode: 'missing' | 'overwrite' = 'missing',
    options?: { dryRun?: boolean; force?: boolean }
  ) => {
    setStatus(null);
    setLoading(true);
    setImporting(true);
    try {
      const response = await fetch('/api/admin/content/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          locale,
          mode,
          dryRun: Boolean(options?.dryRun),
          force: Boolean(options?.force),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Import failed');
      }
      if (options?.dryRun) {
        return payload;
      }
      const skipped = payload.skipped || 0;
      const imported = payload.imported || 0;
      setStatus(payload.message || (skipped
        ? `Imported ${imported} items. Skipped ${skipped} existing DB entries.`
        : `Imported ${imported} items from JSON.`));
      await loadFiles(activeFile?.path);
      return payload;
    } catch (error: any) {
      setStatus(error?.message || 'Import failed');
      return null;
    } finally {
      setLoading(false);
      setImporting(false);
    }
  };

  const handleOverwriteImport = async () => {
    const dryRun = await handleImport('overwrite', { dryRun: true });
    if (!dryRun) return;

    const conflicts = Array.isArray(dryRun.conflicts) ? dryRun.conflicts : [];
    if (conflicts.length > 0) {
      const conflictPreview = conflicts
        .slice(0, 5)
        .map((item: any) => `${item.locale}:${item.path}`)
        .join('\n');
      const forceConfirmed = window.confirm(
        `Safety check found ${conflicts.length} newer DB entries.\n\n` +
          `${conflictPreview}${conflicts.length > 5 ? '\n...' : ''}\n\n` +
          'Abort by default. Continue with FORCE overwrite anyway?'
      );
      if (!forceConfirmed) {
        setStatus('Overwrite cancelled due to newer DB entries.');
        return;
      }
      await handleImport('overwrite', { force: true });
      return;
    }

    const confirmed = window.confirm(
      `Dry-run summary:\n` +
        `Create: ${dryRun.toCreate || 0}\n` +
        `Update: ${dryRun.toUpdate || 0}\n` +
        `Unchanged: ${dryRun.unchanged || 0}\n\n` +
        `${Array.isArray(dryRun.toUpdatePaths) && dryRun.toUpdatePaths.length > 0
          ? `Update paths:\n${dryRun.toUpdatePaths.slice(0, 8).join('\n')}${dryRun.toUpdatePaths.length > 8 ? '\n...' : ''}\n\n`
          : ''}` +
        `${Array.isArray(dryRun.toCreatePaths) && dryRun.toCreatePaths.length > 0
          ? `Create paths:\n${dryRun.toCreatePaths.slice(0, 8).join('\n')}${dryRun.toCreatePaths.length > 8 ? '\n...' : ''}\n\n`
          : ''}` +
        'Proceed with overwrite import?'
    );
    if (!confirmed) return;
    await handleImport('overwrite');
  };

  const handleCheckUpdateFromDb = async () => {
    const dryRun = await handleImport('overwrite', { dryRun: true });
    if (!dryRun) return;

    const updatePaths = Array.isArray(dryRun.toUpdatePaths) ? dryRun.toUpdatePaths : [];
    const createPaths = Array.isArray(dryRun.toCreatePaths) ? dryRun.toCreatePaths : [];
    const conflicts = Array.isArray(dryRun.conflicts) ? dryRun.conflicts : [];
    const conflictPaths = conflicts.map((item: any) => `${item.locale}:${item.path}`);

    const allDifferentPaths = Array.from(new Set([...updatePaths, ...createPaths, ...conflictPaths]));
    const preview = allDifferentPaths.slice(0, 20).join('\n');

    window.alert(
      `Check Update From DB\n\n` +
        `Different files: ${allDifferentPaths.length}\n` +
        `Create: ${createPaths.length}\n` +
        `Update: ${updatePaths.length}\n` +
        `DB newer conflicts: ${conflicts.length}\n\n` +
        `${allDifferentPaths.length > 0 ? `Paths:\n${preview}${allDifferentPaths.length > 20 ? '\n...' : ''}` : 'No differences found.'}`
    );

    setStatus(
      allDifferentPaths.length > 0
        ? `Found ${allDifferentPaths.length} files different from DB (create ${createPaths.length}, update ${updatePaths.length}, conflicts ${conflicts.length}).`
        : 'No differences between local JSON and DB.'
    );
  };

  const handleExport = async () => {
    setStatus(null);
    setLoading(true);
    setExporting(true);
    try {
      const response = await fetch('/api/admin/content/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, locale }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Export failed');
      }
      const details = [];
      if (typeof payload.backfilled === 'number') {
        details.push(`backfilled ${payload.backfilled}`);
      }
      if (typeof payload.backfillErrors === 'number' && payload.backfillErrors > 0) {
        details.push(`backfill errors ${payload.backfillErrors}`);
      }
      setStatus(
        `${payload.message || 'Export completed'}${details.length ? ` (${details.join(', ')})` : ''}`
      );
    } catch (error: any) {
      setStatus(error?.message || 'Export failed');
    } finally {
      setLoading(false);
      setExporting(false);
    }
  };

  const handleCreate = async () => {
    const isBlog = fileFilter === 'blog';
    const slug = window.prompt(
      isBlog ? 'New blog slug (example: my-post)' : 'New page slug (example: faq)'
    );
    if (!slug) return;
    const templateId = isBlog
      ? 'blog-post'
      : window.prompt(
          `Template: ${CONTENT_TEMPLATES.map((t) => t.id).join(', ')}`,
          CONTENT_TEMPLATES[0]?.id || 'basic'
        ) || CONTENT_TEMPLATES[0]?.id;
    const response = await fetch('/api/admin/content/file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        action: 'create',
        slug,
        templateId,
        targetDir: isBlog ? 'blog' : 'pages',
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Create failed');
      return;
    }

    const payload = await response.json();
    await loadFiles(payload.path);
  };

  const handleDuplicate = async () => {
    if (!activeFile) return;
    const isBlog = activeFile.path.startsWith('blog/');
    const slug = window.prompt(
      isBlog
        ? 'Duplicate blog slug (example: my-post-copy)'
        : 'Duplicate page slug (example: faq-copy)'
    );
    if (!slug) return;
    const response = await fetch('/api/admin/content/file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId,
        locale,
        action: 'duplicate',
        path: activeFile.path,
        slug,
        targetDir: isBlog ? 'blog' : 'pages',
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Duplicate failed');
      return;
    }

    const payload = await response.json();
    await loadFiles(payload.path);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      setContent(formatted);
      setFormData(parsed);
      setStatus('Formatted');
    } catch (error) {
      setStatus('Invalid JSON. Unable to format.');
    }
  };

  const handleDelete = async () => {
    if (!activeFile) return;
    const confirmed = window.confirm(`Delete ${activeFile.path}? This cannot be undone.`);
    if (!confirmed) return;
    const response = await fetch(
      `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
        activeFile.path
      )}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.message || 'Delete failed');
      return;
    }
    await loadFiles();
  };

  const getPreviewPath = () => {
    if (!activeFile) return `/${locale}`;
    if (activeFile.path.startsWith('landing/')) {
      const lang = activeFile.path.replace('landing/', '').replace('.json', '');
      return `/lp/${lang}`;
    }
    if (activeFile.path.startsWith('pages/')) {
      const slug = activeFile.path.replace('pages/', '').replace('.json', '');
      if (slug === 'home') return `/${locale}`;
      return `/${locale}/${slug}`;
    }
    return `/${locale}`;
  };

  const updateFormValue = (path: string[], value: any) => {
    if (!formData) return;
    const next = { ...formData };
    let cursor: any = next;
    path.forEach((key, index) => {
      if (index === path.length - 1) {
        cursor[key] = value;
      } else {
        cursor[key] = cursor[key] ?? {};
        cursor = cursor[key];
      }
    });
    setFormData(next);
    setContent(JSON.stringify(next, null, 2));
  };

  const openImagePicker = (path: string[]) => {
    setImageFieldPath(path);
    setShowImagePicker(true);
  };

  const handleImageSelect = (url: string) => {
    if (!imageFieldPath) return;
    updateFormValue(imageFieldPath, url);
  };

  const toggleMarkdownPreview = (key: string) => {
    setMarkdownPreview((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const normalizeMarkdown = (text: string) =>
    text
      .replace(/\r\n/g, '\n')
      .replace(/([^\n])\n-\s+/g, '$1\n\n- ')
      .replace(/([^\n])\n\*\s+/g, '$1\n\n- ');

  const getPathValue = (path: string[]) =>
    path.reduce<any>((acc, key) => acc?.[key], formData);

  const renderColorField = (label: string, path: string[]) => {
    const value = String(getPathValue(path) || '');
    return (
      <div className="grid gap-2 md:grid-cols-[1fr_auto] items-center">
        <div>
          <label className="block text-xs text-gray-500">{label}</label>
          <input
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={value}
            onChange={(event) => updateFormValue(path, event.target.value)}
            placeholder="#000000"
          />
        </div>
        <input
          type="color"
          className="mt-6 h-10 w-10 rounded-md border border-gray-200"
          value={value || '#000000'}
          onChange={(event) => updateFormValue(path, event.target.value)}
          aria-label={`${label} color`}
        />
      </div>
    );
  };

  const isSeoFile = activeFile?.path === 'seo.json';
  const isHeaderFile = activeFile?.path === 'header.json';
  const isThemeFile = activeFile?.path === 'theme.json';
  const isLandingFile = Boolean(activeFile?.path.startsWith('landing/'));
  const isHomePageFile = activeFile?.path === 'pages/home.json';
  const isPortfolioPageFile = activeFile?.path === 'pages/portfolio.json';
  const isProductPageFile = activeFile ? PRODUCT_PAGE_PATHS.has(activeFile.path) : false;
  const productHeroKey = isProductPageFile
    ? formData?.pageHero
      ? 'pageHero'
      : formData?.heroSection
        ? 'heroSection'
        : formData?.hero
          ? 'hero'
          : 'pageHero'
    : 'hero';
  const productHero = isProductPageFile ? formData?.[productHeroKey] : null;
  const allowCreateOrDuplicate =
    fileFilter !== 'siteSettings' &&
    fileFilter !== 'portfolio' &&
    fileFilter !== 'caseStudies';
  const variantSections = formData
    ? Object.entries(SECTION_VARIANT_OPTIONS).filter(
        ([key]) =>
          formData[key] &&
          typeof formData[key] === 'object' &&
          !Array.isArray(formData[key])
      )
    : [];
  const galleryCategories = Array.isArray(formData?.categories)
    ? formData.categories
        .map((category: any) => ({
          id: typeof category?.id === 'string' ? category.id : '',
          name: typeof category?.name === 'string' ? category.name : '',
        }))
        .filter((category: any) => category.id && category.name)
    : [];
  const caseStudyCategories = Array.isArray(formData?.categories)
    ? formData.categories
        .map((category: any) => {
          if (typeof category === 'string') {
            return { id: category, name: category };
          }
          return {
            id: typeof category?.id === 'string' ? category.id : '',
            name: typeof category?.name === 'string' ? category.name : '',
          };
        })
        .filter((category: any) => category.id && category.name)
    : [];
  const caseStudiesKey = Array.isArray(formData?.stories)
    ? 'stories'
    : Array.isArray(formData?.caseStudies)
      ? 'caseStudies'
      : null;
  const caseStudiesItems = caseStudiesKey
    ? (formData?.[caseStudiesKey] as Array<Record<string, any>>)
    : [];
  const portfolioItems = Array.isArray(formData?.items) ? formData.items : [];
  const isBlogArticleFile = activeFile?.path.startsWith('blog/');
  const isBlogPageFile = activeFile?.path === BLOG_PAGE_PATH;
  const portfolioCategoryOptions = Array.isArray(formData?.categories)
    ? formData.categories
        .map((category: any) =>
          typeof category === 'string'
            ? category
            : typeof category?.name === 'string'
            ? category.name
            : ''
        )
        .filter((category: string) => Boolean(category))
    : [];
  const normalizeBlogCategories = (categories: unknown): BlogCategoryOption[] => {
    if (!Array.isArray(categories)) return [];
    return categories
      .map((category: any) => {
        if (typeof category === 'string') {
          const maybeSlug = category.trim();
          if (!maybeSlug) return null;
          return {
            slug: maybeSlug,
            name: toTitleCase(maybeSlug),
          };
        }
        const name = typeof category?.name === 'string' ? category.name.trim() : '';
        const slugSource =
          typeof category?.slug === 'string'
            ? category.slug
            : typeof category?.id === 'string'
              ? category.id
              : '';
        const slug = slugifyCategoryName(String(slugSource || name || '').trim());
        if (!slug) return null;
        return {
          slug,
          name: name || toTitleCase(slug),
        };
      })
      .filter((category): category is BlogCategoryOption => Boolean(category));
  };
  const blogPageCategories = normalizeBlogCategories(formData?.categories);
  const blogPageFileRef = files.find((file) => file.path === BLOG_PAGE_PATH) || null;
  const blogArticleFiles = files.filter((file) => file.path.startsWith('blog/'));
  const blogArticlePathsKey = blogArticleFiles.map((file) => file.path).join('|');
  const activeBlogArticlePath = activeFile?.path?.startsWith('blog/') ? activeFile.path : null;
  const isPortfolioModuleMode = fileFilter === 'portfolio' && isPortfolioPageFile;
  const isCaseStudiesModuleMode =
    fileFilter === 'caseStudies' && activeFile?.path === CASE_STUDIES_PAGE_PATH;
  const isBlogModuleMode = fileFilter === 'blog' && isBlogPageFile;
  const isPortfolioCategorySelected =
    isPortfolioModuleMode &&
    activePortfolioCategoryIndex >= 0 &&
    activePortfolioCategoryIndex < portfolioCategoryOptions.length;
  const isPortfolioItemSelected =
    isPortfolioModuleMode &&
    activePortfolioItemIndex >= 0 &&
    activePortfolioItemIndex < portfolioItems.length;
  const selectedPortfolioCategory = isPortfolioCategorySelected
    ? portfolioCategoryOptions[activePortfolioCategoryIndex]
    : '';
  const selectedPortfolioItem = isPortfolioItemSelected
    ? portfolioItems[activePortfolioItemIndex]
    : null;
  const isCaseStudyCategorySelected =
    isCaseStudiesModuleMode &&
    activeCaseStudyCategoryIndex >= 0 &&
    activeCaseStudyCategoryIndex < caseStudyCategories.length;
  const isCaseStudyItemSelected =
    isCaseStudiesModuleMode &&
    activeCaseStudyItemIndex >= 0 &&
    activeCaseStudyItemIndex < caseStudiesItems.length;
  const selectedCaseStudyCategory = isCaseStudyCategorySelected
    ? caseStudyCategories[activeCaseStudyCategoryIndex]
    : null;
  const selectedCaseStudyItem = isCaseStudyItemSelected
    ? caseStudiesItems[activeCaseStudyItemIndex]
    : null;
  const blogSidebarCategories = Array.from(
    new Map(
      [
        ...blogPageCategories,
        ...cachedBlogPageCategories,
        ...cachedBlogArticleCategories
          .map((slug) => slug.trim())
          .filter((slug) => Boolean(slug))
          .map((slug) => ({ slug, name: toTitleCase(slug) })),
      ].map((category) => [category.slug, category] as const)
    ).values()
  );
  const isBlogCategorySelected =
    isBlogModuleMode &&
    activeBlogCategoryIndex >= 0 &&
    activeBlogCategoryIndex < blogSidebarCategories.length;
  const selectedBlogCategory = isBlogCategorySelected
    ? blogSidebarCategories[activeBlogCategoryIndex]
    : null;
  const blogCategorySelectOptions = Array.from(
    new Map(
      [
        ...blogSidebarCategories,
        typeof formData?.category === 'string' && formData.category.trim()
          ? {
              slug: formData.category.trim(),
              name: toTitleCase(formData.category.trim()),
            }
          : null,
      ]
        .filter((category): category is BlogCategoryOption => Boolean(category))
        .map((category) => [category.slug, category] as const)
    ).values()
  );
  const selectedRelatedProducts = Array.isArray(formData?.relatedProducts)
    ? formData.relatedProducts
        .map((item: any) => (typeof item === 'string' ? item : ''))
        .filter((item: string) => Boolean(item))
    : [];

  useEffect(() => {
    if (!isBlogPageFile) return;
    setCachedBlogPageCategories(blogPageCategories);
  }, [isBlogPageFile, blogPageCategories]);

  useEffect(() => {
    if (fileFilter !== 'blog' || !siteId || !locale || isBlogPageFile || !blogPageFileRef) return;
    let cancelled = false;

    const loadBlogCategoriesFromPage = async () => {
      try {
        const response = await fetch(
          `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
            BLOG_PAGE_PATH
          )}`
        );
        if (!response.ok) return;
        const payload = await response.json();
        const parsed = payload?.content ? JSON.parse(payload.content) : {};
        if (!cancelled) {
          setCachedBlogPageCategories(normalizeBlogCategories(parsed?.categories));
        }
      } catch {
        if (!cancelled) {
          setCachedBlogPageCategories([]);
        }
      }
    };

    void loadBlogCategoriesFromPage();
    return () => {
      cancelled = true;
    };
  }, [fileFilter, siteId, locale, isBlogPageFile, blogPageFileRef]);

  useEffect(() => {
    if (fileFilter !== 'blog' || !siteId || !locale) return;
    if (blogArticleFiles.length === 0) {
      setCachedBlogArticleCategories([]);
      return;
    }
    let cancelled = false;

    const loadBlogCategoriesFromArticles = async () => {
      try {
        const payloads = await Promise.all(
          blogArticleFiles.map(async (file) => {
            const response = await fetch(
              `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
                file.path
              )}`
            );
            if (!response.ok) return null;
            return response.json();
          })
        );

        const categories = payloads
          .map((payload) => {
            if (!payload?.content) return '';
            try {
              const parsed = JSON.parse(payload.content);
              return typeof parsed?.category === 'string' ? parsed.category.trim() : '';
            } catch {
              return '';
            }
          })
          .filter((category): category is string => Boolean(category));

        if (!cancelled) {
          setCachedBlogArticleCategories(Array.from(new Set(categories)));
        }
      } catch {
        if (!cancelled) {
          setCachedBlogArticleCategories([]);
        }
      }
    };

    void loadBlogCategoriesFromArticles();
    return () => {
      cancelled = true;
    };
  }, [fileFilter, siteId, locale, blogArticlePathsKey]);

  useEffect(() => {
    if (fileFilter !== 'blog' || !siteId || !locale) return;
    let cancelled = false;

    const loadProductsForBlog = async () => {
      try {
        const response = await fetch(
          `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
            'pages/products.json'
          )}`
        );
        if (!response.ok) {
          if (!cancelled) setBlogProductOptions([]);
          return;
        }
        const payload = await response.json();
        const parsed = payload?.content ? JSON.parse(payload.content) : {};
        const options = Array.isArray(parsed?.categories)
          ? parsed.categories
              .map((category: any) => ({
                slug: typeof category?.slug === 'string' ? category.slug.trim() : '',
                name:
                  typeof category?.name === 'string' && category.name.trim()
                    ? category.name.trim()
                    : '',
              }))
              .filter((category: { slug: string; name: string }) => category.slug && category.name)
          : [];
        if (!cancelled) {
          setBlogProductOptions(options);
        }
      } catch {
        if (!cancelled) {
          setBlogProductOptions([]);
        }
      }
    };

    void loadProductsForBlog();
    return () => {
      cancelled = true;
    };
  }, [fileFilter, siteId, locale]);
  const homePhotoFields = useMemo(() => {
    if (!isHomePageFile || !formData) return [] as Array<{ path: string[]; label: string }>;

    const fields: Array<{ path: string[]; label: string }> = [];
    const IMAGE_KEYS = new Set(['image', 'backgroundImage', 'beforeImage', 'afterImage', 'src']);
    const EXCLUDED_ROOT_KEYS = new Set(['menu', 'topBar', 'topbar']);
    const DISPLAY_KEYS = [
      'title',
      'name',
      'label',
      'tagline',
      'text',
      'id',
      'slug',
    ];

    const getNodeDisplayLabel = (node: any, fallbackIndex?: number) => {
      if (!node || typeof node !== 'object') {
        return typeof fallbackIndex === 'number' ? `Item ${fallbackIndex + 1}` : '';
      }

      for (const key of DISPLAY_KEYS) {
        const value = node?.[key];
        if (typeof value === 'string' && value.trim()) {
          return key === 'id' || key === 'slug' ? toTitleCase(value) : value.trim();
        }
      }

      if (typeof fallbackIndex === 'number') {
        return `Item ${fallbackIndex + 1}`;
      }
      return '';
    };

    const collectFields = (node: any, path: string[] = [], contextHint = '') => {
      if (Array.isArray(node)) {
        node.forEach((item, index) => {
          const itemHint = getNodeDisplayLabel(item, index);
          collectFields(item, [...path, String(index)], itemHint);
        });
        return;
      }

      if (!node || typeof node !== 'object') {
        return;
      }

      Object.entries(node).forEach(([key, value]) => {
        if (path.length === 0 && EXCLUDED_ROOT_KEYS.has(key)) {
          return;
        }

        const nextPath = [...path, key];
        const isImageField = IMAGE_KEYS.has(key);

        if (isImageField && typeof value === 'string') {
          const sectionLabel = nextPath
            .filter((part) => !/^\d+$/.test(part))
            .map((part) => toTitleCase(part))
            .join(' > ');
          const localHint = getNodeDisplayLabel(node);
          const hint = localHint || contextHint;
          const label = hint ? `${sectionLabel} (${hint})` : sectionLabel;
          fields.push({ path: nextPath, label });
          return;
        }

        if (typeof value === 'object' && value !== null) {
          collectFields(value, nextPath, contextHint);
        }
      });
    };

    collectFields(formData);
    return fields;
  }, [isHomePageFile, formData]);

  const addSeoPage = () => {
    if (!formData) return;
    const slug = window.prompt('Page slug (example: services)');
    if (!slug) return;
    updateFormValue(['pages', slug], {
      title: '',
      description: '',
    });
  };

  const removeSeoPage = (slug: string) => {
    if (!formData) return;
    const next = { ...formData };
    if (next.pages && typeof next.pages === 'object') {
      const pages = { ...next.pages };
      delete pages[slug];
      next.pages = pages;
      setFormData(next);
      setContent(JSON.stringify(next, null, 2));
    }
  };

  const addGalleryImage = () => {
    if (!formData) return;
    const images = Array.isArray(formData.images) ? [...formData.images] : [];
    const maxOrder = images.reduce((max: number, image: any) => {
      const order = typeof image?.order === 'number' ? image.order : 0;
      return Math.max(max, order);
    }, 0);
    images.push({
      id: `gallery-${Date.now()}`,
      src: '',
      alt: '',
      title: '',
      category: '',
      description: '',
      featured: false,
      order: maxOrder + 1,
    });
    updateFormValue(['images'], images);
  };

  const removeGalleryImage = (index: number) => {
    if (!formData || !Array.isArray(formData.images)) return;
    const images = [...formData.images];
    images.splice(index, 1);
    updateFormValue(['images'], images);
  };

  const addPortfolioItem = () => {
    if (!formData) return;
    const items = Array.isArray(formData.items) ? [...formData.items] : [];
    const categories = Array.isArray(formData.categories) ? formData.categories : [];
    const firstCategory =
      categories.find((category: any) => typeof category === 'string' && category !== 'All') ||
      categories.find((category: any) => typeof category === 'string') ||
      '';
    items.push({
      id: `portfolio-${Date.now()}`,
      title: '',
      client: '',
      category: firstCategory,
      desc: '',
      image: '',
      featured: false,
    });
    updateFormValue(['items'], items);
    setActivePortfolioCategoryIndex(-1);
    setActivePortfolioItemIndex(items.length - 1);
  };

  const removePortfolioItem = (index: number) => {
    if (!formData || !Array.isArray(formData.items)) return;
    const items = [...formData.items];
    items.splice(index, 1);
    updateFormValue(['items'], items);
    if (activePortfolioItemIndex === index) setActivePortfolioItemIndex(-1);
    if (activePortfolioItemIndex > index) setActivePortfolioItemIndex(activePortfolioItemIndex - 1);
  };

  const addPortfolioCategory = () => {
    if (!formData) return;
    const value = window.prompt('Category name');
    if (!value || !value.trim()) return;
    const categories = Array.isArray(formData.categories) ? [...formData.categories] : [];
    categories.push(value.trim());
    updateFormValue(['categories'], categories);
    setActivePortfolioItemIndex(-1);
    setActivePortfolioCategoryIndex(categories.length - 1);
  };

  const removePortfolioCategory = (index: number) => {
    if (!formData || !Array.isArray(formData.categories)) return;
    const categories = [...formData.categories];
    categories.splice(index, 1);
    updateFormValue(['categories'], categories);
    if (activePortfolioCategoryIndex === index) setActivePortfolioCategoryIndex(-1);
    if (activePortfolioCategoryIndex > index) {
      setActivePortfolioCategoryIndex(activePortfolioCategoryIndex - 1);
    }
  };

  const addCaseStudyCategory = () => {
    if (!formData) return;
    const value = window.prompt('Category name');
    if (!value || !value.trim()) return;
    const categories = Array.isArray(formData.categories) ? [...formData.categories] : [];
    categories.push(value.trim());
    updateFormValue(['categories'], categories);
    setActiveCaseStudyItemIndex(-1);
    setActiveCaseStudyCategoryIndex(categories.length - 1);
  };

  const removeCaseStudyCategory = (index: number) => {
    if (!formData || !Array.isArray(formData.categories)) return;
    const categories = [...formData.categories];
    categories.splice(index, 1);
    updateFormValue(['categories'], categories);
    if (activeCaseStudyCategoryIndex === index) setActiveCaseStudyCategoryIndex(-1);
    if (activeCaseStudyCategoryIndex > index) {
      setActiveCaseStudyCategoryIndex(activeCaseStudyCategoryIndex - 1);
    }
  };

  const addCaseStudyEntry = () => {
    if (!formData || !caseStudiesKey) return;
    const next = [...caseStudiesItems];
    const nextIdBase = (next.length ? next.length : 0) + Date.now().toString().slice(-4);
    next.push({
      id: `cs-${nextIdBase}`,
      title: '',
      client: '',
      author: '',
      category: caseStudyCategories[0]?.id || '',
      challenge: '',
      solution: '',
      result: '',
      quote: '',
      featured: false,
      image: '',
      beforeImage: '',
      afterImage: '',
      condition: '',
      summary: '',
    });
    updateFormValue([caseStudiesKey], next);
    setActiveCaseStudyCategoryIndex(-1);
    setActiveCaseStudyItemIndex(next.length - 1);
  };

  const removeCaseStudyEntry = (index: number) => {
    if (!caseStudiesKey) return;
    const next = [...caseStudiesItems];
    next.splice(index, 1);
    updateFormValue([caseStudiesKey], next);
    if (activeCaseStudyItemIndex === index) setActiveCaseStudyItemIndex(-1);
    if (activeCaseStudyItemIndex > index) setActiveCaseStudyItemIndex(activeCaseStudyItemIndex - 1);
  };

  const saveBlogCategoriesToPage = async (categories: BlogCategoryOption[]) => {
    if (!siteId || !locale) return false;
    const normalized = Array.from(
      new Map(
        categories
          .map((category) => {
            const slug = slugifyCategoryName(category.slug || category.name || '');
            const name = String(category.name || '').trim() || toTitleCase(slug);
            if (!slug) return null;
            return { slug, name };
          })
          .filter((category): category is BlogCategoryOption => Boolean(category))
          .map((category) => [category.slug, category] as const)
      ).values()
    );

    try {
      let nextPageData: Record<string, any> = {};

      if (isBlogPageFile && formData) {
        nextPageData = { ...formData };
      } else {
        const response = await fetch(
          `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
            BLOG_PAGE_PATH
          )}`
        );
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.message || 'Failed to load blog page categories.');
        }
        const payload = await response.json();
        nextPageData = payload?.content ? JSON.parse(payload.content) : {};
      }

      nextPageData.categories = normalized;
      const nextContent = JSON.stringify(nextPageData, null, 2);
      const saveResponse = await fetch('/api/admin/content/file', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          locale,
          path: BLOG_PAGE_PATH,
          content: nextContent,
        }),
      });
      if (!saveResponse.ok) {
        const payload = await saveResponse.json();
        throw new Error(payload.message || 'Failed to save blog page categories.');
      }

      setCachedBlogPageCategories(normalized);
      if (isBlogPageFile) {
        setFormData(nextPageData);
        setContent(nextContent);
      }
      return true;
    } catch (error: any) {
      setStatus(error?.message || 'Failed to update blog categories.');
      return false;
    }
  };

  const addBlogCategory = () => {
    const value = window.prompt('Category name (slug will auto-generate)');
    if (!value || !value.trim()) return;
    const name = value.trim();
    const baseSlug = slugifyCategoryName(name);
    if (!baseSlug) return;
    let slug = baseSlug;
    let suffix = 2;
    const usedSlugs = new Set(blogSidebarCategories.map((category) => category.slug));
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    const categories = [...blogSidebarCategories, { slug, name }];
    void saveBlogCategoriesToPage(categories).then((saved) => {
      if (!saved) return;
      const index = categories.findIndex((category) => category.slug === slug);
      setActiveBlogCategoryIndex(index);
    });
  };

  const removeBlogCategory = (index: number) => {
    const categoryToRemove = blogSidebarCategories[index];
    if (!categoryToRemove) return;
    const categories = blogSidebarCategories.filter(
      (category) => category.slug !== categoryToRemove.slug
    );
    void saveBlogCategoriesToPage(categories).then((saved) => {
      if (!saved) return;
      if (activeBlogCategoryIndex === index) setActiveBlogCategoryIndex(-1);
      if (activeBlogCategoryIndex > index) setActiveBlogCategoryIndex(activeBlogCategoryIndex - 1);
    });
  };

  const updateBlogCategory = (index: number, patch: Partial<BlogCategoryOption>) => {
    const current = blogSidebarCategories[index];
    if (!current) return;
    const nextSlug = slugifyCategoryName(
      typeof patch.slug === 'string' ? patch.slug : current.slug
    );
    const nextName =
      typeof patch.name === 'string' ? patch.name.trim() : current.name;
    if (!nextSlug) return;

    const nextCategories = blogSidebarCategories.map((category, categoryIndex) => {
      if (categoryIndex !== index) return category;
      return {
        slug: nextSlug,
        name: nextName || toTitleCase(nextSlug),
      };
    });

    void saveBlogCategoriesToPage(nextCategories);
  };

  const addBlogArticle = () => {
    void handleCreate();
  };

  const deleteSelectedBlogArticle = () => {
    if (!activeBlogArticlePath) {
      setStatus('Select an article to delete.');
      return;
    }
    void handleDelete();
  };

  const addHeaderMenuItem = () => {
    if (!formData) return;
    const items = Array.isArray(formData.menu?.items) ? [...formData.menu.items] : [];
    items.push({ text: '', url: '' });
    updateFormValue(['menu', 'items'], items);
  };

  const removeHeaderMenuItem = (index: number) => {
    if (!formData || !Array.isArray(formData.menu?.items)) return;
    const items = [...formData.menu.items];
    items.splice(index, 1);
    updateFormValue(['menu', 'items'], items);
  };

  const addHeaderLanguage = () => {
    if (!formData) return;
    const languages = Array.isArray(formData.languages) ? [...formData.languages] : [];
    languages.push({ label: '', locale: '', url: '' });
    updateFormValue(['languages'], languages);
  };

  const removeHeaderLanguage = (index: number) => {
    if (!formData || !Array.isArray(formData.languages)) return;
    const languages = [...formData.languages];
    languages.splice(index, 1);
    updateFormValue(['languages'], languages);
  };

  const populateSeoFromHeroes = async () => {
    if (!formData) return;
    setSeoPopulating(true);
    setStatus(null);
    try {
      const pageFiles = files
        .filter((file) => file.path.startsWith('pages/'))
        .map((file) => ({
          path: file.path,
          slug: file.path.replace('pages/', '').replace('.json', ''),
        }));

      const results = await Promise.all(
        pageFiles.map(async (page) => {
          try {
            const response = await fetch(
              `/api/admin/content/file?siteId=${siteId}&locale=${locale}&path=${encodeURIComponent(
                page.path
              )}`
            );
            if (!response.ok) {
              return null;
            }
            const payload = await response.json();
            const parsed = JSON.parse(payload.content || '{}');
            const hero = parsed?.hero;
            const title = hero?.title;
            const description = hero?.description || hero?.subtitle;
            if (!title && !description) {
              return null;
            }
            return { slug: page.slug, title, description };
          } catch (error) {
            return null;
          }
        })
      );

      const next = { ...formData };
      const pages = typeof next.pages === 'object' && next.pages ? { ...next.pages } : {};

      results.forEach((entry) => {
        if (!entry) return;
        if (entry.slug === 'home') {
          const currentHome = next.home || {};
          next.home = {
            title: currentHome.title || entry.title || '',
            description: currentHome.description || entry.description || '',
          };
          return;
        }

        const current = pages[entry.slug] || {};
        pages[entry.slug] = {
          title: current.title || entry.title || '',
          description: current.description || entry.description || '',
        };
      });

      next.pages = pages;
      setFormData(next);
      setContent(JSON.stringify(next, null, 2));
      setStatus('SEO populated from hero sections.');
    } catch (error: any) {
      setStatus(error?.message || 'Failed to populate SEO.');
    } finally {
      setSeoPopulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {titleOverride || 'Content Editor'}
          </h1>
          <p className="text-sm text-gray-600">
            Select a site and locale to edit JSON content files.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label className="block text-xs font-medium text-gray-500">Site</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={siteId}
              onChange={(event) => {
                setSiteId(event.target.value);
              }}
            >
              {sites.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Locale</label>
            <select
              className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
            >
              {(site?.supportedLocales || ['en']).map((item) => (
                <option key={item} value={item}>
                  {item === 'en' ? 'English' : item === 'zh' ? 'Chinese' : item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2 pt-4 sm:pt-0">
            <button
              type="button"
              onClick={() => handleImport('missing')}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {importing ? 'Importing…' : 'Import JSON'}
            </button>
            <button
              type="button"
              onClick={handleCheckUpdateFromDb}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Check Update From DB
            </button>
            <button
              type="button"
              onClick={handleOverwriteImport}
              disabled={importing || loading}
              className="px-3 py-2 rounded-md border border-amber-200 text-xs text-amber-700 hover:bg-amber-50 disabled:opacity-60"
            >
              {importing ? 'Importing…' : 'Overwrite Import'}
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading}
              className="px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {exporting ? 'Exporting…' : 'Export JSON'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ContentEditorModuleSidebar
          filesTitle={filesTitle}
          loading={loading}
          files={files}
          activeFile={activeFile}
          fileFilter={fileFilter}
          locale={locale}
          setActiveFile={setActiveFile}
          isPortfolioPageFile={Boolean(isPortfolioPageFile)}
          isPortfolioCategorySelected={isPortfolioCategorySelected}
          isPortfolioItemSelected={isPortfolioItemSelected}
          activePortfolioCategoryIndex={activePortfolioCategoryIndex}
          activePortfolioItemIndex={activePortfolioItemIndex}
          setActivePortfolioCategoryIndex={setActivePortfolioCategoryIndex}
          setActivePortfolioItemIndex={setActivePortfolioItemIndex}
          addPortfolioCategory={addPortfolioCategory}
          removePortfolioCategory={removePortfolioCategory}
          portfolioCategoryOptions={portfolioCategoryOptions}
          addPortfolioItem={addPortfolioItem}
          removePortfolioItem={removePortfolioItem}
          portfolioItems={portfolioItems}
          isCaseStudiesPageFile={Boolean(activeFile?.path === CASE_STUDIES_PAGE_PATH)}
          isCaseStudyCategorySelected={isCaseStudyCategorySelected}
          isCaseStudyItemSelected={isCaseStudyItemSelected}
          activeCaseStudyCategoryIndex={activeCaseStudyCategoryIndex}
          activeCaseStudyItemIndex={activeCaseStudyItemIndex}
          setActiveCaseStudyCategoryIndex={setActiveCaseStudyCategoryIndex}
          setActiveCaseStudyItemIndex={setActiveCaseStudyItemIndex}
          addCaseStudyCategory={addCaseStudyCategory}
          removeCaseStudyCategory={removeCaseStudyCategory}
          caseStudyCategories={caseStudyCategories}
          addCaseStudyEntry={addCaseStudyEntry}
          removeCaseStudyEntry={removeCaseStudyEntry}
          caseStudiesItems={caseStudiesItems}
          isBlogPageFile={Boolean(isBlogPageFile)}
          isBlogCategorySelected={isBlogCategorySelected}
          activeBlogCategoryIndex={activeBlogCategoryIndex}
          setActiveBlogCategoryIndex={setActiveBlogCategoryIndex}
          addBlogCategory={addBlogCategory}
          removeBlogCategory={removeBlogCategory}
          blogPageCategories={blogSidebarCategories.map((category) => category.slug)}
          blogPageFile={blogPageFileRef}
          blogArticleFiles={blogArticleFiles}
          activeBlogArticlePath={activeBlogArticlePath}
          addBlogArticle={addBlogArticle}
          deleteSelectedBlogArticle={deleteSelectedBlogArticle}
          canDeleteSelectedBlogArticle={Boolean(activeBlogArticlePath)}
        />

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {activeFile?.label || 'Select a file'}
              </div>
              <div className="text-xs text-gray-500">{activeFile?.path}</div>
            </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.open(getPreviewPath(), '_blank')}
            className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          {allowCreateOrDuplicate && (
            <button
              type="button"
              onClick={handleCreate}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
            >
              {fileFilter === 'blog' ? 'New Post' : 'New Page'}
            </button>
          )}
          {allowCreateOrDuplicate && (
            <button
              type="button"
              onClick={handleDuplicate}
              disabled={!activeFile}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Duplicate
            </button>
          )}
          <button
            type="button"
            onClick={handleFormat}
            disabled={!activeFile}
            className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Format
          </button>
          {activeFile &&
            (activeFile.path.startsWith('pages/') ||
              activeFile.path.startsWith('blog/')) && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded-lg border border-red-200 text-xs text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            )}
          <Button onClick={handleSave} disabled={!activeFile}>
            Save
          </Button>
        </div>
          </div>

          {status && (
            <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {status}
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-md text-xs ${
                activeTab === 'form'
                  ? 'bg-[var(--primary)] text-white'
                  : 'border border-gray-200 text-gray-700'
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-md text-xs ${
                activeTab === 'json'
                  ? 'bg-[var(--primary)] text-white'
                  : 'border border-gray-200 text-gray-700'
              }`}
            >
              JSON
            </button>
          </div>

          {activeTab === 'form' ? (
            <div className="space-y-6 text-sm">
              {!formData && (
                <div className="text-sm text-gray-500">
                  Invalid JSON. Switch to JSON tab to fix.
                </div>
              )}

              {isBlogCategorySelected && selectedBlogCategory && (
                <BlogCategoryEditorPanel
                  selectedBlogCategory={selectedBlogCategory}
                  activeBlogCategoryIndex={activeBlogCategoryIndex}
                  removeBlogCategory={removeBlogCategory}
                  setActiveBlogCategoryIndex={setActiveBlogCategoryIndex}
                  updateBlogCategory={updateBlogCategory}
                />
              )}

              {!isBlogCategorySelected && (
              <>
              <SeoFormPanel
                isSeoFile={isSeoFile}
                formData={formData}
                seoPopulating={seoPopulating}
                populateSeoFromHeroes={populateSeoFromHeroes}
                addSeoPage={addSeoPage}
                removeSeoPage={removeSeoPage}
                updateFormValue={updateFormValue}
                openImagePicker={openImagePicker}
              />

              <HeaderFormPanel
                isHeaderFile={isHeaderFile}
                formData={formData}
                updateFormValue={updateFormValue}
                openImagePicker={openImagePicker}
                addHeaderMenuItem={addHeaderMenuItem}
                removeHeaderMenuItem={removeHeaderMenuItem}
                addHeaderLanguage={addHeaderLanguage}
                removeHeaderLanguage={removeHeaderLanguage}
              />

              <ThemeFormPanel
                isThemeFile={isThemeFile}
                formData={formData}
                getPathValue={getPathValue}
                updateFormValue={updateFormValue}
                renderColorField={renderColorField}
              />

              {isHomePageFile && homePhotoFields.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Home Section Photos
                  </div>
                  <div className="space-y-3">
                    {homePhotoFields.map((field) => (
                      <div
                        key={field.path.join('.')}
                        className="grid gap-2 md:grid-cols-[220px_1fr_auto_auto] items-center"
                      >
                        <label className="text-xs text-gray-600">{field.label}</label>
                        <input
                          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                          value={String(getPathValue(field.path) || '')}
                          onChange={(event) =>
                            updateFormValue(field.path, event.target.value)
                          }
                          placeholder="/uploads/..."
                        />
                        <button
                          type="button"
                          onClick={() => openImagePicker(field.path)}
                          className="px-3 py-2 rounded-md border border-gray-200 text-xs"
                        >
                          Choose
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFormValue(field.path, '')}
                          className="px-3 py-2 rounded-md border border-gray-200 text-xs"
                        >
                          Clear
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ProductPageFormPanel
                isProductPageFile={isProductPageFile}
                formData={formData}
                productHero={productHero}
                productHeroKey={productHeroKey}
                heroVariantOptions={SECTION_VARIANT_OPTIONS.hero}
                updateFormValue={updateFormValue}
                openImagePicker={openImagePicker}
              />

              <ProfileIntroImagesPanel
                formData={formData}
                galleryCategories={galleryCategories}
                updateFormValue={updateFormValue}
                openImagePicker={openImagePicker}
                addGalleryImage={addGalleryImage}
                removeGalleryImage={removeGalleryImage}
              />

              <LandingPageFormPanel
                isLandingFile={isLandingFile}
                formData={formData}
                updateFormValue={updateFormValue}
                openImagePicker={openImagePicker}
              />

              {!isLandingFile && (
                <GenericPageFormPanels
                  formData={formData}
                  isProductPageFile={isProductPageFile}
                  variantSections={variantSections}
                  toTitleCase={toTitleCase}
                  getPathValue={getPathValue}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                />
              )}

              <PortfolioFormPanels
                isPortfolioCategorySelected={isPortfolioCategorySelected}
                isPortfolioItemSelected={isPortfolioItemSelected}
                selectedPortfolioCategory={selectedPortfolioCategory}
                selectedPortfolioItem={selectedPortfolioItem}
                activePortfolioCategoryIndex={activePortfolioCategoryIndex}
                activePortfolioItemIndex={activePortfolioItemIndex}
                isPortfolioPageFile={Boolean(isPortfolioPageFile)}
                isPortfolioModuleMode={isPortfolioModuleMode}
                portfolioCategoryOptions={portfolioCategoryOptions}
                formData={formData}
                removePortfolioCategory={removePortfolioCategory}
                setActivePortfolioCategoryIndex={setActivePortfolioCategoryIndex}
                updateFormValue={updateFormValue}
                removePortfolioItem={removePortfolioItem}
                setActivePortfolioItemIndex={setActivePortfolioItemIndex}
                openImagePicker={openImagePicker}
                addPortfolioCategory={addPortfolioCategory}
                addPortfolioItem={addPortfolioItem}
              />

              <CaseStudiesFormPanels
                isCaseStudyCategorySelected={isCaseStudyCategorySelected}
                selectedCaseStudyCategory={selectedCaseStudyCategory}
                activeCaseStudyCategoryIndex={activeCaseStudyCategoryIndex}
                removeCaseStudyCategory={removeCaseStudyCategory}
                setActiveCaseStudyCategoryIndex={setActiveCaseStudyCategoryIndex}
                updateFormValue={updateFormValue}
                isCaseStudyItemSelected={isCaseStudyItemSelected}
                selectedCaseStudyItem={selectedCaseStudyItem}
                caseStudiesKey={caseStudiesKey}
                activeCaseStudyItemIndex={activeCaseStudyItemIndex}
                removeCaseStudyEntry={removeCaseStudyEntry}
                setActiveCaseStudyItemIndex={setActiveCaseStudyItemIndex}
                isCaseStudiesModuleMode={isCaseStudiesModuleMode}
                caseStudiesItems={caseStudiesItems}
                addCaseStudyEntry={addCaseStudyEntry}
                formData={formData}
                caseStudyCategories={caseStudyCategories}
                markdownPreview={markdownPreview}
                toggleMarkdownPreview={toggleMarkdownPreview}
                normalizeMarkdown={normalizeMarkdown}
                openImagePicker={openImagePicker}
              />

              {isBlogArticleFile && formData && (
                <BlogArticleEditorPanel
                  formData={formData}
                  blogCategorySelectOptions={blogCategorySelectOptions}
                  blogProductOptions={blogProductOptions}
                  selectedRelatedProducts={selectedRelatedProducts}
                  markdownPreview={markdownPreview}
                  updateFormValue={updateFormValue}
                  openImagePicker={openImagePicker}
                  toggleMarkdownPreview={toggleMarkdownPreview}
                  normalizeMarkdown={normalizeMarkdown}
                />
              )}

              {formData && !isBlogArticleFile && !formData.hero && !formData.introduction && !formData.cta && (
                <div className="text-sm text-gray-500">
                  No schema panels available for this file yet. Use the JSON tab.
                </div>
              )}
              </>
              )}
            </div>
          ) : (
            <textarea
              className="w-full min-h-[520px] rounded-lg border border-gray-200 p-3 font-mono text-xs text-gray-800"
              value={content}
              onChange={(event) => {
                const next = event.target.value;
                setContent(next);
                try {
                  setFormData(JSON.parse(next));
                } catch (error) {
                  setFormData(null);
                }
              }}
              placeholder="Select a file to begin editing."
            />
          )}
        </div>
      </div>
      <ImagePickerModal
        open={showImagePicker}
        siteId={siteId}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
