import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import PDFDocument from 'pdfkit';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data', 'pages');
const WORKBOOK_PATH = path.join(ROOT, 'document', 'Epoch-press website.xlsx');
const PUBLIC_DIR = path.join(ROOT, 'public');

const FIELD_GROUP_HEADERS = new Set([
  'Basic Information',
  'Basic Information ',
  'Binding',
  'Binding ',
  'Flat Size',
  'Finish Size',
  'Cover & Text',
  'Cover  Paper',
  'Cover Paper',
  'Cover Color',
  'Cover Page',
  'Cover Finishing',
  'Text  Paper',
  'Text Paper',
  'Text Page',
  'Text Color',
  'Inside Finishing',
  'Paper & Finishing',
  'Paper',
  'Color',
  'Page',
  'Finishing',
  'Folding',
  'Logistic',
  'Delivery time',
  'Packing',
  'shipping address',
  'Shipping Method',
  'Total Page',
  'Qty',
  'Products',
  'Cover Components',
  'Cover Components ',
]);

const SOURCE_SHEET_BY_TYPE = {
  'book-printing::Paper Books': ['Paper Book'],
  'book-printing::Hardcover Books': ['Hard Cover Book '],
  'book-printing::Notebooks': ['NoteBook'],
  'book-printing::Albums': ['Album'],
  'magazine-printing::Magazine': ['Magazine'],
  'magazine-printing::Catalogues': ['Catalogue'],
  'newspaper-printing::Newspapers': [],
  'newspaper-printing::Inserts': [],
  'calendar-printing::Desk Calendars': ['Desk Cal'],
  'calendar-printing::Wall Calendars': ['Wal Cal'],
  'marketing-print::Flyers': ['Flyer'],
  'marketing-print::Brochures': ['Brochures'],
  'marketing-print::Posters': ['Poster'],
  'marketing-print::Postcards': ['Post Card'],
  'menu-printing::Folded Menus': ['Menu'],
  'menu-printing::Unfolded Menus': ['Menu'],
  'business-cards::Standard Business Cards': ['Business Card'],
  'business-cards::Premium Finish Cards': ['Business Card'],
  'large-format::Vinyl Banners': [],
  'large-format::Fabric Displays': [],
  'large-format::Foam Board': [],
  'large-format::Acrylic': [],
  'large-format::Wall Graphics': [],
};

function normalizeCell(value) {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupe(values) {
  return [...new Set(values.map(normalizeCell).filter(Boolean))];
}

function isMeaningfulValue(value) {
  const normalized = normalizeCell(value);
  return Boolean(normalized) && !FIELD_GROUP_HEADERS.has(normalized) && normalized !== '竪版' && normalized !== '橫版';
}

function formatList(values, fallback = 'Available by quote') {
  return values.length ? values.join(', ') : fallback;
}

function readSheetRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
}

function getUniqueColumnValues(rows, columnIndex) {
  return dedupe(rows.map((row) => row[columnIndex]).filter((value) => isMeaningfulValue(value)));
}

function extractFlatSheet(rows) {
  return {
    sizes: getUniqueColumnValues(rows, 0),
    folds: getUniqueColumnValues(rows, 2),
    papers: getUniqueColumnValues(rows, 4),
    pages: getUniqueColumnValues(rows, 5),
    colors: getUniqueColumnValues(rows, 6),
    finishes: getUniqueColumnValues(rows, 7),
  };
}

function extractMultiPageSheet(rows) {
  let currentOrientation = 'portrait';
  let seenTextSection = false;
  const bindings = [];
  const portrait = [];
  const landscape = [];
  const coverPapers = [];
  const textPapers = [];
  const coverColors = [];
  const textColors = [];
  const coverFinishes = [];
  const insideFinishes = [];
  const textPages = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const bindingCell = normalizeCell(row[0]);
    const flat = normalizeCell(row[1]);
    const finish = normalizeCell(row[2]);
    const paper = normalizeCell(row[4]);
    const page = normalizeCell(row[5]);
    const color = normalizeCell(row[6]);
    const finishing = normalizeCell(row[7]);

    if (flat === '竪版') currentOrientation = 'portrait';
    if (flat === '橫版') currentOrientation = 'landscape';
    if (paper === 'Text Paper' || paper === 'Text  Paper' || finishing === 'Inside Finishing') seenTextSection = true;

    if (bindingCell && !FIELD_GROUP_HEADERS.has(bindingCell) && !bindingCell.startsWith('Min-Max(')) {
      const next = normalizeCell(rows[i + 1]?.[0]);
      if (next.startsWith('Min-Max(')) {
        bindings.push({
          label: bindingCell,
          value: next.replace('Min-Max(', '').replace(' Page)', ' pages').replace(')', ''),
        });
      } else if (/\(.*page/i.test(bindingCell)) {
        const [label, value] = bindingCell.split('(');
        bindings.push({ label: normalizeCell(label), value: normalizeCell(value).replace(/\)$/g, '') });
      } else {
        bindings.push({ label: bindingCell, value: 'See workbook rule details' });
      }
    }

    if (finish && !FIELD_GROUP_HEADERS.has(finish) && finish !== '竪版' && finish !== '橫版') {
      if (currentOrientation === 'portrait') portrait.push(finish);
      else landscape.push(finish);
    }

    if (paper && !FIELD_GROUP_HEADERS.has(paper)) {
      if (seenTextSection) textPapers.push(paper);
      else coverPapers.push(paper);
    }

    if (page && !FIELD_GROUP_HEADERS.has(page) && seenTextSection) textPages.push(page);

    if (color && !FIELD_GROUP_HEADERS.has(color)) {
      if (seenTextSection) textColors.push(color);
      else coverColors.push(color);
    }

    if (finishing && !FIELD_GROUP_HEADERS.has(finishing)) {
      if (seenTextSection) insideFinishes.push(finishing);
      else coverFinishes.push(finishing);
    }
  }

  return {
    bindings,
    portrait: dedupe(portrait),
    landscape: dedupe(landscape),
    coverPapers: dedupe(coverPapers),
    textPapers: dedupe(textPapers),
    coverColors: dedupe(coverColors),
    textColors: dedupe(textColors),
    coverFinishes: dedupe(coverFinishes),
    insideFinishes: dedupe(insideFinishes),
    textPages: dedupe(textPages),
  };
}

