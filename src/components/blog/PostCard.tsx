import Link from 'next/link';
import type { Post } from '@/types/post';
import { formatDate } from '@/lib/utils';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="magic-card magic-card--interactive flex flex-col gap-4">
      <header className="flex flex-wrap items-center gap-2 text-xs text-(--text-weak)">
        <Link href={`/category/${post.category}`} className="magic-tag magic-tag--accent">
          {post.category}
        </Link>
        <span>{formatDate(post.date)}</span>
        <span className="sm:ml-auto">{post.readingTimeMinutes} min read</span>
      </header>

      <div className="flex items-start gap-2">
        {post.type === 'curation' && (
          <span className="magic-tag magic-tag--accent shrink-0 mt-1">Curation</span>
        )}
        <Link href={`/posts/${post.slug}`} className="group flex-1">
          <h2 className="text-2xl font-semibold tracking-[-0.045em] text-(--text-strong) group-hover:text-(--accent) transition-colors">
            {post.title}
          </h2>
        </Link>
      </div>

      <p className="text-base leading-relaxed text-(--text)">{post.excerpt}</p>

      {/* curation items preview */}
      {post.type === 'curation' && post.items && post.items.length > 0 && (
        <ul className="mt-1 space-y-1.5 rounded-xl border border-(--border) bg-(--surface-hover) p-3">
          {post.items.slice(0, 3).map((item, i) => (
            <li key={i} className="text-sm text-(--text)">
              <span className="mr-1 text-(--accent)">&rarr;</span>
              {item.title}
            </li>
          ))}
          {post.items.length > 3 && (
            <li className="text-xs font-medium text-(--accent)">
              +{post.items.length - 3} more links
            </li>
          )}
        </ul>
      )}

      {post.tags.length > 0 && (
        <footer className="mt-1 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className="magic-tag">
              {tag}
            </Link>
          ))}
        </footer>
      )}
    </article>
  );
}
