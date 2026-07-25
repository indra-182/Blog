# Spec: Personal Blog — Ekosistem Terhubung

**Versi:** 1.1
**Tanggal:** 25 Juli 2026
**Pemilik Produk:** Indra (Frontend Engineer)

---

## 0. Ringkasan Eksekutif

Blog pribadi sebagai sumber konten (provider) dalam ekosistem 2 project. Blog independen secara deployment, mengekspos konten via JSON API untuk dikonsumsi Portfolio.

Domain: `blog.indra.dev` (subdomain). Stack: Next.js 16 App Router + TypeScript + Tailwind CSS v4 + Velite (MDX). Style: neobrutalism (bold border hitam, flat color, heavy typography).

Posting terdiri dari 2 jenis: **Long-form Article** (MDX biasa) dan **Daily Curation** (link digest harian dari RSS feed).

---

## 1. Feature List

### A. Content Authoring (MDX)

- Post file-based di `content/posts/*.mdx`
- Frontmatter: `title`, `slug`, `date`, `excerpt`, `coverImage`, `category`, `tags[]`, `draft`, `type` (`article` | `curation`)
- Support custom MDX components: `<Callout>`, `<CodeBlock>`
- Draft mode (`draft: true`) — tidak masuk build production / API

### B. Long-form Article (`type: article`)

- Artikel panjang original (tutorial, opini, case study)
- Syntax highlighting (shiki/rehype-pretty-code)
- Reading time otomatis
- Table of Contents auto dari heading
- Kategori + tags untuk filtering

### C. Daily Curation / Link Digest (`type: curation`)

- Post harian berisi kumpulan link tech/frontend dengan komentar singkat
- Format: headline + URL + 1-2 baris insight dari Indra
- Sumber: RSS feed (Frontend Focus, dev.to, Smashing Mag, NPM blog, GitHub Trending)
- Frontmatter tambahan: `sources[]` (array link sumber), `items[]` (array link yg di-curate)

### D. Categories & Tags

- Setiap post punya 1 category + banyak tags
- Halaman listing per category (`/category/[slug]`) dan per tag (`/tags/[slug]`)
- Sidebar menampilkan semua kategori & tag dengan count

### E. Client-side Search

- Search index digenerate saat build (`search-index.json`)
- Fuse.js client-side, debounce 300ms, highlight hasil

### F. RSS Feed

- `/rss.xml` (RSS 2.0) — seluruh published posts
- Artikel panjang dan curation link masuk feed (beda formatting)

### G. Sitemap

- `/sitemap.xml` — semua post + halaman kategori/tag + static pages

### H. Public JSON API — `GET /api/posts`

- Endpoint publik, CORS enabled
- Pagination: `?limit=`, `?page=`, `?category=`, `?tag=`
- Response schema lihat bagian 4
- Cache-Control header

### I. Cross-cutting

- Dark/Light mode (next-themes, konsisten dengan Portfolio)
- Responsive mobile-first
- Neobrutalism styling (border hitam, shadow keras, flat color)

---

## 2. User Stories

| ID    | Sebagai                      | Saya ingin                                       | Agar                                                 |
| ----- | ---------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| P2-01 | Pembaca                      | mencari artikel berdasarkan keyword              | menemukan konten relevan cepat                       |
| P2-02 | Pembaca                      | memfilter artikel berdasarkan kategori/tag       | fokus ke topik tertentu                              |
| P2-03 | Pembaca                      | melihat estimasi waktu baca                      | mengatur waktu membaca                               |
| P2-04 | Pembaca artikel panjang      | menavigasi lewat TOC                             | melompat ke bagian relevan                           |
| P2-05 | Subscriber                   | subscribe RSS feed                               | notifikasi post baru di RSS reader                   |
| P2-06 | Search engine crawler        | membaca sitemap.xml                              | indexing konten                                      |
| P2-07 | Portfolio (sistem eksternal) | mengambil daftar post via JSON API               | menampilkan preview blog                             |
| P2-08 | Indra (penulis)              | menulis article MDX dengan komponen custom       | kontrol penuh format & visual                        |
| P2-09 | Indra (penulis)              | daily curation otomatis dari RSS + diedit manual | konten harian tanpa nulis full artikel               |
| P2-10 | Pembaca daily digest         | lihat headline tech hari ini + insight singkat   | update trend frontend/tech tanpa baca banyak artikel |

