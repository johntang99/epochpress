import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const ROOT = process.cwd();
const SOURCE_JSON = path.join(
  ROOT,
  'content',
  'epoch-press',
  'en',
  'pages',
  'magazine-printing.json'
);
const OUTPUT_PDF = path.join(ROOT, 'public', 'spec-sheets', 'magazine-printing-spec-sheet.pdf');

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
    .text(data.name || 'Magazine Printing', PAGE.margin + 12, y + 7, {
      width: pageWidth - 24,
    });
  y += titleHeight + 8;

  const subtitle = data.tagline || '';
  const meta = `${data.slug || 'magazine-printing'} • Generated ${new Date().toLocaleDateString()}`;
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
    const label = String(item.label || '');
    const value = String(item.value || '');
    const labelHeight = doc.heightOfString(label, { width: colA - 18 });
    const valueHeight = doc.heightOfString(value, { width: colB - 18 });
    const rowHeight = Math.max(28, labelHeight, valueHeight) + 10;

    cursorY = ensureSpace(doc, cursorY, rowHeight + 1);

    if (index % 2 === 1) {
      doc
        .rect(PAGE.margin, cursorY, pageWidth, rowHeight)
        .fill(COLORS.rowAlt);
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
    const h = doc.heightOfString(line, {
      width: doc.page.width - PAGE.margin * 2 - 20,
    });
    cursorY = ensureSpace(doc, cursorY, h + 10);
    doc
      .fillColor(COLORS.muted)
      .font('Helvetica')
      .fontSize(10.5)
      .text(line, PAGE.margin + 10, cursorY + 4, {
        width: doc.page.width - PAGE.margin * 2 - 20,
      });
    cursorY += h + 6;
  });
  return cursorY;
}

function generate() {
  const raw = fs.readFileSync(SOURCE_JSON, 'utf-8');
  const data = JSON.parse(raw);
  fs.mkdirSync(path.dirname(OUTPUT_PDF), { recursive: true });

  const doc = new PDFDocument({
    size: PAGE.size,
    margin: PAGE.margin,
    info: {
      Title: `${data.name || 'Magazine Printing'} Spec Sheet`,
      Author: 'Epoch Press',
    },
  });

  doc.pipe(fs.createWriteStream(OUTPUT_PDF));

  let y = drawTitleBlock(doc, data);
  const specs = Array.isArray(data.specs) ? data.specs : [];
  specs.forEach((section) => {
    y = ensureSpace(doc, y, 40);
    y = drawSectionHeader(doc, y, section.tab || 'Specifications');
    y = drawSpecRows(doc, y, Array.isArray(section.items) ? section.items : []);
  });

  y = drawNotes(doc, y + 4, data.rulesNotes || []);
  doc.end();
  console.log(`Generated ${OUTPUT_PDF}`);
}

generate();
