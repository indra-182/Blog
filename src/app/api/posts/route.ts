import { NextResponse } from 'next/server'
import { getAllPosts, getPostsByCategory, getPostsByTag } from '@/lib/posts'
import { SITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 6))
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const type = searchParams.get('type')

  let published = getAllPosts()

  if (category) published = getPostsByCategory(category)
  if (tag) published = getPostsByTag(tag)
  if (type) published = published.filter((p) => p.type === type)

  const total = published.length
  const start = (page - 1) * limit
  const sliced = published.slice(start, start + limit)

  const data = sliced.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    type: p.type,
    coverImage: p.coverImage ?? null,
    date: p.date,
    category: p.category,
    tags: p.tags,
    readingTimeMinutes: p.readingTimeMinutes,
    readingTime: `${p.readingTimeMinutes} min read`,
    url: `${SITE_URL}/posts/${p.slug}`,
  }))

  return NextResponse.json(
    {
      data,
      meta: {
        page,
        limit,
        total,
        hasNextPage: start + limit < total,
      },
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3000',
      },
    },
  )
}
