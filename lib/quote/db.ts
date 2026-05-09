import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { QuoteSettings } from '@/lib/types';

export function canUseQuoteDb() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function loadQuoteSettingsDb(siteId: string): Promise<QuoteSettings | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('quote_settings')
    .select('settings')
    .eq('site_id', siteId)
    .maybeSingle();

  if (error) {
    console.error('Supabase loadQuoteSettingsDb error:', error);
    return null;
  }

  return (data?.settings as QuoteSettings) || null;
}

export async function saveQuoteSettingsDb(
  siteId: string,
  settings: QuoteSettings
): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('quote_settings')
    .upsert(
      {
        site_id: siteId,
        settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'site_id' }
    );

  if (error) {
    console.error('Supabase saveQuoteSettingsDb error:', error);
    return false;
  }

  return true;
}
