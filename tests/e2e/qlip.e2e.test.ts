import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { expect, test } from 'vitest';

const execFileAsync = promisify(execFile);
const e2e = test.runIf(process.env.QLIP_E2E === '1');

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

e2e('captures auto and manual screenshots with manifest entries', async () => {
  const outputRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'qlip-e2e-'));
  const vitestEntry = path.join(repoRoot, 'node_modules', 'vitest', 'vitest.mjs');

  await execFileAsync(
    process.execPath,
    [
      vitestEntry,
      'run',
      '--config',
      'vitest.config.ts',
      '--project',
      'storybook',
    ],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        QLIP_OUTPUT_DIR: outputRoot,
        QLIP_E2E: '0',
      },
    },
  );

  const buildDirs = (await fs.readdir(outputRoot)).filter(
    (entry) => !entry.startsWith('.'),
  );
  expect(buildDirs.length).toBeGreaterThan(0);

  buildDirs.sort();
  const buildId = buildDirs[buildDirs.length - 1];
  const buildDir = path.join(outputRoot, buildId);
  const manifestPath = path.join(buildDir, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

  const autoEntry = manifest.entries.find(
    (entry: { kind: string; status: string }) =>
      entry.kind === 'auto' && entry.status === 'captured',
  );
  const manualEntry = manifest.entries.find(
    (entry: { kind: string; status: string }) =>
      entry.kind === 'manual' && entry.status === 'captured',
  );

  expect(autoEntry).toBeTruthy();
  expect(manualEntry).toBeTruthy();
  if (!autoEntry || !manualEntry) {
    throw new Error('Expected auto and manual screenshot entries.');
  }

  await fs.access(path.join(buildDir, autoEntry.path));
  await fs.access(path.join(buildDir, manualEntry.path));
});
