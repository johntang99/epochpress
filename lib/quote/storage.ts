import fs from 'fs/promises';
import path from 'path';
import type { QuoteSettings } from '@/lib/types';
import {
  canUseQuoteDb,
  loadQuoteSettingsDb,
  saveQuoteSettingsDb,
} from '@/lib/quote/db';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function parseCommaSeparated(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseFromAddress(value: string): { fromName: string; fromEmail: string } {
  const trimmed = value.trim();
  const angleMatch = trimmed.match(/^(.*)<([^>]+)>$/);
  if (angleMatch) {
    return {
      fromName: angleMatch[1].trim().replace(/^"|"$/g, ''),
      fromEmail: angleMatch[2].trim(),
    };
  }
  if (trimmed.includes('@')) {
    return { fromName: '', fromEmail: trimmed };
  }
  return { fromName: trimmed, fromEmail: '' };
}

function getRuntimeDefaults(): QuoteSettings {
  const fallbackRecipients = parseCommaSeparated(
    process.env.QUOTE_NOTIFICATION_TO ||
      process.env.CONTACT_FALLBACK_TO ||
      'info@epochpress.com'
  );
  const fromRaw = process.env.RESEND_FROM || 'Epoch Press <no-reply@epochpress.com>';
  const { fromName, fromEmail } = parseFromAddress(fromRaw);

  return {
    notificationEmails: fallbackRecipients,
    ccEmails: [],
    bccEmails: [],
    fromName: fromName || 'Epoch Press',
    fromEmail: fromEmail || 'no-reply@epochpress.com',
    replyToEmail: '',
    autoReplyEnabled: true,
    autoReplySubject: 'Quote Request Received — {{product}} | Epoch Press',
    autoReplyIntro:
      "Thank you for requesting a quote. We've received your project details and our team will review them carefully.",
    autoReplyResponseHours: 24,
    adminSubjectPrefix: '',
    defaultQuoteStatus: 'new',
    quoteValidityDays: 14,
    internalOwnerName: '',
  };
}

function getQuoteRoot(siteId: string) {
  return path.join(CONTENT_DIR, siteId, 'quote');
}

function getQuoteSettingsPath(siteId: string) {
  return path.join(getQuoteRoot(siteId), 'settings.json');
}

function normalizeQuoteSettings(settings: QuoteSettings | null | undefined): QuoteSettings {
  const defaults = getRuntimeDefaults();
  const normalizeList = (list: unknown) =>
    Array.isArray(list)
      ? list.map((entry) => String(entry).trim()).filter(Boolean)
      : [];
  const safeStatus =
    settings?.defaultQuoteStatus === 'reviewing' || settings?.defaultQuoteStatus === 'quoted'
      ? settings.defaultQuoteStatus
      : 'new';

  return {
    notificationEmails: (() => {
      const list = normalizeList(settings?.notificationEmails);
      return list.length > 0 ? list : defaults.notificationEmails || [];
    })(),
    ccEmails: normalizeList(settings?.ccEmails),
    bccEmails: normalizeList(settings?.bccEmails),
    fromName: String(settings?.fromName || defaults.fromName || '').trim(),
    fromEmail: String(settings?.fromEmail || defaults.fromEmail || '').trim(),
    replyToEmail: String(settings?.replyToEmail || '').trim(),
    autoReplyEnabled: settings?.autoReplyEnabled !== false,
    autoReplySubject: String(
      settings?.autoReplySubject || defaults.autoReplySubject
    ).trim(),
    autoReplyIntro: String(
      settings?.autoReplyIntro || defaults.autoReplyIntro
    ).trim(),
    autoReplyResponseHours:
      Number.isFinite(settings?.autoReplyResponseHours) && Number(settings?.autoReplyResponseHours) > 0
        ? Number(settings?.autoReplyResponseHours)
        : Number(defaults.autoReplyResponseHours),
    adminSubjectPrefix: String(settings?.adminSubjectPrefix || '').trim(),
    defaultQuoteStatus: safeStatus,
    quoteValidityDays:
      Number.isFinite(settings?.quoteValidityDays) && Number(settings?.quoteValidityDays) > 0
        ? Number(settings?.quoteValidityDays)
        : Number(defaults.quoteValidityDays),
    internalOwnerName: String(settings?.internalOwnerName || '').trim(),
  };
}

async function readQuoteSettingsFile(siteId: string): Promise<QuoteSettings> {
  try {
    const filePath = getQuoteSettingsPath(siteId);
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as QuoteSettings;
    return normalizeQuoteSettings(parsed);
  } catch {
    return normalizeQuoteSettings(null);
  }
}

async function writeQuoteSettingsFile(siteId: string, settings: QuoteSettings) {
  const filePath = getQuoteSettingsPath(siteId);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(settings, null, 2));
}

export async function loadQuoteSettings(siteId: string): Promise<QuoteSettings> {
  if (canUseQuoteDb()) {
    const settings = await loadQuoteSettingsDb(siteId);
    if (settings) return normalizeQuoteSettings(settings);
  }

  return readQuoteSettingsFile(siteId);
}

export async function saveQuoteSettings(siteId: string, settings: QuoteSettings) {
  const normalized = normalizeQuoteSettings(settings);

  if (canUseQuoteDb()) {
    const saved = await saveQuoteSettingsDb(siteId, normalized);
    if (saved) return;
  }

  await writeQuoteSettingsFile(siteId, normalized);
}

export const DEFAULT_QUOTE_SETTINGS = getRuntimeDefaults();
