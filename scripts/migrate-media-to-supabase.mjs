#!/usr/bin/env node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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

async function walkFiles(dir, root, files = []) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(fullPath, root, files);
      continue;
    }
    const relativePath = path.relative(root, fullPath).replace(/\\/g, '/');
    files.push({ fullPath, relativePath });
  }
  return files;
}

async function main() {
  const projectRoot = process.cwd();
  loadEnvFile(path.join(projectRoot, '.env.local'));
  loadEnvFile(path.join(projectRoot, '.env'));

  const { dryRun, sites } = parseArgs(process.argv.slice(2));
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = (process.env.SUPABASE_STORAGE_BUCKET || 'media').trim();

  if (!supabaseUrl || !serviceRole) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  if (!sites.length) {
    throw new Error('Pass --sites site-a,site-b');
  }

  const supabase = createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let scanned = 0;
  let uploaded = 0;
  let upserted = 0;
  let missingSites = 0;

  for (const siteId of sites) {
    const uploadsRoot = path.join(projectRoot, 'public', 'uploads', siteId);
    if (!fs.existsSync(uploadsRoot)) {
      missingSites += 1;
      console.warn(`[skip] uploads root not found for ${siteId}`);
      continue;
    }

    const files = await walkFiles(uploadsRoot, uploadsRoot);
    scanned += files.length;
    console.log(`[site:${siteId}] found ${files.length} files`);

    for (const file of files) {
      const objectPath = `${siteId}/${file.relativePath}`.replace(/\/+/g, '/');
      const contentType = file.fullPath.endsWith('.png')
        ? 'image/png'
        : file.fullPath.endsWith('.webp')
        ? 'image/webp'
        : file.fullPath.endsWith('.gif')
        ? 'image/gif'
        : 'image/jpeg';

      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      const url = data?.publicUrl || '';
      if (!url) continue;

      if (!dryRun) {
        const buffer = await fsp.readFile(file.fullPath);
        const uploadResult = await supabase.storage.from(bucket).upload(objectPath, buffer, {
          upsert: true,
          contentType,
        });
        if (uploadResult.error) {
          console.error(`[error] upload failed ${objectPath}: ${uploadResult.error.message}`);
          continue;
        }
        uploaded += 1;

        const upsertResult = await supabase.from('media_assets').upsert(
          {
            site_id: siteId,
            path: file.relativePath,
            url,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'site_id,path' }
        );
        if (upsertResult.error) {
          console.error(
            `[error] media_assets upsert failed ${siteId}/${file.relativePath}: ${upsertResult.error.message}`
          );
          continue;
        }
      }
      upserted += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? 'dry-run' : 'execute',
        bucket,
        scanned,
        uploaded,
        upserted,
        missingSites,
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

