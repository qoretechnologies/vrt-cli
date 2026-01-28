import { describe, expect, it } from 'vitest';
import {
  AUTO_ERROR_SCREENSHOT_BASE,
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
      storyTitle: 'Example/Page',
      storyName: 'Logged In',
    });

    expect(pathInfo.relativePath).toBe(
      'stories/auto/Example_Page--Logged_In.png',
    );
    expect(pathInfo.absolutePath).toBe(
      '/tmp/qlip/20250102-030405/stories/auto/Example_Page--Logged_In.png',
    );
  });

  it('builds auto paths from storyId when title is missing', () => {
    const pathInfo = buildAutoScreenshotPath({
      buildDir: '/tmp/qlip/20250102-030405',
      storyId: 'example-button--primary',
    });

    expect(pathInfo.relativePath).toBe(
      'stories/auto/example-button--primary.png',
    );
    expect(pathInfo.absolutePath).toBe(
      '/tmp/qlip/20250102-030405/stories/auto/example-button--primary.png',
    );
  });

  it('builds manual screenshot paths', () => {
    const pathInfo = buildManualScreenshotPath({
      buildDir: '/tmp/qlip/20250102-030405',
      storyId: 'example--page',
      storyTitle: 'Example/Page',
      storyName: 'Logged In',
      screenshotName: 'after-login',
    });

    expect(pathInfo.relativePath).toBe(
      'stories/manual/Example_Page--Logged_In--after-login.png',
    );
    expect(pathInfo.absolutePath).toBe(
      '/tmp/qlip/20250102-030405/stories/manual/Example_Page--Logged_In--after-login.png',
    );
  });

  it('routes error screenshots to the error folder', () => {
    const pathInfo = buildManualScreenshotPath({
      buildDir: '/tmp/qlip/20250102-030405',
      storyId: 'example-button--primary',
      screenshotName: AUTO_ERROR_SCREENSHOT_BASE,
    });

    expect(pathInfo.relativePath).toBe(
      `stories/error/example-button--primary--${AUTO_ERROR_SCREENSHOT_BASE}.png`,
    );
    expect(pathInfo.absolutePath).toBe(
      `/tmp/qlip/20250102-030405/stories/error/example-button--primary--${AUTO_ERROR_SCREENSHOT_BASE}.png`,
    );
  });
});
