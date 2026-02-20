import { listMediaDb } from '@/lib/admin/mediaDb';

const UPLOADS_PATH_REGEX = /^\/uploads\/([^/]+)\/(.+)$/;

const mediaMapCache = new Map<string, Promise<Map<string, string>>>();

async function getMediaMap(siteId: string): Promise<Map<string, string>> {
  if (!mediaMapCache.has(siteId)) {
    mediaMapCache.set(
      siteId,
      (async () => {
        const map = new Map<string, string>();
        const items = await listMediaDb(siteId);
        for (const item of items) {
          map.set(item.path, item.url);
          map.set(`/uploads/${siteId}/${item.path}`, item.url);
        }
        return map;
      })()
    );
  }

  return mediaMapCache.get(siteId) as Promise<Map<string, string>>;
}

export async function normalizeUploadsValueToMediaUrl(
  value: string,
  fallbackSiteId?: string
): Promise<string> {
  const trimmed = value.trim();
  const directMatch = UPLOADS_PATH_REGEX.exec(trimmed);
  if (directMatch) {
    const [, siteId, mediaPath] = directMatch;
    const map = await getMediaMap(siteId);
    return map.get(trimmed) || map.get(mediaPath) || value;
  }

  if (fallbackSiteId && trimmed.startsWith('/uploads/')) {
    const map = await getMediaMap(fallbackSiteId);
    return map.get(trimmed) || value;
  }

  return value;
}

export async function normalizeContentMediaUrls(
  value: unknown,
  fallbackSiteId?: string
): Promise<unknown> {
  if (typeof value === 'string') {
    return normalizeUploadsValueToMediaUrl(value, fallbackSiteId);
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map((entry) => normalizeContentMediaUrls(entry, fallbackSiteId)));
  }

  if (value && typeof value === 'object') {
    const pairs = await Promise.all(
      Object.entries(value as Record<string, unknown>).map(async ([key, entryValue]) => [
        key,
        await normalizeContentMediaUrls(entryValue, fallbackSiteId),
      ])
    );
    return Object.fromEntries(pairs);
  }

  return value;
}

