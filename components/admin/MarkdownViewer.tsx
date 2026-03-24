'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  title: string;
  description: string;
  content: string;
  lastModified?: string;
  filePath?: string;
}

export function MarkdownViewer({
  title,
  description,
  content,
  lastModified,
  filePath,
}: MarkdownViewerProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        {(lastModified || filePath) && (
          <div className="text-right text-xs text-gray-400 flex-shrink-0 ml-4">
            {lastModified && <p>Last updated: {lastModified}</p>}
            {filePath && <p className="font-mono mt-1">{filePath}</p>}
          </div>
        )}
      </div>

      {/* Markdown content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 lg:p-10">
          <article className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h1:border-b prose-h1:pb-3 prose-h1:mb-6 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h4:text-base prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-700 prose-th:font-semibold prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border-gray-200 prose-blockquote:border-emerald-300 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-a:text-emerald-600 prose-hr:border-gray-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
