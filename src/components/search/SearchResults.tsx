'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export interface SearchDoc {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  body?: string;
}

function highlight(text: string, query: string) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const escaped = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const expression = new RegExp(`(${escaped})`, 'gi');
  return text.split(expression).map((part, index) =>
    part.toLocaleLowerCase() === trimmedQuery.toLocaleLowerCase() ? (
      <mark key={`${part}-${index}`} className="bg-(--yellow) px-0.5 text-[#1a1a1a]">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

interface SearchResultsProps {
  results: SearchDoc[];
  query: string;
  onSelect: () => void;
}

export function SearchResults({ results, query, onSelect }: SearchResultsProps) {
  if (results.length === 0) {
    return <p className="search-status">Tidak ada tulisan yang cocok.</p>;
  }

  return (
    <ul aria-label="Hasil pencarian">
      {results.map((doc) => (
        <li key={doc.slug}>
          <Link href={`/posts/${doc.slug}`} onClick={onSelect} className="search-result">
            <p className="meta-line">
              {formatDate(doc.date)} <span aria-hidden="true">&middot;</span>{' '}
              {doc.category}
            </p>
            <p className="search-result__title">{highlight(doc.title, query)}</p>
            <p className="search-result__excerpt line-clamp-2">
              {highlight(doc.excerpt, query)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
