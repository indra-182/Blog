import { describe, expect, it } from 'vitest';
import {
  loadQueue,
  selectNextPending,
  validateQueue,
} from '@/lib/article-generation/queue';
import { validateGeneratedArticle } from '@/lib/article-generation/validation';
import { renderArticle } from '@/lib/article-generation/renderer';
import { generateNextArticle } from '@/lib/article-generation/generator';
import { GitHubModelsAdapter } from '@/lib/article-generation/model';
import { collectExistingPostSlugs } from '@/lib/article-generation/content';
import { generateWithRetry, ModelAdapterError } from '@/lib/article-generation/model';
import type {
  ArticleGenerationFileSystem,
  ModelAdapter,
} from '@/lib/article-generation/types';
import type { ArticleQueue } from '@/lib/article-generation/types';

const validQueue = (): ArticleQueue => ({
  version: 1,
  items: [
    {
      id: 'article-001',
      slug: 'membangun-agent-deterministik',
      title: 'Membangun Agent Deterministik',
      date: '2026-08-03',
      editorial: {
        audience: 'Pengembang aplikasi',
        angle: 'Membuat agent yang mudah diuji dan dipahami',
        tone: 'Praktis dan jernih',
      },
      category: 'agentic-ai',
      tags: ['agent', 'ai', 'tutorial'],
      sectionBriefs: [
        'Jelaskan determinisme pada workflow agent.',
        'Bandingkan keputusan agent yang dapat dilacak.',
        'Bahas batasan dan trade-off.',
        'Rangkum langkah implementasi.',
      ],
      practicalExamples: [
        'Pipeline klasifikasi tiket dukungan dengan hasil yang dapat diaudit.',
      ],
      sources: [
        {
          title: 'Dokumentasi Python',
          url: 'https://docs.python.org/3/library/dataclasses.html',
          note: 'Dataclass membantu memodelkan data terstruktur secara eksplisit.',
        },
      ],
      status: 'pending',
      attempts: 0,
      lastError: null,
    },
  ],
});

const validGeneratedArticle = () => ({
  excerpt: 'Panduan praktis untuk membangun agent yang dapat ditelusuri.',
  body: [
    '## Gambaran Masalah',
    'Bahasa Indonesia membantu pembaca memahami konteks dan keputusan teknis dengan jelas.',
    '## Langkah Implementasi',
    'Mulai dengan state kecil, aturan yang eksplisit, serta pengujian terhadap input yang stabil.',
    '## Contoh Praktis',
    'Contoh praktisnya adalah pipeline klasifikasi tiket yang menyimpan alasan setiap keputusan.',
    '## Batasan dan Trade-off',
    'Pendekatan ini mengurangi kejutan tetapi membutuhkan disiplin saat menambah aturan baru.',
    '## Kesimpulan',
    'Kesimpulannya, determinisme membuat agent lebih mudah diaudit dan dirawat.',
    Array.from({ length: 1180 }, (_, index) => `catatan-${index + 1}`).join(' '),
  ].join('\n\n'),
});

describe('loadQueue and validateQueue', () => {
  it('loads and validates an ordered queue fixture', () => {
    const queue = validQueue();

    expect(validateQueue(queue)).toEqual(queue);
    expect(loadQueue(JSON.stringify(queue))).toEqual(queue);
  });

  it('loads the checked-in queue fixture with all items pending', () => {
    const queue = loadQueue();

    expect(queue.items.map((item) => item.status)).toEqual(['pending', 'pending']);
    expect(queue.items.map((item) => item.id)).toEqual(['article-001', 'article-002']);
  });

  it.each([
    ['duplicate ids', (queue: ArticleQueue) => (queue.items[1] = { ...queue.items[0] })],
    [
      'duplicate slugs',
      (queue: ArticleQueue) =>
        (queue.items[1] = { ...queue.items[0], id: 'article-002' }),
    ],
    ['invalid slug', (queue: ArticleQueue) => (queue.items[0].slug = 'Not A Slug')],
    [
      'missing source note',
      (queue: ArticleQueue) => (queue.items[0].sources[0].note = ''),
    ],
    [
      'unsafe source URL',
      (queue: ArticleQueue) =>
        (queue.items[0].sources[0].url = 'http://localhost:3000/fact'),
    ],
    [
      'unknown status',
      (queue: ArticleQueue) => (queue.items[0].status = 'queued' as never),
    ],
  ])('rejects %s', (_name, mutate) => {
    const queue = validQueue();
    queue.items.push({ ...queue.items[0], id: 'article-002', slug: 'artikel-kedua' });
    mutate(queue);

    expect(() => validateQueue(queue)).toThrow();
  });

  it('selects the first pending item without changing queue order', () => {
    const queue = validQueue();
    queue.items.push(
      {
        ...queue.items[0],
        id: 'article-002',
        slug: 'artikel-terbit',
        status: 'published',
      },
      { ...queue.items[0], id: 'article-003', slug: 'artikel-kedua' },
    );

    expect(selectNextPending(queue)?.id).toBe('article-001');
    expect(queue.items.map(({ id }) => id)).toEqual([
      'article-001',
      'article-002',
      'article-003',
    ]);
  });
});

