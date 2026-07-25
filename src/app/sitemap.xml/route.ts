import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts'
import { SITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

function url(loc: string, priority: string, changefreq: string, lastmod?: string) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
  </url>`
}

export async function GET() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const tags = getAllTags()

  const entries = [
    url('/', '1.0', 'daily'),
    ...posts.map((p) => url(`/posts/${p.slug}`, '0.8', 'monthly', p.date)),
    ...categories.map((c) => url(`/category/${c.name}`, '0.6', 'weekly')),
    ...tags.map((t) => url(`/tags/${t.name}`, '0.5', 'weekly')),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3000',
    },
  })
}
