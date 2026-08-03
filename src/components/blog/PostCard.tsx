import Link from 'next/link';
import type { Post } from '@/types/post';
import { formatDate } from '@/lib/utils';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-item">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link href={`/category/${post.category}`} className="neo-tag neo-tag--accent">
          {post.category}
        </Link>
        <span className="meta-line">{formatDate(post.date)}</span>
        <span className="meta-line sm:ms-auto">{post.readingTimeMinutes} menit baca</span>
      </div>

      <Link href={`/posts/${post.slug}`} className="post-item__link mt-3 block">
        <h2 className="post-item__title">{post.title}</h2>
      </Link>

      <p className="mt-2 line-clamp-3 text-(--text)">{post.excerpt}</p>

      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tag tulisan">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link href={`/tags/${tag}`} className="neo-tag">
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
