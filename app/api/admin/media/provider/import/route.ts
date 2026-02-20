import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canManageMedia, requireSiteAccess } from '@/lib/admin/permissions';
import { upsertMediaDb } from '@/lib/admin/mediaDb';
import { isBucketModeEnabled, uploadToStorage } from '@/lib/admin/mediaStorage';
import fs from 'fs/promises';
import path from 'path';

function sanitizeFolder(value: string) {
  const cleaned = value.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '');
  if (!cleaned) return '';
  const normalized = path.posix.normalize(cleaned);
  if (normalized.startsWith('..') || normalized.includes('../')) {
    return '';
  }
  return normalized;
}

function sanitizeFilename(value: string) {
  const lower = value.toLowerCase();
  const cleaned = lower.replace(/[^a-z0-9.-]/g, '-').replace(/-+/g, '-');
  return cleaned || `import-${Date.now()}.jpg`;
}

function inferExtension(contentType: string, fallback = '.jpg') {
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  if (contentType.includes('gif')) return '.gif';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  return fallback;
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const payload = await request.json();
  const siteId = String(payload?.siteId || '');
  const folder = sanitizeFolder(String(payload?.folder || 'general'));
  const imageUrl = String(payload?.imageUrl || '');
  const filenameBase = sanitizeFilename(String(payload?.filename || 'imported-image'));

  if (!siteId || !imageUrl) {
    return NextResponse.json({ message: 'siteId and imageUrl are required' }, { status: 400 });
  }
  try {
    requireSiteAccess(session.user, siteId);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!canManageMedia(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const remote = await fetch(imageUrl);
  if (!remote.ok) {
    return NextResponse.json({ message: 'Failed to fetch source image' }, { status: 502 });
  }
  const contentType = remote.headers.get('content-type') || 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ message: 'Source URL is not an image' }, { status: 400 });
  }
  const ext = path.extname(filenameBase) || inferExtension(contentType);
  const normalizedBase = path.basename(filenameBase, path.extname(filenameBase));
  const filename = `${Date.now()}-${normalizedBase}${ext}`;
  const relativePath = folder ? `${folder}/${filename}` : filename;
  const arrayBuffer = await remote.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let url = '';
  if (isBucketModeEnabled()) {
    url = await uploadToStorage({
      siteId,
      relativePath,
      contentType,
      buffer,
    });
  } else {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', siteId, folder);
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    url = `/uploads/${siteId}/${relativePath}`;
  }

  await upsertMediaDb({
    siteId,
    path: relativePath,
    url,
  });

  return NextResponse.json({
    url,
    path: relativePath,
    filename,
  });
}

