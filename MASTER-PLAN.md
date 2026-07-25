# Master Plan — Blog + Portfolio

## Strategi Hybrid

| Agent | Role |
|-------|------|
| **Gw (Hermes)** | Planning, spec refinement, tickets, code review, file scaffolding |
| **OpenCode** | Execute build per ticket (read AGENTS.md + ticket, implement) |

---

## BLOG (Priority: Provider → dikerjain duluan)

### Phase 1 — Foundation
**Status:** Init ✅ . Tinggal content pipeline + layout.

| Aspek | Detail |
|-------|--------|
| **Agent** | OpenCode |
| **Mode** | build |
| **Prompt** | `docs/tickets/ticket-1-init.md` (paste isinya) |
| **Yang dikerjain** | Velite pipeline, Navbar, Footer, ThemeProvider, 3 dummy posts (article, curation, draft), CurationCard |
| **Reference** | AGENTS.md, spec.md |
| **Files output** | `content/posts/*.mdx`, `src/lib/posts.ts`, `src/app/layout.tsx` (edit), `src/components/layout/*`, `src/components/blog/CurationCard.tsx` |
| **Estimasi** | 1 sesi OpenCode |

### Phase 2 — Core Pages
**Status:** Belum mulai.

| Aspek | Detail |
|-------|--------|
| **Agent** | OpenCode |
| **Mode** | build |
| **Prompt** | `docs/tickets/ticket-2-pages.md` |
| **Yang dikerjain** | Post listing (`/`), detail post (`/posts/[slug]`), category/tag filter, syntax highlighting, TOC, reading time, 404 page |
| **Prerequisite** | Phase 1 selesai |
| **Estimasi** | 1-2 sesi OpenCode |

### Phase 3 — API + Discoverability
**Status:** Belum mulai.

| Aspek | Detail |
|-------|--------|
| **Agent** | OpenCode |
| **Mode** | build |
| **Prompt** | `docs/tickets/ticket-3-api-rss-search.md` |
| **Yang dikerjain** | `GET /api/posts`, RSS feed, sitemap, client-side search (Fuse.js) |
| **Prerequisite** | Phase 2 selesai |
| **Estimasi** | 1 sesi OpenCode |

### Phase 4 — Daily Curation Pipeline
**Status:** Belum mulai.

| Aspek | Detail |
|-------|--------|
| **Agent** | OpenCode |
| **Mode** | build |
| **Prompt** | `docs/tickets/ticket-4-curation-pipeline.md` |
| **Yang dikerjain** | GitHub Actions cron, RSS fetch script, draft generator |
| **Prerequisite** | Phase 2 selesai (CurationCard harus udah ada) |
| **Estimasi** | 1 sesi OpenCode |

### Phase 5 — SEO + Perf + Deploy
**Status:** Belum mulai.

| Aspek | Detail |
|-------|--------|
| **Agent** | OpenCode |
| **Mode** | build |
| **Prompt** | `docs/tickets/ticket-5-seo-deploy.md` *(belum dibuat)* |
| **Yang dikerjain** | JSON-LD, meta tags, Lighthouse audit, deploy ke Vercel, domain config |
| **Prerequisite** | Phase 3 selesai |
| **Estimasi** | 1 sesi |

### — GW (Hermes) Review Point —
**Sekali setelah semua phase blog selesai:**

| Aspek | Detail |
|-------|--------|
| **Agent** | Hermes (gw) |
| **Mode** | review |
| **Prompt** | "Review `spec.md` vs hasil implementasi di `/mnt/d/My\ Projects/blog/`. Check: API response format, component tree, routes, SEO, performance budget. Kasih list apa yg miss vs spec." |
| **Output** | List gap + fix prompt buat OpenCode |

---

## PORTFOLIO (Dikerjain setelah Blog API siap)

### Phase 1 — Init + Setup
**Status:** Belum mulai.

| Aspek | Detail |
|-------|--------|
| **Agent** | Gw (Hermes) dulu → lalu OpenCode |
| **Mode** | Hermes: plan & scaffold → OpenCode: build |
| **Prompt** | Lihat `portfolio-prompts.md` *(gw bikin pas mulai portfolio)* |
| **Yang dikerjain** | Init Next.js 16, tokens.css, globals.css, AGENTS.md, spec.md filtered untuk portfolio, tickets |

### Phase 2 — All Sections (Hero → Contact)
**Status:** Belum mulai.

| Aspek | Detail |
|-------|--------|
| **Agent** | OpenCode |
| **Mode** | build |
| **Yang dikerjain** | Hero, About, Skills, Experience, Projects, Testimonials, Contact form, dark/light mode |

### Phase 3 — Blog Integration + Deploy
**Status:** Belum mulai.

| Aspek | Detail |
|-------|--------|
| **Agent** | OpenCode + Hermes review |
| **Mode** | build → review |
| **Yang dikerjain** | BlogSection fetch dari `/api/posts`, ISR, error/fallback, Deploy Hook, deploy ke Vercel |

---

## Quick Reference — Tiap Mau Coding

```
BLOG:
┌──────────────────────────────────────────────────────────────┐
│ cd /mnt/d/My\ Projects/blog                                  │
│                                                              │
│ Phase 1: opencode → paste isi docs/tickets/ticket-1-init.md  │
│ Phase 2: opencode → paste isi docs/tickets/ticket-2-pages.md │
│ Phase 3: opencode → paste isi docs/tickets/ticket-3-api.md   │
│ Phase 4: opencode → paste isi docs/tickets/ticket-4-curation │
│ Phase 5: opencode → paste isi docs/tickets/ticket-5-seo.md   │
│                                                              │
│ Review:  "bang, review spec.md vs hasil"   ← panggil gw      │
└──────────────────────────────────────────────────────────────┘

PORTFOLIO:
┌──────────────────────────────────────────────────────────────┐
│ cd /mnt/d/My\ Projects/portfolio                              │
│                                                              │
│ Phase 1:  "bang, init portfolio + bikin spec + tickets" ← gw │
│ Phase 2: opencode → paste ticket sections                    │
│ Phase 3: opencode → paste ticket integration                 │
│                                                              │
│ Review:  "bang, review spec vs hasil"          ← panggil gw  │
└──────────────────────────────────────────────────────────────┘
```

---

## Catatan Penting

1. **Blog Phase 1 dulu.** Baru lanjut ke Phase 2-5.
2. **OpenCode auto-read AGENTS.md** — jadi dia tau struktur, style, API contract. Ga perlu jelasin ulang tiap prompt.
3. **Kalo stuck di OpenCode** — lo bisa screenshot errornya, tunjukkin ke gw, gw debug.
4. **Setelah Blog Phase 3 selesai** — `/api/posts` udah bisa dipanggil. Portfolio bisa mulai kapan aja setelah itu.
5. **Daily Curation Pipeline (Phase 4)** — gak blocking portfolio. Bisa dikerjain kapan aja.
