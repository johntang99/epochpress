#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const UPLOADS_PATH_REGEX = /^\/uploads\/([^/]+)\/(.+)$/;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = { dryRun: false, sites: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--dry-run') args.dryRun = true;
    if (token === '--sites') {
      const value = argv[i + 1] || '';
      args.sites = value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
      i += 1;
    }
  }
  return args;
}

async function main() {
  const projectRoot = process.cwd();
  loadEnvFile(path.join(projectRoot, '.env.local'));
  loadEnvFile(path.join(projectRoot, '.env'));

  const { dryRun, sites } = parseArgs(process.argv.slice(2));
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRole) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  if (!sites.length) {
    throw new Error('Pass --sites site-a,site-b');
  }

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: mediaRows, error: mediaError } = await supabase
    .from('media_assets')
    .select('site_id,path,url')
    .in('site_id', sites);
  if (mediaError) throw mediaError;

  const mediaMap = new Map();
  for (const row of mediaRows || []) {
    const pathKey = `${row.site_id}::${row.path}`;
    const fullKey = `${row.site_id}::/uploads/${row.site_id}/${row.path}`;
    mediaMap.set(pathKey, row.url);
    mediaMap.set(fullKey, row.url);
  }

  let scanned = 0;
  let changed = 0;
  let updated = 0;

  for (const siteId of sites) {
    const { data: entries, error: entriesError } = await supabase
      .from('content_entries')
      .select('id,site_id,locale,path,data')
      .eq('site_id', siteId);
    if (entriesError) throw entriesError;

    for (const entry of entries || []) {
      scanned += 1;
      let touched = false;

      const transform = (value) => {
        if (typeof value === 'string') {
          const match = UPLOADS_PATH_REGEX.exec(value.trim());
          if (!match) return value;
          const [, imageSiteId, mediaPath] = match;
          const keyA = `${imageSiteId}::${mediaPath}`;
          const keyB = `${imageSiteId}::${value.trim()}`;
          const mapped = mediaMap.get(keyA) || mediaMap.get(keyB);
          if (mapped && mapped !== value) {
            touched = true;
            return mapped;
          }
          return value;
        }
        if (Array.isArray(value)) return value.map((item) => transform(item));
        if (value && typeof value === 'object') {
          const out = {};
          for (const [key, nested] of Object.entries(value)) {
            out[key] = transform(nested);
          }
          return out;
        }
        return value;
      };

      const normalized = transform(entry.data);
      if (!touched) continue;
      changed += 1;

      if (!dryRun) {
        const revisionInsert = await supabase.from('content_revisions').insert({
          entry_id: entry.id,
          data: entry.data,
          created_by: 'script:normalize-content-media-urls',
          note: 'Normalize /uploads paths to media_assets URLs',
        });
        if (revisionInsert.error) throw revisionInsert.error;

        const entryUpdate = await supabase
          .from('content_entries')
          .update({
            data: normalized,
            updated_at: new Date().toISOString(),
            updated_by: 'script:normalize-content-media-urls',
          })
          .eq('id', entry.id);
        if (entryUpdate.error) throw entryUpdate.error;
        updated += 1;
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? 'dry-run' : 'execute',
        scanned,
        changed,
        updated,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

