import fs from 'fs';
import path from 'path';
import { MarkdownViewer } from '@/components/admin/MarkdownViewer';

export const dynamic = 'force-dynamic';

export default function SEOPlanPage() {
  const filePath = path.join(process.cwd(), 'docs', 'EpochPress_SEO_Implementation_Plan.md');
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
    content = '# File Not Found\n\nThe SEO plan file (`docs/EpochPress_SEO_Implementation_Plan.md`) was not found. Please create it.';
  }

  return (
    <MarkdownViewer
      title="SEO Plan"
      description="Implementation roadmap for SEO page build-out"
      content={content}
      lastModified={lastModified}
      filePath="docs/EpochPress_SEO_Implementation_Plan.md"
    />
  );
}
