import { posts } from '#velite';
import readingTime from 'reading-time';
import type { Post, TocEntry } from '@/types/post';

function deriveSlug(p: { _path: string; slug?: string }): string {
  return p.slug ?? p._path.split('/').pop() ?? p._path;
}

function computeReadingTime(body: string): number {
  return Math.ceil(readingTime(body).minutes);
}

const all: Post[] = posts.map((p) => ({
  ...p,
  slug: deriveSlug(p as { _path: string }),
  readingTimeMinutes: computeReadingTime(p.body),
  toc: (p as unknown as { toc: TocEntry[] }).toc ?? [],
}));

export function getAllPosts(): Post[] {
  return all.filter((p) => !p.draft && p.type === 'article');
}

export function getPostBySlug(slug: string): Post | undefined {
  return all.find((p) => p.slug === slug && !p.draft);
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAllCategories(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getAllPosts()) {
    map.set(p.category, (map.get(p.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of getAllPosts()) {
    for (const tag of p.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPaginatedPosts(
  page: number,
  limit: number = 6,
  typeFilter?: 'article',
): { posts: Post[]; total: number; hasNextPage: boolean } {
  const published = getAllPosts();
  const filtered = typeFilter === 'article' || !typeFilter ? published : [];
  const start = (page - 1) * limit;
  const sliced = filtered.slice(start, start + limit);
  return {
    posts: sliced,
    total: filtered.length,
    hasNextPage: start + limit < filtered.length,
  };
}
