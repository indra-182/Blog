'use client';

import { useState, useMemo } from 'react';
import { PostCard } from '@/components/blog/PostCard';
import { Sidebar } from '@/components/blog/Sidebar';
import { SearchBar } from '@/components/search/SearchBar';
import type { Post } from '@/types/post';

type TabValue = '' | 'article' | 'curation';

const TABS: { label: string; value: TabValue }[] = [
  { label: 'All', value: '' },
  { label: 'Articles', value: 'article' },
  { label: 'Curation', value: 'curation' },
];

export function LatestPostsClient({
  posts,
  categories,
  tags,
  postsPerPage = 6,
}: {
  posts: Post[];
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
  postsPerPage?: number;
}) {
  const [activeTab, setActiveTab] = useState<TabValue>('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (activeTab ? posts.filter((p) => p.type === activeTab) : posts),
    [posts, activeTab],
  );

  const total = filtered.length;
  const totalPages = Math.ceil(total / postsPerPage) || 1;
  const start = (page - 1) * postsPerPage;
  const visible = filtered.slice(start, start + postsPerPage);

  const handleTabChange = (value: TabValue) => {
    setActiveTab(value);
    setPage(1);
  };

  return (
    <div>
      <p className="magic-kicker mb-3">Notes &amp; ideas</p>
      <h1 className="magic-section-title">
        Latest <span className="magic-heading--gradient">Posts</span>
      </h1>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div
            className="flex w-fit flex-wrap gap-1 rounded-full border border-(--border) bg-(--surface) p-1"
            role="tablist"
            aria-label="Post type filter"
          >
            {TABS.map((t) => {
              const active = activeTab === t.value;
              return (
                <button
                  key={t.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleTabChange(t.value)}
                  className="magic-tab"
                  data-active={active}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {visible.length === 0 && (
            <p className="text-lg text-(--text-weak)">No posts yet.</p>
          )}

          {visible.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="flex items-center justify-center gap-4 mt-4"
            >
              {page > 1 && (
                <button
                  onClick={() => setPage((p) => p - 1)}
                  className="neo-btn neo-btn--accent text-sm"
                >
                  &larr; Previous
                </button>
              )}
              <span className="text-sm text-(--text-weak)">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="neo-btn neo-btn--accent text-sm"
                >
                  Next &rarr;
                </button>
              )}
            </nav>
          )}
        </div>

        <div className="sm:w-64 shrink-0 flex flex-col gap-4">
          <SearchBar />
          <Sidebar categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  );
}