function fallbackSections(product, typeItem) {
  const rows = [];
  for (const spec of product.specs || []) {
    if (spec?.tab === 'Product Types') continue;
    for (const item of spec?.items || []) {
      rows.push([`${spec.tab}: ${item.label}`, item.value]);
      if (rows.length >= 10) break;
    }
    if (rows.length >= 10) break;
  }
  return [
    { heading: 'Product Type', rows: [['Type', typeItem.label], ['Description', typeItem.value]] },
    { heading: 'Parent Product', rows: [['Product', product.name], ['Slug', product.slug]] },
    { heading: 'Reference Specs', rows },
  ];
}

function buildWorkbookSections(product, typeItem, workbook, sourceSheets) {
  const rows = readSheetRows(workbook, sourceSheets[0]);
  if (!rows.length) return fallbackSections(product, typeItem);

  if (['Paper Book', 'Magazine', 'Catalogue', 'Desk Cal', 'Wal Cal'].includes(sourceSheets[0])) {
    const spec = extractMultiPageSheet(rows);
    return [
      { heading: 'Product Type', rows: [['Type', typeItem.label], ['Description', typeItem.value]] },
      { heading: 'Workbook Source', rows: [['Sheet', sourceSheets.join(', ')], ['Product', product.name]] },
      {
        heading: 'Core Specifications',
        rows: [
          ['Bindings', formatList(spec.bindings.map((item) => `${item.label} (${item.value})`))],
          ['Portrait Sizes', formatList(spec.portrait)],
          ['Landscape Sizes', formatList(spec.landscape)],
          ['Cover Paper', formatList(spec.coverPapers)],
          ['Text Paper', formatList(spec.textPapers)],
          ['Cover Color', formatList(spec.coverColors)],
          ['Text Color', formatList(spec.textColors, 'By quote')],
          ['Cover Finishing', formatList(spec.coverFinishes)],
          ['Inside Finishing', formatList(spec.insideFinishes, 'By quote')],
        ],
      },
    ];
  }

  if (['Flyer', 'Brochures', 'Poster', 'Post Card', 'Menu', 'Business Card', 'Hard Cover Book ', 'NoteBook', 'Album'].includes(sourceSheets[0])) {
    if (['Hard Cover Book ', 'NoteBook', 'Album'].includes(sourceSheets[0])) {
      const coverPapers = getUniqueColumnValues(rows, 4);
      const colors = getUniqueColumnValues(rows, 6);
      const finishes = getUniqueColumnValues(rows, 7);
      const bindings = getUniqueColumnValues(rows, 0);
      return [
        { heading: 'Product Type', rows: [['Type', typeItem.label], ['Description', typeItem.value]] },
        { heading: 'Workbook Source', rows: [['Sheet', sourceSheets.join(', ')], ['Product', product.name]] },
        {
          heading: 'Core Specifications',
          rows: [
            ['Binding', formatList(bindings)],
            ['Paper', formatList(coverPapers)],
            ['Color', formatList(colors)],
            ['Finishing', formatList(finishes)],
          ],
        },
      ];
    }

    const spec = extractFlatSheet(rows);
    let folds = spec.folds;
    if (product.slug === 'menu-printing' && typeItem.label === 'Folded Menus') {
      folds = spec.folds.filter((value) => normalizeCell(value).toLowerCase() !== 'unfold');
    }
    if (product.slug === 'menu-printing' && typeItem.label === 'Unfolded Menus') {
      folds = spec.folds.filter((value) => normalizeCell(value).toLowerCase() === 'unfold');
    }
    if (product.slug === 'business-cards' && typeItem.label === 'Standard Business Cards') {
      const excluded = new Set(['Foil Stamping', 'Embossing', 'Debossing', 'UV', 'Spot UV']);
      spec.finishes = spec.finishes.filter((value) => !excluded.has(value));
    }
    if (product.slug === 'business-cards' && typeItem.label === 'Premium Finish Cards') {
      const premium = ['Foil Stamping', 'Embossing', 'Debossing', 'UV', 'Spot UV'];
      spec.finishes = dedupe(spec.finishes.filter((value) => premium.includes(value)));
    }

    return [
      { heading: 'Product Type', rows: [['Type', typeItem.label], ['Description', typeItem.value]] },
      { heading: 'Workbook Source', rows: [['Sheet', sourceSheets.join(', ')], ['Product', product.name]] },
      {
        heading: 'Core Specifications',
        rows: [
          ['Size Options', formatList(spec.sizes)],
          ['Fold / Binding', formatList(folds)],
          ['Paper', formatList(spec.papers)],
          ['Page / Sides', formatList(spec.pages)],
          ['Color', formatList(spec.colors)],
          ['Finishing', formatList(spec.finishes)],
        ],
      },
    ];
  }

  return fallbackSections(product, typeItem);
}

