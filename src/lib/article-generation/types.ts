export type QueueStatus = 'pending' | 'generating' | 'published' | 'failed';

export interface EditorialMetadata {
  audience: string;
  angle: string;
  tone: string;
}

export interface ArticleSource {
  title: string;
  url: string;
  note: string;
}

export interface ArticleQueueItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  editorial: EditorialMetadata;
  category: string;
  tags: string[];
  coverImage?: string;
  sectionBriefs: string[];
  practicalExamples: string[];
  sources: ArticleSource[];
  status: QueueStatus;
  attempts: number;
  lastError: string | null;
  publishedAt?: string;
}

export interface ArticleQueue {
  version: 1;
  items: ArticleQueueItem[];
}

export interface GeneratedArticle {
  excerpt: string;
  body: string;
}

export interface ModelAdapter {
  generate(prompt: string): Promise<unknown>;
}

export interface QueueFileSystem {
  readFileSync(path: string, encoding: 'utf8'): string;
  writeFileSync(path: string, data: string, encoding: 'utf8'): void;
  renameSync(from: string, to: string): void;
  unlinkSync(path: string): void;
  existsSync(path: string): boolean;
}

export type ArticleGenerationFileSystem = QueueFileSystem;

export interface GenerateNextArticleOptions {
  queuePath?: string;
  postsDirectory?: string;
  fs?: ArticleGenerationFileSystem;
  model: ModelAdapter;
  now?: () => string;
  existingSlugs?: Iterable<string> | (() => Iterable<string> | Promise<Iterable<string>>);
}

export interface EmptyArticleGenerationResult {
  kind: 'empty';
  item: undefined;
  slug: undefined;
  path: undefined;
}

export interface PublishedArticleGenerationResult {
  kind: 'published';
  item: ArticleQueueItem;
  slug: string;
  path: string;
}

export type ArticleGenerationResult =
  EmptyArticleGenerationResult | PublishedArticleGenerationResult;
