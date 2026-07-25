'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Fuse from 'fuse.js'
import { SearchResults } from './SearchResults'

interface SearchDoc {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  date: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchDoc[]>([])
  const [fuse, setFuse] = useState<Fuse<SearchDoc> | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

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
        )
      })
  }, [])

  const search = useCallback(
    (q: string) => {
      if (!fuse || q.trim().length < 2) {
        setResults([])
        return
      }
      const res = fuse.search(q).map((r) => r.item)
      setResults(res.slice(0, 10))
    },
    [fuse],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setQuery(v)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(v), 300)
  }

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search posts..."
        className="neo-input w-full"
        aria-label="Search posts"
      />
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto neo-card p-0">
          <SearchResults results={results} query={query} onSelect={() => setQuery('')} />
        </div>
      )}
    </div>
  )
}
