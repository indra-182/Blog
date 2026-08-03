import { existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_QUEUE_PATH, loadQueue, selectNextPending } from './queue';
import { renderArticle } from './renderer';
import type {
  ArticleGenerationFileSystem,
  ArticleGenerationResult,
  ArticleQueue,
  ArticleQueueItem,
  GenerateNextArticleOptions,
} from './types';
import { validateGeneratedArticle } from './validation';

const nodeFileSystem: ArticleGenerationFileSystem = {
  readFileSync,
  writeFileSync,
  renameSync,
  unlinkSync,
  existsSync,
};

function buildPrompt(item: ArticleQueueItem): string {
  return [
    'Tulis artikel teknis orisinal dalam Bahasa Indonesia.',
    'Kembalikan JSON valid yang hanya berisi dua field: excerpt dan body.',
    'Jangan mengubah atau mengembalikan title, slug, tanggal, kategori, tag, coverImage, atau sources; semua metadata itu dikendalikan queue.',
    `Judul editorial: ${item.title}`,
    `Audiens: ${item.editorial.audience}`,
    `Sudut pandang: ${item.editorial.angle}`,
    `Nada: ${item.editorial.tone}`,
    `Bagian yang wajib dibahas:\n${item.sectionBriefs.map((brief) => `- ${brief}`).join('\n')}`,
    `Contoh praktis yang wajib dijelaskan:\n${item.practicalExamples.map((example) => `- ${example}`).join('\n')}`,
    'Body harus memiliki 1.200 kata atau lebih, 4 sampai 7 heading utama level ##, bagian ## Contoh Praktis, dan bagian ## Kesimpulan.',
    'Jangan menulis bagian ## Sources karena akan ditambahkan dari catatan queue yang tersimpan.',
    'Jangan menggunakan import, export, JSX, HTML mentah, atau executable MDX.',
  ].join('\n\n');
}

async function resolveExistingSlugs(
  source: GenerateNextArticleOptions['existingSlugs'],
): Promise<Set<string>> {
  if (source === undefined) return new Set();
  const values = typeof source === 'function' ? await source() : source;
  return new Set(values);
}

function cloneQueueWithPublishedItem(
  queue: ArticleQueue,
  item: ArticleQueueItem,
  now: string,
): ArticleQueue {
  return {
    ...queue,
    items: queue.items.map((candidate) =>
      candidate.id === item.id
        ? {
            ...candidate,
            status: 'published',
            attempts: candidate.attempts + 1,
            lastError: null,
            publishedAt: now,
          }
        : candidate,
    ),
  };
}

function clean(fs: ArticleGenerationFileSystem, path: string): void {
  if (fs.existsSync(path)) fs.unlinkSync(path);
}

export async function generateNextArticle(
  options: GenerateNextArticleOptions,
): Promise<ArticleGenerationResult> {
  const fs = options.fs ?? nodeFileSystem;
  const queuePath = options.queuePath ?? DEFAULT_QUEUE_PATH;
  const postsDirectory = options.postsDirectory ?? join(process.cwd(), 'content/posts');
  const queueText = fs.readFileSync(queuePath, 'utf8');
  const queue = loadQueue(queueText, fs);
  const item = selectNextPending(queue);
  if (!item) return { kind: 'empty', item: undefined, slug: undefined, path: undefined };

  const postPath = join(postsDirectory, `${item.slug}.mdx`);
  const existingSlugs = await resolveExistingSlugs(options.existingSlugs);
  if (existingSlugs.has(item.slug) || fs.existsSync(postPath)) {
    throw new Error(`slug collision: ${item.slug}`);
  }

  const generated = validateGeneratedArticle(
    await options.model.generate(buildPrompt(item)),
    item,
  );
  const mdx = renderArticle(item, generated);
  const now = options.now?.() ?? new Date().toISOString().slice(0, 10);
  const nextQueue = cloneQueueWithPublishedItem(queue, item, now);
  const postTempPath = `${postPath}.tmp-${item.id}`;
  const queueTempPath = `${queuePath}.tmp-${item.id}`;
  let postCommitted = false;
  let queueCommitted = false;

  try {
    fs.writeFileSync(postTempPath, mdx, 'utf8');
    fs.writeFileSync(queueTempPath, `${JSON.stringify(nextQueue, null, 2)}\n`, 'utf8');
    fs.renameSync(postTempPath, postPath);
    postCommitted = true;
    fs.renameSync(queueTempPath, queuePath);
    queueCommitted = true;
    return {
      kind: 'published',
      item: nextQueue.items.find((candidate) => candidate.id === item.id) ?? item,
      slug: item.slug,
      path: postPath,
    };
  } catch (error) {
    clean(fs, postTempPath);
    clean(fs, queueTempPath);
    if (postCommitted) clean(fs, postPath);
    if (queueCommitted) {
      const rollbackPath = `${queuePath}.rollback-${item.id}`;
      fs.writeFileSync(rollbackPath, queueText, 'utf8');
      fs.renameSync(rollbackPath, queuePath);
    }
    throw error;
  }
}

export { buildPrompt };
