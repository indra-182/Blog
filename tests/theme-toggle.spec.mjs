import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

const PORT = 3458;
let server;

function startServer() {
  return new Promise((resolve, reject) => {
    server = spawn('npx', ['next', 'dev', '-p', String(PORT)], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' },
    });
    let started = false;
    const onData = (data) => {
      const text = data.toString();
      if (!started && text.includes('localhost:' + PORT)) {
        started = true;
        resolve();
      }
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
    setTimeout(() => {
      if (!started) reject(new Error('Server start timeout'));
    }, 60000);
  });
}

async function run() {
  await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();

  try {
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'load', timeout: 60000 });
    const toggle = page.locator('button[aria-label*="Ganti ke mode"]');
    await toggle.waitFor({ state: 'visible', timeout: 10000 });
    await sleep(500);

    // Check initial, after click 1, after click 2
    const getState = () =>
      page.evaluate(() => ({
        className: document.documentElement.className,
        label:
          document
            .querySelector('button[aria-label*="Ganti ke mode"]')
            ?.getAttribute('aria-label') ?? '',
      }));

    const initial = await getState();
    const initialDark = initial.className.includes('dark');

    await toggle.click();
    await sleep(400);
    const after1 = await getState();
    const darkAfter1 = after1.className.includes('dark');

    await toggle.click();
    await sleep(400);
    const after2 = await getState();
    const darkAfter2 = after2.className.includes('dark');

    // Both clicks MUST change the visual state
    const firstChanged = initialDark !== darkAfter1;
    const secondChanged = darkAfter1 !== darkAfter2;

    console.log('initial dark?', initialDark, '| label:', initial.label);
    console.log('after #1 dark?', darkAfter1, '| label:', after1.label);
    console.log('after #2 dark?', darkAfter2, '| label:', after2.label);
    console.log(
      'first click changed?',
      firstChanged,
      '| second click changed?',
      secondChanged,
    );

    if (!firstChanged) {
      console.error('FAIL: first click did not change visual state');
      process.exit(1);
    }
    if (!secondChanged) {
      console.error('FAIL: second click did not change visual state');
      process.exit(1);
    }
    console.log('PASS: both clicks toggle correctly');
  } finally {
    await browser.close();
    server.kill();
  }
}

run().catch((err) => {
  console.error('FAIL:', err.message);
  if (server) server.kill();
  process.exit(1);
});
