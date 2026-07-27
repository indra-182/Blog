'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Fuse from 'fuse.js';
import { SearchResults } from './SearchResults';

interface SearchDoc {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchDoc> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((data: SearchDoc[]) => {
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
      });
  }, []);

  const search = useCallback(
    (q: string) => {
      if (!fuse || q.trim().length < 2) {
        setResults([]);
        return;
      }
      const res = fuse.search(q).map((r) => r.item);
      setResults(res.slice(0, 10));
    },
    [fuse],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(v), 300);
  };

  return (
    <search className="relative block" aria-label="Search posts">
      <label htmlFor="post-search" className="sr-only">
        Search posts
      </label>
      <input
        id="post-search"
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search posts..."
        className="magic-input w-full"
      />
      {results.length > 0 && (
        <div className="magic-card absolute inset-x-0 top-full z-50 mt-2 max-h-96 overflow-y-auto">
          <SearchResults results={results} query={query} onSelect={() => setQuery('')} />
        </div>
      )}
    </search>
  );
}
