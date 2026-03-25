'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Mail, Phone, Building, FileText, Clock, DollarSign, MessageSquare } from 'lucide-react';

interface Quote {
  id: string;
  site_id: string;
  product: string;
  specs: Record<string, string>;
  files: Array<{ name: string; size: number }>;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  quoted_amount: string | null;
  created_at: string;
  updated_at: string;
}

interface SiteConfig {
  id: string;
  name: string;
}

const STATUS_OPTIONS = ['new', 'reviewing', 'quoted', 'accepted', 'declined', 'completed'];
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

export function QuotesManager({ sites, selectedSiteId }: { sites: SiteConfig[]; selectedSiteId: string }) {
  const [siteId, setSiteId] = useState(selectedSiteId);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ siteId });
      if (filterStatus !== 'all') params.set('status', filterStatus);
      const res = await fetch(`/api/admin/quotes?${params}`);
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch (err) {
      console.error('Failed to load quotes:', err);
    } finally {
      setLoading(false);
    }
  }, [siteId, filterStatus]);

  useEffect(() => { loadQuotes(); }, [loadQuotes]);

  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    await fetch('/api/admin/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    loadQuotes();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const stats = {
    total: quotes.length,
    new: quotes.filter((q) => q.status === 'new').length,
    reviewing: quotes.filter((q) => q.status === 'reviewing').length,
    quoted: quotes.filter((q) => q.status === 'quoted').length,
    accepted: quotes.filter((q) => q.status === 'accepted').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-sm text-gray-500">Manage quote requests from customers</p>
        </div>
        <button onClick={loadQuotes} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-50' },
          { label: 'New', value: stats.new, color: 'bg-blue-50' },
          { label: 'Reviewing', value: stats.reviewing, color: 'bg-yellow-50' },
          { label: 'Quoted', value: stats.quoted, color: 'bg-purple-50' },
          { label: 'Accepted', value: stats.accepted, color: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-lg p-4 text-center`}>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Filter:</span>
        {['all', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterStatus === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Quote List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading quotes...</div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No quotes found</div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => {
            const expanded = expandedId === quote.id;
            return (
              <div key={quote.id} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                {/* Summary Row */}
                <button
                  onClick={() => setExpandedId(expanded ? null : quote.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[quote.status] || 'bg-gray-100'}`}>
                      {quote.status}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {quote.name}{quote.company ? ` — ${quote.company}` : ''}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {quote.product} • {formatDate(quote.created_at)}
                      </div>
                    </div>
                  </div>
                  {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {/* Detail Panel */}
                {expanded && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Contact Info */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Contact</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> <a href={`mailto:${quote.email}`} className="text-blue-600 hover:underline">{quote.email}</a></div>
                          {quote.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {quote.phone}</div>}
                          {quote.company && <div className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-400" /> {quote.company}</div>}
                        </div>

                        {quote.message && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-700 text-xs uppercase mb-1">Message</h4>
                            <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">{quote.message}</p>
                          </div>
                        )}

                        {quote.files && (quote.files as Array<{ name: string; size: number }>).length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-700 text-xs uppercase mb-1">Files</h4>
                            <ul className="text-sm space-y-1">
                              {(quote.files as Array<{ name: string; size: number }>).map((f, i) => (
                                <li key={i} className="flex items-center gap-2"><FileText className="w-3 h-3 text-gray-400" /> {f.name} ({(f.size / 1024).toFixed(0)} KB)</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Specs + Actions */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Specifications</h3>
                        {Object.keys(quote.specs).length > 0 ? (
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {Object.entries(quote.specs).map(([k, v], i) => (
                              <div key={k} className={`flex justify-between px-3 py-2 text-sm ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                                <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="text-gray-900 font-medium">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No specifications provided</p>
                        )}

                        {/* Status Update */}
                        <div className="mt-6 space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                            <select
                              value={quote.status}
                              onChange={(e) => updateQuote(quote.id, { status: e.target.value } as Partial<Quote>)}
                              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1"><DollarSign className="w-3 h-3" /> Quoted Amount</label>
                            <input
                              type="text"
                              placeholder="e.g., $2,500"
                              defaultValue={quote.quoted_amount || ''}
                              onBlur={(e) => updateQuote(quote.id, { quoted_amount: e.target.value } as Partial<Quote>)}
                              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Internal Notes</label>
                            <textarea
                              rows={2}
                              placeholder="Add internal notes..."
                              defaultValue={quote.notes || ''}
                              onBlur={(e) => updateQuote(quote.id, { notes: e.target.value } as Partial<Quote>)}
                              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Received {formatDate(quote.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
