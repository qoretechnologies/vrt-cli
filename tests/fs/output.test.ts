import { describe, expect, it } from 'vitest';
import {
  buildAutoScreenshotPath,
  buildManualScreenshotPath,
  generateBuildId,
  sanitizeSegment,
} from '../../src/fs/output.js';

describe('output helpers', () => {
  it('generates buildId from local time', () => {
    const date = new Date(2025, 0, 2, 3, 4, 5);
    expect(generateBuildId(date)).toBe('20250102-030405');
  });

  it('sanitizes filename segments', () => {
    expect(sanitizeSegment('Example/Page:Logged In')).toBe(
      'Example_Page_Logged_In',
    );
  });

  it('builds auto screenshot paths', () => {
    const pathInfo = buildAutoScreenshotPath({
      buildDir: '/tmp/qlip/20250102-030405',
      storyId: 'example--page',
    });

    expect(pathInfo.relativePath).toBe('stories/example--page.png');
    expect(pathInfo.absolutePath).toBe(
      '/tmp/qlip/20250102-030405/stories/example--page.png',
    );
  });

  it('builds manual screenshot paths', () => {
    const pathInfo = buildManualScreenshotPath({
      buildDir: '/tmp/qlip/20250102-030405',
      storyId: 'example--page',
      screenshotName: 'after-login',
    });

    expect(pathInfo.relativePath).toBe(
      'stories/example--page/after-login.png',
    );
    expect(pathInfo.absolutePath).toBe(
      '/tmp/qlip/20250102-030405/stories/example--page/after-login.png',
    );
  });
});