describe('validateGeneratedArticle', () => {
  it('accepts a long Indonesian article with practical examples and a conclusion', () => {
    expect(
      validateGeneratedArticle(validGeneratedArticle(), validQueue().items[0]),
    ).toEqual(validGeneratedArticle());
  });

  it.each([
    ['extra metadata', { title: 'Tidak boleh' }],
    ['too short', { body: '## Satu\n## Dua\n## Contoh Praktis\n## Kesimpulan' }],
    [
      'non-Indonesian prose',
      {
        body: validGeneratedArticle().body.replace(
          /Bahasa Indonesia|membantu|pembaca|memahami|konteks|keputusan|teknis|dengan|jelas|yang|dan|untuk|dalam|ini|dapat|tidak|akan|pada|dari|atau|sebagai|karena|oleh|lebih|jika|juga/gi,
          'technical systems produce reliable outputs',
        ),
      },
    ],
    [
      'too few sections',
      { body: '## Contoh Praktis\n## Kesimpulan ' + 'kata '.repeat(1200) },
    ],
    [
      'missing practical examples',
      {
        body: validGeneratedArticle()
          .body.replace('## Contoh Praktis', '## Detail Teknis')
          .replace('Contoh praktisnya adalah', 'Rincian teknisnya adalah'),
      },
    ],
    [
      'missing conclusion',
      { body: validGeneratedArticle().body.replace('## Kesimpulan', '## Penutup') },
    ],
    [
      'executable MDX',
      {
        body: validGeneratedArticle().body.replace(
          '## Gambaran Masalah',
          'import Thing from "thing"\n\n## Gambaran Masalah',
        ),
      },
    ],
    [
      'raw HTML',
      {
        body: validGeneratedArticle().body.replace(
          '## Gambaran Masalah',
          '<script>alert(1)</script>\n\n## Gambaran Masalah',
        ),
      },
    ],
    [
      'executable MDX brace expression',
      {
        body: validGeneratedArticle().body.replace(
          '## Gambaran Masalah',
          '{process.env.SECRET}\n\n## Gambaran Masalah',
        ),
      },
    ],
    [
      'JSX fragment',
      {
        body: validGeneratedArticle().body.replace(
          '## Gambaran Masalah',
          '<>Tidak aman</>\n\n## Gambaran Masalah',
        ),
      },
    ],
    [
      'existing Sources section',
      { body: validGeneratedArticle().body.replace('## Kesimpulan', '## Sources') },
    ],
  ])('rejects %s', (_name, override) => {
    const output = { ...validGeneratedArticle(), ...override };

    expect(() => validateGeneratedArticle(output, validQueue().items[0])).toThrow();
  });
});

describe('renderArticle', () => {
  it('renders queue-controlled frontmatter and appends stored source notes', () => {
    const item = validQueue().items[0];
    const rendered = renderArticle(item, validGeneratedArticle());

    expect(rendered).toContain('title: "Membangun Agent Deterministik"');
    expect(rendered).toContain('type: article');
    expect(rendered).toContain('draft: false');
    expect(rendered).toContain('slug: membangun-agent-deterministik');
    expect(rendered).toContain('## Sources');
    expect(rendered).toContain(
      '[Dokumentasi Python](https://docs.python.org/3/library/dataclasses.html)',
    );
    expect(rendered).toContain(
      'Dataclass membantu memodelkan data terstruktur secara eksplisit.',
    );
  });
});

