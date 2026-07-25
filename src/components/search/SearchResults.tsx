'use client'

import Link from 'next/link'

interface SearchDoc {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  date: string
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(re)
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-[var(--neo-accent-3)] text-inherit font-bold">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

interface SearchResultsProps {
  results: SearchDoc[]
  query: string
  onSelect: () => void
}

export function SearchResults({ results, query, onSelect }: SearchResultsProps) {
  if (results.length === 0) return null

  return (
    <ul className="divide-y-2 divide-black">
      {results.map((doc) => (
        <li key={doc.slug}>
          <Link
            href={`/posts/${doc.slug}`}
            onClick={onSelect}
            className="block p-4 hover:bg-[var(--neo-accent-4)] transition-colors"
          >
            <p className="text-sm font-bold uppercase text-[var(--neo-accent-2)]">
              {doc.date} &middot; {doc.category}
            </p>
            <p className="text-lg font-black mt-1">
              {highlight(doc.title, query)}
            </p>
            <p className="text-sm font-medium mt-1 line-clamp-2">
              {highlight(doc.excerpt, query)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
