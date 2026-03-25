import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get('siteId') || 'epoch-press';
  const status = request.nextUrl.searchParams.get('status');

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  let query = supabase
    .from('quotes')
    .select('*')
    .eq('site_id', siteId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ quotes: data || [] });
}

export async function PATCH(request: NextRequest) {
  const { id, status, notes, quoted_amount } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing quote id' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status) update.status = status;
  if (notes !== undefined) update.notes = notes;
  if (quoted_amount !== undefined) update.quoted_amount = quoted_amount;

  const { error } = await supabase.from('quotes').update(update).eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