class MemoryFileSystem implements ArticleGenerationFileSystem {
  files = new Map<string, string>();
  failRenameTo?: string;

  readFileSync(path: string): string {
    const value = this.files.get(path);
    if (value === undefined) throw new Error(`missing file: ${path}`);
    return value;
  }

  writeFileSync(path: string, data: string): void {
    this.files.set(path, data);
  }

  renameSync(from: string, to: string): void {
    if (to === this.failRenameTo) throw new Error(`cannot commit ${to}`);
    const value = this.files.get(from);
    if (value === undefined) throw new Error(`missing temp file: ${from}`);
    this.files.set(to, value);
    this.files.delete(from);
  }

  unlinkSync(path: string): void {
    this.files.delete(path);
  }

  existsSync(path: string): boolean {
    return this.files.has(path);
  }
}

const makeGenerator = (
  overrides: Partial<Parameters<typeof generateNextArticle>[0]> = {},
) => {
  const queue = validQueue();
  const fs = new MemoryFileSystem();
  const queuePath = '/queue.json';
  fs.files.set(queuePath, `${JSON.stringify(queue)}\n`);
  const model: ModelAdapter = { generate: async () => validGeneratedArticle() };
  return {
    fs,
    queue,
    queuePath,
    options: {
      fs,
      queuePath,
      postsDirectory: '/posts',
      model,
      existingSlugs: [],
      now: () => '2026-08-03',
      ...overrides,
    },
  };
};

describe('generateNextArticle', () => {
  it('returns an empty result without calling the model when the queue has no pending item', async () => {
    const setup = makeGenerator({
      model: {
        generate: async () => {
          throw new Error('must not call model');
        },
      },
    });
    setup.fs.files.set(setup.queuePath, JSON.stringify({ version: 1, items: [] }));

    await expect(generateNextArticle(setup.options)).resolves.toMatchObject({
      kind: 'empty',
    });
  });

  it('publishes the first pending item with injected model and filesystem', async () => {
    const setup = makeGenerator();

    const result = await generateNextArticle(setup.options);

    expect(result.slug).toBe('membangun-agent-deterministik');
    expect(setup.fs.files.get('/posts/membangun-agent-deterministik.mdx')).toContain(
      'draft: false',
    );
    expect(JSON.parse(setup.fs.files.get(setup.queuePath) ?? '{}').items[0].status).toBe(
      'published',
    );
  });

  it('rejects an existing slug before asking the model to generate', async () => {
    let called = false;
    const contentFiles = new Map([
      [
        'draft.mdx',
        '---\nslug: membangun-agent-deterministik\ndraft: true\n---\n\n# Draft',
      ],
    ]);
    const existingSlugs = collectExistingPostSlugs('/posts', {
      readdirSync: () => [{ name: 'draft.mdx', isFile: () => true }],
      readFileSync: (path: string) => contentFiles.get(path.split('/').pop() ?? '') ?? '',
    });
    const setup = makeGenerator({
      existingSlugs,
      model: {
        generate: async () => {
          called = true;
          return validGeneratedArticle();
        },
      },
    });

    await expect(generateNextArticle(setup.options)).rejects.toThrow(/collision/i);
    expect(called).toBe(false);
    expect(JSON.parse(setup.fs.files.get(setup.queuePath) ?? '{}').items[0].status).toBe(
      'pending',
    );
  });

  it('rejects a collision with an existing post file', async () => {
    const setup = makeGenerator();
    setup.fs.files.set('/posts/membangun-agent-deterministik.mdx', 'existing article');

    await expect(generateNextArticle(setup.options)).rejects.toThrow(/collision/i);
    expect(setup.fs.files.get('/posts/membangun-agent-deterministik.mdx')).toBe(
      'existing article',
    );
  });

  it('prompts the adapter in Indonesian with queue-controlled editorial requirements', async () => {
    let prompt = '';
    const setup = makeGenerator({
      model: {
        generate: async (value) => {
          prompt = value;
          return validGeneratedArticle();
        },
      },
    });

    await generateNextArticle(setup.options);

    expect(prompt).toContain('Bahasa Indonesia');
    expect(prompt).toContain('1.200 kata');
    expect(prompt).toContain('Jangan mengubah atau mengembalikan title');
    expect(prompt).toContain('Contoh praktis yang wajib dijelaskan');
  });

  it('leaves the queue pending when the adapter fails', async () => {
    const setup = makeGenerator({
      model: {
        generate: async () => {
          throw new Error('adapter unavailable');
        },
      },
    });
    const originalQueue = setup.fs.files.get(setup.queuePath);

    await expect(generateNextArticle(setup.options)).rejects.toThrow(
      'adapter unavailable',
    );
    expect(setup.fs.files.get(setup.queuePath)).toBe(originalQueue);
    expect(setup.fs.files.has('/posts/membangun-agent-deterministik.mdx')).toBe(false);
  });

  it('rolls back the article when queue commit fails', async () => {
    const setup = makeGenerator();
    setup.fs.failRenameTo = setup.queuePath;

    await expect(generateNextArticle(setup.options)).rejects.toThrow(/commit/);
    expect(setup.fs.files.has('/posts/membangun-agent-deterministik.mdx')).toBe(false);
    expect(JSON.parse(setup.fs.files.get(setup.queuePath) ?? '{}').items[0].status).toBe(
      'pending',
    );
  });
});

