import { describe, expect, it } from 'vitest';
import { resolveQlipOptions } from '../../src/config/parameters.js';

describe('resolveQlipOptions', () => {
  it('prefers explicit overrides over story params and defaults', () => {
    const resolved = resolveQlipOptions({
      defaults: {
        outputDir: './qlip/screenshots',
        viewport: { width: 1200, height: 800 },
        skip: false,
      },
      story: {
        skip: true,
        viewport: { width: 800, height: 600 },
      },
      override: {
        skip: false,
        viewport: { width: 640, height: 480 },
      },
    });

    expect(resolved).toEqual({
      skip: false,
      viewport: { width: 640, height: 480 },
    });
  });

  it('falls back to story params when overrides are missing', () => {
    const resolved = resolveQlipOptions({
      defaults: {
        outputDir: './qlip/screenshots',
        viewport: { width: 1200, height: 800 },
        skip: false,
      },
      story: {
        skip: true,
        viewport: { width: 800, height: 600 },
      },
    });

    expect(resolved).toEqual({
      skip: true,
      viewport: { width: 800, height: 600 },
    });
  });

  it('uses defaults when no overrides or story params are present', () => {
    const resolved = resolveQlipOptions({
      defaults: {
        outputDir: './qlip/screenshots',
        viewport: { width: 1200, height: 800 },
        skip: false,
      },
    });

    expect(resolved).toEqual({
      skip: false,
      viewport: { width: 1200, height: 800 },
    });
  });
});
