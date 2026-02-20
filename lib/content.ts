// ============================================
// CONTENT LOADING UTILITIES
// ============================================

import { Locale, SeoConfig } from './types';
import { headers } from 'next/headers';
import { getDefaultSite, getSiteByHost } from './sites';
import fs from 'fs';
import path from 'path';
import { defaultLocale } from './i18n';
import {
  canUseContentDb,
  fetchContentEntry,
  fetchThemeEntry,
  listContentEntriesByPrefix,
} from './contentDb';
import { canUseMediaDb, listMediaDb } from './admin/mediaDb';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SITES_CONFIG_PATH = path.join(CONTENT_DIR, '_sites.json');
const UPLOADS_PATH_REGEX = /^\/uploads\/([^/]+)\/(.+)$/;
const mediaUrlMapCache = new Map<string, Promise<Map<string, string>>>();

async function getMediaUrlMap(siteId: string): Promise<Map<string, string>> {
  if (!canUseMediaDb()) {
    return new Map<string, string>();
  }

  if (!mediaUrlMapCache.has(siteId)) {
    mediaUrlMapCache.set(
      siteId,
      (async () => {
        const items = await listMediaDb(siteId);
        const map = new Map<string, string>();
        for (const item of items) {
          if (!item.path || !item.url) continue;
          map.set(item.path, item.url);
          map.set(`/uploads/${siteId}/${item.path}`, item.url);
        }
        return map;
      })()
    );
  }

  return mediaUrlMapCache.get(siteId) as Promise<Map<string, string>>;
}

async function resolveUploadStringToMediaUrl(value: string): Promise<string> {
  const trimmed = value.trim();
  const match = UPLOADS_PATH_REGEX.exec(trimmed);
  if (!match) return value;

  const [, siteIdInPath, mediaPath] = match;
  const mediaMap = await getMediaUrlMap(siteIdInPath);
  return mediaMap.get(mediaPath) || mediaMap.get(trimmed) || value;
}

async function resolveMediaUrlsDeep(value: unknown): Promise<unknown> {
  if (typeof value === 'string') {
    return resolveUploadStringToMediaUrl(value);
  }

  if (Array.isArray(value)) {
    const resolved = await Promise.all(value.map((item) => resolveMediaUrlsDeep(item)));
    return resolved;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    const resolvedEntries = await Promise.all(
      entries.map(async ([key, entryValue]) => [key, await resolveMediaUrlsDeep(entryValue)] as const)
    );
    return Object.fromEntries(resolvedEntries);
  }

  return value;
}

