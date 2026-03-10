#!/usr/bin/env node

import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import xlsx from 'xlsx';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

const ROOT = process.cwd();
const WORKBOOK_PATH = path.join(ROOT, 'document', 'Epoch-press website.xlsx');
const RULES_PATH = path.join(ROOT, 'data', 'product-rules.generated.json');
const PDF_DIR = path.join(ROOT, 'public', 'spec-sheets');
const CONTENT_PAGE_DIR = path.join(ROOT, 'content', 'epoch-press', 'en', 'pages');
const FALLBACK_PAGE_DIR = path.join(ROOT, 'data', 'pages');
const QUOTE_CONFIG_PATH = path.join(ROOT, 'data', 'quote-config.json');
const CONTENT_QUOTE_CONFIG_PATH = path.join(CONTENT_PAGE_DIR, 'quote-config.json');

const FIELD_GROUP_HEADERS = new Set([
  'Basic Information',
  'Binding',
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
  'Basic Information ',
  'Cover Components',
  'Cover Components ',
  'Binding ',
]);

const STANDARD_COLOR_OPTIONS = ['1/1', '4/1', '4/4', '4/0'];
const STANDARD_FINISH_OPTIONS = [
  'Lamination--Matt',
  'Lamination--Gloss',
  'Lamination--Soft touch',
  'Foil Stamping',
  'Embossing',
  'Debossing',
  'UV',
  'Spot UV',
  'AQ Coating --Matt',
  'AQ Coating --Gloss',
  'AQ Coating --Soft touch',
];

function normalizeCell(value) {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isMeaningfulValue(value) {
  const normalized = normalizeCell(value);
  if (!normalized) return false;
  if (FIELD_GROUP_HEADERS.has(normalized)) return false;
  if (normalized === '竪版' || normalized === '橫版') return false;
  return true;
}

function dedupe(values) {
  return [...new Set(values.map(normalizeCell).filter(Boolean))];
}

function readSheetRows(workbook, sheetName) {
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
    defval: '',
    raw: false,
  });
}

function getUniqueColumnValues(rows, columnIndex) {
  return dedupe(
    rows
      .map((row) => row[columnIndex])
      .filter((value) => isMeaningfulValue(value))
  );
}

function extractMultiPageSheet(rows) {
  let currentOrientation = 'portrait';
  const portraitFinishSizes = [];
  const landscapeFinishSizes = [];
  const bindings = [];
  const coverPapers = [];
  const textPapers = [];
  const coverColors = [];
  const textColors = [];
  const coverFinishes = [];
  const insideFinishes = [];
  const textPages = [];
  const packing = [];
  let seenTextSection = false;

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index] || [];
    const bindingCell = normalizeCell(row[0]);
    const flatSizeCell = normalizeCell(row[1]);
    const finishSizeCell = normalizeCell(row[2]);
    const paperCell = normalizeCell(row[4]);
    const pageCell = normalizeCell(row[5]);
    const colorCell = normalizeCell(row[6]);
    const finishCell = normalizeCell(row[7]);
    const packingCell = normalizeCell(row[10]);

    if (paperCell === 'Text Paper' || paperCell === 'Text  Paper') {
      seenTextSection = true;
    }
    if (finishCell === 'Inside Finishing') {
      seenTextSection = true;
    }

    if (flatSizeCell === '竪版') currentOrientation = 'portrait';
    if (flatSizeCell === '橫版') currentOrientation = 'landscape';

    if (bindingCell && !FIELD_GROUP_HEADERS.has(bindingCell) && !bindingCell.startsWith('Min-Max(')) {
      const nextBindingNote = normalizeCell(rows[index + 1]?.[0]);
      if (nextBindingNote.startsWith('Min-Max(')) {
        bindings.push({
          label: bindingCell.replace(/\s+/g, ' '),
          value: nextBindingNote
            .replace('Min-Max(', '')
            .replace(' Page)', ' pages')
            .replace(')', ''),
        });
      } else if (/\(.*page/i.test(bindingCell)) {
        const [label, value] = bindingCell.split('(');
        bindings.push({
          label: normalizeCell(label),
          value: normalizeCell(value).replace(/\)$/g, ''),
        });
      } else {
        bindings.push({
          label: bindingCell,
          value: 'See size and page-count requirements in spec sheet.',
        });
      }
    }

    if (finishSizeCell && !FIELD_GROUP_HEADERS.has(finishSizeCell) && finishSizeCell !== '竪版' && finishSizeCell !== '橫版') {
      if (currentOrientation === 'portrait') {
        portraitFinishSizes.push(finishSizeCell);
      } else {
        landscapeFinishSizes.push(finishSizeCell);
      }
    }

    if (paperCell) {
      if (!seenTextSection && !FIELD_GROUP_HEADERS.has(paperCell)) {
        coverPapers.push(paperCell);
      }
      if (seenTextSection && !FIELD_GROUP_HEADERS.has(paperCell)) {
        textPapers.push(paperCell);
      }
    }

    if (pageCell && !FIELD_GROUP_HEADERS.has(pageCell)) {
      if (seenTextSection) {
        textPages.push(pageCell);
      }
    }

    if (colorCell && !FIELD_GROUP_HEADERS.has(colorCell)) {
      if (!seenTextSection) {
        coverColors.push(colorCell);
      } else {
        textColors.push(colorCell);
      }
    }

    if (finishCell && !FIELD_GROUP_HEADERS.has(finishCell)) {
      if (!seenTextSection) {
        coverFinishes.push(finishCell);
      } else {
        insideFinishes.push(finishCell);
      }
    }

    if (packingCell && !FIELD_GROUP_HEADERS.has(packingCell)) {
      packing.push(packingCell);
    }
  }

  return {
    bindings,
    portraitFinishSizes: dedupe(portraitFinishSizes),
    landscapeFinishSizes: dedupe(landscapeFinishSizes),
    coverPapers: dedupe(coverPapers),
    textPapers: dedupe(textPapers),
    coverColors: dedupe(coverColors),
    textColors: dedupe(textColors),
    coverFinishes: dedupe(coverFinishes),
    insideFinishes: dedupe(insideFinishes),
    textPages: dedupe(textPages),
    packing: dedupe(packing),
  };
}

