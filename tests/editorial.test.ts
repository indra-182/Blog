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
  it('chooses the newest published article as lead and keeps the rest deterministic', () => {
    const posts = [
      post({ slug: 'draft', date: '2026-08-01', draft: true }),
      post({ slug: 'older-article', date: '2026-07-10' }),
      post({ slug: 'newer-article', date: '2026-07-20' }),
      post({ slug: 'same-day-b', date: '2026-07-15' }),
      post({ slug: 'same-day-a', date: '2026-07-15' }),
    ];
    const originalOrder = posts.map(({ slug }) => slug);

    const home = buildEditorialHome(posts);

    expect(home.lead?.slug).toBe('newer-article');
    expect(home.articles.map(({ slug }) => slug)).toEqual([
      'same-day-a',
      'same-day-b',
      'older-article',
    ]);
    expect(Object.keys(home)).toEqual(['lead', 'articles']);
    expect(home.lead?.type).toBe('article');
    expect(posts.map(({ slug }) => slug)).toEqual(originalOrder);
    expect(home.articles.some(({ slug }) => slug === 'draft')).toBe(false);
  });
});

describe('selectNextReads', () => {
  it('prioritizes category, shared tags, then deterministic date order', () => {
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
          slug: 'date-match',
          category: 'frontend',
          tags: ['web'],
          date: '2026-09-01',
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
      'same-category',
      'shared-tag',
      'date-match',
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
