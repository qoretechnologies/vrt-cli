import { describe, expect, it } from 'vitest';
import {
  makeCaptureOptions,
  parseViewport,
} from '../../src/commands/capture.js';

describe('capture options helpers', () => {
  it('parses viewport strings', () => {
    expect(parseViewport('800x600')).toEqual({ width: 800, height: 600 });
  });

  it('throws on invalid viewport', () => {
    expect(() => parseViewport('oops')).toThrow(/viewport/i);
  });

  it('builds options with defaults', () => {
    const options = makeCaptureOptions({});
    expect(options.url).toBe('http://localhost:6006');
    expect(options.outDir).toBe('./.vrt');
    expect(options.concurrency).toBe(4);
    expect(options.timeout).toBe(30000);
    expect(options.viewport).toEqual({ width: 1280, height: 720 });
    expect(options.waitBeforeScreenshot).toBe(200);
    expect(options.headless).toBe(true);
  });

  it('applies headful flag and includes/excludes', () => {
    const options = makeCaptureOptions({
      headful: true,
      include: ['foo'],
      exclude: ['bar'],
      viewport: '1024x768',
    });
    expect(options.headless).toBe(false);
    expect(options.include).toEqual(['foo']);
    expect(options.exclude).toEqual(['bar']);
    expect(options.viewport).toEqual({ width: 1024, height: 768 });
  });
});