function extractFlatSheet(rows) {
  return {
    sizes: getUniqueColumnValues(rows, 0),
    foldingOrBinding: getUniqueColumnValues(rows, 2),
    papers: getUniqueColumnValues(rows, 4),
    pages: getUniqueColumnValues(rows, 5),
    colors: getUniqueColumnValues(rows, 6),
    finishes: getUniqueColumnValues(rows, 7),
  };
}

function formatList(values, fallback = 'Available by quote') {
  return values.length > 0 ? values.join(', ') : fallback;
}

function formatPageRange(values, fallback = 'Available by quote') {
  if (values.length === 0) return fallback;
  const numbers = values
    .map((value) => Number.parseInt(String(value), 10))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);
  if (numbers.length === 0) return values.join(', ');
  return `${numbers[0]}–${numbers[numbers.length - 1]} pages`;
}

function createMagazineProductRules(rows) {
  const spec = extractMultiPageSheet(rows);
  return {
    label: 'Magazine Printing',
    sourceSheets: ['Magazine'],
    workbookCompleteness: 'high',
    detailSheet: {
      text: 'Download Full Spec Sheet (Excel)',
      href: '/spec-sheets/magazine-printing-spec-sheet.xlsx',
    },
    notes: ['Workbook is treated as source-of-truth for factual magazine specifications.'],
    specs: [
      { tab: 'Binding & Page Range', items: spec.bindings },
      {
        tab: 'Trim Sizes',
        items: [
          { label: 'Portrait Sizes', value: formatList(spec.portraitFinishSizes) },
          { label: 'Landscape Sizes', value: formatList(spec.landscapeFinishSizes) },
        ],
      },
      {
        tab: 'Cover & Text Stocks',
        items: [
          { label: 'Cover Paper', value: formatList(spec.coverPapers) },
          { label: 'Text Paper', value: formatList(spec.textPapers) },
          { label: 'Text Page Range', value: formatPageRange(spec.textPages) },
        ],
      },
      {
        tab: 'Color, Finish & Packing',
        items: [
          { label: 'Cover Color', value: formatList(spec.coverColors) },
          { label: 'Text Color', value: formatList(spec.textColors, 'Matches selected print method') },
          { label: 'Cover Finishing', value: formatList(spec.coverFinishes) },
          { label: 'Inside Finishing', value: formatList(spec.insideFinishes, 'Available by quote') },
          { label: 'Packing', value: formatList(spec.packing) },
        ],
      },
    ],
    quoteFields: [
      { id: 'binding', label: 'Binding Type', type: 'radio', options: spec.bindings.map((item) => item.label) },
      { id: 'trimSize', label: 'Trim Size', type: 'select', options: [...spec.portraitFinishSizes, ...spec.landscapeFinishSizes] },
      { id: 'pageCount', label: 'Page Count', type: 'number', placeholder: 'Match workbook page rules for selected binding' },
      { id: 'coverPaper', label: 'Cover Paper', type: 'select', options: spec.coverPapers },
      { id: 'textPaper', label: 'Text Paper', type: 'select', options: spec.textPapers },
      { id: 'color', label: 'Color', type: 'radio', options: spec.coverColors },
      { id: 'coverFinish', label: 'Cover Finish', type: 'select', options: spec.coverFinishes },
      { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
      { id: 'packing', label: 'Packing', type: 'select', options: spec.packing },
      { id: 'turnaround', label: 'Turnaround', type: 'select', options: ['Standard', 'Rush', 'Flexible'] },
    ],
  };
}

function createBookProductRules(paperRows, hardCoverRows, albumRows, noteBookRows) {
  const paper = extractMultiPageSheet(paperRows);
  const hardCover = {
    materials: getUniqueColumnValues(hardCoverRows, 4),
    colors: getUniqueColumnValues(hardCoverRows, 6),
    finishes: getUniqueColumnValues(hardCoverRows, 7),
    packing: getUniqueColumnValues(hardCoverRows, 10),
    bindings: getUniqueColumnValues(hardCoverRows, 0),
  };
  const albumBindings = getUniqueColumnValues(albumRows, 0);
  const notebookBindings = getUniqueColumnValues(noteBookRows, 0);

  const bindingOptions = dedupe([
    ...paper.bindings.map((item) => item.label),
    ...hardCover.bindings,
    ...albumBindings,
    ...notebookBindings,
    'Hard Cover',
  ]).filter((value) => value !== 'Total Page' && value !== 'Qty');

  const hardCoverMaterials = dedupe(
    hardCover.materials.filter((value) => ['Fabric', 'Paper', 'Jacket (書衣）'].includes(value))
  );
  const hardCoverColors = dedupe(
    [...paper.coverColors, ...hardCover.colors].filter((value) => STANDARD_COLOR_OPTIONS.includes(value))
  );
  const hardCoverFinishes = dedupe(
    [...paper.coverFinishes, ...hardCover.finishes].filter((value) => STANDARD_FINISH_OPTIONS.includes(value))
  );

  return {
    label: 'Book Printing',
    sourceSheets: ['Paper Book', 'Hard Cover Book ', 'Album', 'NoteBook'],
    workbookCompleteness: 'medium',
    detailSheet: {
      text: 'Download Full Spec Sheet (Excel)',
      href: '/spec-sheets/book-printing-spec-sheet.xlsx',
    },
    notes: ['Paper Book + Hard Cover Book sheets are combined into one book-printing rule set.'],
    specs: [
      {
        tab: 'Binding & Page Range',
        items: [
          ...paper.bindings,
          { label: 'Hard Cover / Smyth Sewn', value: 'Available for premium hardcover book construction' },
          { label: 'Notebook Formats', value: formatList(notebookBindings, 'Perfect bind, sewn bound, and hard cover notebook options') },
          { label: 'Album Formats', value: formatList(albumBindings, 'Perfect bind and Smyth sewn album options') },
        ],
      },
      {
        tab: 'Trim Sizes',
        items: [
          { label: 'Portrait Sizes', value: formatList(paper.portraitFinishSizes) },
          { label: 'Landscape Sizes', value: formatList(paper.landscapeFinishSizes) },
        ],
      },
      {
        tab: 'Cover Materials & Components',
        items: [
          { label: 'Cover Materials', value: formatList(hardCoverMaterials, 'Fabric, paper and jacket configurations available') },
          { label: 'Cover Color', value: formatList(hardCoverColors) },
          { label: 'Cover Finishing', value: formatList(hardCoverFinishes) },
          { label: 'Included Product Types', value: 'Paper books, hardcover books, notebooks, albums' },
        ],
      },
      {
        tab: 'Paper, Interior & Packing',
        items: [
          { label: 'Cover Paper', value: formatList(paper.coverPapers) },
          { label: 'Text Paper', value: formatList(paper.textPapers) },
          { label: 'Text Page Range', value: formatPageRange(paper.textPages) },
          { label: 'Packing', value: formatList(dedupe([...paper.packing, ...hardCover.packing])) },
        ],
      },
    ],
    quoteFields: [
      {
        id: 'bookType',
        label: 'Book Type',
        type: 'radio',
        options: ['Paper Book (Softcover)', 'Hard Cover Book', 'Notebook', 'Album'],
      },
      { id: 'binding', label: 'Binding', type: 'radio', options: bindingOptions },
      { id: 'trimSize', label: 'Trim Size', type: 'select', options: [...paper.portraitFinishSizes, ...paper.landscapeFinishSizes] },
      { id: 'pageCount', label: 'Page Count', type: 'number', placeholder: 'Enter page count' },
      { id: 'coverMaterial', label: 'Cover Material', type: 'select', options: hardCoverMaterials },
      { id: 'coverPaper', label: 'Cover Paper', type: 'select', options: paper.coverPapers },
      { id: 'textPaper', label: 'Text Paper', type: 'select', options: paper.textPapers },
      { id: 'color', label: 'Color', type: 'radio', options: hardCoverColors },
      { id: 'coverFinish', label: 'Cover Finish', type: 'select', options: hardCoverFinishes },
      { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
      { id: 'turnaround', label: 'Turnaround', type: 'select', options: ['Standard', 'Rush', 'Flexible'] },
    ],
  };
}

function createCalendarRules(deskCalRows, wallCalRows) {
  const desk = extractMultiPageSheet(deskCalRows);
  const wall = extractMultiPageSheet(wallCalRows);
  const bindings = dedupe([...desk.bindings.map((item) => item.label), ...wall.bindings.map((item) => item.label)]);
  const materials = dedupe([
    ...getUniqueColumnValues(deskCalRows, 4),
    ...getUniqueColumnValues(wallCalRows, 4),
  ]).filter((value) => !FIELD_GROUP_HEADERS.has(value));
  const colors = dedupe([...desk.coverColors, ...wall.coverColors].filter((value) => STANDARD_COLOR_OPTIONS.includes(value)));
  const finishes = dedupe([...desk.coverFinishes, ...wall.coverFinishes].filter((value) => STANDARD_FINISH_OPTIONS.includes(value)));
  const packing = dedupe([...desk.packing, ...wall.packing]);
  const textPages = dedupe([...desk.textPages, ...wall.textPages]);

  return {
    label: 'Calendar Printing',
    sourceSheets: ['Desk Cal', 'Wal Cal'],
    workbookCompleteness: 'medium',
    detailSheet: {
      text: 'Download Full Spec Sheet (Excel)',
      href: '/spec-sheets/calendar-printing-spec-sheet.xlsx',
    },
    notes: ['Desk and wall calendar rules are grouped into one public calendar-printing family.'],
    specs: [
      {
        tab: 'Calendar Types',
        items: [
          { label: 'Desk Calendars', value: 'Desk-standing seasonal calendar format' },
          { label: 'Wall Calendars', value: 'Wall-hanging seasonal calendar format' },
        ],
      },
      {
        tab: 'Binding, Materials & Pages',
        items: [
          { label: 'Binding', value: formatList(bindings, 'Wire-O binding') },
          { label: 'Basic Materials', value: formatList(materials, 'Fabric, paper, and cover materials available') },
          { label: 'Interior Page Options', value: formatList(textPages, 'Available by quote') },
        ],
      },
      {
        tab: 'Color, Finish & Packing',
        items: [
          { label: 'Cover Color', value: formatList(colors) },
          { label: 'Finishing', value: formatList(finishes) },
          { label: 'Packing', value: formatList(packing) },
        ],
      },
    ],
    quoteFields: [
      { id: 'calendarType', label: 'Calendar Type', type: 'radio', options: ['Desk Calendar', 'Wall Calendar'] },
      { id: 'binding', label: 'Binding', type: 'radio', options: bindings.length > 0 ? bindings : ['Wire-O-Bound'] },
      { id: 'material', label: 'Basic Material', type: 'select', options: materials },
      { id: 'coverColor', label: 'Cover Color', type: 'radio', options: colors },
      { id: 'finish', label: 'Finishing', type: 'select', options: finishes },
      { id: 'pageCount', label: 'Calendar Pages', type: 'select', options: textPages },
      { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
      { id: 'packing', label: 'Packing', type: 'select', options: packing },
      { id: 'turnaround', label: 'Turnaround', type: 'select', options: ['Standard', 'Rush', 'Flexible'] },
    ],
  };
}

function createMarketingPrintRules(flyerRows, brochureRows, posterRows, postcardRows) {
  const flyer = extractFlatSheet(flyerRows);
  const brochure = extractFlatSheet(brochureRows);
  const poster = extractFlatSheet(posterRows);
  const postcard = extractFlatSheet(postcardRows);

  const sizes = dedupe([...flyer.sizes, ...brochure.sizes, ...poster.sizes]);
  const foldTypes = dedupe([...flyer.foldingOrBinding, ...poster.foldingOrBinding]);
  const productTypes = ['Flyers', 'Brochures', 'Postcards', 'Posters'];
  const papers = dedupe([...flyer.papers, ...brochure.papers, ...poster.papers]);
  const colors = dedupe([...flyer.colors, ...brochure.colors, ...poster.colors, ...postcard.colors]);
  const finishes = dedupe([...flyer.finishes, ...brochure.finishes, ...poster.finishes, ...postcard.finishes]);

  return {
    label: 'Marketing Print',
    sourceSheets: ['Flyer', 'Brochures', 'Poster', 'Post Card'],
    workbookCompleteness: 'medium',
    detailSheet: {
      text: 'Download Full Spec Sheet (Excel)',
      href: '/spec-sheets/marketing-print-spec-sheet.xlsx',
    },
    notes: ['Marketing Print combines workbook rules across Flyer, Brochures, Poster, and Post Card.'],
    specs: [
      {
        tab: 'Product Types',
        items: [
          { label: 'Flyers', value: 'Single-sheet marketing pieces with multiple fold options' },
          { label: 'Brochures', value: 'Multi-panel or saddle-stitched print collateral' },
          { label: 'Posters', value: 'Large-format campaign and point-of-sale posters' },
          { label: 'Postcards', value: 'Card-weight direct mail and handout pieces' },
        ],
      },
      {
        tab: 'Sizes & Folds',
        items: [
          { label: 'Size Options', value: formatList(sizes) },
          { label: 'Fold / Binding', value: formatList(dedupe([...foldTypes, ...brochure.foldingOrBinding])) },
        ],
      },
      {
        tab: 'Paper, Color & Finishing',
        items: [
          { label: 'Paper', value: formatList(papers) },
          { label: 'Page / Sides', value: formatList(dedupe([...flyer.pages, ...poster.pages, ...brochure.pages, ...postcard.pages]), '1–2 sides and brochure formats') },
          { label: 'Color', value: formatList(colors) },
          { label: 'Finishing', value: formatList(finishes) },
        ],
      },
      {
        tab: 'Production Notes',
        items: [
          { label: 'Brochure Binding', value: formatList(brochure.foldingOrBinding, 'Saddle stitch available on brochure configurations') },
          { label: 'Poster Range', value: formatList(poster.sizes) },
          { label: 'Postcard Finishing', value: formatList(postcard.finishes, 'Available by quote') },
        ],
      },
    ],
    quoteFields: [
      { id: 'productType', label: 'Marketing Product Type', type: 'select', options: productTypes },
      { id: 'size', label: 'Size', type: 'select', options: sizes },
      { id: 'fold', label: 'Fold / Binding', type: 'select', options: dedupe([...foldTypes, ...brochure.foldingOrBinding]) },
      { id: 'paper', label: 'Paper', type: 'select', options: papers },
      { id: 'color', label: 'Color', type: 'radio', options: colors },
      { id: 'finish', label: 'Finishing', type: 'select', options: finishes },
      { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
      { id: 'turnaround', label: 'Turnaround', type: 'select', options: ['Standard', 'Rush', 'Flexible'] },
    ],
  };
}

function createMenuRules(rows) {
  const menu = extractFlatSheet(rows);
  return {
    label: 'Menu Printing',
    sourceSheets: ['Menu'],
    workbookCompleteness: 'high',
    detailSheet: {
      text: 'Download Full Spec Sheet (Excel)',
      href: '/spec-sheets/menu-printing-spec-sheet.xlsx',
    },
    notes: ['Menu printing rules come directly from the Menu workbook tab.'],
    specs: [
      {
        tab: 'Sizes & Folds',
        items: [
          { label: 'Flat Sizes', value: formatList(menu.sizes) },
          { label: 'Fold Styles', value: formatList(menu.foldingOrBinding) },
        ],
      },
      {
        tab: 'Paper & Page Counts',
        items: [
          { label: 'Paper', value: formatList(menu.papers) },
          { label: 'Page Counts', value: formatList(menu.pages) },
          { label: 'Color Modes', value: formatList(menu.colors) },
        ],
      },
      {
        tab: 'Finishing',
        items: [
          { label: 'Finishing Options', value: formatList(menu.finishes) },
        ],
      },
    ],
    quoteFields: [
      { id: 'style', label: 'Menu Fold / Style', type: 'radio', options: menu.foldingOrBinding },
      { id: 'size', label: 'Flat Size', type: 'select', options: menu.sizes },
      { id: 'pageCount', label: 'Page Count', type: 'select', options: menu.pages },
      { id: 'paper', label: 'Paper', type: 'select', options: menu.papers },
      { id: 'color', label: 'Color', type: 'radio', options: menu.colors },
      { id: 'lamination', label: 'Finishing', type: 'select', options: menu.finishes },
      { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
      { id: 'turnaround', label: 'Turnaround', type: 'select', options: ['Standard', 'Rush', 'Flexible'] },
    ],
  };
}

function createBusinessCardRules(rows, baseFields) {
  const business = extractFlatSheet(rows);
  const baseFieldMap = new Map(baseFields.map((field) => [field.id, field]));
  const stockField = baseFieldMap.get('stock');
  const quantityField = baseFieldMap.get('quantity');
  const sidesField = baseFieldMap.get('sides');
  return {
    label: 'Business Cards',
    sourceSheets: ['Business Card'],
    workbookCompleteness: 'partial',
    detailSheet: {
      text: 'Download Full Spec Sheet (Excel)',
      href: '/spec-sheets/business-cards-spec-sheet.xlsx',
    },
    notes: [
      'Business Card workbook tab provides reliable color, page, and finishing data.',
      'Stock and quantity remain preserved from existing quote configuration because workbook cells are incomplete for those fields.',
    ],
    specs: [
      {
        tab: 'Sides & Color',
        items: [
          { label: 'Page / Sides', value: formatList(business.pages, '1 or 2 sides') },
          { label: 'Color Modes', value: formatList(business.colors) },
        ],
      },
      {
        tab: 'Finishing',
        items: [
          { label: 'Finishing Options', value: formatList(business.finishes) },
        ],
      },
      {
        tab: 'Ordering Notes',
        items: [
          { label: 'Stock', value: formatList(stockField?.options || [], 'Confirm with sales') },
          { label: 'Quantities', value: formatList(quantityField?.options || [], 'Enter quantity') },
        ],
      },
    ],
    quoteFields: [
      quantityField || { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
      stockField || { id: 'stock', label: 'Paper Stock', type: 'text', placeholder: 'Confirm stock requirement' },
      { id: 'page', label: 'Page / Sides', type: 'radio', options: business.pages.length > 0 ? business.pages : ['1', '2'] },
      { id: 'color', label: 'Color', type: 'radio', options: business.colors },
      { id: 'finish', label: 'Finish', type: 'select', options: business.finishes },
      sidesField || { id: 'sides', label: 'Sides', type: 'radio', options: ['Single-sided', 'Double-sided'] },
      { id: 'turnaround', label: 'Turnaround', type: 'radio', options: ['Standard (3–5 days)', 'Rush (2–3 days)'] },
    ],
  };
}

function createRulesInventory(workbook, baseQuoteConfig) {
  const magazineRows = readSheetRows(workbook, 'Magazine');
  const paperBookRows = readSheetRows(workbook, 'Paper Book');
  const hardCoverRows = readSheetRows(workbook, 'Hard Cover Book ');
  const albumRows = readSheetRows(workbook, 'Album');
  const noteBookRows = readSheetRows(workbook, 'NoteBook');
  const deskCalRows = readSheetRows(workbook, 'Desk Cal');
  const wallCalRows = readSheetRows(workbook, 'Wal Cal');
  const flyerRows = readSheetRows(workbook, 'Flyer');
  const brochureRows = readSheetRows(workbook, 'Brochures');
  const posterRows = readSheetRows(workbook, 'Poster');
  const postcardRows = readSheetRows(workbook, 'Post Card');
  const menuRows = readSheetRows(workbook, 'Menu');
  const businessCardRows = readSheetRows(workbook, 'Business Card');

  return {
    generatedAt: new Date().toISOString(),
    workbookFile: 'document/Epoch-press website.xlsx',
    products: {
      'magazine-printing': createMagazineProductRules(magazineRows),
      'book-printing': createBookProductRules(
        paperBookRows,
        hardCoverRows,
        albumRows,
        noteBookRows
      ),
      'calendar-printing': createCalendarRules(deskCalRows, wallCalRows),
      'marketing-print': createMarketingPrintRules(flyerRows, brochureRows, posterRows, postcardRows),
      'menu-printing': createMenuRules(menuRows),
      'business-cards': createBusinessCardRules(
        businessCardRows,
        baseQuoteConfig.products['business-cards']?.fields || []
      ),
    },
  };
}

async function writeJson(filePath, data) {
  await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
  await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function readJson(filePath) {
  return JSON.parse(await fsPromises.readFile(filePath, 'utf8'));
}

function buildDefaultProductPage(slug, productRules) {
  return {
    name: productRules.label,
    slug,
    tagline:
      slug === 'calendar-printing'
        ? 'Custom calendar printing for branded desk and wall formats.'
        : `Professional ${productRules.label.toLowerCase()} services tailored to your specifications.`,
    description:
      slug === 'calendar-printing'
        ? 'Desk calendars and wall calendars produced with workbook-backed binding, finishing, and seasonal page options.'
        : `Workbook-backed ${productRules.label.toLowerCase()} specifications with customer-friendly production guidance.`,
    specs: productRules.specs,
    priceTiers: [
      { qty: 'Small Run', note: 'Quote based on specs and finishing requirements' },
      { qty: 'Standard Run', note: 'Best value for routine production' },
      { qty: 'Large Run', note: 'Volume pricing available' },
    ],
    process: [
      { step: 1, title: 'Share Your Specs', desc: 'Tell us the format, quantity, and finishing details you need.' },
      { step: 2, title: 'Review Proofs', desc: 'We prepare and confirm the production setup before printing.' },
      { step: 3, title: 'Produce & Deliver', desc: 'Your project is printed, finished, packed, and delivered.' },
    ],
    faq: [
      {
        q: `What options are available for ${productRules.label.toLowerCase()}?`,
        a: 'See the workbook-backed specification tables and contact us for exact configuration guidance.',
      },
      {
        q: 'Can I request a custom quote?',
        a: 'Yes. Use the quote form and our team will confirm the right production path for your project.',
      },
    ],
    cta: {
      headline: `Ready to plan your ${productRules.label.toLowerCase()} project?`,
      primaryCta: { href: `/quote?product=${slug}`, text: 'Get a Quote' },
      secondaryCta: { href: 'tel:+12125550100', text: 'Call Us' },
    },
    detailSheet: productRules.detailSheet,
    rulesNotes: productRules.notes,
  };
}

async function updateProductPageJson(filePath, productRules) {
  let current;
  try {
    current = await readJson(filePath);
  } catch {
    current = buildDefaultProductPage(path.basename(filePath, '.json'), productRules);
  }
  current.specs = productRules.specs;
  current.detailSheet = productRules.detailSheet;
  current.rulesNotes = productRules.notes;
  await writeJson(filePath, current);
}

function mergeQuoteConfig(baseQuoteConfig, rulesInventory) {
  const next = JSON.parse(JSON.stringify(baseQuoteConfig));
  for (const [slug, productRules] of Object.entries(rulesInventory.products)) {
    if (!next.products[slug]) {
      next.products[slug] = { label: productRules.label, fields: productRules.quoteFields };
      continue;
    }
    next.products[slug].label = productRules.label;
    next.products[slug].fields = productRules.quoteFields;
  }
  return next;
}

function writePdf(filePath, productRules) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(22).text(productRules.label);
    doc.moveDown(0.4);
    doc.fontSize(10).fillColor('#555555').text(`Source sheets: ${productRules.sourceSheets.join(', ')}`);
    doc.text(`Workbook completeness: ${productRules.workbookCompleteness}`);
    doc.moveDown(1);

    for (const section of productRules.specs) {
      doc.fillColor('#111111').fontSize(15).text(section.tab);
      doc.moveDown(0.4);
      for (const item of section.items) {
        doc.fontSize(10).fillColor('#111111').text(`${item.label}: `, { continued: true });
        doc.fillColor('#555555').text(item.value);
      }
      doc.moveDown(0.8);
    }

    if (Array.isArray(productRules.notes) && productRules.notes.length > 0) {
      doc.fillColor('#111111').fontSize(13).text('Notes');
      doc.moveDown(0.3);
      for (const note of productRules.notes) {
        doc.fontSize(10).fillColor('#555555').text(`• ${note}`);
      }
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function writeStyledWorkbook(filePath, productRules) {
  await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Cursor';
  workbook.created = new Date();
  const sheet = workbook.addWorksheet('Spec Sheet', {
    views: [{ state: 'frozen', ySplit: 3 }],
    properties: { defaultRowHeight: 22 },
  });

  sheet.columns = [
    { width: 28 },
    { width: 82 },
  ];

  sheet.mergeCells('A1:B1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = productRules.label;
  titleCell.font = { name: 'Aptos Display', size: 20, bold: true, color: { argb: 'FF0F1B2D' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F4EC' } };
  sheet.getRow(1).height = 30;

  sheet.mergeCells('A2:B2');
  const metaCell = sheet.getCell('A2');
  metaCell.value = `Source sheets: ${productRules.sourceSheets.join(', ')} | Workbook completeness: ${productRules.workbookCompleteness}`;
  metaCell.font = { size: 11, color: { argb: 'FF5A6977' } };
  metaCell.alignment = { wrapText: true };
  sheet.getRow(2).height = 22;

  let rowIndex = 4;

  for (const section of productRules.specs) {
    sheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
    const sectionCell = sheet.getCell(`A${rowIndex}`);
    sectionCell.value = section.tab;
    sectionCell.font = { size: 14, bold: true, color: { argb: 'FF0F1B2D' } };
    sectionCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF4F8' } };
    sectionCell.border = {
      top: { style: 'thin', color: { argb: 'FFD7DEE5' } },
      left: { style: 'thin', color: { argb: 'FFD7DEE5' } },
      bottom: { style: 'thin', color: { argb: 'FFD7DEE5' } },
      right: { style: 'thin', color: { argb: 'FFD7DEE5' } },
    };
    rowIndex += 1;

    for (const item of section.items) {
      const labelCell = sheet.getCell(`A${rowIndex}`);
      const valueCell = sheet.getCell(`B${rowIndex}`);
      labelCell.value = item.label;
      valueCell.value = item.value;

      labelCell.font = { bold: true, color: { argb: 'FF1A1A2E' } };
      valueCell.font = { color: { argb: 'FF1A1A2E' } };
      labelCell.alignment = { vertical: 'top', wrapText: true };
      valueCell.alignment = { vertical: 'top', wrapText: true };

      for (const cell of [labelCell, valueCell]) {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
      }
      if (rowIndex % 2 === 0) {
        labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAFBFC' } };
        valueCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAFBFC' } };
      }
      rowIndex += 1;
    }

    rowIndex += 1;
  }

  if (Array.isArray(productRules.notes) && productRules.notes.length > 0) {
    sheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
    const notesHeader = sheet.getCell(`A${rowIndex}`);
    notesHeader.value = 'Notes';
    notesHeader.font = { size: 14, bold: true, color: { argb: 'FF0F1B2D' } };
    notesHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F4EC' } };
    rowIndex += 1;
    for (const note of productRules.notes) {
      sheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
      const noteCell = sheet.getCell(`A${rowIndex}`);
      noteCell.value = `• ${note}`;
      noteCell.alignment = { wrapText: true };
      noteCell.font = { size: 11, color: { argb: 'FF5A6977' } };
      rowIndex += 1;
    }
  }

  await workbook.xlsx.writeFile(filePath);
}

async function main() {
  const workbook = xlsx.readFile(WORKBOOK_PATH);
  const baseQuoteConfig = await readJson(QUOTE_CONFIG_PATH);
  const rulesInventory = createRulesInventory(workbook, baseQuoteConfig);

  await writeJson(RULES_PATH, rulesInventory);

  for (const [slug, productRules] of Object.entries(rulesInventory.products)) {
    await updateProductPageJson(path.join(CONTENT_PAGE_DIR, `${slug}.json`), productRules);
    await updateProductPageJson(path.join(FALLBACK_PAGE_DIR, `${slug}.json`), productRules);
    const xlsxFilename = path.basename(productRules.detailSheet.href);
    await writeStyledWorkbook(path.join(PDF_DIR, xlsxFilename), productRules);
    await writePdf(path.join(PDF_DIR, xlsxFilename.replace(/\.xlsx$/i, '.pdf')), productRules);
  }

  const mergedQuoteConfig = mergeQuoteConfig(baseQuoteConfig, rulesInventory);
  await writeJson(QUOTE_CONFIG_PATH, mergedQuoteConfig);
  await writeJson(CONTENT_QUOTE_CONFIG_PATH, mergedQuoteConfig);

  console.log(`Wrote rules inventory to ${path.relative(ROOT, RULES_PATH)}`);
  console.log(`Updated product JSON files for ${Object.keys(rulesInventory.products).join(', ')}`);
  console.log(`Updated quote config and generated PDF spec sheets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