async function getLocalDefaultSiteId(): Promise<string | null> {
  try {
    const raw = await fs.promises.readFile(SITES_CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as {
      sites?: Array<{ id?: string; enabled?: boolean }>;
    };
    const sites = Array.isArray(parsed.sites) ? parsed.sites : [];
    const firstEnabled = sites.find((site) => site.enabled !== false && site.id);
    return firstEnabled?.id ?? sites[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function resolveSiteId(siteId?: string): Promise<string> {
  if (siteId) return siteId;
  try {
    const host = headers().get('host');
    const normalizedHost = (host || '').toLowerCase();
    if (!host) {
      const localSiteId = await getLocalDefaultSiteId();
      if (localSiteId) return localSiteId;
    }
    const isLocalHost =
      normalizedHost.includes('localhost') ||
      normalizedHost.startsWith('127.0.0.1') ||
      normalizedHost.startsWith('0.0.0.0');

    if (isLocalHost) {
      const localSiteId = await getLocalDefaultSiteId();
      if (localSiteId) return localSiteId;
    }

    const site = await getSiteByHost(host);
    if (site?.id) return site.id;
    const defaultSite = await getDefaultSite();
    return defaultSite?.id || process.env.NEXT_PUBLIC_DEFAULT_SITE || 'default-site';
  } catch (error) {
    const localSiteId = await getLocalDefaultSiteId();
    if (localSiteId) return localSiteId;
    const defaultSite = await getDefaultSite();
    return defaultSite?.id || process.env.NEXT_PUBLIC_DEFAULT_SITE || 'default-site';
  }
}

export async function getRequestSiteId(): Promise<string> {
  return resolveSiteId();
}

/**
 * Generic function to load JSON content
 */
export async function loadContent<T>(
  siteId: string,
  locale: Locale,
  contentPath: string
): Promise<T | null> {
  if (canUseContentDb()) {
    const entry = await fetchContentEntry(siteId, locale, contentPath);
    if (entry?.data) {
      const resolved = await resolveMediaUrlsDeep(entry.data);
      return resolved as T;
    }
  }

  try {
    const filePath = path.join(CONTENT_DIR, siteId, locale, contentPath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Content file not found: ${filePath}`);
      return null;
    }
    
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error loading content from ${contentPath}:`, error);
    return null;
  }
}

/**
 * Load page content
 */
export async function loadPageContent<T>(
  pageName: string,
  locale: Locale,
  siteId?: string
): Promise<T | null> {
  const resolvedSiteId = await resolveSiteId(siteId);
  return loadContent<T>(resolvedSiteId, locale, `pages/${pageName}.json`);
}

/**
 * Load site info
 */
export async function loadSiteInfo(siteId: string, locale: Locale) {
  return loadContent(siteId, locale, 'site.json');
}

/**
 * Load navigation
 */
export async function loadNavigation(siteId: string, locale: Locale) {
  return loadContent(siteId, locale, 'navigation.json');
}

/**
 * Load theme config
 */
export async function loadTheme(siteId: string) {
  if (canUseContentDb()) {
    // Theme is site-wide, so always resolve from canonical locale row.
    const entry = await fetchThemeEntry(siteId, defaultLocale);
    if (entry?.data) {
      return resolveMediaUrlsDeep(entry.data);
    }
  }

  try {
    const filePath = path.join(CONTENT_DIR, siteId, 'theme.json');

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading theme:', error);
    return null;
  }
}

/**
 * Load SEO config
 */
export async function loadSeo(siteId: string, locale: Locale): Promise<SeoConfig | null> {
  return loadContent(siteId, locale, 'seo.json');
}

/**
 * Load footer config
 */
export async function loadFooter<T>(siteId: string, locale: Locale): Promise<T | null> {
  return loadContent<T>(siteId, locale, 'footer.json');
}

/**
 * Load all items from a directory (e.g., blog posts, services)
 */
export async function loadAllItems<T>(
  siteId: string | undefined,
  locale: Locale,
  directory: string
): Promise<T[]> {
  if (canUseContentDb()) {
    const resolvedSiteId = await resolveSiteId(siteId);
    const entries = await listContentEntriesByPrefix(
      resolvedSiteId,
      locale,
      `${directory}/`
    );
    const resolvedItems = await Promise.all(
      entries.map(async (entry) => (await resolveMediaUrlsDeep(entry.data)) as T)
    );
    return resolvedItems;
  }

  try {
    const resolvedSiteId = await resolveSiteId(siteId);
    const dirPath = path.join(CONTENT_DIR, resolvedSiteId, locale, directory);
    
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    
    const files = await fs.promises.readdir(dirPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
      })
    );
    
    return items;
  } catch (error) {
    console.error(`Error loading items from ${directory}:`, error);
    return [];
  }
}

/**
 * Load single item by slug
 */
export async function loadItemBySlug<T>(
  siteId: string | undefined,
  locale: Locale,
  directory: string,
  slug: string
): Promise<T | null> {
  const resolvedSiteId = await resolveSiteId(siteId);
  return loadContent<T>(resolvedSiteId, locale, `${directory}/${slug}.json`);
}

/**
 * Check if content exists
 */
export function contentExists(
  siteId: string,
  locale: Locale,
  contentPath: string
): boolean {
  const filePath = path.join(CONTENT_DIR, siteId, locale, contentPath);
  return fs.existsSync(filePath);
}

/**
 * Get content file path (for admin use)
 */
export function getContentFilePath(
  siteId: string,
  locale: Locale,
  contentPath: string
): string {
  return path.join(CONTENT_DIR, siteId, locale, contentPath);
}
