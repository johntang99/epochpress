import fs from 'fs';
import path from 'path';
import { MarkdownViewer } from '@/components/admin/MarkdownViewer';

export const dynamic = 'force-dynamic';

export default function SEOStatusPage() {
  const filePath = path.join(process.cwd(), 'docs', 'EpochPress_SEO_Status_Report.md');
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
    content = '# File Not Found\n\nThe SEO status report file (`docs/EpochPress_SEO_Status_Report.md`) was not found.';
  }

  return (
    <MarkdownViewer
      title="SEO Status Report"
      description="Current SEO health score, completed work, and remaining actions"
      content={content}
      lastModified={lastModified}
      filePath="docs/EpochPress_SEO_Status_Report.md"
    />
  );
}
