import type {
  ArticleQueue,
  ArticleQueueItem,
  GeneratedArticle,
  QueueStatus,
} from './types';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES: QueueStatus[] = ['pending', 'generating', 'published', 'failed'];

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function recordString(value: unknown, path: string, errors: string[]): value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${path} must be a non-empty string`);
    return false;
  }
  return true;
}

function validDate(value: unknown, path: string, errors: string[]): value is string {
  if (!recordString(value, path, errors) || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    errors.push(`${path} must be a valid ISO date`);
    return false;
  }
  return true;
}

function validateUrl(value: unknown, path: string, errors: string[]): value is string {
  if (!recordString(value, path, errors)) return false;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.push(`${path} must use HTTP or HTTPS`);
    }
    if (url.username || url.password) errors.push(`${path} must not contain credentials`);
    const normalizedHostname = hostname.replace(/^\[|\]$/g, '');
    if (
      normalizedHostname === 'localhost' ||
      normalizedHostname === '::1' ||
      normalizedHostname === '0.0.0.0'
    ) {
      errors.push(`${path} must not point to localhost`);
    }
    if (/^127(?:\.\d{1,3}){3}$/.test(hostname))
      errors.push(`${path} must not point to localhost`);
    return true;
  } catch {
    errors.push(`${path} must be a valid URL`);
    return false;
  }
}

function validateStringArray(
  value: unknown,
  path: string,
  errors: string[],
): value is string[] {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return false;
  }
  value.forEach((entry, index) => recordString(entry, `${path}[${index}]`, errors));
  return true;
}

function validateItem(
  value: unknown,
  index: number,
  errors: string[],
): value is ArticleQueueItem {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    errors.push(`items[${index}] must be an object`);
    return false;
  }
  const item = value as Record<string, unknown>;
  recordString(item.id, `items[${index}].id`, errors);
  if (
    recordString(item.slug, `items[${index}].slug`, errors) &&
    !SLUG_PATTERN.test(item.slug)
  ) {
    errors.push(`items[${index}].slug must be lowercase kebab-case`);
  }
  recordString(item.title, `items[${index}].title`, errors);
  validDate(item.date, `items[${index}].date`, errors);

  if (
    typeof item.editorial !== 'object' ||
    item.editorial === null ||
    Array.isArray(item.editorial)
  ) {
    errors.push(`items[${index}].editorial must be an object`);
  } else {
    const editorial = item.editorial as Record<string, unknown>;
    recordString(editorial.audience, `items[${index}].editorial.audience`, errors);
    recordString(editorial.angle, `items[${index}].editorial.angle`, errors);
    recordString(editorial.tone, `items[${index}].editorial.tone`, errors);
  }

  recordString(item.category, `items[${index}].category`, errors);
  validateStringArray(item.tags, `items[${index}].tags`, errors);
  if (item.coverImage !== undefined)
    recordString(item.coverImage, `items[${index}].coverImage`, errors);
  validateStringArray(item.sectionBriefs, `items[${index}].sectionBriefs`, errors);
  validateStringArray(
    item.practicalExamples,
    `items[${index}].practicalExamples`,
    errors,
  );

  if (!Array.isArray(item.sources) || item.sources.length === 0) {
    errors.push(`items[${index}].sources must be a non-empty array`);
  } else {
    item.sources.forEach((source, sourceIndex) => {
      if (typeof source !== 'object' || source === null || Array.isArray(source)) {
        errors.push(`items[${index}].sources[${sourceIndex}] must be an object`);
        return;
      }
      const record = source as Record<string, unknown>;
      recordString(record.title, `items[${index}].sources[${sourceIndex}].title`, errors);
      validateUrl(record.url, `items[${index}].sources[${sourceIndex}].url`, errors);
      recordString(record.note, `items[${index}].sources[${sourceIndex}].note`, errors);
    });
  }

  if (!STATUSES.includes(item.status as QueueStatus)) {
    errors.push(`items[${index}].status must be one of ${STATUSES.join(', ')}`);
  }
  if (!Number.isInteger(item.attempts) || (item.attempts as number) < 0) {
    errors.push(`items[${index}].attempts must be a non-negative integer`);
  }
  if (
    item.lastError !== null &&
    item.lastError !== undefined &&
    typeof item.lastError !== 'string'
  ) {
    errors.push(`items[${index}].lastError must be a string or null`);
  }
  if (item.publishedAt !== undefined)
    validDate(item.publishedAt, `items[${index}].publishedAt`, errors);
  return true;
}

export function validateQueue(value: unknown): ArticleQueue {
  const errors: string[] = [];
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ValidationError('queue must be an object');
  }
  const queue = value as Record<string, unknown>;
  if (queue.version !== 1) errors.push('version must be 1');
  if (!Array.isArray(queue.items)) {
    errors.push('items must be an array');
  } else {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    queue.items.forEach((item, index) => {
      validateItem(item, index, errors);
      if (typeof item === 'object' && item !== null) {
        const record = item as Record<string, unknown>;
        if (typeof record.id === 'string' && ids.has(record.id))
          errors.push(`duplicate id: ${record.id}`);
        if (typeof record.id === 'string') ids.add(record.id);
        if (typeof record.slug === 'string' && slugs.has(record.slug))
          errors.push(`duplicate slug: ${record.slug}`);
        if (typeof record.slug === 'string') slugs.add(record.slug);
      }
    });
  }
  if (errors.length > 0) throw new ValidationError(errors.join('; '));
  return value as ArticleQueue;
}

function wordCount(value: string): number {
  return value.trim() === '' ? 0 : value.trim().split(/\s+/u).length;
}

function hasIndonesianProse(value: string): boolean {
  const markers = new Set(
    value
      .toLocaleLowerCase('id-ID')
      .match(
        /\b(?:yang|dan|untuk|dengan|dalam|ini|dapat|tidak|akan|pada|dari|atau|sebagai|karena|oleh|lebih|jika|juga)\b/gu,
      ),
  );
  return markers.size >= 4;
}

export function validateGeneratedArticle(
  value: unknown,
  item?: ArticleQueueItem,
): GeneratedArticle {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ValidationError('model output must be an object');
  }
  const output = value as Record<string, unknown>;
  const keys = Object.keys(output).sort();
  if (keys.length !== 2 || keys[0] !== 'body' || keys[1] !== 'excerpt') {
    throw new ValidationError('model output must contain only excerpt and body');
  }
  if (!recordString(output.excerpt, 'excerpt', []))
    throw new ValidationError('excerpt must be a non-empty string');
  if (!recordString(output.body, 'body', []))
    throw new ValidationError('body must be a non-empty string');

  const body = output.body as string;
  if (wordCount(body) < 1200)
    throw new ValidationError('body must contain at least 1,200 words');
  if (!hasIndonesianProse(`${output.excerpt as string}\n${body}`))
    throw new ValidationError('body must be written in Indonesian prose');
  const mainSections = body.match(/^##\s+[^#].*$/gim) ?? [];
  if (mainSections.length < 4 || mainSections.length > 7) {
    throw new ValidationError('body must contain 4 to 7 main sections');
  }
  if (
    !/^##\s+(?:Contoh Praktis|Contoh|Praktik)\b/im.test(body) &&
    !/contoh praktis/i.test(body)
  ) {
    throw new ValidationError('body must include practical examples');
  }
  if (!/^##\s+Kesimpulan\b/im.test(body))
    throw new ValidationError('body must include a conclusion');
  if (/^\s*(?:import|export)\s+/m.test(body))
    throw new ValidationError('body must not contain import or export');
  if (/<\/?[A-Za-z][^>]*>/u.test(body))
    throw new ValidationError('body must not contain executable HTML or MDX');
  if (/\{(?:[^{}]|\{[^{}]*\})*\}/u.test(body))
    throw new ValidationError('body must not contain executable MDX expressions');
  if (/<\s*>|<\s*\/\s*>/u.test(body))
    throw new ValidationError('body must not contain JSX fragments');
  if (/^##\s+Sources\b/im.test(body))
    throw new ValidationError('body must not contain a Sources section');
  if (
    item &&
    item.practicalExamples.length > 0 &&
    !/contoh|praktik|implementasi/i.test(body)
  ) {
    throw new ValidationError('body must include a practical implementation');
  }
  return { excerpt: output.excerpt as string, body };
}
