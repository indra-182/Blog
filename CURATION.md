# Curation draft fetcher — run by GitHub Actions cron

Content directory:

- `content/posts/`         — published posts (checked in)
- `content/drafts/`        — generated drafts (not checked in, or checked in as draft:true)

After generation, review and edit the draft, set `draft: false`, move to `content/posts/`, commit, push.

---

## Writing a draft manually

Scrape Frontend Focus, dev.to, Smashing Mag, NPM blog, GitHub trending. Pick 5–10 links relevant to frontend/tech. Format:

```mdx
---
title: "Frontend Digest — 26 Jul 2026"
date: 2026-07-26
excerpt: "5 links: CSS has, React forget, Bun 1.2, Chrome DevTools, Tailwind v5."
category: "frontend"
tags: [digest, frontend]
slug: frontend-digest-26-jul-2026
type: curation
draft: true
items:
  - title: "CSS has() Selector"
    url: "https://developer.chrome.com/blog/has-selector"
    source: "Chrome Developers"
    insight: "CSS :has() finally cross-browser. Game changer for parent selectors."
---

_Items are in frontmatter — no body content needed._
```
