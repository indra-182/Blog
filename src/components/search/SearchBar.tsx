'use client';

import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PiArrowUpRight, PiMagnifyingGlass, PiX } from 'react-icons/pi';
import { SearchResults, type SearchDoc } from './SearchResults';

type SearchStatus = 'idle' | 'loading' | 'ready' | 'error';

export function SearchBar() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [fuse, setFuse] = useState<Fuse<SearchDoc> | null>(null);
  const [status, setStatus] = useState<SearchStatus>('idle');

  const loadIndex = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await fetch('/search-index.json', { cache: 'force-cache' });
      if (!response.ok) throw new Error('Search index request failed');
      const data = (await response.json()) as SearchDoc[];
      setFuse(
        new Fuse(data, {
          keys: [
            { name: 'title', weight: 3 },
            { name: 'excerpt', weight: 2 },
            { name: 'body', weight: 1 },
            { name: 'tags', weight: 1 },
          ],
          threshold: 0.4,
          includeScore: true,
        }),
      );
      setStatus('ready');
    } catch {
      setFuse(null);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const loadTimer = window.setTimeout(() => void loadIndex(), 0);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(loadTimer);
      window.clearTimeout(focusTimer);
    };
  }, [loadIndex, open]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const results = useMemo(() => {
    if (!fuse || query.trim().length < 2) return [];
    return fuse
      .search(query)
      .slice(0, 8)
      .map((result) => result.item);
  }, [fuse, query]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="nav-action"
        aria-expanded={open}
        aria-controls="global-search-popover"
        aria-label="Cari"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <PiMagnifyingGlass size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Cari</span>
      </button>

      {open && (
        <div
          id="global-search-popover"
          className="search-popover"
          role="dialog"
          aria-label="Cari tulisan"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-2 p-3">
            <label htmlFor="global-search-input" className="sr-only">
              Cari tulisan
            </label>
            <input
              ref={inputRef}
              id="global-search-input"
              type="search"
              value={query}
              onChange={(event) => handleChange(event.target.value)}
              placeholder="Cari tulisan..."
              className="search-input"
              autoComplete="off"
            />
            <button
              type="button"
              className="nav-icon-button shrink-0"
              onClick={close}
              aria-label="Tutup pencarian"
            >
              <PiX size={20} aria-hidden="true" />
            </button>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {status === 'loading' && (
              <p className="search-status">Memuat indeks pencarian...</p>
            )}
            {status === 'error' && (
              <div className="search-status flex items-center justify-between gap-3">
                <span>Indeks pencarian belum bisa dimuat.</span>
                <button
                  type="button"
                  className="neo-button neo-button--secondary text-sm"
                  onClick={() => void loadIndex()}
                >
                  Coba lagi <PiArrowUpRight aria-hidden="true" />
                </button>
              </div>
            )}
            {status === 'ready' && query.trim().length >= 2 && (
              <SearchResults results={results} query={query} onSelect={close} />
            )}
            {status === 'ready' && query.trim().length < 2 && (
              <p className="search-status">
                Ketik minimal dua karakter untuk mulai mencari.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
