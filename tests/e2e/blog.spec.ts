import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('blog reading path', () => {
  test('API exposes article types and returns an empty curation query', async ({ request }) => {
    const articleResponse = await request.get('/api/posts?type=article');
    expect(articleResponse.status()).toBe(200);
    const articles = (await articleResponse.json()) as {
      data: { type: string }[];
      meta: { total: number };
    };

    expect(articles.meta.total).toBeGreaterThan(0);
    expect(articles.data.every((post) => post.type === 'article')).toBe(true);

    const curationResponse = await request.get('/api/posts?type=curation');
    expect(curationResponse.status()).toBe(200);
    const curations = (await curationResponse.json()) as {
      data: unknown[];
      meta: { total: number; hasNextPage: boolean };
    };

    expect(curations.data).toEqual([]);
    expect(curations.meta).toMatchObject({ total: 0, hasNextPage: false });
  });

  test('retired curation URLs permanently redirect to the homepage', async ({ request }) => {
    const retiredSlugs = [
      'frontend-digest-25-jul-2026',
      'frontend-digest-2026-07-26',
      'frontend-digest-2026-07-28',
    ];

    for (const slug of retiredSlugs) {
      const response = await request.get(`/posts/${slug}`, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(new URL(response.headers().location ?? '/', 'http://blog.test').pathname).toBe(
        '/',
      );
    }
  });

  test('home leads with a readable post and exposes RSS', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /Baca tulisan/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'RSS' })).toHaveAttribute(
      'href',
      '/rss.xml',
    );
  });

  test('category navigation keeps taxonomy values and invalid routes remain not found', async ({
    page,
  }) => {
    await page.goto('/categories');
    await expect(
      page.getByRole('heading', { level: 1, name: /Kategori tulisan/i }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /agentic-ai/i }).first()).toBeVisible();

    await page.goto('/category/agentic-ai');
    await expect(
      page.getByRole('heading', { level: 1, name: /Kategori: agentic-ai/i }),
    ).toBeVisible();

    const response = await page.goto('/category/tidak-ada', { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { level: 1, name: /tidak ditemukan/i }),
    ).toBeVisible();
  });

  test('theme toggle changes the document and persists the public theme key', async ({
    page,
  }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /Ganti ke mode/i });
    await expect(toggle).toBeVisible();
    const before = await page.locator('html').getAttribute('class');
    await toggle.click();
    const after = await page.locator('html').getAttribute('class');

    expect(after).not.toBe(before);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toMatch(
      /^(light|dark)$/,
    );
  });

  test('navigation controls expose pointer cursors', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /Cari$/i })).toHaveCSS(
      'cursor',
      'pointer',
    );
    await expect(page.getByRole('button', { name: /Ganti ke mode/i })).toHaveCSS(
      'cursor',
      'pointer',
    );
  });

  test('global search opens, finds a post, and restores focus when closed', async ({
    page,
  }) => {
    await page.goto('/');
    const searchTrigger = page.getByRole('button', { name: /Cari$/i });
    await searchTrigger.click();
    const dialog = page.getByRole('dialog', { name: 'Cari tulisan' });
    await expect(dialog).toBeVisible();

    const input = page.getByRole('searchbox', { name: 'Cari tulisan' });
    await input.fill('LangGraph');
    await expect(
      dialog.getByRole('link', { name: /Memulai Petualangan dengan LangGraph/i }),
    ).toBeVisible();
    await input.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(searchTrigger).toBeFocused();
  });

  test('search error exposes a retry action', async ({ page }) => {
    await page.route('**/search-index.json', (route) => route.abort());
    await page.goto('/');
    await page.getByRole('button', { name: /Cari$/i }).click();
    const dialog = page.getByRole('dialog', { name: 'Cari tulisan' });
    await expect(dialog.getByText(/belum bisa dimuat/i)).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Coba lagi/i })).toBeVisible();
  });
});

test.describe('accessibility and responsive floor', () => {
  test('homepage has no axe violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('mobile layout stays within the viewport and respects reduced motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/posts/memulai-langgraph');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe('auto');
  });

  test('named homepage snapshots cover desktop and mobile reading surfaces', async ({
    page,
  }, testInfo) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot(`${testInfo.project.name}-home.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
