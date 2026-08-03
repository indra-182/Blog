import type { Post } from '@/types/post';

export interface EditorialHome {
  lead: Post | null;
  articles: Post[];
}

function compareByDateThenSlug(a: Post, b: Post): number {
  const dateOrder = b.date.localeCompare(a.date);
  return dateOrder || a.slug.localeCompare(b.slug);
}

function publishedPosts(posts: Post[]): Post[] {
  return posts
    .filter((post) => !post.draft)
    .slice()
    .sort(compareByDateThenSlug);
}

export function buildEditorialHome(posts: Post[]): EditorialHome {
  const published = publishedPosts(posts);
  const articles = published.filter((post) => post.type === 'article');
  const lead = articles[0] ?? null;

  return {
    lead,
    articles: articles[0]?.slug === lead?.slug ? articles.slice(1) : articles,
  };
}

export function selectNextReads(posts: Post[], current: Post, limit: number): Post[] {
  const currentTags = new Set(current.tags);
  const candidates = posts
    .filter(
      (post) => !post.draft && post.type === 'article' && post.slug !== current.slug,
    )
    .slice();

  return candidates
    .sort((a, b) => {
      const sameCategory =
        Number(b.category === current.category) - Number(a.category === current.category);
      if (sameCategory !== 0) return sameCategory;

      const sharedTags =
        [...currentTags].filter((tag) => b.tags.includes(tag)).length -
        [...currentTags].filter((tag) => a.tags.includes(tag)).length;
      if (sharedTags !== 0) return sharedTags;

      return compareByDateThenSlug(a, b);
    })
    .slice(0, Math.max(0, limit));
}
