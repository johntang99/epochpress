'use client';

import { useEffect, useState } from 'react';
import type { QuoteSettings, SiteConfig } from '@/lib/types';
import { Button } from '@/components/ui';

interface QuoteSettingsManagerProps {
  sites: SiteConfig[];
  selectedSiteId: string;
}

const DEFAULT_SETTINGS: QuoteSettings = {
  notificationEmails: [],
  ccEmails: [],
  bccEmails: [],
  fromName: '',
  fromEmail: '',
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

const STATUS_OPTIONS: Array<{ value: 'new' | 'reviewing' | 'quoted'; label: string }> = [
  { value: 'new', label: 'new' },
  { value: 'reviewing', label: 'reviewing' },
  { value: 'quoted', label: 'quoted' },
];

function normalizeSettings(input: QuoteSettings | null | undefined): QuoteSettings {
  const normalizeList = (list: unknown) =>
    Array.isArray(list)
      ? list.map((entry) => String(entry).trim()).filter(Boolean)
      : [];
  const defaultStatus =
    input?.defaultQuoteStatus === 'reviewing' || input?.defaultQuoteStatus === 'quoted'
      ? input.defaultQuoteStatus
      : 'new';

  return {
    notificationEmails: normalizeList(input?.notificationEmails),
    ccEmails: normalizeList(input?.ccEmails),
    bccEmails: normalizeList(input?.bccEmails),
    fromName: String(input?.fromName || '').trim(),
    fromEmail: String(input?.fromEmail || '').trim(),
    replyToEmail: String(input?.replyToEmail || '').trim(),
    autoReplyEnabled: input?.autoReplyEnabled !== false,
    autoReplySubject:
      String(input?.autoReplySubject || DEFAULT_SETTINGS.autoReplySubject).trim(),
    autoReplyIntro: String(input?.autoReplyIntro || DEFAULT_SETTINGS.autoReplyIntro).trim(),
    autoReplyResponseHours:
      Number.isFinite(input?.autoReplyResponseHours) && Number(input?.autoReplyResponseHours) > 0
        ? Number(input?.autoReplyResponseHours)
        : Number(DEFAULT_SETTINGS.autoReplyResponseHours),
    adminSubjectPrefix: String(input?.adminSubjectPrefix || '').trim(),
    defaultQuoteStatus: defaultStatus,
    quoteValidityDays:
      Number.isFinite(input?.quoteValidityDays) && Number(input?.quoteValidityDays) > 0
        ? Number(input?.quoteValidityDays)
        : Number(DEFAULT_SETTINGS.quoteValidityDays),
    internalOwnerName: String(input?.internalOwnerName || '').trim(),
  };
}

function parseCommaSeparated(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function QuoteSettingsManager({
  sites,
  selectedSiteId,
}: QuoteSettingsManagerProps) {
  const [siteId, setSiteId] = useState(selectedSiteId);
  const [settings, setSettings] = useState<QuoteSettings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSettings = async () => {
    if (!siteId) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/admin/quote/settings?siteId=${siteId}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to load quote settings');
      }
      setSettings(normalizeSettings(payload.settings));
    } catch (error: any) {
      setStatus(error.message || 'Failed to load quote settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [siteId]);

  const saveSettings = async () => {
    if (!siteId) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/quote/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, settings }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to save quote settings');
      }
      setStatus('Saved');
    } catch (error: any) {
      setStatus(error.message || 'Failed to save quote settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quote Settings</h1>
          <p className="text-sm text-gray-600">
            Configure who receives quote request emails.
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Site</label>
          <select
            className="mt-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={siteId}
            onChange={(event) => setSiteId(event.target.value)}
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {status}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="text-sm font-semibold text-gray-900">Notification Routing</div>

            <div>
              <label className="block text-xs text-gray-500">
                Primary Recipients (To, comma separated)
              </label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={(settings.notificationEmails || []).join(', ')}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    notificationEmails: parseCommaSeparated(event.target.value),
                  }))
                }
                placeholder="sales@example.com, ops@example.com"
              />
              <p className="mt-2 text-xs text-gray-500">
                Leave empty to use environment fallback (`QUOTE_NOTIFICATION_TO`, then
                `CONTACT_FALLBACK_TO`).
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500">
                  CC Recipients (comma separated)
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={(settings.ccEmails || []).join(', ')}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      ccEmails: parseCommaSeparated(event.target.value),
                    }))
                  }
                  placeholder="manager@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">
                  BCC Recipients (comma separated)
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={(settings.bccEmails || []).join(', ')}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      bccEmails: parseCommaSeparated(event.target.value),
                    }))
                  }
                  placeholder="audit@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500">
                Reply-To Email (optional override)
              </label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={settings.replyToEmail || ''}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    replyToEmail: event.target.value.trim(),
                  }))
                }
                placeholder="If empty, customer email will be used"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="text-sm font-semibold text-gray-900">Sender & Subject</div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500">
                  From Display Name (optional)
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={settings.fromName || ''}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      fromName: event.target.value,
                    }))
                  }
                  placeholder="Epoch Press Team"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">
                  From Email (optional)
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={settings.fromEmail || ''}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      fromEmail: event.target.value.trim(),
                    }))
                  }
                  placeholder="no-reply@yourdomain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500">
                Admin Subject Prefix (optional)
              </label>
              <input
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={settings.adminSubjectPrefix || ''}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    adminSubjectPrefix: event.target.value,
                  }))
                }
                placeholder="[EpochPress]"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="text-sm font-semibold text-gray-900">
              Customer Auto-Reply
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={settings.autoReplyEnabled !== false}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    autoReplyEnabled: event.target.checked,
                  }))
                }
              />
              Enable auto-reply email to customer
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500">
                  Auto-Reply Subject (supports `{'{{product}}'}`, `{'{{name}}'}`)
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={settings.autoReplySubject || ''}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      autoReplySubject: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">
                  Response SLA (hours)
                </label>
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={settings.autoReplyResponseHours ?? 24}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      autoReplyResponseHours: Number(event.target.value || 24),
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500">
                Auto-Reply Intro (supports `{'{{product}}'}`, `{'{{name}}'}`)
              </label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={settings.autoReplyIntro || ''}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    autoReplyIntro: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="text-sm font-semibold text-gray-900">Workflow Defaults</div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-xs text-gray-500">Default New Quote Status</label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={settings.defaultQuoteStatus || 'new'}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      defaultQuoteStatus: event.target.value as
                        | 'new'
                        | 'reviewing'
                        | 'quoted',
                    }))
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500">Default Quote Validity (days)</label>
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={settings.quoteValidityDays ?? 14}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      quoteValidityDays: Number(event.target.value || 14),
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500">Default Internal Owner</label>
                <input
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  value={settings.internalOwnerName || ''}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      internalOwnerName: event.target.value,
                    }))
                  }
                  placeholder="Sales Team"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-600 space-y-2">
            <p>
              Changes apply to the quote form at <code>/quote</code> for the selected site.
            </p>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Effective To</p>
              <p className="text-sm text-gray-700">
                {(settings.notificationEmails || []).length > 0
                  ? (settings.notificationEmails || []).join(', ')
                  : 'ENV fallback (QUOTE_NOTIFICATION_TO / CONTACT_FALLBACK_TO)'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Default status</p>
              <p className="text-sm text-gray-700">{settings.defaultQuoteStatus || 'new'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Auto-reply</p>
              <p className="text-sm text-gray-700">
                {settings.autoReplyEnabled !== false
                  ? `Enabled (${settings.autoReplyResponseHours || 24} hours)`
                  : 'Disabled'}
              </p>
            </div>
          </div>
          <Button type="button" onClick={saveSettings} disabled={loading}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
