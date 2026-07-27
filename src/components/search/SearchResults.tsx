'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface SearchDoc {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark
        key={i}
        className="rounded bg-(--accent-soft) px-0.5 text-inherit font-medium"
      >
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
  if (results.length === 0) return null;

  return (
    <ul className="divide-y divide-(--border)">
      {results.map((doc) => (
        <li key={doc.slug}>
          <Link
            href={`/posts/${doc.slug}`}
            onClick={onSelect}
            className="block p-4 hover:bg-(--surface-hover)"
          >
            <p className="text-xs font-medium text-(--accent)">
              {formatDate(doc.date)} &middot; {doc.category}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-(--text-strong)">
              {highlight(doc.title, query)}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-(--text-weak)">
              {highlight(doc.excerpt, query)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
