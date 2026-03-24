import fs from 'fs';
import path from 'path';
import { MarkdownViewer } from '@/components/admin/MarkdownViewer';

export const dynamic = 'force-dynamic';

export default function KeywordMapPage() {
  const filePath = path.join(process.cwd(), 'docs', 'EpochPress_Keyword_Map.md');
  let content = '';
  let lastModified = '';

  try {
    content = fs.readFileSync(filePath, 'utf-8');
    const stats = fs.statSync(filePath);
    lastModified = stats.mtime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    content = '# File Not Found\n\nThe keyword map file (`docs/EpochPress_Keyword_Map.md`) was not found. Please create it.';
  }

  return (
    <MarkdownViewer
      title="Keyword Map"
      description="SEO keyword research, clustering, and page mapping for Epoch Press"
      content={content}
      lastModified={lastModified}
      filePath="docs/EpochPress_Keyword_Map.md"
    />
  );
}
