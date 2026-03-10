import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const ROOT = process.cwd();
const CONTENT_PAGES_DIR = path.join(ROOT, 'content', 'epoch-press', 'en', 'pages');
const OUTPUT_DIR = path.join(ROOT, 'public', 'spec-sheets');
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

const PAGE = {
  size: 'LETTER',
  margin: 44,
};

const COLORS = {
  text: '#0f1b2d',
  muted: '#5a6977',
  border: '#d7dee5',
  rowAlt: '#f8fafc',
  headerBg: '#edf3f8',
  titleBg: '#f7f4ec',
};

function ensureSpace(doc, y, requiredHeight) {
  const limit = doc.page.height - PAGE.margin;
  if (y + requiredHeight <= limit) return y;
  doc.addPage();
  return PAGE.margin;
}

function drawTitleBlock(doc, data) {
  const pageWidth = doc.page.width - PAGE.margin * 2;
  let y = PAGE.margin;

  const titleHeight = 34;
  doc
    .rect(PAGE.margin, y, pageWidth, titleHeight)
    .fillAndStroke(COLORS.titleBg, COLORS.border);
  doc
    .fillColor(COLORS.text)
    .font('Helvetica-Bold')
    .fontSize(22)
    .text(data.name || data.slug || 'Product Spec Sheet', PAGE.margin + 12, y + 7, {
      width: pageWidth - 24,
    });
  y += titleHeight + 8;

  const subtitle = data.tagline || '';
  const meta = `${data.slug || ''} • Generated ${new Date().toLocaleDateString()}`;
  doc
    .fillColor(COLORS.muted)
    .font('Helvetica')
    .fontSize(11)
    .text(subtitle, PAGE.margin, y, { width: pageWidth });
  y += doc.heightOfString(subtitle, { width: pageWidth }) + 4;
  doc.text(meta, PAGE.margin, y, { width: pageWidth });
  y += 20;

  return y;
}

function drawSectionHeader(doc, y, title) {
  const pageWidth = doc.page.width - PAGE.margin * 2;
  const headerH = 24;
  doc
    .rect(PAGE.margin, y, pageWidth, headerH)
    .fillAndStroke(COLORS.headerBg, COLORS.border);
  doc
    .fillColor(COLORS.text)
    .font('Helvetica-Bold')
    .fontSize(12.5)
    .text(title, PAGE.margin + 10, y + 6, { width: pageWidth - 20 });
  return y + headerH;
}

function drawSpecRows(doc, y, items) {
  const pageWidth = doc.page.width - PAGE.margin * 2;
  const colA = 180;
  const colB = pageWidth - colA;

  let cursorY = y;
  items.forEach((item, index) => {
    const label = String(item?.label || '');
    const value = String(item?.value || '');
    const labelHeight = doc.heightOfString(label, { width: colA - 18 });
    const valueHeight = doc.heightOfString(value, { width: colB - 18 });
    const rowHeight = Math.max(28, labelHeight, valueHeight) + 10;

    cursorY = ensureSpace(doc, cursorY, rowHeight + 1);

    if (index % 2 === 1) {
      doc.rect(PAGE.margin, cursorY, pageWidth, rowHeight).fill(COLORS.rowAlt);
    }

    doc
      .lineWidth(1)
      .strokeColor(COLORS.border)
      .rect(PAGE.margin, cursorY, pageWidth, rowHeight)
      .stroke();
    doc
      .moveTo(PAGE.margin + colA, cursorY)
      .lineTo(PAGE.margin + colA, cursorY + rowHeight)
      .stroke();

    doc
      .fillColor(COLORS.text)
      .font('Helvetica-Bold')
      .fontSize(10.5)
      .text(label, PAGE.margin + 9, cursorY + 6, { width: colA - 18 });
    doc
      .fillColor(COLORS.text)
      .font('Helvetica')
      .fontSize(10.5)
      .text(value, PAGE.margin + colA + 9, cursorY + 6, { width: colB - 18 });

    cursorY += rowHeight;
  });

  return cursorY + 10;
}

function drawNotes(doc, y, notes) {
  if (!Array.isArray(notes) || notes.length === 0) return y;

  let cursorY = ensureSpace(doc, y, 40);
  cursorY = drawSectionHeader(doc, cursorY, 'Notes');

  notes.forEach((note) => {
    const line = `• ${note}`;
    const lineWidth = doc.page.width - PAGE.margin * 2 - 20;
    const h = doc.heightOfString(line, { width: lineWidth });
    cursorY = ensureSpace(doc, cursorY, h + 10);
    doc
      .fillColor(COLORS.muted)
      .font('Helvetica')
      .fontSize(10.5)
      .text(line, PAGE.margin + 10, cursorY + 4, { width: lineWidth });
    cursorY += h + 6;
  });

  return cursorY;
}

function buildPdfForProduct(slug) {
  const sourceJsonPath = path.join(CONTENT_PAGES_DIR, `${slug}.json`);
  if (!fs.existsSync(sourceJsonPath)) {
    throw new Error(`Missing source JSON: ${sourceJsonPath}`);
  }

  const data = JSON.parse(fs.readFileSync(sourceJsonPath, 'utf-8'));
  const outputPath = path.join(OUTPUT_DIR, `${slug}-spec-sheet.pdf`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const doc = new PDFDocument({
    size: PAGE.size,
    margin: PAGE.margin,
    info: {
      Title: `${data.name || slug} Spec Sheet`,
      Author: 'Epoch Press',
    },
  });

  doc.pipe(fs.createWriteStream(outputPath));

  let y = drawTitleBlock(doc, data);
  const specs = Array.isArray(data.specs) ? data.specs : [];
  specs.forEach((section) => {
    y = ensureSpace(doc, y, 40);
    y = drawSectionHeader(doc, y, section.tab || 'Specifications');
    y = drawSpecRows(doc, y, Array.isArray(section.items) ? section.items : []);
  });

  y = drawNotes(doc, y + 4, data.rulesNotes || []);
  void y;

  doc.end();
  return outputPath;
}

function main() {
  const outputs = PRODUCT_SLUGS.map((slug) => buildPdfForProduct(slug));
  outputs.forEach((filePath) => {
    console.log(`Generated ${filePath}`);
  });
}

main();
