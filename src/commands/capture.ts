import path from 'node:path';
import { captureStories } from '../capture/playwrightCapture.js';
import { discoverStories } from '../storybook/discover.js';
import { CaptureOptions, CaptureRun } from '../types.js';

export interface CliCaptureOptions {
  url?: string;
  out?: string;
  concurrency?: number;
  timeout?: number;
  viewport?: string;
  wait?: number;
  headful?: boolean;
  fullPage?: boolean;
  include?: string[];
  exclude?: string[];
  buildId?: string;
}

export const parseViewport = (
  input?: string,
): { width: number; height: number } => {
  if (!input) return { width: 1280, height: 720 };
  const match = input.match(/^(\d+)x(\d+)$/);
  if (!match) {
    throw new Error('Invalid viewport. Use WIDTHxHEIGHT, e.g. 1280x720');
  }
  return { width: Number(match[1]), height: Number(match[2]) };
};

export const makeCaptureOptions = (
  input: CliCaptureOptions,
): CaptureOptions => ({
  url: input.url ?? 'http://localhost:6006',
  outDir: input.out ?? './.vrt',
  buildId: input.buildId,
  concurrency: Math.max(1, input.concurrency ?? 4),
  timeout: input.timeout ?? 30000,
  viewport: parseViewport(input.viewport),
  waitBeforeScreenshot: input.wait ?? 200,
  headless: input.headful ? false : true,
  fullPage: Boolean(input.fullPage),
  include: input.include && input.include.length ? input.include : undefined,
  exclude: input.exclude && input.exclude.length ? input.exclude : undefined,
});

export const runCaptureCommand = async (
  rawOptions: CliCaptureOptions,
  logger: Pick<Console, 'log' | 'error'> = console,
): Promise<{ exitCode: number; run?: CaptureRun }> => {
  const options = makeCaptureOptions(rawOptions);
  const startedAt = Date.now();

  try {
    const discovery = await discoverStories(options.url, {
      timeoutMs: options.timeout,
    });
    const capture = await captureStories({
      baseUrl: discovery.baseUrl,
      stories: discovery.stories,
      options,
    });

    const exitCode = capture.stats.failed === capture.stats.total ? 1 : 0;
    const totalDuration = Date.now() - startedAt;

    logger.log(
      `vrt capture summary: total=${capture.stats.total} captured=${capture.stats.captured} failed=${capture.stats.failed} duration=${totalDuration}ms output=${path.resolve(options.outDir)}`,
    );

    return { exitCode, run: capture };
  } catch (error) {
    const err = error as Error;
    logger.error(`Capture failed: ${err.message}`);
    return { exitCode: 1 };
  }
};
