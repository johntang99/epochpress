import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { canManageMedia } from '@/lib/admin/permissions';

type ProviderName = 'unsplash' | 'pexels';

function asProvider(value: string): ProviderName | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'unsplash' || normalized === 'pexels') return normalized;
  return null;
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!canManageMedia(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const provider = asProvider(searchParams.get('provider') || '');
  const query = (searchParams.get('query') || '').trim();
  const page = Number(searchParams.get('page') || '1');
  const perPage = Math.min(Math.max(Number(searchParams.get('perPage') || '20'), 1), 30);

  if (!provider) {
    return NextResponse.json({ message: 'provider is required' }, { status: 400 });
  }
  if (!query) {
    return NextResponse.json({ message: 'query is required' }, { status: 400 });
  }

  if (provider === 'unsplash') {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { message: 'UNSPLASH_ACCESS_KEY is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&per_page=${perPage}&query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      }
    );
    if (!response.ok) {
      return NextResponse.json({ message: 'Unsplash search failed' }, { status: 502 });
    }
    const payload = await response.json();
    const items = (Array.isArray(payload?.results) ? payload.results : []).map((item: any) => ({
      id: String(item.id),
      provider: 'unsplash',
      thumbUrl: String(item?.urls?.small || item?.urls?.thumb || ''),
      fullUrl: String(item?.urls?.full || item?.urls?.regular || ''),
      creditName: String(item?.user?.name || ''),
      creditLink: String(item?.user?.links?.html || ''),
      alt: String(item?.alt_description || item?.description || ''),
    }));
    return NextResponse.json({ items });
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: 'PEXELS_API_KEY is not configured' }, { status: 500 });
  }
  const response = await fetch(
    `https://api.pexels.com/v1/search?page=${page}&per_page=${perPage}&query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: apiKey,
      },
    }
  );
  if (!response.ok) {
    return NextResponse.json({ message: 'Pexels search failed' }, { status: 502 });
  }
  const payload = await response.json();
  const items = (Array.isArray(payload?.photos) ? payload.photos : []).map((item: any) => ({
    id: String(item.id),
    provider: 'pexels',
    thumbUrl: String(item?.src?.medium || item?.src?.small || ''),
    fullUrl: String(item?.src?.original || item?.src?.large2x || ''),
    creditName: String(item?.photographer || ''),
    creditLink: String(item?.photographer_url || ''),
    alt: String(item?.alt || ''),
  }));
  return NextResponse.json({ items });
}

