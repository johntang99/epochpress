'use client';

import { useEffect, useMemo, useState } from 'react';

interface ImagePickerModalProps {
  open: boolean;
  siteId: string;
  onClose: () => void;
  onSelect: (url: string) => void;
}

interface MediaItem {
  id: string;
  url: string;
  path: string;
}

interface ProviderItem {
  id: string;
  provider: 'unsplash' | 'pexels';
  thumbUrl: string;
  fullUrl: string;
  creditName: string;
  creditLink: string;
  alt: string;
}

type PickerTab = 'library' | 'upload' | 'unsplash' | 'pexels';

export function ImagePickerModal({ open, siteId, onClose, onSelect }: ImagePickerModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState('');
  const [folder, setFolder] = useState('all');
  const [uploadFolder, setUploadFolder] = useState('general');
  const [providerQuery, setProviderQuery] = useState('');
  const [providerResults, setProviderResults] = useState<ProviderItem[]>([]);
  const [tab, setTab] = useState<PickerTab>('library');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchingProvider, setSearchingProvider] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadLibrary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/media/list?siteId=${siteId}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Failed to load media');
      setItems(payload.items || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void loadLibrary();
  }, [open, siteId]);

  const folders = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      const [first] = item.path.split('/');
      if (first) set.add(first);
    }
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery = !lower || item.path.toLowerCase().includes(lower);
      const firstFolder = item.path.split('/')[0] || '';
      const matchesFolder = folder === 'all' || firstFolder === folder;
      return matchesQuery && matchesFolder;
    });
  }, [items, query, folder]);

  const searchProvider = async (provider: 'unsplash' | 'pexels') => {
    if (!providerQuery.trim()) return;
    setSearchingProvider(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/media/provider/search?provider=${provider}&query=${encodeURIComponent(
          providerQuery
        )}&perPage=24`
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Provider search failed');
      setProviderResults(payload.items || []);
    } catch (err: any) {
      setError(err?.message || 'Provider search failed');
    } finally {
      setSearchingProvider(false);
    }
  };

  const handleProviderImport = async (item: ProviderItem) => {
    setImportingId(item.id);
    setError(null);
    try {
      const response = await fetch('/api/admin/media/provider/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          folder: uploadFolder || 'general',
          imageUrl: item.fullUrl || item.thumbUrl,
          filename: `${item.provider}-${item.id}.jpg`,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Import failed');
      onSelect(payload.url);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Import failed');
    } finally {
      setImportingId(null);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('siteId', siteId);
      body.append('folder', uploadFolder || 'general');
      body.append('file', file);
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Upload failed');
      onSelect(payload.url);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[80vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Image Picker (V2)</h2>
            <p className="text-xs text-gray-500">Library, upload, Unsplash, and Pexels sources</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-xs"
          >
            Close
          </button>
        </div>

        <div className="px-5 pt-3 border-b border-gray-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-3">
            {(['library', 'upload', 'unsplash', 'pexels'] as PickerTab[]).map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => {
                  setTab(entry);
                  setProviderResults([]);
                  setError(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  tab === entry
                    ? 'bg-[var(--navy)] text-white border-[var(--navy)]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {entry === 'library'
                  ? 'Library'
                  : entry === 'upload'
                  ? 'Upload'
                  : entry === 'unsplash'
                  ? 'Unsplash'
                  : 'Pexels'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {tab === 'library' && (
          <>
            <div className="px-5 py-3 border-b border-gray-200 grid gap-3 md:grid-cols-[1fr_220px]">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Search by filename"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
              >
                {folders.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry === 'all' ? 'All folders' : entry}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-5 overflow-y-auto">
              {!loading && (
                <div className="mb-3 text-xs text-gray-500">
                  {filtered.length} result{filtered.length === 1 ? '' : 's'}
                </div>
              )}
              {loading ? (
                <div className="text-sm text-gray-500">Loading images…</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelect(item.url);
                        onClose();
                      }}
                      className="border border-gray-200 rounded-lg overflow-hidden text-left hover:shadow-sm"
                    >
                      <div className="aspect-[4/3] bg-gray-100">
                        <img
                          src={item.url}
                          alt={item.path}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="px-3 py-2 text-xs text-gray-600 truncate">{item.path}</div>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <div className="text-sm text-gray-500">No images found.</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'upload' && (
          <div className="p-5 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Folder</label>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={uploadFolder}
                onChange={(event) => setUploadFolder(event.target.value)}
                placeholder="general"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleUpload(file);
                  event.currentTarget.value = '';
                }}
              />
              <span className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50">
                {uploading ? 'Uploading…' : 'Choose image'}
              </span>
            </label>
          </div>
        )}

        {(tab === 'unsplash' || tab === 'pexels') && (
          <>
            <div className="px-5 py-3 border-b border-gray-200 grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder={`Search ${tab} images`}
                value={providerQuery}
                onChange={(event) => setProviderQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void searchProvider(tab);
                  }
                }}
              />
              <input
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                value={uploadFolder}
                onChange={(event) => setUploadFolder(event.target.value)}
                placeholder="Folder"
              />
              <button
                type="button"
                onClick={() => void searchProvider(tab)}
                className="px-3 py-2 rounded-md border border-gray-200 text-xs hover:bg-gray-50"
                disabled={searchingProvider}
              >
                {searchingProvider ? 'Searching…' : 'Search'}
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {providerResults.map((item) => (
                  <div key={`${item.provider}-${item.id}`} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src={item.thumbUrl || item.fullUrl}
                        alt={item.alt || `${item.provider} image`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-3 py-2 text-xs text-gray-600">
                      {item.creditName ? `Photo by ${item.creditName}` : tab}
                    </div>
                    <div className="px-3 pb-3">
                      <button
                        type="button"
                        onClick={() => void handleProviderImport(item)}
                        disabled={importingId === item.id}
                        className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs hover:bg-gray-50"
                      >
                        {importingId === item.id ? 'Importing…' : 'Import & Select'}
                      </button>
                    </div>
                  </div>
                ))}
                {!searchingProvider && providerResults.length === 0 && (
                  <div className="text-sm text-gray-500">Search to find images.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
