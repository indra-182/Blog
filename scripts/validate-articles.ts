import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadQueue } from '../src/lib/article-generation/queue';

const queue = loadQueue();
const postsDirectory = join(process.cwd(), 'content/posts');

for (const item of queue.items) {
  const articlePath = join(postsDirectory, `${item.slug}.mdx`);
  if (item.status === 'published' && !existsSync(articlePath)) {
    throw new Error(`published queue item is missing its article: ${item.slug}`);
  }
  if (item.status === 'pending' && existsSync(articlePath)) {
    throw new Error(`pending queue item collides with an article: ${item.slug}`);
  }
  if (item.status === 'published') {
    const source = readFileSync(articlePath, 'utf8');
    if (!source.includes(`slug: ${item.slug}`) || !source.includes('type: article')) {
      throw new Error(
        `published article metadata does not match the queue: ${item.slug}`,
      );
    }
  }
}

console.log(`Validated ${queue.items.length} article queue item(s).`);
