# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Indonesian frontend and AI builders who want useful, trustworthy articles they can read intentionally and apply in their work.

## Product Purpose

This personal blog is an independent content source for the connected portfolio ecosystem. It helps visitors understand a post's value, enter the right piece of content, reach meaningful material, and continue to a relevant next read.

## Positioning

The blog publishes authored long-form articles only, giving each article a focused reading path and a relevant next read.

## Operating Context

- Content is authored as MDX files in `content/posts` and processed by Velite.
- Published articles are consumed by the blog UI, RSS, sitemap, search index, and the public `/api/posts` feed.
- The shell and system copy are Indonesian-first; authored post titles and bodies keep their source language.
- The blog is deployed independently and exposes stable public URLs for the portfolio ecosystem.

## Capabilities and Constraints

- Preserve the existing Velite/MDX pipeline, article `Post` fields, public URLs, SEO metadata, RSS, sitemap, robots, and `/api/posts` response shape and behavior.
- Publish only `article` posts. Keep the public API `type` field for compatibility: `type=article` returns articles, while `type=curation` remains a successful empty query.
- Retired curation post URLs permanently redirect to `/` and do not appear on public surfaces.
- Keep categories as primary topic navigation and tags as secondary navigation.
- Keep client-side Fuse.js search backed by `/search-index.json`; do not add a backend search endpoint.
- Preserve localStorage key `theme` and legacy `system` theme behavior.
- No new image dependency or backend schema is required. An absent cover image must remain a valid content state.

## Brand Commitments

The visual world is named **Catatan Bengkel Digital**. It is dark-first, Indonesian-first in its interface language, and preserves authored content language. The interface should feel like a focused working notebook for digital craft, with flat orange, yellow, and blue accents, hard-edged neobrutalist structure, and no decorative gradients.

## Evidence on Hand

The repository's real content and contracts are the source of truth: `content/posts/*.mdx`, `src/types/post.ts`, `src/lib/posts.ts`, route handlers, and generated `public/search-index.json`.

## Product Principles

- Make the reading path obvious before making the interface expansive.
- Keep authored articles at the center of discovery and the reading path.
- Keep topic navigation predictable: categories first, tags second.
- Preserve stable ecosystem contracts while improving the reader experience.
- Preserve the public API compatibility behavior for legacy type queries.
- Treat empty, loading, error, keyboard, and narrow-screen states as real product states.

## Accessibility & Inclusion

The experience targets WCAG 2.2 AA, semantic landmarks and headings, visible focus, keyboard-complete controls, reduced-motion support, and 44px minimum touch targets. The responsive baseline is mobile reading at 320px wide.
