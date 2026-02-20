import fs from 'fs/promises';
import path from 'path';
import {
  listMediaDb,
} from '@/lib/admin/mediaDb';
import {
  isBucketModeEnabled,
  shouldIncludeFilesystemInBucketMode,
} from '@/lib/admin/mediaStorage';

export interface MediaItem {
  id: string;
  url: string;
  path: string;
}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

async function walkDirectory(dir: string, baseDir: string, items: MediaItem[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDirectory(fullPath, baseDir, items);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        const relative = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        items.push({
          id: relative,
          path: relative,
          url: `/uploads/${relative}`,
        });
      }
    }
  }
}

export async function listMedia(siteId: string): Promise<MediaItem[]> {
  const baseDir = path.join(process.cwd(), 'public', 'uploads', siteId);
  const filesystemItems: MediaItem[] = [];
  try {
    await walkDirectory(baseDir, baseDir, filesystemItems);
  } catch (error) {
    // ignore; directory may not exist yet
  }
  const normalizedFilesystemItems = filesystemItems
    .map((item) => ({
      ...item,
      url: `/uploads/${siteId}/${item.path}`,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

  if (isBucketModeEnabled()) {
    const dbItems = await listMediaDb(siteId);
    if (shouldIncludeFilesystemInBucketMode()) {
      const mergedByPath = new Map<string, MediaItem>();
      for (const item of dbItems) mergedByPath.set(item.path, item);
      for (const item of normalizedFilesystemItems) {
        if (!mergedByPath.has(item.path)) {
          mergedByPath.set(item.path, item);
        }
      }
      return Array.from(mergedByPath.values()).sort((a, b) => a.path.localeCompare(b.path));
    }
    return dbItems.sort((a, b) => a.path.localeCompare(b.path));
  }

  if (normalizedFilesystemItems.length > 0) {
    return normalizedFilesystemItems;
  }

  return listMediaDb(siteId);
}
