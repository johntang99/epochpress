import fs from 'fs';
import path from 'path';

export function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function resolveRenderableImageUrl(value: unknown): string | null {
  const normalized = normalizeImageUrl(value);
  if (!normalized) return null;

  // External URLs and non-upload relative paths can be rendered directly.
  if (!normalized.startsWith('/uploads/')) {
    return normalized;
  }

  // Local upload URLs only render if the file is present in public/uploads.
  const localPath = path.join(process.cwd(), 'public', normalized.replace(/^\//, ''));
  return fs.existsSync(localPath) ? normalized : null;
}
