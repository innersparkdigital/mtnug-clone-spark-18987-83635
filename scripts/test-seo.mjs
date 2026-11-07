import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

test('all 37 Mind-Check routes get their own raw title, description and actual route canonical', async () => {
  const root = process.cwd();
  const fixture = await mkdtemp(path.join(tmpdir(), 'innerspark-seo-'));
  try {
    await mkdir(path.join(fixture, 'dist'));
    await symlink(path.join(root, 'src'), path.join(fixture, 'src'));
    await symlink(path.join(root, 'public'), path.join(fixture, 'public'));
    await writeFile(path.join(fixture, 'dist/index.html'), await readFile(path.join(root, 'index.html')));
    execFileSync(process.execPath, [path.join(root, 'scripts/prerender.mjs')], { cwd: fixture, stdio: 'pipe' });
    const app = await readFile(path.join(root, 'src/App.tsx'), 'utf8');
    const paths = [...app.matchAll(/path="(\/mind-check\/[^"*:]+)"/g)].map(m => m[1]).filter(p => p !== '/mind-check/analytics');
    assert.equal(paths.length, 37);
    const titles = new Set();
    for (const route of paths) {
      const html = await readFile(path.join(fixture, 'dist', route, 'index.html'), 'utf8');
      const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
      assert.ok(title?.includes('Test'), `${route}: inherited homepage title`);
      assert.ok(!titles.has(title), `${route}: duplicate title`);
      titles.add(title);
      assert.ok(html.includes(`href="https://www.innersparkafrica.com${route}/"`), `${route}: wrong canonical`);
      assert.match(html, /<meta name="description" content="[^"]+"/);
    }
  } finally { await rm(fixture, { recursive: true, force: true }); }
});