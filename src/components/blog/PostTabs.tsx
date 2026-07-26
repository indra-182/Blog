'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

const TABS = [
  { label: 'All', value: '' },
  { label: 'Articles', value: 'article' },
  { label: 'Curation', value: 'curation' },
] as const;

export function PostTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentType = searchParams.get('type');

  const isActive = (value: string) => value === (currentType ?? '');

  const navigate = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('type', value);
      } else {
        params.delete('type');
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, router, pathname],
  );

  return (
    <div className="flex gap-2 mb-6" role="tablist" aria-label="Post type filter">
      {TABS.map((t) => {
        const active = isActive(t.value);
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => navigate(t.value)}
            className={`neo-tab ${active ? 'neo-tab--active' : ''}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
