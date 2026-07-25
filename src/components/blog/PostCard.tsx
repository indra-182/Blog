import Link from 'next/link'
import type { Post } from '@/types/post'

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
        <span>{post.date}</span>
        <span className="ml-auto">{post.readingTimeMinutes} min read</span>
      </header>

      <Link href={`/posts/${post.slug}`} className="group">
        <h2 className="text-2xl font-black uppercase tracking-tight group-hover:text-(--neo-accent-1) transition-colors">
          {post.title}
        </h2>
      </Link>

      <p className="text-base font-medium leading-relaxed">{post.excerpt}</p>

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
