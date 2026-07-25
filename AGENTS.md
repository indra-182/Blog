# Blog Project — Personal Blog

Tech stack: Next.js 16 App Router, TypeScript, Tailwind CSS v4, Velite (MDX), rehype-pretty-code, Shiki.

## Style: Neobrutalism
- Bold black borders (3-4px), flat colors, heavy typography
- Box shadow keras (offset 5px, blur 0)
- No rounded corners, no gradient, no subtle shadow
- Reference: skill `css-coder/neobrutalism-css`
- Tokens di `src/styles/tokens.css`, components di `src/styles/globals.css`
- Available classes: `.neo-btn`, `.neo-card`, `.neo-input`, `.neo-tag`, `.neo-section-title`, `.neo-prose`
- Warna: bg #FFFDF7, text #1A1A1A, accent #FF6B35 / #FFD700 / #004E98

## Prioritas:
1. Content pipeline (Velite/MDX) dulu — ini foundation
2. Listing + detail post
3. API `/api/posts` — endpoint yg dikonsumsi portfolio nanti
4. RSS + sitemap + search
5. Category & tag filter

## Struktur Folder:
```
src/
├── app/
│   ├── layout.tsx              (root layout + theme provider)
│   ├── page.tsx                (post listing)
│   ├── posts/[slug]/page.tsx   (detail post)
│   ├── category/[slug]/page.tsx
│   ├── tags/[slug]/page.tsx
│   ├── api/posts/route.ts      (public JSON feed)
│   ├── rss.xml/route.ts
│   └── sitemap.xml/route.ts
├── components/
│   ├── layout/ (Navbar, Footer, ThemeToggle)
│   ├── blog/ (PostCard, PostHeader, PostContent, TableOfContents, CodeBlock)
│   └── search/ (SearchBar, SearchResults)
├── lib/
│   ├── posts.ts                (getAllPosts, getPostBySlug)
│   └── utils.ts
├── styles/
│   ├── tokens.css
│   └── globals.css
└── types/
    └── post.ts
content/
└── posts/                      (.mdx files)
```

## JSON Feed Contract (/api/posts)
Response:
```json
{
  "data": [{
    "slug": "...",
    "title": "...",
    "excerpt": "...",
    "coverImage": "...",
    "date": "2026-07-20",
    "category": "agentic-ai",
    "tags": ["langgraph", "mcp"],
    "readingTimeMinutes": 7,
    "url": "https://blog.domain.com/posts/..."
  }],
  "meta": { "page": 1, "limit": 6, "total": 42, "hasNextPage": true }
}
```

## Referensi Skills:
- `css-coder/neobrutalism-css` — neobrutalism pattern
- `semantic-html` — semantic HTML untuk aksesibilitas
- `css-coder` — styling code blocks
- `css-tokens` — design tokens
- `deploy-to-vercel` — deployment
