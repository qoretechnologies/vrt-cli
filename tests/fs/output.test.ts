import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildPaths,
  createManifest,
  generateBuildId,
  sanitizeStoryId,
  writeManifest,
} from '../../src/fs/output.js';

const FIXED_DATE = new Date('2023-01-02T03:04:05Z');

describe('output helpers', () => {
  it('formats build ids deterministically in UTC', () => {
    expect(generateBuildId(FIXED_DATE)).toBe('20230102-030405');
  });

  it('sanitizes story ids for file system safety', () => {
    expect(sanitizeStoryId('component/story:id')).toBe('component_story_id');
    expect(sanitizeStoryId('component story')).toBe('component_story');
  });

  it('builds consistent paths', () => {
    const paths = buildPaths('/tmp/out', '20230102-030405', 'component/story');

    expect(paths.screenshotPath.endsWith('component_story.png')).toBe(true);
    expect(paths.screenshotRelativePath).toBe(
      'screenshots/20230102-030405/component_story.png',
    );
    expect(paths.manifestPath.endsWith('manifest.json')).toBe(true);
  });

  it('writes manifest with stable fields', async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), 'vrt-test-'));
    const buildId = '20230102-030405';
    const paths = buildPaths(tmp, buildId, 'example/story');

    const manifest = createManifest({
      baseUrl: 'http://localhost:6006',
      buildId,
      options: { headless: true } as any,
      stories: [
        {
          storyId: 'example/story',
          title: 'Example',
          name: 'Story',
          url: 'http://localhost:6006/iframe.html?id=example%2Fstory',
          status: 'captured',
          screenshotPath: paths.screenshotRelativePath,
          error: null,
          timings: { ms: 42 },
        },
      ],
      stats: { total: 1, captured: 1, failed: 0, durationMs: 123 },
      createdAt: FIXED_DATE,
    });

    await writeManifest(paths.manifestPath, manifest);

    const saved = JSON.parse(await readFile(paths.manifestPath, 'utf-8'));
    expect(saved.createdAt).toBe('2023-01-02T03:04:05.000Z');
    expect(saved.tool.name).toBe('vrt');
    expect(saved.tool.version).toBeDefined();
    expect(saved.stories[0].screenshotPath).toBe(
      'screenshots/20230102-030405/example_story.png',
    );
  });
});
