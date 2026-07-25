import { readFileSync, writeFileSync } from 'node:fs'
import { defineConfig, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:8].[ext]',
    clean: true,
    format: 'esm',
  },
  mdx: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
          keepBackground: false,
          onVisitTitle(element: Record<string, any>) {
            element.properties.className = ['neo-code-title']
          },
        },
      ],
    ],
  },
  prepare(data) {
    const docs = data.posts
      .filter((p: any) => !p.draft)
      .map((p: any) => {
        const raw = readFileSync(`content/${p._path}.mdx`, 'utf-8')
        const body = raw.replace(/^---[\s\S]*?---\n/, '').trim()
        return {
          slug: p._path.split('/').pop() ?? p._path,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          tags: p.tags,
          date: p.date,
          body,
        }
      })
    writeFileSync('public/search-index.json', JSON.stringify(docs), 'utf-8')
  },
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/**/*.mdx',
      schema: s.object({
        title: s.string(),
        date: s.isodate(),
        excerpt: s.string(),
        coverImage: s.string().optional(),
        slug: s.string().optional(),
        category: s.string(),
        tags: s.array(s.string()),
        draft: s.boolean().default(false),
        type: s.enum(['article', 'curation']),
        items: s
          .array(
            s.object({
              title: s.string(),
              url: s.string(),
              source: s.string().optional(),
              insight: s.string().optional(),
            }),
          )
          .optional(),
        body: s.mdx(),
        toc: s.toc(),
        _path: s.path(),
      }),
    },
  },
})