function getProductTypeItems(specs) {
  const tab = (specs || []).find((spec) => spec?.tab === 'Product Types');
  return Array.isArray(tab?.items) ? tab.items : [];
}

function ensureSpace(doc, minHeight = 90) {
  if (doc.y + minHeight > doc.page.height - doc.page.margins.bottom) doc.addPage();
}

function drawSection(doc, heading, rows) {
  ensureSpace(doc, 60);
  doc.fillColor('#0f2747').font('Helvetica-Bold').fontSize(13).text(heading);
  doc.moveDown(0.35);
  rows.forEach(([label, value]) => {
    ensureSpace(doc, 42);
    const top = doc.y;
    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(10).text(label, 56, top, { width: 175 });
    doc.fillColor('#374151').font('Helvetica').fontSize(10).text(String(value || 'N/A'), 235, top, { width: 320, lineGap: 2 });
    doc.moveDown(0.2);
    doc.save().strokeColor('#e5e7eb').lineWidth(1).moveTo(56, doc.y + 3).lineTo(555, doc.y + 3).stroke().restore();
    doc.moveDown(0.42);
  });
  doc.moveDown(0.4);
}

function writePdf(outputPath, title, subtitle, sections, sourceSheets) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 56, bottom: 56, left: 56, right: 56 },
    compress: false,
    info: { Title: title },
  });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  doc.fillColor('#0f2747').font('Helvetica-Bold').fontSize(21).text(title);
  doc.moveDown(0.4);
  doc.fillColor('#4b5563').font('Helvetica').fontSize(11).text(subtitle || 'Product specification sheet');
  doc.moveDown(0.2);
  doc
    .fillColor('#6b7280')
    .font('Helvetica')
    .fontSize(9)
    .text(`Workbook source sheets: ${sourceSheets.length ? sourceSheets.join(', ') : 'No direct sheet (fallback from JSON)'}`);
  doc.moveDown(0.8);

  sections.forEach((section) => drawSection(doc, section.heading, section.rows));

  doc
    .moveDown(0.4)
    .fillColor('#6b7280')
    .font('Helvetica-Oblique')
    .fontSize(9)
    .text('Source of truth: update workbook/JSON and regenerate this PDF when specifications change.');

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function main() {
  const workbook = xlsx.readFile(WORKBOOK_PATH);
  const files = fs.readdirSync(DATA_DIR).filter((name) => name.endsWith('.json'));

  let total = 0;
  let workbookBacked = 0;
  let fallbackBacked = 0;

  for (const fileName of files) {
    const product = JSON.parse(fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8'));
    const productTypes = getProductTypeItems(product.specs);

    for (const typeItem of productTypes) {
      const pdfHref = normalizeCell(typeItem?.pdfHref);
      if (!pdfHref.startsWith('/')) continue;
      total += 1;

      const key = `${product.slug}::${typeItem.label}`;
      const sourceSheets = SOURCE_SHEET_BY_TYPE[key] || [];
      const sections = buildWorkbookSections(product, typeItem, workbook, sourceSheets);
      if (sourceSheets.length) workbookBacked += 1;
      else fallbackBacked += 1;

      const outputPath = path.join(PUBLIC_DIR, pdfHref.replace(/^\//, ''));
      // eslint-disable-next-line no-await-in-loop
      await writePdf(
        outputPath,
        `${product.name} - ${typeItem.label} Spec Sheet`,
        typeItem.value,
        sections,
        sourceSheets
      );
      console.log(`Generated: ${path.relative(ROOT, outputPath)} | sheets: ${sourceSheets.join(', ') || 'fallback'}`);
    }
  }

  console.log(`Summary: ${total} files generated (${workbookBacked} workbook-backed, ${fallbackBacked} fallback).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
