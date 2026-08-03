import { readFileSync, renameSync, unlinkSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateQueue } from './validation';
import type { ArticleQueue, QueueFileSystem } from './types';

export { validateQueue } from './validation';

export const DEFAULT_QUEUE_PATH = resolve(process.cwd(), 'content/article-queue.json');

const nodeFileSystem: QueueFileSystem = {
  readFileSync,
  writeFileSync,
  renameSync,
  unlinkSync,
  existsSync,
};

export function loadQueue(
  source: string = DEFAULT_QUEUE_PATH,
  fs: QueueFileSystem = nodeFileSystem,
): ArticleQueue {
  const raw = source.trimStart().startsWith('{')
    ? source
    : fs.readFileSync(source, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `invalid queue JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return validateQueue(parsed);
}

export function saveQueue(
  queue: ArticleQueue,
  path: string = DEFAULT_QUEUE_PATH,
  fs: QueueFileSystem = nodeFileSystem,
): void {
  fs.writeFileSync(path, `${JSON.stringify(validateQueue(queue), null, 2)}\n`, 'utf8');
}

export function selectNextPending(queue: ArticleQueue) {
  return queue.items.find((item) => item.status === 'pending');
}
