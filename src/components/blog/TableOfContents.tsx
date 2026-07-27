'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/types/post';

interface TOCProps {
  items: TocEntry[];
}

function TOCLink({
  entry,
  activeId,
  depth,
}: {
  entry: TocEntry;
  activeId: string;
  depth: number;
}) {
  const href = entry.url;
  const id = href.replace('#', '');
  const isActive = activeId === id;

  return (
    <li>
      <a
        href={href}
        className={`block rounded-sm px-2 py-1 text-sm transition-colors hover:bg-(--surface-hover) hover:text-(--accent) ${
          isActive ? 'text-(--accent) font-medium' : 'text-(--text-weak)'
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {entry.title}
      </a>
      {entry.items.length > 0 && (
        <ul>
          {entry.items.map((child, i) => (
            <TOCLink
              key={`${child.url}-${i}`}
              entry={child}
              activeId={activeId}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TableOfContents({ items }: TOCProps) {
  const [activeId, setActiveId] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const ids = items.flatMap((e) => {
      const ids: string[] = [e.url.replace('#', '')];
      for (const child of e.items) ids.push(child.url.replace('#', ''));
      return ids;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <button
        className="magic-button mb-4 w-full sm:hidden border border-(--border)"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Hide' : 'Show'} Table of Contents
      </button>

      <div
        className={`magic-card p-4 sm:block sm:sticky sm:top-24 ${open ? 'block' : 'hidden'}`}
      >
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-(--text-weak) uppercase">
          On This Page
        </h2>
        <ul>
          {items.map((entry, i) => (
            <TOCLink
              key={`${entry.url}-${i}`}
              entry={entry}
              activeId={activeId}
              depth={0}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}
