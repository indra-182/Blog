#!/usr/bin/env node

/**
 * Fetch RSS feeds → dedup → generate curation draft MDX.
 *
 * Sources: Frontend Focus, dev.to trending, Smashing Mag, NPM blog, GitHub trending
 * Output: content/drafts/YYYY-MM-DD-digest.mdx (draft: true)
 * Only writes if at least 3 items collected.
 *
 * Run manually: node .github/scripts/fetch-curation.mjs
 */

const SOURCES = [
  { name: 'Frontend Focus', url: 'https://frontendfoc.us/rss' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/' },
  { name: 'NPM Blog', url: 'https://blog.npmjs.org/feed.xml' },
  { name: 'dev.to trending', url: 'https://dev.to/feed/tag/webdev' },
  { name: 'GitHub Trending', url: 'https://github.com/trending.rss' },
]

const KEYWORDS = [
  'react', 'nextjs', 'next.js', 'typescript', 'css', 'tailwind',
  'frontend', 'web', 'javascript', 'node', 'bun', 'deno',
  'performance', 'accessibility', 'a11y', 'vercel', 'ai',
  'animation', 'html', 'browser', 'chrome', 'sass',
]

const OUTPUT_DIR = 'content/drafts'

async function fetchRSS(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'curation-bot/1.0' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  const text = await res.text()

  // naive RSS/Atom parser — extract <item> or <entry> elements
  const items = []
  const itemRe = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/gi
  let match
  while ((match = itemRe.exec(text)) !== null) {
    const block = match[1]
    const title = (block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i) || [])[1]?.trim()
    const link = (block.match(/<link[^>]*href="([^"]+)"/i) || block.match(/<link>([^<]+)<\/link>/i) || [])[1]?.trim()
    const desc = (block.match(/<(?:description|summary)[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:description|summary)>/i) || [])[1]
    if (title && link) {
      items.push({
        title: title.replace(/<[^>]+>/g, '').trim(),
        url: link,
        source: block.match(/<source[^>]*>([\s\S]*?)<\/source>/i)
          ? (block.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1].trim()
          : new URL(url).hostname,
        insight: desc
          ? desc.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 200)
          : '',
      })
    }
  }
  return items
}

function isRelevant(item) {
  const text = `${item.title} ${item.insight}`.toLowerCase()
  return KEYWORDS.some((kw) => text.includes(kw))
}

function dedup(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = item.title.toLowerCase().slice(0, 60)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function slugDate() {
  return todayStr()
}

async function main() {
  console.log('Fetching RSS feeds…')

  const allItems = []
  for (const src of SOURCES) {
    try {
      const items = await fetchRSS(src.url)
      console.log(`  ${src.name}: ${items.length} items`)
      allItems.push(
        ...items.map((item) => ({ ...item, _source: src.name })),
      )
    } catch (err) {
      console.warn(`  ${src.name}: FAILED — ${err.message}`)
    }
  }

  const relevant = allItems.filter(isRelevant)
  const curated = dedup(relevant).slice(0, 10)

  console.log(`\n${curated.length} relevant/deduped items`)

  if (curated.length < 3) {
    console.log('Too few items — skipping draft generation.')
    return
  }

  const dateStr = todayStr()
  const slug = `frontend-digest-${slugDate()}`
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const d = new Date()
  const prettyDate = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`

  const itemsYaml = curated
    .map((item) => {
      const safeTitle = item.title.replace(/"/g, "'")
      const safeInsight = (item.insight || '').replace(/"/g, "'").slice(0, 150)
      const source = item.source || item._source || 'web'
      return `  - title: "${safeTitle}"
    url: "${item.url}"
    source: "${source}"
    insight: "${safeInsight}"`
    })
    .join('\n')

  const mdx = `---
title: "Frontend Digest — ${prettyDate}"
date: ${dateStr}
excerpt: "${curated.length} links: picked from Frontend Focus, dev.to, Smashing Mag, and more."
category: "frontend"
tags: [digest, frontend]
slug: ${slug}
type: curation
draft: true
items:
${itemsYaml}
---

_Automated draft — review and edit before publishing._
`

  const fs = await import('node:fs')
  const path = await import('node:path')
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const outPath = path.join(OUTPUT_DIR, `${slug}.mdx`)
  fs.writeFileSync(outPath, mdx, 'utf-8')
  console.log(`\nDraft written → ${outPath}`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
