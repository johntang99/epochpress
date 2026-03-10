import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, '.env.local');
const CONTENT_PAGES_DIR = path.join(ROOT, 'content', 'epoch-press', 'en', 'pages');
const SITE_ID = 'epoch-press';
const LOCALE = 'en';
const UPDATED_BY = 'codex-product-spec-sync';
const PRODUCT_SLUGS = [
  'newspaper-printing',
  'magazine-printing',
  'book-printing',
  'calendar-printing',
  'marketing-print',
  'menu-printing',
  'business-cards',
  'large-format',
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function resolveSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function resolveServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

async function upsertProductPage(supabase, slug) {
  const filename = `${slug}.json`;
  const sourcePath = path.join(CONTENT_PAGES_DIR, filename);
  const data = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  const recordPath = `pages/${filename}`;

  const { error } = await supabase
    .from('content_entries')
    .upsert(
      {
        site_id: SITE_ID,
        locale: LOCALE,
        path: recordPath,
        data,
        updated_by: UPDATED_BY,
      },
      { onConflict: 'site_id,locale,path' }
    );

  if (error) {
    throw new Error(`${slug}: ${error.message}`);
  }

  return recordPath;
}

async function main() {
  loadEnvFile(ENV_FILE);

  const url = resolveSupabaseUrl();
  const key = resolveServiceRoleKey();
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const updatedPaths = [];
  for (const slug of PRODUCT_SLUGS) {
    const recordPath = await upsertProductPage(supabase, slug);
    updatedPaths.push(recordPath);
  }

  console.log(`Synced ${updatedPaths.length} product pages to DB for ${SITE_ID}/${LOCALE}`);
  for (const p of updatedPaths) {
    console.log(`- ${p}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
