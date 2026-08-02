import Link from 'next/link';
import type { Post } from '@/types/post';
import { formatDate } from '@/lib/utils';
import { CurationCard } from './CurationCard';

export function PostHeader({ post }: { post: Post }) {
  return (
    <header className="reader-header mb-12">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/category/${post.category}`} className="neo-tag neo-tag--accent">
          {post.category}
        </Link>
        {post.type === 'curation' && <span className="neo-tag">Kurasi</span>}
        <span className="meta-line">{formatDate(post.date)}</span>
        <span className="meta-line">{post.readingTimeMinutes} menit baca</span>
      </div>

      <h1 className="reader-title mt-6">{post.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-(--text)">
        {post.excerpt}
      </p>

      {post.tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tag tulisan">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link href={`/tags/${tag}`} className="neo-tag">
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {post.type === 'curation' && (
        <div className="mt-8 max-w-3xl">
          <CurationCard items={post.items} />
        </div>
      )}
    </header>
  );
}
