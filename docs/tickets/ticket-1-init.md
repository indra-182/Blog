# Ticket 1: Init Project + Content Pipeline + Navbar/Footer

## Goal
Setup Next.js 16 project, configure Velite for MDX, create layout, navbar, footer, theme toggle, and write 2-3 dummy posts (1 article, 1 curation, 1 draft).

## Spec Reference
- spec.md — full project spec
- AGENTS.md — project structure

## Acceptance Criteria
- [ ] Next.js 16 App Router with TypeScript + Tailwind CSS v4 ✅ (done)
- [ ] `content/posts/` folder with 3 dummy .mdx posts:
  - 1 `type: article` (long-form with full frontmatter)
  - 1 `type: curation` (link digest format — `items[]` in frontmatter)
  - 1 `draft: true` (tidak masuk build)
- [ ] Velite configured: reads `content/posts/*.mdx`, generates type-safe post list
- [ ] Root layout (`src/app/layout.tsx`): imports `globals.css`, wraps with ThemeProvider (next-themes), has Navbar + Footer
- [ ] Navbar: logo/nama blog, navigation links (Home, Categories, Tags), ThemeToggle — neobrutalism style
- [ ] Footer: copyright, social links
- [ ] Dark mode works: toggle persists, no flash on load
- [ ] All neo styles in `globals.css` used (`.neo-btn`, `.neo-card`, `.neo-section-title` etc)
- [ ] CurationCard component: layout khusus untuk link digest (list of links + Indra's comment per item)

## Notes
- Jangan buat halaman selain layout, navbar, footer di ticket ini
- Velite alternative: gray-matter + next-mdx-remote
- Curation post frontmatter example:
  ```
  ---
  title: "Frontend Digest — 25 Jul 2026"
  date: 2026-07-25
  type: curation
  category: frontend
  tags: [digest, frontend]
  items:
    - title: "React 19 Features"
      url: "https://..."
      source: "React Blog"
      insight: "Key takeaway..."
  excerpt: "5 link hari ini: React 19, CSS nesting, Turbopack..."
  draft: false
  ---
  ```
