import { generateNextArticle } from '../src/lib/article-generation/generator';
import { collectExistingPostSlugs } from '../src/lib/article-generation/content';
import {
  generateWithRetry,
  GitHubModelsAdapter,
} from '../src/lib/article-generation/model';
import type { ModelAdapter } from '../src/lib/article-generation/types';

const adapter = new GitHubModelsAdapter();
const retryingAdapter: ModelAdapter = {
  generate: (prompt) => generateWithRetry(adapter, prompt),
};
const existingSlugs = collectExistingPostSlugs('content/posts');

try {
  const result = await generateNextArticle({
    model: retryingAdapter,
    existingSlugs,
  });
  if (result.kind === 'empty') {
    console.log(
      JSON.stringify({ status: 'empty', message: 'No pending article in the queue.' }),
    );
  } else {
    console.log(
      JSON.stringify({ status: 'published', slug: result.slug, path: result.path }),
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
