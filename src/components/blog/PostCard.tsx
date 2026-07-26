import Link from 'next/link'
import type { Post } from '@/types/post'
import { formatDate } from '@/lib/utils'

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="neo-card flex flex-col gap-3">
      <header className="flex items-center gap-2 text-xs font-bold uppercase">
        <Link
          href={`/category/${post.category}`}
          className="neo-tag hover:bg-(--neo-accent-3) transition-colors"
        >
          {post.category}
        </Link>
        <span>{formatDate(post.date)}</span>
        <span className="ml-auto">{post.readingTimeMinutes} min read</span>
      </header>

      <div className="flex items-start gap-2">
        {post.type === 'curation' && (
          <span className="neo-tag bg-(--neo-accent-1) text-white text-xs font-bold uppercase shrink-0 mt-1">
            Curation
          </span>
        )}
        <Link href={`/posts/${post.slug}`} className="group flex-1">
          <h2 className="text-2xl font-black uppercase tracking-tight group-hover:text-(--neo-accent-1) transition-colors">
            {post.title}
          </h2>
        </Link>
      </div>

      <p className="text-base font-medium leading-relaxed">{post.excerpt}</p>

      {/* curation items preview */}
      {post.type === 'curation' && post.items && post.items.length > 0 && (
        <ul className="space-y-1 mt-1">
          {post.items.slice(0, 3).map((item, i) => (
            <li key={i} className="text-sm font-bold">
              <span className="text-(--neo-accent-2) mr-1">&rarr;</span>
              {item.title}
            </li>
          ))}
          {post.items.length > 3 && (
            <li className="text-xs font-bold text-(--neo-accent-1)">
              +{post.items.length - 3} more links
            </li>
          )}
        </ul>
      )}

      {post.tags.length > 0 && (
        <footer className="flex flex-wrap gap-2 mt-1">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="neo-tag text-xs hover:bg-(--neo-accent-3) transition-colors"
            >
              {tag}
            </Link>
          ))}
        </footer>
      )}
    </article>
  )
}
