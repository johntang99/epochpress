export type PublicProductStrategy = 'standalone' | 'grouped';

export interface PublicProductCatalogItem {
  id: string;
  slug: string;
  label: string;
  icon: string;
  desc: string;
  publicStrategy: PublicProductStrategy;
  workbookSheets: string[];
  includedSubtypes: string[];
  quoteSubtypeFieldId?: string;
  quoteSubtypePrompt?: string;
}

export const PUBLIC_PRODUCT_CATALOG: PublicProductCatalogItem[] = [
  {
    id: 'newspaper-printing',
    slug: 'newspaper-printing',
    label: 'Newspapers',
    icon: '📰',
    desc: 'Broadsheet, tabloid, inserts',
    publicStrategy: 'standalone',
    workbookSheets: [],
    includedSubtypes: ['Broadsheet', 'Tabloid', 'Inserts'],
  },
  {
    id: 'magazine-printing',
    slug: 'magazine-printing',
    label: 'Magazines',
    icon: '📖',
    desc: 'Magazines, catalogues, saddle stitch, perfect bind',
    publicStrategy: 'standalone',
    workbookSheets: ['Magazine', 'Catalogue'],
    includedSubtypes: ['Magazines', 'Catalogues'],
  },
  {
    id: 'book-printing',
    slug: 'book-printing',
    label: 'Books',
    icon: '📚',
    desc: 'Paper books, hardcover books, notebooks, albums',
    publicStrategy: 'grouped',
    workbookSheets: ['Paper Book', 'Hard Cover Book ', 'NoteBook', 'Album'],
    includedSubtypes: ['Paper Books', 'Hardcover Books', 'Notebooks', 'Albums'],
    quoteSubtypeFieldId: 'bookType',
    quoteSubtypePrompt: 'Choose whether your project is a paper book, hardcover book, notebook, or album before selecting production options.',
  },
  {
    id: 'calendar-printing',
    slug: 'calendar-printing',
    label: 'Calendars',
    icon: '🗓️',
    desc: 'Desk calendars and wall calendars',
    publicStrategy: 'grouped',
    workbookSheets: ['Desk Cal', 'Wal Cal'],
    includedSubtypes: ['Desk Calendars', 'Wall Calendars'],
    quoteSubtypeFieldId: 'calendarType',
    quoteSubtypePrompt: 'Choose whether you need a desk calendar or a wall calendar before selecting finishes and page options.',
  },
  {
    id: 'marketing-print',
    slug: 'marketing-print',
    label: 'Marketing Print',
    icon: '📄',
    desc: 'Flyers, brochures, posters, postcards',
    publicStrategy: 'grouped',
    workbookSheets: ['Flyer', 'Brochures', 'Poster', 'Post Card'],
    includedSubtypes: ['Flyers', 'Brochures', 'Posters', 'Postcards'],
    quoteSubtypeFieldId: 'productType',
    quoteSubtypePrompt: 'Choose the collateral format first so we can show the right paper, size, and finishing rules.',
  },
  {
    id: 'menu-printing',
    slug: 'menu-printing',
    label: 'Menus',
    icon: '🍽️',
    desc: 'Dine-in, takeout, folded menus',
    publicStrategy: 'standalone',
    workbookSheets: ['Menu'],
    includedSubtypes: ['Unfolded Menus', 'Folded Menus'],
  },
  {
    id: 'business-cards',
    slug: 'business-cards',
    label: 'Business Cards',
    icon: '💳',
    desc: 'Standard, premium, luxury finishes',
    publicStrategy: 'standalone',
    workbookSheets: ['Business Card'],
    includedSubtypes: ['Standard', 'Premium', 'Luxury'],
  },
  {
    id: 'large-format',
    slug: 'large-format',
    label: 'Large Format',
    icon: '🖼️',
    desc: 'Banners, signage, displays',
    publicStrategy: 'standalone',
    workbookSheets: [],
    includedSubtypes: ['Banners', 'Signage', 'Displays'],
  },
  {
    id: 'other',
    slug: 'other',
    label: 'Other / Not Sure',
    icon: '❓',
    desc: 'Tell us about your project',
    publicStrategy: 'standalone',
    workbookSheets: [],
    includedSubtypes: [],
  },
];

export const PUBLIC_PRODUCT_CATALOG_BY_ID = Object.fromEntries(
  PUBLIC_PRODUCT_CATALOG.map((item) => [item.id, item])
) as Record<string, PublicProductCatalogItem>;
