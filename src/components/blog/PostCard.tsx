import Link from 'next/link';
import type { Post } from '@/types/post';
import { formatDate } from '@/lib/utils';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-item">
      <div className="flex flex-wrap items-center gap-2 text-xs text-(--text-weak)">
        <Link href={`/category/${post.category}`} className="magic-tag magic-tag--accent">
          {post.category}
        </Link>
        <span>{formatDate(post.date)}</span>
        <span className="sm:ml-auto">{post.readingTimeMinutes} min read</span>
      </div>

      <div className="mt-2 flex items-start gap-2">
        {post.type === 'curation' && (
          <span className="magic-tag magic-tag--accent shrink-0 mt-1">Curation</span>
        )}
        <Link href={`/posts/${post.slug}`} className="group flex-1">
          <h2 className="text-xl font-semibold tracking-tight text-(--text-strong) group-hover:text-(--accent) transition-colors">
            {post.title}
          </h2>
        </Link>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-(--text) line-clamp-2">
        {post.excerpt}
      </p>

      {post.type === 'curation' && post.items && post.items.length > 0 && (
        <div className="mt-3 space-y-1">
          {post.items.slice(0, 3).map((item, i) => (
            <p key={i} className="text-sm text-(--text)">
              <span className="mr-1 text-(--accent)">&rarr;</span>
              {item.title}
            </p>
          ))}
          {post.items.length > 3 && (
            <p className="text-xs font-medium text-(--accent)">
              +{post.items.length - 3} more links
            </p>
          )}
        </div>
      )}

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className="magic-tag text-xs">
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
