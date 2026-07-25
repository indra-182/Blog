import Link from 'next/link'
import { CurationCard } from './CurationCard'
import type { Post } from '@/types/post'

export function PostHeader({ post }: { post: Post }) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-2 text-sm font-bold uppercase mb-4">
        <Link
          href={`/category/${post.category}`}
          className="neo-tag hover:bg-(--neo-accent-3) transition-colors"
        >
          {post.category}
        </Link>
        <span>{post.date}</span>
        <span className="ml-auto">{post.readingTimeMinutes} min read</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
        {post.title}
      </h1>

      <p className="text-lg font-medium mt-4 leading-relaxed">{post.excerpt}</p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="neo-tag hover:bg-(--neo-accent-3) transition-colors"
            >
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
  )
}
