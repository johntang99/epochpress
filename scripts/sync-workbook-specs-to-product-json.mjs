import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const RULES_PATH = path.join(ROOT, 'data', 'product-rules.generated.json');
const DATA_PAGES_DIR = path.join(ROOT, 'data', 'pages');
const CONTENT_PAGES_DIR = path.join(ROOT, 'content', 'epoch-press', 'en', 'pages');

const TARGET_SLUGS = [
  'book-printing',
  'magazine-printing',
  'calendar-printing',
  'marketing-print',
  'menu-printing',
  'business-cards',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function mergeSpecsKeepingProductTypes(currentSpecs, workbookSpecs) {
  const currentProductTypes = Array.isArray(currentSpecs)
    ? currentSpecs.find((spec) => spec?.tab === 'Product Types')
    : null;
  const workbookWithoutProductTypes = (Array.isArray(workbookSpecs) ? workbookSpecs : []).filter(
    (spec) => spec?.tab !== 'Product Types'
  );

  if (currentProductTypes) {
    return [currentProductTypes, ...workbookWithoutProductTypes];
  }

  return Array.isArray(workbookSpecs) ? workbookSpecs : [];
}

function syncFile(filePath, productRules) {
  const current = readJson(filePath);
  const next = { ...current };
  next.specs = mergeSpecsKeepingProductTypes(current.specs, productRules.specs);
  next.rulesNotes = Array.isArray(productRules.notes) ? productRules.notes : current.rulesNotes;
  writeJson(filePath, next);
}

function main() {
  const rules = readJson(RULES_PATH);

  for (const slug of TARGET_SLUGS) {
    const productRules = rules?.products?.[slug];
    if (!productRules) {
      throw new Error(`Missing workbook rules for ${slug}`);
    }

    syncFile(path.join(DATA_PAGES_DIR, `${slug}.json`), productRules);
    syncFile(path.join(CONTENT_PAGES_DIR, `${slug}.json`), productRules);
    console.log(`Synced workbook specs: ${slug}`);
  }
}

main();
