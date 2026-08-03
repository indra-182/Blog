import type { ArticleQueueItem, GeneratedArticle } from './types';
import { validateGeneratedArticle } from './validation';

function yamlString(value: string): string {
  return JSON.stringify(value);
}

export function renderArticle(
  item: ArticleQueueItem,
  generated: GeneratedArticle,
): string {
  const article = validateGeneratedArticle(generated, item);
  const tags = `[${item.tags.map(yamlString).join(', ')}]`;
  const sources = item.sources
    .map((source) => `- [${source.title}](${source.url}): ${source.note}`)
    .join('\n');

  return `---
title: ${yamlString(item.title)}
date: ${item.date}
excerpt: ${yamlString(article.excerpt)}
${item.coverImage === undefined ? '' : `coverImage: ${yamlString(item.coverImage)}\n`}category: ${yamlString(item.category)}
tags: ${tags}
slug: ${item.slug}
type: article
draft: false
---

${article.body.trim()}

## Sources

${sources}
`;
}