---

## 3. Arsitektur

```
                    ┌───────────────────────────────┐
                    │    Personal Blog               │
                    │  (Next.js — blog.indra.dev)    │
                    │                                │
                    │  Content source:                │
                    │  ├─ content/posts/*.mdx (article) │
                    │  └─ content/posts/*.mdx (curation)│
                    │                                │
                    │  Generated at build:            │
                    │  ├─ /rss.xml                   │
                    │  ├─ /sitemap.xml               │
                    │  └─ search-index.json          │
                    │                                │
                    │  Public API:                   │
                    │  GET /api/posts (JSON) ────────┼──→ Portfolio
                    │                                │
                    │  Daily Curation Pipeline:      │
                    │  GitHub Actions (cron)          │
                    │  → fetch RSS feeds             │
                    │  → AI bikin draft digest        │
                    │  → simpan di content/posts/drafts/ │
                    └───────────────────────────────┘
```

### Daily Curation Flow

```
00:00 UTC — GitHub Actions cron trigger
  ↓
fetch RSS feeds (Frontend Focus, dev.to trending, Smashing Mag, NPM blog, GitHub trending)
  ↓
dedup + filter relevant topic (frontend, react, nextjs, typescript, CSS, AI)
  ↓
generate draft: title + 5-10 link items + excerpt singkat
  ↓
save ke content/posts/drafts/YYYY-MM-DD-digest.mdx (type: curation, draft: true)
  ↓
Indra review pagi → edit → hapus draft: true → publish
```

---

## 4. Kontrak API — `GET /api/posts`

```
GET /api/posts?limit=6&page=1&category=frontend&type=article

Response 200:
{
  "data": [{
    "slug": "...",
    "title": "...",
    "excerpt": "...",
    "type": "article" | "curation",
    "coverImage": "...",
    "date": "2026-07-20",
    "category": "frontend",
    "tags": ["react", "nextjs"],
    "readingTimeMinutes": 7,
    "url": "https://blog.indra.dev/posts/..."
  }],
  "meta": { "page": 1, "limit": 6, "total": 42, "hasNextPage": true }
}

Headers:
  Access-Control-Allow-Origin: https://indra.dev
  Cache-Control: public, s-maxage=600, stale-while-revalidate=3000
```

---

## 5. Tech Stack

| Layer            | Pilihan                              | Rationale                             |
| ---------------- | ------------------------------------ | ------------------------------------- |
| Framework        | Next.js 16 App Router                | ISR, RSC, image opt, 1-klik Vercel    |
| Bahasa           | TypeScript                           | Type-safety kontrak API               |
| Content          | MDX + Velite                         | Komponen custom dalam artikel         |
| Syntax highlight | rehype-pretty-code (Shiki)           | Theme akurat, dark/light tanpa FOUC   |
| Search           | Fuse.js (client-side)                | No backend needed                     |
| RSS/Sitemap      | `feed` package + route handler       | Generate terprogram                   |
| Reading time     | `reading-time`                       | Ringan, standar                       |
| Styling          | Tailwind CSS v4 + custom neo classes | Neobrutalism                          |
| Daily curation   | GitHub Actions + RSS parser          | Serverless cron, gratis               |
| Deployment       | Vercel                               | Deploy hook trigger Portfolio rebuild |
| Linting          | ESLint 9 + Prettier                  | Konsistensi kode                      |

---

## 6. Component Tree

