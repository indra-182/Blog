import type { ModelAdapter } from './types';

export const ARTICLE_MODEL_ID = 'openai/gpt-4o-mini';
const DEFAULT_ENDPOINT = 'https://models.github.ai/inference/chat/completions';

interface GitHubModelsAdapterOptions {
  token?: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
}

export class ModelAdapterError extends Error {
  readonly retryable: boolean;
  readonly quota: boolean;
  readonly retryAfterMs?: number;

  constructor(
    message: string,
    options: { retryable?: boolean; quota?: boolean; retryAfterMs?: number } = {},
  ) {
    super(message);
    this.name = 'ModelAdapterError';
    this.retryable = options.retryable ?? false;
    this.quota = options.quota ?? false;
    this.retryAfterMs = options.retryAfterMs;
  }
}

export class GitHubModelsAdapter implements ModelAdapter {
  private readonly token: string;
  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: GitHubModelsAdapterOptions = {}) {
    this.token = options.token ?? process.env.GITHUB_TOKEN ?? '';
    this.endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async generate(prompt: string): Promise<unknown> {
    if (this.token === '') throw new Error('GITHUB_TOKEN is required');
    let response: Response;
    try {
      response = await this.fetchImpl(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ARTICLE_MODEL_ID,
          temperature: 0,
          max_tokens: 3_000,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'Anda adalah penulis teknis Indonesia. Kembalikan JSON valid yang hanya memiliki kunci excerpt dan body.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      });
    } catch {
      throw new ModelAdapterError('GitHub Models network request failed', {
        retryable: true,
      });
    }
    if (!response.ok) {
      const details = await response.text().catch(() => '');
      const quota =
        response.status === 402 ||
        response.status === 403 ||
        /quota|billing|paid usage|exhausted/i.test(details);
      const retryableStatus = [408, 425, 429, 500, 502, 503, 504].includes(
        response.status,
      );
      const retryAfter = Number(response.headers.get('retry-after'));
      throw new ModelAdapterError(`GitHub Models request failed: ${response.status}`, {
        retryable: !quota && retryableStatus,
        quota,
        retryAfterMs: Number.isFinite(retryAfter)
          ? Math.min(retryAfter * 1000, 30_000)
          : undefined,
      });
    }
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== 'string')
      throw new Error('GitHub Models returned no article content');
    const normalized = content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/u, '')
      .trim();
    try {
      return JSON.parse(normalized) as unknown;
    } catch {
      throw new Error('GitHub Models returned invalid article JSON');
    }
  }
}

export async function generateWithRetry(
  model: ModelAdapter,
  prompt: string,
  options: { maxAttempts?: number; sleep?: (milliseconds: number) => Promise<void> } = {},
): Promise<unknown> {
  const maxAttempts = Math.max(1, Math.min(options.maxAttempts ?? 3, 3));
  const sleep =
    options.sleep ??
    ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await model.generate(prompt);
    } catch (error) {
      if (
        !(error instanceof ModelAdapterError) ||
        !error.retryable ||
        attempt === maxAttempts
      ) {
        throw error;
      }
      await sleep(error.retryAfterMs ?? Math.min(2_000, 500 * 2 ** (attempt - 1)));
    }
  }

  throw new Error('model retry loop exhausted');
}
