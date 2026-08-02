'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TocEntry } from '@/types/post';

function flatten(entries: TocEntry[]): string[] {
  return entries.flatMap((entry) => [
    entry.url.replace(/^#/, ''),
    ...flatten(entry.items),
  ]);
}

function TocList({
  entries,
  activeId,
  depth = 0,
}: {
  entries: TocEntry[];
  activeId: string;
  depth?: number;
}) {
  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.url}>
          <a
            href={entry.url}
            className="toc-link"
            data-active={activeId === entry.url.replace(/^#/, '')}
            style={{ paddingInlineStart: `${depth * 0.75}rem` }}
          >
            {entry.title}
          </a>
          {entry.items.length > 0 && (
            <TocList entries={entry.items} activeId={activeId} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents({ items }: { items: TocEntry[] }) {
  const [activeId, setActiveId] = useState('');
  const ids = useMemo(() => flatten(items), [items]);

  useEffect(() => {
    if (ids.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );
    ids.forEach((id) => {
      const heading = document.getElementById(id);
      if (heading) observer.observe(heading);
    });
    return () => observer.disconnect();
  }, [ids]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Daftar isi">
      <details className="lg:hidden">
        <summary className="neo-button neo-button--secondary w-full cursor-pointer list-none">
          Lihat daftar isi
        </summary>
        <div className="toc-panel mt-3">
          <TocList entries={items} activeId={activeId} />
        </div>
      </details>
      <div className="toc-panel sticky top-24 hidden lg:block">
        <h2 className="mb-3 font-black text-(--text-strong)">Di tulisan ini</h2>
        <TocList entries={items} activeId={activeId} />
      </div>
    </nav>
  );
}
