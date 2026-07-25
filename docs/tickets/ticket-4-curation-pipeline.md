# Ticket 4: Daily Curation Pipeline

## Goal
Setup GitHub Actions cron job for automatic daily curation draft generation from RSS feeds.

## Prerequisites
Ticket 1-3 selesai (Velite pipeline jalan, post types defined)

## Acceptance Criteria
- [ ] `scripts/fetch-digest.ts`:
  - Fetch RSS feeds: Frontend Focus, dev.to trending, Smashing Mag, NPM blog, GitHub trending (JS/TS)
  - Dedup + filter: hanya link relevant frontend/tech
  - Generate draft MDX: `content/posts/drafts/YYYY-MM-DD-digest.mdx`
  - Set `type: curation, draft: true`
- [ ] GitHub Actions workflow (`.github/workflows/daily-digest.yml`):
  - Cron: `0 0 * * *` (tengah malam UTC)
  - Atau: `0 6 * * 1-5` (weekday jam 6 pagi UTC+7)
  - Run script, commit + push hasil draft
  - Jika script gagal 3x berturut-turut: notifikasi (opsional)
- [ ] CurationCard component (di ticket 1) — verify works with generated drafts
- [ ] Curation post rendering: beda layout dari article (list of links instead of prose article)

## Notes
- Dependency: `rss-parser` npm package
- Draft post di folder `content/posts/drafts/` tidak masuk build karena Velite dikonfigurasi filter `draft: true`
- Pagi hari Indra review draft → edit → hapus `draft: true` → pindah ke `content/posts/` → push
- Gunakan environment variable `GITHUB_TOKEN` di GH Actions untuk commit push
