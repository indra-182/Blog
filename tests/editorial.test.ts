import { describe, expect, it } from 'vitest';
import type { Post } from '@/types/post';
import { buildEditorialHome, selectNextReads } from '@/lib/editorial';

const post = (overrides: Partial<Post>): Post => ({
  slug: 'default',
  title: 'Default',
  date: '2026-07-01',
  excerpt: 'Excerpt',
  category: 'frontend',
  tags: ['web'],
  draft: false,
  type: 'article',
  body: '',
  toc: [],
  readingTimeMinutes: 1,
  ...overrides,
});

describe('buildEditorialHome', () => {
  it('chooses the newest published article as lead and keeps the rest in deterministic groups', () => {
    const posts = [
      post({ slug: 'draft', date: '2026-08-01', draft: true }),
      post({ slug: 'older-article', date: '2026-07-10' }),
      post({ slug: 'newer-article', date: '2026-07-20' }),
      post({ slug: 'same-day-b', date: '2026-07-15' }),
      post({ slug: 'same-day-a', date: '2026-07-15' }),
      post({ slug: 'curation', date: '2026-07-25', type: 'curation' }),
    ];
    const originalOrder = posts.map(({ slug }) => slug);

    const home = buildEditorialHome(posts);

    expect(home.lead?.slug).toBe('newer-article');
    expect(home.articles.map(({ slug }) => slug)).toEqual([
      'same-day-a',
      'same-day-b',
      'older-article',
    ]);
    expect(home.curations.map(({ slug }) => slug)).toEqual(['curation']);
    expect(posts.map(({ slug }) => slug)).toEqual(originalOrder);
    expect(home.articles.some(({ slug }) => slug === 'draft')).toBe(false);
  });

  it('falls back to the newest published curation when no article exists', () => {
    const home = buildEditorialHome([
      post({ slug: 'older', type: 'curation', date: '2026-07-10' }),
      post({ slug: 'newer', type: 'curation', date: '2026-07-20' }),
      post({ slug: 'draft', type: 'article', draft: true }),
    ]);

    expect(home.lead?.slug).toBe('newer');
    expect(home.articles).toEqual([]);
    expect(home.curations.map(({ slug }) => slug)).toEqual(['older']);
  });
});

describe('selectNextReads', () => {
  it('prioritizes category, shared tags, type, then deterministic date order', () => {
    const current = post({
      slug: 'current',
      category: 'agentic-ai',
      tags: ['ai', 'agents'],
    });
    const reads = selectNextReads(
      [
        current,
        post({
          slug: 'same-category',
          category: 'agentic-ai',
          tags: ['web'],
          date: '2026-07-01',
        }),
        post({
          slug: 'shared-tag',
          category: 'frontend',
          tags: ['ai'],
          date: '2026-08-01',
        }),
        post({
          slug: 'same-type',
          category: 'frontend',
          tags: ['web'],
          date: '2026-09-01',
        }),
        post({
          slug: 'curation-match',
          category: 'agentic-ai',
          tags: ['agents'],
          type: 'curation',
          date: '2026-06-01',
        }),
        post({
          slug: 'draft-match',
          category: 'agentic-ai',
          draft: true,
          date: '2026-12-01',
        }),
      ],
      current,
      4,
    );

    expect(reads.map(({ slug }) => slug)).toEqual([
      'curation-match',
      'same-category',
      'shared-tag',
      'same-type',
    ]);
  });

  it('returns at most the requested limit and excludes the current post', () => {
    const current = post({ slug: 'current' });
    const reads = selectNextReads(
      [current, post({ slug: 'a' }), post({ slug: 'b' })],
      current,
      1,
    );

    expect(reads).toHaveLength(1);
    expect(reads[0]?.slug).not.toBe('current');
  });
});
