import type { Metadata } from 'next'
import Link from 'next/link'
import { getPaginatedPosts, getAllCategories, getAllTags } from '@/lib/posts'
import { PostCard } from '@/components/blog/PostCard'
import { Sidebar } from '@/components/blog/Sidebar'
import { SearchBar } from '@/components/search/SearchBar'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const TABS = [
  { label: 'All', value: '' },
  { label: 'Articles', value: 'article' },
  { label: 'Curation', value: 'curation' },
] as const

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const typeFilter = sp.type === 'article' || sp.type === 'curation' ? sp.type : undefined

  const { posts, total, hasNextPage } = getPaginatedPosts(page, 6, typeFilter)
  const categories = getAllCategories()
  const tags = getAllTags()

  const totalPages = Math.ceil(total / 6) || 1

  return (
    <div>
      <h1 className="neo-section-title">Latest Posts</h1>

      {/* filter tabs */}
      <div className="flex gap-2 mb-6" role="tablist" aria-label="Post type filter">
        {TABS.map((t) => {
          const isActive = t.value === (typeFilter ?? '')
          const href = t.value ? `/?type=${t.value}` : '/'
          return (
            <Link
              key={t.value}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={`neo-tab ${isActive ? 'neo-tab--active' : ''}`}
            >
              {t.label}
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          {posts.length === 0 && (
            <p className="text-lg font-bold">No posts yet.</p>
          )}

          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}

          <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-4 mt-4"
          >
            {page > 1 && (
              <Link
                href={`/?page=${page - 1}${typeFilter ? `&type=${typeFilter}` : ''}`}
                className="neo-btn neo-btn--accent text-sm"
              >
                &larr; Previous
              </Link>
            )}
            <span className="text-sm font-bold">
              Page {page} of {totalPages}
            </span>
            {hasNextPage && (
              <Link
                href={`/?page=${page + 1}${typeFilter ? `&type=${typeFilter}` : ''}`}
                className="neo-btn neo-btn--accent text-sm"
              >
                Next &rarr;
              </Link>
            )}
          </nav>
        </div>

        <div className="sm:w-64 shrink-0 flex flex-col gap-4">
          <SearchBar />
          <Sidebar categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  )
}
