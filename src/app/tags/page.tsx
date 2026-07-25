import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'All tags',
  alternates: { canonical: '/tags' },
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div>
      <h1 className="neo-section-title">Tags</h1>

      {tags.length === 0 && (
        <p className="text-lg font-bold">No tags yet.</p>
      )}

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.name}`}
            className="neo-tag neo-card text-sm font-bold hover:bg-(--neo-accent-3) transition-colors"
          >
            {tag.name} ({tag.count})
          </Link>
        ))}
      </div>
    </div>
  )
}
