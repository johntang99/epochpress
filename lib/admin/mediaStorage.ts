import { getSupabaseServerClient } from '@/lib/supabase/server';

export function getMediaBucketName(): string {
  return (process.env.SUPABASE_STORAGE_BUCKET || 'media').trim();
}

export function canUseSupabaseStorage(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_URL);
}

export function isBucketModeEnabled(): boolean {
  return Boolean(process.env.SUPABASE_STORAGE_BUCKET) && canUseSupabaseStorage();
}

export function shouldIncludeFilesystemInBucketMode(): boolean {
  const raw = (process.env.MEDIA_INCLUDE_FILESYSTEM || '').trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(raw);
}

export function buildStorageObjectPath(siteId: string, relativePath: string): string {
  return `${siteId}/${relativePath}`.replace(/\/+/g, '/');
}

export async function uploadToStorage(params: {
  siteId: string;
  relativePath: string;
  contentType: string;
  buffer: Buffer;
}): Promise<string> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error('Supabase server client is not configured');
  }

  const bucket = getMediaBucketName();
  const objectPath = buildStorageObjectPath(params.siteId, params.relativePath);
  const { error } = await supabase.storage.from(bucket).upload(objectPath, params.buffer, {
    contentType: params.contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  if (!data?.publicUrl) {
    throw new Error('Failed to generate public URL from storage object');
  }
  return data.publicUrl;
}

export async function deleteFromStorage(siteId: string, relativePath: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error('Supabase server client is not configured');
  }
  const bucket = getMediaBucketName();
  const objectPath = buildStorageObjectPath(siteId, relativePath);
  const { error } = await supabase.storage.from(bucket).remove([objectPath]);
  if (error) {
    throw new Error(`Storage delete failed: ${error.message}`);
  }
}

