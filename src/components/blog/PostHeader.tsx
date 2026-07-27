import Link from 'next/link';
import { CurationCard } from './CurationCard';
import type { Post } from '@/types/post';
import { formatDate } from '@/lib/utils';

export function PostHeader({ post }: { post: Post }) {
  return (
    <header className="mb-12 max-w-4xl">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-(--text-weak)">
        <Link href={`/category/${post.category}`} className="magic-tag magic-tag--accent">
          {post.category}
        </Link>
        <span>{formatDate(post.date)}</span>
        <span className="sm:ml-auto">{post.readingTimeMinutes} min read</span>
      </div>

      <h1 className="magic-heading magic-heading--gradient">{post.title}</h1>

      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-(--text)">
        {post.excerpt}
      </p>

      {post.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`} className="magic-tag">
              {tag}
            </Link>
          ))}
        </div>
      )}

      {post.type === 'curation' && post.items && post.items.length > 0 && (
        <div className="mt-6">
          <CurationCard items={post.items} />
        </div>
      )}
    </header>
  );
}