describe('collectExistingPostSlugs', () => {
  it('collects filename and explicit frontmatter slugs, including drafts', () => {
    const files = new Map([
      [
        'published.mdx',
        '---\nslug: explicitly-published\ndraft: false\n---\n\n# Published',
      ],
      [
        'draft-file-name.mdx',
        '---\nslug: explicitly-drafted\ndraft: true\n---\n\n# Draft',
      ],
      ['ignored.txt', 'slug: should-not-count'],
    ]);
    const fileSystem = {
      readdirSync: () => [...files.keys()].map((name) => ({ name, isFile: () => true })),
      readFileSync: (path: string) => files.get(path.split('/').pop() ?? '') ?? '',
    };

    expect(collectExistingPostSlugs('/posts', fileSystem)).toEqual([
      'published',
      'explicitly-published',
      'draft-file-name',
      'explicitly-drafted',
    ]);
  });
});

describe('GitHubModelsAdapter', () => {
  it('uses the exact GitHub Models id and returns only model article fields', async () => {
    let request: RequestInit | undefined;
    const adapter = new GitHubModelsAdapter({
      token: 'test-token',
      fetchImpl: async (_input, init) => {
        request = init;
        return new Response(
          JSON.stringify({
            choices: [{ message: { content: JSON.stringify(validGeneratedArticle()) } }],
          }),
        );
      },
    });

    const output = await adapter.generate('Tulis artikel ini dalam Bahasa Indonesia.');
    const payload = JSON.parse(String(request?.body));

    expect(payload.model).toBe('openai/gpt-4o-mini');
    expect(output).toEqual(validGeneratedArticle());
  });
});

describe('generateWithRetry', () => {
  it('retries transient errors at most twice and does not retry quota failures', async () => {
    let transientCalls = 0;
    const transient = {
      generate: async () => {
        transientCalls += 1;
        if (transientCalls < 3) {
          throw new ModelAdapterError('temporary', { retryable: true });
        }
        return { excerpt: 'ok', body: 'ok' };
      },
    };
    await expect(
      generateWithRetry(transient, 'prompt', { sleep: async () => undefined }),
    ).resolves.toEqual({ excerpt: 'ok', body: 'ok' });
    expect(transientCalls).toBe(3);

    let quotaCalls = 0;
    const quota = {
      generate: async () => {
        quotaCalls += 1;
        throw new ModelAdapterError('quota', { quota: true });
      },
    };
    await expect(
      generateWithRetry(quota, 'prompt', { sleep: async () => undefined }),
    ).rejects.toThrow('quota');
    expect(quotaCalls).toBe(1);
  });
});