```
src/app/
├── layout.tsx                  (ThemeProvider, Navbar, Footer)
├── page.tsx                    (post listing + search bar)
├── posts/[slug]/page.tsx       (render MDX + TOC + reading time)
├── category/[slug]/page.tsx
├── tags/[slug]/page.tsx
├── api/posts/route.ts          (public JSON endpoint)
├── rss.xml/route.ts
└── sitemap.xml/route.ts

src/components/
├── layout/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── blog/
│   ├── PostCard.tsx
│   ├── PostList.tsx
│   ├── PostHeader.tsx
│   ├── PostContent.tsx         (MDX renderer)
│   ├── TableOfContents.tsx
│   ├── CodeBlock.tsx
│   ├── Callout.tsx
│   ├── CategoryFilter.tsx
│   ├── TagFilter.tsx
│   └── CurationCard.tsx        (layout khusus untuk link digest)
├── search/
│   ├── SearchBar.tsx
│   └── SearchResults.tsx
└── ui/                         (primitives: Button, Card, Badge, Tag)

src/lib/
├── posts.ts                    (getAllPosts, getPostBySlug)
├── rss.ts
├── sitemap.ts
└── utils.ts

content/
├── posts/                      (*.mdx — published)
└── drafts/                     (*.mdx — draft, generated by cron)
```

---

## 7. Route Design

| Route              | Deskripsi                            | Rendering                  |
| ------------------ | ------------------------------------ | -------------------------- |
| `/`                | Listing semua post + search + filter | SSG                        |
| `/posts/[slug]`    | Detail artikel/curation              | SSG (generateStaticParams) |
| `/category/[slug]` | Listing per kategori                 | SSG                        |
| `/tags/[slug]`     | Listing per tag                      | SSG                        |
| `/api/posts`       | JSON endpoint (dikonsumsi Portfolio) | Server (cached)            |
| `/rss.xml`         | RSS feed                             | Server (build-time)        |
| `/sitemap.xml`     | Sitemap                              | Server (build-time)        |

---

## 8. SEO Strategy

- Semantic HTML (`<article>`, `<nav>`, `<header>`)
- Meta tags via `generateMetadata()` — title, description, og:image, twitter:card
- JSON-LD: `BlogPosting` schema di tiap post
- Canonical URL eksplisit
- Sitemap submit ke Google Search Console
- RSS feed untuk discoverability
- `robots.txt` izinkan full crawl

---

## 9. Performance Budget

| Metrik     | Target                |
| ---------- | --------------------- |
| LCP        | < 2.0s                |
| CLS        | < 0.05                |
| TTFB       | < 200ms (Vercel edge) |
| Total JS   | < 150KB gzip          |
| Lighthouse | 95+ all categories    |

---

## 10. Deployment

- Vercel project: `blog.indra.dev`
- Branch `main` → auto-deploy production
- Preview deployment per PR
- Draft post (`draft: true`) tidak masuk build production
- Build sukses → trigger Deploy Hook Portfolio (via GitHub Actions)

### Daily Curation Pipeline

Cron di GitHub Actions: `0 0 * * *` (tiap tengah malam UTC)
Script: fetch RSS → dedup/filter → generate draft MDX → push ke repo

Indra review tiap pagi, edit seperlunya, hapus `draft: true`, push → publish.

---

## 11. Milestone

| Fase                                 | Scope                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| **Fase 1 — Foundation**              | Setup Next.js, tokens, Navbar/Footer, theme, Velite pipeline                   |
| **Fase 2 — Core Pages**              | Listing, detail post, category/tag filter, syntax highlight, TOC, reading time |
| **Fase 3 — API & Discoverability**   | `/api/posts`, RSS, sitemap, search                                             |
| **Fase 4 — Daily Curation Pipeline** | GitHub Actions cron, RSS fetcher, draft generator, CurationCard component      |
| **Fase 5 — SEO & Perf**              | JSON-LD, meta tags, Lighthouse audit, image optimization                       |
| **Fase 6 — Deploy & Launch**         | Deploy ke Vercel, test end-to-end, submit sitemap                              |

---

## 12. Risiko & Mitigasi

| Risiko                                   | Dampak                        | Mitigasi                                            |
| ---------------------------------------- | ----------------------------- | --------------------------------------------------- |
| API /api/posts down saat Portfolio build | Portfolio section kosong      | Fallback empty array + timeout, build tetap lanjut  |
| RSS fetcher error                        | Curation draft gagal generate | Retry + fallback. Cron notification kalo gagal 3x   |
| CORS misconfig                           | Portfolio gagal fetch         | Fetch via RSC (server), bukan client — CORS minimal |
