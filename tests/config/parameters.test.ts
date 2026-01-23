import { describe, expect, it } from 'vitest';
import { resolveQlipOptions } from '../../src/config/parameters.js';

describe('resolveQlipOptions', () => {
  it('prefers explicit overrides over story params and defaults', () => {
    const resolved = resolveQlipOptions({
      defaults: {
        outputDir: './qlip/screenshots',
        viewport: { width: 1200, height: 800 },
        skip: false,
        disableAnimations: false,
        pauseAnimationsAtEnd: false,
        captureOnError: false,
        waitForIdleMs: 300,
        maxWaitForIdleMs: 2000,
        ignoreElements: [],
      },
      story: {
        skip: true,
        viewport: { width: 800, height: 600 },
        disableAnimations: true,
        pauseAnimationsAtEnd: true,
        waitForIdleMs: 500,
        maxWaitForIdleMs: 4000,
        ignoreElements: ['.story-mask'],
      },
      override: {
        skip: false,
        viewport: { width: 640, height: 480 },
        disableAnimations: false,
        pauseAnimationsAtEnd: false,
        waitForIdleMs: 100,
        maxWaitForIdleMs: 800,
        ignoreElements: ['[data-testid="mask"]'],
      },
    });

    expect(resolved).toEqual({
      skip: false,
      viewport: { width: 640, height: 480 },
      disableAnimations: false,
      pauseAnimationsAtEnd: false,
      waitForIdleMs: 100,
      maxWaitForIdleMs: 800,
      ignoreElements: ['[data-testid="mask"]'],
    });
  });

  it('falls back to story params when overrides are missing', () => {
    const resolved = resolveQlipOptions({
      defaults: {
        outputDir: './qlip/screenshots',
        viewport: { width: 1200, height: 800 },
        skip: false,
        disableAnimations: false,
        pauseAnimationsAtEnd: false,
        captureOnError: false,
        waitForIdleMs: 300,
        maxWaitForIdleMs: 2000,
        ignoreElements: [],
      },
      story: {
        skip: true,
        viewport: { width: 800, height: 600 },
        disableAnimations: true,
        pauseAnimationsAtEnd: true,
        waitForIdleMs: 500,
        maxWaitForIdleMs: 4000,
        ignoreElements: ['.story-mask'],
      },
    });

    expect(resolved).toEqual({
      skip: true,
      viewport: { width: 800, height: 600 },
      disableAnimations: true,
      pauseAnimationsAtEnd: true,
      waitForIdleMs: 500,
      maxWaitForIdleMs: 4000,
      ignoreElements: ['.story-mask'],
    });
  });

  it('uses defaults when no overrides or story params are present', () => {
    const resolved = resolveQlipOptions({
      defaults: {
        outputDir: './qlip/screenshots',
        viewport: { width: 1200, height: 800 },
        skip: false,
        disableAnimations: false,
        pauseAnimationsAtEnd: false,
        captureOnError: false,
        waitForIdleMs: 300,
        maxWaitForIdleMs: 2000,
        ignoreElements: [],
      },
    });

    expect(resolved).toEqual({
      skip: false,
      viewport: { width: 1200, height: 800 },
      disableAnimations: false,
      pauseAnimationsAtEnd: false,
      waitForIdleMs: 300,
      maxWaitForIdleMs: 2000,
      ignoreElements: [],
    });
  });
});
