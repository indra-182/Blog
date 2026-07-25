# Ticket 5: SEO Hardening + Performance + Deploy

## Goal
Fix SEO gaps vs spec.md, performance hardening, deploy to Vercel.

## Prerequisites
Phase 1-3 selesai

## Spec Reference
spec.md section 8 (SEO), section 9 (Performance Budget), section 10 (Deployment)

## Acceptance Criteria

### SEO
- [ ] **JSON-LD `BlogPosting` schema** di setiap post page (`/posts/[slug]`). Inject di `<head>` via `<script type="application/ld+json">`. Include: @context, @type, headline, description, image, datePublished, author, publisher.
- [ ] **Canonical URL** di semua halaman — `rel="canonical"` link tag pointing to `{SITE_URL}{pathname}`
- [ ] **Layout-level metadata** lengkap:
  - `openGraph: { title, description, type: 'website', siteName, locale }`
  - `twitter: { card: 'summary_large_image', title, description }`
  - `icons`, `manifest` jika perlu
- [ ] **viewport** export di layout: `width: 'device-width', initialScale: 1`
- [ ] **theme-color** meta tag: dark/light sesuai tema
- [ ] **404 page** (`src/app/not-found.tsx`) — neobrutalism styled, "Halaman tidak ditemukan" with link back to home
- [ ] Semantic HTML audit: semua halaman pakai `<main>`, `<nav>`, `<article>`, `<header>` sesuai fungsi

### Performance
- [ ] Font: pastikan `font-display: swap` (Geist font via next/font sudah include ini). Tambah preload link untuk font files.
- [ ] Images: semua gambar publik (logo, placeholder) pake `next/image` dengan width/height explicit
- [ ] CLS check: no layout shift from images, fonts, or dynamic content
- [ ] Minimalize JS: Fuse.js, TOC, search — lazy-loaded atau code-split

### Deploy
- [ ] Deploy ke Vercel:
  ```bash
  cd /mnt/d/My\ Projects/blog
  npx vercel --prod
  ```
  - Atau: connect GitHub repo → auto-deploy from `main`
- [ ] Set environment variable: `SITE_URL=https://blog.indra.dev` (atau domain yg lo pake)
- [ ] Domain config: `blog.indra.dev` CNAME to `cname.vercel-dns.com`
- [ ] Test: Lighthouse audit (target 90+ dulu, 95+ next pass)
- [ ] Test: `/api/posts` return valid JSON
- [ ] Test: `/rss.xml` valid
- [ ] Test: `/sitemap.xml` valid
- [ ] Post-deploy: submit sitemap ke Google Search Console

## Notes
- Jangan deploy sebelum SEO gap di-fix — nanti kena duplicate content penalty
- Environment variable `SITE_URL` harus di-set di Vercel dashboard atau `.env.production`
- Verif: setelah deploy, akses `blog.indra.dev/api/posts` dari browser harus return JSON
